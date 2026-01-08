
export interface Project {
  id: string;
  title: string;
  description: string;
  fullDescription: string;
  problemStatement?: string;
  solutionStatement?: string;
  image: string;
  techStack: string[];
  isPaid: boolean;
  price?: number;
  demoUrl: string;
  authorId: string;
  authorName: string;
  authorAvatar: string;
  views: number;
  audit?: TrustAudit;
}

export interface TrustBreakdown {
  maintainability: number;
  security: number;
  documentation: number;
  relevance: number;
  readiness: number;
  ethics: number;
}

export interface TrustAudit {
  score: number;
  level: 'High' | 'Medium' | 'Low';
  breakdown: TrustBreakdown;
  reasoning: string;
  recommendations: string[];
  redFlags: string[];
  timestamp: string;
}

export interface ProblemStatement {
  id: string;
  ownerId: string;
  ownerName: string;
  title: string;
  publicSummary: string;
  protectedFullText: string;
  requiredSkills: string[];
  timestamp: string;
  status: 'Open' | 'Matched' | 'Closed';
  matchIntensity?: number;
  viewCount: number;
  interestedCount: number;
}

export interface ProblemResponse {
  id: string;
  problemId: string;
  responderId: string;
  responderName: string;
  approachOverview: string;
  skillsAlignment: string[];
  estimatedEffort: string;
  timestamp: string;
}

export interface Achievement {
  title: string;
  description: string;
  icon: string;
}

export interface Reward {
  name: string;
  year: string;
  platform: string;
}

export interface Developer {
  id: string;
  name: string;
  avatar: string;
  skills: string[];
  bio: string;
  github: string;
  githubUsername?: string; 
  contactEmail: string;
  projects: Project[];
  achievements: Achievement[];
  rewards: Reward[];
  rank?: string;
  followersCount: number;
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
  github?: string;
  githubUsername?: string;
  followedProjects: string[];
  followedTech: string[];
  purchasedProjectIds: string[];
}

export type NotificationType = 'FOLLOW' | 'ENGAGEMENT' | 'COMMENT' | 'CUSTOMIZATION' | 'UPDATE' | 'AI_INSIGHT' | 'DOWNLOAD' | 'PROBLEM_MATCH';

export interface Notification {
  id: string;
  type: NotificationType;
  message: string;
  targetName?: string;
  timestamp: string;
  isRead: boolean;
  priority: 'High' | 'Normal';
  progress?: number;
}
