import React from "react";
import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Check, FileText, Github, Star, ArrowRight } from "lucide-react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";

const PricingTier = ({ 
  title, 
  price, 
  description, 
  features, 
  buttonText, 
  buttonVariant = "default", 
  badge = null,
  isDisabled = false
}: { 
  title: string; 
  price: string; 
  description: string; 
  features: string[]; 
  buttonText: string; 
  buttonVariant?: "default" | "outline" | "secondary"; 
  badge?: string | null;
  isDisabled?: boolean;
}) => (
  <Card className="flex flex-col h-full border-border">
    <CardHeader className="pb-2">
      {badge && (
        <Badge className="w-fit mb-2" variant="secondary">{badge}</Badge>
      )}
      <CardTitle className="text-2xl">{title}</CardTitle>
      <div className="mt-2 mb-2">
        <span className="text-3xl font-bold">{price}</span>
        {price !== "Enterprise" && price !== "Free" && <span className="text-muted-foreground ml-1">/year</span>}
      </div>
      <CardDescription>{description}</CardDescription>
    </CardHeader>
    <CardContent className="flex-grow">
      <ul className="space-y-2 mt-4">
        {features.map((feature, i) => (
          <li key={i} className="flex items-start">
            <Check className="h-5 w-5 text-primary mr-2 shrink-0 mt-0.5" />
            <span>{feature}</span>
          </li>
        ))}
      </ul>
    </CardContent>
    <CardFooter className="pt-4">
      {isDisabled ? (
        <Button variant="secondary" className="w-full opacity-60 cursor-not-allowed" size="lg" disabled>
          {buttonText}
        </Button>
      ) : (
        <Button variant={buttonVariant} className="w-full" size="lg" asChild>
          <Link to="/try-it">
            {buttonText}
          </Link>
        </Button>
      )}
    </CardFooter>
  </Card>
);

const Pricing = () => {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      
      {/* Pricing Hero Section */}
      <section className="pt-16 pb-4 lg:pt-20 px-4">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-8">
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-foreground mb-4">
              Simple, <span className="text-primary">Transparent</span> Pricing
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Choose the plan that's right for you and start sharing code with your LLM today.
            </p>
          </div>
        </div>
      </section>
      
      {/* Pricing Cards */}
      <section className="py-8 pb-20">
        <div className="container mx-auto max-w-6xl px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <PricingTier
              title="Free"
              price="Free"
              description="Perfect for occasional projects and exploration"
              features={[
                "Limited API rate",
                "Bring your own GitHub token for higher rate limits",
                "Community support",
                "GitHub URL required for each repository",
                "No repository memory"
              ]}
              buttonText="Get Started"
              buttonVariant="default"
            />
            
            <PricingTier
              title="Pro"
              price="$20"
              description="For developers who work with code regularly"
              features={[
                "20x higher rate limits than Free tier",
                "Bring your own key for larger repos",
                "Private repo access",
                "Priority support",
                "Connect GitHub account directly",
                "Access any repo without URL",
                "Memory for up to 10 accessed repos"
              ]}
              buttonText="Coming Soon"
              isDisabled={true}
            />
            
            <PricingTier
              title="Enterprise"
              price="Enterprise"
              description="For organizations with advanced needs"
              features={[
                "No rate limits",
                "Private repo access (token only needed for private repos)",
                "Custom UI",
                "Dedicated company support",
                "Connect GitHub account directly",
                "Access any repo without URL",
                "Unlimited repository memory",
                "Custom integrations available"
              ]}
              buttonText="Coming Soon"
              isDisabled={true}
            />
          </div>
        </div>
      </section>
      
      {/* FAQ Section */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto max-w-5xl px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Frequently Asked Questions</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Everything you need to know about our pricing plans
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
            <Card>
              <CardHeader>
                <CardTitle className="text-xl">What is a rate limit?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Rate limits determine how many GitHub API requests you can make in a given time period. 
                  Higher rate limits allow you to process larger repositories and make more frequent requests.
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="text-xl">Why would I need to bring my own token?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  GitHub restricts API access for unauthenticated requests. Your personal token provides higher rate limits
                  and access to private repositories you own.
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="text-xl">What is repository memory?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Repository memory allows the system to remember repositories you've previously accessed, so you don't need
                  to provide the URL again or re-fetch the repository.
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="text-xl">Can I upgrade plans later?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Yes! You can start with the Free tier and upgrade to Pro or Enterprise as your needs grow.
                  Your account settings will be preserved when upgrading.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-20">
        <div className="container mx-auto max-w-4xl px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to streamline your code sharing?</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto mb-10">
            Start with our Free tier today and experience the power of Text.LLM.
          </p>
          <Button size="lg" className="gap-2" asChild>
            <Link to="/try-it">
              Get Started Now <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      </section>
      
      {/* Footer */}
      <footer className="py-12 border-t mt-auto">
        <div className="container mx-auto max-w-5xl px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center mb-4 md:mb-0">
              <FileText className="h-5 w-5 mr-2" />
              <span className="font-medium">Text.LLM</span>
            </div>
            <p className="text-sm text-muted-foreground text-center">
              For private repositories or to increase rate limits, use a GitHub personal access token.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Pricing; 
