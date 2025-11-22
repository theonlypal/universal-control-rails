# Universal Control Rails (UCR)

Universal Control Rails (UCR) is a phone-first control OS and agent runtime that lets you control devices over the network as if your phone were a universal remote.

## Monorepo layout
- `apps/ucr-os`: Next.js 15 PWA for the phone OS.
- `apps/ucr-agent`: Node.js agent service exposing device controls.
- `packages/ucr-core`: Shared protocol types, client helpers, macros, and sessions.

## Getting started
```bash
npm install

# Run the OS (Next.js dev server)
npm run dev:os

# Run the Agent locally
npm run dev:agent
```

## Configuration
Copy `.env.example` to `.env` and set values:
- `AI_API_KEY`: optional key to enable real AI command parsing (mock responses used when missing).
- `UCR_AGENT_SECRET`: shared secret between OS and agent for action calls.
- `UCR_DEFAULT_AGENT_URL`: default agent URL to surface in the OS and aggregation API.

## Usage
1. Start the agent on a PC/server and ensure `UCR_AGENT_SECRET` matches the OS environment.
2. Start the OS and open it in the browser (mobile or desktop). Add to Home Screen for a PWA experience.
3. Discover mock devices immediately; agent devices appear when reachable.
4. Open a device to use the control panel, start sessions, or run whitelisted commands.
5. Use the Command Bar (⌘/Ctrl + K) or the Macros screen to orchestrate multiple actions.

## Extending UCR
- Add new capabilities or device kinds in `packages/ucr-core`.
- Implement richer system integrations inside `apps/ucr-agent/src/capabilities.ts`.
- Expand the OS UI or design system in `apps/ucr-os/components` to suit your product needs.
