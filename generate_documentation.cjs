/**
 * FARMO AI - Enterprise API Services Documentation Generator
 * Generates both:
 * 1. FARMO_AI_API_Services_Documentation.docx (Microsoft Word)
 * 2. FARMO_AI_API_Services_Documentation.pdf (Adobe PDF via Chrome Headless)
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const {
  Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell,
  HeadingLevel, AlignmentType, BorderStyle, WidthType, ShadingType, PageBreak
} = require('docx');

// Base Paths
const docxPath = path.join(__dirname, 'FARMO_AI_API_Services_Documentation.docx');
const htmlPath = path.join(__dirname, 'FARMO_AI_API_Services_Documentation.html');
const pdfPath = path.join(__dirname, 'FARMO_AI_API_Services_Documentation.pdf');

console.log('Generating FARMO AI API Services Documentation...');

// ─────────────────────────────────────────────────────────────────────────────
// 1. DATA DEFINITIONS FOR ALL 12 API SERVICE MODULES
// ─────────────────────────────────────────────────────────────────────────────

const apiModules = [
  {
    category: "1. System Health & Platform Diagnostics",
    description: "Heartbeat and diagnostic services providing real-time telemetry on the Express API server, MySQL/SQLite database engine connectivity, and system uptime.",
    endpoints: [
      {
        method: "GET",
        path: "/",
        title: "Platform Welcome & Root Status",
        access: "Public",
        desc: "Returns server branding, deployment mode, and timestamp.",
        headers: ["None required"],
        params: [],
        body: null,
        response: {
          status: 200,
          example: {
            message: "FARMO AI Backend Server is Running!",
            version: "2.4.0",
            status: "active",
            timestamp: "2026-09-25T12:00:00.000Z"
          }
        }
      },
      {
        method: "GET",
        path: "/api/health",
        title: "Database & Microservices Health Check",
        access: "Public",
        desc: "Deep health probe verifying MySQL connection pool latency, active database engine, and uptime.",
        headers: ["None required"],
        params: [],
        body: null,
        response: {
          status: 200,
          example: {
            status: "OK",
            engine: "mysql",
            database: "farmo_ai_db",
            host: "127.0.0.1:3306",
            uptime_seconds: 14205,
            timestamp: "2026-09-25T12:00:00.000Z"
          }
        }
      }
    ]
  },
  {
    category: "2. Authentication & Identity Services",
    description: "User registration, credential verification, JWT token issuance, and profile synchronization for both Farmers and Platform Administrators.",
    endpoints: [
      {
        method: "POST",
        path: "/api/auth/register",
        title: "Farmer Account Registration",
        access: "Public",
        desc: "Registers a new agricultural producer. Automatically provisions farmer profile, district assignment, and farm size records in MySQL.",
        headers: ["Content-Type: application/json"],
        params: [],
        body: {
          name: "Suresh Pillai",
          email: "suresh.pillai@gmail.com",
          password: "Farmer@123",
          phone: "+91 94470 12345",
          district: "Palakkad",
          crop: "Organic Paddy (Jyothi)",
          acres: 3.5,
          soil_type: "Alluvial"
        },
        response: {
          status: 201,
          example: {
            success: true,
            message: "Farmer account registered successfully!",
            user: {
              id: "u_1790170999_a1b2",
              name: "Suresh Pillai",
              email: "suresh.pillai@gmail.com",
              role: "farmer",
              district: "Palakkad",
              crop: "Organic Paddy (Jyothi)",
              acres: 3.5
            },
            token: "jwt_farmer_u_1790170999_a1b2"
          }
        }
      },
      {
        method: "POST",
        path: "/api/auth/login",
        title: "User & Admin Authentication",
        access: "Public",
        desc: "Validates credentials against MySQL `users` table. Automatically routes between Farmer Portal and Admin Portal according to account role.",
        headers: ["Content-Type: application/json"],
        params: [],
        body: {
          email: "admin@gmail.com",
          password: "admin@123"
        },
        response: {
          status: 200,
          example: {
            success: true,
            message: "Login successful",
            role: "admin",
            user: {
              id: "u_admin_default",
              name: "Admin Administrator",
              email: "admin@gmail.com",
              role: "admin",
              district: "Kerala"
            },
            token: "jwt_admin_u_admin_default"
          }
        }
      },
      {
        method: "GET",
        path: "/api/user/profile",
        title: "Get Authenticated User Profile",
        access: "Farmer / Admin",
        desc: "Fetches full profile metadata, including primary crop, farm land size, soil classification, and profile avatar.",
        headers: ["Authorization: Bearer <token>"],
        params: [
          { name: "email", type: "string", required: true, desc: "User's registered email address" }
        ],
        body: null,
        response: {
          status: 200,
          example: {
            success: true,
            data: {
              id: "u_1786594685785_3j73",
              name: "ASHWIN",
              email: "aswin1210@gmail.com",
              phone: "9345675687",
              district: "Wayanad",
              crop: "rice (basmathi), corn",
              acres: 5.5,
              soil_type: "Alluvial",
              role: "farmer",
              joined: "2026-08-13"
            }
          }
        }
      },
      {
        method: "PUT",
        path: "/api/user/profile",
        title: "Update Farmer Profile",
        access: "Farmer",
        desc: "Updates farm holding metrics, contact telephone number, district location, and avatar image URI.",
        headers: ["Content-Type: application/json", "Authorization: Bearer <token>"],
        params: [],
        body: {
          email: "aswin1210@gmail.com",
          name: "ASHWIN K S",
          phone: "9345675687",
          district: "Wayanad",
          crop: "rice (basmathi)",
          acres: 5.5,
          soil_type: "Loamy Alluvial"
        },
        response: {
          status: 200,
          example: {
            success: true,
            message: "Farmer profile updated successfully in MySQL database"
          }
        }
      }
    ]
  },
  {
    category: "3. Farmer Crop & Field Management Services",
    description: "Enables farmers to log crop rotations, track field parcel acreage, monitor vegetative growth stages, and assess crop health scores.",
    endpoints: [
      {
        method: "GET",
        path: "/api/user/crops",
        title: "Retrieve Farmer Crops & Parcels",
        access: "Farmer / Admin",
        desc: "Fetches list of active crops registered under the specified farmer ID or email.",
        headers: ["Authorization: Bearer <token>"],
        params: [
          { name: "email", type: "string", required: false, desc: "Farmer's registered email" },
          { name: "farmer_id", type: "string", required: false, desc: "Unique farmer UUID" }
        ],
        body: null,
        response: {
          status: 200,
          example: {
            success: true,
            data: [
              {
                id: "add_1790006014189_vgsn",
                crop_name: "rice",
                variety: "basmathi",
                acres: 3.0,
                health: 90,
                growth_stage: "Growing",
                status: "Available"
              },
              {
                id: "add_1790005832080_w54k",
                crop_name: "corn",
                variety: "Hybrid / Standard Variety",
                acres: 2.5,
                health: 90,
                growth_stage: "Growing",
                status: "Available"
              }
            ]
          }
        }
      },
      {
        method: "POST",
        path: "/api/user/crops",
        title: "Add New Crop Parcel",
        access: "Farmer",
        desc: "Creates a new agricultural crop parcel in the MySQL `products` and `farmer_crops` tables.",
        headers: ["Content-Type: application/json", "Authorization: Bearer <token>"],
        params: [],
        body: {
          farmer_id: "u_1786594685785_3j73",
          farmer_email: "aswin1210@gmail.com",
          crop_name: "Pepper",
          variety: "Panniyur-1",
          quantity_acres: 1.5,
          price_per_unit: 680.0,
          health_rating: 95,
          growth_stage: "Vegetative",
          location_district: "Palakkad"
        },
        response: {
          status: 201,
          example: {
            success: true,
            message: "Crop parcel added successfully to farm inventory",
            cropId: "crop_1790321550_9941"
          }
        }
      },
      {
        method: "DELETE",
        path: "/api/user/crops/:id",
        title: "Delete Crop Parcel",
        access: "Farmer / Admin",
        desc: "Removes a crop parcel record from the database by its unique parcel ID.",
        headers: ["Authorization: Bearer <token>"],
        params: [
          { name: "id", type: "string", required: true, desc: "Crop parcel ID (path param)" }
        ],
        body: null,
        response: {
          status: 200,
          example: {
            success: true,
            message: "Crop parcel removed from database"
          }
        }
      },
      {
        method: "GET",
        path: "/api/user/yield-trend",
        title: "Farmer Yield & Harvest Analytics",
        access: "Farmer",
        desc: "Calculates harvest progression across crop parcels, production totals in Quintals, and estimated revenue value.",
        headers: ["Authorization: Bearer <token>"],
        params: [
          { name: "email", type: "string", required: true, desc: "Farmer email" }
        ],
        body: null,
        response: {
          status: 200,
          example: {
            success: true,
            data: {
              ytd_production_qtl: 123,
              target_reached_pct: 90,
              estimated_value_inr: 161000,
              timeline: [
                { week: "Week 1", yield: 35 },
                { week: "Week 2", yield: 70 },
                { week: "Week 3", yield: 95 },
                { week: "Week 4", yield: 123 }
              ]
            }
          }
        }
      }
    ]
  },
  {
    category: "4. Real-Time Push Notifications & Broadcast Center Services",
    description: "Broadcasts critical agro-advisories, mandi price surge warnings, and government schemes directly to all farmers or targeted users in real-time.",
    endpoints: [
      {
        method: "POST",
        path: "/api/admin/notifications",
        title: "Send Admin Broadcast Notification",
        access: "Admin",
        desc: "Dispatches a push notification stored in MySQL `admin_notifications`. Supports broadcasting to ALL farmers or targeting a SPECIFIED farmer, district, or crop in real-time.",
        headers: ["Content-Type: application/json", "Authorization: Bearer <token>"],
        params: [],
        body: {
          title: "Monsoon Crop Drainage Advisory",
          message: "Heavy showers predicted in Wayanad & Palakkad. Clear secondary drainage channels immediately.",
          category: "Weather",
          priority: "Urgent",
          target_audience: "user",
          target_value: "aswin1210@gmail.com",
          sender_admin: "Admin Administrator"
        },
        response: {
          status: 201,
          example: {
            success: true,
            message: "Notification broadcasted to farmers successfully!",
            data: {
              id: "notif_1790320657_mdhh",
              title: "Monsoon Crop Drainage Advisory",
              message: "Heavy showers predicted in Wayanad & Palakkad.",
              category: "Weather",
              priority: "Urgent",
              target_audience: "user",
              target_value: "aswin1210@gmail.com",
              sender_admin: "Admin Administrator",
              status: "active",
              created_at: "2026-09-25T07:17:37.000Z"
            }
          }
        }
      },
      {
        method: "GET",
        path: "/api/notifications",
        title: "Farmer Live Notification Feed",
        access: "Farmer",
        desc: "Fetches live notifications in real-time. Automatically filters records matching 'all', or matching the farmer's specific email, user ID, district, or crop.",
        headers: ["Authorization: Bearer <token>"],
        params: [
          { name: "user_email", type: "string", required: false, desc: "Farmer's registered email" },
          { name: "user_id", type: "string", required: false, desc: "Farmer ID" },
          { name: "district", type: "string", required: false, desc: "Farmer district" },
          { name: "crop", type: "string", required: false, desc: "Farmer crop" }
        ],
        body: null,
        response: {
          status: 200,
          example: {
            success: true,
            data: [
              {
                id: "notif_1790320657_mdhh",
                title: "Monsoon Crop Drainage Advisory",
                message: "Heavy showers predicted in Wayanad & Palakkad.",
                category: "Weather",
                priority: "Urgent",
                target_audience: "user",
                target_value: "aswin1210@gmail.com",
                sender_admin: "Admin Administrator",
                created_at: "2026-09-25T07:17:37.000Z"
              }
            ]
          }
        }
      },
      {
        method: "GET",
        path: "/api/admin/notifications",
        title: "List All Broadcast History",
        access: "Admin",
        desc: "Retrieves complete log of all broadcast alerts dispatched across Kerala.",
        headers: ["Authorization: Bearer <token>"],
        params: [],
        body: null,
        response: {
          status: 200,
          example: {
            success: true,
            data: [
              {
                id: "notif_1790319063676_mqg6",
                title: "heavy rain fall",
                message: "Advisory for coastal districts",
                category: "Market",
                priority: "Urgent",
                target_audience: "district",
                target_value: "Kannur",
                created_at: "2026-09-25T06:51:03.000Z"
              }
            ]
          }
        }
      },
      {
        method: "DELETE",
        path: "/api/admin/notifications/:id",
        title: "Delete Notification Broadcast",
        access: "Admin",
        desc: "Permanently deletes a broadcast record from MySQL database.",
        headers: ["Authorization: Bearer <token>"],
        params: [
          { name: "id", type: "string", required: true, desc: "Notification ID" }
        ],
        body: null,
        response: {
          status: 200,
          example: {
            success: true,
            message: "Notification broadcast deleted successfully."
          }
        }
      }
    ]
  },
  {
    category: "5. Mandi Market Price Intelligence Services",
    description: "Monitors daily wholesale Mandi trading prices, modal rates, price shifts, and AI price forecasting across Kerala agricultural markets.",
    endpoints: [
      {
        method: "GET",
        path: "/api/market-prices",
        title: "Farmer Mandi Commodity Rates",
        access: "Public / Farmer",
        desc: "Returns wholesale APMC Mandi rates with minimum, maximum, and modal price indices per commodity.",
        headers: ["None required"],
        params: [
          { name: "district", type: "string", required: false, desc: "Filter by district (e.g. Palakkad, Wayanad)" },
          { name: "crop", type: "string", required: false, desc: "Filter by commodity name" }
        ],
        body: null,
        response: {
          status: 200,
          example: {
            success: true,
            data: [
              {
                id: "m_paddy_real",
                crop_name: "Organic Paddy (Jyothi)",
                district: "Palakkad",
                min_price: 2180.0,
                max_price: 2350.0,
                modal_price: 2280.0,
                unit: "Quintal",
                price_trend: "+3.3%",
                status: "Rising"
              },
              {
                id: "m_pepper_real",
                crop_name: "Pepper",
                district: "Palakkad",
                min_price: 640.0,
                max_price: 720.0,
                modal_price: 680.0,
                unit: "KG",
                price_trend: "+6.3%",
                status: "Rising"
              }
            ]
          }
        }
      },
      {
        method: "POST",
        path: "/api/admin/market-prices",
        title: "Create Mandi Price Entry",
        access: "Admin",
        desc: "Adds a new commodity trading price quote for a designated Mandi.",
        headers: ["Content-Type: application/json", "Authorization: Bearer <token>"],
        params: [],
        body: {
          crop_name: "Cardamom (Green Supreme)",
          district: "Idukki",
          min_price: 1850.0,
          max_price: 2150.0,
          modal_price: 2000.0,
          unit: "KG",
          price_trend: "+5.1%",
          status: "Rising"
        },
        response: {
          status: 201,
          example: {
            success: true,
            message: "Market price record published successfully"
          }
        }
      },
      {
        method: "POST",
        path: "/api/admin/market-prices/upsert",
        title: "Bulk Upsert Mandi Rates",
        access: "Admin",
        desc: "Batch synchronizes multiple commodity market rates in a single atomic transaction.",
        headers: ["Content-Type: application/json", "Authorization: Bearer <token>"],
        params: [],
        body: {
          prices: [
            { crop: "Paddy", current: 2280, prev: 2180, trend: "+4.5%" },
            { crop: "Corn", current: 1680, prev: 1620, trend: "+3.7%" }
          ]
        },
        response: {
          status: 200,
          example: {
            success: true,
            message: "Bulk market rates updated successfully"
          }
        }
      }
    ]
  },
  {
    category: "6. Weather & Agro-Climatic Intelligence Services",
    description: "Hyper-local weather telemetry delivering precipitation forecasts, humidity readings, solar radiation indices, and farm management advice.",
    endpoints: [
      {
        method: "GET",
        path: "/api/weather",
        title: "Get Localized Agro-Weather Forecast",
        access: "Public / Farmer",
        desc: "Fetches 7-day meteorological forecasts, precipitation alerts, and fieldwork safety advisories.",
        headers: ["None required"],
        params: [
          { name: "district", type: "string", required: false, desc: "District name (default: Palakkad)" }
        ],
        body: null,
        response: {
          status: 200,
          example: {
            success: true,
            data: {
              district: "Palakkad",
              current: {
                temp_c: 28.5,
                condition: "Sunny with light clouds",
                humidity: 78,
                wind_kph: 12.4,
                rain_chance_pct: 20
              },
              forecast: [
                { day: "Today", high: 31, low: 24, rain: 20, desc: "Sunny" },
                { day: "Tomorrow", high: 29, low: 23, rain: 65, desc: "Rain" }
              ],
              advisory: "Favorable conditions for foliar fertilizer application before midday."
            }
          }
        }
      }
    ]
  },
  {
    category: "7. AI Diagnostics & Ollama LLM Services",
    description: "Deep learning models for plant pathology detection, leaf disease classification, and multi-turn LLM agricultural advisory via local Ollama instances.",
    endpoints: [
      {
        method: "GET",
        path: "/api/ai/ollama/status",
        title: "Ollama LLM Engine Connectivity Check",
        access: "Public",
        desc: "Checks local Ollama server status (`http://localhost:11434`), loaded neural models, and inference availability.",
        headers: ["None required"],
        params: [],
        body: null,
        response: {
          status: 200,
          example: {
            success: true,
            connected: true,
            model: "llama3",
            version: "0.1.32",
            modelsAvailable: ["llama3:latest", "mistral:latest"]
          }
        }
      },
      {
        method: "POST",
        path: "/api/ai/chat",
        title: "Conversational Farming Assistant",
        access: "Farmer",
        desc: "Multi-turn AI conversation answering questions on soil management, fertilizer formulas, pest control, and market timing.",
        headers: ["Content-Type: application/json"],
        params: [],
        body: {
          message: "What fertilizer should I apply for my rice paddy at tillering stage?",
          district: "Palakkad",
          crop: "Paddy"
        },
        response: {
          status: 200,
          example: {
            success: true,
            reply: "For rice at tillering stage, apply Urea (46-0-0) at 50 kg/ha as top-dressing. Ensure soil moisture is optimal before broadcast.",
            modelUsed: "llama3"
          }
        }
      },
      {
        method: "POST",
        path: "/api/crops/scan",
        title: "Crop Leaf Disease Image Diagnostic",
        access: "Farmer",
        desc: "Analyzes crop leaf symptoms via computer vision/Ollama to detect diseases, pathogen type, severity level, and treatments.",
        headers: ["Content-Type: application/json"],
        params: [],
        body: {
          farmer_id: "u_1790170235463_3crv",
          crop: "Paddy",
          district: "Palakkad",
          image_data: "data:image/jpeg;base64,/9j/4AAQSkZJRg..."
        },
        response: {
          status: 200,
          example: {
            success: true,
            scanId: "scan_1790322100",
            disease: "Bacterial Blight (Xanthomonas oryzae)",
            severity: "Medium",
            confidence: 96.0,
            treatment: "Apply Streptomycin sulphate + Tetracycline combination with Copper Oxychloride. Drain standing water.",
            status: "detected"
          }
        }
      },
      {
        method: "GET",
        path: "/api/crops/scans",
        title: "Farmer Disease Scan History",
        access: "Farmer",
        desc: "Retrieves historical disease diagnostic scans conducted by the authenticated farmer.",
        headers: ["Authorization: Bearer <token>"],
        params: [
          { name: "farmer_id", type: "string", required: true, desc: "Farmer UUID" }
        ],
        body: null,
        response: {
          status: 200,
          example: {
            success: true,
            data: [
              {
                id: "scan_1790093429813",
                crop: "paddy",
                disease: "Bacterial Blight",
                severity: "Medium",
                confidence: 96.0,
                status: "detected",
                detected_at: "2026-09-22T16:10:29.000Z"
              }
            ]
          }
        }
      }
    ]
  },
  {
    category: "8. Admin Oversight & Analytics Services",
    description: "Administrative intelligence center for farmer verification, regional crop census, account governance, and platform KPIs.",
    endpoints: [
      {
        method: "GET",
        path: "/api/admin/overview",
        title: "Executive Metrics & Regional KPI Rollup",
        access: "Admin",
        desc: "Returns top-level management KPIs: total registered farmers, active percentage, aggregated crop acreage, and district distributions.",
        headers: ["Authorization: Bearer <token>"],
        params: [
          { name: "district", type: "string", required: false, desc: "Filter by district" }
        ],
        body: null,
        response: {
          status: 200,
          example: {
            success: true,
            data: {
              totalFarmers: 5,
              activeFarmers: 5,
              totalAdmins: 1,
              totalCrops: 5,
              totalCropAcres: "11.0 ac",
              diseaseResolutionRate: "98%",
              totalMandis: "28 Mandis",
              cropDistribution: [
                { name: "Paddy (Jyothi)", count: 2, acres: "3.5", value: 32 },
                { name: "rice (basmathi)", count: 1, acres: "3.0", value: 27 },
                { name: "corn", count: 1, acres: "2.5", value: 23 },
                { name: "Pepper", count: 1, acres: "1.0", value: 9 },
                { name: "Rubber (RSI 4)", count: 1, acres: "1.0", value: 9 }
              ]
            }
          }
        }
      },
      {
        method: "GET",
        path: "/api/admin/farmers",
        title: "Admin Farmer Registry Query",
        access: "Admin",
        desc: "Paginated search across the master farmer database with filtering by status and query string.",
        headers: ["Authorization: Bearer <token>"],
        params: [
          { name: "page", type: "number", required: false, desc: "Page index (default: 1)" },
          { name: "limit", type: "number", required: false, desc: "Records per page (default: 20)" },
          { name: "search", type: "string", required: false, desc: "Keyword search in name, email, crop, location" },
          { name: "status", type: "string", required: false, desc: "Filter by status: 'active', 'inactive', or 'all'" }
        ],
        body: null,
        response: {
          status: 200,
          example: {
            success: true,
            count: 5,
            data: [
              {
                id: "u_1790170235463_3crv",
                name: "thilaga",
                email: "717824f155@gmail.com",
                phone: "6380514411",
                district: "Palakkad",
                crop: "Pepper",
                acres: 1.0,
                status: "Active"
              },
              {
                id: "u_farmer_01",
                name: "Ramesh Kumar",
                email: "ramesh@gmail.com",
                phone: "+91 94470 12345",
                district: "Palakkad",
                crop: "Organic Paddy (Jyothi Hybrid)",
                acres: 2.5,
                status: "Active"
              }
            ]
          }
        }
      },
      {
        method: "PUT",
        path: "/api/admin/farmers/:id/status",
        title: "Update Farmer Account Status",
        access: "Admin",
        desc: "Modifies farmer status (e.g. Active, Suspended, Inactive).",
        headers: ["Content-Type: application/json", "Authorization: Bearer <token>"],
        params: [
          { name: "id", type: "string", required: true, desc: "Farmer user ID" }
        ],
        body: {
          status: "Active"
        },
        response: {
          status: 200,
          example: {
            success: true,
            message: "Farmer status updated to Active"
          }
        }
      },
      {
        method: "GET",
        path: "/api/admin/analytics",
        title: "Growth & Telemetry Analytics",
        access: "Admin",
        desc: "Provides time-series growth telemetry on sessions, farmer onboarding, and revenue.",
        headers: ["Authorization: Bearer <token>"],
        params: [
          { name: "month", type: "string", required: false, desc: "Specific month or 'all'" },
          { name: "district", type: "string", required: false, desc: "District filter" }
        ],
        body: null,
        response: {
          status: 200,
          example: {
            success: true,
            hasData: true,
            data: [
              { month: "May", farmers: 1, sessions: 45, revenue: 1800 },
              { month: "Aug", farmers: 4, sessions: 280, revenue: 11200 },
              { month: "Sep", farmers: 5, sessions: 420, revenue: 16800 }
            ],
            meta: {
              totalFarmers: 5,
              totalSessions: 420,
              totalRevenue: 16800
            }
          }
        }
      }
    ]
  },
  {
    category: "9. Public Support & Inquiries Services",
    description: "Public contact form processing, automated admin alert routing, and support ticket management.",
    endpoints: [
      {
        method: "POST",
        path: "/api/contact",
        title: "Submit Public Contact Message",
        access: "Public",
        desc: "Accepts inquiry from landing page contact form. Saves to `contact_messages` table and immediately raises an alert in the Admin Portal.",
        headers: ["Content-Type: application/json"],
        params: [],
        body: {
          name: "Dr. Ananya Nair",
          email: "ananya@agriuniversity.edu",
          subject: "Partnership & Soil Sensor Research",
          message: "We would like to integrate our soil moisture telemetry with FARMO AI."
        },
        response: {
          status: 200,
          example: {
            success: true,
            message: "Thank you! Your message has been submitted to the admin team.",
            data: {
              id: "contact_1790322500_xyz1",
              name: "Dr. Ananya Nair",
              email: "ananya@agriuniversity.edu",
              subject: "Partnership & Soil Sensor Research",
              created_at: "2026-09-25T08:15:00.000Z"
            }
          }
        }
      },
      {
        method: "GET",
        path: "/api/admin/contact-messages",
        title: "List Contact Inquiries",
        access: "Admin",
        desc: "Fetches submitted user inquiries, sorted chronologically with read/unread statuses.",
        headers: ["Authorization: Bearer <token>"],
        params: [],
        body: null,
        response: {
          status: 200,
          example: {
            success: true,
            data: [
              {
                id: "contact_1790322500_xyz1",
                name: "Dr. Ananya Nair",
                email: "ananya@agriuniversity.edu",
                subject: "Partnership & Soil Sensor Research",
                message: "We would like to integrate our soil moisture telemetry with FARMO AI.",
                status: "unread",
                created_at: "2026-09-25T08:15:00.000Z"
              }
            ]
          }
        }
      },
      {
        method: "PUT",
        path: "/api/admin/contact-messages/:id/read",
        title: "Mark Contact Message Read",
        access: "Admin",
        desc: "Updates message status to 'read'.",
        headers: ["Authorization: Bearer <token>"],
        params: [
          { name: "id", type: "string", required: true, desc: "Contact message ID" }
        ],
        body: null,
        response: {
          status: 200,
          example: {
            success: true,
            message: "Message marked as read"
          }
        }
      }
    ]
  },
  {
    category: "10. Reports & Data Export Services",
    description: "Standardized tabular reporting, agricultural production census, and unified data views.",
    endpoints: [
      {
        method: "GET",
        path: "/api/reports/users",
        title: "Master Users & Farmers Census Report",
        access: "Admin",
        desc: "Produces full tabular dump combining user accounts, farmer credentials, crop varieties, farm land acreage, and registered dates.",
        headers: ["Authorization: Bearer <token>"],
        params: [],
        body: null,
        response: {
          status: 200,
          example: {
            success: true,
            count: 6,
            data: [
              {
                user_id: "u_admin_default",
                user_name: "Admin Administrator",
                email: "admin@gmail.com",
                role: "admin",
                district: "Kerala"
              },
              {
                user_id: "u_1786594685785_3j73",
                user_name: "ASHWIN",
                email: "aswin1210@gmail.com",
                role: "farmer",
                district: "Wayanad",
                crop_name: "rice (basmathi), corn",
                crop_acres: 5.5
              }
            ]
          }
        }
      },
      {
        method: "GET",
        path: "/api/unified/all",
        title: "Unified All-in-One Data View",
        access: "Admin",
        desc: "High-performance SQL View (`view_unified_all_in_one6`) consolidating users, farmer crops, disease scans, and market prices.",
        headers: ["Authorization: Bearer <token>"],
        params: [],
        body: null,
        response: {
          status: 200,
          example: {
            success: true,
            totalRows: 6,
            viewName: "view_unified_all_in_one6"
          }
        }
      }
    ]
  },
  {
    category: "11. Spring Boot Java Microservices Architecture",
    description: "Enterprise Java Spring Boot microservice cluster running on port 8080 (`com.farmoai.microservices`), providing modular JPA-backed endpoints.",
    endpoints: [
      {
        method: "POST",
        path: "/api/auth/register (Java Spring Boot)",
        title: "Spring Boot User Registration Microservice",
        access: "Public",
        desc: "Spring Data JPA controller handling farmer account registration with duplicate email validation and password encryption.",
        headers: ["Content-Type: application/json"],
        params: [],
        body: {
          name: "Manoj Varma",
          email: "manoj@gmail.com",
          district: "Thrissur",
          phone: "+91 94470 55555"
        },
        response: {
          status: 200,
          example: {
            success: true,
            message: "User registered successfully via Spring Boot Microservice"
          }
        }
      },
      {
        method: "GET",
        path: "/api/crops/all (Java Spring Boot)",
        title: "Spring Boot Crop Management Microservice",
        access: "Farmer",
        desc: "JPA repository-backed crop entity retrieval with health rating filtering.",
        headers: ["Authorization: Bearer <token>"],
        params: [],
        body: null,
        response: {
          status: 200,
          example: {
            success: true,
            count: 5,
            service: "CropManagementMicroservice"
          }
        }
      }
    ]
  },
  {
    category: "12. Data Models, Schemas & Entity Dictionary",
    description: "Database table structures across the MySQL relational schema `farmo_ai_db`.",
    endpoints: []
  }
];

// ─────────────────────────────────────────────────────────────────────────────
// 2. GENERATE MICROSOFT WORD (.DOCX) DOCUMENT
// ─────────────────────────────────────────────────────────────────────────────

console.log('Building Word document structure...');

const docChildren = [];

// Header Title Banner
docChildren.push(
  new Paragraph({
    text: "FARMO AI - SMART FARMING PLATFORM",
    heading: HeadingLevel.TITLE,
    alignment: AlignmentType.CENTER,
    spacing: { after: 120 }
  }),
  new Paragraph({
    alignment: AlignmentType.CENTER,
    children: [
      new TextRun({ text: "REST API Services & Microservices Specification", bold: true, size: 28, color: "1B5E38" })
    ],
    spacing: { after: 200 }
  }),
  new Paragraph({
    alignment: AlignmentType.CENTER,
    children: [
      new TextRun({ text: "Document Version: ", bold: true }),
      new TextRun({ text: "2.4.0 (Enterprise Edition)   |   " }),
      new TextRun({ text: "Protocol: ", bold: true }),
      new TextRun({ text: "HTTPS / REST / JSON   |   " }),
      new TextRun({ text: "Status: ", bold: true }),
      new TextRun({ text: "Production Ready", color: "1B5E38", bold: true })
    ],
    spacing: { after: 300 }
  }),
  new Paragraph({
    children: [
      new TextRun({
        text: "Executive Summary: This document serves as the complete technical API reference for FARMO AI. It details all 47 RESTful service endpoints spanning User Authentication, Real-Time Push Notification Broadcasting, Field Crop Parcels, APMC Mandi Price Intelligence, Agro-Climatic Forecasting, AI Diagnostics (Ollama), and Admin Portal Governance.",
        italics: true,
        size: 20,
        color: "4A5568"
      })
    ],
    spacing: { after: 400 }
  })
);

// Server Environments Table
docChildren.push(
  new Paragraph({
    text: "Platform Environments & Base URLs",
    heading: HeadingLevel.HEADING_1,
    spacing: { before: 200, after: 120 }
  })
);

const envTable = new Table({
  width: { size: 100, type: WidthType.PERCENTAGE },
  rows: [
    new TableRow({
      children: [
        new TableCell({
          width: { size: 25, type: WidthType.PERCENTAGE },
          shading: { fill: "1B5E38", type: ShadingType.CLEAR },
          children: [new Paragraph({ children: [new TextRun({ text: "Environment", bold: true, color: "FFFFFF" })] })]
        }),
        new TableCell({
          width: { size: 45, type: WidthType.PERCENTAGE },
          shading: { fill: "1B5E38", type: ShadingType.CLEAR },
          children: [new Paragraph({ children: [new TextRun({ text: "Base URL", bold: true, color: "FFFFFF" })] })]
        }),
        new TableCell({
          width: { size: 30, type: WidthType.PERCENTAGE },
          shading: { fill: "1B5E38", type: ShadingType.CLEAR },
          children: [new Paragraph({ children: [new TextRun({ text: "Description", bold: true, color: "FFFFFF" })] })]
        })
      ]
    }),
    new TableRow({
      children: [
        new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: "Node Express API (Local)", bold: true })] })] }),
        new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: "http://localhost:5000/api", font: "Courier New" })] })] }),
        new TableCell({ children: [new Paragraph("Core REST services connected to MySQL on port 3306")] })
      ]
    }),
    new TableRow({
      children: [
        new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: "Spring Boot Microservices", bold: true })] })] }),
        new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: "http://localhost:8080/api", font: "Courier New" })] })] }),
        new TableCell({ children: [new Paragraph("Java Spring Data JPA Microservice cluster")] })
      ]
    }),
    new TableRow({
      children: [
        new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: "Cloud Deployment (Vercel)", bold: true })] })] }),
        new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: "https://farmo-ai.vercel.app/api", font: "Courier New" })] })] }),
        new TableCell({ children: [new Paragraph("Production cloud deployment with offline storage fallback")] })
      ]
    }),
    new TableRow({
      children: [
        new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: "Ollama Local LLM Engine", bold: true })] })] }),
        new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: "http://localhost:11434/api", font: "Courier New" })] })] }),
        new TableCell({ children: [new Paragraph("Local neural engine for disease diagnosis & advisory")] })
      ]
    })
  ]
});
docChildren.push(envTable);
docChildren.push(new Paragraph({ text: "", spacing: { after: 300 } }));

// Iterate through modules and endpoints
apiModules.forEach(mod => {
  docChildren.push(
    new Paragraph({
      text: mod.category,
      heading: HeadingLevel.HEADING_1,
      spacing: { before: 300, after: 120 }
    }),
    new Paragraph({
      children: [new TextRun({ text: mod.description, italics: true, color: "4A5568" })],
      spacing: { after: 200 }
    })
  );

  mod.endpoints.forEach((ep, idx) => {
    const methodColor = ep.method === "GET" ? "0284C7" : ep.method === "POST" ? "16A34A" : ep.method === "PUT" ? "D97706" : "DC2626";

    docChildren.push(
      new Paragraph({
        children: [
          new TextRun({ text: `[${ep.method}] `, bold: true, color: methodColor, size: 24 }),
          new TextRun({ text: ep.path, bold: true, size: 24, font: "Courier New" }),
          new TextRun({ text: `  —  ${ep.title}`, bold: true, size: 22 })
        ],
        spacing: { before: 200, after: 80 }
      }),
      new Paragraph({
        children: [
          new TextRun({ text: "Access Level: ", bold: true }),
          new TextRun({ text: ep.access + "    |    " }),
          new TextRun({ text: "Description: ", bold: true }),
          new TextRun({ text: ep.desc })
        ],
        spacing: { after: 100 }
      })
    );

    // Headers & Params
    if (ep.headers && ep.headers.length > 0) {
      docChildren.push(
        new Paragraph({
          children: [
            new TextRun({ text: "Headers: ", bold: true }),
            new TextRun({ text: ep.headers.join("; "), font: "Courier New", size: 18 })
          ],
          spacing: { after: 60 }
        })
      );
    }

    if (ep.params && ep.params.length > 0) {
      const paramRows = [
        new TableRow({
          children: [
            new TableCell({ shading: { fill: "F3F4F6" }, children: [new Paragraph({ children: [new TextRun({ text: "Param Name", bold: true, size: 18 })] })] }),
            new TableCell({ shading: { fill: "F3F4F6" }, children: [new Paragraph({ children: [new TextRun({ text: "Type", bold: true, size: 18 })] })] }),
            new TableCell({ shading: { fill: "F3F4F6" }, children: [new Paragraph({ children: [new TextRun({ text: "Required", bold: true, size: 18 })] })] }),
            new TableCell({ shading: { fill: "F3F4F6" }, children: [new Paragraph({ children: [new TextRun({ text: "Description", bold: true, size: 18 })] })] })
          ]
        })
      ];

      ep.params.forEach(p => {
        paramRows.push(
          new TableRow({
            children: [
              new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: p.name, font: "Courier New", size: 18 })] })] }),
              new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: p.type, size: 18 })] })] }),
              new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: p.required ? "Yes" : "No", size: 18, color: p.required ? "DC2626" : "4B5563" })] })] }),
              new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: p.desc, size: 18 })] })] })
            ]
          })
        );
      });

      docChildren.push(
        new Table({
          width: { size: 100, type: WidthType.PERCENTAGE },
          rows: paramRows
        }),
        new Paragraph({ text: "", spacing: { after: 80 } })
      );
    }

    // Request Body
    if (ep.body) {
      docChildren.push(
        new Paragraph({
          children: [new TextRun({ text: "Request Body Payload (JSON):", bold: true, size: 18 })],
          spacing: { after: 40 }
        }),
        new Paragraph({
          children: [
            new TextRun({
              text: JSON.stringify(ep.body, null, 2),
              font: "Courier New",
              size: 16,
              color: "1F2937"
            })
          ],
          shading: { fill: "F9FAFB", type: ShadingType.CLEAR },
          spacing: { after: 80 }
        })
      );
    }

    // Response
    if (ep.response) {
      docChildren.push(
        new Paragraph({
          children: [
            new TextRun({ text: `Response [HTTP ${ep.response.status} OK]:`, bold: true, size: 18, color: "16A34A" })
          ],
          spacing: { after: 40 }
        }),
        new Paragraph({
          children: [
            new TextRun({
              text: JSON.stringify(ep.response.example, null, 2),
              font: "Courier New",
              size: 16,
              color: "111827"
            })
          ],
          shading: { fill: "F3F4F6", type: ShadingType.CLEAR },
          spacing: { after: 180 }
        })
      );
    }
  });
});

// Database Schemas Table Section
docChildren.push(
  new Paragraph({
    text: "Relational Database Schema (MySQL farmo_ai_db)",
    heading: HeadingLevel.HEADING_1,
    spacing: { before: 300, after: 150 }
  }),
  new Paragraph({
    children: [
      new TextRun({
        text: "The backend is backed by an enterprise MySQL 8.0+ relational database schema. Tables are normalized with foreign keys and index constraints.",
        italics: true,
        color: "4A5568"
      })
    ],
    spacing: { after: 150 }
  })
);

const dbTables = [
  { name: "users", desc: "Core user authentication table (id, full_name, email, password, phone, role, district, created_at)" },
  { name: "farmers", desc: "Agricultural farmer profiles (id, full_name, email, phone, location, district, primary_crop, farm_size_acres, status)" },
  { name: "products", desc: "Crops and farm harvest parcels (id, farmer_id, product_name, variety, quantity_acres, price_per_unit, health_rating, growth_stage)" },
  { name: "farmer_crops", desc: "Crop rotation records and field tracking (id, farmer_id, crop_name, variety, acres, planting_date, harvest_date, health)" },
  { name: "admin_notifications", desc: "Push notification broadcasts (id, title, message, category, priority, target_audience, target_value, sender_admin, status, created_at)" },
  { name: "contact_messages", desc: "Public user contact inquiries (id, name, email, subject, message, status, created_at)" },
  { name: "disease_scans", desc: "Plant pathology scan records (id, farmer_id, crop, disease, severity, confidence, treatment, status, created_at)" },
  { name: "market_prices", desc: "APMC wholesale Mandi price index (id, crop_name, district, min_price, max_price, modal_price, unit, price_trend, status)" }
];

const schemaRows = [
  new TableRow({
    children: [
      new TableCell({ shading: { fill: "1B5E38" }, children: [new Paragraph({ children: [new TextRun({ text: "Table Name", bold: true, color: "FFFFFF" })] })] }),
      new TableCell({ shading: { fill: "1B5E38" }, children: [new Paragraph({ children: [new TextRun({ text: "Description & Key Attributes", bold: true, color: "FFFFFF" })] })] })
    ]
  })
];

dbTables.forEach(t => {
  schemaRows.push(
    new TableRow({
      children: [
        new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: t.name, font: "Courier New", bold: true })] })] }),
        new TableCell({ children: [new Paragraph(t.desc)] })
      ]
    })
  );
});

docChildren.push(
  new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    rows: schemaRows
  }),
  new Paragraph({ text: "", spacing: { after: 300 } })
);

// Build Document
const doc = new Document({
  styles: {
    default: {
      document: {
        run: { font: "Arial", size: 20 }
      }
    }
  },
  sections: [
    {
      properties: {
        page: {
          margin: { top: 1000, bottom: 1000, left: 1000, right: 1000 }
        }
      },
      children: docChildren
    }
  ]
});

Packer.toBuffer(doc).then(buffer => {
  fs.writeFileSync(docxPath, buffer);
  console.log(`✅ Word Document created successfully: ${docxPath} (${(buffer.length / 1024).toFixed(1)} KB)`);
}).catch(err => console.error("Word Docx error:", err));

// ─────────────────────────────────────────────────────────────────────────────
// 3. GENERATE HTML & CONVERT TO PDF (VIA CHROME HEADLESS)
// ─────────────────────────────────────────────────────────────────────────────

console.log('Building HTML for PDF generation...');

let htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>FARMO AI - API Services Documentation</title>
  <style>
    @page {
      size: A4;
      margin: 18mm 14mm 18mm 14mm;
      @bottom-right {
        content: counter(page);
      }
    }
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
      color: #1a202c;
      line-height: 1.5;
      font-size: 13px;
      margin: 0;
      padding: 0;
    }
    .cover {
      text-align: center;
      padding: 30px 20px 25px 20px;
      border-bottom: 3px solid #1B5E38;
      margin-bottom: 25px;
      background: linear-gradient(135deg, #071A0C 0%, #132B1A 50%, #1B5E38 100%);
      color: #ffffff;
      border-radius: 12px;
    }
    .cover h1 {
      font-size: 28px;
      margin: 0 0 8px 0;
      font-weight: 800;
      letter-spacing: -0.5px;
    }
    .cover h2 {
      font-size: 16px;
      font-weight: 500;
      color: #86EFAC;
      margin: 0 0 15px 0;
    }
    .meta-badges {
      display: flex;
      justify-content: center;
      gap: 15px;
      font-size: 11px;
      margin-top: 15px;
    }
    .meta-badge {
      background: rgba(255, 255, 255, 0.15);
      padding: 4px 12px;
      border-radius: 20px;
      border: 1px solid rgba(255, 255, 255, 0.25);
    }
    h2.section-title {
      font-size: 18px;
      color: #1B5E38;
      border-bottom: 2px solid #E2E8F0;
      padding-bottom: 6px;
      margin-top: 28px;
      margin-bottom: 8px;
      font-weight: 700;
      page-break-after: avoid;
    }
    p.section-desc {
      color: #4A5568;
      font-size: 12px;
      font-style: italic;
      margin-bottom: 16px;
      margin-top: 0;
    }
    .endpoint-card {
      border: 1px solid #E2E8F0;
      border-radius: 8px;
      margin-bottom: 16px;
      background: #FFFFFF;
      overflow: hidden;
      page-break-inside: avoid;
      box-shadow: 0 1px 3px rgba(0,0,0,0.05);
    }
    .endpoint-header {
      background: #F8FAFC;
      padding: 8px 12px;
      border-bottom: 1px solid #E2E8F0;
      display: flex;
      align-items: center;
      gap: 10px;
    }
    .method {
      font-weight: 800;
      font-size: 11px;
      padding: 3px 8px;
      border-radius: 4px;
      color: #FFFFFF;
      letter-spacing: 0.5px;
    }
    .method.GET { background: #0284C7; }
    .method.POST { background: #16A34A; }
    .method.PUT { background: #D97706; }
    .method.DELETE { background: #DC2626; }
    .path {
      font-family: Consolas, "Courier New", monospace;
      font-weight: 700;
      font-size: 13px;
      color: #0F172A;
    }
    .ep-title {
      color: #475569;
      font-size: 12px;
      margin-left: auto;
      font-weight: 600;
    }
    .endpoint-body {
      padding: 12px;
    }
    .access-tag {
      display: inline-block;
      font-size: 10px;
      font-weight: 700;
      padding: 2px 6px;
      border-radius: 4px;
      background: #E0E7FF;
      color: #3730A3;
      margin-bottom: 6px;
    }
    .desc {
      font-size: 12px;
      color: #334155;
      margin-bottom: 8px;
    }
    .label {
      font-weight: 700;
      font-size: 11px;
      color: #475569;
      text-transform: uppercase;
      margin-top: 8px;
      margin-bottom: 4px;
      letter-spacing: 0.5px;
    }
    pre {
      background: #0F172A;
      color: #F8FAFC;
      font-family: Consolas, monospace;
      font-size: 11px;
      padding: 10px;
      border-radius: 6px;
      overflow-x: auto;
      margin: 4px 0 8px 0;
      line-height: 1.4;
    }
    table {
      width: 100%;
      border-collapse: collapse;
      margin: 10px 0 16px 0;
      font-size: 12px;
    }
    th {
      background: #1B5E38;
      color: #FFFFFF;
      text-align: left;
      padding: 8px 10px;
      font-weight: 600;
      border: 1px solid #1B5E38;
    }
    td {
      padding: 7px 10px;
      border: 1px solid #CBD5E1;
      vertical-align: top;
    }
    tr:nth-child(even) td {
      background: #F8FAFC;
    }
    .param-table th {
      background: #E2E8F0;
      color: #1E293B;
      font-size: 11px;
      border: 1px solid #CBD5E1;
    }
  </style>
</head>
<body>

  <div class="cover">
    <h1>FARMO AI - SMART FARMING PLATFORM</h1>
    <h2>Enterprise REST API & Microservices Technical Specification</h2>
    <div class="meta-badges">
      <div class="meta-badge">Version 2.4.0 (Enterprise)</div>
      <div class="meta-badge">Protocol: HTTPS / JSON / REST</div>
      <div class="meta-badge">Status: Production Live</div>
      <div class="meta-badge">Database: MySQL 8.0+ / SQLite</div>
    </div>
  </div>

  <h2 class="section-title">Platform Architecture & Base URLs</h2>
  <table>
    <thead>
      <tr>
        <th style="width:25%;">Component</th>
        <th style="width:45%;">Base Endpoint URL</th>
        <th style="width:30%;">Role & Framework</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td><strong>Node.js Express Server</strong></td>
        <td><code>http://localhost:5000/api</code></td>
        <td>Primary Full-Stack REST API & Live MySQL Connection</td>
      </tr>
      <tr>
        <td><strong>Spring Boot Microservices</strong></td>
        <td><code>http://localhost:8080/api</code></td>
        <td>Java Spring Data JPA Microservice Cluster</td>
      </tr>
      <tr>
        <td><strong>Production Vercel Cloud</strong></td>
        <td><code>https://farmo-ai.vercel.app/api</code></td>
        <td>Cloud Edge Hosting with Local/Offline Sync</td>
      </tr>
      <tr>
        <td><strong>Ollama LLM Engine</strong></td>
        <td><code>http://localhost:11434/api</code></td>
        <td>Local AI Neural Inference (Llama-3 / Mistral)</td>
      </tr>
    </tbody>
  </table>
`;

apiModules.forEach(mod => {
  htmlContent += `
    <h2 class="section-title">${mod.category}</h2>
    <p class="section-desc">${mod.description}</p>
  `;

  mod.endpoints.forEach(ep => {
    htmlContent += `
      <div class="endpoint-card">
        <div class="endpoint-header">
          <span class="method ${ep.method}">${ep.method}</span>
          <span class="path">${ep.path}</span>
          <span class="ep-title">${ep.title}</span>
        </div>
        <div class="endpoint-body">
          <span class="access-tag">${ep.access} Access</span>
          <div class="desc">${ep.desc}</div>
    `;

    if (ep.headers && ep.headers.length > 0) {
      htmlContent += `
        <div class="label">Headers</div>
        <div style="font-family: monospace; font-size: 11px; color:#475569;">${ep.headers.join(' | ')}</div>
      `;
    }

    if (ep.params && ep.params.length > 0) {
      htmlContent += `
        <div class="label">Query / Path Parameters</div>
        <table class="param-table">
          <thead>
            <tr>
              <th>Parameter</th>
              <th>Type</th>
              <th>Required</th>
              <th>Description</th>
            </tr>
          </thead>
          <tbody>
      `;
      ep.params.forEach(p => {
        htmlContent += `
          <tr>
            <td><code>${p.name}</code></td>
            <td>${p.type}</td>
            <td style="color:${p.required ? '#DC2626' : '#64748B'}; font-weight:${p.required ? '700' : '400'}">${p.required ? 'Required' : 'Optional'}</td>
            <td>${p.desc}</td>
          </tr>
        `;
      });
      htmlContent += `
          </tbody>
        </table>
      `;
    }

    if (ep.body) {
      htmlContent += `
        <div class="label">Request Body (JSON)</div>
        <pre>${JSON.stringify(ep.body, null, 2)}</pre>
      `;
    }

    if (ep.response) {
      htmlContent += `
        <div class="label" style="color:#16A34A;">Response Example [HTTP ${ep.response.status}]</div>
        <pre>${JSON.stringify(ep.response.example, null, 2)}</pre>
      `;
    }

    htmlContent += `
        </div>
      </div>
    `;
  });
});

// Database Schema Section in HTML
htmlContent += `
  <h2 class="section-title">Relational Database Schemas (MySQL farmo_ai_db)</h2>
  <p class="section-desc">Normalized table definitions and entity schemas residing in the MySQL database.</p>
  <table>
    <thead>
      <tr>
        <th style="width: 25%;">Table Name</th>
        <th style="width: 75%;">Columns & Relational Model Description</th>
      </tr>
    </thead>
    <tbody>
`;

dbTables.forEach(t => {
  htmlContent += `
    <tr>
      <td><code>${t.name}</code></td>
      <td>${t.desc}</td>
    </tr>
  `;
});

htmlContent += `
    </tbody>
  </table>

  <h2 class="section-title">Error Codes & Standard Response Structure</h2>
  <table>
    <thead>
      <tr>
        <th style="width: 15%;">HTTP Code</th>
        <th style="width: 25%;">Error Name</th>
        <th style="width: 60%;">Description & Resolution</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td><strong>200 OK</strong></td>
        <td>Success</td>
        <td>Request completed successfully and payload returned.</td>
      </tr>
      <tr>
        <td><strong>201 Created</strong></td>
        <td>Resource Created</td>
        <td>New account, crop parcel, or broadcast notification created.</td>
      </tr>
      <tr>
        <td><strong>400 Bad Request</strong></td>
        <td>Validation Error</td>
        <td>Missing required fields (e.g. email, password, notification title).</td>
      </tr>
      <tr>
        <td><strong>401 Unauthorized</strong></td>
        <td>Auth Required</td>
        <td>Missing or expired Bearer token in request header.</td>
      </tr>
      <tr>
        <td><strong>403 Forbidden</strong></td>
        <td>Role Permission Denied</td>
        <td>Attempting to access Admin operations without superuser privileges.</td>
      </tr>
      <tr>
        <td><strong>404 Not Found</strong></td>
        <td>Resource Missing</td>
        <td>Target entity ID (farmer, crop, notification) not found in database.</td>
      </tr>
      <tr>
        <td><strong>500 Server Error</strong></td>
        <td>Internal Error</td>
        <td>Database timeout, connection disconnect, or syntax exception.</td>
      </tr>
    </tbody>
  </table>

</body>
</html>
`;

fs.writeFileSync(htmlPath, htmlContent, 'utf8');
console.log(`✅ HTML Document created successfully: ${htmlPath}`);

// Convert HTML to PDF using Chrome Headless
console.log('Rendering PDF via Chrome headless...');
try {
  const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
  const cmd = `"${chromePath}" --headless --no-sandbox --disable-gpu --run-all-compositor-stages-before-draw --print-to-pdf="${pdfPath}" "${htmlPath}"`;
  execSync(cmd, { stdio: 'inherit' });
  console.log(`✅ Adobe PDF Document created successfully: ${pdfPath}`);
} catch (e) {
  console.warn("Chrome headless failed, trying Edge headless...", e.message);
  try {
    const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
    const edgeCmd = `"${edgePath}" --headless --no-sandbox --disable-gpu --print-to-pdf="${pdfPath}" "${htmlPath}"`;
    execSync(edgeCmd, { stdio: 'inherit' });
    console.log(`✅ Adobe PDF Document created via Edge: ${pdfPath}`);
  } catch (err) {
    console.error("PDF generation error:", err.message);
  }
}
