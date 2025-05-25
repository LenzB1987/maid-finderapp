import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Search, 
  MessageSquare, 
  HandHeart, 
  Shield, 
  CheckCircle, 
  Star,
  Baby,
  ArrowRight,
  Clock,
  Users
} from "lucide-react";

export default function HowItWorks() {
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
              <Link href="/become-nanny" className="text-gray-500 hover:text-blue-600 px-3 py-2 text-sm font-medium">Become a Nanny</Link>
              <Link href="/how-it-works" className="text-gray-900 hover:text-blue-600 px-3 py-2 text-sm font-medium">How it Works</Link>
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
      <section className="bg-gradient-to-br from-blue-50 to-green-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
            How NannyCare Works
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Finding the perfect nanny for your family has never been easier. Follow these simple steps to connect with trusted childcare professionals in Uganda.
          </p>
        </div>
      </section>

      {/* Steps Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {/* Step 1 */}
            <div className="text-center">
              <div className="w-24 h-24 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <Search className="w-12 h-12 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">1. Search & Filter</h3>
              <p className="text-gray-600 mb-6">
                Browse through our extensive database of verified nannies. Use our advanced filters to find candidates by location, experience, rates, and specific services.
              </p>
              <Card className="text-left">
                <CardContent className="p-6">
                  <h4 className="font-semibold mb-3">Filter Options:</h4>
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li className="flex items-center"><CheckCircle className="w-4 h-4 text-green-500 mr-2" />District & Region</li>
                    <li className="flex items-center"><CheckCircle className="w-4 h-4 text-green-500 mr-2" />Experience Level</li>
                    <li className="flex items-center"><CheckCircle className="w-4 h-4 text-green-500 mr-2" />Hourly/Monthly Rates</li>
                    <li className="flex items-center"><CheckCircle className="w-4 h-4 text-green-500 mr-2" />Age Group Specialization</li>
                    <li className="flex items-center"><CheckCircle className="w-4 h-4 text-green-500 mr-2" />Special Services</li>
                  </ul>
                </CardContent>
              </Card>
            </div>

            {/* Step 2 */}
            <div className="text-center">
              <div className="w-24 h-24 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <MessageSquare className="w-12 h-12 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">2. Connect & Interview</h3>
              <p className="text-gray-600 mb-6">
                Message potential nannies directly through our secure platform. Schedule interviews, check references, and get to know your candidates before making a decision.
              </p>
              <Card className="text-left">
                <CardContent className="p-6">
                  <h4 className="font-semibold mb-3">Communication Features:</h4>
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li className="flex items-center"><CheckCircle className="w-4 h-4 text-green-500 mr-2" />Real-time Messaging</li>
                    <li className="flex items-center"><CheckCircle className="w-4 h-4 text-green-500 mr-2" />Video Call Scheduling</li>
                    <li className="flex items-center"><CheckCircle className="w-4 h-4 text-green-500 mr-2" />Reference Verification</li>
                    <li className="flex items-center"><CheckCircle className="w-4 h-4 text-green-500 mr-2" />Background Check Results</li>
                    <li className="flex items-center"><CheckCircle className="w-4 h-4 text-green-500 mr-2" />Interview Scheduling</li>
                  </ul>
                </CardContent>
              </Card>
            </div>

            {/* Step 3 */}
            <div className="text-center">
              <div className="w-24 h-24 bg-yellow-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <HandHeart className="w-12 h-12 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">3. Hire & Manage</h3>
              <p className="text-gray-600 mb-6">
                Once you've found the perfect match, hire your chosen nanny and manage everything through our platform. Track hours, handle payments, and maintain ongoing communication.
              </p>
              <Card className="text-left">
                <CardContent className="p-6">
                  <h4 className="font-semibold mb-3">Management Tools:</h4>
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li className="flex items-center"><CheckCircle className="w-4 h-4 text-green-500 mr-2" />Booking Management</li>
                    <li className="flex items-center"><CheckCircle className="w-4 h-4 text-green-500 mr-2" />Payment Processing</li>
                    <li className="flex items-center"><CheckCircle className="w-4 h-4 text-green-500 mr-2" />Time Tracking</li>
                    <li className="flex items-center"><CheckCircle className="w-4 h-4 text-green-500 mr-2" />Review & Rating System</li>
                    <li className="flex items-center"><CheckCircle className="w-4 h-4 text-green-500 mr-2" />Ongoing Support</li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Why Choose NannyCare?</h2>
            <p className="text-xl text-gray-600">We make finding quality childcare simple and secure</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <Card className="text-center p-6">
              <CardContent className="p-0">
                <Shield className="w-12 h-12 text-blue-600 mx-auto mb-4" />
                <h3 className="font-semibold mb-2">Verified Nannies</h3>
                <p className="text-sm text-gray-600">All nannies undergo thorough background checks and verification</p>
              </CardContent>
            </Card>

            <Card className="text-center p-6">
              <CardContent className="p-0">
                <Star className="w-12 h-12 text-yellow-500 mx-auto mb-4" />
                <h3 className="font-semibold mb-2">Rated & Reviewed</h3>
                <p className="text-sm text-gray-600">Real reviews from families help you make informed decisions</p>
              </CardContent>
            </Card>

            <Card className="text-center p-6">
              <CardContent className="p-0">
                <Clock className="w-12 h-12 text-green-600 mx-auto mb-4" />
                <h3 className="font-semibold mb-2">Flexible Booking</h3>
                <p className="text-sm text-gray-600">Book hourly, daily, or monthly care that fits your schedule</p>
              </CardContent>
            </Card>

            <Card className="text-center p-6">
              <CardContent className="p-0">
                <Users className="w-12 h-12 text-purple-600 mx-auto mb-4" />
                <h3 className="font-semibold mb-2">Nationwide Coverage</h3>
                <p className="text-sm text-gray-600">Quality childcare services available across Uganda</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Frequently Asked Questions</h2>
          </div>

          <div className="space-y-8">
            <Card>
              <CardContent className="p-6">
                <h3 className="font-semibold mb-2">How do I know the nannies are trustworthy?</h3>
                <p className="text-gray-600">Every nanny on our platform undergoes a comprehensive verification process including background checks, reference verification, and identity confirmation. We also provide access to reviews from other families.</p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <h3 className="font-semibold mb-2">What are the typical rates for nannies?</h3>
                <p className="text-gray-600">Rates vary based on experience, location, and services offered. Generally, hourly rates range from UGX 5,000-15,000, while monthly rates range from UGX 300,000-600,000. You can filter by your budget to find suitable options.</p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <h3 className="font-semibold mb-2">Can I trial a nanny before committing long-term?</h3>
                <p className="text-gray-600">Yes! We recommend starting with a short-term booking to ensure it's a good fit for your family. Many families book a trial day or week before committing to longer arrangements.</p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <h3 className="font-semibold mb-2">What if I'm not satisfied with a nanny?</h3>
                <p className="text-gray-600">We provide ongoing support throughout your experience. If issues arise, our customer service team is available to help resolve problems or assist you in finding a new nanny.</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-blue-600 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to Find Your Perfect Nanny?</h2>
          <p className="text-xl mb-8">Join thousands of families who trust NannyCare for their childcare needs</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" variant="secondary" asChild>
              <Link href="/signup">
                Get Started Today
                <ArrowRight className="w-5 h-5 ml-2" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" className="text-white border-white hover:bg-white hover:text-blue-600" asChild>
              <Link href="/search">Browse Nannies</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}