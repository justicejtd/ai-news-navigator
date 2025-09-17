import { Article } from "@lib/types";

export const ARTICLES: Article[] = [
  {
    id: "openai-gpt5-roadmap",
    title: "OpenAI details roadmap toward GPT-5 with focus on agentic reliability",
    url: "https://openai.com/research/gpt-5-roadmap",
    source: { name: "OpenAI Research", domain: "openai.com" },
    publishedAt: new Date(Date.now() - 1000 * 60 * 60 * 3).toISOString(),
    summary: {
      beginner:
        "OpenAI shared how the next GPT version will better plan actions and verify itself so it makes fewer mistakes when helping people.",
      expert:
        "The roadmap highlights iterative agent alignment techniques, including tool-use safety filters, decomposed planning, and benchmark suites for measuring latent inconsistencies in long-horizon reasoning.",
      whyItMatters: [
        "Signals OpenAI's priorities beyond raw scale.",
        "Introduces measurable agent reliability metrics.",
        "Provides timelines for developer preview access.",
      ],
    },
    tags: ["LLMs", "Agents", "Safety"],
    topics: ["openai", "agents", "alignment"],
    clusterId: "gpt5-roadmap",
    engagementScore: 0.86,
    authorityScore: 0.9,
    excerpt:
      "OpenAI positioned GPT-5 as a more deliberate assistant, featuring structured memory, native retrieval, and layered verification pipelines designed to improve consistency across extended tool interactions.",
  },
  {
    id: "anthropic-constitutional-updates",
    title: "Anthropic expands constitutional AI to handle safety incidents in real time",
    url: "https://www.anthropic.com/news/constitutional-ai-updates",
    source: { name: "Anthropic", domain: "anthropic.com" },
    publishedAt: new Date(Date.now() - 1000 * 60 * 60 * 7).toISOString(),
    summary: {
      beginner:
        "Anthropic upgraded Claude so it can watch for risky requests and apply its rulebook instantly instead of waiting for human review.",
      expert:
        "Claude now executes hierarchical policy checks with real-time intervention hooks, paired with red-team simulations to measure containment across streaming conversations.",
      whyItMatters: [
        "Raises the bar for proactive model safety tooling.",
        "Gives enterprises clearer compliance audit trails.",
        "Hints at Claude's positioning for regulated industries.",
      ],
    },
    tags: ["Safety", "Policy"],
    topics: ["anthropic", "claude", "governance"],
    clusterId: "constitutional-safety",
    engagementScore: 0.74,
    authorityScore: 0.88,
    excerpt:
      "Anthropic's latest safety bundle brings policy-as-code templates, live dashboards, and watchdog agents that can pause or reroute conversations when sensitive intent is detected.",
  },
  {
    id: "google-gemini-1-5-pro",
    title: "Google ships Gemini 1.5 Pro with 10M token context and developer autopilot",
    url: "https://blog.google/technology/ai/gemini-1-5-pro",
    source: { name: "Google AI", domain: "blog.google" },
    publishedAt: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
    summary: {
      beginner:
        "Google released a new Gemini version that can remember giant documents and has helpers that write tests, build apps, and watch for errors.",
      expert:
        "Gemini 1.5 Pro extends multimodal context windows to 10M tokens via hybrid attention routing and adds developer autopilot workflows that integrate with Vertex AI and Firebase shipping pipelines.",
      whyItMatters: [
        "Massive context windows reshape RAG strategies.",
        "Autopilot tooling competes directly with GitHub Copilot Enterprise.",
        "Signals acceleration of Google's enterprise AI suite.",
      ],
    },
    tags: ["LLMs", "Tools", "Industry"],
    topics: ["google", "gemini", "developer-tools"],
    clusterId: "gemini-1-5-pro",
    engagementScore: 0.92,
    authorityScore: 0.85,
    excerpt:
      "Google positions Gemini 1.5 Pro as the default model for multi-document agent workflows, bundling auto-documentation features and context-aware error triage inside Google Cloud's AI Studio.",
  },
  {
    id: "meta-segment-anything-2",
    title: "Meta open-sources Segment Anything 2 with continual video understanding",
    url: "https://ai.meta.com/blog/segment-anything-2",
    source: { name: "Meta AI", domain: "ai.meta.com" },
    publishedAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
    summary: {
      beginner:
        "Meta's new image tool can now track objects in videos and keeps learning from feedback while you use it.",
      expert:
        "Segment Anything 2 introduces memory-efficient mask transformers with continual fine-tuning hooks, enabling per-frame adaptation without catastrophic forgetting in video segmentation tasks.",
      whyItMatters: [
        "Advances open computer-vision tooling for robotics.",
        "Community can adapt it for safety monitoring.",
        "Meta continues its open-source momentum.",
      ],
    },
    tags: ["Research", "Tools"],
    topics: ["meta", "vision", "open-source"],
    clusterId: "segment-anything-2",
    engagementScore: 0.68,
    authorityScore: 0.8,
    excerpt:
      "The release packages SAM2 weights, evaluation scripts, and a streaming fine-tuner that consumes low-latency feedback from AR glasses and drones, pointing at industrial inspection scenarios.",
  },
  {
    id: "arxiv-rag-latency",
    title: "Researchers map retrieval-augmented generation latency bottlenecks across enterprise stacks",
    url: "https://arxiv.org/abs/2406.01923",
    source: { name: "arXiv", domain: "arxiv.org" },
    publishedAt: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(),
    summary: {
      beginner:
        "A research team studied why chatbots that look up documents are slow and offers tips to make them faster.",
      expert:
        "The paper benchmarks retrieval latency contributions from vector indexes, embedding fan-out, and reranker depth, proposing adaptive pipeline scheduling that reduces P95 latency by 38%.",
      whyItMatters: [
        "Gives architects reference numbers for real deployments.",
        "Highlights trade-offs between cost and accuracy.",
        "Framework includes open-source profiler for RAG ops.",
      ],
    },
    tags: ["Research", "LLMs"],
    topics: ["rag", "latency", "evaluation"],
    clusterId: "rag-latency",
    engagementScore: 0.61,
    authorityScore: 0.78,
    excerpt:
      "The authors profiled 18 enterprise knowledge bases and released a toolkit that visualizes chunk freshness, embedding drift, and GPU saturation to guide hybrid search strategies.",
  },
  {
    id: "eu-ai-act-implementation",
    title: "EU AI Act transitions from law to implementation with new oversight board",
    url: "https://ec.europa.eu/ai-act/implementation",
    source: { name: "European Commission", domain: "ec.europa.eu" },
    publishedAt: new Date(Date.now() - 1000 * 60 * 60 * 12).toISOString(),
    summary: {
      beginner:
        "The EU set up the group that will make sure AI rules are followed, including how risky systems are checked.",
      expert:
        "The Commission established the AI Office with delegated powers for conformity assessments, harmonised standards, and a sandbox for cross-border testing with high-risk providers.",
      whyItMatters: [
        "Timeline clarity for compliance teams.",
        "Signals how global policy is converging.",
        "Opens guidance for foundation model registries.",
      ],
    },
    tags: ["Policy", "Safety"],
    topics: ["policy", "europe", "compliance"],
    clusterId: "eu-ai-act",
    engagementScore: 0.58,
    authorityScore: 0.95,
    excerpt:
      "The AI Office will coordinate national authorities, publish risk management templates, and run shared evaluation centers for foundation models deployed in critical sectors.",
  },
  {
    id: "microsoft-azure-phi3",
    title: "Microsoft previews Phi-3 small models optimized for on-device copilots",
    url: "https://azure.microsoft.com/blog/phi-3-preview",
    source: { name: "Microsoft Azure", domain: "azure.microsoft.com" },
    publishedAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
    summary: {
      beginner:
        "Microsoft built smaller AI models that run on laptops and phones but still handle coding and math support.",
      expert:
        "Phi-3 family targets 3-14B params with quantization-aware training, delivering 1.8x efficiency on Snapdragon X Elite and integrating with Windows Copilot Studio pipelines.",
      whyItMatters: [
        "Advances edge deployment for copilots.",
        "Combines with Microsoft AI PCs push.",
        "Enables cost-effective private workloads.",
      ],
    },
    tags: ["Tools", "Industry"],
    topics: ["microsoft", "phi", "edge"],
    clusterId: "phi3-preview",
    engagementScore: 0.77,
    authorityScore: 0.83,
    excerpt:
      "Microsoft is bundling Phi-3 with device provisioning kits, bringing offline intents, locally cached embeddings, and connectors to hybrid semantic search services.",
  },
  {
    id: "stability-stable-diffusion-4",
    title: "Stability AI introduces Stable Diffusion 4 focusing on cinematic control",
    url: "https://stability.ai/blog/stable-diffusion-4",
    source: { name: "Stability AI", domain: "stability.ai" },
    publishedAt: new Date(Date.now() - 1000 * 60 * 60 * 4).toISOString(),
    summary: {
      beginner:
        "Stable Diffusion's latest model lets creators control camera angles and lighting with simple instructions.",
      expert:
        "SD4 debuts cinematic diffusion schedulers with physically-aware lighting modules and supports multi-shot storyboards through new ControlNet adapters.",
      whyItMatters: [
        "Gives artists granular scene control.",
        "Expands open-source alternative to Sora.",
        "Improves video-to-image consistency for studios.",
      ],
    },
    tags: ["Tools", "Industry"],
    topics: ["stability", "generative-media", "controlnet"],
    clusterId: "stable-diffusion-4",
    engagementScore: 0.64,
    authorityScore: 0.73,
    excerpt:
      "The release includes cinematic LUT presets, timeline-aware prompt curves, and an evaluation set measuring narrative coherence across multi-scene renders.",
  },
  {
    id: "mit-robust-agent-evals",
    title: "MIT proposes standardized evaluations for autonomous research agents",
    url: "https://news.mit.edu/2024/robust-agent-evaluations",
    source: { name: "MIT News", domain: "news.mit.edu" },
    publishedAt: new Date(Date.now() - 1000 * 60 * 60 * 18).toISOString(),
    summary: {
      beginner:
        "MIT scientists created tests to see if AI research assistants stay on track and avoid risky shortcuts.",
      expert:
        "The benchmark suite stress-tests tool-using agents with adversarial instructions, assessing corrigibility, provenance tracking, and reproducibility of generated experiments.",
      whyItMatters: [
        "Helps labs vet autonomous research assistants.",
        "Encourages transparency around tool usage logs.",
        "Aligns with calls for frontier safety metrics.",
      ],
    },
    tags: ["Research", "Safety"],
    topics: ["agents", "evaluation", "mit"],
    clusterId: "agent-evals",
    engagementScore: 0.55,
    authorityScore: 0.82,
    excerpt:
      "MIT's agent evals ship with open-source tasks covering lab automation, literature review, and data analysis, with built-in anomaly detection for unsanctioned tool flows.",
  },
  {
    id: "x-open-source-guardian",
    title: "Community launches Guardian, a safety watchdog for open-source AI agents",
    url: "https://github.com/guardian-agent/guardian",
    source: { name: "GitHub", domain: "github.com" },
    publishedAt: new Date(Date.now() - 1000 * 60 * 60 * 6).toISOString(),
    summary: {
      beginner:
        "Developers released Guardian, a tool that watches AI agents and stops them if they try something unsafe.",
      expert:
        "Guardian hooks into open-source agent frameworks, enforcing policy graphs, tool allow-lists, and sandboxed execution with human-in-the-loop overrides.",
      whyItMatters: [
        "Brings safety rails to hobbyist agent stacks.",
        "Complements enterprise guardrails with open tooling.",
        "Encourages community red-teaming.",
      ],
    },
    tags: ["Safety", "Open Source"],
    topics: ["agents", "safety", "community"],
    clusterId: "guardian-agent",
    engagementScore: 0.49,
    authorityScore: 0.6,
    excerpt:
      "Guardian integrates with AutoGen and LangChain, offering runtime monitors for file access, network calls, and high-risk tool invocations, plus Discord alerts for maintainers.",
  },
  {
    id: "nvidia-blackwell-industrial",
    title: "NVIDIA teams with Siemens to deploy Blackwell AI for industrial twins",
    url: "https://blogs.nvidia.com/blog/blackwell-siemens-industrial",
    source: { name: "NVIDIA", domain: "nvidia.com" },
    publishedAt: new Date(Date.now() - 1000 * 60 * 60 * 9).toISOString(),
    summary: {
      beginner:
        "NVIDIA and Siemens are pairing new chips with digital twins so factories can test ideas virtually before building them.",
      expert:
        "The partnership links Blackwell GPUs with Siemens Xcelerator to run photoreal industrial twins, combining Omniverse cloud APIs with domain-adapted foundation models for predictive maintenance.",
      whyItMatters: [
        "Connects AI hardware advances to real industry impact.",
        "Shows how digital twins speed up climate-friendly retrofits.",
        "Expands NVIDIA's ecosystem lock-in for enterprise AI.",
      ],
    },
    tags: ["Industry", "Tools"],
    topics: ["nvidia", "industry", "digital-twin"],
    clusterId: "nvidia-siemens",
    engagementScore: 0.71,
    authorityScore: 0.84,
    excerpt:
      "Customers get access to Omniverse-powered simulation templates that sync with Siemens automation gear, plus domain-specific LLMs that translate maintenance logs into actionable work orders.",
  },
  {
    id: "policy-ai-safety-hearing",
    title: "US Senate hearing spotlights AI safety incident reporting gaps",
    url: "https://www.congress.gov/hearings/ai-safety-reporting",
    source: { name: "US Senate", domain: "congress.gov" },
    publishedAt: new Date(Date.now() - 1000 * 60 * 60 * 15).toISOString(),
    summary: {
      beginner:
        "Lawmakers questioned tech leaders about why AI incidents aren't reported quickly and how to fix it.",
      expert:
        "Witnesses proposed binding disclosure timelines, independent auditing bodies, and liability safe harbors for sharing near-miss AI incidents across competitors.",
      whyItMatters: [
        "Could shape US safety reporting rules.",
        "Highlights multi-stakeholder pressure for transparency.",
        "Signals bipartisan appetite for baseline standards.",
      ],
    },
    tags: ["Policy", "Safety"],
    topics: ["policy", "us", "safety"],
    clusterId: "us-safety-hearing",
    engagementScore: 0.52,
    authorityScore: 0.77,
    excerpt:
      "Industry and academic witnesses urged Congress to fund an incident clearinghouse, citing the need for standardized taxonomies and whistleblower protections.",
  },
  {
    id: "deepmind-weather-agent",
    title: "DeepMind debuts weather agent that explains uncertainty in natural language",
    url: "https://deepmind.google/discover/blog/weather-agent",
    source: { name: "Google DeepMind", domain: "deepmind.google" },
    publishedAt: new Date(Date.now() - 1000 * 60 * 60 * 8).toISOString(),
    summary: {
      beginner:
        "DeepMind built a weather AI that tells you how sure it is about forecasts and why.",
      expert:
        "The system fuses graph neural nowcasting with language explanations, surfacing calibrated confidence bands and historical analogs for severe weather advisories.",
      whyItMatters: [
        "Shows trustworthy communication for critical AI.",
        "Bridges climate models with conversational AI.",
        "Supports emergency planners with plain-language alerts.",
      ],
    },
    tags: ["Research", "Industry"],
    topics: ["weather", "explainability", "deepmind"],
    clusterId: "weather-agent",
    engagementScore: 0.66,
    authorityScore: 0.81,
    excerpt:
      "DeepMind paired the weather agent with real-time data assimilation and open APIs so city planners can query storm scenarios in beginner or expert language modes.",
  },
];
