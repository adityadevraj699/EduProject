import { BASE_URL } from './apiConfig';

/* ---------- FETCH METADATA (Branches, Semesters, Sections) ---------- */
export const getTeamsMetadataApi = async (token) => {

  if (!token) {
   
    throw new Error("Authentication token is missing");
  }

  try {
    const res = await fetch(`${BASE_URL}/teams/metadata`, {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json",
      }
    });

    // Check if response is JSON
    const contentType = res.headers.get("content-type");
    if (!contentType || !contentType.includes("application/json")) {
      const text = await res.text();
      throw new Error("Server did not return JSON. Check Backend.");
    }

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.message || "Failed to fetch metadata");
    }

    return data;
  } catch (err) {
    throw err;
  }
};

/* ---------- CREATE PROJECT WITH TEAM & MEMBERS ---------- */
export const createTeamApi = async (token, teamData) => {

  try {
    const res = await fetch(`${BASE_URL}/teams/team-create`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(teamData)
    });

    const data = await res.json();

    if (!res.ok) {
     
      throw new Error(data.message || "Team creation failed");
    }

    
    return data;
  } catch (err) {

    throw err;
  }
};