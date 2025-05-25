import { useState } from "react";
import { Link, useLocation } from "wouter";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Baby, Menu, Search, User, Settings, LogOut, Heart, MessageSquare, Bell } from "lucide-react";

export default function Header() {
  const { user, isAuthenticated } = useAuth();
  const [location] = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    window.location.href = "/api/logout";
  };

  const navigationItems = [
    { href: "/search", label: "Find Nannies", icon: Search },
    { href: "/", label: "Home", icon: null },
  ];

  const getDashboardLink = () => {
    if (user?.userType === 'admin') return "/dashboard/admin";
    if (user?.userType === 'nanny') return "/dashboard/nanny";
    return "/dashboard/parent";
  };

  return (
    <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex-shrink-0 flex items-center">
              <Baby className="text-blue-600 text-2xl mr-2" />
              <span className="text-xl font-bold text-gray-900">NannyCare Uganda</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8">
            {navigationItems.map((item) => (
              <Link key={item.href} href={item.href}>
                <span
                  className={`px-3 py-2 text-sm font-medium transition-colors ${
                    location === item.href
                      ? "text-blue-600"
                      : "text-gray-500 hover:text-blue-600"
                  }`}
                >
                  {item.label}
                </span>
              </Link>
            ))}
            {isAuthenticated && (
              <>
                <Link href={getDashboardLink()}>
                  <span
                    className={`px-3 py-2 text-sm font-medium transition-colors ${
                      location.startsWith("/dashboard")
                        ? "text-blue-600"
                        : "text-gray-500 hover:text-blue-600"
                    }`}
                  >
                    Dashboard
                  </span>
                </Link>
              </>
            )}
          </nav>

          {/* Desktop User Menu */}
          <div className="hidden md:flex items-center space-x-4">
            {isAuthenticated ? (
              <>
                <Button variant="ghost" size="icon" className="relative">
                  <Bell className="w-5 h-5" />
                  <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full text-xs"></span>
                </Button>
                <Button variant="ghost" size="icon">
                  <MessageSquare className="w-5 h-5" />
                </Button>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                      <Avatar className="h-8 w-8">
                        <AvatarImage
                          src={user.profileImageUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.firstName}`}
                          alt={`${user.firstName || ''} ${user.lastName || ''}`}
                        />
                        <AvatarFallback>
                          <User className="h-4 w-4" />
                        </AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56" align="end" forceMount>
                    <DropdownMenuLabel className="font-normal">
                      <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium leading-none">
                          {user.firstName} {user.lastName}
                        </p>
                        <p className="text-xs leading-none text-muted-foreground">
                          {user.email}
                        </p>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link href={getDashboardLink()}>
                        <User className="mr-2 h-4 w-4" />
                        <span>Dashboard</span>
                      </Link>
                    </DropdownMenuItem>
                    {user.userType === 'parent' && (
                      <DropdownMenuItem asChild>
                        <Link href="/favorites">
                          <Heart className="mr-2 h-4 w-4" />
                          <span>Favorites</span>
                        </Link>
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuItem>
                      <Settings className="mr-2 h-4 w-4" />
                      <span>Settings</span>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleLogout}>
                      <LogOut className="mr-2 h-4 w-4" />
                      <span>Log out</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <div className="flex items-center space-x-4">
                <Button variant="ghost" onClick={() => window.location.href = "/api/login"}>
                  Sign In
                </Button>
                <Button onClick={() => window.location.href = "/api/login"}>
                  Get Started
                </Button>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu className="h-6 w-6" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px] sm:w-[400px]">
                <SheetHeader>
                  <SheetTitle className="text-left">
                    <div className="flex items-center">
                      <Baby className="text-blue-600 text-xl mr-2" />
                      NannyCare Uganda
                    </div>
                  </SheetTitle>
                  <SheetDescription className="text-left">
                    Navigate to different sections of the app
                  </SheetDescription>
                </SheetHeader>
                <div className="mt-6 space-y-4">
                  {isAuthenticated && (
                    <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                      <Avatar className="h-10 w-10">
                        <AvatarImage
                          src={user.profileImageUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.firstName}`}
                          alt={`${user.firstName || ''} ${user.lastName || ''}`}
                        />
                        <AvatarFallback>
                          <User className="h-5 w-5" />
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="text-sm font-medium">
                          {user.firstName} {user.lastName}
                        </p>
                        <p className="text-xs text-gray-500">{user.email}</p>
                      </div>
                    </div>
                  )}
                  
                  <nav className="space-y-2">
                    {navigationItems.map((item) => (
                      <Link key={item.href} href={item.href}>
                        <Button
                          variant="ghost"
                          className="w-full justify-start"
                          onClick={() => setMobileMenuOpen(false)}
                        >
                          {item.icon && <item.icon className="mr-2 h-4 w-4" />}
                          {item.label}
                        </Button>
                      </Link>
                    ))}
                    
                    {isAuthenticated ? (
                      <>
                        <Link href={getDashboardLink()}>
                          <Button
                            variant="ghost"
                            className="w-full justify-start"
                            onClick={() => setMobileMenuOpen(false)}
                          >
                            <User className="mr-2 h-4 w-4" />
                            Dashboard
                          </Button>
                        </Link>
                        {user.userType === 'parent' && (
                          <Link href="/favorites">
                            <Button
                              variant="ghost"
                              className="w-full justify-start"
                              onClick={() => setMobileMenuOpen(false)}
                            >
                              <Heart className="mr-2 h-4 w-4" />
                              Favorites
                            </Button>
                          </Link>
                        )}
                        <Button
                          variant="ghost"
                          className="w-full justify-start"
                        >
                          <Settings className="mr-2 h-4 w-4" />
                          Settings
                        </Button>
                        <Button
                          variant="ghost"
                          className="w-full justify-start text-red-600 hover:text-red-700"
                          onClick={handleLogout}
                        >
                          <LogOut className="mr-2 h-4 w-4" />
                          Log out
                        </Button>
                      </>
                    ) : (
                      <div className="space-y-2 pt-4 border-t">
                        <Button
                          variant="ghost"
                          className="w-full"
                          onClick={() => window.location.href = "/api/login"}
                        >
                          Sign In
                        </Button>
                        <Button
                          className="w-full"
                          onClick={() => window.location.href = "/api/login"}
                        >
                          Get Started
                        </Button>
                      </div>
                    )}
                  </nav>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}
