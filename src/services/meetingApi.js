// const BASE_URL = "http://192.168.88.75:5000/api/v1";

const BASE_URL = "https://eduprojectapplication.vercel.app/api/v1"; 

/**
 * Guide ki saari meetings fetch karne ke liye
 * @param {string} token - User ka JWT token
 */
export const getAllMeetingsByGuideApi = async (token) => {
  try {
    const res = await fetch(`${BASE_URL}/meetings/guide-meeting`, {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json",
        "Accept": "application/json"
      }
    });

    const result = await res.json();

    if (!res.ok) {
      throw new Error(result.message || "Failed to fetch meetings");
    }

    return result; 
  } catch (err) {
    console.error("Fetch Meetings Error:", err.message);
    throw err;
  }
};


export const getMeetingDetailsApi = async (token, meetingId) => {
  try {
    const res = await fetch(`${BASE_URL}/meetings/details/${meetingId}`, {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json",
        "Accept": "application/json"
      }
    });

    const result = await res.json();

    if (!res.ok) {
      throw new Error(result.message || "Failed to fetch meeting details");
    }

    return result; // Isme success aur data dono honge
  } catch (err) {
    console.error("Fetch Meeting Details Error:", err.message);
    throw err;
  }
};



export const getMeetingAndMembersApi = async (token, meetingId) => {
  try {
    const url = `${BASE_URL}/meetings/${meetingId}/mom-data`;
    const res = await fetch(url, {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json",
      }
    });
    console.log(res)
    const result = await res.json();
    if (!res.ok) throw new Error(result.message || "Failed to fetch data");
    return result;
  } catch (err) {
    throw err;
  }
};

export const createMomApi = async (token, meetingId, payload) => {
  try {
    // Sahi Route: /meetings/:meetingId/mom
    const url = `${BASE_URL}/meetings/${meetingId}/mom`;
    
    const res = await fetch(url, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json",
        "Accept": "application/json"
      },
      body: JSON.stringify(payload) // Isme summary, attendance_list wagera hai
    });

    const result = await res.json();
    if (!res.ok) throw new Error(result.message || "Failed to save MOM");
    return result;
  } catch (err) {
    console.error("Create MOM Error:", err.message);
    throw err;
  }
};


export const createMeetingApi = async (token, payload) => {
  try {
    const url = `${BASE_URL}/meetings/create`;

    console.log("🚀 CREATE MEETING URL:", url);
    console.log("📦 PAYLOAD:", payload);

    const res = await fetch(url, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json",
        "Accept": "application/json"
      },
      body: JSON.stringify(payload)
    });

    const text = await res.text();   // ⭐ FIRST TEXT

    console.log("📥 RAW RESPONSE STATUS:", res.status);
    console.log("📥 RAW RESPONSE BODY:", text);

    let result;
    try {
      result = JSON.parse(text);  // parse safely
    } catch {
      throw new Error("Server returned non-JSON response");
    }

    if (!res.ok) {
      throw new Error(result.message || "Failed to create meeting");
    }

    return result;

  } catch (err) {
    console.error("❌ Create Meeting Error:", err.message);
    throw err;
  }
};