const { GoogleGenAI } = require("@google/genai");
const mongoose = require("mongoose");
const RagConversation = require("../models/RagConversation");

// Initialize Gemini Client
const getAI = () => new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

// ─── Schema Context for Gemini ──────────────────────────────────────────────
const SCHEMA_CONTEXT = `
You have access to a MongoDB database called "gym-management" with the following collections and schemas:

1. **users** — Gym members and admins
   Fields: _id (ObjectId), name (String), email (String), phone (String), role ("admin"|"student"), status ("pending"|"approved"), batch (String, e.g. "Morning 8AM", "Evening 5PM"), profilePicture (String), gender ("Male"|"Female"|"Others"), fatherName (String), dob (Date), age (Number), height (Number, cm), weight (Number, kg), fitnessGoals ([String], enum: "weight gain","weight loss","Body building","weight lifting","power lifting","boxing","silambam"), entryAmount (Number), bloodGroup (String), emergencyContact (String), isActive (Boolean), createdAt (Date), updatedAt (Date)

2. **workouts** — Workout assignments
   Fields: _id (ObjectId), assignedTo (ObjectId → users), batch (String), assignedBy (ObjectId → users), exercises ([{name: String, reps: Number, sets: Number}]), startDate (Date), endDate (Date), completionStatus (Number, 0-100), completedExercises ([String]), createdAt (Date), updatedAt (Date)

3. **attendances** — Daily attendance records
   Fields: _id (ObjectId), studentId (ObjectId → users), date (Date), status ("present"), createdAt (Date)

4. **metrics** — Body metrics tracking
   Fields: _id (ObjectId), studentId (ObjectId → users), weight (Number, kg), bmi (Number), date (Date), createdAt (Date)

5. **diets** — Diet/nutrition plans
   Fields: _id (ObjectId), studentId (ObjectId → users), calories (Number), protein (Number), carbs (Number), fat (Number), date (Date), createdAt (Date)

6. **announcements** — Admin announcements
   Fields: _id (ObjectId), title (String), message (String), target ("all"|"batch"|"individual"|"both"), batches ([String]), assignedTo ([ObjectId → users]), createdBy (ObjectId → users), createdAt (Date)

7. **exercises** — Exercise library
   Fields: _id (ObjectId), name (String), category (String)

8. **chatmessages** — AI chat history (student ↔ AI)
   Fields: _id (ObjectId), studentId (ObjectId → users), role ("user"|"model"), content (String), createdAt (Date)

9. **milestones** — Gym milestones/achievements
   Fields: _id (ObjectId), year (String), title (String), description (String), order (Number), createdBy (ObjectId → users)

10. **galleryimages** — Gallery photos
    Fields: _id (ObjectId), imageUrl (String), caption (String), order (Number), createdBy (ObjectId → users)

11. **testimonials** — Student testimonials
    Fields: _id (ObjectId), studentId (ObjectId → users), content (String), rating (Number)

IMPORTANT RULES:
- ObjectId fields that reference other collections can be used with $lookup for joins.
- The "role" field in users distinguishes admin vs student. Students have role="student".
- When filtering by student, always add {role: "student"} to the match stage.
- Date fields use JavaScript Date objects. Use ISODate format in queries.
- For "today", "this week", "this month" queries, calculate relative to the current date.
`;

// ─── Allowed collections (read-only) ────────────────────────────────────────
const ALLOWED_COLLECTIONS = [
  "users", "workouts", "attendances", "metrics", "diets",
  "announcements", "exercises", "chatmessages", "milestones",
  "galleryimages", "testimonials"
];

// ─── Restricted Topics (Semantic Guardrails) ────────────────────────────────
const RESTRICTED_TOPICS = [
  "secrets_and_credentials",
  "sensitive_file_extensions",
  "authentication_and_security",
  "infrastructure_and_devops",
  "database_sensitive_data",
  "personal_identifiable_information",
  "internal_business_data",
  "internal_apis_and_services",
  "logs_and_debug_data",
  "ai_ml_sensitive_assets",
  "folders_to_exclude"
];

/**
 * Step 1: Generate a MongoDB query from a natural language question
 */
