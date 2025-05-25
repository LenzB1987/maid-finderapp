import { useQuery } from "@tanstack/react-query";
import Header from "@/components/header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  Users, 
  UserCheck, 
  DollarSign, 
  TrendingUp,
  Shield,
  AlertTriangle,
  Eye,
  Edit,
  Trash2,
  CheckCircle,
  XCircle
} from "lucide-react";

export default function AdminDashboard() {
  // Mock data for admin dashboard
  const adminStats = {
    totalUsers: 1245,
    totalNannies: 892,
    totalParents: 353,
    pendingVerifications: 23,
    totalBookings: 1567,
    activeBookings: 89,
    totalRevenue: 45670000,
    monthlyGrowth: 12.5,
  };

  const pendingVerifications = [
    {
      id: 1,
      name: "Sarah Nakamya",
      type: "nanny",
      email: "sarah.nakamya@email.com",
      submittedAt: "2024-01-15T10:30:00Z",
      documents: ["ID", "Certificate"],
    },
    {
      id: 2,
      name: "Grace Atuhaire",
      type: "nanny",
      email: "grace.atuhaire@email.com",
      submittedAt: "2024-01-14T15:45:00Z",
      documents: ["ID", "References"],
    },
  ];

  const recentUsers = [
    {
      id: 1,
      name: "John Mukasa",
      email: "john.mukasa@email.com",
      type: "parent",
      joinedAt: "2024-01-16T09:00:00Z",
      status: "active",
    },
    {
      id: 2,
      name: "Mary Asiimwe",
      email: "mary.asiimwe@email.com",
      type: "nanny",
      joinedAt: "2024-01-15T14:30:00Z",
      status: "active",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Admin Dashboard</h1>
          <p className="text-gray-600">
            Manage users, monitor platform activity, and oversee platform operations
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Users</p>
                  <p className="text-2xl font-bold text-blue-600">{adminStats.totalUsers.toLocaleString()}</p>
                </div>
                <Users className="w-8 h-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Active Nannies</p>
                  <p className="text-2xl font-bold text-green-600">{adminStats.totalNannies}</p>
                </div>
                <UserCheck className="w-8 h-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Revenue</p>
                  <p className="text-2xl font-bold text-purple-600">
                    UGX {adminStats.totalRevenue.toLocaleString()}
                  </p>
                </div>
                <DollarSign className="w-8 h-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Monthly Growth</p>
                  <p className="text-2xl font-bold text-orange-600">+{adminStats.monthlyGrowth}%</p>
                </div>
                <TrendingUp className="w-8 h-8 text-orange-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full lg:w-auto grid-cols-2 lg:grid-cols-6">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="users">Users</TabsTrigger>
            <TabsTrigger value="verifications">Verifications</TabsTrigger>
            <TabsTrigger value="bookings">Bookings</TabsTrigger>
            <TabsTrigger value="reports">Reports</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Platform Statistics */}
              <Card>
                <CardHeader>
                  <CardTitle>Platform Statistics</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Total Bookings</span>
                      <span className="font-semibold">{adminStats.totalBookings.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Active Bookings</span>
                      <span className="font-semibold">{adminStats.activeBookings}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Nannies</span>
                      <span className="font-semibold">{adminStats.totalNannies}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Parents</span>
                      <span className="font-semibold">{adminStats.totalParents}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Pending Actions */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <AlertTriangle className="w-5 h-5 mr-2 text-yellow-500" />
                    Pending Actions
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
                      <div>
                        <p className="text-sm font-medium text-gray-900">Pending Verifications</p>
                        <p className="text-xs text-gray-600">{adminStats.pendingVerifications} profiles need review</p>
                      </div>
                      <Badge variant="secondary">{adminStats.pendingVerifications}</Badge>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                      <div>
                        <p className="text-sm font-medium text-gray-900">Reported Users</p>
                        <p className="text-xs text-gray-600">3 reports need investigation</p>
                      </div>
                      <Badge variant="destructive">3</Badge>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                      <div>
                        <p className="text-sm font-medium text-gray-900">Support Tickets</p>
                        <p className="text-xs text-gray-600">7 tickets awaiting response</p>
                      </div>
                      <Badge variant="outline">7</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Recent Users */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Users</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {recentUsers.map((user) => (
                    <div key={user.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center space-x-3">
                        <Avatar className="w-10 h-10">
                          <AvatarImage
                            src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user.name}`}
                            alt={user.name}
                          />
                          <AvatarFallback>
                            {user.name.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium text-gray-900">{user.name}</p>
                          <p className="text-sm text-gray-600">{user.email}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge variant={user.type === 'nanny' ? 'default' : 'secondary'}>
                          {user.type}
                        </Badge>
                        <Badge variant="outline" className="text-green-600">
                          {user.status}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Users Tab */}
          <TabsContent value="users">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>User Management</CardTitle>
                <div className="flex space-x-2">
                  <Button variant="outline" size="sm">Export</Button>
                  <Button size="sm">Add User</Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12">
                  <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">User Management</h3>
                  <p className="text-gray-500">Detailed user management interface would be implemented here</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Verifications Tab */}
          <TabsContent value="verifications">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Shield className="w-5 h-5 mr-2" />
                  Profile Verifications
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {pendingVerifications.map((verification) => (
                    <div key={verification.id} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center space-x-3">
                          <Avatar className="w-12 h-12">
                            <AvatarImage
                              src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${verification.name}`}
                              alt={verification.name}
                            />
                            <AvatarFallback>
                              {verification.name.split(' ').map(n => n[0]).join('')}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <h4 className="font-medium text-gray-900">{verification.name}</h4>
                            <p className="text-sm text-gray-600">{verification.email}</p>
                          </div>
                        </div>
                        <Badge variant="outline">{verification.type}</Badge>
                      </div>
                      
                      <div className="mb-4">
                        <p className="text-sm text-gray-600 mb-2">Submitted Documents:</p>
                        <div className="flex space-x-2">
                          {verification.documents.map((doc) => (
                            <Badge key={doc} variant="secondary">{doc}</Badge>
                          ))}
                        </div>
                      </div>

                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-500">
                          Submitted: {new Date(verification.submittedAt).toLocaleDateString()}
                        </span>
                        <div className="flex space-x-2">
                          <Button variant="outline" size="sm">
                            <Eye className="w-4 h-4 mr-1" />
                            Review
                          </Button>
                          <Button variant="default" size="sm">
                            <CheckCircle className="w-4 h-4 mr-1" />
                            Approve
                          </Button>
                          <Button variant="destructive" size="sm">
                            <XCircle className="w-4 h-4 mr-1" />
                            Reject
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Bookings Tab */}
          <TabsContent value="bookings">
            <Card>
              <CardHeader>
                <CardTitle>Booking Management</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12">
                  <DollarSign className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Booking Management</h3>
                  <p className="text-gray-500">Detailed booking management interface would be implemented here</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Reports Tab */}
          <TabsContent value="reports">
            <Card>
              <CardHeader>
                <CardTitle>Analytics & Reports</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12">
                  <TrendingUp className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Analytics & Reports</h3>
                  <p className="text-gray-500">Detailed analytics and reporting interface would be implemented here</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings">
            <Card>
              <CardHeader>
                <CardTitle>Platform Settings</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12">
                  <Shield className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Platform Settings</h3>
                  <p className="text-gray-500">Platform configuration and settings would be implemented here</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
