const { GoogleGenAI } = require("@google/genai");
const Workout = require("../models/Workout");
const Diet = require("../models/Diet");
const Metric = require("../models/Metric");
const ChatMessage = require("../models/ChatMessage");
const User = require("../models/User");
const ApiError = require("../utils/ApiError");

// Initialize Gemini Client
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

exports.generatePlan = async (req, res, next) => {
  try {
    const { goal, fitnessLevel, restrictions } = req.body;
    const userId = req.user.userId;

    if (!process.env.GEMINI_API_KEY) {
      return next(new ApiError(500, "AI service is not configured (missing API key)."));
    }

    // Get latest metrics for the user to provide context to the AI
    const latestMetric = await Metric.findOne({ studentId: userId }).sort({ date: -1 });
    
    let metricContext = "";
    if (latestMetric) {
      metricContext = `The user's latest weight is ${latestMetric.weight} kg`;
      if (latestMetric.bmi) metricContext += ` and BMI is ${latestMetric.bmi}.`;
    } else {
      metricContext = "No prior metrics recorded for this user.";
    }

    const prompt = `
      You are an expert fitness coach and nutritionist.
      Generate a personalized 1-day workout and diet plan based on the following:
      - Goal: ${goal || 'General fitness'}
      - Fitness Level: ${fitnessLevel || 'Beginner'}
      - Dietary Restrictions: ${restrictions || 'None'}
      - Context: ${metricContext}

      Respond strictly in the following JSON format, and do not include any markdown or extra text:
      {
        "workout": {
          "exercises": [
            { "name": "Exercise Name", "reps": 10, "sets": 3 }
          ]
        },
        "diet": {
          "calories": 2000,
          "protein": 150,
          "carbs": 200,
          "fat": 65
        }
      }
    `;

    // Call Gemini to generate the plan
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    const responseText = response.text;
    
    // Attempt to parse the JSON
    let aiData;
    try {
      // Strip any potential markdown blocks if the model didn't listen
      const cleanedText = responseText.replace(/```json/gi, '').replace(/```/g, '').trim();
      aiData = JSON.parse(cleanedText);
    } catch (e) {
      console.error("Failed to parse AI response:", responseText);
      return next(new ApiError(500, "Failed to generate a valid plan from AI. Please try again."));
    }

    // Save the Diet plan
    const newDiet = new Diet({
      studentId: userId,
      calories: aiData.diet.calories,
      protein: aiData.diet.protein,
      carbs: aiData.diet.carbs,
      fat: aiData.diet.fat,
      date: new Date()
    });
    await newDiet.save();

    // Save the Workout plan
    const newWorkout = new Workout({
      assignedTo: userId,
      assignedBy: userId, // Assuming the user generated it for themselves
      exercises: aiData.workout.exercises,
      startDate: new Date(),
      endDate: new Date(new Date().setDate(new Date().getDate() + 1)), // 1-day plan
      batch: "AI Generated"
    });
    await newWorkout.save();

    res.status(200).json({
      success: true,
      message: "AI Plan generated successfully!",
      data: {
        workout: newWorkout,
        diet: newDiet
      }
    });

  } catch (error) {
    next(error);
  }
};

exports.getChatHistory = async (req, res, next) => {
  try {
    const userId = req.user.userId;
    // Fetch last 50 messages
    const history = await ChatMessage.find({ studentId: userId })
      .sort({ createdAt: 1 })
      .limit(50);
    
    res.status(200).json({
      success: true,
      data: history
    });
  } catch (error) {
    next(error);
  }
};

exports.sendMessage = async (req, res, next) => {
  try {
    const userId = req.user.userId;
    const { message } = req.body;

    if (!message) {
      return next(new ApiError(400, "Message cannot be empty"));
    }
    
    if (!process.env.GEMINI_API_KEY) {
      return next(new ApiError(500, "AI service is not configured."));
    }

    // Save user message
    const userMsg = new ChatMessage({
      studentId: userId,
      role: "user",
      content: message
    });
    await userMsg.save();

    // Fetch history for context
    const history = await ChatMessage.find({ studentId: userId })
      .sort({ createdAt: -1 }) // Get newest first to limit context window
      .limit(10);
    
    // Reverse to chronological
    history.reverse();

    // Map history to Gemini format
    const contents = history.map(msg => ({
      role: msg.role === 'model' ? 'model' : 'user', // Gemini accepts 'user' and 'model'
      parts: [{ text: msg.content }]
    }));

    // Start Chat Session
    const chat = ai.chats.create({
      model: 'gemini-2.5-flash',
      history: contents.slice(0, -1), // Everything except the latest message we just pushed
      config: {
        systemInstruction: "You are a professional, encouraging, and knowledgeable AI fitness coach for a gym platform. Give concise, highly practical fitness and nutrition advice. Do not output markdown, just plain text with simple formatting."
      }
    });

    const response = await chat.sendMessage({ message: message });
    const responseText = response.text;

    // Save AI message
    const aiMsg = new ChatMessage({
      studentId: userId,
      role: "model",
      content: responseText
    });
    await aiMsg.save();

    res.status(200).json({
      success: true,
      data: {
        userMessage: userMsg,
        aiMessage: aiMsg
      }
    });
  } catch (error) {
    next(error);
  }
};

