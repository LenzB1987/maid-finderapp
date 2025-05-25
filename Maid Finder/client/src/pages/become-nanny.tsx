import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Heart, 
  DollarSign, 
  Clock, 
  Users,
  Star,
  Shield,
  CheckCircle,
  Baby,
  ArrowRight,
  Calendar,
  MapPin,
  Award
} from "lucide-react";

export default function BecomeNanny() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="flex items-center">
              <Baby className="text-blue-600 text-2xl mr-2" />
              <span className="text-xl font-bold text-gray-900">NannyCare</span>
            </Link>
            
            <nav className="hidden md:flex space-x-8">
              <Link href="/search" className="text-gray-500 hover:text-blue-600 px-3 py-2 text-sm font-medium">Find Nannies</Link>
              <Link href="/become-nanny" className="text-gray-900 hover:text-blue-600 px-3 py-2 text-sm font-medium">Become a Nanny</Link>
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
      <section className="bg-gradient-to-br from-purple-50 to-pink-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
                Turn Your Love for Children into a <span className="text-purple-600">Rewarding Career</span>
              </h1>
              <p className="text-xl text-gray-600 mb-8">
                Join Uganda's premier childcare platform and connect with families who need your care. Build a flexible career that makes a difference in children's lives.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button size="lg" asChild>
                  <Link href="/signup">
                    Start Your Journey
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Link>
                </Button>
                <Button size="lg" variant="outline" asChild>
                  <Link href="/how-it-works">Learn More</Link>
                </Button>
              </div>
            </div>
            <div className="lg:text-center">
              <img 
                src="https://images.unsplash.com/photo-1544027993-37dbfe43562a?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600" 
                alt="Professional nanny with children" 
                className="rounded-2xl shadow-2xl w-full"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Why Choose NannyCare?</h2>
            <p className="text-xl text-gray-600">Join thousands of nannies earning great income while doing what they love</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <Card className="text-center border-purple-200">
              <CardContent className="p-6">
                <DollarSign className="w-12 h-12 text-green-600 mx-auto mb-4" />
                <h3 className="font-semibold mb-2">Competitive Earnings</h3>
                <p className="text-sm text-gray-600 mb-4">Earn UGX 300,000 - 600,000+ monthly</p>
                <Badge variant="secondary">Top earners make 800K+</Badge>
              </CardContent>
            </Card>

            <Card className="text-center border-blue-200">
              <CardContent className="p-6">
                <Clock className="w-12 h-12 text-blue-600 mx-auto mb-4" />
                <h3 className="font-semibold mb-2">Flexible Schedule</h3>
                <p className="text-sm text-gray-600 mb-4">Choose your own hours and availability</p>
                <Badge variant="secondary">Work when you want</Badge>
              </CardContent>
            </Card>

            <Card className="text-center border-pink-200">
              <CardContent className="p-6">
                <Users className="w-12 h-12 text-pink-600 mx-auto mb-4" />
                <h3 className="font-semibold mb-2">Great Families</h3>
                <p className="text-sm text-gray-600 mb-4">Connect with loving families across Uganda</p>
                <Badge variant="secondary">Verified families</Badge>
              </CardContent>
            </Card>

            <Card className="text-center border-yellow-200">
              <CardContent className="p-6">
                <Shield className="w-12 h-12 text-yellow-600 mx-auto mb-4" />
                <h3 className="font-semibold mb-2">Safety & Support</h3>
                <p className="text-sm text-gray-600 mb-4">24/7 support and safety measures</p>
                <Badge variant="secondary">Always protected</Badge>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* How to Get Started */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">How to Get Started</h2>
            <p className="text-xl text-gray-600">Simple steps to begin your nanny career</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card>
              <CardHeader className="text-center">
                <div className="w-16 h-16 bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-white text-xl font-bold">1</span>
                </div>
                <CardTitle>Create Your Profile</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  <li className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                    <span className="text-sm">Upload your photo and national ID</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                    <span className="text-sm">Add your experience and qualifications</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                    <span className="text-sm">Set your rates and availability</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                    <span className="text-sm">Write a compelling bio</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="text-center">
                <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-white text-xl font-bold">2</span>
                </div>
                <CardTitle>Get Verified</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  <li className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                    <span className="text-sm">Complete background check</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                    <span className="text-sm">Provide references</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                    <span className="text-sm">Upload certificates (First Aid, etc.)</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                    <span className="text-sm">Complete identity verification</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="text-center">
                <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-white text-xl font-bold">3</span>
                </div>
                <CardTitle>Start Earning</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  <li className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                    <span className="text-sm">Receive booking requests</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                    <span className="text-sm">Chat with interested families</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                    <span className="text-sm">Accept jobs that fit your schedule</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                    <span className="text-sm">Build your reputation with reviews</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Requirements */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">What We Look For</h2>
            <p className="text-xl text-gray-600">Requirements to join our platform</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card className="border-l-4 border-l-green-500">
              <CardHeader>
                <CardTitle className="text-green-800">Essential Requirements</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  <li className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                    <span className="text-sm">18+ years old with valid National ID</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                    <span className="text-sm">Previous childcare experience (professional or personal)</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                    <span className="text-sm">Clean criminal background check</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                    <span className="text-sm">Reliable phone number and transportation</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                    <span className="text-sm">Passion for working with children</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-blue-500">
              <CardHeader>
                <CardTitle className="text-blue-800">Preferred Qualifications</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  <li className="flex items-start">
                    <Star className="w-5 h-5 text-blue-500 mr-2 mt-0.5 flex-shrink-0" />
                    <span className="text-sm">First Aid/CPR certification</span>
                  </li>
                  <li className="flex items-start">
                    <Star className="w-5 h-5 text-blue-500 mr-2 mt-0.5 flex-shrink-0" />
                    <span className="text-sm">Early childhood education background</span>
                  </li>
                  <li className="flex items-start">
                    <Star className="w-5 h-5 text-blue-500 mr-2 mt-0.5 flex-shrink-0" />
                    <span className="text-sm">Multiple language skills</span>
                  </li>
                  <li className="flex items-start">
                    <Star className="w-5 h-5 text-blue-500 mr-2 mt-0.5 flex-shrink-0" />
                    <span className="text-sm">Special needs experience</span>
                  </li>
                  <li className="flex items-start">
                    <Star className="w-5 h-5 text-blue-500 mr-2 mt-0.5 flex-shrink-0" />
                    <span className="text-sm">Cooking and homework help skills</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Success Stories */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Success Stories</h2>
            <p className="text-xl text-gray-600">Hear from our top-rated nannies</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  <img 
                    src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&h=150" 
                    alt="Sarah" 
                    className="w-12 h-12 rounded-full mr-3"
                  />
                  <div>
                    <h4 className="font-semibold">Sarah K.</h4>
                    <div className="flex text-yellow-400">
                      {Array.from({ length: 5 }, (_, i) => (
                        <Star key={i} className="w-4 h-4 fill-current" />
                      ))}
                    </div>
                  </div>
                </div>
                <p className="text-gray-600 text-sm mb-4">
                  "I've been with NannyCare for 2 years and built amazing relationships with 5 families. The platform helped me earn enough to support my education while doing what I love."
                </p>
                <Badge variant="secondary">Earns 550K/month</Badge>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  <img 
                    src="https://images.unsplash.com/photo-1558618666-fcd25c85cd64?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&h=150" 
                    alt="Grace" 
                    className="w-12 h-12 rounded-full mr-3"
                  />
                  <div>
                    <h4 className="font-semibold">Grace M.</h4>
                    <div className="flex text-yellow-400">
                      {Array.from({ length: 5 }, (_, i) => (
                        <Star key={i} className="w-4 h-4 fill-current" />
                      ))}
                    </div>
                  </div>
                </div>
                <p className="text-gray-600 text-sm mb-4">
                  "The flexibility is incredible! I can work around my family's needs and still maintain a steady income. Families here truly appreciate quality care."
                </p>
                <Badge variant="secondary">Top 10% Nanny</Badge>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  <img 
                    src="https://images.unsplash.com/photo-1544027993-37dbfe43562a?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&h=150" 
                    alt="Mary" 
                    className="w-12 h-12 rounded-full mr-3"
                  />
                  <div>
                    <h4 className="font-semibold">Mary A.</h4>
                    <div className="flex text-yellow-400">
                      {Array.from({ length: 5 }, (_, i) => (
                        <Star key={i} className="w-4 h-4 fill-current" />
                      ))}
                    </div>
                  </div>
                </div>
                <p className="text-gray-600 text-sm mb-4">
                  "Starting as a part-time nanny, I now have a full client base and earn more than my previous office job. The children I care for feel like family."
                </p>
                <Badge variant="secondary">3 years experience</Badge>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-purple-600 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Award className="w-16 h-16 mx-auto mb-6" />
          <h2 className="text-3xl font-bold mb-6">Ready to Start Your Nanny Career?</h2>
          <p className="text-xl mb-8">
            Join hundreds of nannies who have found meaningful work and great families through NannyCare
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" variant="secondary" asChild>
              <Link href="/signup">
                Apply Now
                <ArrowRight className="w-5 h-5 ml-2" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" className="text-white border-white hover:bg-white hover:text-purple-600" asChild>
              <Link href="/safety">Learn About Safety</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}