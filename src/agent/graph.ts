import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { createDeepAgent } from "deepagents";
import { MemorySaver } from "@langchain/langgraph";
import { TavilySearch } from "@langchain/tavily";
import { tool } from "@langchain/core/tools";
import { z } from "zod";

// Define a simple internet search tool
const internetSearch = tool(
  async ({
    query,
    maxResults = 5,
    topic = "general",
    includeRawContent = false,
  }: {
    query: string;
    maxResults?: number;
    topic?: "general" | "news" | "finance";
    includeRawContent?: boolean;
  }) => {
    const tavilySearch = new TavilySearch({
      maxResults,
      tavilyApiKey: process.env.TAVILY_API_KEY,
      includeRawContent,
      topic,
    });
    return await tavilySearch._call({ query });
  },
  {
    name: "internet_search",
    description: "Run a web search",
    schema: z.object({
      query: z.string().describe("The search query"),
      maxResults: z.number().optional().default(5),
      topic:
        z
          .enum(["general", "news", "finance"])
          .optional()
          .default("general"),
      includeRawContent: z.boolean().optional().default(false),
    }),
  },
);

// Define the Deep Agent
export const createAgent = () => {
  const model = new ChatGoogleGenerativeAI({
    model: "gemini-3-pro-preview",
    temperature: 0, // Using a lower temperature for more deterministic behavior
  });

  const checkpointer = new MemorySaver();

  const systemPrompt = `You are a highly capable AI assistant powered by Gemini 3 Pro Preview. Your primary goal is to assist users by planning tasks, utilizing available tools (including internet search and file system operations), and delegating to subagents when appropriate.

<instructions>
1. **Plan:** Always start by formulating a clear plan using the 
write_todos
 tool if the task is complex. Break down complex requests into smaller, manageable steps.
2. **Execute:** Use the provided tools (like 
internet_search
, 
ls
, 
read_file
, 
write_file
, 
edit_file
) to gather information, perform actions, and store results.
3. **Delegate:** For multi-step tasks that require isolated context or specialized capabilities, consider delegating to a general-purpose subagent using the 
task
 tool.
4. **Respond:** Provide concise and accurate responses based on the information gathered or actions performed.
</instructions>

<constraints>
- Be proactive in using tools to solve problems.
- Always be mindful of the conversation history and leverage it when relevant.
- Ensure all tool arguments strictly adhere to their defined schemas.
- If you need to perform a web search, use the 
internet_search
 tool.
</constraints>
`;

  const agent = createDeepAgent({
    model: model,
    tools: [internetSearch],
    systemPrompt: systemPrompt,
    checkpointer: checkpointer,
  });

  return agent;
};
