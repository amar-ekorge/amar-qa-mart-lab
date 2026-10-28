# qa-mart-playwright-tester-plugin

Gets a tester productive on QA Mart in minutes. Six building blocks, two of each.

| Block | Files | Packaged in plugin? |
|---|---|---|
| Custom instructions | [instructions/qamart-locators-and-waits.instructions.md](instructions/qamart-locators-and-waits.instructions.md), [instructions/qamart-specs-naming-and-data.instructions.md](instructions/qamart-specs-naming-and-data.instructions.md) | No, copy (see below) |
| Prompt files | [prompts/gen-smoke-tests.prompt.md](prompts/gen-smoke-tests.prompt.md) (`/gen-smoke-tests`), [prompts/review-flaky-test.prompt.md](prompts/review-flaky-test.prompt.md) (`/review-flaky-test`) | No, copy (see below) |
| Skills | [skills/checkout-test-design](skills/checkout-test-design/SKILL.md), [skills/bug-report-writer](skills/bug-report-writer/SKILL.md) | Yes |
| Agents | [QA Mart Test Planner](com.github.copilot/agents/test-planner.agent.md), [QA Mart Test Healer](com.github.copilot/agents/test-healer.agent.md), [QA Mart Test Reviewer](com.github.copilot/agents/test-reviewer.agent.md) (read-only) | Yes |
| MCP servers | `playwright` (`@playwright/mcp`), `qamart` ([mcp/qamart-server.cjs](mcp/qamart-server.cjs)) in [mcp.json](mcp.json) | Yes |
| Hooks | [hooks.json](com.github.copilot/hooks/hooks.json): `guard-app` (deny edits under `app/`), `block-only` (deny `.only`), `post-edit-checks` (lint + typecheck after edits) | Yes |

## Install
1. In user settings:
   ```json
   {
     "chat.plugins.enabled": true,
     "chat.pluginLocations": { "/home/amarekorge/amar-qa-mart-lab/QA-mart-playwright-tester-plugin": true }
   }
   ```
2. Plugins cannot carry instructions or prompt files, so copy them into the workspace once:
   ```bash
   mkdir -p .github/instructions .github/prompts
   cp QA-mart-playwright-tester-plugin/instructions/*.md .github/instructions/
   cp QA-mart-playwright-tester-plugin/prompts/*.md .github/prompts/
   ```
3. `npm start`, then check Extensions > `@agentPlugins`, Chat > Open Customizations, and **MCP: List Servers**.

## Safety
- Plugin MCP servers and hooks run code on your machine without a trust prompt. Read them before enabling.
- `playwright` is fetched with `npx` on first start (needs network). `qamart` has no dependencies and logs to stderr only.
- `qamart_place_order` and `qamart_reset` change app state. Agents are told to say so first.
- Hooks fail open: a crash in a guard script allows the edit rather than blocking all editing.
- Do not keep the same hooks in `.github/hooks/` as well, or they run twice.

## Quick start
- `/gen-smoke-tests checkout`
- `/review-flaky-test tests/legacy/legacy-checkout.spec.ts`
- Pick **QA Mart Test Planner** with "Plan US-103", then hand off to write the specs.
