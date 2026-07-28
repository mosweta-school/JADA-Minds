const questions = [
  {
    id: "q1",
    category: "energy",
    prompt: "How would you describe your energy level today?",
    type: "radio",
    options: [
      { value: "high", label: "High and steady"},
      { value: "moderate", label: "Moderate and consistent"},
      { value: "low", label: "Low and sluggish"},
      { value: "depleted", label: "Completely drained"},
    ],
  },
  {
    id: "q2",
    category: "mood",
    prompt: "How is your mood right now?",
    type: "radio",
    options: [
      { value: "great", label: "Feeling great" },
      { value: "good", label: "Generally positive" },
      { value: "neutral", label: "Neutral, neither good nor bad"},
      { value: "down", label: "Feeling low" },
      { value: "anxious", label: "Anxious or worried" },
    ],
  },
  {
    id: "q3",
    category: "support",
    prompt: "How supported do you feel by the people around you?",
    type: "radio",
    options: [
      { value: "strong", label: "Very supported"},
      { value: "moderate", label: "Somewhat supported"},
      { value: "isolated", label: "A bit isolated"},
      { value: "alone", label: "Feeling alone"},
    ],
  },
  {
    id: "q4",
    category: "sleep",
    prompt: "How was your sleep last night?",
    type: "radio",
    options: [
      { value: "rested", label: "Well rested"},
      { value: "okay", label: "Okay, some interruptions"},
      { value: "poor", label: "Poor quality"},
      { value: "none", label: "Did not sleep well"},
    ],
  },
  {
    id: "q5",
    category: "stress",
    prompt: "How stressed are you feeling right now?",
    type: "radio",
    options: [
      { value: "none", label: "No stress at all" },
      { value: "low", label: "A little stressed" },
      { value: "moderate", label: "Moderately stressed" },
      { value: "high", label: "Very stressed" },
    ],
  },
  {
    id: "q6",
    category: "activity",
    prompt: "Did you engage in any physical activity today?",
    type: "checkbox",
    options: [
      { value: "exercise", label: "Exercise or workout" },
      { value: "walk", label: "Walk or movement"},
      { value: "stretching", label: "Stretching or yoga"},
      { value: "outdoor", label: "Outdoor time in nature"},
      { value: "none", label: "None of the above" },
    ],
  },
  {
    id: "q7",
    category: "mindfulness",
    prompt: "Did you take any time for mindfulness or self-care today?",
    type: "checkbox",
    options: [
      { value: "meditation", label: "Meditation or breathing"},
      { value: "journal", label: "Journaling or reflection" },
      { value: "creative", label: "Creative activity" },
      { value: "social", label: "Time with friends or family"},
      { value: "none", label: "None of the above" },
    ],
  },
  {
    id: "q8",
    category: "nutrition",
    prompt: "How would you rate your nutrition today?",
    type: "radio",
    options: [
      { value: "excellent", label: "Ate well and stayed hydrated"},
      { value: "good", label: "Mostly healthy choices"},
      { value: "average", label: "Some indulgences" },
      { value: "poor", label: "Skipped meals or unhealthy"},
    ],
  },
];

const getQuestionsByCategory = (category) => {
  if (!category) return questions;
  return questions.filter((q) => q.category === category);
};

const getQuestionById = (id) => {
  return questions.find((q) => q.id === id) || null;
};

const getProgress = (answeredCount, totalCount) => {
  if (totalCount === 0) return 0;
  return Math.round((answeredCount / totalCount) * 100);
};

export { questions, getQuestionsByCategory, getQuestionById, getProgress };