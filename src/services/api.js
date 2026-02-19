const BASE_URL = "http://192.168.88.201:5000/api/v1";

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
    console.log("api remove")
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