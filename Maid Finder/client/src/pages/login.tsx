import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation } from "@tanstack/react-query";
import { Link, useLocation } from "wouter";
import { Eye, EyeOff, Loader2, Mail, Baby } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

const forgotPasswordSchema = z.object({
  email: z.string().email("Invalid email address"),
});

type LoginForm = z.infer<typeof loginSchema>;
type ForgotPasswordForm = z.infer<typeof forgotPasswordSchema>;

export default function LoginPage() {
  const [, setLocation] = useLocation();
  const [showPassword, setShowPassword] = useState(false);
  const [showForgotDialog, setShowForgotDialog] = useState(false);
  const { toast } = useToast();

  const loginForm = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const forgotForm = useForm<ForgotPasswordForm>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: "",
    },
  });

  const loginMutation = useMutation({
    mutationFn: async (data: LoginForm) => {
      return apiRequest('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
    },
    onSuccess: () => {
      toast({
        title: "Welcome back!",
        description: "You have successfully logged in.",
      });
      setLocation("/");
    },
    onError: (error: any) => {
      toast({
        title: "Login failed",
        description: error.message || "Invalid email or password.",
        variant: "destructive",
      });
    },
  });

  const forgotPasswordMutation = useMutation({
    mutationFn: async (data: ForgotPasswordForm) => {
      return apiRequest('/api/auth/forgot-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
    },
    onSuccess: () => {
      toast({
        title: "Reset link sent!",
        description: "Check your email for password reset instructions.",
      });
      setShowForgotDialog(false);
      forgotForm.reset();
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to send reset email.",
        variant: "destructive",
      });
    },
  });

  const onLogin = (data: LoginForm) => {
    loginMutation.mutate(data);
  };

  const onForgotPassword = (data: ForgotPasswordForm) => {
    forgotPasswordMutation.mutate(data);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      {/* Navigation Header */}
      <div className="flex justify-between items-center p-6">
        <Link href="/" className="flex items-center space-x-2 text-blue-600 hover:text-blue-700 transition-colors">
          <Baby className="h-8 w-8" />
          <span className="text-xl font-bold">NannyCare</span>
        </Link>
        <Link href="/signup" className="text-gray-600 hover:text-gray-800 transition-colors">
          Need an account?
        </Link>
      </div>

      <div className="flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold text-blue-600 dark:text-blue-400">
            Welcome Back
          </CardTitle>
          <CardDescription className="text-lg">
            Sign in to your NannyCare Uganda account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...loginForm}>
            <form onSubmit={loginForm.handleSubmit(onLogin)} className="space-y-6">
              <FormField
                control={loginForm.control}
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
                control={loginForm.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          type={showPassword ? "text" : "password"}
                          placeholder="Enter your password"
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

              <div className="flex items-center justify-between">
                <Dialog open={showForgotDialog} onOpenChange={setShowForgotDialog}>
                  <DialogTrigger asChild>
                    <Button variant="link" className="p-0 h-auto font-normal">
                      Forgot password?
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Reset Password</DialogTitle>
                      <DialogDescription>
                        Enter your email address and we'll send you a link to reset your password.
                      </DialogDescription>
                    </DialogHeader>
                    <Form {...forgotForm}>
                      <form onSubmit={forgotForm.handleSubmit(onForgotPassword)} className="space-y-4">
                        <FormField
                          control={forgotForm.control}
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
                        <div className="flex gap-2">
                          <Button
                            type="button"
                            variant="outline"
                            onClick={() => setShowForgotDialog(false)}
                            className="flex-1"
                          >
                            Cancel
                          </Button>
                          <Button 
                            type="submit" 
                            disabled={forgotPasswordMutation.isPending}
                            className="flex-1"
                          >
                            {forgotPasswordMutation.isPending ? (
                              <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Sending...
                              </>
                            ) : (
                              <>
                                <Mail className="mr-2 h-4 w-4" />
                                Send Reset Link
                              </>
                            )}
                          </Button>
                        </div>
                      </form>
                    </Form>
                  </DialogContent>
                </Dialog>
              </div>

              <Button 
                type="submit" 
                className="w-full" 
                disabled={loginMutation.isPending}
                size="lg"
              >
                {loginMutation.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Signing In...
                  </>
                ) : (
                  "Sign In"
                )}
              </Button>

              <div className="text-center space-y-4">
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-background px-2 text-muted-foreground">Or</span>
                  </div>
                </div>

                <Button asChild variant="outline" className="w-full" size="lg">
                  <Link href="/api/login">
                    Continue with Replit
                  </Link>
                </Button>

                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Don't have an account?{" "}
                  <Link href="/signup" className="text-blue-600 hover:underline dark:text-blue-400">
                    Sign up here
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