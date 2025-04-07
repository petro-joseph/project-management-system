
import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Check, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const PricingPage: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Navigation */}
      <header className="w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 z-10">
        <div className="container flex h-16 items-center justify-between px-4">
          <Link to="/" className="flex items-center">
            <span className="font-medium text-lg text-primary">Project Managment System</span>
          </Link>

          <nav className="hidden md:flex items-center space-x-8">
            <Link to="/about" className="text-sm font-medium hover:text-primary transition-colors">About</Link>
            <Link to="/features" className="text-sm font-medium hover:text-primary transition-colors">Features</Link>
            <Link to="/pricing" className="text-sm font-medium text-primary transition-colors">Pricing</Link>
          </nav>

          <div className="flex items-center space-x-4">
            <Link to="/login">
              <Button variant="outline" size="sm">Log in</Button>
            </Link>
            <Link to="/login">
              <Button size="sm">Get Started</Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-20 pb-16 bg-gradient-to-b from-background to-secondary/20">
        <div className="container px-4 md:px-6 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">Simple, Transparent Pricing</h1>
          <p className="text-xl text-muted-foreground max-w-[800px] mx-auto">
            Choose the plan that's right for your business, with no hidden fees or long-term commitments.
          </p>
        </div>
      </section>

      {/* Pricing Table */}
      <section className="py-20">
        <div className="container px-4 md:px-6">
          <Tabs defaultValue="monthly" className="w-full mb-8">
            <div className="flex justify-center mb-8">
              <TabsList>
                <TabsTrigger value="monthly">Monthly</TabsTrigger>
                <TabsTrigger value="annually">Annually (Save 20%)</TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="monthly" className="p-0">
              <div className="grid gap-8 md:grid-cols-3">
                {/* Starter Plan */}
                <Card className="border border-border relative overflow-hidden">
                  <CardHeader className="pb-4">
                    <CardTitle className="text-2xl">Starter</CardTitle>
                    <CardDescription>Perfect for small businesses and startups</CardDescription>
                    <div className="mt-4">
                      <span className="text-4xl font-bold">$29</span>
                      <span className="text-muted-foreground ml-2">/month</span>
                    </div>
                  </CardHeader>
                  <CardContent className="pb-4">
                    <ul className="space-y-3">
                      {[
                        "Up to 5 team members",
                        "10 projects",
                        "Basic project management",
                        "Task tracking",
                        "Limited reporting",
                        "Email support"
                      ].map((feature, index) => (
                        <li key={index} className="flex items-center gap-2">
                          <Check className="h-5 w-5 text-primary flex-shrink-0" />
                          <span>{feature}</span>
                        </li>
                      ))}
                      {[
                        "Inventory management",
                        "Advanced analytics",
                        "Custom roles & permissions",
                        "Phone support"
                      ].map((feature, index) => (
                        <li key={index} className="flex items-center gap-2 text-muted-foreground">
                          <X className="h-5 w-5 flex-shrink-0" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                  <CardFooter>
                    <Link to="/login" className="w-full">
                      <Button className="w-full gap-2">
                        Get Started
                        <ArrowRight className="h-4 w-4" />
                      </Button>
                    </Link>
                  </CardFooter>
                </Card>

                {/* Professional Plan */}
                <Card className="border border-primary relative overflow-hidden">
                  <div className="absolute top-0 right-0 bg-primary text-primary-foreground text-xs font-medium px-3 py-1 rounded-bl-lg">
                    Most Popular
                  </div>
                  <CardHeader className="pb-4">
                    <CardTitle className="text-2xl">Professional</CardTitle>
                    <CardDescription>Ideal for growing businesses</CardDescription>
                    <div className="mt-4">
                      <span className="text-4xl font-bold">$79</span>
                      <span className="text-muted-foreground ml-2">/month</span>
                    </div>
                  </CardHeader>
                  <CardContent className="pb-4">
                    <ul className="space-y-3">
                      {[
                        "Up to 20 team members",
                        "Unlimited projects",
                        "Advanced project management",
                        "Task tracking with time logging",
                        "Inventory management",
                        "Standard reporting",
                        "Custom roles & permissions",
                        "Email & chat support"
                      ].map((feature, index) => (
                        <li key={index} className="flex items-center gap-2">
                          <Check className="h-5 w-5 text-primary flex-shrink-0" />
                          <span>{feature}</span>
                        </li>
                      ))}
                      {[
                        "Advanced analytics",
                        "Phone support"
                      ].map((feature, index) => (
                        <li key={index} className="flex items-center gap-2 text-muted-foreground">
                          <X className="h-5 w-5 flex-shrink-0" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                  <CardFooter>
                    <Link to="/login" className="w-full">
                      <Button className="w-full gap-2">
                        Get Started
                        <ArrowRight className="h-4 w-4" />
                      </Button>
                    </Link>
                  </CardFooter>
                </Card>

                {/* Enterprise Plan */}
                <Card className="border border-border relative overflow-hidden">
                  <CardHeader className="pb-4">
                    <CardTitle className="text-2xl">Enterprise</CardTitle>
                    <CardDescription>For large organizations with advanced needs</CardDescription>
                    <div className="mt-4">
                      <span className="text-4xl font-bold">$199</span>
                      <span className="text-muted-foreground ml-2">/month</span>
                    </div>
                  </CardHeader>
                  <CardContent className="pb-4">
                    <ul className="space-y-3">
                      {[
                        "Unlimited team members",
                        "Unlimited projects",
                        "Advanced project management",
                        "Advanced task tracking",
                        "Inventory management",
                        "Advanced reporting & analytics",
                        "Custom roles & permissions",
                        "Custom integrations",
                        "Dedicated account manager",
                        "24/7 phone, email & chat support"
                      ].map((feature, index) => (
                        <li key={index} className="flex items-center gap-2">
                          <Check className="h-5 w-5 text-primary flex-shrink-0" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                  <CardFooter>
                    <Link to="/login" className="w-full">
                      <Button className="w-full gap-2">
                        Contact Sales
                        <ArrowRight className="h-4 w-4" />
                      </Button>
                    </Link>
                  </CardFooter>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="annually" className="p-0">
              <div className="grid gap-8 md:grid-cols-3">
                {/* Starter Plan Annual */}
                <Card className="border border-border relative overflow-hidden">
                  <CardHeader className="pb-4">
                    <CardTitle className="text-2xl">Starter</CardTitle>
                    <CardDescription>Perfect for small businesses and startups</CardDescription>
                    <div className="mt-4">
                      <span className="text-4xl font-bold">$23</span>
                      <span className="text-muted-foreground ml-2">/month</span>
                      <div className="text-sm text-primary mt-1">Billed annually at $276</div>
                    </div>
                  </CardHeader>
                  <CardContent className="pb-4">
                    <ul className="space-y-3">
                      {[
                        "Up to 5 team members",
                        "10 projects",
                        "Basic project management",
                        "Task tracking",
                        "Limited reporting",
                        "Email support"
                      ].map((feature, index) => (
                        <li key={index} className="flex items-center gap-2">
                          <Check className="h-5 w-5 text-primary flex-shrink-0" />
                          <span>{feature}</span>
                        </li>
                      ))}
                      {[
                        "Inventory management",
                        "Advanced analytics",
                        "Custom roles & permissions",
                        "Phone support"
                      ].map((feature, index) => (
                        <li key={index} className="flex items-center gap-2 text-muted-foreground">
                          <X className="h-5 w-5 flex-shrink-0" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                  <CardFooter>
                    <Link to="/login" className="w-full">
                      <Button className="w-full gap-2">
                        Get Started
                        <ArrowRight className="h-4 w-4" />
                      </Button>
                    </Link>
                  </CardFooter>
                </Card>

                {/* Professional Plan Annual */}
                <Card className="border border-primary relative overflow-hidden">
                  <div className="absolute top-0 right-0 bg-primary text-primary-foreground text-xs font-medium px-3 py-1 rounded-bl-lg">
                    Most Popular
                  </div>
                  <CardHeader className="pb-4">
                    <CardTitle className="text-2xl">Professional</CardTitle>
                    <CardDescription>Ideal for growing businesses</CardDescription>
                    <div className="mt-4">
                      <span className="text-4xl font-bold">$63</span>
                      <span className="text-muted-foreground ml-2">/month</span>
                      <div className="text-sm text-primary mt-1">Billed annually at $756</div>
                    </div>
                  </CardHeader>
                  <CardContent className="pb-4">
                    <ul className="space-y-3">
                      {[
                        "Up to 20 team members",
                        "Unlimited projects",
                        "Advanced project management",
                        "Task tracking with time logging",
                        "Inventory management",
                        "Standard reporting",
                        "Custom roles & permissions",
                        "Email & chat support"
                      ].map((feature, index) => (
                        <li key={index} className="flex items-center gap-2">
                          <Check className="h-5 w-5 text-primary flex-shrink-0" />
                          <span>{feature}</span>
                        </li>
                      ))}
                      {[
                        "Advanced analytics",
                        "Phone support"
                      ].map((feature, index) => (
                        <li key={index} className="flex items-center gap-2 text-muted-foreground">
                          <X className="h-5 w-5 flex-shrink-0" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                  <CardFooter>
                    <Link to="/login" className="w-full">
                      <Button className="w-full gap-2">
                        Get Started
                        <ArrowRight className="h-4 w-4" />
                      </Button>
                    </Link>
                  </CardFooter>
                </Card>

                {/* Enterprise Plan Annual */}
                <Card className="border border-border relative overflow-hidden">
                  <CardHeader className="pb-4">
                    <CardTitle className="text-2xl">Enterprise</CardTitle>
                    <CardDescription>For large organizations with advanced needs</CardDescription>
                    <div className="mt-4">
                      <span className="text-4xl font-bold">$159</span>
                      <span className="text-muted-foreground ml-2">/month</span>
                      <div className="text-sm text-primary mt-1">Billed annually at $1,908</div>
                    </div>
                  </CardHeader>
                  <CardContent className="pb-4">
                    <ul className="space-y-3">
                      {[
                        "Unlimited team members",
                        "Unlimited projects",
                        "Advanced project management",
                        "Advanced task tracking",
                        "Inventory management",
                        "Advanced reporting & analytics",
                        "Custom roles & permissions",
                        "Custom integrations",
                        "Dedicated account manager",
                        "24/7 phone, email & chat support"
                      ].map((feature, index) => (
                        <li key={index} className="flex items-center gap-2">
                          <Check className="h-5 w-5 text-primary flex-shrink-0" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                  <CardFooter>
                    <Link to="/login" className="w-full">
                      <Button className="w-full gap-2">
                        Contact Sales
                        <ArrowRight className="h-4 w-4" />
                      </Button>
                    </Link>
                  </CardFooter>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-secondary/20">
        <div className="container px-4 md:px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Frequently Asked Questions</h2>
            <p className="text-lg text-muted-foreground max-w-[700px] mx-auto">
              Have questions about our pricing? Find answers to common questions below.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 max-w-4xl mx-auto">
            {[
              {
                question: "Can I switch plans later?",
                answer: "Yes, you can upgrade or downgrade your plan at any time. When upgrading, you'll be prorated for the remainder of your billing cycle. When downgrading, the new rate will apply to your next billing cycle."
              },
              {
                question: "Is there a free trial?",
                answer: "Yes, we offer a 14-day free trial for all plans. No credit card required to start your trial. You can explore all features before deciding on the right plan for your business."
              },
              {
                question: "What payment methods do you accept?",
                answer: "We accept all major credit cards (Visa, Mastercard, American Express), as well as PayPal. For Enterprise plans, we can also accommodate invoicing and purchase orders."
              },
              {
                question: "Are there any setup fees?",
                answer: "No, there are no setup fees for any of our plans. The price you see is the price you pay, with no hidden costs or additional fees."
              },
              {
                question: "Can I get a refund if I'm not satisfied?",
                answer: "We offer a 30-day money-back guarantee for all plans. If you're not completely satisfied with Project Managment System, contact our support team within 30 days of your purchase for a full refund."
              },
              {
                question: "Do I need to commit to a long-term contract?",
                answer: "No, all our plans are subscription-based with no long-term commitment required. You can cancel at any time, and your subscription will remain active until the end of your current billing cycle."
              }
            ].map((faq, index) => (
              <div key={index} className="p-6 bg-background rounded-lg border border-border">
                <h3 className="text-lg font-semibold mb-2">{faq.question}</h3>
                <p className="text-muted-foreground">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary">
        <div className="container px-4 md:px-6 text-center">
          <div className="max-w-[800px] mx-auto text-primary-foreground">
            <h2 className="text-3xl font-bold tracking-tight mb-4">Ready to Get Started?</h2>
            <p className="text-lg mb-8 opacity-90">
              Try Project Managment System free for 14 days. No credit card required.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/login">
                <Button variant="secondary" size="lg" className="gap-2">
                  Start Your Free Trial
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Link to="#" className="inline-block">
                <Button variant="outline" size="lg" className="border-primary-foreground hover:bg-primary-foreground/10">
                  Talk to Sales
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border bg-background py-12">
        <div className="container px-4 md:px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div>
              <h3 className="font-semibold mb-4">Product</h3>
              <ul className="space-y-2">
                <li><Link to="/features" className="text-sm text-muted-foreground hover:text-foreground">Features</Link></li>
                <li><Link to="/pricing" className="text-sm text-muted-foreground hover:text-foreground">Pricing</Link></li>
                <li><Link to="#" className="text-sm text-muted-foreground hover:text-foreground">Roadmap</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Company</h3>
              <ul className="space-y-2">
                <li><Link to="/about" className="text-sm text-muted-foreground hover:text-foreground">About</Link></li>
                <li><Link to="#" className="text-sm text-muted-foreground hover:text-foreground">Blog</Link></li>
                <li><Link to="#" className="text-sm text-muted-foreground hover:text-foreground">Careers</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Resources</h3>
              <ul className="space-y-2">
                <li><Link to="#" className="text-sm text-muted-foreground hover:text-foreground">Documentation</Link></li>
                <li><Link to="#" className="text-sm text-muted-foreground hover:text-foreground">Help Center</Link></li>
                <li><Link to="#" className="text-sm text-muted-foreground hover:text-foreground">Tutorials</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Legal</h3>
              <ul className="space-y-2">
                <li><Link to="#" className="text-sm text-muted-foreground hover:text-foreground">Privacy</Link></li>
                <li><Link to="#" className="text-sm text-muted-foreground hover:text-foreground">Terms</Link></li>
                <li><Link to="#" className="text-sm text-muted-foreground hover:text-foreground">Security</Link></li>
              </ul>
            </div>
          </div>
          <div className="mt-12 pt-8 border-t border-border flex flex-col md:flex-row items-center justify-between text-sm">
            <p className="text-muted-foreground">© 2023 Project Managment System. All rights reserved.</p>
            <div className="flex items-center gap-4 mt-4 md:mt-0">
              <Link to="#" className="text-muted-foreground hover:text-foreground">
                Privacy Policy
              </Link>
              <Link to="#" className="text-muted-foreground hover:text-foreground">
                Terms of Service
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default PricingPage;
