import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import Header from "@/components/header";
import NannyCard from "@/components/nanny-card";
import MessageCenter from "@/components/message-center";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  Clock, 
  Heart, 
  DollarSign, 
  MessageSquare, 
  Calendar,
  Star,
  Search,
  User,
  Plus
} from "lucide-react";
import { Link } from "wouter";

export default function ParentDashboard() {
  const { user } = useAuth();

  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ["/api/dashboard/stats"],
  });

  const { data: bookings, isLoading: bookingsLoading } = useQuery({
    queryKey: ["/api/bookings?role=parent"],
  });

  const { data: favorites, isLoading: favoritesLoading } = useQuery({
    queryKey: ["/api/favorites"],
  });

  const { data: profile, isLoading: profileLoading } = useQuery({
    queryKey: ["/api/profiles/parent"],
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Parent Dashboard</h1>
          <p className="text-gray-600">
            Manage your bookings, favorites, and find the perfect nanny for your family
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          {statsLoading ? (
            Array.from({ length: 4 }, (_, i) => (
              <Card key={i}>
                <CardContent className="p-6">
                  <Skeleton className="h-4 w-20 mb-2" />
                  <Skeleton className="h-8 w-16" />
                </CardContent>
              </Card>
            ))
          ) : (
            <>
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Active Bookings</p>
                      <p className="text-2xl font-bold text-blue-600">{stats?.activeBookings || 0}</p>
                    </div>
                    <Clock className="w-8 h-8 text-blue-600" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Total Spent</p>
                      <p className="text-2xl font-bold text-green-600">
                        UGX {(stats?.totalSpent || 0).toLocaleString()}
                      </p>
                    </div>
                    <DollarSign className="w-8 h-8 text-green-600" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Favorite Nannies</p>
                      <p className="text-2xl font-bold text-red-600">{stats?.favoriteNannies || 0}</p>
                    </div>
                    <Heart className="w-8 h-8 text-red-600" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Unread Messages</p>
                      <p className="text-2xl font-bold text-yellow-600">{stats?.unreadMessages || 0}</p>
                    </div>
                    <MessageSquare className="w-8 h-8 text-yellow-600" />
                  </div>
                </CardContent>
              </Card>
            </>
          )}
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full lg:w-auto grid-cols-2 lg:grid-cols-5">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="bookings">Bookings</TabsTrigger>
            <TabsTrigger value="favorites">Favorites</TabsTrigger>
            <TabsTrigger value="messages">Messages</TabsTrigger>
            <TabsTrigger value="profile">Profile</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Quick Actions */}
              <Card>
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Link href="/search">
                    <Button className="w-full justify-start">
                      <Search className="w-4 h-4 mr-2" />
                      Find Nannies
                    </Button>
                  </Link>
                  <Button variant="outline" className="w-full justify-start" asChild>
                    <Link href="/search">
                      <Plus className="w-4 h-4 mr-2" />
                      Post Job Listing
                    </Link>
                  </Button>
                  <Button variant="outline" className="w-full justify-start" asChild>
                    <Link href="/search">
                      <Calendar className="w-4 h-4 mr-2" />
                      Schedule Interview
                    </Link>
                  </Button>
                </CardContent>
              </Card>

              {/* Recent Activity */}
              <Card>
                <CardHeader>
                  <CardTitle>Recent Activity</CardTitle>
                </CardHeader>
                <CardContent>
                  {bookingsLoading ? (
                    <div className="space-y-3">
                      {Array.from({ length: 3 }, (_, i) => (
                        <div key={i} className="flex items-center space-x-3">
                          <Skeleton className="w-10 h-10 rounded-full" />
                          <div className="flex-1">
                            <Skeleton className="h-4 w-24 mb-1" />
                            <Skeleton className="h-3 w-32" />
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : bookings && bookings.length > 0 ? (
                    <div className="space-y-3">
                      {bookings.slice(0, 5).map((booking: any) => (
                        <div key={booking.id} className="flex items-center space-x-3 p-2 hover:bg-gray-50 rounded-lg">
                          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                            <User className="w-5 h-5 text-blue-600" />
                          </div>
                          <div className="flex-1">
                            <p className="text-sm font-medium text-gray-900">
                              Booking with {booking.nanny.firstName} {booking.nanny.lastName}
                            </p>
                            <p className="text-xs text-gray-500">
                              {booking.serviceType} • {new Date(booking.startDate).toLocaleDateString()}
                            </p>
                          </div>
                          <Badge variant="outline" className="text-xs">
                            {booking.status}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-6">
                      <Calendar className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                      <p className="text-sm text-gray-500">No recent activity</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Top Favorites */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Your Favorite Nannies</CardTitle>
                <Link href="/favorites">
                  <Button variant="outline" size="sm">View All</Button>
                </Link>
              </CardHeader>
              <CardContent>
                {favoritesLoading ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {Array.from({ length: 3 }, (_, i) => (
                      <Card key={i}>
                        <CardContent className="p-4">
                          <div className="flex items-center mb-3">
                            <Skeleton className="w-12 h-12 rounded-full mr-3" />
                            <div>
                              <Skeleton className="h-4 w-24 mb-1" />
                              <Skeleton className="h-3 w-20" />
                            </div>
                          </div>
                          <Skeleton className="h-8 w-full" />
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : favorites && favorites.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {favorites.slice(0, 3).map((favorite: any) => (
                      <NannyCard 
                        key={favorite.nanny.id} 
                        nanny={favorite.nanny} 
                        compact 
                        isFavorite={true}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Heart className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500 mb-4">No favorite nannies yet</p>
                    <Link href="/search">
                      <Button>Find Nannies</Button>
                    </Link>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Bookings Tab */}
          <TabsContent value="bookings">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>My Bookings</CardTitle>
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  New Booking
                </Button>
              </CardHeader>
              <CardContent>
                {bookingsLoading ? (
                  <div className="space-y-4">
                    {Array.from({ length: 5 }, (_, i) => (
                      <div key={i} className="border rounded-lg p-4">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center space-x-3">
                            <Skeleton className="w-12 h-12 rounded-full" />
                            <div>
                              <Skeleton className="h-4 w-32 mb-1" />
                              <Skeleton className="h-3 w-24" />
                            </div>
                          </div>
                          <Skeleton className="h-6 w-20" />
                        </div>
                        <Skeleton className="h-16 w-full" />
                      </div>
                    ))}
                  </div>
                ) : bookings && bookings.length > 0 ? (
                  <div className="space-y-4">
                    {bookings.map((booking: any) => (
                      <div key={booking.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center space-x-3">
                            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                              <User className="w-6 h-6 text-blue-600" />
                            </div>
                            <div>
                              <h4 className="font-medium text-gray-900">
                                {booking.nanny.firstName} {booking.nanny.lastName}
                              </h4>
                              <p className="text-sm text-gray-600">{booking.serviceType}</p>
                            </div>
                          </div>
                          <Badge variant={
                            booking.status === 'completed' ? 'default' :
                            booking.status === 'accepted' ? 'secondary' :
                            booking.status === 'pending' ? 'outline' : 'destructive'
                          }>
                            {booking.status}
                          </Badge>
                        </div>
                        
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                          <div>
                            <span className="text-gray-500">Start Date:</span>
                            <p className="font-medium">{new Date(booking.startDate).toLocaleDateString()}</p>
                          </div>
                          {booking.endDate && (
                            <div>
                              <span className="text-gray-500">End Date:</span>
                              <p className="font-medium">{new Date(booking.endDate).toLocaleDateString()}</p>
                            </div>
                          )}
                          {booking.totalAmount && (
                            <div>
                              <span className="text-gray-500">Amount:</span>
                              <p className="font-medium">UGX {parseFloat(booking.totalAmount).toLocaleString()}</p>
                            </div>
                          )}
                          <div>
                            <span className="text-gray-500">Created:</span>
                            <p className="font-medium">{new Date(booking.createdAt).toLocaleDateString()}</p>
                          </div>
                        </div>

                        {booking.specialInstructions && (
                          <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                            <p className="text-sm text-gray-700">{booking.specialInstructions}</p>
                          </div>
                        )}

                        <div className="mt-4 flex space-x-2">
                          <Button variant="outline" size="sm">
                            View Details
                          </Button>
                          {booking.status === 'completed' && (
                            <Button variant="outline" size="sm">
                              <Star className="w-4 h-4 mr-1" />
                              Leave Review
                            </Button>
                          )}
                          <Button variant="outline" size="sm">
                            <MessageSquare className="w-4 h-4 mr-1" />
                            Message
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No bookings yet</h3>
                    <p className="text-gray-500 mb-6">Start by finding and booking a nanny</p>
                    <Link href="/search">
                      <Button>Find Nannies</Button>
                    </Link>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Favorites Tab */}
          <TabsContent value="favorites">
            <Card>
              <CardHeader>
                <CardTitle>Favorite Nannies</CardTitle>
              </CardHeader>
              <CardContent>
                {favoritesLoading ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {Array.from({ length: 6 }, (_, i) => (
                      <Card key={i}>
                        <CardContent className="p-6">
                          <div className="flex items-center mb-4">
                            <Skeleton className="w-16 h-16 rounded-full mr-4" />
                            <div>
                              <Skeleton className="h-4 w-24 mb-2" />
                              <Skeleton className="h-3 w-20 mb-1" />
                              <Skeleton className="h-3 w-32" />
                            </div>
                          </div>
                          <Skeleton className="h-20 w-full mb-4" />
                          <Skeleton className="h-8 w-full" />
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : favorites && favorites.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {favorites.map((favorite: any) => (
                      <NannyCard 
                        key={favorite.nanny.id} 
                        nanny={favorite.nanny} 
                        isFavorite={true}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <Heart className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No favorites yet</h3>
                    <p className="text-gray-500 mb-6">Add nannies to your favorites to easily find them later</p>
                    <Link href="/search">
                      <Button>
                        <Search className="w-4 h-4 mr-2" />
                        Find Nannies
                      </Button>
                    </Link>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Messages Tab */}
          <TabsContent value="messages">
            <Card>
              <CardHeader>
                <CardTitle>Messages</CardTitle>
              </CardHeader>
              <CardContent>
                <MessageCenter />
              </CardContent>
            </Card>
          </TabsContent>

          {/* Profile Tab */}
          <TabsContent value="profile">
            <Card>
              <CardHeader>
                <CardTitle>Parent Profile</CardTitle>
              </CardHeader>
              <CardContent>
                {profileLoading ? (
                  <div className="space-y-6">
                    <Skeleton className="h-32 w-full" />
                    <Skeleton className="h-24 w-full" />
                    <Skeleton className="h-16 w-full" />
                  </div>
                ) : (
                  <div className="max-w-2xl">
                    <div className="space-y-6">
                      <div>
                        <h3 className="text-lg font-medium text-gray-900 mb-4">Profile Information</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700">Number of Children</label>
                            <p className="mt-1 text-sm text-gray-900">{profile?.numberOfChildren || 'Not specified'}</p>
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700">Location</label>
                            <p className="mt-1 text-sm text-gray-900">{profile?.district}, {profile?.region}</p>
                          </div>
                        </div>
                      </div>

                      {profile?.childrenAges && profile.childrenAges.length > 0 && (
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Children Ages</label>
                          <div className="flex flex-wrap gap-2">
                            {profile.childrenAges.map((age: string) => (
                              <Badge key={age} variant="outline">{age}</Badge>
                            ))}
                          </div>
                        </div>
                      )}

                      {profile?.preferredServices && profile.preferredServices.length > 0 && (
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Preferred Services</label>
                          <div className="flex flex-wrap gap-2">
                            {profile.preferredServices.map((service: string) => (
                              <Badge key={service} variant="outline">{service}</Badge>
                            ))}
                          </div>
                        </div>
                      )}

                      {profile?.specialRequirements && (
                        <div>
                          <label className="block text-sm font-medium text-gray-700">Special Requirements</label>
                          <p className="mt-1 text-sm text-gray-900">{profile.specialRequirements}</p>
                        </div>
                      )}

                      <div className="pt-4">
                        <Button>Edit Profile</Button>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
