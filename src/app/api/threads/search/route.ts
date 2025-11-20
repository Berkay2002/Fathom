import { NextRequest, NextResponse } from "next/server";

export async function POST(
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _req: NextRequest
) {
  // LangGraph's MemorySaver (used by deepagents locally) does not expose a public API
  // to list all saved thread_ids or their metadata. Therefore, a local server
  // cannot currently fulfill the client.threads.search() request by listing actual threads.
  // For full thread search functionality, a persistent store like PostgresStore would be required.

  // Returning an empty array to prevent UI errors related to missing data.
  return NextResponse.json({ threads: [] }, { status: 200 });
}
