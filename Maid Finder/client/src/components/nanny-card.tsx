import { Link } from "wouter";
import { useMutation } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { queryClient } from "@/lib/queryClient";
import { Star, MapPin, Clock, Heart, MessageSquare, Shield, IdCard } from "lucide-react";

interface NannyCardProps {
  nanny: {
    user: {
      id: string;
      firstName: string;
      lastName: string;
      profileImageUrl?: string;
    };
    district: string;
    region: string;
    experience: number;
    hourlyRate?: string;
    monthlyRate?: string;
    ageGroups?: string[];
    services?: string[];
    isVerified: boolean;
    backgroundCheck: boolean;
    firstAidCertified: boolean;
    avgRating?: number;
    reviewCount?: number;
  };
  compact?: boolean;
  isFavorite?: boolean;
}

export default function NannyCard({ nanny, compact = false, isFavorite = false }: NannyCardProps) {
  const { user } = useAuth();
  const { toast } = useToast();

  const favoriteMutation = useMutation({
    mutationFn: async () => {
      if (isFavorite) {
        return apiRequest('DELETE', `/api/favorites/${nanny.user.id}`);
      } else {
        return apiRequest('POST', '/api/favorites', { nannyId: nanny.user.id });
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/favorites/check/${nanny.user.id}`] });
      queryClient.invalidateQueries({ queryKey: ['/api/favorites'] });
      queryClient.invalidateQueries({ queryKey: ['/api/nannies/search'] });
      toast({
        title: isFavorite ? "Removed from favorites" : "Added to favorites",
        description: isFavorite 
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

  const handleFavoriteToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    favoriteMutation.mutate();
  };

  const handleMessageClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    // TODO: Implement messaging functionality
    toast({
      title: "Coming Soon",
      description: "Messaging functionality will be available soon.",
    });
  };

  const avgRating = nanny.avgRating || 0;
  const reviewCount = nanny.reviewCount || 0;

  return (
    <Link href={`/nanny/${nanny.user.id}`}>
      <Card className="hover:shadow-lg transition-shadow cursor-pointer">
        <CardContent className={compact ? "p-4" : "p-6"}>
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center space-x-3 flex-1">
              <Avatar className={compact ? "w-12 h-12" : "w-16 h-16"}>
                <AvatarImage 
                  src={nanny.user.profileImageUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${nanny.user.firstName}`}
                  alt={`${nanny.user.firstName} ${nanny.user.lastName}`}
                />
                <AvatarFallback>
                  {nanny.user.firstName?.[0]}{nanny.user.lastName?.[0]}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <h3 className={`font-semibold text-gray-900 truncate ${compact ? 'text-sm' : 'text-base'}`}>
                  {nanny.user.firstName} {nanny.user.lastName}
                </h3>
                <div className="flex items-center text-gray-600 mb-1">
                  <MapPin className="w-3 h-3 mr-1" />
                  <span className={`text-gray-600 truncate ${compact ? 'text-xs' : 'text-sm'}`}>
                    {nanny.district}, {nanny.region}
                  </span>
                </div>
                <div className="flex items-center">
                  <div className="flex items-center mr-3">
                    {Array.from({ length: 5 }, (_, i) => (
                      <Star 
                        key={i} 
                        className={`w-3 h-3 ${i < Math.floor(avgRating) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} 
                      />
                    ))}
                    <span className={`ml-1 text-gray-600 ${compact ? 'text-xs' : 'text-sm'}`}>
                      {avgRating.toFixed(1)} ({reviewCount})
                    </span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <Clock className="w-3 h-3 mr-1" />
                    <span className={compact ? 'text-xs' : 'text-sm'}>
                      {nanny.experience}y exp
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {user?.userType === 'parent' && !compact && (
              <Button
                variant="ghost"
                size="icon"
                onClick={handleFavoriteToggle}
                disabled={favoriteMutation.isPending}
                className="flex-shrink-0"
              >
                <Heart className={`w-4 h-4 ${isFavorite ? 'fill-current text-red-500' : 'text-gray-400'}`} />
              </Button>
            )}
          </div>
          
          {!compact && (
            <>
              {/* Rate Information */}
              <div className="mb-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">Rate:</span>
                  <div className="text-right">
                    {nanny.hourlyRate && (
                      <div className="text-sm font-semibold text-blue-600">
                        UGX {parseFloat(nanny.hourlyRate).toLocaleString()}/hour
                      </div>
                    )}
                    {nanny.monthlyRate && (
                      <div className="text-xs text-gray-600">
                        UGX {parseFloat(nanny.monthlyRate).toLocaleString()}/month
                      </div>
                    )}
                  </div>
                </div>
                
                {nanny.ageGroups && nanny.ageGroups.length > 0 && (
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-700">Age Groups:</span>
                    <span className="text-sm text-gray-600 text-right">
                      {nanny.ageGroups.slice(0, 2).join(", ")}
                      {nanny.ageGroups.length > 2 && "..."}
                    </span>
                  </div>
                )}
              </div>

              {/* Verification Badges */}
              <div className="flex flex-wrap gap-2 mb-4">
                {nanny.isVerified && (
                  <Badge variant="secondary" className="bg-blue-100 text-blue-800 text-xs">
                    <Shield className="w-3 h-3 mr-1" />
                    Verified
                  </Badge>
                )}
                {nanny.backgroundCheck && (
                  <Badge variant="secondary" className="bg-green-100 text-green-800 text-xs">
                    <IdCard className="w-3 h-3 mr-1" />
                    Background Check
                  </Badge>
                )}
                {nanny.firstAidCertified && (
                  <Badge variant="secondary" className="bg-red-100 text-red-800 text-xs">
                    <Heart className="w-3 h-3 mr-1" />
                    First Aid
                  </Badge>
                )}
                {nanny.services && nanny.services.length > 0 && (
                  <Badge variant="outline" className="text-xs">
                    +{nanny.services.length} services
                  </Badge>
                )}
              </div>
            </>
          )}

          {/* Action Buttons */}
          <div className={`flex gap-3 ${compact ? 'flex-col' : ''}`}>
            <Button className={`flex-1 ${compact ? 'text-xs py-2' : ''}`} asChild>
              <Link href={`/nanny/${nanny.user.id}`}>
                View Profile
              </Link>
            </Button>
            
            {user?.userType === 'parent' && (
              <div className="flex gap-2">
                {compact && (
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={handleFavoriteToggle}
                    disabled={favoriteMutation.isPending}
                    className="flex-shrink-0"
                  >
                    <Heart className={`w-3 h-3 ${isFavorite ? 'fill-current text-red-500' : 'text-gray-400'}`} />
                  </Button>
                )}
                <Button
                  variant="outline"
                  size={compact ? "icon" : "default"}
                  onClick={handleMessageClick}
                  className={compact ? "flex-shrink-0" : ""}
                >
                  <MessageSquare className={`w-4 h-4 ${compact ? '' : 'mr-2'}`} />
                  {!compact && "Message"}
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
