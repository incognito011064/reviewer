/* ============================================================================
   ICLIMATE SYSTEM EXPLORER — DATA SOURCE
   ----------------------------------------------------------------------------
   Everything the app renders comes from this one file. Replace the
   placeholder values below with your actual thesis system's real
   controllers, file paths, tables, and flows. Search for "⚠️ REPLACE"
   to find every spot that needs your real specifics before defense.
   ============================================================================ */

const ICLIMATE_DATA = {

  meta: {
    name: "iClimate",
    tagline: "Climate-Intelligent Rice Farming Decision Support System",
    location: "Lian, Batangas, Philippines",
    school: "Batangas State University — ARASOF Nasugbu Campus",
    description:
      "iClimate is a decision-support platform built for rice farmers and local agriculture offices in Lian, Batangas. It fuses live weather data, machine-learning forecasts, and community reporting into a single system so farmers can time planting, anticipate typhoons, and reduce crop loss — while MAO personnel and IT staff monitor, moderate, and maintain the platform.",
    stack: [
      { name: "Laravel", role: "Backend framework — routing, controllers, auth, business logic" },
      { name: "Blade + Tailwind CSS", role: "Server-rendered views and utility-first styling" },
      { name: "MySQL", role: "Primary relational database" },
      { name: "Python (Flask)", role: "Machine-learning microservice for weather prediction" },
      { name: "Leaflet.js", role: "Interactive maps for heatmaps and risk zones" },
      { name: "Open-Meteo API", role: "External real-time and forecast weather data" },
      { name: "Windy API", role: "Supplementary meteorological visualization data" },
      { name: "PAGASA advisories", role: "Official Philippine typhoon/weather bulletins" },
      { name: "Groq API", role: "LLM inference for the PalayPilot AI chat assistant" },
    ],
    keyFeatures: [
      "ML-driven weather prediction tailored to Lian's microclimate",
      "Automated planting advisories based on forecast + rice calendar",
      "Typhoon safety alerts and response guidance",
      "Heatmap visualization of climate risk across barangays",
      "AI chat assistant (PalayPilot) for farmer Q&A",
      "Community feed for farmer-to-farmer and farmer-to-MAO communication",
      "Full audit trail and system logging for accountability",
    ],
  },

  roles: [
    {
      id: "farmer",
      name: "Farmer",
      description:
        "The primary end-user. Farmers use iClimate to check forecasts, receive planting advisories, log their rice production, and get typhoon safety guidance for their specific barangay.",
      dashboardRoute: "/farmer/dashboard",
      sidebar: ["Dashboard", "Advisories", "Weather", "Calendar", "Community Feed", "AI Chat", "My Farm Profile", "Notifications"],
      functions: [
        { action: "View planting advisory", controller: "AdvisoryController@index", file: "app/Http/Controllers/Farmer/AdvisoryController.php" }, // ⚠️ REPLACE
        { action: "Check live weather", controller: "WeatherController@show", file: "app/Http/Controllers/WeatherController.php" }, // ⚠️ REPLACE
        { action: "Post to community feed", controller: "FeedController@store", file: "app/Http/Controllers/FeedController.php" }, // ⚠️ REPLACE
        { action: "Chat with PalayPilot", controller: "AiChatController@respond", file: "app/Http/Controllers/AiChatController.php" }, // ⚠️ REPLACE
        { action: "Update farm profile", controller: "FarmerProfileController@update", file: "app/Http/Controllers/FarmerProfileController.php" }, // ⚠️ REPLACE
      ],
      logic: {
        canDo: [
          "View forecasts and advisories scoped to their registered barangay",
          "Log rice production data per planting season",
          "Post questions or reports to the community feed",
          "Chat with the AI assistant for farming guidance",
        ],
        dataAccess: [
          "Their own farm profile and production records",
          "Public advisories, weather data, and community posts",
          "Cannot view other farmers' private profile data",
        ],
        restrictions: [
          "Cannot access MAO or IT admin dashboards",
          "Cannot edit system-wide advisories or climate records",
          "Cannot view system logs or audit trails",
        ],
        interactsWith:
          "Farmers receive advisories authored or approved by MAO Personnel, and any technical issue they report can surface in IT Expert's system logs.",
        realBehavior:
          "On login, middleware checks role = farmer and redirects to /farmer/dashboard. The dashboard pulls the latest advisory scoped to the farmer's barangay_id, and a scheduled command refreshes that advisory nightly from the ML prediction pipeline.", // ⚠️ REPLACE with your actual middleware/route names
      },
    },
    {
      id: "mao",
      name: "MAO Personnel",
      description:
        "Municipal Agriculture Office staff. They review ML-generated advisories before publishing, moderate the community feed, manage farmer records, and issue typhoon safety bulletins.",
      dashboardRoute: "/mao/dashboard",
      sidebar: ["Dashboard", "Advisories (Review)", "Farmer Records", "Reports", "Heatmap", "Community Moderation", "Typhoon Alerts", "Climate Records"],
      functions: [
        { action: "Approve/edit advisory", controller: "AdvisoryController@approve", file: "app/Http/Controllers/Mao/AdvisoryController.php" }, // ⚠️ REPLACE
        { action: "Moderate feed post", controller: "FeedModerationController@destroy", file: "app/Http/Controllers/Mao/FeedModerationController.php" }, // ⚠️ REPLACE
        { action: "Generate report", controller: "ReportController@export", file: "app/Http/Controllers/Mao/ReportController.php" }, // ⚠️ REPLACE
        { action: "View heatmap", controller: "HeatmapController@index", file: "app/Http/Controllers/Mao/HeatmapController.php" }, // ⚠️ REPLACE
        { action: "Issue typhoon alert", controller: "TyphoonAlertController@store", file: "app/Http/Controllers/Mao/TyphoonAlertController.php" }, // ⚠️ REPLACE
      ],
      logic: {
        canDo: [
          "Review, edit, and approve ML-generated planting advisories before farmers see them",
          "Moderate community feed posts (hide/remove)",
          "Generate rice production and climate reports",
          "Issue manual typhoon safety alerts",
        ],
        dataAccess: [
          "All farmer profiles and production records within their municipality",
          "Full climate records and heatmap risk data",
          "Community feed moderation queue",
        ],
        restrictions: [
          "Cannot modify system configuration, user roles, or server-level settings",
          "Cannot access raw system logs (IT Expert only)",
        ],
        interactsWith:
          "MAO approves the ML output before it reaches Farmers, and escalates platform bugs or anomalies to the IT Expert.",
        realBehavior:
          "Advisories are generated nightly in draft status by the automation pipeline; MAO's dashboard queries WHERE status = 'pending_review', and approving one flips it to 'published', which farmer dashboards then query.", // ⚠️ REPLACE
      },
    },
    {
      id: "it",
      name: "IT Expert",
      description:
        "System administrator. Manages users, monitors system logs and audit trails, oversees automation jobs, and maintains the ML pipeline and API integrations.",
      dashboardRoute: "/admin/dashboard",
      sidebar: ["Dashboard", "User Management", "System Logs", "Automation Jobs", "Model Evaluation", "API Health", "Database Tools"],
      functions: [
        { action: "Manage user accounts", controller: "UserController@index", file: "app/Http/Controllers/Admin/UserController.php" }, // ⚠️ REPLACE
        { action: "View system logs", controller: "SystemLogController@index", file: "app/Http/Controllers/Admin/SystemLogController.php" }, // ⚠️ REPLACE
        { action: "Trigger automation manually", controller: "AutomationController@run", file: "app/Http/Controllers/Admin/AutomationController.php" }, // ⚠️ REPLACE
        { action: "Review model evaluation", controller: "ModelEvaluationController@index", file: "app/Http/Controllers/Admin/ModelEvaluationController.php" }, // ⚠️ REPLACE
      ],
      logic: {
        canDo: [
          "Create, suspend, or delete user accounts across all roles",
          "View full system logs and audit trail entries",
          "Manually trigger or reschedule automation console commands",
          "Monitor ML model accuracy and API uptime",
        ],
        dataAccess: [
          "Full read access to every table in the system",
          "Server-level logs, queue jobs, and scheduled task history",
        ],
        restrictions: [
          "Not typically involved in day-to-day advisory content — that's MAO's domain",
          "Follows audit-trail logging like every other role; admin actions are also logged",
        ],
        interactsWith:
          "IT Expert supports both Farmers and MAO by keeping the ML pipeline, APIs, and infrastructure running, and investigates issues either role reports.",
        realBehavior:
          "The audit trail is written via a model observer attached to key Eloquent models, so every create/update/delete across the system is captured automatically without each controller needing to log manually.", // ⚠️ REPLACE
      },
    },
  ],

  modules: [
    {
      id: 1,
      name: "Planting Advisories",
      what: "Generates and displays recommendations on when and what to plant, based on forecasted weather and the rice growing calendar.",
      how: "A scheduled job pulls the latest ML forecast, cross-references it against planting-window rules for the local rice variety, and drafts an advisory. MAO reviews and publishes it; farmers see the published version scoped to their barangay.",
      dataSource: {
        apis: ["Open-Meteo (forecast input)", "Internal Flask ML API (risk classification)"],
        tables: ["advisories", "barangays", "rice_varieties"], // ⚠️ REPLACE
        services: ["AdvisoryGenerationService (Laravel)", "forecast_model.py (Python)"], // ⚠️ REPLACE
      },
      flow: ["Scheduled Job", "AdvisoryGenerationService", "Flask ML API", "advisories table", "MAO Review", "Farmer Dashboard"],
      stack: ["Laravel", "Python/Flask", "MySQL"],
      components: {
        controllers: ["AdvisoryController.php"],
        models: ["Advisory.php"],
        services: ["AdvisoryGenerationService.php"],
        views: ["resources/views/farmer/advisories/index.blade.php", "resources/views/mao/advisories/review.blade.php"], // ⚠️ REPLACE
      },
      advanced:
        "The advisory rules encode a lookup table of safe planting windows per rice variety against predicted rainfall bands. This keeps the ML model focused on pure weather prediction, while agronomic rules (which are easier to audit and defend) stay in application code rather than inside the model.", // ⚠️ REPLACE
    },
    {
      id: 2,
      name: "Weather Prediction & Machine Learning",
      what: "Predicts short and medium-term weather conditions specific to Lian, Batangas using a trained ML model.",
      how: "Historical climate records and live Open-Meteo data are fed into a trained regression/classification model (e.g. Random Forest or LSTM) hosted in a Python Flask microservice. Laravel calls this service and stores the output.",
      dataSource: {
        apis: ["Open-Meteo API", "Windy API"],
        tables: ["climate_records", "predictions"], // ⚠️ REPLACE
        services: ["WeatherPredictionService (Laravel)", "predict.py (Flask endpoint)"], // ⚠️ REPLACE
      },
      flow: ["Cron Trigger", "WeatherPredictionService", "Open-Meteo API", "Flask /predict endpoint", "ML Model", "predictions table", "Dashboard"],
      stack: ["Python", "Flask", "scikit-learn / TensorFlow", "Laravel", "MySQL"],
      components: {
        controllers: ["WeatherController.php"],
        models: ["Prediction.php", "ClimateRecord.php"],
        services: ["WeatherPredictionService.php"],
        views: ["resources/views/farmer/weather/index.blade.php"], // ⚠️ REPLACE
      },
      advanced:
        "The Flask service is intentionally decoupled from Laravel so the ML model can be retrained or swapped without redeploying the main application — Laravel only depends on a stable JSON contract from the /predict endpoint.", // ⚠️ REPLACE
    },
    {
      id: 3,
      name: "Live Forecasting",
      what: "Shows near-real-time weather conditions (temperature, rainfall, wind) rather than the longer-range ML forecast.",
      how: "A lightweight controller calls Open-Meteo's current-conditions endpoint directly on page load (or via a short cache) and renders it, separate from the heavier ML pipeline used for advisories.",
      dataSource: {
        apis: ["Open-Meteo API (current conditions)"],
        tables: ["weather_cache"], // ⚠️ REPLACE
        services: ["LiveWeatherService (Laravel)"], // ⚠️ REPLACE
      },
      flow: ["Dashboard Load", "LiveWeatherController", "LiveWeatherService", "Open-Meteo API", "Cache (short TTL)", "UI Widget"],
      stack: ["Laravel", "Open-Meteo API"],
      components: {
        controllers: ["LiveWeatherController.php"],
        models: ["WeatherCache.php"],
        services: ["LiveWeatherService.php"],
        views: ["resources/views/partials/live-weather-widget.blade.php"], // ⚠️ REPLACE
      },
      advanced:
        "Because current-conditions data changes fast but doesn't need ML processing, this path bypasses the Flask service entirely and uses a short-lived cache to avoid hammering the external API on every page load.", // ⚠️ REPLACE
    },
    {
      id: 4,
      name: "Model Evaluation",
      what: "Tracks how accurate the ML weather model has been over time, for both transparency and thesis defense purposes.",
      how: "Predicted values are compared against actual recorded outcomes once they're available, and metrics (MAE, RMSE, accuracy) are computed and stored for IT Expert review.",
      dataSource: {
        apis: ["Internal Flask evaluation endpoint"],
        tables: ["predictions", "climate_records", "model_evaluations"], // ⚠️ REPLACE
        services: ["ModelEvaluationService (Laravel)", "evaluate.py (Python)"], // ⚠️ REPLACE
      },
      flow: ["Scheduled Job", "ModelEvaluationService", "Compare predictions vs actuals", "Flask evaluate.py", "model_evaluations table", "Admin Dashboard"],
      stack: ["Python", "Laravel", "MySQL"],
      components: {
        controllers: ["ModelEvaluationController.php"],
        models: ["ModelEvaluation.php"],
        services: ["ModelEvaluationService.php"],
        views: ["resources/views/admin/model-evaluation/index.blade.php"], // ⚠️ REPLACE
      },
      advanced:
        "This module exists specifically to answer the thesis-defense question 'how do you know your model works?' — it gives a quantitative, versioned record of predicted-vs-actual performance rather than a one-time claim.", // ⚠️ REPLACE
    },
    {
      id: 5,
      name: "Heatmap Risk Areas",
      what: "Visualizes which barangays in Lian face higher climate/crop risk on an interactive map.",
      how: "Risk scores per barangay (computed from recent predictions and climate records) are plotted on a Leaflet map with color-coded zones.",
      dataSource: {
        apis: ["Leaflet.js (rendering only, no external data)"],
        tables: ["barangays", "risk_scores"], // ⚠️ REPLACE
        services: ["RiskScoreService (Laravel)"], // ⚠️ REPLACE
      },
      flow: ["MAO opens Heatmap tab", "HeatmapController", "RiskScoreService", "risk_scores table", "GeoJSON response", "Leaflet render"],
      stack: ["Leaflet.js", "Laravel", "MySQL"],
      components: {
        controllers: ["HeatmapController.php"],
        models: ["RiskScore.php"],
        services: ["RiskScoreService.php"],
        views: ["resources/views/mao/heatmap/index.blade.php"], // ⚠️ REPLACE
      },
      advanced:
        "Barangay boundaries are stored as GeoJSON polygons; risk scores are joined to them server-side so the frontend only needs to render, not compute, keeping the map interaction smooth.", // ⚠️ REPLACE
    },
    {
      id: 6,
      name: "Community Feed",
      what: "A social feed where farmers post updates, questions, or field reports, and MAO can respond or moderate.",
      how: "Standard CRUD feed: farmers post, others can comment, MAO has moderation controls to hide inappropriate content.",
      dataSource: {
        apis: [],
        tables: ["feed_posts", "feed_comments"], // ⚠️ REPLACE
        services: ["FeedService (Laravel)"], // ⚠️ REPLACE
      },
      flow: ["Farmer submits post", "FeedController@store", "FeedService", "feed_posts table", "Feed Index (all farmers + MAO)"],
      stack: ["Laravel", "Blade", "MySQL"],
      components: {
        controllers: ["FeedController.php", "FeedModerationController.php"],
        models: ["FeedPost.php", "FeedComment.php"],
        services: ["FeedService.php"],
        views: ["resources/views/farmer/feed/index.blade.php"], // ⚠️ REPLACE
      },
      advanced:
        "Moderation uses a soft-delete flag rather than hard deletion, so MAO actions remain visible in the audit trail even after a post is hidden from public view.", // ⚠️ REPLACE
    },
    {
      id: 7,
      name: "Messaging",
      what: "Direct, private messaging between users — e.g. a farmer messaging MAO personnel directly.",
      how: "A simple threaded messaging system tied to user IDs, with read/unread state.",
      dataSource: {
        apis: [],
        tables: ["conversations", "messages"], // ⚠️ REPLACE
        services: ["MessagingService (Laravel)"], // ⚠️ REPLACE
      },
      flow: ["User opens Messages", "MessageController@index", "MessagingService", "messages table", "Thread UI"],
      stack: ["Laravel", "Blade", "MySQL"],
      components: {
        controllers: ["MessageController.php"],
        models: ["Conversation.php", "Message.php"],
        services: ["MessagingService.php"],
        views: ["resources/views/messages/thread.blade.php"], // ⚠️ REPLACE
      },
      advanced:
        "Conversations are modeled as a many-to-many pivot between users and conversations, so the same schema supports both 1:1 and future group threads without a migration.", // ⚠️ REPLACE
    },
    {
      id: 8,
      name: "AI Chat (PalayPilot)",
      what: "An AI chat assistant that answers farmers' questions about rice farming, weather, and the platform itself.",
      how: "Farmer messages are sent to Laravel, which forwards the conversation (plus relevant system context like the farmer's barangay advisory) to the Groq API for LLM inference, then returns the response.",
      dataSource: {
        apis: ["Groq API (LLM inference)"],
        tables: ["ai_chat_logs"], // ⚠️ REPLACE
        services: ["PalayPilotService (Laravel)"], // ⚠️ REPLACE
      },
      flow: ["Farmer sends message", "AiChatController@respond", "PalayPilotService", "Groq API", "ai_chat_logs table", "Chat UI"],
      stack: ["Laravel", "Groq API (LLM)"],
      components: {
        controllers: ["AiChatController.php"],
        models: ["AiChatLog.php"],
        services: ["PalayPilotService.php"],
        views: ["resources/views/farmer/ai-chat/index.blade.php"], // ⚠️ REPLACE
      },
      advanced:
        "System context (current advisory, weather snapshot) is injected into the prompt sent to Groq so PalayPilot's answers stay grounded in the farmer's actual local conditions rather than generic advice.", // ⚠️ REPLACE
    },
    {
      id: 9,
      name: "Typhoon Safety Response",
      what: "Delivers safety guidance and alerts when a typhoon is forecasted or an official PAGASA bulletin is issued.",
      how: "The system checks PAGASA advisory data (and/or MAO-issued manual alerts) and pushes a prioritized safety notification to affected farmers.",
      dataSource: {
        apis: ["PAGASA advisories (public bulletins)"],
        tables: ["typhoon_alerts"], // ⚠️ REPLACE
        services: ["TyphoonAlertService (Laravel)"], // ⚠️ REPLACE
      },
      flow: ["PAGASA bulletin detected / MAO issues alert", "TyphoonAlertController@store", "TyphoonAlertService", "typhoon_alerts table", "Notification dispatch", "Farmer alert banner"],
      stack: ["Laravel", "PAGASA data", "MySQL"],
      components: {
        controllers: ["TyphoonAlertController.php"],
        models: ["TyphoonAlert.php"],
        services: ["TyphoonAlertService.php"],
        views: ["resources/views/farmer/alerts/typhoon.blade.php"], // ⚠️ REPLACE
      },
      advanced:
        "Typhoon alerts are treated as the highest-priority notification type in the system, bypassing normal notification batching so they reach farmers immediately rather than in the nightly digest.", // ⚠️ REPLACE
    },
    {
      id: 10,
      name: "Calendar",
      what: "A rice-farming calendar showing planting windows, expected harvest dates, and upcoming advisories.",
      how: "Combines the farmer's logged planting date with rice-variety growth duration and advisory data to project key dates.",
      dataSource: {
        apis: [],
        tables: ["planting_logs", "rice_varieties"], // ⚠️ REPLACE
        services: ["CalendarService (Laravel)"], // ⚠️ REPLACE
      },
      flow: ["Farmer opens Calendar", "CalendarController@index", "CalendarService", "planting_logs + rice_varieties", "Calendar UI"],
      stack: ["Laravel", "MySQL"],
      components: {
        controllers: ["CalendarController.php"],
        models: ["PlantingLog.php"],
        services: ["CalendarService.php"],
        views: ["resources/views/farmer/calendar/index.blade.php"], // ⚠️ REPLACE
      },
      advanced:
        "Harvest date projection is derived, not stored — it's recalculated from planting_date + variety.growth_duration_days each time the calendar renders, so updating a variety's growth duration retroactively corrects all projections.", // ⚠️ REPLACE
    },
    {
      id: 11,
      name: "Reports",
      what: "Generates structured reports (e.g. rice production summaries, climate trend reports) for MAO.",
      how: "Aggregates data across production and climate tables into exportable PDF/Excel reports.",
      dataSource: {
        apis: [],
        tables: ["rice_production", "climate_records"], // ⚠️ REPLACE
        services: ["ReportService (Laravel)"], // ⚠️ REPLACE
      },
      flow: ["MAO requests report", "ReportController@export", "ReportService", "Aggregate query", "PDF/Excel generator", "Download"],
      stack: ["Laravel", "MySQL", "PDF/Excel export library"],
      components: {
        controllers: ["ReportController.php"],
        models: ["RiceProduction.php"],
        services: ["ReportService.php"],
        views: ["resources/views/mao/reports/index.blade.php"], // ⚠️ REPLACE
      },
      advanced:
        "Report generation is queued as a background job for larger date ranges so MAO isn't left waiting on a blocking HTTP request while thousands of rows are aggregated.", // ⚠️ REPLACE
    },
    {
      id: 12,
      name: "Climate Records",
      what: "The historical archive of climate data for Lian — the foundation both the ML model and reports are built on.",
      how: "Records are ingested from Open-Meteo on a schedule and stored permanently, distinct from the short-lived live-weather cache.",
      dataSource: {
        apis: ["Open-Meteo API (historical + daily ingestion)"],
        tables: ["climate_records"], // ⚠️ REPLACE
        services: ["ClimateRecordIngestionService (Laravel)"], // ⚠️ REPLACE
      },
      flow: ["Nightly cron", "ClimateRecordIngestionService", "Open-Meteo API", "climate_records table", "Available to ML + Reports"],
      stack: ["Laravel", "Open-Meteo API", "MySQL"],
      components: {
        controllers: ["ClimateRecordController.php"],
        models: ["ClimateRecord.php"],
        services: ["ClimateRecordIngestionService.php"],
        views: ["resources/views/admin/climate-records/index.blade.php"], // ⚠️ REPLACE
      },
      advanced:
        "This table is deliberately append-only — records are never overwritten, only added — because both model retraining and historical reporting depend on an untampered, complete time series.", // ⚠️ REPLACE
    },
    {
      id: 13,
      name: "Rice Production",
      what: "Farmers log their actual rice production (yield, area planted, variety used) per season.",
      how: "Simple CRUD form tied to the farmer's profile and planting log, later aggregated into reports.",
      dataSource: {
        apis: [],
        tables: ["rice_production", "farmer_profiles"], // ⚠️ REPLACE
        services: ["RiceProductionService (Laravel)"], // ⚠️ REPLACE
      },
      flow: ["Farmer submits yield data", "RiceProductionController@store", "RiceProductionService", "rice_production table", "Available to Reports"],
      stack: ["Laravel", "MySQL"],
      components: {
        controllers: ["RiceProductionController.php"],
        models: ["RiceProduction.php"],
        services: ["RiceProductionService.php"],
        views: ["resources/views/farmer/production/index.blade.php"], // ⚠️ REPLACE
      },
      advanced:
        "Yield data entered here becomes ground truth that model evaluation and future advisory rule tuning can be checked against, closing the loop between prediction and real outcomes.", // ⚠️ REPLACE
    },
    {
      id: 14,
      name: "Farmer Profiles",
      what: "Stores each farmer's identity, location (barangay), farm size, and contact details.",
      how: "Standard profile CRUD, referenced by nearly every other module to scope data correctly (e.g. advisories by barangay).",
      dataSource: {
        apis: [],
        tables: ["farmer_profiles", "barangays"], // ⚠️ REPLACE
        services: ["FarmerProfileService (Laravel)"], // ⚠️ REPLACE
      },
      flow: ["Farmer edits profile", "FarmerProfileController@update", "FarmerProfileService", "farmer_profiles table", "Used across system"],
      stack: ["Laravel", "MySQL"],
      components: {
        controllers: ["FarmerProfileController.php"],
        models: ["FarmerProfile.php"],
        services: ["FarmerProfileService.php"],
        views: ["resources/views/farmer/profile/edit.blade.php"], // ⚠️ REPLACE
      },
      advanced:
        "barangay_id on the farmer profile is the single foreign key that scopes advisories, alerts, and heatmap data to the correct location — it's the join point most other modules depend on.", // ⚠️ REPLACE
    },
    {
      id: 15,
      name: "Notification System",
      what: "Delivers in-app (and optionally SMS/email) notifications for advisories, alerts, and messages.",
      how: "A central notification service dispatches to different channels depending on priority — typhoon alerts bypass batching, routine advisories go out in a daily digest.",
      dataSource: {
        apis: [],
        tables: ["notifications"], // ⚠️ REPLACE
        services: ["NotificationService (Laravel, built on Laravel's native Notification system)"], // ⚠️ REPLACE
      },
      flow: ["Triggering event (advisory published / alert issued)", "NotificationService", "Channel selection", "notifications table", "UI bell / SMS / email"],
      stack: ["Laravel Notifications", "MySQL"],
      components: {
        controllers: ["NotificationController.php"],
        models: ["Notification.php"],
        services: ["NotificationService.php"],
        views: ["resources/views/partials/notification-bell.blade.php"], // ⚠️ REPLACE
      },
      advanced:
        "Built on Laravel's native notification channels abstraction, so adding a new delivery channel (e.g. push notifications) later doesn't require touching the modules that trigger notifications.", // ⚠️ REPLACE
    },
    {
      id: 16,
      name: "System Logs & Audit Trail",
      what: "Records who did what and when across the system, for accountability and debugging.",
      how: "A model observer hooks into create/update/delete events on key models and writes an immutable log entry for each.",
      dataSource: {
        apis: [],
        tables: ["audit_logs"], // ⚠️ REPLACE
        services: ["AuditLogService (Laravel)"], // ⚠️ REPLACE
      },
      flow: ["Any tracked model event", "Model Observer", "AuditLogService", "audit_logs table", "IT Expert dashboard"],
      stack: ["Laravel (Eloquent Observers)", "MySQL"],
      components: {
        controllers: ["SystemLogController.php"],
        models: ["AuditLog.php"],
        services: ["AuditLogService.php"],
        views: ["resources/views/admin/logs/index.blade.php"], // ⚠️ REPLACE
      },
      advanced:
        "Audit log entries are write-once — there is no update or delete endpoint for this table in the application layer — so the trail can't be edited after the fact, including by IT Expert accounts.", // ⚠️ REPLACE
    },
    {
      id: 17,
      name: "Automation (Console Commands)",
      what: "Scheduled background jobs that keep the system's data fresh without manual intervention.",
      how: "Laravel's task scheduler runs custom Artisan console commands on a cron-driven schedule (e.g. nightly climate ingestion, forecast refresh, advisory generation).",
      dataSource: {
        apis: ["Open-Meteo API", "Internal Flask ML API"],
        tables: ["climate_records", "predictions", "advisories"], // ⚠️ REPLACE
        services: ["Various services invoked by each command"],
      },
      flow: ["Laravel Scheduler (cron)", "Artisan Command", "Service", "External API / ML Model", "Database", "Output / Notification"],
      stack: ["Laravel Task Scheduling", "Python/Flask"],
      components: {
        controllers: ["N/A — invoked via console, not HTTP"],
        models: ["Varies per command"],
        services: ["Varies per command"],
        views: ["N/A"],
      },
      advanced:
        "Running ingestion, prediction, and advisory generation as separate scheduled commands (rather than one monolithic job) means a failure in one stage doesn't block the others, and each can be retried independently.", // ⚠️ REPLACE
    },
  ],

  database: {
    tables: [
      { name: "users", model: "User.php", purpose: "Core account records for all roles (farmer, MAO, IT expert)" }, // ⚠️ REPLACE
      { name: "farmer_profiles", model: "FarmerProfile.php", purpose: "Farmer identity, barangay, farm size, contact info" },
      { name: "barangays", model: "Barangay.php", purpose: "Reference table of barangays in Lian used to scope data geographically" },
      { name: "climate_records", model: "ClimateRecord.php", purpose: "Historical weather/climate data ingested from Open-Meteo" },
      { name: "predictions", model: "Prediction.php", purpose: "ML-generated weather predictions per period/location" },
      { name: "model_evaluations", model: "ModelEvaluation.php", purpose: "Accuracy metrics comparing predictions to actual outcomes" },
      { name: "advisories", model: "Advisory.php", purpose: "Planting advisories in draft/published states" },
      { name: "rice_varieties", model: "RiceVariety.php", purpose: "Reference data on rice varieties and growth durations" },
      { name: "planting_logs", model: "PlantingLog.php", purpose: "Farmer-logged planting dates per season" },
      { name: "rice_production", model: "RiceProduction.php", purpose: "Farmer-logged yield and production data" },
      { name: "risk_scores", model: "RiskScore.php", purpose: "Computed climate risk scores per barangay for the heatmap" },
      { name: "feed_posts", model: "FeedPost.php", purpose: "Community feed posts" },
      { name: "feed_comments", model: "FeedComment.php", purpose: "Comments on community feed posts" },
      { name: "conversations", model: "Conversation.php", purpose: "Private messaging threads" },
      { name: "messages", model: "Message.php", purpose: "Individual messages within a conversation" },
      { name: "ai_chat_logs", model: "AiChatLog.php", purpose: "PalayPilot conversation history" },
      { name: "typhoon_alerts", model: "TyphoonAlert.php", purpose: "Issued typhoon safety alerts" },
      { name: "notifications", model: "Notification.php", purpose: "Dispatched in-app/SMS/email notifications" },
      { name: "audit_logs", model: "AuditLog.php", purpose: "Immutable record of system actions for accountability" },
    ],
    relationships:
      "farmer_profiles belongs to barangays; advisories, risk_scores, and typhoon_alerts are all scoped by barangay_id, which is how the same advisory pipeline serves different content per location. predictions and climate_records feed both advisories (via AdvisoryGenerationService) and model_evaluations (by comparing predicted vs. later-recorded actuals). rice_production and planting_logs both belong to farmer_profiles and roll up into reports.", // ⚠️ REPLACE
  },

  automation: {
    commands: [
      { command: "php artisan climate:ingest", schedule: "Daily at 12:00 AM", purpose: "Pull the latest day's weather data from Open-Meteo into climate_records" }, // ⚠️ REPLACE
      { command: "php artisan weather:predict", schedule: "Daily at 1:00 AM", purpose: "Call the Flask ML API to generate fresh predictions from updated climate records" },
      { command: "php artisan advisory:generate", schedule: "Daily at 2:00 AM", purpose: "Draft new planting advisories from the latest predictions, awaiting MAO review" },
      { command: "php artisan model:evaluate", schedule: "Weekly, Sunday 3:00 AM", purpose: "Compare past predictions against recorded actuals and log accuracy metrics" },
      { command: "php artisan alerts:check-typhoon", schedule: "Every 30 minutes", purpose: "Poll for new PAGASA bulletins and auto-issue typhoon alerts when thresholds are met" },
      { command: "php artisan notifications:digest", schedule: "Daily at 6:00 AM", purpose: "Bundle routine (non-urgent) notifications into a single daily digest per farmer" },
    ],
    explanation:
      "Laravel's scheduler (app/Console/Kernel.php) fires each command at its configured time via a single system cron entry. Each command is thin — it resolves the relevant service from the container and delegates the actual work, so business logic stays testable outside of the console context.", // ⚠️ REPLACE
  },

  architecture: {
    layers: [
      { name: "Frontend", detail: "Blade templates styled with Tailwind CSS, rendered server-side; minimal vanilla JS for interactivity (Leaflet maps, chat widget, accordions)." },
      { name: "Backend", detail: "Laravel handles routing, authentication/authorization (role middleware), validation, and orchestrates calls to services." },
      { name: "Services layer", detail: "Business logic is extracted into service classes (e.g. AdvisoryGenerationService) so controllers stay thin and logic is reusable/testable." },
      { name: "Database", detail: "MySQL, accessed via Eloquent ORM; migrations define schema, model observers handle audit logging." },
      { name: "External APIs", detail: "Open-Meteo (weather), Windy API (supplementary visualization), PAGASA (official bulletins), Groq (LLM for PalayPilot)." },
      { name: "Python ML service", detail: "A separate Flask application exposing /predict and /evaluate endpoints, called over HTTP by Laravel services." },
    ],
    lifecycle:
      "A user request hits Laravel's router, passes through auth + role middleware, reaches a thin controller, which delegates to a service class. For weather-prediction features, that service makes an HTTP call to the Flask ML API, which runs the trained model and returns JSON. Laravel persists the result via Eloquent, then renders a Blade view (or returns JSON for JS-driven widgets like the heatmap) back to the user.", // ⚠️ REPLACE
    example: ["User", "Laravel (Controller → Service)", "Python Flask API", "ML Model", "JSON Response", "Laravel (persist + render)", "UI"],
  },
};