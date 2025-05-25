import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Shield, 
  CheckCircle, 
  Lock, 
  Eye,
  FileText,
  Phone,
  AlertTriangle,
  Baby,
  Star,
  Users,
  Clock
} from "lucide-react";

export default function Safety() {
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
              <Link href="/how-it-works" className="text-gray-500 hover:text-blue-600 px-3 py-2 text-sm font-medium">How it Works</Link>
              <Link href="/safety" className="text-gray-900 hover:text-blue-600 px-3 py-2 text-sm font-medium">Safety</Link>
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
      <section className="bg-gradient-to-br from-green-50 to-blue-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Shield className="w-20 h-20 text-green-600 mx-auto mb-6" />
          <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
            Your Family's Safety is Our Priority
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            At NannyCare, we implement comprehensive safety measures to ensure your children receive care from trusted, verified professionals. Learn about our multi-layered approach to safety and security.
          </p>
        </div>
      </section>

      {/* Safety Features */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Comprehensive Safety Measures</h2>
            <p className="text-xl text-gray-600">Multiple layers of verification and ongoing monitoring</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="border-green-200">
              <CardHeader className="text-center">
                <FileText className="w-12 h-12 text-green-600 mx-auto mb-4" />
                <CardTitle className="text-green-800">Background Checks</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  <li className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                    <span className="text-sm">Criminal background verification through Uganda Police</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                    <span className="text-sm">Employment history verification</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                    <span className="text-sm">Reference checks from previous employers</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                    <span className="text-sm">Education and certification verification</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border-blue-200">
              <CardHeader className="text-center">
                <Lock className="w-12 h-12 text-blue-600 mx-auto mb-4" />
                <CardTitle className="text-blue-800">Identity Verification</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  <li className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                    <span className="text-sm">National ID verification with NIRA</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                    <span className="text-sm">Phone number verification</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                    <span className="text-sm">Address confirmation</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                    <span className="text-sm">Biometric verification for premium nannies</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border-purple-200">
              <CardHeader className="text-center">
                <Eye className="w-12 h-12 text-purple-600 mx-auto mb-4" />
                <CardTitle className="text-purple-800">Ongoing Monitoring</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  <li className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                    <span className="text-sm">Regular re-verification of credentials</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                    <span className="text-sm">Continuous feedback monitoring</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                    <span className="text-sm">Quality assurance check-ins</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                    <span className="text-sm">24/7 support and incident response</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Certification Requirements */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Certification Requirements</h2>
            <p className="text-xl text-gray-600">Our nannies meet strict professional standards</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Badge variant="secondary" className="mr-3">Required</Badge>
                  Essential Certifications
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                    <span className="font-medium">First Aid Certification</span>
                    <CheckCircle className="w-5 h-5 text-green-600" />
                  </div>
                  <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                    <span className="font-medium">CPR Training</span>
                    <CheckCircle className="w-5 h-5 text-green-600" />
                  </div>
                  <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                    <span className="font-medium">Child Development Training</span>
                    <CheckCircle className="w-5 h-5 text-green-600" />
                  </div>
                  <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                    <span className="font-medium">Background Check Clearance</span>
                    <CheckCircle className="w-5 h-5 text-green-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Badge variant="outline" className="mr-3">Preferred</Badge>
                  Additional Qualifications
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                    <span className="font-medium">Early Childhood Education</span>
                    <Star className="w-5 h-5 text-blue-600" />
                  </div>
                  <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                    <span className="font-medium">Special Needs Training</span>
                    <Star className="w-5 h-5 text-blue-600" />
                  </div>
                  <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                    <span className="font-medium">Multiple Language Skills</span>
                    <Star className="w-5 h-5 text-blue-600" />
                  </div>
                  <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                    <span className="font-medium">Driving License</span>
                    <Star className="w-5 h-5 text-blue-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Safety Guidelines */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Safety Guidelines for Parents</h2>
            <p className="text-xl text-gray-600">Best practices to ensure a safe experience</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card className="border-l-4 border-l-green-500">
              <CardHeader>
                <CardTitle className="text-green-800">Before Hiring</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  <li className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                    <span className="text-sm">Always conduct an in-person interview</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                    <span className="text-sm">Check all verification badges on their profile</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                    <span className="text-sm">Read reviews from other families</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                    <span className="text-sm">Request and verify references</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                    <span className="text-sm">Start with a trial period</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-blue-500">
              <CardHeader>
                <CardTitle className="text-blue-800">During Care</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  <li className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                    <span className="text-sm">Establish clear communication expectations</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                    <span className="text-sm">Provide emergency contact information</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                    <span className="text-sm">Set clear boundaries and guidelines</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                    <span className="text-sm">Regular check-ins and updates</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                    <span className="text-sm">Trust your instincts about any concerns</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Emergency Support */}
      <section className="py-16 bg-red-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <AlertTriangle className="w-16 h-16 text-red-600 mx-auto mb-6" />
          <h2 className="text-3xl font-bold text-gray-900 mb-6">24/7 Emergency Support</h2>
          <p className="text-xl text-gray-600 mb-8">
            If you ever have concerns about your nanny or need immediate assistance, our support team is available around the clock.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Card className="p-6">
              <Phone className="w-8 h-8 text-green-600 mx-auto mb-2" />
              <h3 className="font-semibold mb-2">Emergency Hotline</h3>
              <p className="text-2xl font-bold text-green-600">0800-NANNYCARE</p>
            </Card>
            <Card className="p-6">
              <Users className="w-8 h-8 text-blue-600 mx-auto mb-2" />
              <h3 className="font-semibold mb-2">Live Chat Support</h3>
              <p className="text-sm text-gray-600">Available 24/7 through our app</p>
            </Card>
          </div>
        </div>
      </section>

      {/* Trust & Safety Stats */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Trust & Safety by the Numbers</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold text-green-600 mb-2">100%</div>
              <div className="text-gray-600">Background Checked</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-blue-600 mb-2">98%</div>
              <div className="text-gray-600">Satisfaction Rate</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-purple-600 mb-2">24/7</div>
              <div className="text-gray-600">Support Available</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-yellow-600 mb-2">5,000+</div>
              <div className="text-gray-600">Safe Placements</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-green-600 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-6">Peace of Mind for Your Family</h2>
          <p className="text-xl mb-8">Join thousands of families who trust NannyCare for safe, reliable childcare</p>
          <Button size="lg" variant="secondary" asChild>
            <Link href="/signup">Find Verified Nannies</Link>
          </Button>
        </div>
      </section>
    </div>
  );
}