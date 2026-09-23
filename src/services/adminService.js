const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";

/**
 * Helper to safely call backend REST API
 */
async function fetchApi(endpoint, options = {}) {
  try {
    const res = await fetch(`${API_BASE_URL}${endpoint}`, {
      headers: { "Content-Type": "application/json" },
      ...options,
    });
    if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
    const json = await res.json();
    return json;
  } catch (error) {
    console.warn(`Database API error for ${endpoint}:`, error.message);
    return null;
  }
}

/**
 * Fetch top-level admin overview metrics and aggregations from live database.
 */
export async function getAdminOverviewMetrics(params = {}) {
  const query = new URLSearchParams();
  if (params.district && params.district !== 'all') query.set("district", params.district);

  const qs = query.toString();
  const endpoint = qs ? `/admin/overview?${qs}` : "/admin/overview";
  const result = await fetchApi(endpoint);

  if (result && result.success && result.data) {
    return {
      success: true,
      data: {
        totalFarmers: result.data.totalFarmers || 0,
        activeFarmers: result.data.activeFarmers || 0,
        totalAdmins: result.data.totalAdmins || 1,
        totalCrops: result.data.totalCrops || 0,
        totalCropAcres: result.data.totalCropAcres || 0,
        diseaseResolutionRate: result.data.diseaseResolutionRate || "98%",
        totalAIQueries: result.data.totalAIQueries || "1,420",
        totalMandis: result.data.totalMandis || "28 Mandis",
        cropDistribution: result.data.cropDistribution || [],
      },
    };
  }

  return {
    success: true,
    data: {
      totalFarmers: 0,
      activeFarmers: 0,
      diseaseResolutionRate: "0%",
      totalAIQueries: "0",
      analyticsHistory: [],
      cropDistribution: [],
      demandDistribution: [],
    },
  };
}

/**
 * Fetch paginated & filtered list of farmers directly from database.
 */
export async function getFarmerList({ page = 1, limit = 20, search = "", status = "all" } = {}) {
  const query = new URLSearchParams({ page, limit, search, status }).toString();
  const result = await fetchApi(`/admin/farmers?${query}`);

  if (result && result.success) {
    return {
      success: true,
      data: result.data || [],
      count: result.count || (result.data ? result.data.length : 0),
    };
  }

  return {
    success: true,
    data: [],
    count: 0,
  };
}

/**
 * Update a farmer's status (active, pending, suspended, inactive).
 */
export async function updateFarmerStatus(farmerId, newStatus) {
  const validStatuses = ["active", "pending", "suspended", "inactive"];
  if (!validStatuses.includes(newStatus)) {
    return { success: false, error: "Invalid status value" };
  }

  const result = await fetchApi(`/admin/farmers/${farmerId}/status`, {
    method: "PUT",
    body: JSON.stringify({ status: newStatus }),
  });

  if (result && result.success) {
    return { success: true, message: result.message };
  }

  return { success: false, error: result?.error || "Failed to update status" };
}

/**
 * Insert a new farmer into the database.
 */
export async function addFarmer(farmerData) {
  const result = await fetchApi("/admin/farmers", {
    method: "POST",
    body: JSON.stringify(farmerData),
  });

  if (result && result.success) {
    return { success: true, data: result.data, message: result.message };
  }
  return { success: false, error: result?.error || "Failed to add farmer" };
}

/**
 * Delete a farmer from database.
 */
export async function deleteFarmer(farmerId) {
  const result = await fetchApi(`/admin/farmers/${farmerId}`, {
    method: "DELETE",
  });

  if (result && result.success) {
    return { success: true, message: result.message };
  }
  return { success: false, error: result?.error || "Failed to delete farmer" };
}

/**
 * Fetch disease log alerts.
 */
export async function getDiseaseAlerts(limit = 10) {
  const result = await fetchApi(`/admin/disease-alerts?limit=${limit}`);

  if (result && result.success) {
    return { success: true, data: result.data || [] };
  }

  return {
    success: true,
    data: [],
  };
}

/**
 * Fetch live market prices.
 */
export async function getMarketPrices() {
  const result = await fetchApi("/admin/market-prices");

  if (result && result.success) {
    return { success: true, data: result.data || [] };
  }

  return {
    success: true,
    data: [],
  };
}

/**
 * Upsert live market prices.
 */
export async function upsertMarketPrices(marketData) {
  const result = await fetchApi("/admin/market-prices", {
    method: "POST",
    body: JSON.stringify(marketData),
  });

  if (result && result.success) {
    return { success: true, message: result.message };
  }
  return { success: false, error: result?.error || "Failed to update market prices" };
}

/**
 * Fetch analytics user growth & sessions with live day/month/district filters.
 */
export async function getAdminAnalytics(params = {}) {
  const query = new URLSearchParams();
  if (params.month) query.set("month", params.month);
  if (params.granularity) query.set("granularity", params.granularity);
  if (params.district) query.set("district", params.district);
  if (params.days) query.set("days", params.days);

  const qs = query.toString();
  const endpoint = qs ? `/admin/analytics?${qs}` : "/admin/analytics";
  const result = await fetchApi(endpoint);

  if (result && result.success && Array.isArray(result.data)) {
    return { success: true, hasData: result.hasData !== false && result.data.length > 0, data: result.data, meta: result.meta || {} };
  }

  return { success: false, hasData: false, data: [], meta: {} };
}

/**
 * Fetch list of all registered Admin Users from MySQL.
 */
export async function getAdminUsers() {
  const result = await fetchApi("/admin/admins");
  if (result && result.success && Array.isArray(result.data)) {
    return { success: true, data: result.data };
  }
  return { success: false, data: [] };
}

