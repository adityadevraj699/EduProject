import { BASE_URL } from "./apiConfig";

/* ============================================
   Helper Function (Safe JSON Parse)
============================================ */
const handleResponse = async (res) => {
  const text = await res.text();

  let data;
  try {
    data = text ? JSON.parse(text) : {};
  } catch {
    throw new Error("Server returned invalid JSON response");
  }

  if (!res.ok) {
    throw new Error(data.message || "Something went wrong");
  }

  return data;
};

/* ============================================
   1️⃣ GET STUDENT TEAM LIST
   GET /teams/student-teams
============================================ */
export const getStudentTeamsApi = async (token) => {
  try {
    const res = await fetch(`${BASE_URL}/teams/student-teams`, {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Accept": "application/json"
      }
    });

    return await handleResponse(res);
  } catch (err) {
    console.error("Student Teams Error:", err.message);
    throw err;
  }
};

/* ============================================
   2️⃣ GET STUDENT TEAM DETAILS
   GET /teams/student/team/:teamId
============================================ */
export const getStudentTeamDetailsApi = async (token, teamId) => {
  try {
    const res = await fetch(
      `${BASE_URL}/teams/student/team/${teamId}`,
      {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Accept": "application/json"
        }
      }
    );

    return await handleResponse(res);
  } catch (err) {
    console.error("Student Team Detail Error:", err.message);
    throw err;
  }
};

/* ============================================
   3️⃣ GET STUDENT MEETING LIST
   GET /meetings/student/meetings
============================================ */
export const getStudentMeetingsApi = async (token) => {
  try {
    const res = await fetch(`${BASE_URL}/meetings/student/meetings`, {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Accept": "application/json"
      }
    });

    return await handleResponse(res);
  } catch (err) {
    console.error("Student Meetings Error:", err.message);
    throw err;
  }
};

/* ============================================
   4️⃣ GET STUDENT MEETING DETAILS
   GET /meetings/student/meeting/:meetingId
============================================ */
export const getStudentMeetingDetailsApi = async (token, meetingId) => {
  try {
    const res = await fetch(
      `${BASE_URL}/meetings/student/meeting/${meetingId}`,
      {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Accept": "application/json"
        }
      }
    );

    return await handleResponse(res);
  } catch (err) {
    console.error("Student Meeting Detail Error:", err.message);
    throw err;
  }
};