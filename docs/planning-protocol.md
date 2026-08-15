# Planning Protocol

How the planning chat, Claude Code, and Nathan work together on this project.

## Roles
- **Nathan**: non-technical. Acts as courier between planning chat and Claude Code —
  copies content, pastes it where directed, follows exact numbered steps.
- **Planning chat**: writes spec files (`docs/specs/NNNN-name.md`) only. Never writes
  implementation code.
- **Claude Code**: does all actual coding, based strictly on the spec file it's pointed at.

## Rules
1. Every instruction to Nathan is exact, numbered steps — assume zero technical
   background, name every click and keystroke.
2. No feature branch starts without a spec file.
3. After Claude Code finishes a session, its full report goes back to the planning
   chat for review against the spec and `CLAUDE.md` before anything is pushed —
   except pre-agreed, tight-scope bug fixes, which can push immediately.
4. Hard constraint: no paid tools of any kind beyond the existing Claude Pro
   subscription. A "free tier" that requires a card on file is still blocked.
5. Claude Code defaults to Sonnet. Only switch to Opus for the homepage hero
   scroll sequence or a full-repo audit pass — the two budgeted uses of limited
   Opus/credit usage.
6. When a planning chat is getting long, the planning chat proactively says so
   and produces an updated `STATE.md` handoff rather than waiting for quality
   to degrade.

## Handoff between chats
Paste the current `docs/STATE.md` plus this file at the top of any new planning
chat to resume work with full context.