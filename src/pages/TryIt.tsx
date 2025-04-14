
import React from "react";
import GithubFetcher from "@/components/GithubFetcher";
import Header from "@/components/Header";
import { Separator } from "@/components/ui/separator";
import { FileText } from "lucide-react";

const TryIt = () => {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      
      {/* Tool Section */}
      <section className="py-16 flex-grow">
        <div className="container mx-auto max-w-4xl px-4">
          <div className="text-center mb-10 animate-fade-in">
            <div className="flex items-center justify-center gap-2 mb-4">
              <FileText className="h-10 w-10 text-primary" />
              <h1 className="text-4xl font-bold">Text.LLM</h1>
            </div>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Enter a GitHub repository URL below to gather all relevant code files for your LLM context.
            </p>
          </div>
          
          <div className="animate-fade-in delay-150">
            <GithubFetcher />
          </div>
        </div>
      </section>
      
      <Separator />
      
      {/* Footer */}
      <footer className="py-8 mt-auto">
        <div className="container mx-auto max-w-5xl px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center mb-4 md:mb-0">
              <span className="font-medium">Text.LLM</span>
            </div>
            <p className="text-sm text-muted-foreground text-center">
              Note: For private repositories or to increase rate limits, use a GitHub personal access token.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default TryIt;
