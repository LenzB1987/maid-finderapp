import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import Header from "@/components/header";
import NannyCard from "@/components/nanny-card";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Skeleton } from "@/components/ui/skeleton";
import { Search, Filter, MapPin, Star } from "lucide-react";
import { UGANDA_DISTRICTS, SERVICE_TYPES } from "@/lib/constants";

export default function SearchPage() {
  const [filters, setFilters] = useState({
    district: "",
    region: "",
    serviceType: "",
    minRate: "",
    maxRate: "",
    isVerified: false,
    backgroundCheck: false,
    firstAidCertified: false,
    experience: "",
    ageGroups: [] as string[],
    languages: [] as string[],
    availability: "",
    search: "",
    sortBy: "rating", // rating, experience, rate, newest
  });

  const [currentPage, setCurrentPage] = useState(0);
  const limit = 12;

  const queryParams = new URLSearchParams();
  if (filters.district) queryParams.set('district', filters.district);
  if (filters.region) queryParams.set('region', filters.region);
  if (filters.serviceType) queryParams.set('serviceType', filters.serviceType);
  if (filters.minRate) queryParams.set('minRate', filters.minRate);
  if (filters.maxRate) queryParams.set('maxRate', filters.maxRate);
  if (filters.isVerified) queryParams.set('isVerified', 'true');
  if (filters.backgroundCheck) queryParams.set('backgroundCheck', 'true');
  if (filters.firstAidCertified) queryParams.set('firstAidCertified', 'true');
  if (filters.experience) queryParams.set('experience', filters.experience);
  if (filters.ageGroups.length > 0) queryParams.set('ageGroups', filters.ageGroups.join(','));
  if (filters.languages.length > 0) queryParams.set('languages', filters.languages.join(','));
  if (filters.availability) queryParams.set('availability', filters.availability);
  if (filters.search) queryParams.set('search', filters.search);
  if (filters.sortBy) queryParams.set('sortBy', filters.sortBy);
  queryParams.set('limit', limit.toString());
  queryParams.set('offset', (currentPage * limit).toString());

  const { data: nannies, isLoading, error } = useQuery({
    queryKey: [`/api/nannies/search?${queryParams.toString()}`],
  });

  const handleFilterChange = (key: string, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    setCurrentPage(0); // Reset to first page when filters change
  };

  const clearFilters = () => {
    setFilters({
      district: "",
      region: "",
      serviceType: "",
      minRate: "",
      maxRate: "",
      isVerified: false,
      backgroundCheck: false,
      firstAidCertified: false,
      experience: "",
      ageGroups: [],
      languages: [],
      availability: "",
      search: "",
      sortBy: "rating",
      region: "",
      serviceType: "",
      minRate: "",
      maxRate: "",
      isVerified: false,
      search: "",
    });
    setCurrentPage(0);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Find Nannies</h1>
          <p className="text-gray-600">Discover trusted childcare professionals in your area</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Filters Sidebar */}
          <div className="lg:col-span-1">
            <Card className="sticky top-4">
              <CardHeader className="flex flex-row items-center justify-between pb-3">
                <CardTitle className="flex items-center">
                  <Filter className="w-5 h-5 mr-2" />
                  Filters
                </CardTitle>
                <Button variant="ghost" size="sm" onClick={clearFilters}>
                  Clear
                </Button>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Search */}
                <div>
                  <Label htmlFor="search">Search</Label>
                  <div className="relative mt-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                      id="search"
                      placeholder="Search by name or skills..."
                      value={filters.search}
                      onChange={(e) => handleFilterChange('search', e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>

                {/* Location */}
                <div>
                  <Label>District</Label>
                  <Select value={filters.district} onValueChange={(value) => handleFilterChange('district', value)}>
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Select district" />
                    </SelectTrigger>
                    <SelectContent>
                      {UGANDA_DISTRICTS.map((district) => (
                        <SelectItem key={district.name} value={district.name}>
                          <div className="flex items-center">
                            <MapPin className="w-4 h-4 mr-2" />
                            {district.name}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Service Type */}
                <div>
                  <Label>Service Type</Label>
                  <Select value={filters.serviceType} onValueChange={(value) => handleFilterChange('serviceType', value)}>
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Select service" />
                    </SelectTrigger>
                    <SelectContent>
                      {SERVICE_TYPES.map((service) => (
                        <SelectItem key={service} value={service}>{service}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Rate Range */}
                <div>
                  <Label>Hourly Rate (UGX)</Label>
                  <div className="grid grid-cols-2 gap-2 mt-1">
                    <Input
                      placeholder="Min"
                      type="number"
                      value={filters.minRate}
                      onChange={(e) => handleFilterChange('minRate', e.target.value)}
                    />
                    <Input
                      placeholder="Max"
                      type="number"
                      value={filters.maxRate}
                      onChange={(e) => handleFilterChange('maxRate', e.target.value)}
                    />
                  </div>
                </div>

                {/* Verified Only */}
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="verified"
                    checked={filters.isVerified}
                    onCheckedChange={(checked) => handleFilterChange('isVerified', checked)}
                  />
                  <Label htmlFor="verified" className="flex items-center text-sm">
                    <Star className="w-4 h-4 mr-1" />
                    Verified nannies only
                  </Label>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Results */}
          <div className="lg:col-span-3">
            {/* Results Header */}
            <div className="flex items-center justify-between mb-6">
              <p className="text-gray-600">
                {nannies ? `${nannies.length} nannies found` : 'Searching...'}
              </p>
              <Select defaultValue="rating">
                <SelectTrigger className="w-48">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="rating">Highest Rated</SelectItem>
                  <SelectItem value="rate-low">Lowest Rate</SelectItem>
                  <SelectItem value="rate-high">Highest Rate</SelectItem>
                  <SelectItem value="experience">Most Experience</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Loading State */}
            {isLoading && (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
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
            )}

            {/* Error State */}
            {error && (
              <Card>
                <CardContent className="p-8 text-center">
                  <p className="text-red-600 mb-4">Failed to load nannies. Please try again.</p>
                  <Button onClick={() => window.location.reload()}>Retry</Button>
                </CardContent>
              </Card>
            )}

            {/* No Results */}
            {!isLoading && !error && nannies && nannies.length === 0 && (
              <Card>
                <CardContent className="p-8 text-center">
                  <Search className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">No nannies found</h3>
                  <p className="text-gray-600 mb-4">Try adjusting your filters or search criteria</p>
                  <Button onClick={clearFilters}>Clear Filters</Button>
                </CardContent>
              </Card>
            )}

            {/* Results Grid */}
            {!isLoading && !error && nannies && nannies.length > 0 && (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 mb-8">
                  {nannies.map((nanny: any) => (
                    <NannyCard key={nanny.user.id} nanny={nanny} />
                  ))}
                </div>

                {/* Pagination */}
                {nannies.length === limit && (
                  <div className="flex justify-center">
                    <div className="flex space-x-2">
                      <Button
                        variant="outline"
                        onClick={() => setCurrentPage(Math.max(0, currentPage - 1))}
                        disabled={currentPage === 0}
                      >
                        Previous
                      </Button>
                      <span className="flex items-center px-4 py-2 text-sm text-gray-600">
                        Page {currentPage + 1}
                      </span>
                      <Button
                        variant="outline"
                        onClick={() => setCurrentPage(currentPage + 1)}
                        disabled={nannies.length < limit}
                      >
                        Next
                      </Button>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
