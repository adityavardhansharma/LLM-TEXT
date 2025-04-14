
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Download, FileText, EyeIcon, EyeOffIcon, InfoIcon, Github } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import OutputDisplay from "./OutputDisplay";
import { parseGithubUrl, getAllFilesFromRepo, formatFilesForLLM } from "@/services/githubService";
import { useToast } from "@/components/ui/use-toast";

const GithubFetcher = () => {
  const [repoUrl, setRepoUrl] = useState("");
  const [token, setToken] = useState("");
  const [showToken, setShowToken] = useState(false);
  const [loading, setLoading] = useState(false);
  const [content, setContent] = useState("");
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const handleFetchRepo = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setContent("");
    
    if (!repoUrl) {
      setError("Please enter a GitHub repository URL");
      return;
    }
    
    const repoInfo = parseGithubUrl(repoUrl);
    if (!repoInfo) {
      setError("Invalid GitHub repository URL. Please provide a URL like https://github.com/owner/repo");
      return;
    }
    
    setLoading(true);
    
    try {
      const files = await getAllFilesFromRepo(repoInfo.owner, repoInfo.repo, "", token || undefined);
      const formattedContent = formatFilesForLLM(files);
      setContent(formattedContent);
      
      toast({
        title: "Repository fetched successfully",
        description: `Found ${files.length} files in ${repoInfo.owner}/${repoInfo.repo}`,
      });
    } catch (err) {
      console.error("Error fetching repository:", err);
      setError(err instanceof Error ? err.message : "Failed to fetch repository contents");
      
      if (err instanceof Error && err.message.includes("404")) {
        if (token) {
          setError("Repository not found or access denied. Check if the repository exists and your token has sufficient permissions.");
        } else {
          setError("Repository not found. If this is a private repository, you'll need to provide a personal access token.");
        }
      } else if (err instanceof Error && err.message.includes("403")) {
        setError("API rate limit exceeded. Please provide a GitHub personal access token to increase your rate limit.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="shadow-md">
      <CardContent className="pt-6">
        <form onSubmit={handleFetchRepo} className="space-y-4">
          <div className="flex flex-col gap-3">
            <div className="relative flex-1">
              <div className="absolute left-3 top-3 text-muted-foreground">
                <Github className="h-4 w-4" />
              </div>
              <Input
                placeholder="https://github.com/username/repository"
                value={repoUrl}
                onChange={(e) => setRepoUrl(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <div className="relative flex-1">
              <div className="absolute left-3 top-3 text-muted-foreground">
                <div className="flex items-center">
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <InfoIcon className="h-4 w-4" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p className="max-w-xs">A GitHub token gives higher rate limits and access to private repositories. 
                        It's optional but recommended. You can create one in your GitHub settings &gt; Developer Settings &gt; Personal Access Tokens.</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
              </div>
              <div className="flex">
                <Input
                  type={showToken ? "text" : "password"}
                  placeholder="GitHub Personal Access Token (Optional)"
                  value={token}
                  onChange={(e) => setToken(e.target.value)}
                  className="pl-10 flex-1 rounded-r-none"
                />
                <Button 
                  type="button" 
                  variant="outline" 
                  className="rounded-l-none"
                  onClick={() => setShowToken(!showToken)}
                >
                  {showToken ? <EyeOffIcon className="h-4 w-4" /> : <EyeIcon className="h-4 w-4" />}
                </Button>
              </div>
            </div>
            
            <Button 
              type="submit" 
              disabled={loading} 
              className="flex items-center gap-2"
            >
              <Download className="h-4 w-4" />
              {loading ? "Fetching..." : "Fetch Repository"}
            </Button>
          </div>
        </form>
        
        <OutputDisplay 
          content={content} 
          loading={loading} 
          error={error} 
        />
      </CardContent>
    </Card>
  );
};

export default GithubFetcher;
