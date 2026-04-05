// GitHub adapter -- for cloning repos, creating PRs, and managing repo access.
// Requires GITHUB_PAT environment variable (fine-grained, repo-scoped).

const GITHUB_API = "https://api.github.com";
const GITHUB_PAT = process.env.GITHUB_PAT || "";

interface RepoInfo {
  owner: string;
  repo: string;
}

export function parseRepoUrl(url: string): RepoInfo | null {
  try {
    const u = new URL(url);
    const parts = u.pathname.split("/").filter(Boolean);
    if (parts.length >= 2) {
      return { owner: parts[0], repo: parts[1] };
    }
  } catch {
    // Try ssh format: git@github.com:owner/repo.git
    const match = url.match(/github\.com[:/]([^/]+)\/([^/]+?)(?:\.git)?$/);
    if (match) {
      return { owner: match[1], repo: match[2] };
    }
  }
  return null;
}

// PLACEHOLDER: These functions require the @octokit/rest package.
// Install with: npm install @octokit/rest
// import { Octokit } from "@octokit/rest";
// const octokit = new Octokit({ auth: GITHUB_PAT });

export async function checkRepoAccess(repoUrl: string): Promise<{ accessible: boolean; isPrivate: boolean; message: string }> {
  const info = parseRepoUrl(repoUrl);
  if (!info) {
    return { accessible: false, isPrivate: false, message: "Invalid GitHub URL" };
  }

  // Placeholder -- in production, use octokit.repos.get({ owner: info.owner, repo: info.repo })
  if (!GITHUB_PAT || GITHUB_PAT.includes("PLACEHOLDER")) {
    return { accessible: false, isPrivate: false, message: "GitHub PAT not configured" };
  }

  return { accessible: true, isPrivate: false, message: "Repo accessible" };
}

export async function createScaffoldPR(_repoUrl: string, _scaffoldBranch: string, _files: { path: string; content: string }[]): Promise<string | null> {
  // Placeholder -- creates a PR with scaffold files
  console.warn("[GitHub] createScaffoldPR is a placeholder. Install @octokit/rest to enable.");
  return "https://github.com/PLACEHOLDER/pull/1";
}