async function generateMongoQuery(question, conversationContext = []) {
  const ai = getAI();

  const contextMessages = conversationContext.length > 0
    ? `\n\nRecent conversation context (use for follow-up questions):\n${conversationContext.map(c => `Q: ${c.question}\nA: ${c.answer}`).join("\n\n")}`
    : "";

  const prompt = `
${SCHEMA_CONTEXT}

Current date/time: ${new Date().toISOString()}
${contextMessages}

The admin user is asking the following question about their gym data:
"${question}"

SECURITY POLICY (SEMANTIC GUARDRAILS):
You MUST NOT process queries related to the following restricted topics:
${RESTRICTED_TOPICS.map(t => "- " + t).join("\n")}
If the user's question relates to ANY of these restricted topics (e.g. asking for passwords, server info, personal identifiable information like SSN or credit cards, etc.), you MUST immediately return:
{
  "collection": null,
  "operation": null,
  "pipeline": null,
  "directAnswer": "Security Policy Violation: Your request relates to restricted sensitive data and cannot be processed."
}

Your job is to convert this natural language question into a MongoDB query.

Respond STRICTLY in this JSON format with no markdown or extra text:
{
  "collection": "<collection_name>",
  "operation": "aggregate",
  "pipeline": [<aggregation pipeline stages>]
}

Rules:
- ONLY use "aggregate" as the operation — even for simple finds, use aggregate with $match.
- Use $lookup for joins between collections when needed.
- Use $project to return only relevant fields (exclude __v, passwords, etc.).
- For date comparisons, use { "$gte": "<ISO date string>" } format.
- Limit results to at most 20 documents unless the question asks for counts/aggregations.
- Add a final $limit stage of 20 for list queries.
- If the question asks for a count, use $count.
- If you cannot understand the question or it's not related to gym data, respond with:
  {"collection": null, "operation": null, "pipeline": null, "directAnswer": "<your helpful response>"}
`;

  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: prompt,
  });

  const responseText = response.text;

  try {
    const cleanedText = responseText.replace(/```json/gi, "").replace(/```/g, "").trim();
    return JSON.parse(cleanedText);
  } catch (e) {
    console.error("Failed to parse query generation response:", responseText);
    return {
      collection: null,
      operation: null,
      pipeline: null,
      directAnswer: "I couldn't formulate a query for your question. Let me try to answer directly."
    };
  }
}

/**
 * Step 2: Execute the generated query safely
 */
async function executeQuery(querySpec) {
  // If no collection, return null (will use direct answer)
  if (!querySpec.collection || !querySpec.pipeline) {
    return null;
  }

  // Safety: validate collection name
  const collectionName = querySpec.collection.toLowerCase();
  if (!ALLOWED_COLLECTIONS.includes(collectionName)) {
    throw new Error(`Access denied: collection "${collectionName}" is not allowed.`);
  }

  // Safety: check for write operations in pipeline
  const pipelineStr = JSON.stringify(querySpec.pipeline).toLowerCase();
  const dangerousOps = ["$out", "$merge", "$set", "$unset", "$rename", "deleteone", "deletemany", "insertone", "insertmany", "updateone", "updatemany", "drop", "remove"];
  for (const op of dangerousOps) {
    if (pipelineStr.includes(op)) {
      throw new Error(`Safety violation: write operation "${op}" detected. Only read operations are allowed.`);
    }
  }

  // Get the collection from the default connection
  const db = mongoose.connection.db;
  const collection = db.collection(collectionName);

  // Parse any date strings in the pipeline to actual Date objects
  const pipeline = parseDatesInPipeline(querySpec.pipeline);

  // Execute aggregation with a timeout
  const results = await collection.aggregate(pipeline, { maxTimeMS: 10000 }).toArray();

  return results;
}

/**
 * Recursively parse ISO date strings in pipeline to Date objects
 */
function parseDatesInPipeline(obj) {
  if (obj === null || obj === undefined) return obj;

  if (typeof obj === "string") {
    // Check if it looks like an ISO date
    if (/^\d{4}-\d{2}-\d{2}T/.test(obj)) {
      const d = new Date(obj);
      if (!isNaN(d.getTime())) return d;
    }
    return obj;
  }

  if (Array.isArray(obj)) {
    return obj.map(item => parseDatesInPipeline(item));
  }

  if (typeof obj === "object") {
    const result = {};
    for (const [key, value] of Object.entries(obj)) {
      result[key] = parseDatesInPipeline(value);
    }
    return result;
  }

  return obj;
}

/**
 * Step 3: Synthesize a human-readable answer from query results
 */
