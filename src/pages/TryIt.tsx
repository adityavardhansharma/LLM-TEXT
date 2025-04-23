import React from "react";
import GithubFetcher from "@/components/GithubFetcher";
import Header from "@/components/Header";
import { Separator } from "@/components/ui/separator";
import { Card } from "@/components/ui/card";
import { FileText, History, FolderGit2 } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

const TryIt = () => {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-primary/5 to-background pt-16 pb-8">
        <div className="container mx-auto max-w-4xl px-4">
          <div className="text-center animate-fade-in">
            <div className="flex items-center justify-center gap-2 mb-4">
              <FileText className="h-8 w-8 text-primary" />
              <h1 className="text-3xl md:text-4xl font-bold">Text.LLM</h1>
            </div>
            <h2 className="text-xl md:text-2xl font-medium mb-3">Share Any Repository with Your LLM</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Instantly convert GitHub repositories into LLM-friendly format for better context and more accurate assistance.
            </p>
          </div>
        </div>
      </section>
      
      {/* Main Tool Section */}
      <section className="py-8 flex-grow">
        <div className="container mx-auto max-w-4xl px-4">
          <div className="mb-8">
            <div className="mx-auto overflow-hidden rounded-lg border border-border flex max-w-md">
              <div className="flex-1 bg-background flex items-center justify-center py-3 font-medium text-sm shadow-sm">
                <FolderGit2 className="h-4 w-4 mr-1.5" />
                <span>Fetch Repository</span>
              </div>
              
              <TooltipProvider delayDuration={200}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="flex-1 bg-muted/30 flex items-center justify-center py-3 font-medium text-sm text-muted-foreground cursor-not-allowed opacity-70">
                      <History className="h-4 w-4 mr-1.5" />
                      <span>History</span>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent side="bottom" sideOffset={5} className="bg-primary text-primary-foreground font-medium">
                    <p>Coming Soon</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
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
              <FileText className="h-5 w-5 mr-2 text-primary" />
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
