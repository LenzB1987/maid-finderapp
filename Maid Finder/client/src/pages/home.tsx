import { useAuth } from "@/hooks/useAuth";
import { useQuery } from "@tanstack/react-query";
import Header from "@/components/header";
import SearchForm from "@/components/search-form";
import NannyCard from "@/components/nanny-card";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { MessageSquare, Star, Clock, Heart } from "lucide-react";
import { Link } from "wouter";

export default function Home() {
  const { user } = useAuth();

  const { data: nannies, isLoading: nanniesLoading } = useQuery({
    queryKey: ["/api/nannies/search?limit=6"],
  });

  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ["/api/dashboard/stats"],
  });

  const { data: conversations, isLoading: conversationsLoading } = useQuery({
    queryKey: ["/api/messages/conversations"],
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome back, {user?.firstName || 'there'}!
          </h1>
          <p className="text-gray-600">
            {user?.userType === 'nanny' 
              ? 'Manage your bookings and find new opportunities'
              : 'Find the perfect nanny for your family'
            }
          </p>
        </div>

        {/* Dashboard Stats */}
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
                      <p className="text-sm font-medium text-gray-600">
                        {user?.userType === 'nanny' ? 'Total Earnings' : 'Total Spent'}
                      </p>
                      <p className="text-2xl font-bold text-green-600">
                        UGX {((user?.userType === 'nanny' ? stats?.totalEarnings : stats?.totalSpent) || 0).toLocaleString()}
                      </p>
                    </div>
                    <Star className="w-8 h-8 text-green-600" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">
                        {user?.userType === 'nanny' ? 'Avg Rating' : 'Favorite Nannies'}
                      </p>
                      <p className="text-2xl font-bold text-yellow-600">
                        {user?.userType === 'nanny' 
                          ? (stats?.avgRating || 0).toFixed(1)
                          : stats?.favoriteNannies || 0
                        }
                      </p>
                    </div>
                    {user?.userType === 'nanny' ? (
                      <Star className="w-8 h-8 text-yellow-600" />
                    ) : (
                      <Heart className="w-8 h-8 text-yellow-600" />
                    )}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Unread Messages</p>
                      <p className="text-2xl font-bold text-red-600">{stats?.unreadMessages || 0}</p>
                    </div>
                    <MessageSquare className="w-8 h-8 text-red-600" />
                  </div>
                </CardContent>
              </Card>
            </>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {user?.userType === 'parent' && (
              <>
                {/* Search Section */}
                <Card className="mb-8">
                  <CardHeader>
                    <CardTitle>Find Nannies</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <SearchForm />
                  </CardContent>
                </Card>

                {/* Featured Nannies */}
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle>Featured Nannies</CardTitle>
                    <Link href="/search">
                      <Button variant="outline" size="sm">View All</Button>
                    </Link>
                  </CardHeader>
                  <CardContent>
                    {nanniesLoading ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {Array.from({ length: 4 }, (_, i) => (
                          <div key={i} className="p-4 border rounded-lg">
                            <div className="flex items-center mb-3">
                              <Skeleton className="w-12 h-12 rounded-full mr-3" />
                              <div>
                                <Skeleton className="h-4 w-24 mb-1" />
                                <Skeleton className="h-3 w-20" />
                              </div>
                            </div>
                            <Skeleton className="h-20 w-full" />
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {(nannies || []).slice(0, 4).map((nanny: any) => (
                          <NannyCard key={nanny.user.id} nanny={nanny} compact />
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </>
            )}

            {user?.userType === 'nanny' && (
              <Card>
                <CardHeader>
                  <CardTitle>Recent Bookings</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8">
                    <Clock className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500 mb-4">No recent bookings</p>
                    <Link href="/dashboard/nanny">
                      <Button>View Dashboard</Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {user?.userType === 'parent' ? (
                  <>
                    <Link href="/search">
                      <Button className="w-full">Search Nannies</Button>
                    </Link>
                    <Link href="/dashboard/parent">
                      <Button variant="outline" className="w-full">My Dashboard</Button>
                    </Link>
                  </>
                ) : (
                  <>
                    <Link href="/dashboard/nanny">
                      <Button className="w-full">My Dashboard</Button>
                    </Link>
                    <Button variant="outline" className="w-full">Update Profile</Button>
                  </>
                )}
              </CardContent>
            </Card>

            {/* Recent Messages */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Recent Messages</CardTitle>
                <Badge variant="secondary">{stats?.unreadMessages || 0}</Badge>
              </CardHeader>
              <CardContent>
                {conversationsLoading ? (
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
                ) : conversations && conversations.length > 0 ? (
                  <div className="space-y-3">
                    {conversations.slice(0, 5).map((conv: any) => (
                      <div key={conv.user.id} className="flex items-center space-x-3 p-2 hover:bg-gray-50 rounded-lg cursor-pointer">
                        <img 
                          src={conv.user.profileImageUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${conv.user.firstName}`}
                          alt={`${conv.user.firstName} ${conv.user.lastName}`}
                          className="w-10 h-10 rounded-full object-cover"
                        />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 truncate">
                            {conv.user.firstName} {conv.user.lastName}
                          </p>
                          <p className="text-xs text-gray-500 truncate">
                            {conv.lastMessage.content}
                          </p>
                        </div>
                        {conv.unreadCount > 0 && (
                          <Badge variant="destructive" className="text-xs">
                            {conv.unreadCount}
                          </Badge>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-4">
                    <MessageSquare className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-sm text-gray-500">No messages yet</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Safety Tips */}
            <Card>
              <CardHeader>
                <CardTitle>Safety Tips</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="text-sm text-gray-600 space-y-2">
                  <li>• Always verify nanny credentials</li>
                  <li>• Conduct interviews in person</li>
                  <li>• Check references thoroughly</li>
                  <li>• Use our secure messaging system</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
