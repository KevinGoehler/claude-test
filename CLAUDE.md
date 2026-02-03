# CLAUDE.md

This file provides guidance to Claude Code when working on this project.

## Project Overview

claude-test is a test project for experimenting with Claude Code capabilities.

## Commands

```bash
# No build/test commands configured yet
```

## Project Structure

```
/
├── .claude/
│   └── skills/
│       └── ui-ux-design/    # UI/UX design guidelines skill
│           └── SKILL.md
├── LICENSE          # All Rights Reserved (proprietary)
├── README.md        # Project readme
└── CLAUDE.md        # This file
```

## Code Style

- Follow existing patterns in the codebase
- Keep code simple and readable

## Development Environment

- **Platform**: Android only (Claude Code mobile app)
- **No local server**: Cannot run `python -m http.server` or similar
- **Deployment**: Use **GitHub Pages** to host and test web apps
- **Testing**: Push changes → view at `https://kevingoehler.github.io/claude-test/`
- **No build tools**: Prefer plain HTML/CSS/JS without compilation steps

## Notes for Claude

- This is a test/sandbox project
- Feel free to experiment with different approaches
- Ask clarifying questions when requirements are ambiguous
- Remember: User cannot run local servers - always deploy to GitHub Pages for testing
