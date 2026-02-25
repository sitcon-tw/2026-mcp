import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";

// Fetch sessions from Github
const sessionUrl = "https://sitcon.org/2026/sessions.json";
const teamUrl = "https://raw.githubusercontent.com/sitcon-tw/2026/refs/heads/main/src/data/team.json";
const fetchSessions = async () => {
	const response = await fetch(sessionUrl);
	const data = await response.json();
	return data;
};

const fetchTeam = async () => {
	const response = await fetch(teamUrl);
	const data = await response.json();
	return data;
};

let sessionData: {
	sessions: Session[];
	speakers: Speaker[];
	session_types: SessionType[];
	rooms: Room[];
	tags: Tag[];
} = { sessions: [], speakers: [], session_types: [], rooms: [], tags: [] };

try {
	sessionData = await fetchSessions();
} catch (error) {
	console.error("Error fetching sessions:", error);
}

let teamData: TeamMember[] = [];
try {
	teamData = await fetchTeam();
} catch (error) {
	console.error("Error fetching team:", error);
}

// Type definitions
export interface TeamRole {
	name: string;
	role: string;
}

export interface TeamMember {
	name: string;
	description: string;
	teams: TeamRole[];
	link?: string;
	mode?: string;
	color?: string;
}

export interface Speaker {
	id: string;
	avatar: string;
	zh: {
		name: string;
		bio: string;
	};
	en: {
		name: string;
		bio: string;
	};
}

export interface SessionType {
	id: string;
	zh: {
		name: string;
		description: string;
	};
	en: {
		name: string;
		description: string;
	};
}

export interface Room {
	id: string;
	zh: {
		name: string;
		description: string;
	};
	en: {
		name: string;
		description: string;
	};
}

export interface Tag {
	id: string;
	zh: {
		name: string;
		description: string;
	};
	en: {
		name: string;
		description: string;
	};
}

export interface Session {
	id: string;
	type: string;
	room: string;
	broadcast: string[] | null;
	start: string;
	end: string;
	qa: string | null;
	slide: string | null;
	co_write: string | null;
	record: string | null;
	live: string | null;
	language: string | null;
	uri: string | null;
	zh: {
		title: string;
		description: string;
	};
	en: {
		title: string;
		description: string;
	};
	speakers: string[];
	tags: string[];
}

// Function for searching sessions
export const searchSessions = (query: string) => {
	const lowerQuery = query.toLowerCase();

	if (!sessionData.sessions || !Array.isArray(sessionData.sessions)) {
		return [];
	}

	return sessionData.sessions
		.filter((session: Session) => {
			const zhTitle = session.zh?.title?.toLowerCase() || "";
			const zhDesc = session.zh?.description?.toLowerCase() || "";
			const enTitle = session.en?.title?.toLowerCase() || "";
			const enDesc = session.en?.description?.toLowerCase() || "";
			const tags = session.tags ? session.tags.join(" ").toLowerCase() : "";

			const speakerMatches = session.speakers.some(speakerId => {
				const speaker = sessionData.speakers.find(s => s.id === speakerId);
				if (!speaker) return false;
				const zhName = speaker.zh?.name?.toLowerCase() || "";
				const enName = speaker.en?.name?.toLowerCase() || "";
				const zhBio = speaker.zh?.bio?.toLowerCase() || "";
				const enBio = speaker.en?.bio?.toLowerCase() || "";
				return zhName.includes(lowerQuery) || enName.includes(lowerQuery) || zhBio.includes(lowerQuery) || enBio.includes(lowerQuery);
			});

			return zhTitle.includes(lowerQuery) || zhDesc.includes(lowerQuery) || enTitle.includes(lowerQuery) || enDesc.includes(lowerQuery) || tags.includes(lowerQuery) || speakerMatches;
		})
		.map((session: Session) => ({
			id: session.id,
			title: session.zh?.title || session.en?.title,
			description: session.zh?.description || session.en?.description,
			start: session.start,
			end: session.end,
			room: session.room,
			speakers: session.speakers,
			tags: session.tags
		}));
};

export const getSpeaker = (id: string) => {
	if (!sessionData.speakers || !Array.isArray(sessionData.speakers)) {
		return null;
	}
	return sessionData.speakers.find(s => s.id === id) || null;
};

export const getSpeakerByName = (name: string) => {
	if (!sessionData.speakers || !Array.isArray(sessionData.speakers)) {
		return [];
	}
	const lowerName = name.toLowerCase();
	return sessionData.speakers.filter(s => (s.zh?.name?.toLowerCase() || "").includes(lowerName) || (s.en?.name?.toLowerCase() || "").includes(lowerName));
};

