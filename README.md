# SITCON 2026 MCP Server

A Model Context Protocol (MCP) server for accessing SITCON 2026 session and speaker information.

## Features

- **Session Search**: Search through conference sessions by title, description, tags, or speaker names.
- **Speaker Lookup**: Retrieve detailed information about speakers using their ID.
- **Shareable URLs**: Generate direct links to specific sessions on the official website.

## Tools

### `search_sessions`
Search for sessions in the SITCON 2026 agenda.
- **sesssion**: `query` (string) - Keywords to match against titles, descriptions, tags, or speakers.

### `search_speaker`
Get detailed information about a specific speaker.
- **Input**: `query` (string) - The unique ID of the speaker.

### `gen_session_share_url`
Generate a shareable URL for a specific session.
- **Input**: `sessionId` (string) - The ID of the session.

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
