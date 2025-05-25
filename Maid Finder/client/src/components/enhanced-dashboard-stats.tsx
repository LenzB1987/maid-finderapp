import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  Users, 
  Star, 
  Calendar,
  MessageSquare,
  Heart,
  Clock,
  CheckCircle,
  Award
} from "lucide-react";

interface DashboardStatsProps {
  userType: "parent" | "nanny" | "admin";
  userId?: string;
}

export default function EnhancedDashboardStats({ userType, userId }: DashboardStatsProps) {
  const { data: stats, isLoading } = useQuery({
    queryKey: ["/api/dashboard/stats", userType, userId],
  });

  const { data: recentActivity, isLoading: activityLoading } = useQuery({
    queryKey: ["/api/dashboard/activity", userType, userId],
  });

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {Array.from({ length: 4 }, (_, i) => (
          <Card key={i}>
            <CardContent className="p-6">
              <Skeleton className="h-4 w-20 mb-2" />
              <Skeleton className="h-8 w-16 mb-2" />
              <Skeleton className="h-3 w-24" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  const renderParentStats = () => (
    <>
      <Card className="border-blue-200">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-blue-600">Active Bookings</p>
              <p className="text-3xl font-bold">{stats?.activeBookings || 0}</p>
              <p className="text-xs text-gray-500 flex items-center mt-1">
                <TrendingUp className="w-3 h-3 mr-1 text-green-500" />
                +2 this month
              </p>
            </div>
            <Calendar className="w-8 h-8 text-blue-600" />
          </div>
        </CardContent>
      </Card>

      <Card className="border-green-200">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-green-600">Total Spent</p>
              <p className="text-3xl font-bold">UGX {(stats?.totalSpent || 0).toLocaleString()}</p>
              <p className="text-xs text-gray-500 flex items-center mt-1">
                <Clock className="w-3 h-3 mr-1" />
                Last 30 days
              </p>
            </div>
            <DollarSign className="w-8 h-8 text-green-600" />
          </div>
        </CardContent>
      </Card>

      <Card className="border-pink-200">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-pink-600">Favorite Nannies</p>
              <p className="text-3xl font-bold">{stats?.favoriteNannies || 0}</p>
              <p className="text-xs text-gray-500">Saved for later</p>
            </div>
            <Heart className="w-8 h-8 text-pink-600" />
          </div>
        </CardContent>
      </Card>

      <Card className="border-purple-200">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-purple-600">Messages</p>
              <p className="text-3xl font-bold">{stats?.unreadMessages || 0}</p>
              <p className="text-xs text-gray-500">Unread conversations</p>
            </div>
            <MessageSquare className="w-8 h-8 text-purple-600" />
          </div>
        </CardContent>
      </Card>
    </>
  );

  const renderNannyStats = () => (
    <>
      <Card className="border-green-200">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-green-600">Monthly Earnings</p>
              <p className="text-3xl font-bold">UGX {(stats?.totalEarnings || 0).toLocaleString()}</p>
              <p className="text-xs text-gray-500 flex items-center mt-1">
                <TrendingUp className="w-3 h-3 mr-1 text-green-500" />
                +15% from last month
              </p>
            </div>
            <DollarSign className="w-8 h-8 text-green-600" />
          </div>
        </CardContent>
      </Card>

      <Card className="border-blue-200">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-blue-600">Active Jobs</p>
              <p className="text-3xl font-bold">{stats?.activeBookings || 0}</p>
              <p className="text-xs text-gray-500">Current assignments</p>
            </div>
            <Calendar className="w-8 h-8 text-blue-600" />
          </div>
        </CardContent>
      </Card>

      <Card className="border-yellow-200">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-yellow-600">Rating</p>
              <p className="text-3xl font-bold">{stats?.avgRating || 0}</p>
              <div className="flex items-center mt-1">
                <div className="flex">
                  {Array.from({ length: 5 }, (_, i) => (
                    <Star key={i} className={`w-3 h-3 ${i < Math.floor(stats?.avgRating || 0) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} />
                  ))}
                </div>
                <span className="text-xs text-gray-500 ml-2">({stats?.reviewCount || 0} reviews)</span>
              </div>
            </div>
            <Star className="w-8 h-8 text-yellow-600" />
          </div>
        </CardContent>
      </Card>

      <Card className="border-purple-200">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-purple-600">Completed Jobs</p>
              <p className="text-3xl font-bold">{stats?.completedJobs || 0}</p>
              <p className="text-xs text-gray-500">All time</p>
            </div>
            <CheckCircle className="w-8 h-8 text-purple-600" />
          </div>
        </CardContent>
      </Card>
    </>
  );

  const renderAdminStats = () => (
    <>
      <Card className="border-blue-200">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-blue-600">Total Users</p>
              <p className="text-3xl font-bold">{stats?.totalUsers || 0}</p>
              <p className="text-xs text-gray-500 flex items-center mt-1">
                <TrendingUp className="w-3 h-3 mr-1 text-green-500" />
                +{stats?.newUsersThisMonth || 0} this month
              </p>
            </div>
            <Users className="w-8 h-8 text-blue-600" />
          </div>
        </CardContent>
      </Card>

      <Card className="border-green-200">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-green-600">Platform Revenue</p>
              <p className="text-3xl font-bold">UGX {(stats?.platformRevenue || 0).toLocaleString()}</p>
              <p className="text-xs text-gray-500">This month</p>
            </div>
            <DollarSign className="w-8 h-8 text-green-600" />
          </div>
        </CardContent>
      </Card>

      <Card className="border-purple-200">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-purple-600">Active Bookings</p>
              <p className="text-3xl font-bold">{stats?.totalActiveBookings || 0}</p>
              <p className="text-xs text-gray-500">Platform-wide</p>
            </div>
            <Calendar className="w-8 h-8 text-purple-600" />
          </div>
        </CardContent>
      </Card>

      <Card className="border-yellow-200">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-yellow-600">Avg Rating</p>
              <p className="text-3xl font-bold">{stats?.platformAvgRating || 0}</p>
              <p className="text-xs text-gray-500">Platform average</p>
            </div>
            <Award className="w-8 h-8 text-yellow-600" />
          </div>
        </CardContent>
      </Card>
    </>
  );

  return (
    <div className="space-y-6">
      {/* Main Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {userType === "parent" && renderParentStats()}
        {userType === "nanny" && renderNannyStats()}
        {userType === "admin" && renderAdminStats()}
      </div>

      {/* Performance Metrics */}
      {userType === "nanny" && stats && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Performance This Month</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="flex justify-between text-sm">
                  <span>Booking Rate</span>
                  <span>{stats.bookingRate || 85}%</span>
                </div>
                <Progress value={stats.bookingRate || 85} className="mt-2" />
              </div>
              <div>
                <div className="flex justify-between text-sm">
                  <span>Response Time</span>
                  <span>Excellent</span>
                </div>
                <Progress value={92} className="mt-2" />
              </div>
              <div>
                <div className="flex justify-between text-sm">
                  <span>Customer Satisfaction</span>
                  <span>{stats.avgRating || 4.8}/5.0</span>
                </div>
                <Progress value={(stats.avgRating || 4.8) * 20} className="mt-2" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Achievement Badges</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-4 border rounded-lg">
                  <Award className="w-8 h-8 text-yellow-500 mx-auto mb-2" />
                  <p className="text-sm font-medium">Top Rated</p>
                  <Badge variant="secondary" className="mt-1">4.8+ Rating</Badge>
                </div>
                <div className="text-center p-4 border rounded-lg">
                  <CheckCircle className="w-8 h-8 text-green-500 mx-auto mb-2" />
                  <p className="text-sm font-medium">Reliable</p>
                  <Badge variant="secondary" className="mt-1">95% On-time</Badge>
                </div>
                <div className="text-center p-4 border rounded-lg">
                  <Users className="w-8 h-8 text-blue-500 mx-auto mb-2" />
                  <p className="text-sm font-medium">Popular</p>
                  <Badge variant="secondary" className="mt-1">50+ Bookings</Badge>
                </div>
                <div className="text-center p-4 border rounded-lg">
                  <Heart className="w-8 h-8 text-pink-500 mx-auto mb-2" />
                  <p className="text-sm font-medium">Favorite</p>
                  <Badge variant="secondary" className="mt-1">20+ Saves</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Recent Activity */}
      {!activityLoading && recentActivity && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivity.slice(0, 5).map((activity: any, index: number) => (
                <div key={index} className="flex items-center space-x-3 p-3 border rounded-lg">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">{activity.title}</p>
                    <p className="text-xs text-gray-500">{activity.time}</p>
                  </div>
                  {activity.status && (
                    <Badge variant={activity.status === 'completed' ? 'default' : 'secondary'}>
                      {activity.status}
                    </Badge>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}