exports.suggestExercises = async (req, res, next) => {
  try {
    const { studentIds, batches } = req.body;

    if (!process.env.GEMINI_API_KEY) {
      return next(new ApiError(500, "AI service is not configured."));
    }

    // 1. Identify all target students
    let targetStudentIds = studentIds || [];
    if (batches && batches.length > 0) {
      const studentsInBatches = await User.find({ batch: { $in: batches }, role: 'student' }).select('_id');
      targetStudentIds = [...new Set([...targetStudentIds, ...studentsInBatches.map(s => s._id.toString())])];
    }

    if (targetStudentIds.length === 0) {
      return next(new ApiError(400, "Please select at least one student or batch."));
    }

    // 2. Fetch context for these students (latest metrics and recent workouts)
    const studentsContext = await Promise.all(targetStudentIds.slice(0, 5).map(async (sid) => {
      const metric = await Metric.findOne({ studentId: sid }).sort({ date: -1 });
      const workout = await Workout.findOne({ assignedTo: sid }).sort({ startDate: -1 });
      return {
        weight: metric?.weight,
        bmi: metric?.bmi,
        recentExercises: workout?.exercises?.map(e => e.name)
      };
    }));

    const prompt = `
      You are an expert fitness coach. Suggest a set of 5-8 exercises for a group of gym students.
      Student profiles (sample): ${JSON.stringify(studentsContext)}
      
      Suggest exercises that are balanced and effective. 
      Respond strictly in the following JSON format:
      [
        { "name": "Exercise Name", "reps": 12, "sets": 3 },
        ...
      ]
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    const responseText = response.text;
    let suggestions;
    try {
      const cleanedText = responseText.replace(/```json/gi, '').replace(/```/g, '').trim();
      suggestions = JSON.parse(cleanedText);
    } catch (e) {
      console.error("Failed to parse AI response:", responseText);
      return next(new ApiError(500, "Failed to generate valid suggestions."));
    }

    res.status(200).json({
      success: true,
      data: suggestions
    });

  } catch (error) {
    next(error);
  }
};

exports.getStudentProgressSummary = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!process.env.GEMINI_API_KEY) {
      return next(new ApiError(500, "AI service is not configured."));
    }

    // Fetch student profile
    const student = await User.findById(id).select('name email batch createdAt gender age height weight fitnessGoals');
    if (!student) {
      return next(new ApiError(404, "Student not found."));
    }

    // Fetch recent attendance (last 30 days)
    const attendance = await require("../models/Attendance").find({
      studentId: id,
      date: { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) }
    }).sort({ date: -1 });

    // Fetch recent metrics
    const metrics = await Metric.find({ studentId: id }).sort({ date: -1 }).limit(3);

    // Fetch recent workouts
    const workouts = await Workout.find({ assignedTo: id }).sort({ createdAt: -1 }).limit(3);

    // Assemble context
    const context = {
      profile: {
        name: student.name,
        goals: student.fitnessGoals,
        joined: student.createdAt,
      },
      attendance: {
        daysAttendedLast30: attendance.length,
      },
      recentMetrics: metrics.map(m => ({ weight: m.weight, bmi: m.bmi, date: m.date })),
      recentWorkouts: workouts.map(w => ({ status: w.completionStatus, date: w.createdAt }))
    };

    const prompt = `
      You are an expert personal trainer and gym manager. 
      Analyze the following student data and provide a concise, human-readable progress summary (max 3-4 sentences). 
      Highlight their consistency (based on attendance and workout completion), any trends in their metrics (weight/BMI), and provide a brief suggestion for the admin on what to discuss with them (e.g., "Praise their consistency" or "Check in on their diet").

      Student Data:
      ${JSON.stringify(context)}

      Do not use markdown formatting. Just return plain text.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    res.status(200).json({
      success: true,
      data: response.text.trim()
    });

  } catch (error) {
    next(error);
  }
};

exports.recommendDiet = async (req, res, next) => {
  try {
    const { preferences, allergies } = req.body;
    const userId = req.user.userId;

    if (!process.env.GEMINI_API_KEY) {
      return next(new ApiError(500, "AI service is not configured."));
    }

    const student = await User.findById(userId).select('weight height age gender fitnessGoals');
    
    let context = `User Profile:`;
    if (student) {
      context += `\nWeight: ${student.weight || 'N/A'}kg, Height: ${student.height || 'N/A'}cm, Age: ${student.age || 'N/A'}, Goals: ${student.fitnessGoals?.join(', ') || 'General Fitness'}`;
    }

    const prompt = `
      You are an expert nutritionist. Create a 1-day meal plan for a gym student.
      ${context}
      Dietary Preferences: ${preferences || 'None'}
      Allergies/Restrictions: ${allergies || 'None'}

      Respond strictly in the following JSON format:
      {
        "breakfast": "Description of breakfast",
        "lunch": "Description of lunch",
        "dinner": "Description of dinner",
        "snacks": "Description of snacks",
        "macros": {
          "calories": 2000,
          "protein": 150,
          "carbs": 200,
          "fat": 60
        }
      }
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    const responseText = response.text;
    let dietPlan;
    try {
      const cleanedText = responseText.replace(/```json/gi, '').replace(/```/g, '').trim();
      dietPlan = JSON.parse(cleanedText);
    } catch (e) {
      console.error("Failed to parse AI response:", responseText);
      return next(new ApiError(500, "Failed to generate a valid diet plan."));
    }

    res.status(200).json({
      success: true,
      data: dietPlan
    });

  } catch (error) {
    next(error);
  }
};