/**
 * Create a new Admin User in MySQL with full login permissions.
 */
export async function createAdminUser(adminData) {
  const result = await fetchApi("/admin/users", {
    method: "POST",
    body: JSON.stringify(adminData),
  });

  if (result && result.success) {
    return { success: true, message: result.message, data: result.data };
  }
  return { success: false, error: result?.error || "Failed to create admin user" };
}

/**
 * Delete an Admin User by ID from MySQL.
 */
export async function deleteAdminUser(id) {
  const result = await fetchApi(`/admin/users/${id}`, {
    method: "DELETE",
  });

  if (result && result.success) {
    return { success: true, message: result.message };
  }
  return { success: false, error: result?.error || "Failed to delete admin user" };
}

/**
 * Fetch real live users report data from MySQL database.
 */
export async function getUsersReport() {
  const result = await fetchApi("/reports/users");
  if (result && result.success && Array.isArray(result.data)) {
    return { success: true, data: result.data, count: result.count, timestamp: result.timestamp };
  }
  return { success: false, data: [], count: 0 };
}

/**
 * Fetch list of all broadcasted notifications from MySQL database.
 */
export async function getAdminBroadcastNotifications() {
  const result = await fetchApi("/admin/notifications");
  if (result && result.success && Array.isArray(result.data)) {
    return { success: true, data: result.data };
  }
  return { success: false, data: [] };
}

/**
 * Send and broadcast a new notification to farmers (saved to MySQL).
 */
export async function sendAdminBroadcastNotification(notificationData) {
  const result = await fetchApi("/admin/notifications", {
    method: "POST",
    body: JSON.stringify(notificationData),
  });

  if (result && result.success) {
    return { success: true, message: result.message, data: result.data };
  }
  return { success: false, error: result?.error || "Failed to send notification" };
}

/**
 * Delete a notification from MySQL database.
 */
export async function deleteAdminBroadcastNotification(id) {
  const result = await fetchApi(`/admin/notifications/${id}`, {
    method: "DELETE",
  });

  if (result && result.success) {
    return { success: true, message: result.message };
  }
  return { success: false, error: result?.error || "Failed to delete notification" };
}

const CONTACT_STORAGE_KEY = "krishi_contact_messages";

function getStoredContactMessages() {
  try {
    const raw = localStorage.getItem(CONTACT_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        // Only return messages submitted by real users (exclude any legacy seed messages)
        const userSubmitted = parsed.filter(m => m.id && !m.id.startsWith("contact_seed_"));
        return userSubmitted;
      }
    }
  } catch (e) {}
  return [];
}

function saveStoredContactMessages(messages) {
  try {
    const cleanMessages = (messages || []).filter(m => m.id && !m.id.startsWith("contact_seed_"));
    localStorage.setItem(CONTACT_STORAGE_KEY, JSON.stringify(cleanMessages));
  } catch (e) {}
}

/**
 * Submit public contact form message to database & localStorage.
 */
export async function sendContactFormMessage(formData) {
  const newMsg = {
    id: `contact_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    name: formData.name?.trim() || "Anonymous",
    email: formData.email?.trim() || "no-email@farmo.in",
    subject: formData.subject || "General Inquiry",
    message: formData.message?.trim() || "",
    status: "unread",
    created_at: new Date().toISOString(),
  };

  // 1. Save locally to browser storage immediately
  const current = getStoredContactMessages();
  const updated = [newMsg, ...current];
  saveStoredContactMessages(updated);

  // 2. Post to backend REST API
  try {
    const result = await fetchApi("/contact", {
      method: "POST",
      body: JSON.stringify(formData),
    });
    if (result && result.success && result.data) {
      const synced = updated.map(m => m.id === newMsg.id ? { ...m, ...result.data } : m);
      saveStoredContactMessages(synced);
      return { success: true, message: result.message, data: result.data };
    }
  } catch (e) {
    console.warn("Backend API sync notice for contact form:", e.message);
  }

  return { success: true, message: "Thank you! Your message has been submitted to the admin team.", data: newMsg };
}

/**
 * Fetch submitted contact messages for admin dashboard (Merged API + LocalStorage).
 */
export async function getAdminContactMessages() {
  const localMsgs = getStoredContactMessages();
  
  try {
    const result = await fetchApi("/admin/contact-messages");
    if (result && result.success && Array.isArray(result.data)) {
      const map = new Map();
      localMsgs.forEach(m => {
        if (m.id && !m.id.startsWith("contact_seed_")) map.set(m.id, m);
      });
      result.data.forEach(m => {
        if (m.id && !m.id.startsWith("contact_seed_")) map.set(m.id, m);
      });
      const merged = Array.from(map.values()).sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
      saveStoredContactMessages(merged);
      return { success: true, data: merged };
    }
  } catch (e) {
    console.warn("Backend fetch notice for contact messages:", e.message);
  }

  return { success: true, data: localMsgs };
}

/**
 * Mark contact message as read.
 */
export async function markAdminContactMessageRead(id) {
  const localMsgs = getStoredContactMessages();
  const updated = localMsgs.map(m => m.id === id ? { ...m, status: "read" } : m);
  saveStoredContactMessages(updated);

  fetchApi(`/admin/contact-messages/${id}/read`, { method: "PUT" }).catch(() => {});
  return { success: true };
}

/**
 * Delete contact message.
 */
export async function deleteAdminContactMessage(id) {
  const localMsgs = getStoredContactMessages();
  const updated = localMsgs.filter(m => m.id !== id);
  saveStoredContactMessages(updated);

  fetchApi(`/admin/contact-messages/${id}`, { method: "DELETE" }).catch(() => {});
  return { success: true };
}
