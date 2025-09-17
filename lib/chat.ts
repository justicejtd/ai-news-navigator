import { format } from "date-fns";
import { getArticlesByIds, getFeed, toFeedItem } from "@lib/feed";
import { ChatCitation, ChatRequest, ChatResponse, SummaryMode } from "@lib/types";

const TOPIC_KEYWORDS: Record<string, string[]> = {
  safety: ["safety", "alignment", "risk", "incident"],
  research: ["research", "paper", "arxiv", "study", "benchmark"],
  policy: ["policy", "regulation", "law", "act", "senate", "compliance"],
  tools: ["tool", "product", "platform", "sdk", "copilot"],
  agents: ["agent", "autonomous", "workflow"],
};

function detectSort(message: string): ChatRequest["context"]["route"] | undefined {
  const lower = message.toLowerCase();
  if (lower.includes("trend")) return "trending";
  if (lower.includes("policy")) return "policy";
  if (lower.includes("research")) return "research";
  return undefined;
}

function detectTag(message: string): string | undefined {
  const lower = message.toLowerCase();
  for (const [tag, keywords] of Object.entries(TOPIC_KEYWORDS)) {
    if (keywords.some((keyword) => lower.includes(keyword))) {
      return tag === "tools" ? "Tools" : tag === "agents" ? "Agents" : tag.charAt(0).toUpperCase() + tag.slice(1);
    }
  }
  return undefined;
}

function detectSummaryMode(message: string, fallback: SummaryMode): SummaryMode {
  const lower = message.toLowerCase();
  if (lower.includes("expert")) return "expert";
  if (lower.includes("like i'm 12") || lower.includes("beginner")) return "beginner";
  return fallback;
}

function buildCitations(articleIds: string[]): ChatCitation[] {
  const articles = getArticlesByIds(articleIds);
  return articles.map((article) => ({
    articleId: article.id,
    title: article.title,
    domain: article.source.domain,
    url: article.url,
    publishedAt: article.publishedAt,
  }));
}

function formatPublishedTime(iso: string) {
  try {
    return format(new Date(iso), "MMM d, yyyy HH:mm") + " UTC";
  } catch (error) {
    return iso;
  }
}

export async function generateChatResponse(request: ChatRequest): Promise<ChatResponse> {
  const message = request.message.trim();
  if (!message) {
    return {
      answer: "I didn't catch a question. Could you rephrase what you're looking for?",
      citations: [],
      actions: [],
      confidence: "low",
    };
  }

  const fallbackMode: SummaryMode = request.context?.summaryMode ?? "beginner";
  const mode = detectSummaryMode(message, fallbackMode);
  const sortFromMessage = detectSort(message) as "latest" | "trending" | "research" | "policy" | undefined;
  const tagFromMessage = detectTag(message);

  let feed = getFeed({
    search: message,
    sort: sortFromMessage ?? "latest",
    tag: tagFromMessage,
    since: message.includes("today") ? "24h" : undefined,
  });

  if (!feed.items.length && tagFromMessage) {
    feed = getFeed({
      sort: sortFromMessage ?? "latest",
      tag: tagFromMessage,
      since: message.includes("today") ? "24h" : undefined,
    });
  }

  if (!feed.items.length) {
    feed = getFeed({
      sort: sortFromMessage ?? "latest",
      since: message.includes("today") ? "24h" : undefined,
    });
  }

  const contextualItems = request.context?.selectedIds?.length
    ? getArticlesByIds(request.context.selectedIds).map(toFeedItem)
    : [];

  const combined = [...contextualItems, ...feed.items];
  const seenIds = new Set<string>();
  const items = combined.filter((item) => {
    if (seenIds.has(item.id)) return false;
    seenIds.add(item.id);
    return true;
  }).slice(0, 3);
  if (!items.length) {
    return {
      answer:
        "I couldn't find matching articles yet. Try broadening the topic or adjusting the timeframe—I'm happy to search again!",
      citations: [],
      actions: ["alert:topic"],
      confidence: "low",
    };
  }

  const answerChunks = items.map((item, index) => {
    const summary = mode === "expert" ? item.summary.expert : item.summary.beginner;
    const why = item.summary.whyItMatters.map((point) => `• ${point}`).join("\n");
    const published = formatPublishedTime(item.publishedAt);
    return `${index + 1}. **${item.title}** — ${summary}\n${why}\nSource: ${item.source.name} (${item.source.domain}, ${published}) → ${item.url}`;
  });

  const nextSteps = [
    "read the full article",
    "save to a collection",
    "set an alert for updates",
  ];

  const answer = `Here${items.length > 1 ? " are" : "'s"} what I found${tagFromMessage ? ` on ${tagFromMessage}` : ""}:\n\n${answerChunks.join(
    "\n\n"
  )}\n\nNeed more? I can help you ${nextSteps.join(", ")}.
`;

  const citations = buildCitations(items.map((item) => item.id));
  const actions = [
    ...items.map((item) => `open:${item.url}`),
    ...items.map((item) => `save:${item.id}`),
  ];
  if (tagFromMessage) {
    actions.push(`alert:${tagFromMessage.toLowerCase()}`);
  }

  return {
    answer,
    citations,
    actions,
    confidence: items.length >= 2 ? "high" : "medium",
  };
}
