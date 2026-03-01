# SITCON 2026 MCP Server

A Model Context Protocol (MCP) server for accessing SITCON 2026 session, speaker, team, and conference information.

## Features

- **Session Search**: Search through conference sessions by title, description, tags, or speaker names.
- **Speaker Lookup**: Retrieve detailed information about speakers using their ID or name.
- **Team Lookup**: Search for team members by name, team, description, or link.
- **Conference Info**: Retrieve information about the SITCON 2026 theme, Code of Conduct, and general conference details.
- **Shareable URLs**: Generate direct links to specific sessions on the official website.

## Tools

### Session & Speaker Tools

#### `search_sessions`
Search for sessions in the SITCON 2026 agenda.
- **Input**: `query` (string) - Keywords to match against titles, descriptions, tags, or speakers.

#### `search_speaker_by_id`
Get detailed information about a specific speaker.
- **Input**: `query` (string) - The unique ID of the speaker.

#### `search_speaker_by_name`
Search for a speaker by their name.
- **Input**: `query` (string) - The speaker name to search for.

#### `gen_session_share_url`
Generate a shareable URL for a specific session.
- **Input**: `sessionId` (string) - The ID of the session.

### Team Tools

#### `search_member_by_team`
Search for a team member by their team name and optionally role.
- **Input**: `teamName` (string) - The team name to search for.
- **Input**: `role` (string, optional) - The optional role to filter by.

#### `search_member_by_name`
Search for a team member by their name.
- **Input**: `name` (string) - The name to search for.

#### `search_member_by_description_and_link`
Search for a team member by their description or link.
- **Input**: `query` (string) - The keyword to search in description or link.

### Conference Info Tools

#### `get_code_of_conduct`
Get the SITCON Code of Conduct (CoC) policies and guidelines.

#### `get_theme`
Get the SITCON 2026 Theme and its concept.

#### `get_sitcon_info`
Get the introduction and spirit of SITCON (Students' Information Technology Conference).

## Getting Started

### Prerequisites

- Node.js (v18 or later recommended)
- pnpm

### Installation

```bash
pnpm install
```

### Building

```bash
pnpm run build
```

### Running

Start the MCP server:

```bash
pnpm start
```

By default, the server runs on port `3000`. You can configure the port using the `PORT` environment variable.

```bash
PORT=8080 pnpm start
```
