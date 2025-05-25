import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Link, useLocation } from "wouter";
import { Eye, EyeOff, Upload, Camera, FileText, Loader2, Baby } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { UGANDA_DISTRICTS } from "@/lib/constants";

const signupSchema = z.object({
  firstName: z.string().min(2, "First name must be at least 2 characters"),
  lastName: z.string().min(2, "Last name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  phoneNumber: z.string().min(10, "Phone number must be at least 10 digits"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  confirmPassword: z.string(),
  userType: z.enum(["parent", "nanny"]),
  district: z.string().min(1, "Please select your district"),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type SignupForm = z.infer<typeof signupSchema>;

export default function SignupPage() {
  const [, setLocation] = useLocation();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [profilePhoto, setProfilePhoto] = useState<File | null>(null);
  const [nationalId, setNationalId] = useState<File | null>(null);
  const [profilePhotoPreview, setProfilePhotoPreview] = useState<string | null>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const form = useForm<SignupForm>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phoneNumber: "",
      password: "",
      confirmPassword: "",
      userType: "parent",
      district: "",
    },
  });

  const signupMutation = useMutation({
    mutationFn: async (data: SignupForm & { profilePhoto?: File; nationalId?: File }) => {
      const formData = new FormData();
      
      // Add form data
      Object.entries(data).forEach(([key, value]) => {
        if (key !== 'profilePhoto' && key !== 'nationalId' && key !== 'confirmPassword') {
          formData.append(key, value as string);
        }
      });

      // Add files
      if (data.profilePhoto) {
        formData.append('profilePhoto', data.profilePhoto);
      }
      if (data.nationalId) {
        formData.append('nationalId', data.nationalId);
      }

      return apiRequest('/api/auth/signup', {
        method: 'POST',
        body: formData,
      });
    },
    onSuccess: () => {
      toast({
        title: "Account created successfully!",
        description: "Please check your email to verify your account.",
      });
      setLocation("/login");
    },
    onError: (error: any) => {
      toast({
        title: "Signup failed",
        description: error.message || "Something went wrong. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleProfilePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        toast({
          title: "File too large",
          description: "Profile photo must be less than 5MB",
          variant: "destructive",
        });
        return;
      }
      
      setProfilePhoto(file);
      const reader = new FileReader();
      reader.onload = (e) => setProfilePhotoPreview(e.target?.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleNationalIdChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) { // 10MB limit
        toast({
          title: "File too large",
          description: "National ID document must be less than 10MB",
          variant: "destructive",
        });
        return;
      }
      setNationalId(file);
    }
  };

  const onSubmit = (data: SignupForm) => {
    signupMutation.mutate({
      ...data,
      profilePhoto: profilePhoto || undefined,
      nationalId: nationalId || undefined,
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      {/* Navigation Header */}
      <div className="flex justify-between items-center p-6">
        <Link href="/" className="flex items-center space-x-2 text-blue-600 hover:text-blue-700 transition-colors">
          <Baby className="h-8 w-8" />
          <span className="text-xl font-bold">NannyCare</span>
        </Link>
        <Link href="/login" className="text-gray-600 hover:text-gray-800 transition-colors">
          Already have an account?
        </Link>
      </div>

      <div className="flex items-center justify-center p-4">
        <Card className="w-full max-w-2xl">
          <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold text-blue-600 dark:text-blue-400">
            Join NannyCare Uganda
          </CardTitle>
          <CardDescription className="text-lg">
            Create your account to connect with trusted nannies or offer your services
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {/* User Type Selection */}
              <FormField
                control={form.control}
                name="userType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>I am a</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select account type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="parent">Parent (Looking for nanny)</SelectItem>
                        <SelectItem value="nanny">Nanny (Offering services)</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Name Fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="firstName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>First Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter your first name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="lastName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Last Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter your last name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Contact Information */}
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email Address</FormLabel>
                    <FormControl>
                      <Input type="email" placeholder="Enter your email" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="phoneNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone Number</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter your phone number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Location */}
              <FormField
                control={form.control}
                name="district"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>District</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select your district" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {UGANDA_DISTRICTS.map((district) => (
                          <SelectItem key={district.name} value={district.name}>
                            {district.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Password Fields */}
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          type={showPassword ? "text" : "password"}
                          placeholder="Create a password"
                          {...field}
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? (
                            <EyeOff className="h-4 w-4" />
                          ) : (
                            <Eye className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Confirm Password</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          type={showConfirmPassword ? "text" : "password"}
                          placeholder="Confirm your password"
                          {...field}
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        >
                          {showConfirmPassword ? (
                            <EyeOff className="h-4 w-4" />
                          ) : (
                            <Eye className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* File Uploads */}
              <div className="space-y-4">
                <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6">
                  <Label className="text-base font-medium mb-4 block">
                    Profile Photo {form.watch("userType") === "nanny" && "(Required for nannies)"}
                  </Label>
                  {profilePhotoPreview ? (
                    <div className="flex items-center space-x-4">
                      <img
                        src={profilePhotoPreview}
                        alt="Profile preview"
                        className="w-20 h-20 rounded-full object-cover"
                      />
                      <div>
                        <p className="text-sm text-green-600 dark:text-green-400">Photo uploaded</p>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setProfilePhoto(null);
                            setProfilePhotoPreview(null);
                          }}
                        >
                          Remove
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center">
                      <Camera className="mx-auto h-12 w-12 text-gray-400 dark:text-gray-500" />
                      <div className="mt-2">
                        <Label htmlFor="profilePhoto" className="cursor-pointer">
                          <span className="mt-2 block text-sm font-medium text-gray-900 dark:text-gray-100">
                            Upload profile photo
                          </span>
                        </Label>
                        <Input
                          id="profilePhoto"
                          type="file"
                          accept="image/*"
                          onChange={handleProfilePhotoChange}
                          className="hidden"
                        />
                      </div>
                      <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                        PNG, JPG up to 5MB
                      </p>
                    </div>
                  )}
                </div>

                <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6">
                  <Label className="text-base font-medium mb-4 block">
                    National ID Document {form.watch("userType") === "nanny" && "(Required for verification)"}
                  </Label>
                  {nationalId ? (
                    <div className="flex items-center space-x-4">
                      <FileText className="h-8 w-8 text-blue-500" />
                      <div>
                        <p className="text-sm text-green-600 dark:text-green-400">
                          {nationalId.name} uploaded
                        </p>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => setNationalId(null)}
                        >
                          Remove
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center">
                      <Upload className="mx-auto h-12 w-12 text-gray-400 dark:text-gray-500" />
                      <div className="mt-2">
                        <Label htmlFor="nationalId" className="cursor-pointer">
                          <span className="mt-2 block text-sm font-medium text-gray-900 dark:text-gray-100">
                            Upload National ID
                          </span>
                        </Label>
                        <Input
                          id="nationalId"
                          type="file"
                          accept="image/*,.pdf"
                          onChange={handleNationalIdChange}
                          className="hidden"
                        />
                      </div>
                      <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                        Image or PDF up to 10MB
                      </p>
                    </div>
                  )}
                </div>
              </div>

              <Button 
                type="submit" 
                className="w-full" 
                disabled={signupMutation.isPending}
                size="lg"
              >
                {signupMutation.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating Account...
                  </>
                ) : (
                  "Create Account"
                )}
              </Button>

              <div className="text-center">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Already have an account?{" "}
                  <Link href="/login" className="text-blue-600 hover:underline dark:text-blue-400">
                    Sign in here
                  </Link>
                </p>
              </div>
            </form>
          </Form>
        </CardContent>
        </Card>
      </div>
    </div>
  );
}