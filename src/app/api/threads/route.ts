import { NextRequest, NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";

export async function POST(
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _req: NextRequest
) {
  const threadId = uuidv4();
  return NextResponse.json({ thread_id: threadId }, { status: 201 });
}
