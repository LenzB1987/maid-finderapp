import {
  users,
  nannyProfiles,
  parentProfiles,
  bookings,
  reviews,
  messages,
  favorites,
  type User,
  type UpsertUser,
  type NannyProfile,
  type InsertNannyProfile,
  type ParentProfile,
  type InsertParentProfile,
  type Booking,
  type InsertBooking,
  type Review,
  type InsertReview,
  type Message,
  type InsertMessage,
  type Favorite,
  type InsertFavorite,
} from "@shared/schema";
import { db } from "./db";
import { eq, and, or, ilike, desc, asc, sql } from "drizzle-orm";

export interface IStorage {
  // User operations (mandatory for Replit Auth)
  getUser(id: string): Promise<User | undefined>;
  upsertUser(user: UpsertUser): Promise<User>;
  
  // Nanny operations
  createNannyProfile(profile: InsertNannyProfile): Promise<NannyProfile>;
  updateNannyProfile(userId: string, profile: Partial<InsertNannyProfile>): Promise<NannyProfile | undefined>;
  getNannyProfile(userId: string): Promise<NannyProfile | undefined>;
  getNannyProfileWithUser(userId: string): Promise<(NannyProfile & { user: User }) | undefined>;
  searchNannies(filters: {
    district?: string;
    region?: string;
    serviceType?: string;
    minRate?: number;
    maxRate?: number;
    isVerified?: boolean;
    limit?: number;
    offset?: number;
  }): Promise<(NannyProfile & { user: User; avgRating?: number; reviewCount?: number })[]>;
  
  // Parent operations
  createParentProfile(profile: InsertParentProfile): Promise<ParentProfile>;
  updateParentProfile(userId: string, profile: Partial<InsertParentProfile>): Promise<ParentProfile | undefined>;
  getParentProfile(userId: string): Promise<ParentProfile | undefined>;
  
  // Booking operations
  createBooking(booking: InsertBooking): Promise<Booking>;
  updateBooking(id: number, booking: Partial<InsertBooking>): Promise<Booking | undefined>;
  getBooking(id: number): Promise<Booking | undefined>;
  getBookingsByUser(userId: string, role: 'parent' | 'nanny'): Promise<(Booking & { parent: User; nanny: User & { nannyProfile: NannyProfile } })[]>;
  
  // Review operations
  createReview(review: InsertReview): Promise<Review>;
  getReviewsForNanny(nannyId: string): Promise<(Review & { reviewer: User })[]>;
  
  // Message operations
  createMessage(message: InsertMessage): Promise<Message>;
  getConversation(userId1: string, userId2: string): Promise<Message[]>;
  getRecentConversations(userId: string): Promise<{ user: User; lastMessage: Message; unreadCount: number }[]>;
  markMessagesAsRead(senderId: string, receiverId: string): Promise<void>;
  
  // Favorite operations
  addToFavorites(favorite: InsertFavorite): Promise<Favorite>;
  removeFromFavorites(userId: string, nannyId: string): Promise<void>;
  getFavorites(userId: string): Promise<(Favorite & { nanny: User & { nannyProfile: NannyProfile } })[]>;
  isFavorite(userId: string, nannyId: string): Promise<boolean>;
  
  // Dashboard operations
  getDashboardStats(userId: string, userType: string): Promise<{
    activeBookings?: number;
    totalEarnings?: number;
    completedJobs?: number;
    avgRating?: number;
    favoriteNannies?: number;
    totalSpent?: number;
    unreadMessages?: number;
  }>;
}

