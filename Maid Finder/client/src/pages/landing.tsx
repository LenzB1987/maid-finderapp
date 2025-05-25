import { useState } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Star, Clock, Moon, GraduationCap, Heart, Shield, IdCard, Headphones, CheckCircle, Baby } from "lucide-react";
import { UGANDA_DISTRICTS, SERVICE_TYPES } from "@/lib/constants";

export default function Landing() {
  const [searchFilters, setSearchFilters] = useState({
    serviceType: "",
    district: "",
  });

  const handleLogin = () => {
    window.location.href = "/api/login";
  };

  const featuredNannies = [
    {
      id: "1",
      name: "Sarah Nakamya",
      location: "Kampala, Central",
      rating: 4.9,
      reviews: 23,
      experience: 5,
      ageGroup: "0-8 years",
      rate: "400,000",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&h=150",
      badges: ["Verified", "Background Check", "First Aid"],
    },
    {
      id: "2",
      name: "Grace Atuhaire",
      location: "Wakiso, Central",
      rating: 4.8,
      reviews: 31,
      experience: 3,
      ageGroup: "2-10 years",
      rate: "350,000",
      image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&h=150",
      badges: ["Verified", "References", "Cooking"],
    },
    {
      id: "3",
      name: "Mary Asiimwe",
      location: "Mukono, Central",
      rating: 5.0,
      reviews: 18,
      experience: 7,
      ageGroup: "0-12 years",
      rate: "450,000",
      image: "https://images.unsplash.com/photo-1544027993-37dbfe43562a?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&h=150",
      badges: ["Verified", "Background Check", "Homework Help"],
    },
  ];

  const services = [
    {
      icon: Clock,
      title: "Full-time Care",
      description: "Daily childcare support for working parents, 8-10 hours daily",
      image: "https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=200",
    },
    {
      icon: Moon,
      title: "Night Care",
      description: "Overnight care for infants and young children when parents travel",
      image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=200",
    },
    {
      icon: GraduationCap,
      title: "Educational Support",
      description: "Homework help, reading, and educational activities for school-age children",
      image: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=200",
    },
    {
      icon: Heart,
      title: "Special Needs",
      description: "Specialized care for children with special needs and requirements",
      image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=200",
    },
  ];

  const districts = [
    { name: "Kampala", nannies: "120+" },
    { name: "Wakiso", nannies: "85+" },
    { name: "Mukono", nannies: "45+" },
    { name: "Jinja", nannies: "32+" },
    { name: "Mbarara", nannies: "28+" },
    { name: "Gulu", nannies: "22+" },
    { name: "Lira", nannies: "18+" },
    { name: "Mbale", nannies: "25+" },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <div className="flex-shrink-0 flex items-center">
                <Baby className="text-blue-600 text-2xl mr-2" />
                <span className="text-xl font-bold text-gray-900">NannyCare</span>
              </div>
            </div>

            <nav className="hidden md:flex space-x-8">
              <Link href="/search" className="text-gray-900 hover:text-blue-600 px-3 py-2 text-sm font-medium">Find Nannies</Link>
              <Link href="/become-nanny" className="text-gray-500 hover:text-blue-600 px-3 py-2 text-sm font-medium">Become a Nanny</Link>
              <Link href="/how-it-works" className="text-gray-500 hover:text-blue-600 px-3 py-2 text-sm font-medium">How it Works</Link>
              <Link href="/safety" className="text-gray-500 hover:text-blue-600 px-3 py-2 text-sm font-medium">Safety</Link>
            </nav>

            <div className="flex items-center space-x-4">
              <Button variant="ghost" asChild>
                <Link href="/login">Sign In</Link>
              </Button>
              <Button asChild>
                <Link href="/signup">Get Started</Link>
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-blue-50 to-green-50 py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:grid lg:grid-cols-2 lg:gap-12 items-center">
            <div className="lg:pr-8">
              <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6 leading-tight">
                Find Trusted <span className="text-blue-600">Nannies</span> in Uganda
              </h1>
              <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                Connect with verified, experienced childcare professionals in your district. Safe, reliable, and affordable nanny services across Uganda.
              </p>
              
              {/* Search Form */}
              <Card className="mb-8">
                <CardContent className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Service Type</label>
                      <Select value={searchFilters.serviceType} onValueChange={(value) => setSearchFilters({...searchFilters, serviceType: value})}>
                        <SelectTrigger>
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
                      <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
                      <Select value={searchFilters.district} onValueChange={(value) => setSearchFilters({...searchFilters, district: value})}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select district" />
                        </SelectTrigger>
                        <SelectContent>
                          {UGANDA_DISTRICTS.map((district) => (
                            <SelectItem key={district.name} value={district.name}>{district.name} District</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="flex items-end">
                      <Button className="w-full" onClick={handleLogin}>
                        Search Nannies
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-8">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">500+</div>
                  <div className="text-sm text-gray-600">Verified Nannies</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">50+</div>
                  <div className="text-sm text-gray-600">Districts Covered</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-yellow-600">1000+</div>
                  <div className="text-sm text-gray-600">Happy Families</div>
                </div>
              </div>
            </div>

            <div className="mt-12 lg:mt-0">
              <img 
                src="https://images.unsplash.com/photo-1544027993-37dbfe43562a?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600" 
                alt="Professional nanny caring for children" 
                className="rounded-2xl shadow-2xl w-full"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Featured Nannies */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Top Rated Nannies</h2>
            <p className="text-xl text-gray-600">Meet our most trusted and experienced childcare professionals</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredNannies.map((nanny) => (
              <Card key={nanny.id} className="hover:shadow-xl transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center mb-4">
                    <img 
                      src={nanny.image} 
                      alt={`${nanny.name} profile`} 
                      className="w-16 h-16 rounded-full object-cover mr-4"
                    />
                    <div>
                      <h3 className="font-semibold text-gray-900">{nanny.name}</h3>
                      <p className="text-sm text-gray-600">{nanny.location}</p>
                      <div className="flex items-center mt-1">
                        <div className="flex text-yellow-400">
                          {Array.from({ length: 5 }, (_, i) => (
                            <Star key={i} className="w-3 h-3 fill-current" />
                          ))}
                        </div>
                        <span className="text-sm text-gray-600 ml-2">{nanny.rating} ({nanny.reviews} reviews)</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mb-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-700">Experience:</span>
                      <span className="text-sm text-gray-600">{nanny.experience} years</span>
                    </div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-700">Age Group:</span>
                      <span className="text-sm text-gray-600">{nanny.ageGroup}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-700">Rate:</span>
                      <span className="text-sm font-semibold text-blue-600">UGX {nanny.rate}/month</span>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2 mb-4">
                    {nanny.badges.map((badge) => (
                      <Badge key={badge} variant="secondary" className="text-xs">
                        {badge}
                      </Badge>
                    ))}
                  </div>

                  <div className="flex space-x-3">
                    <Button className="flex-1" asChild>
                      <Link href="/signup">View Profile</Link>
                    </Button>
                    <Button variant="outline" size="icon" asChild>
                      <Link href="/signup">
                        <Heart className="w-4 h-4" />
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center mt-12">
            <Button asChild>
              <Link href="/signup">View All Nannies</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Childcare Services</h2>
            <p className="text-xl text-gray-600">Professional care tailored to your family's needs</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {services.map((service, index) => (
              <Card key={index} className="text-center hover:shadow-xl transition-shadow">
                <CardContent className="p-6">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <service.icon className="text-blue-600 text-2xl" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{service.title}</h3>
                  <p className="text-gray-600 text-sm mb-4">{service.description}</p>
                  <img 
                    src={service.image} 
                    alt={service.title} 
                    className="rounded-lg w-full h-32 object-cover"
                  />
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">How It Works</h2>
            <p className="text-xl text-gray-600">Simple steps to find the perfect nanny for your family</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-20 h-20 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-white text-2xl font-bold">1</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Search & Filter</h3>
              <p className="text-gray-600">Browse verified nannies in your district. Filter by experience, rates, and services.</p>
            </div>

            <div className="text-center">
              <div className="w-20 h-20 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-white text-2xl font-bold">2</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Connect & Interview</h3>
              <p className="text-gray-600">Message potential nannies, schedule interviews, and check references.</p>
            </div>

            <div className="text-center">
              <div className="w-20 h-20 bg-yellow-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-white text-2xl font-bold">3</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Hire & Manage</h3>
              <p className="text-gray-600">Hire your chosen nanny and manage everything through our platform.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Location Coverage */}
      <section className="py-16 bg-gradient-to-br from-blue-50 to-green-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Coverage Across Uganda</h2>
            <p className="text-xl text-gray-600">Quality childcare services available in major districts</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mb-12">
            {districts.map((district) => (
              <Link key={district.name} href={`/signup?district=${district.name}`}>
                <Card className="text-center hover:shadow-lg transition-shadow cursor-pointer">
                  <CardContent className="p-4">
                    <h3 className="font-semibold text-gray-900">{district.name}</h3>
                    <p className="text-sm text-gray-600">{district.nannies} Nannies</p>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>

          <div className="text-center">
            <img 
              src="https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&h=400" 
              alt="Uganda landscape with rolling hills" 
              className="rounded-xl shadow-lg mx-auto mb-8 w-full max-w-4xl h-64 object-cover"
            />
          </div>
        </div>
      </section>

      {/* Safety & Trust */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Safety & Trust First</h2>
            <p className="text-xl text-gray-600">Your child's safety is our top priority</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="text-blue-600 text-2xl" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Background Checks</h3>
              <p className="text-gray-600 text-sm">Comprehensive background verification for all nannies</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <IdCard className="text-green-600 text-2xl" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Verified Profiles</h3>
              <p className="text-gray-600 text-sm">ID verification and reference checks for authenticity</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Star className="text-yellow-600 text-2xl" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Review System</h3>
              <p className="text-gray-600 text-sm">Real reviews from families who hired our nannies</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Headphones className="text-red-600 text-2xl" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">24/7 Support</h3>
              <p className="text-gray-600 text-sm">Round-the-clock customer support for any concerns</p>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 bg-blue-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Ready to Find Your Perfect Nanny?</h2>
          <p className="text-xl text-blue-100 mb-8">Join thousands of families who trust NannyCare Uganda for their childcare needs</p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button variant="secondary" onClick={handleLogin}>
              Find a Nanny
            </Button>
            <Button variant="outline" className="bg-transparent border-white text-white hover:bg-white hover:text-blue-600" onClick={handleLogin}>
              Become a Nanny
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center mb-4">
                <Baby className="text-blue-400 text-2xl mr-2" />
                <span className="text-xl font-bold">NannyCare Uganda</span>
              </div>
              <p className="text-gray-400 mb-4">Connecting families with trusted, verified childcare professionals across Uganda. Safe, reliable, and affordable nanny services.</p>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-400 hover:text-white">Find Nannies</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white">Become a Nanny</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white">How it Works</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white">Safety</a></li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4">Support</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-400 hover:text-white">Help Center</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white">Contact Us</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white">Terms of Service</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white">Privacy Policy</a></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 pt-8 mt-8">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <p className="text-gray-400 text-sm">© 2024 NannyCare Uganda. All rights reserved.</p>
              <div className="flex items-center space-x-4 mt-4 md:mt-0">
                <span className="text-gray-400 text-sm">Call us: +256 700 123 456</span>
                <span className="text-gray-400 text-sm">Email: hello@nannycare.ug</span>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
