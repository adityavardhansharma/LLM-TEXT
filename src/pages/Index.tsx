
import React from "react";
import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import { ArrowRight, Code, FileText, Share2, Zap, Github, Star } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "react-router-dom";

const Index = () => {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      
      {/* Hero Section */}
      <section className="pt-16 pb-20 lg:pt-28 px-4">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-foreground mb-6">
              All Your Repository Code <span className="text-primary">For Your LLM</span>
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto">
              Quickly gather all code files from any GitHub repository into a single text file, 
              perfect for sharing with LLMs and AI assistants.
            </p>
            <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="gap-2" asChild>
                <Link to="/try-it">
                  Get Started <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
      
      {/* Features Section */}
      <section className="py-20 bg-muted/30" id="features">
        <div className="container mx-auto max-w-6xl px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Why use Text.LLM?</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              A simple, powerful tool designed to make sharing code with AI assistants quick and easy.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card>
              <CardHeader className="pb-2">
                <Zap className="h-10 w-10 text-primary mb-2" />
                <CardTitle>Fast &amp; Easy</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Just paste a GitHub URL, click a button, and get all code files assembled into a single document.
                </CardDescription>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <Code className="h-10 w-10 text-primary mb-2" />
                <CardTitle>LLM Friendly</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Formatted specifically for large language models with clear file separation and context.
                </CardDescription>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <Share2 className="h-10 w-10 text-primary mb-2" />
                <CardTitle>Easy Sharing</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  One-click copy to clipboard for effortless sharing with your favorite AI assistant.
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
      
      {/* How It Works Section */}
      <section className="py-20" id="how-it-works">
        <div className="container mx-auto max-w-5xl px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">How It Works</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              A simple three-step process to gather all code from any public GitHub repository.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            <div className="flex flex-col items-center text-center">
              <div className="w-12 h-12 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xl font-semibold mb-4">1</div>
              <h3 className="text-xl font-medium mb-2">Paste GitHub URL</h3>
              <p className="text-muted-foreground">Enter any GitHub repository URL into the input field.</p>
            </div>
            
            <div className="flex flex-col items-center text-center">
              <div className="w-12 h-12 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xl font-semibold mb-4">2</div>
              <h3 className="text-xl font-medium mb-2">Fetch Repository</h3>
              <p className="text-muted-foreground">Click the 'Fetch Repository' button to analyze and retrieve all files.</p>
            </div>
            
            <div className="flex flex-col items-center text-center">
              <div className="w-12 h-12 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xl font-semibold mb-4">3</div>
              <h3 className="text-xl font-medium mb-2">Copy &amp; Share</h3>
              <p className="text-muted-foreground">Click 'Copy All' and paste the formatted code into your AI assistant chat.</p>
            </div>
          </div>
          
          <div className="text-center mt-12">
            <Button size="lg" className="gap-2" asChild>
              <Link to="/try-it">
                Try It Now <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
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

export default Index;