async function synthesizeAnswer(question, queryResults, querySpec, conversationContext = []) {
  const ai = getAI();

  const contextMessages = conversationContext.length > 0
    ? `\n\nRecent conversation context:\n${conversationContext.map(c => `Q: ${c.question}\nA: ${c.answer}`).join("\n\n")}`
    : "";

  let prompt;

  if (queryResults === null && querySpec.directAnswer) {
    // Fallback: no query was generated, give a general answer
    prompt = `
You are an AI assistant for a gym management platform. The admin asked:
"${question}"
${contextMessages}

You couldn't find specific data for this. Provide a helpful, general response.
Keep it concise and professional. Do not use markdown formatting.
    `;
  } else {
    const resultsPreview = JSON.stringify(queryResults, null, 2).slice(0, 8000);
    const resultCount = Array.isArray(queryResults) ? queryResults.length : 0;

    prompt = `
You are an AI assistant for a gym management platform called DynamicGym. The admin asked:
"${question}"
${contextMessages}

The following data was retrieved from the "${querySpec.collection}" collection (${resultCount} results):

${resultsPreview}

Using this data, provide a clear, concise, and actionable answer to the admin's question.
Rules:
- Be conversational but professional.
- Include specific numbers, names, and dates from the data.
- If the data is empty, say "No matching records found" and suggest what they could check.
- For lists, use clean bullet points or numbered items.
- Keep the answer under 400 words.
- Do NOT use markdown formatting (no **, ##, etc.). Use plain text with simple line breaks.
- If you notice any trends or actionable insights, mention them briefly.
    `;
  }

  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: prompt,
  });

  return response.text.trim();
}

/**
 * Main RAG pipeline: Question → Query → Execute → Answer
 */
async function processQuestion(adminId, question) {
  // 1. Get conversation context (last 5 conversations)
  const recentConversations = await RagConversation.find({ adminId })
    .sort({ createdAt: -1 })
    .limit(5)
    .select("question answer")
    .lean();

  recentConversations.reverse(); // Chronological order

  // 2. Generate MongoDB query
  const querySpec = await generateMongoQuery(question, recentConversations);

  // 3. Execute query (safely)
  let queryResults = null;
  let error = null;

  try {
    queryResults = await executeQuery(querySpec);
  } catch (err) {
    error = err.message;
    console.error("RAG Query execution error:", err.message);
  }

  // 4. Synthesize answer
  let answer;
  if (error) {
    answer = `I encountered an issue while querying the database: ${error}. Please try rephrasing your question.`;
  } else {
    answer = await synthesizeAnswer(question, queryResults, querySpec, recentConversations);
  }

  // 5. Determine sources
  const sources = [];
  if (querySpec.collection) {
    sources.push({
      collection: querySpec.collection,
      count: Array.isArray(queryResults) ? queryResults.length : 0,
    });

    // Check for $lookup stages to identify additional collections
    if (querySpec.pipeline) {
      for (const stage of querySpec.pipeline) {
        if (stage.$lookup && stage.$lookup.from) {
          sources.push({
            collection: stage.$lookup.from,
            count: 0, // We don't know exact count from joined collections
          });
        }
      }
    }
  }

  // 6. Save conversation
  const conversation = new RagConversation({
    adminId,
    question,
    generatedQuery: {
      collection: querySpec.collection || null,
      operation: querySpec.operation || null,
      pipeline: querySpec.pipeline || null,
    },
    queryResults: queryResults ? JSON.parse(JSON.stringify(queryResults)).slice(0, 10) : null, // Store max 10 results
    answer,
    sources,
    error,
  });

  await conversation.save();

  return {
    _id: conversation._id,
    question,
    answer,
    sources,
    generatedQuery: conversation.generatedQuery,
    queryResults: queryResults ? queryResults.slice(0, 10) : null,
    error,
    createdAt: conversation.createdAt,
  };
}

/**
 * Get conversation history for an admin
 */
async function getHistory(adminId, limit = 50) {
  const history = await RagConversation.find({ adminId })
    .sort({ createdAt: 1 })
    .limit(limit)
    .select("question answer sources generatedQuery createdAt error")
    .lean();

  return history;
}

/**
 * Clear conversation history for an admin
 */
async function clearHistory(adminId) {
  const result = await RagConversation.deleteMany({ adminId });
  return result.deletedCount;
}

module.exports = {
  processQuestion,
  getHistory,
  clearHistory,
};