export const searchMemberByTeam = (teamName: string, role?: string) => {
	if (!teamData || !Array.isArray(teamData)) return [];
	const lowerTeam = teamName.toLowerCase();
	const lowerRole = role?.toLowerCase();

	return teamData.filter(member => {
		return member.teams.some(t => {
			const matchTeam = t.name.toLowerCase().includes(lowerTeam);
			const matchRole = lowerRole ? t.role.toLowerCase().includes(lowerRole) : true;
			return matchTeam && matchRole;
		});
	});
};

export const searchMemberByName = (name: string) => {
	if (!teamData || !Array.isArray(teamData)) return [];
	const lowerName = name.toLowerCase();
	return teamData.filter(member => member.name.toLowerCase().includes(lowerName));
};

export const searchMemberByDescriptionAndLink = (query: string) => {
	if (!teamData || !Array.isArray(teamData)) return [];
	const lowerQuery = query.toLowerCase();
	return teamData.filter(member => {
		const matchDesc = member.description?.toLowerCase().includes(lowerQuery) || false;
		const matchLink = member.link?.toLowerCase().includes(lowerQuery) || false;
		return matchDesc || matchLink;
	});
};

export const genSessionShareUrl = (sessionId: string) => {
	return `https://sitcon.org/2026/agenda/${sessionId}`;
};

export function registerSessionTools(server: McpServer) {
	server.tool(
		"search_sessions",
		"Search for sessions in the SITCON 2026 sessions by title, description, tags, or speakers.",
		{
			query: z.string().describe("The search keyword to filter sessions.")
		},
		async ({ query }) => {
			const results = searchSessions(query);
			return {
				content: [
					{
						type: "text",
						text: JSON.stringify(results, null, 2),
						query: query
					}
				]
			};
		}
	);
	server.tool(
		"gen_session_share_url",
		"Generate a shareable URL for a specific session.",
		{
			sessionId: z.string().describe("The ID of the session to generate a shareable URL for.")
		},
		async ({ sessionId }) => {
			const url = genSessionShareUrl(sessionId);
			return {
				content: [
					{
						type: "text",
						text: url,
						query: sessionId
					}
				]
			};
		}
	);

	server.tool(
		"search_speaker_by_id",
		"Search for a speaker by their ID.",
		{
			query: z.string().describe("The speaker ID to search for.")
		},
		async ({ query }) => {
			const speaker = getSpeaker(query);
			if (!speaker) {
				return {
					content: [
						{
							type: "text",
							text: `Speaker with ID "${query}" not found.`
						}
					],
					isError: true
				};
			}
			return {
				content: [
					{
						type: "text",
						text: JSON.stringify(speaker, null, 2)
					}
				]
			};
		}
	);

	server.tool(
		"search_speaker_by_name",
		"Search for a speaker by their name.",
		{
			query: z.string().describe("The speaker name to search for.")
		},
		async ({ query }) => {
			const speakers = getSpeakerByName(query);
			if (speakers.length === 0) {
				return {
					content: [
						{
							type: "text",
							text: `Speaker with name "${query}" not found.`
						}
					],
					isError: true
				};
			}
			return {
				content: [
					{
						type: "text",
						text: JSON.stringify(speakers, null, 2)
					}
				]
			};
		}
	);

	server.tool(
		"search_member_by_team",
		"Search for a team member by their team name and optionally role.",
		{
			teamName: z.string().describe("The team name to search for."),
			role: z.string().optional().describe("The optional role to filter by.")
		},
		async ({ teamName, role }) => {
			const members = searchMemberByTeam(teamName, role);
			return {
				content: [
					{
						type: "text",
						text: JSON.stringify(members, null, 2)
					}
				]
			};
		}
	);

	server.tool(
		"search_member_by_name",
		"Search for a team member by their name.",
		{
			name: z.string().describe("The name to search for.")
		},
		async ({ name }) => {
			const members = searchMemberByName(name);
			return {
				content: [
					{
						type: "text",
						text: JSON.stringify(members, null, 2)
					}
				]
			};
		}
	);

	server.tool(
		"search_member_by_description_and_link",
		"Search for a team member by their description or link.",
		{
			query: z.string().describe("The keyword to search in description or link.")
		},
		async ({ query }) => {
			const members = searchMemberByDescriptionAndLink(query);
			return {
				content: [
					{
						type: "text",
						text: JSON.stringify(members, null, 2)
					}
				]
			};
		}
	);
}

export default registerSessionTools;
