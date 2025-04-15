
/**
 * Service for interacting with GitHub API
 */

// Base URL for GitHub API
const GITHUB_API_BASE_URL = "https://api.github.com";

// List of files and directories to exclude
const EXCLUDED_PATHS = [
  // Directories
  '.gitignore', 
  '.git', 
  'node_modules', 
  '.idea', 
  '.vscode', 
  '.vercel',
  '.next',
  'dist',
  'build',
  'coverage',
  '.github',
  '.husky',
  '.cache',
  'storybook-static',
  '.storybook',
  'out',
  'logs',
  'tmp',
  
  // File types
  '.DS_Store',
  '.env',
  '.env.local',
  '.env.development',
  '.env.production',
  '.eslintcache',
  '.npmrc',
  '.yarnrc',
  '.dockerignore'
];

// File extensions to exclude
const EXCLUDED_EXTENSIONS = [
  // Images
  '.png', '.jpg', '.jpeg', '.gif', '.svg', '.webp', '.ico', '.bmp', '.tiff','.lockb',
  
  // Fonts
  '.ttf', '.otf', '.woff', '.woff2', '.eot',
  
  // Media
  '.mp4', '.mp3', '.wav', '.ogg', '.avi', '.mov', '.webm',
  
  // Archives
  '.zip', '.rar', '.7z', '.tar', '.gz',
  
  // Documents
  '.pdf', '.doc', '.docx', '.xls', '.xlsx', '.ppt', '.pptx',
  
  // Binaries
  '.exe', '.dll', '.so', '.dylib', '.bin',
  
  // Cache and lock files
  '.lock', '.cache',
  
  // Data files
  '.csv', '.xml'
];

// Interface for repository content item
export interface RepoContentItem {
  name: string;
  path: string;
  sha: string;
  size: number;
  url: string;
  html_url: string;
  git_url: string;
  download_url: string | null;
  type: "file" | "dir";
  content?: string;
  encoding?: string;
}

/**
 * Extract owner and repo name from GitHub URL
 */
export const parseGithubUrl = (url: string): { owner: string; repo: string } | null => {
  // Remove trailing slash if present
  url = url.replace(/\/$/, "");
  
  // Remove .git extension if present
  url = url.replace(/\.git$/, "");
  
  // Match GitHub URLs in various formats
  const githubRegex = /github\.com\/([^/]+)\/([^/]+)/;
  const match = url.match(githubRegex);
  
  if (!match) return null;
  
  return {
    owner: match[1],
    repo: match[2]
  };
};

/**
 * Check if a path should be excluded
 */
const shouldExcludePath = (path: string): boolean => {
  // Check direct matches
  if (EXCLUDED_PATHS.includes(path)) return true;
  
  // Check path components
  const pathParts = path.split('/');
  for (const part of pathParts) {
    if (EXCLUDED_PATHS.includes(part)) return true;
  }
  
  // Check file extensions
  const fileExtension = path.substring(path.lastIndexOf('.'));
  if (EXCLUDED_EXTENSIONS.includes(fileExtension)) return true;
  
  // Skip files larger than 1MB (likely binary files)
  // We'll check this during the file fetch process
  
  return false;
};

/**
 * Get contents of a directory in a repository
 */
export const getRepoContents = async (
  owner: string,
  repo: string,
  path: string = "",
  token?: string
): Promise<RepoContentItem[]> => {
  const url = `${GITHUB_API_BASE_URL}/repos/${owner}/${repo}/contents/${path}`;
  
  const headers: HeadersInit = {
    'Accept': 'application/vnd.github.v3+json'
  };
  
  if (token) {
    headers['Authorization'] = `token ${token}`;
  }
  
  const response = await fetch(url, { headers });
  if (!response.ok) {
    throw new Error(`GitHub API Error: ${response.status} ${response.statusText}`);
  }
  
  return await response.json();
};

/**
 * Get file content from a repository
 */
export const getFileContent = async (
  owner: string,
  repo: string,
  path: string,
  token?: string
): Promise<string> => {
  const url = `${GITHUB_API_BASE_URL}/repos/${owner}/${repo}/contents/${path}`;
  
  const headers: HeadersInit = {
    'Accept': 'application/vnd.github.v3+json'
  };
  
  if (token) {
    headers['Authorization'] = `token ${token}`;
  }
  
  const response = await fetch(url, { headers });
  if (!response.ok) {
    throw new Error(`GitHub API Error: ${response.status} ${response.statusText}`);
  }
  
  const data = await response.json();
  
  // Skip files larger than 1MB (likely binary files)
  if (data.size > 1024 * 1024) {
    return "[File too large to display]";
  }
  
  // GitHub API returns content as base64 encoded
  if (data.encoding === "base64" && data.content) {
    return atob(data.content.replace(/\n/g, ""));
  }
  
  return "";
};

/**
 * Recursively gather all files from a repository
 */
export const getAllFilesFromRepo = async (
  owner: string,
  repo: string,
  path: string = "",
  token?: string
): Promise<{ path: string; content: string }[]> => {
  const contents = await getRepoContents(owner, repo, path, token);
  let files: { path: string; content: string }[] = [];
  
  for (const item of contents) {
    // Skip excluded paths
    if (shouldExcludePath(item.path)) continue;
    
    if (item.type === "file") {
      try {
        // Skip files larger than 1MB (likely binary files)
        if (item.size > 1024 * 1024) {
          files.push({ path: item.path, content: `[File too large to display: ${item.path}]` });
          continue;
        }
        
        const content = await getFileContent(owner, repo, item.path, token);
        files.push({ path: item.path, content });
      } catch (error) {
        console.error(`Error fetching file ${item.path}:`, error);
        // Add empty content for binary files or files that couldn't be fetched
        files.push({ path: item.path, content: `[Binary file or error: ${item.path}]` });
      }
    } else if (item.type === "dir") {
      const dirFiles = await getAllFilesFromRepo(owner, repo, item.path, token);
      files = [...files, ...dirFiles];
    }
  }
  
  return files;
};

/**
 * Format repository files into a single string
 */
export const formatFilesForLLM = (files: { path: string; content: string; selected?: boolean }[]): string => {
  return files.filter(file => file.selected !== false)
    .map(file => 
      `File: ${file.path}\n${"=".repeat(80)}\n${file.content}\n${"=".repeat(80)}\n\n`
    ).join("");
};

