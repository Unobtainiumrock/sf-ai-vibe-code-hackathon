# AHA Setup Guide (Simplified)

## Quick Start

1. **Clone and Setup**
   ```bash
   git clone <repository>
   cd sf-ai-vibe-code-hackathon
   cp .env.example .env
   # Edit .env with your API keys
   ```

2. **Backend Setup**
   ```bash
   cd backend
   poetry install
   poetry shell
   cd ..
   ./run_backend.sh
   ```

3. **Frontend Setup** (in new terminal)
   ```bash
   cd frontend
   npm install
   cd ..
   ./run_frontend.sh
   ```

4. **Test the Demo**
   ```bash
   # In another terminal
   cd backend
   python demo/inject_failure.py
   ```

## Environment Variables Required

```bash
# Copy from .env.example and fill in:
LANGSMITH_API_KEY=your_key_here
OPENAI_API_KEY=your_key_here
GITHUB_TOKEN=your_token_here
GITHUB_REPO_OWNER=your_username
GITHUB_REPO_NAME=aha-incidents
```

## Zypher Target System (Optional)

If you want to test the Zypher agents separately:

```bash
cd target_system
./setup_zypher.sh
# Set ANTHROPIC_API_KEY environment variable
deno task dev
```

**Note**: The Zypher target system is simplified and doesn't require Firecrawl or external web crawling - it uses built-in knowledge only for reliable demo purposes.

## Demo Flow

1. Start backend and frontend
2. Open http://localhost:3000 (should show empty dashboard)
3. Run `python backend/demo/inject_failure.py`
4. Watch AHA detect, analyze, and create GitHub issue
5. Refresh dashboard to see incident

## CoreSpeed Integration Notes

This demo shows AHA as a standalone system, but it's designed to integrate directly into CoreSpeed's platform as a native feature. The architecture supports:

- Embedding React components in CoreSpeed's UI
- Using CoreSpeed's authentication and workspace management
- Leveraging CoreSpeed's workflow execution context
- Integrating with CoreSpeed's existing design system

The demo proves the core concept that will be productized within CoreSpeed.
