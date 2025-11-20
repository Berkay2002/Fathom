import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { createDeepAgent } from "deepagents";
import { MemorySaver } from "@langchain/langgraph";
import { ExaSearchRetriever } from "@langchain/exa";
import { tool } from "@langchain/core/tools";
import { z } from "zod";

// WebSearchAPI Tool
const webSearchTool = tool(
  async ({ query, maxResults = 5 }: { query: string; maxResults?: number }) => {
    const apiKey = process.env.WEBSEARCHAPI_KEY;
    if (!apiKey) {
      return "Error: WEBSEARCHAPI_KEY is not set.";
    }

    try {
      const response = await fetch("https://api.websearchapi.ai/ai-search", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          query,
          maxResults,
          includeContent: true,
        }),
      });

      if (!response.ok) {
        return `Error: WebSearchAPI request failed with status ${response.status}`;
      }

      const data = await response.json();
      return JSON.stringify(data);
    } catch (error) {
      return `Error performing web search: ${(error as Error).message}`;
    }
  },
  {
    name: "web_search",
    description:
      "Search the web for general queries, news, and recent information. Returns comprehensive results with content.",
    schema: z.object({
      query: z.string().describe("The search query"),
      maxResults:
        z
          .number()
          .optional()
          .default(5)
          .describe("Maximum number of results to return"),
    }),
  }
);

// Exa Search Tool (Semantic Search)
const exaSearchTool = tool(
  async ({ query, numResults = 3 }: { query: string; numResults?: number }) => {
    const apiKey = process.env.EXA_API_KEY;
    if (!apiKey) {
      return "Error: EXA_API_KEY is not set.";
    }

    try {
      const retriever = new ExaSearchRetriever({
        apiKey,
        k: numResults,
        highlights: true,
      });

      const docs = await retriever.invoke(query);
      return JSON.stringify(
        docs.map((doc) => ({
          title: doc.metadata.title,
          url: doc.metadata.url,
          highlights: doc.metadata.highlights,
          content: doc.pageContent,
        }))
      );
    } catch (error) {
      return `Error performing Exa search: ${(error as Error).message}`;
    }
  },
  {
    name: "exa_search",
    description:
      "Perform a semantic search to find specific documents, research papers, or content similar to the query. Good for deep research.",
    schema: z.object({
      query: z.string().describe("The semantic search query"),
      numResults:
        z
          .number()
          .optional()
          .default(3)
          .describe("Number of results to retrieve"),
    }),
  }
);

// Define the Deep Agent
export const createAgent = () => {
  const model = new ChatGoogleGenerativeAI({
    model: "gemini-3-pro-preview",
    temperature: 0, // Using a lower temperature for more deterministic behavior
  });

  const checkpointer = new MemorySaver();

  const systemPrompt = `You are a highly capable AI assistant powered by Gemini 3 Pro Preview. Your primary goal is to assist users by planning tasks, utilizing available tools, and delegating to subagents when appropriate.

<instructions>
1. **Plan:** Always start by formulating a clear plan using the \`write_todos\` tool if the task is complex. Break down complex requests into smaller, manageable steps.
2. **Execute:** Use the provided tools to gather information and perform actions.
   - Use \`web_search\` for general queries, current events, and broad information gathering.
   - Use \`exa_search\` when you need to find specific documents, research papers, or perform deep semantic searches for related content.
   - Use file system tools (\`ls\`, \`read_file\`, \`write_file\`, \`edit_file\`) to manage your workspace and store results.
3. **Delegate:** For multi-step tasks that require isolated context or specialized capabilities, consider delegating to a general-purpose subagent using the \`task\` tool.
4. **Respond:** Provide concise and accurate responses based on the information gathered or actions performed.
</instructions>

<constraints>
- Be proactive in using tools to solve problems.
- Always be mindful of the conversation history and leverage it when relevant.
- Ensure all tool arguments strictly adhere to their defined schemas.
</constraints>
`;

  const agent = createDeepAgent({
    model: model,
    tools: [webSearchTool, exaSearchTool],
    systemPrompt: systemPrompt,
    checkpointer: checkpointer,
  });

  return agent;
};
