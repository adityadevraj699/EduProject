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


