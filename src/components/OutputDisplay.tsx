
import React, { useRef, useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Clipboard, Check, AlertCircle, ChevronDown, ChevronUp, Copy, CheckSquare, Square } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Checkbox } from "@/components/ui/checkbox";

interface OutputDisplayProps {
  content: string;
  loading: boolean;
  error: string | null;
}

const OutputDisplay = ({ content, loading, error }: OutputDisplayProps) => {
  const { toast } = useToast();
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [isCopied, setIsCopied] = useState(false);
  const [expandedFile, setExpandedFile] = useState<string | null>(null);
  const [copiedFiles, setCopiedFiles] = useState<Record<string, boolean>>({});
  const [files, setFiles] = useState<{ name: string; content: string; selected: boolean }[]>([]);
  const [allSelected, setAllSelected] = useState(true);
  
  // Parse content to separate files
  const parseContentToFiles = (content: string) => {
    if (!content) return [];
    
    const fileRegex = /File: (.*?)\n={80}\n([\s\S]*?)(?=\n={80}\n\n|$)/g;
    const parsedFiles: { name: string; content: string; selected: boolean }[] = [];
    
    let match;
    while ((match = fileRegex.exec(content)) !== null) {
      parsedFiles.push({
        name: match[1],
        content: match[2],
        selected: true
      });
    }
    
    return parsedFiles;
  };
  
  // Update files when content changes
  useEffect(() => {
    const parsedFiles = parseContentToFiles(content);
    setFiles(parsedFiles);
    setAllSelected(true);
  }, [content]);
  
  const toggleSelectAll = (checked: boolean) => {
    setAllSelected(checked);
    setFiles(files.map(file => ({ ...file, selected: checked })));
    
    // Show feedback toast
    if (checked && files.length > 0) {
      toast({
        title: "All files selected",
        description: `${files.length} files have been selected`,
        duration: 1500,
      });
    } else if (!checked && files.length > 0) {
      toast({
        title: "All files deselected",
        description: "You can select individual files as needed",
        duration: 1500,
      });
    }
  };
  
  const toggleFileSelection = (fileName: string, checked: boolean) => {
    setFiles(files.map(file => 
      file.name === fileName ? { ...file, selected: checked } : file
    ));
    
    // Update allSelected state based on current selections
    const updatedFiles = files.map(file => 
      file.name === fileName ? { ...file, selected: checked } : file
    );
    setAllSelected(updatedFiles.every(file => file.selected));
  };
  
  const copyToClipboard = async () => {
    if (files.length === 0) return;
    
    try {
      // Only include selected files
      const selectedContent = files
        .filter(file => file.selected)
        .map(file => `File: ${file.name}\n${"=".repeat(80)}\n${file.content}\n${"=".repeat(80)}\n\n`)
        .join("");
      
      await navigator.clipboard.writeText(selectedContent);
      setIsCopied(true);
      toast({
        title: "Copied to clipboard",
        description: `${files.filter(file => file.selected).length} files have been copied to clipboard`,
        duration: 3000,
      });
      
      setTimeout(() => setIsCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
      toast({
        title: "Copy failed",
        description: "Could not copy to clipboard. Please try again.",
        variant: "destructive",
        duration: 3000,
      });
    }
  };
  
  const copyFileContent = async (fileName: string, fileContent: string) => {
    try {
      await navigator.clipboard.writeText(fileContent);
      setCopiedFiles(prev => ({ ...prev, [fileName]: true }));
      toast({
        title: "Copied file content",
        description: `${fileName} has been copied to clipboard`,
        duration: 2000,
      });
      
      setTimeout(() => {
        setCopiedFiles(prev => ({ ...prev, [fileName]: false }));
      }, 2000);
    } catch (err) {
      console.error("Failed to copy file:", err);
      toast({
        title: "Copy failed",
        description: "Could not copy to clipboard. Please try again.",
        variant: "destructive",
        duration: 3000,
      });
    }
  };
  
  const toggleExpandFile = (fileName: string) => {
    if (expandedFile === fileName) {
      setExpandedFile(null);
    } else {
      setExpandedFile(fileName);
    }
  };

  const toggleExpandAll = () => {
    if (expandedFile) {
      setExpandedFile(null);
    } else if (files.length > 0) {
      setExpandedFile(files[0].name);
    }
  };

  if (loading) {
    return (
      <div className="border rounded-lg p-6 mt-8 bg-muted/20 flex items-center justify-center h-48 animate-pulse">
        <div className="flex flex-col items-center">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-muted-foreground">Fetching repository contents...</p>
          <p className="text-muted-foreground/60 text-xs mt-2">This may take a while for large repositories</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="border border-destructive/50 rounded-lg p-6 mt-8 bg-destructive/5 animate-fade-in">
        <div className="flex items-start">
          <AlertCircle className="text-destructive mr-3 h-5 w-5 mt-0.5" />
          <div>
            <h3 className="text-destructive font-medium text-lg">Error</h3>
            <p className="text-destructive/80 mt-1">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  if (files.length === 0) {
    return null;
  }

  return (
    <div className="mt-8 animate-fade-in">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-medium text-foreground">Repository Contents</h3>
        <div className="flex items-center gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            className={`flex items-center gap-1.5 transition-all duration-200 ${allSelected ? 'bg-primary/10' : ''}`}
            onClick={() => toggleSelectAll(!allSelected)}
          >
            {allSelected ? (
              <>
                <CheckSquare className="h-4 w-4" />
                Deselect All
              </>
            ) : (
              <>
                <Square className="h-4 w-4" />
                Select All
              </>
            )}
          </Button>
          <Button 
            variant="default" 
            size="sm" 
            className="flex items-center gap-1.5 transition-all duration-300 hover:shadow-md"
            onClick={copyToClipboard}
            disabled={isCopied || files.filter(file => file.selected).length === 0}
          >
            {isCopied ? (
              <>
                <Check className="h-4 w-4" />
                Copied!
              </>
            ) : (
              <>
                <Clipboard className="h-4 w-4" />
                Copy Selected
              </>
            )}
          </Button>
        </div>
      </div>
      
      <div className="border rounded-lg shadow-sm bg-card transition-all duration-300 hover:shadow-md">
        <div className="p-4 flex justify-between items-center bg-muted/50 rounded-t-lg">
          <h4 className="font-medium">Files ({files.length})</h4>
          <Button 
            variant="ghost" 
            size="sm"
            className="transition-colors duration-200 hover:bg-muted"
            onClick={toggleExpandAll}
          >
            {expandedFile ? "Collapse All" : "Expand All"}
          </Button>
        </div>
        
        <ScrollArea className="h-[500px]">
          <div className="p-2">
            {files.map((file, index) => (
              <div key={index} className="mb-2 last:mb-0">
                <div className="flex items-center justify-between p-3 rounded-md bg-muted/30 hover:bg-muted/50 transition-colors duration-150">
                  <div className="flex items-center space-x-3 flex-1">
                    <Checkbox 
                      id={`file-${index}`} 
                      checked={file.selected}
                      onCheckedChange={(checked) => toggleFileSelection(file.name, checked === true)}
                      className="transition-transform duration-200 data-[state=checked]:scale-110"
                    />
                    <div 
                      className="truncate font-mono text-sm cursor-pointer flex-1 transition-colors duration-150 hover:text-primary"
                      onClick={() => toggleExpandFile(file.name)}
                    >
                      {file.name}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button 
                      variant="ghost" 
                      size="sm"
                      className="h-8 w-8 p-0 transition-transform duration-150 hover:scale-110" 
                      onClick={() => copyFileContent(file.name, file.content)}
                    >
                      {copiedFiles[file.name] ? (
                        <Check className="h-4 w-4 text-green-500" />
                      ) : (
                        <Copy className="h-4 w-4" />
                      )}
                      <span className="sr-only">Copy file</span>
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="h-8 w-8 p-0 transition-transform duration-150 hover:scale-110"
                      onClick={() => toggleExpandFile(file.name)}
                    >
                      {expandedFile === file.name ? (
                        <ChevronUp className="h-4 w-4" />
                      ) : (
                        <ChevronDown className="h-4 w-4" />
                      )}
                      <span className="sr-only">Toggle expand</span>
                    </Button>
                  </div>
                </div>
                
                {expandedFile === file.name && (
                  <div className="mt-1 border rounded-md p-3 bg-card overflow-x-auto animate-fade-in">
                    <pre className="text-xs md:text-sm font-mono whitespace-pre-wrap break-all">
                      {file.content}
                    </pre>
                  </div>
                )}
                
                {index < files.length - 1 && <Separator className="my-2" />}
              </div>
            ))}
          </div>
        </ScrollArea>
      </div>
    </div>
  );
};

export default OutputDisplay;
