import { useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Search } from "lucide-react";
import { UGANDA_DISTRICTS, SERVICE_TYPES } from "@/lib/constants";

interface SearchFormProps {
  onSearch?: (filters: SearchFilters) => void;
  compact?: boolean;
}

export interface SearchFilters {
  serviceType: string;
  district: string;
  minRate?: string;
  maxRate?: string;
}

export default function SearchForm({ onSearch, compact = false }: SearchFormProps) {
  const [, setLocation] = useLocation();
  const [filters, setFilters] = useState<SearchFilters>({
    serviceType: "",
    district: "",
    minRate: "",
    maxRate: "",
  });

  const handleSearch = () => {
    if (onSearch) {
      onSearch(filters);
    } else {
      // Navigate to search page with filters
      const params = new URLSearchParams();
      if (filters.serviceType) params.set('serviceType', filters.serviceType);
      if (filters.district) params.set('district', filters.district);
      if (filters.minRate) params.set('minRate', filters.minRate);
      if (filters.maxRate) params.set('maxRate', filters.maxRate);
      
      setLocation(`/search?${params.toString()}`);
    }
  };

  const handleFilterChange = (key: keyof SearchFilters, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  if (compact) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Select value={filters.serviceType} onValueChange={(value) => handleFilterChange('serviceType', value)}>
          <SelectTrigger>
            <SelectValue placeholder="Service type" />
          </SelectTrigger>
          <SelectContent>
            {SERVICE_TYPES.map((service) => (
              <SelectItem key={service} value={service}>{service}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={filters.district} onValueChange={(value) => handleFilterChange('district', value)}>
          <SelectTrigger>
            <SelectValue placeholder="District" />
          </SelectTrigger>
          <SelectContent>
            {UGANDA_DISTRICTS.map((district) => (
              <SelectItem key={district.name} value={district.name}>{district.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        <div className="grid grid-cols-2 gap-2">
          <Input
            placeholder="Min rate"
            type="number"
            value={filters.minRate}
            onChange={(e) => handleFilterChange('minRate', e.target.value)}
          />
          <Input
            placeholder="Max rate"
            type="number"
            value={filters.maxRate}
            onChange={(e) => handleFilterChange('maxRate', e.target.value)}
          />
        </div>

        <Button onClick={handleSearch} className="w-full">
          <Search className="w-4 h-4 mr-2" />
          Search
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <Label htmlFor="serviceType">Service Type</Label>
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

        <div>
          <Label htmlFor="district">District</Label>
          <Select value={filters.district} onValueChange={(value) => handleFilterChange('district', value)}>
            <SelectTrigger className="mt-1">
              <SelectValue placeholder="Select district" />
            </SelectTrigger>
            <SelectContent>
              {UGANDA_DISTRICTS.map((district) => (
                <SelectItem key={district.name} value={district.name}>{district.name} District</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label>Rate Range (UGX/hour)</Label>
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
      </div>

      <Button onClick={handleSearch} className="w-full">
        <Search className="w-4 h-4 mr-2" />
        Search Nannies
      </Button>
    </div>
  );
}
