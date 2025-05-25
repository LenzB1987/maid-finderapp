import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { 
  Calendar, 
  Clock, 
  MapPin, 
  User, 
  Phone, 
  Mail, 
  CheckCircle,
  AlertTriangle,
  CreditCard,
  Star
} from "lucide-react";

interface BookingConfirmationProps {
  nanny: {
    user: {
      id: string;
      firstName: string;
      lastName: string;
      email?: string;
      profileImageUrl?: string;
    };
    hourlyRate?: string;
    monthlyRate?: string;
    district: string;
    region: string;
    experience: number;
    avgRating?: number;
    reviewCount?: number;
  };
  trigger?: React.ReactNode;
}

export default function BookingConfirmation({ nanny, trigger }: BookingConfirmationProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState(1); // 1: Details, 2: Payment, 3: Confirmation

  const [bookingData, setBookingData] = useState({
    serviceType: "",
    startDate: "",
    endDate: "",
    startTime: "",
    endTime: "",
    numberOfChildren: "1",
    childrenAges: "",
    specialRequirements: "",
    address: "",
    contactNumber: "",
    rateType: "hourly", // hourly or monthly
    totalAmount: 0,
    duration: 0,
  });

  const createBookingMutation = useMutation({
    mutationFn: async (data: any) => {
      return apiRequest("/api/bookings", "POST", data);
    },
    onSuccess: () => {
      toast({
        title: "Booking Confirmed!",
        description: "Your nanny booking has been successfully created. The nanny will be notified.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/bookings"] });
      setOpen(false);
      setStep(1);
    },
    onError: (error: any) => {
      toast({
        title: "Booking Failed",
        description: error.message || "Something went wrong. Please try again.",
        variant: "destructive",
      });
    },
  });

  const calculateTotal = () => {
    if (bookingData.rateType === "hourly" && nanny.hourlyRate) {
      const hourlyRate = parseInt(nanny.hourlyRate.replace(/[^0-9]/g, ""));
      const startDateTime = new Date(`${bookingData.startDate}T${bookingData.startTime}`);
      const endDateTime = new Date(`${bookingData.endDate}T${bookingData.endTime}`);
      const hours = (endDateTime.getTime() - startDateTime.getTime()) / (1000 * 60 * 60);
      
      if (hours > 0) {
        const total = hours * hourlyRate;
        setBookingData(prev => ({ ...prev, totalAmount: total, duration: hours }));
        return total;
      }
    } else if (bookingData.rateType === "monthly" && nanny.monthlyRate) {
      const monthlyRate = parseInt(nanny.monthlyRate.replace(/[^0-9]/g, ""));
      const startDate = new Date(bookingData.startDate);
      const endDate = new Date(bookingData.endDate);
      const days = (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24);
      const months = days / 30; // Approximate
      
      if (months > 0) {
        const total = months * monthlyRate;
        setBookingData(prev => ({ ...prev, totalAmount: total, duration: months }));
        return total;
      }
    }
    return 0;
  };

  const handleSubmit = () => {
    const total = calculateTotal();
    
    const finalBookingData = {
      nannyId: nanny.user.id,
      serviceType: bookingData.serviceType,
      startDate: bookingData.startDate,
      endDate: bookingData.endDate,
      startTime: bookingData.startTime,
      endTime: bookingData.endTime,
      numberOfChildren: parseInt(bookingData.numberOfChildren),
      childrenAges: bookingData.childrenAges,
      specialRequirements: bookingData.specialRequirements,
      address: bookingData.address,
      contactNumber: bookingData.contactNumber,
      rateType: bookingData.rateType,
      totalAmount: total,
      status: "pending",
    };

    createBookingMutation.mutate(finalBookingData);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-UG', {
      style: 'currency',
      currency: 'UGX',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || <Button>Book Now</Button>}
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Book {nanny.user.firstName} {nanny.user.lastName}</DialogTitle>
        </DialogHeader>

        {/* Progress Steps */}
        <div className="flex items-center justify-center space-x-4 mb-6">
          <div className={`flex items-center ${step >= 1 ? 'text-blue-600' : 'text-gray-400'}`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step >= 1 ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}>
              1
            </div>
            <span className="ml-2 hidden sm:block">Details</span>
          </div>
          <div className="h-px bg-gray-300 w-12"></div>
          <div className={`flex items-center ${step >= 2 ? 'text-blue-600' : 'text-gray-400'}`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step >= 2 ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}>
              2
            </div>
            <span className="ml-2 hidden sm:block">Review</span>
          </div>
          <div className="h-px bg-gray-300 w-12"></div>
          <div className={`flex items-center ${step >= 3 ? 'text-green-600' : 'text-gray-400'}`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step >= 3 ? 'bg-green-600 text-white' : 'bg-gray-200'}`}>
              3
            </div>
            <span className="ml-2 hidden sm:block">Confirm</span>
          </div>
        </div>

        {/* Nanny Info Card */}
        <Card className="mb-6">
          <CardContent className="p-4">
            <div className="flex items-center space-x-4">
              <img 
                src={nanny.user.profileImageUrl || "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&h=150"} 
                alt={`${nanny.user.firstName} ${nanny.user.lastName}`}
                className="w-16 h-16 rounded-full object-cover"
              />
              <div className="flex-1">
                <h3 className="font-semibold text-lg">{nanny.user.firstName} {nanny.user.lastName}</h3>
                <p className="text-gray-600 flex items-center">
                  <MapPin className="w-4 h-4 mr-1" />
                  {nanny.district}, {nanny.region}
                </p>
                <div className="flex items-center space-x-4 mt-1">
                  {nanny.avgRating && (
                    <div className="flex items-center">
                      <Star className="w-4 h-4 text-yellow-400 fill-current mr-1" />
                      <span className="text-sm">{nanny.avgRating} ({nanny.reviewCount} reviews)</span>
                    </div>
                  )}
                  <span className="text-sm text-gray-600">{nanny.experience} years exp.</span>
                </div>
              </div>
              <div className="text-right">
                {nanny.hourlyRate && <p className="font-semibold">UGX {nanny.hourlyRate}/hour</p>}
                {nanny.monthlyRate && <p className="text-sm text-gray-600">UGX {nanny.monthlyRate}/month</p>}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Step 1: Booking Details */}
        {step === 1 && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="serviceType">Service Type</Label>
                <Select value={bookingData.serviceType} onValueChange={(value) => setBookingData(prev => ({ ...prev, serviceType: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select service" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="babysitting">Babysitting</SelectItem>
                    <SelectItem value="full-time">Full-time Care</SelectItem>
                    <SelectItem value="part-time">Part-time Care</SelectItem>
                    <SelectItem value="overnight">Overnight Care</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="rateType">Rate Type</Label>
                <Select value={bookingData.rateType} onValueChange={(value) => setBookingData(prev => ({ ...prev, rateType: value }))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {nanny.hourlyRate && <SelectItem value="hourly">Hourly (UGX {nanny.hourlyRate}/hour)</SelectItem>}
                    {nanny.monthlyRate && <SelectItem value="monthly">Monthly (UGX {nanny.monthlyRate}/month)</SelectItem>}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="startDate">Start Date</Label>
                <Input 
                  type="date" 
                  value={bookingData.startDate}
                  onChange={(e) => setBookingData(prev => ({ ...prev, startDate: e.target.value }))}
                  min={new Date().toISOString().split('T')[0]}
                />
              </div>

              <div>
                <Label htmlFor="endDate">End Date</Label>
                <Input 
                  type="date" 
                  value={bookingData.endDate}
                  onChange={(e) => setBookingData(prev => ({ ...prev, endDate: e.target.value }))}
                  min={bookingData.startDate || new Date().toISOString().split('T')[0]}
                />
              </div>
            </div>

            {bookingData.rateType === "hourly" && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="startTime">Start Time</Label>
                  <Input 
                    type="time" 
                    value={bookingData.startTime}
                    onChange={(e) => setBookingData(prev => ({ ...prev, startTime: e.target.value }))}
                  />
                </div>

                <div>
                  <Label htmlFor="endTime">End Time</Label>
                  <Input 
                    type="time" 
                    value={bookingData.endTime}
                    onChange={(e) => setBookingData(prev => ({ ...prev, endTime: e.target.value }))}
                  />
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="numberOfChildren">Number of Children</Label>
                <Select value={bookingData.numberOfChildren} onValueChange={(value) => setBookingData(prev => ({ ...prev, numberOfChildren: value }))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">1 child</SelectItem>
                    <SelectItem value="2">2 children</SelectItem>
                    <SelectItem value="3">3 children</SelectItem>
                    <SelectItem value="4">4+ children</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="childrenAges">Children's Ages</Label>
                <Input 
                  placeholder="e.g., 2, 5, 8 years old"
                  value={bookingData.childrenAges}
                  onChange={(e) => setBookingData(prev => ({ ...prev, childrenAges: e.target.value }))}
                />
              </div>
            </div>

            <div>
              <Label htmlFor="address">Service Address</Label>
              <Textarea 
                placeholder="Enter the full address where care will be provided"
                value={bookingData.address}
                onChange={(e) => setBookingData(prev => ({ ...prev, address: e.target.value }))}
              />
            </div>

            <div>
              <Label htmlFor="contactNumber">Contact Number</Label>
              <Input 
                placeholder="Your phone number for coordination"
                value={bookingData.contactNumber}
                onChange={(e) => setBookingData(prev => ({ ...prev, contactNumber: e.target.value }))}
              />
            </div>

            <div>
              <Label htmlFor="specialRequirements">Special Requirements (Optional)</Label>
              <Textarea 
                placeholder="Any special needs, preferences, or instructions..."
                value={bookingData.specialRequirements}
                onChange={(e) => setBookingData(prev => ({ ...prev, specialRequirements: e.target.value }))}
              />
            </div>

            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
              <Button 
                onClick={() => setStep(2)}
                disabled={!bookingData.serviceType || !bookingData.startDate || !bookingData.endDate || !bookingData.address || !bookingData.contactNumber}
              >
                Next: Review
              </Button>
            </div>
          </div>
        )}

        {/* Step 2: Review & Payment */}
        {step === 2 && (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <CheckCircle className="w-5 h-5 mr-2 text-green-600" />
                  Booking Summary
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="font-medium">Service:</span>
                    <p className="text-gray-600">{bookingData.serviceType}</p>
                  </div>
                  <div>
                    <span className="font-medium">Duration:</span>
                    <p className="text-gray-600">
                      {bookingData.startDate} to {bookingData.endDate}
                      {bookingData.rateType === "hourly" && bookingData.startTime && (
                        <><br />{bookingData.startTime} - {bookingData.endTime}</>
                      )}
                    </p>
                  </div>
                  <div>
                    <span className="font-medium">Children:</span>
                    <p className="text-gray-600">{bookingData.numberOfChildren} child(ren)</p>
                    {bookingData.childrenAges && <p className="text-gray-600">Ages: {bookingData.childrenAges}</p>}
                  </div>
                  <div>
                    <span className="font-medium">Location:</span>
                    <p className="text-gray-600">{bookingData.address}</p>
                  </div>
                </div>

                {bookingData.specialRequirements && (
                  <div>
                    <span className="font-medium">Special Requirements:</span>
                    <p className="text-gray-600 text-sm">{bookingData.specialRequirements}</p>
                  </div>
                )}

                <Separator />

                <div className="flex justify-between items-center">
                  <div>
                    <span className="font-medium">Total Amount:</span>
                    <p className="text-sm text-gray-600">
                      {bookingData.rateType === "hourly" ? `${bookingData.duration} hours` : `${bookingData.duration.toFixed(1)} months`}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-green-600">{formatCurrency(calculateTotal())}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <AlertTriangle className="w-5 h-5 mr-2 text-yellow-600" />
                  Important Information
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li>• Payment will be processed after the nanny accepts your booking</li>
                  <li>• You can cancel free of charge up to 24 hours before the service starts</li>
                  <li>• The nanny will contact you within 24 hours to confirm details</li>
                  <li>• All payments are secure and protected by our guarantee</li>
                </ul>
              </CardContent>
            </Card>

            <div className="flex justify-between">
              <Button variant="outline" onClick={() => setStep(1)}>Back</Button>
              <Button onClick={handleSubmit} disabled={createBookingMutation.isPending}>
                {createBookingMutation.isPending ? "Processing..." : "Confirm Booking"}
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}