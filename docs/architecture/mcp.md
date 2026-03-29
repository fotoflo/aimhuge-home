# Model Context Protocol (MCP)

This project utilizes Model Context Protocol (MCP) servers to extend the capabilities of AI coding assistants (such as Gemini, Claude Code, Windsurf, or Cursor) with real-time tool use, specifically for up-to-date documentation and specialized local actions.

## Configuration

Workspace-level MCP servers are primarily defined in `<root>/.mcp.json`. 

*Note: Depending on your specific AI IDE or assistant, you may need to ensure this configuration is also synchronized into the assistant's global configuration file (e.g., `~/.gemini/antigravity/mcp_config.json`, `~/.cursor/mcp.json`, etc.).*

## Registered Servers

### Context7

[Context7](https://context7.com/) provides live, dynamically-fetched documentation and code examples from official sources. This bridges the gap between static LLM training data and evolving library APIs, mitigating hallucinations.

**Configuration Statement:**
```json
{
  "mcpServers": {
    "context7": {
      "command": "npx",
      "args": ["-y", "@upstash/context7-mcp@latest"]
    }
  }
}
```

**How to Use:** 
When prompting the AI assistant about specific libraries, frameworks, or APIs, you can force documentation retrieval by appending the keyword: **`use context7`** to your prompt. The agent will then discover and fetch the latest docs for context.
