import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth, isAuthenticated } from "./replitAuth";
import { 
  insertNannyProfileSchema,
  insertParentProfileSchema,
  insertBookingSchema,
  insertReviewSchema,
  insertMessageSchema,
  insertFavoriteSchema,
} from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // Auth middleware
  await setupAuth(app);

  // Auth routes
  app.get('/api/auth/user', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      res.json(user);
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  // Profile routes
  app.post('/api/profiles/nanny', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const profileData = insertNannyProfileSchema.parse({ ...req.body, userId });
      const profile = await storage.createNannyProfile(profileData);
      res.json(profile);
    } catch (error) {
      console.error("Error creating nanny profile:", error);
      res.status(400).json({ message: "Failed to create nanny profile" });
    }
  });

  app.put('/api/profiles/nanny', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const profileData = insertNannyProfileSchema.partial().parse(req.body);
      const profile = await storage.updateNannyProfile(userId, profileData);
      res.json(profile);
    } catch (error) {
      console.error("Error updating nanny profile:", error);
      res.status(400).json({ message: "Failed to update nanny profile" });
    }
  });

  app.get('/api/profiles/nanny/:userId', async (req, res) => {
    try {
      const { userId } = req.params;
      const profile = await storage.getNannyProfileWithUser(userId);
      if (!profile) {
        return res.status(404).json({ message: "Nanny profile not found" });
      }
      res.json(profile);
    } catch (error) {
      console.error("Error fetching nanny profile:", error);
      res.status(500).json({ message: "Failed to fetch nanny profile" });
    }
  });

  app.get('/api/profiles/nanny', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const profile = await storage.getNannyProfile(userId);
      res.json(profile);
    } catch (error) {
      console.error("Error fetching nanny profile:", error);
      res.status(500).json({ message: "Failed to fetch nanny profile" });
    }
  });

  app.post('/api/profiles/parent', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const profileData = insertParentProfileSchema.parse({ ...req.body, userId });
      const profile = await storage.createParentProfile(profileData);
      res.json(profile);
    } catch (error) {
      console.error("Error creating parent profile:", error);
      res.status(400).json({ message: "Failed to create parent profile" });
    }
  });

  app.put('/api/profiles/parent', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const profileData = insertParentProfileSchema.partial().parse(req.body);
      const profile = await storage.updateParentProfile(userId, profileData);
      res.json(profile);
    } catch (error) {
      console.error("Error updating parent profile:", error);
      res.status(400).json({ message: "Failed to update parent profile" });
    }
  });

  app.get('/api/profiles/parent', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const profile = await storage.getParentProfile(userId);
      res.json(profile);
    } catch (error) {
      console.error("Error fetching parent profile:", error);
      res.status(500).json({ message: "Failed to fetch parent profile" });
    }
  });

  // Search routes
  app.get('/api/nannies/search', async (req, res) => {
    try {
      const {
        district,
        region,
        serviceType,
        minRate,
        maxRate,
        isVerified,
        limit = '20',
        offset = '0'
      } = req.query;

      const filters = {
        district: district as string,
        region: region as string,
        serviceType: serviceType as string,
        minRate: minRate ? parseFloat(minRate as string) : undefined,
        maxRate: maxRate ? parseFloat(maxRate as string) : undefined,
        isVerified: isVerified === 'true' ? true : undefined,
        limit: parseInt(limit as string),
        offset: parseInt(offset as string),
      };

      const nannies = await storage.searchNannies(filters);
      res.json(nannies);
    } catch (error) {
      console.error("Error searching nannies:", error);
      res.status(500).json({ message: "Failed to search nannies" });
    }
  });

  // Booking routes
  app.post('/api/bookings', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const bookingData = insertBookingSchema.parse({ ...req.body, parentId: userId });
      const booking = await storage.createBooking(bookingData);
      res.json(booking);
    } catch (error) {
      console.error("Error creating booking:", error);
      res.status(400).json({ message: "Failed to create booking" });
    }
  });

  app.put('/api/bookings/:id', isAuthenticated, async (req: any, res) => {
    try {
      const { id } = req.params;
      const bookingData = insertBookingSchema.partial().parse(req.body);
      const booking = await storage.updateBooking(parseInt(id), bookingData);
      res.json(booking);
    } catch (error) {
      console.error("Error updating booking:", error);
      res.status(400).json({ message: "Failed to update booking" });
    }
  });

  app.get('/api/bookings', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const { role = 'parent' } = req.query;
      const bookings = await storage.getBookingsByUser(userId, role as 'parent' | 'nanny');
      res.json(bookings);
    } catch (error) {
      console.error("Error fetching bookings:", error);
      res.status(500).json({ message: "Failed to fetch bookings" });
    }
  });

  // Review routes
  app.post('/api/reviews', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const reviewData = insertReviewSchema.parse({ ...req.body, reviewerId: userId });
      const review = await storage.createReview(reviewData);
      res.json(review);
    } catch (error) {
      console.error("Error creating review:", error);
      res.status(400).json({ message: "Failed to create review" });
    }
  });

  app.get('/api/reviews/nanny/:nannyId', async (req, res) => {
    try {
      const { nannyId } = req.params;
      const reviews = await storage.getReviewsForNanny(nannyId);
      res.json(reviews);
    } catch (error) {
      console.error("Error fetching reviews:", error);
      res.status(500).json({ message: "Failed to fetch reviews" });
    }
  });

  // Message routes
  app.post('/api/messages', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const messageData = insertMessageSchema.parse({ ...req.body, senderId: userId });
      const message = await storage.createMessage(messageData);
      res.json(message);
    } catch (error) {
      console.error("Error creating message:", error);
      res.status(400).json({ message: "Failed to create message" });
    }
  });

  app.get('/api/messages/conversation/:userId', isAuthenticated, async (req: any, res) => {
    try {
      const currentUserId = req.user.claims.sub;
      const { userId } = req.params;
      const messages = await storage.getConversation(currentUserId, userId);
      res.json(messages);
    } catch (error) {
      console.error("Error fetching conversation:", error);
      res.status(500).json({ message: "Failed to fetch conversation" });
    }
  });

  app.get('/api/messages/conversations', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const conversations = await storage.getRecentConversations(userId);
      res.json(conversations);
    } catch (error) {
      console.error("Error fetching conversations:", error);
      res.status(500).json({ message: "Failed to fetch conversations" });
    }
  });

  app.put('/api/messages/read/:senderId', isAuthenticated, async (req: any, res) => {
    try {
      const receiverId = req.user.claims.sub;
      const { senderId } = req.params;
      await storage.markMessagesAsRead(senderId, receiverId);
      res.json({ success: true });
    } catch (error) {
      console.error("Error marking messages as read:", error);
      res.status(500).json({ message: "Failed to mark messages as read" });
    }
  });

  // Favorite routes
  app.post('/api/favorites', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const favoriteData = insertFavoriteSchema.parse({ ...req.body, userId });
      const favorite = await storage.addToFavorites(favoriteData);
      res.json(favorite);
    } catch (error) {
      console.error("Error adding to favorites:", error);
      res.status(400).json({ message: "Failed to add to favorites" });
    }
  });

  app.delete('/api/favorites/:nannyId', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const { nannyId } = req.params;
      await storage.removeFromFavorites(userId, nannyId);
      res.json({ success: true });
    } catch (error) {
      console.error("Error removing from favorites:", error);
      res.status(500).json({ message: "Failed to remove from favorites" });
    }
  });

  app.get('/api/favorites', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const favorites = await storage.getFavorites(userId);
      res.json(favorites);
    } catch (error) {
      console.error("Error fetching favorites:", error);
      res.status(500).json({ message: "Failed to fetch favorites" });
    }
  });

  app.get('/api/favorites/check/:nannyId', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const { nannyId } = req.params;
      const isFavorite = await storage.isFavorite(userId, nannyId);
      res.json({ isFavorite });
    } catch (error) {
      console.error("Error checking favorite status:", error);
      res.status(500).json({ message: "Failed to check favorite status" });
    }
  });

  // Dashboard routes
  app.get('/api/dashboard/stats', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      const stats = await storage.getDashboardStats(userId, user.userType);
      res.json(stats);
    } catch (error) {
      console.error("Error fetching dashboard stats:", error);
      res.status(500).json({ message: "Failed to fetch dashboard stats" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
