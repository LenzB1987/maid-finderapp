import {
  pgTable,
  text,
  varchar,
  timestamp,
  jsonb,
  index,
  serial,
  integer,
  boolean,
  decimal,
} from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { relations } from "drizzle-orm";

// Session storage table for Replit Auth
export const sessions = pgTable(
  "sessions",
  {
    sid: varchar("sid").primaryKey(),
    sess: jsonb("sess").notNull(),
    expire: timestamp("expire").notNull(),
  },
  (table) => [index("IDX_session_expire").on(table.expire)],
);

// User storage table for Replit Auth
export const users = pgTable("users", {
  id: varchar("id").primaryKey().notNull(),
  email: varchar("email").unique(),
  firstName: varchar("first_name"),
  lastName: varchar("last_name"),
  profileImageUrl: varchar("profile_image_url"),
  nationalIdUrl: varchar("national_id_url"),
  phoneNumber: varchar("phone_number"),
  userType: varchar("user_type").notNull().default("parent"), // parent, nanny, admin
  isVerified: boolean("is_verified").default(false),
  passwordHash: varchar("password_hash"),
  resetToken: varchar("reset_token"),
  resetTokenExpiry: timestamp("reset_token_expiry"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Nanny profiles
export const nannyProfiles = pgTable("nanny_profiles", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").notNull().references(() => users.id),
  bio: text("bio"),
  experience: integer("experience"), // years of experience
  hourlyRate: decimal("hourly_rate", { precision: 10, scale: 2 }),
  monthlyRate: decimal("monthly_rate", { precision: 10, scale: 2 }),
  district: varchar("district").notNull(),
  region: varchar("region").notNull(),
  services: text("services").array(), // array of services offered
  ageGroups: text("age_groups").array(), // age groups they work with
  availability: text("availability").array(), // days/times available
  languages: text("languages").array(),
  isVerified: boolean("is_verified").default(false),
  backgroundCheck: boolean("background_check").default(false),
  firstAidCertified: boolean("first_aid_certified").default(false),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Parent profiles
export const parentProfiles = pgTable("parent_profiles", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").notNull().references(() => users.id),
  numberOfChildren: integer("number_of_children"),
  childrenAges: text("children_ages").array(),
  district: varchar("district").notNull(),
  region: varchar("region").notNull(),
  specialRequirements: text("special_requirements"),
  preferredServices: text("preferred_services").array(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Bookings/Hiring requests
export const bookings = pgTable("bookings", {
  id: serial("id").primaryKey(),
  parentId: varchar("parent_id").notNull().references(() => users.id),
  nannyId: varchar("nanny_id").notNull().references(() => users.id),
  serviceType: varchar("service_type").notNull(),
  startDate: timestamp("start_date").notNull(),
  endDate: timestamp("end_date"),
  status: varchar("status").notNull().default("pending"), // pending, accepted, rejected, completed
  totalAmount: decimal("total_amount", { precision: 10, scale: 2 }),
  specialInstructions: text("special_instructions"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Reviews and ratings
export const reviews = pgTable("reviews", {
  id: serial("id").primaryKey(),
  bookingId: integer("booking_id").notNull().references(() => bookings.id),
  reviewerId: varchar("reviewer_id").notNull().references(() => users.id),
  revieweeId: varchar("reviewee_id").notNull().references(() => users.id),
  rating: integer("rating").notNull(), // 1-5 stars
  comment: text("comment"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Messages
export const messages = pgTable("messages", {
  id: serial("id").primaryKey(),
  senderId: varchar("sender_id").notNull().references(() => users.id),
  receiverId: varchar("receiver_id").notNull().references(() => users.id),
  content: text("content").notNull(),
  isRead: boolean("is_read").default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

// Favorites
export const favorites = pgTable("favorites", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").notNull().references(() => users.id),
  nannyId: varchar("nanny_id").notNull().references(() => users.id),
  createdAt: timestamp("created_at").defaultNow(),
});

// File uploads table for storing photos and documents
export const fileUploads = pgTable("file_uploads", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").notNull().references(() => users.id),
  fileName: varchar("file_name").notNull(),
  fileType: varchar("file_type").notNull(), // 'profile_photo', 'national_id', 'certificate'
  fileUrl: varchar("file_url").notNull(),
  fileSize: integer("file_size"),
  uploadedAt: timestamp("uploaded_at").defaultNow(),
});

// Relations
export const usersRelations = relations(users, ({ one, many }) => ({
  nannyProfile: one(nannyProfiles, {
    fields: [users.id],
    references: [nannyProfiles.userId],
  }),
  parentProfile: one(parentProfiles, {
    fields: [users.id],
    references: [parentProfiles.userId],
  }),
  sentMessages: many(messages, { relationName: "sender" }),
  receivedMessages: many(messages, { relationName: "receiver" }),
  bookingsAsParent: many(bookings, { relationName: "parent" }),
  bookingsAsNanny: many(bookings, { relationName: "nanny" }),
  reviews: many(reviews, { relationName: "reviewer" }),
  favorites: many(favorites),
  fileUploads: many(fileUploads),
}));

export const nannyProfilesRelations = relations(nannyProfiles, ({ one }) => ({
  user: one(users, {
    fields: [nannyProfiles.userId],
    references: [users.id],
  }),
}));

export const parentProfilesRelations = relations(parentProfiles, ({ one }) => ({
  user: one(users, {
    fields: [parentProfiles.userId],
    references: [users.id],
  }),
}));

export const bookingsRelations = relations(bookings, ({ one, many }) => ({
  parent: one(users, {
    fields: [bookings.parentId],
    references: [users.id],
    relationName: "parent",
  }),
  nanny: one(users, {
    fields: [bookings.nannyId],
    references: [users.id],
    relationName: "nanny",
  }),
  reviews: many(reviews),
}));

export const reviewsRelations = relations(reviews, ({ one }) => ({
  booking: one(bookings, {
    fields: [reviews.bookingId],
    references: [bookings.id],
  }),
  reviewer: one(users, {
    fields: [reviews.reviewerId],
    references: [users.id],
    relationName: "reviewer",
  }),
  reviewee: one(users, {
    fields: [reviews.revieweeId],
    references: [users.id],
    relationName: "reviewee",
  }),
}));

export const messagesRelations = relations(messages, ({ one }) => ({
  sender: one(users, {
    fields: [messages.senderId],
    references: [users.id],
    relationName: "sender",
  }),
  receiver: one(users, {
    fields: [messages.receiverId],
    references: [users.id],
    relationName: "receiver",
  }),
}));

export const favoritesRelations = relations(favorites, ({ one }) => ({
  user: one(users, {
    fields: [favorites.userId],
    references: [users.id],
  }),
  nanny: one(users, {
    fields: [favorites.nannyId],
    references: [users.id],
  }),
}));

export const fileUploadsRelations = relations(fileUploads, ({ one }) => ({
  user: one(users, {
    fields: [fileUploads.userId],
    references: [users.id],
  }),
}));

// Insert schemas
export const insertUserSchema = createInsertSchema(users).omit({
  createdAt: true,
  updatedAt: true,
});

export const insertNannyProfileSchema = createInsertSchema(nannyProfiles).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertParentProfileSchema = createInsertSchema(parentProfiles).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertBookingSchema = createInsertSchema(bookings).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertReviewSchema = createInsertSchema(reviews).omit({
  id: true,
  createdAt: true,
});

export const insertMessageSchema = createInsertSchema(messages).omit({
  id: true,
  createdAt: true,
});

export const insertFavoriteSchema = createInsertSchema(favorites).omit({
  id: true,
  createdAt: true,
});

export const insertFileUploadSchema = createInsertSchema(fileUploads).omit({
  id: true,
  uploadedAt: true,
});

// Types
export type UpsertUser = typeof users.$inferInsert;
export type User = typeof users.$inferSelect;
export type NannyProfile = typeof nannyProfiles.$inferSelect;
export type InsertNannyProfile = z.infer<typeof insertNannyProfileSchema>;
export type ParentProfile = typeof parentProfiles.$inferSelect;
export type InsertParentProfile = z.infer<typeof insertParentProfileSchema>;
export type Booking = typeof bookings.$inferSelect;
export type InsertBooking = z.infer<typeof insertBookingSchema>;
export type Review = typeof reviews.$inferSelect;
export type InsertReview = z.infer<typeof insertReviewSchema>;
export type Message = typeof messages.$inferSelect;
export type InsertMessage = z.infer<typeof insertMessageSchema>;
export type Favorite = typeof favorites.$inferSelect;
export type InsertFavorite = z.infer<typeof insertFavoriteSchema>;
export type FileUpload = typeof fileUploads.$inferSelect;
export type InsertFileUpload = z.infer<typeof insertFileUploadSchema>;
