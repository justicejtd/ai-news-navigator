import { NextRequest, NextResponse } from "next/server";
import { getFeed } from "@lib/feed";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const search = searchParams.get("search") ?? undefined;
  const tag = searchParams.get("tag") ?? undefined;
  const since = searchParams.get("since") ?? undefined;
  const source = searchParams.get("source") ?? undefined;
  const sort = (searchParams.get("sort") ?? undefined) as
    | "latest"
    | "trending"
    | "research"
    | "policy"
    | undefined;

  const tags = searchParams.getAll("tags[]");
  const sources = searchParams.getAll("sources[]");

  const result = getFeed({ search, tag, tags, since, source, sources, sort });

  return NextResponse.json(result);
}
