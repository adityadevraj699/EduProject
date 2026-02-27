import { BASE_URL } from './apiConfig';

/* ---------- STUDENT PUBLIC PROFILE (EMAIL BASED) ---------- */
export const getStudentPublicProfileApi = async (email) => {
  try {
    const res = await fetch(
      `${BASE_URL}/public/student?email=${encodeURIComponent(email)}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json"
        }
      }
    );

    /* ⭐ SAFE PARSE */
    const text = await res.text();

    let data;
    try {
      data = JSON.parse(text);
    } catch {
      throw new Error("Invalid server response");
    }

    if (!res.ok) {
      throw new Error(data.message || "Failed to fetch public profile");
    }

    return data;

  } catch (err) {
    console.log("Public profile API error:", err.message);
    throw err;
  }
};