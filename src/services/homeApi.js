import { BASE_URL } from './apiConfig';

export const getGuideDashboardApi = async (token) => {
  try {
    const res = await fetch(`${BASE_URL}/guide/dashboard`, {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json",
        "Accept": "application/json"
      }
    });

    const result = await res.json();

    if (!res.ok) {
      throw new Error(result.message || "Failed to fetch dashboard");
    }

    return result;
  } catch (err) {
    throw err;
  }
};


export const getStudentDashboardApi = async (token) => {
  try {
    const res = await fetch(`${BASE_URL}/student/dashboard`, {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json",
        "Accept": "application/json"
      }
    });

    const result = await res.json();

    if (!res.ok) {
      throw new Error(result.message || "Failed to fetch dashboard");
    }

    return result;
  } catch (err) {
    throw err;
  }
};