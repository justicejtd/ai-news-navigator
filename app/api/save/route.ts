import { NextRequest, NextResponse } from "next/server";

const savedItems = new Set<string>();

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const itemId = body.itemId as string | undefined;
    if (!itemId) {
      return NextResponse.json({ ok: false, message: "Missing itemId" }, { status: 400 });
    }
    savedItems.add(itemId);
    return NextResponse.json({ ok: true });
  } catch (error) {
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const body = await request.json();
    const itemId = body.itemId as string | undefined;
    if (!itemId) {
      return NextResponse.json({ ok: false, message: "Missing itemId" }, { status: 400 });
    }
    savedItems.delete(itemId);
    return NextResponse.json({ ok: true });
  } catch (error) {
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}
