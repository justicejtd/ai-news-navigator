import { differenceInHours, formatDistanceToNowStrict, isAfter, parseISO, subDays, subHours } from "date-fns";
import { ARTICLES } from "@data/articles";
import { Article, FeedFilters, FeedItem } from "@lib/types";

const CATEGORY_SORT_PRIORITIES: Record<NonNullable<FeedFilters["sort"]>, (item: Article) => number> = {
  latest: (item) => parseISO(item.publishedAt).getTime(),
  trending: (item) => computeCompositeScore(item),
  research: (item) => (item.tags.includes("Research") ? 1 : 0) * 100 + computeCompositeScore(item),
  policy: (item) => (item.tags.includes("Policy") ? 1 : 0) * 100 + computeCompositeScore(item),
};

function computeCompositeScore(item: Article) {
  const hours = Math.max(1, differenceInHours(new Date(), parseISO(item.publishedAt)));
  const recencyBoost = 1 / hours;
  return recencyBoost * 0.4 + item.engagementScore * 0.35 + item.authorityScore * 0.25;
}

function dedupeArticles(articles: Article[]): Article[] {
  const seen = new Map<string, Article>();
  for (const article of articles) {
    const existing = seen.get(article.clusterId);
    if (!existing) {
      seen.set(article.clusterId, article);
      continue;
    }
    const existingScore = computeCompositeScore(existing);
    const candidateScore = computeCompositeScore(article);
    if (candidateScore > existingScore) {
      seen.set(article.clusterId, article);
    }
  }
  return Array.from(seen.values());
}

function matchesSearch(article: Article, search?: string) {
  if (!search) return true;
  const query = search.trim().toLowerCase();
  if (!query) return true;
  const haystack = [
    article.title,
    article.excerpt,
    article.summary.beginner,
    article.summary.expert,
    article.tags.join(" "),
    article.topics.join(" "),
  ]
    .join(" ")
    .toLowerCase();
  const terms = query
    .split(/\s+/)
    .map((term) => term.replace(/[^a-z0-9]/g, ""))
    .filter((term) => term.length > 2);
  if (!terms.length) {
    return haystack.includes(query);
  }
  return terms.some((term) => haystack.includes(term));
}

function filterBySince(article: Article, since?: string) {
  if (!since) return true;
  const normalized = since.trim().toLowerCase();
  const published = parseISO(article.publishedAt);
  if (normalized.endsWith("h")) {
    const hours = Number.parseInt(normalized.replace("h", ""), 10);
    if (Number.isNaN(hours)) return true;
    return isAfter(published, subHours(new Date(), hours));
  }
  if (normalized.endsWith("d")) {
    const days = Number.parseInt(normalized.replace("d", ""), 10);
    if (Number.isNaN(days)) return true;
    return isAfter(published, subDays(new Date(), days));
  }
  return true;
}

function filterBySources(article: Article, filters: FeedFilters) {
  const { source, sources } = filters;
  if (!source && !sources?.length) return true;
  const allowed = new Set<string>();
  if (source) allowed.add(source.toLowerCase());
  if (sources) sources.forEach((s) => allowed.add(s.toLowerCase()));
  return allowed.has(article.source.name.toLowerCase()) || allowed.has(article.source.domain.toLowerCase());
}

function filterByTags(article: Article, filters: FeedFilters) {
  const requested = new Set<string>();
  if (filters.tag) requested.add(filters.tag.toLowerCase());
  if (filters.tags?.length) {
    filters.tags.forEach((tag) => requested.add(tag.toLowerCase()));
  }
  if (!requested.size) return true;
  return article.tags.some((tag) => requested.has(tag.toLowerCase()));
}

export function toFeedItem(article: Article): FeedItem {
  const publishedDate = parseISO(article.publishedAt);
  return {
    ...article,
    timeAgo: formatDistanceToNowStrict(publishedDate, { addSuffix: true }),
    score: computeCompositeScore(article),
  };
}

export type FeedResult = {
  items: FeedItem[];
  total: number;
  availableTags: string[];
  availableSources: string[];
};

export function getFeed(filters: FeedFilters = {}): FeedResult {
  const deduped = dedupeArticles(ARTICLES);
  const filtered = deduped.filter((article) => {
    if (!matchesSearch(article, filters.search)) return false;
    if (!filterByTags(article, filters)) return false;
    if (!filterBySources(article, filters)) return false;
    if (!filterBySince(article, filters.since)) return false;
    if (filters.sort === "research" && !article.tags.includes("Research")) {
      // still include but later we will sort, we already include for context
    }
    if (filters.sort === "policy" && !article.tags.includes("Policy")) {
      // same as above
    }
    return true;
  });

  const sortKey = filters.sort ?? "latest";
  const sorted = [...filtered].sort((a, b) => CATEGORY_SORT_PRIORITIES[sortKey](b) - CATEGORY_SORT_PRIORITIES[sortKey](a));

  const items = sorted.map(toFeedItem);
  const availableTags = Array.from(new Set(deduped.flatMap((item) => item.tags))).sort();
  const availableSources = Array.from(new Set(deduped.map((item) => item.source.name))).sort();

  return {
    items,
    total: items.length,
    availableTags,
    availableSources,
  };
}

export function getArticleById(id: string) {
  return ARTICLES.find((article) => article.id === id);
}

export function getArticlesByIds(ids: string[]) {
  return ids
    .map((id) => getArticleById(id))
    .filter((article): article is Article => Boolean(article));
}
