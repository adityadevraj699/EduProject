import { BASE_URL } from './apiConfig';

export const getMyProfileApi = async (token) => {
  try {
    const res = await fetch(`${BASE_URL}/profile/me`, {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${token}`
      }
    });

    /* ⭐ SAFE JSON PARSE (important) */
    const text = await res.text();

    let data;
    try {
      data = JSON.parse(text);
    } catch {
      throw new Error("Server returned invalid response");
    }

    console.info("profile data:", data);

    if (!res.ok) {
      throw new Error(data.message || "Failed to fetch profile");
    }

    return data;

  } catch (err) {
    console.log("Profile API error:", err.message);
    throw err;
  }
};