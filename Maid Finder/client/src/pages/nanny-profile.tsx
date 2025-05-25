import { useParams } from "wouter";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import Header from "@/components/header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { queryClient } from "@/lib/queryClient";
import { 
  Star, 
  MapPin, 
  Clock, 
  Heart, 
  MessageSquare, 
  Shield, 
  IdCard, 
  BookOpen, 
  Users, 
  DollarSign,
  Calendar
} from "lucide-react";

export default function NannyProfile() {
  const params = useParams();
  const { user } = useAuth();
  const { toast } = useToast();
  const userId = params.userId;

  const { data: nannyProfile, isLoading } = useQuery({
    queryKey: [`/api/profiles/nanny/${userId}`],
    enabled: !!userId,
  });

  const { data: reviews, isLoading: reviewsLoading } = useQuery({
    queryKey: [`/api/reviews/nanny/${userId}`],
    enabled: !!userId,
  });

  const { data: favoriteStatus } = useQuery({
    queryKey: [`/api/favorites/check/${userId}`],
    enabled: !!userId && user?.userType === 'parent',
  });

  const favoriteMutation = useMutation({
    mutationFn: async () => {
      if (favoriteStatus?.isFavorite) {
        return apiRequest('DELETE', `/api/favorites/${userId}`);
      } else {
        return apiRequest('POST', '/api/favorites', { nannyId: userId });
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/favorites/check/${userId}`] });
      queryClient.invalidateQueries({ queryKey: ['/api/favorites'] });
      toast({
        title: favoriteStatus?.isFavorite ? "Removed from favorites" : "Added to favorites",
        description: favoriteStatus?.isFavorite 
          ? "This nanny has been removed from your favorites"
          : "This nanny has been added to your favorites",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update favorites. Please try again.",
        variant: "destructive",
      });
    },
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-start space-x-4 mb-6">
                    <Skeleton className="w-24 h-24 rounded-full" />
                    <div className="flex-1">
                      <Skeleton className="h-6 w-48 mb-2" />
                      <Skeleton className="h-4 w-32 mb-2" />
                      <Skeleton className="h-4 w-40" />
                    </div>
                  </div>
                  <Skeleton className="h-32 w-full" />
                </CardContent>
              </Card>
            </div>
            <div>
              <Skeleton className="h-80 w-full" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!nannyProfile) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Card>
            <CardContent className="p-8 text-center">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Nanny Not Found</h2>
              <p className="text-gray-600">The nanny profile you're looking for doesn't exist.</p>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  const { user: nannyUser, ...profile } = nannyProfile;
  const avgRating = reviews?.length ? reviews.reduce((sum: number, review: any) => sum + review.rating, 0) / reviews.length : 0;

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Profile Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Header Card */}
            <Card>
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-6">
                  <div className="flex items-start space-x-4">
                    <Avatar className="w-24 h-24">
                      <AvatarImage 
                        src={nannyUser.profileImageUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${nannyUser.firstName}`}
                        alt={`${nannyUser.firstName} ${nannyUser.lastName}`}
                      />
                      <AvatarFallback>
                        {nannyUser.firstName?.[0]}{nannyUser.lastName?.[0]}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <h1 className="text-3xl font-bold text-gray-900 mb-2">
                        {nannyUser.firstName} {nannyUser.lastName}
                      </h1>
                      <div className="flex items-center text-gray-600 mb-2">
                        <MapPin className="w-4 h-4 mr-1" />
                        {profile.district}, {profile.region}
                      </div>
                      <div className="flex items-center mb-4">
                        <div className="flex items-center mr-4">
                          {Array.from({ length: 5 }, (_, i) => (
                            <Star 
                              key={i} 
                              className={`w-4 h-4 ${i < Math.floor(avgRating) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} 
                            />
                          ))}
                          <span className="ml-2 text-sm text-gray-600">
                            {avgRating.toFixed(1)} ({reviews?.length || 0} reviews)
                          </span>
                        </div>
                        <div className="flex items-center text-gray-600">
                          <Clock className="w-4 h-4 mr-1" />
                          {profile.experience} years experience
                        </div>
                      </div>
                      
                      {/* Verification Badges */}
                      <div className="flex flex-wrap gap-2">
                        {profile.isVerified && (
                          <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                            <Shield className="w-3 h-3 mr-1" />
                            Verified
                          </Badge>
                        )}
                        {profile.backgroundCheck && (
                          <Badge variant="secondary" className="bg-green-100 text-green-800">
                            <IdCard className="w-3 h-3 mr-1" />
                            Background Check
                          </Badge>
                        )}
                        {profile.firstAidCertified && (
                          <Badge variant="secondary" className="bg-red-100 text-red-800">
                            <Heart className="w-3 h-3 mr-1" />
                            First Aid Certified
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>

                  {user?.userType === 'parent' && (
                    <div className="flex space-x-2">
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => favoriteMutation.mutate()}
                        disabled={favoriteMutation.isPending}
                      >
                        <Heart className={`w-4 h-4 ${favoriteStatus?.isFavorite ? 'fill-current text-red-500' : ''}`} />
                      </Button>
                      <Button>
                        <MessageSquare className="w-4 h-4 mr-2" />
                        Message
                      </Button>
                    </div>
                  )}
                </div>

                {/* Bio */}
                {profile.bio && (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">About Me</h3>
                    <p className="text-gray-600 leading-relaxed">{profile.bio}</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Services & Skills */}
            <Card>
              <CardHeader>
                <CardTitle>Services & Skills</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Services */}
                {profile.services && profile.services.length > 0 && (
                  <div>
                    <h4 className="font-medium text-gray-900 mb-3 flex items-center">
                      <BookOpen className="w-4 h-4 mr-2" />
                      Services Offered
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {profile.services.map((service: string) => (
                        <Badge key={service} variant="outline">{service}</Badge>
                      ))}
                    </div>
                  </div>
                )}

                {/* Age Groups */}
                {profile.ageGroups && profile.ageGroups.length > 0 && (
                  <div>
                    <h4 className="font-medium text-gray-900 mb-3 flex items-center">
                      <Users className="w-4 h-4 mr-2" />
                      Age Groups
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {profile.ageGroups.map((age: string) => (
                        <Badge key={age} variant="outline">{age}</Badge>
                      ))}
                    </div>
                  </div>
                )}

                {/* Languages */}
                {profile.languages && profile.languages.length > 0 && (
                  <div>
                    <h4 className="font-medium text-gray-900 mb-3">Languages</h4>
                    <div className="flex flex-wrap gap-2">
                      {profile.languages.map((language: string) => (
                        <Badge key={language} variant="outline">{language}</Badge>
                      ))}
                    </div>
                  </div>
                )}

                {/* Availability */}
                {profile.availability && profile.availability.length > 0 && (
                  <div>
                    <h4 className="font-medium text-gray-900 mb-3 flex items-center">
                      <Calendar className="w-4 h-4 mr-2" />
                      Availability
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {profile.availability.map((time: string) => (
                        <Badge key={time} variant="outline">{time}</Badge>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Reviews */}
            <Card>
              <CardHeader>
                <CardTitle>Reviews ({reviews?.length || 0})</CardTitle>
              </CardHeader>
              <CardContent>
                {reviewsLoading ? (
                  <div className="space-y-4">
                    {Array.from({ length: 3 }, (_, i) => (
                      <div key={i} className="space-y-2">
                        <div className="flex items-center space-x-2">
                          <Skeleton className="w-8 h-8 rounded-full" />
                          <Skeleton className="h-4 w-24" />
                          <Skeleton className="h-4 w-16" />
                        </div>
                        <Skeleton className="h-16 w-full" />
                      </div>
                    ))}
                  </div>
                ) : reviews && reviews.length > 0 ? (
                  <div className="space-y-6">
                    {reviews.map((review: any) => (
                      <div key={review.id}>
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
                        <Separator />
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Star className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500">No reviews yet</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Rates */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <DollarSign className="w-5 h-5 mr-2" />
                  Rates
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {profile.hourlyRate && (
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Hourly Rate</span>
                    <span className="font-semibold text-lg">UGX {parseFloat(profile.hourlyRate).toLocaleString()}</span>
                  </div>
                )}
                {profile.monthlyRate && (
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Monthly Rate</span>
                    <span className="font-semibold text-lg">UGX {parseFloat(profile.monthlyRate).toLocaleString()}</span>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Contact Actions */}
            {user?.userType === 'parent' && (
              <Card>
                <CardHeader>
                  <CardTitle>Get Started</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button className="w-full">
                    <MessageSquare className="w-4 h-4 mr-2" />
                    Send Message
                  </Button>
                  <Button variant="outline" className="w-full">
                    <Calendar className="w-4 h-4 mr-2" />
                    Book Interview
                  </Button>
                  <Button variant="outline" className="w-full">
                    Request Background Check
                  </Button>
                </CardContent>
              </Card>
            )}

            {/* Safety Features */}
            <Card>
              <CardHeader>
                <CardTitle>Safety Features</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <div className={`w-4 h-4 rounded-full ${profile.isVerified ? 'bg-green-500' : 'bg-gray-300'}`} />
                    <span className="text-sm">Identity Verified</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className={`w-4 h-4 rounded-full ${profile.backgroundCheck ? 'bg-green-500' : 'bg-gray-300'}`} />
                    <span className="text-sm">Background Check</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className={`w-4 h-4 rounded-full ${profile.firstAidCertified ? 'bg-green-500' : 'bg-gray-300'}`} />
                    <span className="text-sm">First Aid Certified</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Report */}
            <Card>
              <CardContent className="p-4 text-center">
                <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700">
                  Report Profile
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
