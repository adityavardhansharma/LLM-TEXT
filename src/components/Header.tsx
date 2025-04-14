
import React from "react";
import { Link, useLocation } from "react-router-dom";
import { FileText, Github, Star } from "lucide-react";
import { Button } from "@/components/ui/button";

const Header = () => {
  const location = useLocation();
  const isHomePage = location.pathname === "/";
  
  return (
    <header className="border-b border-border sticky top-0 z-10 w-full bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <Link to="/" className="flex items-center gap-2 transition-transform duration-300 hover:scale-105">
          <FileText className="h-6 w-6 text-primary" />
          <span className="font-semibold text-xl">Text.LLM</span>
        </Link>
        <nav className="hidden md:flex items-center gap-6">
          <Link 
            to="/" 
            className="text-foreground/80 hover:text-foreground transition-colors relative after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-full after:origin-bottom-right after:scale-x-0 after:bg-primary after:transition-transform after:duration-300 hover:after:origin-bottom-left hover:after:scale-x-100"
          >
            Home
          </Link>
          {isHomePage ? (
            <>
              <a 
                href="#features" 
                className="text-foreground/80 hover:text-foreground transition-colors relative after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-full after:origin-bottom-right after:scale-x-0 after:bg-primary after:transition-transform after:duration-300 hover:after:origin-bottom-left hover:after:scale-x-100"
              >
                Features
              </a>
              <a 
                href="#how-it-works" 
                className="text-foreground/80 hover:text-foreground transition-colors relative after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-full after:origin-bottom-right after:scale-x-0 after:bg-primary after:transition-transform after:duration-300 hover:after:origin-bottom-left hover:after:scale-x-100"
              >
                How It Works
              </a>
            </>
          ) : (
            <>
              <Link 
                to="/#features" 
                className="text-foreground/80 hover:text-foreground transition-colors relative after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-full after:origin-bottom-right after:scale-x-0 after:bg-primary after:transition-transform after:duration-300 hover:after:origin-bottom-left hover:after:scale-x-100"
              >
                Features
              </Link>
              <Link 
                to="/#how-it-works" 
                className="text-foreground/80 hover:text-foreground transition-colors relative after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-full after:origin-bottom-right after:scale-x-0 after:bg-primary after:transition-transform after:duration-300 hover:after:origin-bottom-left hover:after:scale-x-100"
              >
                How It Works
              </Link>
            </>
          )}
        </nav>
        <div className="flex items-center gap-4">
          <Button variant="outline" size="sm" asChild className="transition-all duration-300 hover:shadow-md">
            <a href="https://github.com/yourusername/text-llm" target="_blank" rel="noopener noreferrer">
              <Github className="mr-1.5 h-4 w-4" />
              GitHub
            </a>
          </Button>
          <Button variant="ghost" size="sm" asChild className="transition-all duration-300 hover:shadow-md">
            <a href="https://github.com/yourusername/text-llm/stargazers" target="_blank" rel="noopener noreferrer">
              <Star className="mr-1.5 h-4 w-4" />
              Star
            </a>
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Header;
