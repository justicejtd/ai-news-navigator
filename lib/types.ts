export type SummaryMode = "beginner" | "expert";

export type ArticleSummary = {
  beginner: string;
  expert: string;
  whyItMatters: string[];
};

export type Article = {
  id: string;
  title: string;
  url: string;
  source: {
    name: string;
    domain: string;
    logo?: string;
  };
  publishedAt: string;
  summary: ArticleSummary;
  tags: string[];
  topics: string[];
  clusterId: string;
  engagementScore: number;
  authorityScore: number;
  excerpt: string;
};

export type FeedFilters = {
  search?: string;
  tag?: string;
  tags?: string[];
  source?: string;
  sources?: string[];
  since?: string;
  sort?: "latest" | "trending" | "research" | "policy";
};

export type FeedItem = Article & {
  timeAgo: string;
  score: number;
};

export type ChatMessage = {
  id: string;
  role: "user" | "assistant" | "system";
  content: string;
  createdAt: number;
  citations?: ChatCitation[];
  actions?: ChatAction[];
  confidence?: "low" | "medium" | "high";
};

export type ChatCitation = {
  articleId: string;
  title: string;
  domain: string;
  url: string;
  publishedAt: string;
};

export type ChatAction =
  | { type: "open"; target: string }
  | { type: "save"; target: string }
  | { type: "alert"; target: string };

export type ChatRequest = {
  message: string;
  context?: {
    route?: string;
    selectedIds?: string[];
    summaryMode?: SummaryMode;
  };
};

export type ChatResponse = {
  answer: string;
  citations: ChatCitation[];
  actions: string[];
  confidence: "low" | "medium" | "high";
};

export type Collection = {
  id: string;
  name: string;
  description?: string;
  itemIds: string[];
  createdAt: number;
};

export type SavedItem = {
  article: Article;
  savedAt: number;
  collectionIds: string[];
};

export type SavedCollectionsState = {
  collections: Collection[];
  items: Record<string, SavedItem>;
};
