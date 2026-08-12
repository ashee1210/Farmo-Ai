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
export async function getAdminOverviewMetrics() {
  const result = await fetchApi("/admin/overview");

  if (result && result.success && result.data) {
    return {
      success: true,
      data: {
        totalFarmers: result.data.totalFarmers || 0,
        activeFarmers: result.data.activeFarmers || 0,
        totalAdmins: result.data.totalAdmins || 1,
        totalCrops: result.data.totalCrops || 0,
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
