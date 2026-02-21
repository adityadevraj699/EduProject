//const BASE_URL = "https://eduprojectapplication.vercel.app/api/v1"; 
const BASE_URL = "http://192.168.88.75:5000/api/v1";

/* ---------- LOGIN API ---------- */
export const loginApi = async (email, password) => {

  try {
    const res = await fetch(`${BASE_URL}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ email, password })
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.message || "Login failed");
    }

    return data; // 👈 important
  } catch (err) {
    throw err;
  }
};


/* ---------- LOGOUT ---------- */
export const logoutApi = async () => {
  try {
    await AsyncStorage.removeItem("token");
    return true;
  } catch (err) {
    throw err;
  }
};


/* ---------- FORGOT PASSWORD (Send OTP) ---------- */
export const forgotPasswordApi = async (email) => {
  try {
    const res = await fetch(`${BASE_URL}/auth/forgot-password`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Failed to send OTP");
    return data;
  } catch (err) {
    throw err;
  }
};

/* ---------- VERIFY OTP ---------- */
export const verifyOtpApi = async (email, otp) => {
  try {
    const res = await fetch(`${BASE_URL}/auth/verify-otp`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, otp }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Invalid OTP");
    return data;
  } catch (err) {
    throw err;
  }
};

/* ---------- CHANGE PASSWORD ---------- */
export const changePasswordApi = async (email, newPassword) => {
  try {
    const res = await fetch(`${BASE_URL}/auth/change-password`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, newPassword }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Failed to update password");
    return data;
  } catch (err) {
    throw err;
  }
};



export const getGuideTeamsApi = async (token) => {
  try {
    const res = await fetch(`${BASE_URL}/teams/guide-teams`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      }
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Failed to fetch teams");
    
    return data; 
  } catch (err) {
    throw err;
  }
};


export const getTeamDetailsApi = async (token, teamId) => {
  try {
    // 💡 Fix: added /api/v1/teams to match backend
    const res = await fetch(`${BASE_URL}/teams/details/${teamId}`, {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json",
        "Accept": "application/json" // 👈 Backend ko batao ki sirf JSON chahiye
      }
    });

    // Check karein agar response ok nahi hai (404, 500 etc)
    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.message || "Server Error");
    }

    return await res.json();
  } catch (err) {
   
    throw err;
  }
};