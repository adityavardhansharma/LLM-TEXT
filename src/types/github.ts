
/**
 * GitHub related types
 */

export interface GithubRepo {
  owner: string;
  repo: string;
  url: string;
}

export interface ProcessedFile {
  path: string;
  content: string;
}