export class DatabaseStorage implements IStorage {
  // User operations (mandatory for Replit Auth)
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(userData)
      .onConflictDoUpdate({
        target: users.id,
        set: {
          ...userData,
          updatedAt: new Date(),
        },
      })
      .returning();
    return user;
  }

  // Nanny operations
  async createNannyProfile(profile: InsertNannyProfile): Promise<NannyProfile> {
    const [nannyProfile] = await db
      .insert(nannyProfiles)
      .values(profile)
      .returning();
    return nannyProfile;
  }

  async updateNannyProfile(userId: string, profile: Partial<InsertNannyProfile>): Promise<NannyProfile | undefined> {
    const [nannyProfile] = await db
      .update(nannyProfiles)
      .set({ ...profile, updatedAt: new Date() })
      .where(eq(nannyProfiles.userId, userId))
      .returning();
    return nannyProfile;
  }

  async getNannyProfile(userId: string): Promise<NannyProfile | undefined> {
    const [profile] = await db
      .select()
      .from(nannyProfiles)
      .where(eq(nannyProfiles.userId, userId));
    return profile;
  }

  async getNannyProfileWithUser(userId: string): Promise<(NannyProfile & { user: User }) | undefined> {
    const [result] = await db
      .select()
      .from(nannyProfiles)
      .innerJoin(users, eq(nannyProfiles.userId, users.id))
      .where(eq(nannyProfiles.userId, userId));
    
    if (!result) return undefined;
    
    return {
      ...result.nanny_profiles,
      user: result.users,
    };
  }

  async searchNannies(filters: {
    district?: string;
    region?: string;
    serviceType?: string;
    minRate?: number;
    maxRate?: number;
    isVerified?: boolean;
    limit?: number;
    offset?: number;
  }): Promise<(NannyProfile & { user: User; avgRating?: number; reviewCount?: number })[]> {
    let query = db
      .select({
        nannyProfile: nannyProfiles,
        user: users,
        avgRating: sql<number>`COALESCE(AVG(${reviews.rating}), 0)`,
        reviewCount: sql<number>`COUNT(${reviews.id})`,
      })
      .from(nannyProfiles)
      .innerJoin(users, eq(nannyProfiles.userId, users.id))
      .leftJoin(reviews, eq(reviews.revieweeId, users.id))
      .groupBy(nannyProfiles.id, users.id);

    const conditions = [];

    if (filters.district) {
      conditions.push(eq(nannyProfiles.district, filters.district));
    }
    if (filters.region) {
      conditions.push(eq(nannyProfiles.region, filters.region));
    }
    if (filters.serviceType) {
      conditions.push(sql`${filters.serviceType} = ANY(${nannyProfiles.services})`);
    }
    if (filters.minRate !== undefined) {
      conditions.push(sql`${nannyProfiles.hourlyRate} >= ${filters.minRate}`);
    }
    if (filters.maxRate !== undefined) {
      conditions.push(sql`${nannyProfiles.hourlyRate} <= ${filters.maxRate}`);
    }
    if (filters.isVerified !== undefined) {
      conditions.push(eq(nannyProfiles.isVerified, filters.isVerified));
    }

    if (conditions.length > 0) {
      query = query.where(and(...conditions));
    }

    query = query.orderBy(desc(sql`AVG(${reviews.rating})`));

    if (filters.limit) {
      query = query.limit(filters.limit);
    }
    if (filters.offset) {
      query = query.offset(filters.offset);
    }

    const results = await query;
    
    return results.map(result => ({
      ...result.nannyProfile,
      user: result.user,
      avgRating: result.avgRating,
      reviewCount: result.reviewCount,
    }));
  }

  // Parent operations
  async createParentProfile(profile: InsertParentProfile): Promise<ParentProfile> {
    const [parentProfile] = await db
      .insert(parentProfiles)
      .values(profile)
      .returning();
    return parentProfile;
  }

  async updateParentProfile(userId: string, profile: Partial<InsertParentProfile>): Promise<ParentProfile | undefined> {
    const [parentProfile] = await db
      .update(parentProfiles)
      .set({ ...profile, updatedAt: new Date() })
      .where(eq(parentProfiles.userId, userId))
      .returning();
    return parentProfile;
  }

  async getParentProfile(userId: string): Promise<ParentProfile | undefined> {
    const [profile] = await db
      .select()
      .from(parentProfiles)
      .where(eq(parentProfiles.userId, userId));
    return profile;
  }

  // Booking operations
  async createBooking(booking: InsertBooking): Promise<Booking> {
    const [newBooking] = await db
      .insert(bookings)
      .values(booking)
      .returning();
    return newBooking;
  }

  async updateBooking(id: number, booking: Partial<InsertBooking>): Promise<Booking | undefined> {
    const [updatedBooking] = await db
      .update(bookings)
      .set({ ...booking, updatedAt: new Date() })
      .where(eq(bookings.id, id))
      .returning();
    return updatedBooking;
  }

  async getBooking(id: number): Promise<Booking | undefined> {
    const [booking] = await db
      .select()
      .from(bookings)
      .where(eq(bookings.id, id));
    return booking;
  }

  async getBookingsByUser(userId: string, role: 'parent' | 'nanny'): Promise<(Booking & { parent: User; nanny: User & { nannyProfile: NannyProfile } })[]> {
    const condition = role === 'parent' 
      ? eq(bookings.parentId, userId)
      : eq(bookings.nannyId, userId);

    const results = await db
      .select({
        booking: bookings,
        parent: users,
        nanny: {
          id: users.id,
          email: users.email,
          firstName: users.firstName,
          lastName: users.lastName,
          profileImageUrl: users.profileImageUrl,
          userType: users.userType,
          createdAt: users.createdAt,
          updatedAt: users.updatedAt,
        },
        nannyProfile: nannyProfiles,
      })
      .from(bookings)
      .innerJoin(users, eq(bookings.parentId, users.id))
      .innerJoin(nannyProfiles, eq(bookings.nannyId, nannyProfiles.userId))
      .where(condition)
      .orderBy(desc(bookings.createdAt));

    return results.map(result => ({
      ...result.booking,
      parent: result.parent,
      nanny: {
        ...result.nanny,
        nannyProfile: result.nannyProfile,
      },
    }));
  }

  // Review operations
  async createReview(review: InsertReview): Promise<Review> {
    const [newReview] = await db
      .insert(reviews)
      .values(review)
      .returning();
    return newReview;
  }

  async getReviewsForNanny(nannyId: string): Promise<(Review & { reviewer: User })[]> {
    const results = await db
      .select({
        review: reviews,
        reviewer: users,
      })
      .from(reviews)
      .innerJoin(users, eq(reviews.reviewerId, users.id))
      .where(eq(reviews.revieweeId, nannyId))
      .orderBy(desc(reviews.createdAt));

    return results.map(result => ({
      ...result.review,
      reviewer: result.reviewer,
    }));
  }

  // Message operations
  async createMessage(message: InsertMessage): Promise<Message> {
    const [newMessage] = await db
      .insert(messages)
      .values(message)
      .returning();
    return newMessage;
  }

  async getConversation(userId1: string, userId2: string): Promise<Message[]> {
    return await db
      .select()
      .from(messages)
      .where(
        or(
          and(eq(messages.senderId, userId1), eq(messages.receiverId, userId2)),
          and(eq(messages.senderId, userId2), eq(messages.receiverId, userId1))
        )
      )
      .orderBy(asc(messages.createdAt));
  }

  async getRecentConversations(userId: string): Promise<{ user: User; lastMessage: Message; unreadCount: number }[]> {
    const conversations = await db
      .select({
        user: users,
        lastMessage: messages,
        unreadCount: sql<number>`COUNT(CASE WHEN ${messages.isRead} = false AND ${messages.receiverId} = ${userId} THEN 1 END)`,
      })
      .from(messages)
      .innerJoin(
        users,
        or(
          and(eq(messages.senderId, users.id), eq(messages.receiverId, userId)),
          and(eq(messages.receiverId, users.id), eq(messages.senderId, userId))
        )
      )
      .where(or(eq(messages.senderId, userId), eq(messages.receiverId, userId)))
      .groupBy(users.id, messages.id)
      .orderBy(desc(messages.createdAt));

    return conversations;
  }

  async markMessagesAsRead(senderId: string, receiverId: string): Promise<void> {
    await db
      .update(messages)
      .set({ isRead: true })
      .where(
        and(eq(messages.senderId, senderId), eq(messages.receiverId, receiverId))
      );
  }

  // Favorite operations
  async addToFavorites(favorite: InsertFavorite): Promise<Favorite> {
    const [newFavorite] = await db
      .insert(favorites)
      .values(favorite)
      .returning();
    return newFavorite;
  }

  async removeFromFavorites(userId: string, nannyId: string): Promise<void> {
    await db
      .delete(favorites)
      .where(
        and(eq(favorites.userId, userId), eq(favorites.nannyId, nannyId))
      );
  }

  async getFavorites(userId: string): Promise<(Favorite & { nanny: User & { nannyProfile: NannyProfile } })[]> {
    const results = await db
      .select({
        favorite: favorites,
        nanny: users,
        nannyProfile: nannyProfiles,
      })
      .from(favorites)
      .innerJoin(users, eq(favorites.nannyId, users.id))
      .innerJoin(nannyProfiles, eq(users.id, nannyProfiles.userId))
      .where(eq(favorites.userId, userId))
      .orderBy(desc(favorites.createdAt));

    return results.map(result => ({
      ...result.favorite,
      nanny: {
        ...result.nanny,
        nannyProfile: result.nannyProfile,
      },
    }));
  }

  async isFavorite(userId: string, nannyId: string): Promise<boolean> {
    const [favorite] = await db
      .select()
      .from(favorites)
      .where(
        and(eq(favorites.userId, userId), eq(favorites.nannyId, nannyId))
      );
    return !!favorite;
  }

  // Dashboard operations
  async getDashboardStats(userId: string, userType: string): Promise<{
    activeBookings?: number;
    totalEarnings?: number;
    completedJobs?: number;
    avgRating?: number;
    favoriteNannies?: number;
    totalSpent?: number;
    unreadMessages?: number;
  }> {
    const stats: any = {};

    // Unread messages count
    const [unreadResult] = await db
      .select({ count: sql<number>`COUNT(*)` })
      .from(messages)
      .where(and(eq(messages.receiverId, userId), eq(messages.isRead, false)));
    
    stats.unreadMessages = unreadResult.count;

    if (userType === 'nanny') {
      // Active bookings as nanny
      const [activeBookingsResult] = await db
        .select({ count: sql<number>`COUNT(*)` })
        .from(bookings)
        .where(and(eq(bookings.nannyId, userId), eq(bookings.status, 'accepted')));
      
      stats.activeBookings = activeBookingsResult.count;

      // Completed jobs
      const [completedJobsResult] = await db
        .select({ count: sql<number>`COUNT(*)` })
        .from(bookings)
        .where(and(eq(bookings.nannyId, userId), eq(bookings.status, 'completed')));
      
      stats.completedJobs = completedJobsResult.count;

      // Total earnings
      const [earningsResult] = await db
        .select({ total: sql<number>`COALESCE(SUM(${bookings.totalAmount}), 0)` })
        .from(bookings)
        .where(and(eq(bookings.nannyId, userId), eq(bookings.status, 'completed')));
      
      stats.totalEarnings = earningsResult.total;

      // Average rating
      const [ratingResult] = await db
        .select({ avg: sql<number>`COALESCE(AVG(${reviews.rating}), 0)` })
        .from(reviews)
        .where(eq(reviews.revieweeId, userId));
      
      stats.avgRating = ratingResult.avg;

    } else if (userType === 'parent') {
      // Active bookings as parent
      const [activeBookingsResult] = await db
        .select({ count: sql<number>`COUNT(*)` })
        .from(bookings)
        .where(and(eq(bookings.parentId, userId), eq(bookings.status, 'accepted')));
      
      stats.activeBookings = activeBookingsResult.count;

      // Total spent
      const [spentResult] = await db
        .select({ total: sql<number>`COALESCE(SUM(${bookings.totalAmount}), 0)` })
        .from(bookings)
        .where(and(eq(bookings.parentId, userId), eq(bookings.status, 'completed')));
      
      stats.totalSpent = spentResult.total;

      // Favorite nannies count
      const [favoritesResult] = await db
        .select({ count: sql<number>`COUNT(*)` })
        .from(favorites)
        .where(eq(favorites.userId, userId));
      
      stats.favoriteNannies = favoritesResult.count;
    }

    return stats;
  }
}

export const storage = new DatabaseStorage();
