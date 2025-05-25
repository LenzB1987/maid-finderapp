import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import Header from "@/components/header";
import MessageCenter from "@/components/message-center";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  Clock, 
  DollarSign, 
  Star, 
  MessageSquare, 
  Calendar,
  User,
  CheckCircle,
  XCircle,
  Edit,
  Eye,
  Shield
} from "lucide-react";

export default function NannyDashboard() {
  const { user } = useAuth();

  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ["/api/dashboard/stats"],
  });

  const { data: bookings, isLoading: bookingsLoading } = useQuery({
    queryKey: ["/api/bookings?role=nanny"],
  });

  const { data: profile, isLoading: profileLoading } = useQuery({
    queryKey: ["/api/profiles/nanny"],
  });

  const { data: reviews, isLoading: reviewsLoading } = useQuery({
    queryKey: [`/api/reviews/nanny/${user?.id}`],
    enabled: !!user?.id,
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Nanny Dashboard</h1>
          <p className="text-gray-600">
            Manage your bookings, profile, and grow your childcare business
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
                      <p className="text-sm font-medium text-gray-600">Total Earnings</p>
                      <p className="text-2xl font-bold text-green-600">
                        UGX {(stats?.totalEarnings || 0).toLocaleString()}
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
                      <p className="text-sm font-medium text-gray-600">Average Rating</p>
                      <p className="text-2xl font-bold text-yellow-600">
                        {(stats?.avgRating || 0).toFixed(1)}
                      </p>
                    </div>
                    <Star className="w-8 h-8 text-yellow-600" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Completed Jobs</p>
                      <p className="text-2xl font-bold text-purple-600">{stats?.completedJobs || 0}</p>
                    </div>
                    <CheckCircle className="w-8 h-8 text-purple-600" />
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
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="reviews">Reviews</TabsTrigger>
            <TabsTrigger value="messages">Messages</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Profile Status */}
              <Card>
                <CardHeader>
                  <CardTitle>Profile Status</CardTitle>
                </CardHeader>
                <CardContent>
                  {profileLoading ? (
                    <div className="space-y-3">
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-4 w-3/4" />
                      <Skeleton className="h-4 w-1/2" />
                    </div>
                  ) : profile ? (
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Profile Completion</span>
                        <span className="text-sm font-medium">85%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-blue-600 h-2 rounded-full" style={{ width: '85%' }}></div>
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex items-center space-x-2">
                          <CheckCircle className="w-4 h-4 text-green-500" />
                          <span className="text-sm">Basic information completed</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          {profile.isVerified ? (
                            <CheckCircle className="w-4 h-4 text-green-500" />
                          ) : (
                            <XCircle className="w-4 h-4 text-red-500" />
                          )}
                          <span className="text-sm">
                            {profile.isVerified ? 'Profile verified' : 'Profile not verified'}
                          </span>
                        </div>
                        <div className="flex items-center space-x-2">
                          {profile.backgroundCheck ? (
                            <CheckCircle className="w-4 h-4 text-green-500" />
                          ) : (
                            <XCircle className="w-4 h-4 text-red-500" />
                          )}
                          <span className="text-sm">
                            {profile.backgroundCheck ? 'Background check completed' : 'Background check pending'}
                          </span>
                        </div>
                      </div>

                      <Button variant="outline" className="w-full">
                        <Edit className="w-4 h-4 mr-2" />
                        Edit Profile
                      </Button>
                    </div>
                  ) : (
                    <div className="text-center py-4">
                      <p className="text-gray-500 mb-4">No profile found</p>
                      <Button>Create Profile</Button>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Recent Bookings */}
              <Card>
                <CardHeader>
                  <CardTitle>Recent Bookings</CardTitle>
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
                          <Avatar className="w-10 h-10">
                            <AvatarImage
                              src={booking.parent.profileImageUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${booking.parent.firstName}`}
                              alt={`${booking.parent.firstName} ${booking.parent.lastName}`}
                            />
                            <AvatarFallback>
                              {booking.parent.firstName?.[0]}{booking.parent.lastName?.[0]}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <p className="text-sm font-medium text-gray-900">
                              {booking.parent.firstName} {booking.parent.lastName}
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
                      <p className="text-sm text-gray-500">No recent bookings</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Performance Metrics */}
            <Card>
              <CardHeader>
                <CardTitle>Performance Metrics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-blue-600 mb-2">
                      {(stats?.avgRating || 0).toFixed(1)}
                    </div>
                    <p className="text-sm text-gray-600">Average Rating</p>
                    <div className="flex justify-center mt-1">
                      {Array.from({ length: 5 }, (_, i) => (
                        <Star 
                          key={i} 
                          className={`w-4 h-4 ${i < Math.floor(stats?.avgRating || 0) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} 
                        />
                      ))}
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-green-600 mb-2">
                      {stats?.completedJobs || 0}
                    </div>
                    <p className="text-sm text-gray-600">Jobs Completed</p>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-purple-600 mb-2">
                      95%
                    </div>
                    <p className="text-sm text-gray-600">Response Rate</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Bookings Tab */}
          <TabsContent value="bookings">
            <Card>
              <CardHeader>
                <CardTitle>My Bookings</CardTitle>
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
                            <Avatar className="w-12 h-12">
                              <AvatarImage
                                src={booking.parent.profileImageUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${booking.parent.firstName}`}
                                alt={`${booking.parent.firstName} ${booking.parent.lastName}`}
                              />
                              <AvatarFallback>
                                {booking.parent.firstName?.[0]}{booking.parent.lastName?.[0]}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <h4 className="font-medium text-gray-900">
                                {booking.parent.firstName} {booking.parent.lastName}
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
                          {booking.status === 'pending' && (
                            <>
                              <Button variant="default" size="sm">
                                <CheckCircle className="w-4 h-4 mr-1" />
                                Accept
                              </Button>
                              <Button variant="outline" size="sm">
                                <XCircle className="w-4 h-4 mr-1" />
                                Decline
                              </Button>
                            </>
                          )}
                          <Button variant="outline" size="sm">
                            <MessageSquare className="w-4 h-4 mr-1" />
                            Message
                          </Button>
                          <Button variant="outline" size="sm">
                            View Details
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No bookings yet</h3>
                    <p className="text-gray-500 mb-6">Parents will send you booking requests</p>
                    <Button variant="outline">
                      <Eye className="w-4 h-4 mr-2" />
                      View Public Profile
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Profile Tab */}
          <TabsContent value="profile">
            <Card>
              <CardHeader>
                <CardTitle>Nanny Profile</CardTitle>
              </CardHeader>
              <CardContent>
                {profileLoading ? (
                  <div className="space-y-6">
                    <Skeleton className="h-32 w-full" />
                    <Skeleton className="h-24 w-full" />
                    <Skeleton className="h-16 w-full" />
                  </div>
                ) : profile ? (
                  <div className="max-w-2xl">
                    <div className="space-y-6">
                      <div>
                        <h3 className="text-lg font-medium text-gray-900 mb-4">Profile Information</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700">Experience</label>
                            <p className="mt-1 text-sm text-gray-900">{profile.experience} years</p>
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700">Location</label>
                            <p className="mt-1 text-sm text-gray-900">{profile.district}, {profile.region}</p>
                          </div>
                        </div>
                      </div>

                      {profile.bio && (
                        <div>
                          <label className="block text-sm font-medium text-gray-700">Bio</label>
                          <p className="mt-1 text-sm text-gray-900">{profile.bio}</p>
                        </div>
                      )}

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700">Hourly Rate</label>
                          <p className="mt-1 text-sm text-gray-900">
                            UGX {profile.hourlyRate ? parseFloat(profile.hourlyRate).toLocaleString() : 'Not set'}
                          </p>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700">Monthly Rate</label>
                          <p className="mt-1 text-sm text-gray-900">
                            UGX {profile.monthlyRate ? parseFloat(profile.monthlyRate).toLocaleString() : 'Not set'}
                          </p>
                        </div>
                      </div>

                      {profile.services && profile.services.length > 0 && (
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Services</label>
                          <div className="flex flex-wrap gap-2">
                            {profile.services.map((service: string) => (
                              <Badge key={service} variant="outline">{service}</Badge>
                            ))}
                          </div>
                        </div>
                      )}

                      {profile.ageGroups && profile.ageGroups.length > 0 && (
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Age Groups</label>
                          <div className="flex flex-wrap gap-2">
                            {profile.ageGroups.map((age: string) => (
                              <Badge key={age} variant="outline">{age}</Badge>
                            ))}
                          </div>
                        </div>
                      )}

                      {profile.languages && profile.languages.length > 0 && (
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Languages</label>
                          <div className="flex flex-wrap gap-2">
                            {profile.languages.map((language: string) => (
                              <Badge key={language} variant="outline">{language}</Badge>
                            ))}
                          </div>
                        </div>
                      )}

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Verification Status</label>
                        <div className="space-y-2">
                          <div className="flex items-center space-x-2">
                            {profile.isVerified ? (
                              <Shield className="w-4 h-4 text-green-500" />
                            ) : (
                              <Shield className="w-4 h-4 text-gray-400" />
                            )}
                            <span className="text-sm">Profile Verified</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            {profile.backgroundCheck ? (
                              <CheckCircle className="w-4 h-4 text-green-500" />
                            ) : (
                              <XCircle className="w-4 h-4 text-gray-400" />
                            )}
                            <span className="text-sm">Background Check</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            {profile.firstAidCertified ? (
                              <CheckCircle className="w-4 h-4 text-green-500" />
                            ) : (
                              <XCircle className="w-4 h-4 text-gray-400" />
                            )}
                            <span className="text-sm">First Aid Certified</span>
                          </div>
                        </div>
                      </div>

                      <div className="pt-4 flex space-x-4">
                        <Button>
                          <Edit className="w-4 h-4 mr-2" />
                          Edit Profile
                        </Button>
                        <Button variant="outline">
                          <Eye className="w-4 h-4 mr-2" />
                          View Public Profile
                        </Button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <User className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Create Your Profile</h3>
                    <p className="text-gray-500 mb-6">Set up your nanny profile to start receiving bookings</p>
                    <Button>Create Profile</Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Reviews Tab */}
          <TabsContent value="reviews">
            <Card>
              <CardHeader>
                <CardTitle>Reviews</CardTitle>
              </CardHeader>
              <CardContent>
                {reviewsLoading ? (
                  <div className="space-y-4">
                    {Array.from({ length: 3 }, (_, i) => (
                      <div key={i} className="border-b pb-4">
                        <div className="flex items-center space-x-3 mb-2">
                          <Skeleton className="w-10 h-10 rounded-full" />
                          <div>
                            <Skeleton className="h-4 w-24 mb-1" />
                            <Skeleton className="h-3 w-16" />
                          </div>
                        </div>
                        <Skeleton className="h-16 w-full" />
                      </div>
                    ))}
                  </div>
                ) : reviews && reviews.length > 0 ? (
                  <div className="space-y-6">
                    {reviews.map((review: any) => (
                      <div key={review.id} className="border-b pb-6 last:border-b-0">
                        <div className="flex items-start space-x-3 mb-3">
                          <Avatar className="w-10 h-10">
                            <AvatarImage
                              src={review.reviewer.profileImageUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${review.reviewer.firstName}`}
                              alt={`${review.reviewer.firstName} ${review.reviewer.lastName}`}
                            />
                            <AvatarFallback>
                              {review.reviewer.firstName?.[0]}{review.reviewer.lastName?.[0]}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <div className="flex items-center justify-between mb-1">
                              <h5 className="font-medium text-gray-900">
                                {review.reviewer.firstName} {review.reviewer.lastName}
                              </h5>
                              <div className="flex items-center">
                                {Array.from({ length: 5 }, (_, i) => (
                                  <Star 
                                    key={i} 
                                    className={`w-4 h-4 ${i < review.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} 
                                  />
                                ))}
                              </div>
                            </div>
                            <p className="text-sm text-gray-600 mb-2">
                              {new Date(review.createdAt).toLocaleDateString()}
                            </p>
                            {review.comment && (
                              <p className="text-gray-700">{review.comment}</p>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <Star className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No reviews yet</h3>
                    <p className="text-gray-500">Complete your first booking to receive reviews</p>
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
        </Tabs>
      </div>
    </div>
  );
}
