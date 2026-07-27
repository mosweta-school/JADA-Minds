const questions = [
  {
    id: "q1",
    category: "energy",
    emoji: "⚡",
    prompt: "How would you describe your energy level today?",
    type: "radio",
    options: [
      { value: "high", label: "High and steady", icon: "🔥" },
      { value: "moderate", label: "Moderate and consistent", icon: "😊" },
      { value: "low", label: "Low and sluggish", icon: "😐" },
      { value: "depleted", label: "Completely drained", icon: "😴" },
    ],
  },
  {
    id: "q2",
    category: "mood",
    emoji: "🌤️",
    prompt: "How is your mood right now?",
    type: "radio",
    options: [
      { value: "great", label: "Feeling great", icon: "😄" },
      { value: "good", label: "Generally positive", icon: "🙂" },
      { value: "neutral", label: "Neutral, neither good nor bad", icon: "😐" },
      { value: "down", label: "Feeling low", icon: "😔" },
      { value: "anxious", label: "Anxious or worried", icon: "😰" },
    ],
  },
  {
    id: "q3",
    category: "support",
    emoji: "🤝",
    prompt: "How supported do you feel by the people around you?",
    type: "radio",
    options: [
      { value: "strong", label: "Very supported", icon: "💪" },
      { value: "moderate", label: "Somewhat supported", icon: "🤗" },
      { value: "isolated", label: "A bit isolated", icon: "🧍" },
      { value: "alone", label: "Feeling alone", icon: "😔" },
    ],
  },
  {
    id: "q4",
    category: "sleep",
    emoji: "😴",
    prompt: "How was your sleep last night?",
    type: "radio",
    options: [
      { value: "rested", label: "Well rested", icon: "🌙" },
      { value: "okay", label: "Okay, some interruptions", icon: "😴" },
      { value: "poor", label: "Poor quality", icon: "💤" },
      { value: "none", label: "Did not sleep well", icon: "😩" },
    ],
  },
  {
    id: "q5",
    category: "stress",
    emoji: "📋",
    prompt: "How stressed are you feeling right now?",
    type: "radio",
    options: [
      { value: "none", label: "No stress at all", icon: "😌" },
      { value: "low", label: "A little stressed", icon: "🧘" },
      { value: "moderate", label: "Moderately stressed", icon: "😟" },
      { value: "high", label: "Very stressed", icon: "😤" },
    ],
  },
  {
    id: "q6",
    category: "activity",
    emoji: "🏃",
    prompt: "Did you engage in any physical activity today?",
    type: "checkbox",
    options: [
      { value: "exercise", label: "Exercise or workout", icon: "🏋️" },
      { value: "walk", label: "Walk or movement", icon: "🚶" },
      { value: "stretching", label: "Stretching or yoga", icon: "🧘‍♀️" },
      { value: "outdoor", label: "Outdoor time in nature", icon: "🌿" },
      { value: "none", label: "None of the above", icon: "🛋️" },
    ],
  },
  {
    id: "q7",
    category: "mindfulness",
    emoji: "🧘",
    prompt: "Did you take any time for mindfulness or self-care today?",
    type: "checkbox",
    options: [
      { value: "meditation", label: "Meditation or breathing", icon: "🧘" },
      { value: "journal", label: "Journaling or reflection", icon: "📔" },
      { value: "creative", label: "Creative activity", icon: "🎨" },
      { value: "social", label: "Time with friends or family", icon: "👥" },
      { value: "none", label: "None of the above", icon: "📵" },
    ],
  },
  {
    id: "q8",
    category: "nutrition",
    emoji: "🥗",
    prompt: "How would you rate your nutrition today?",
    type: "radio",
    options: [
      { value: "excellent", label: "Ate well and stayed hydrated", icon: "🥗" },
      { value: "good", label: "Mostly healthy choices", icon: "🍎" },
      { value: "average", label: "Some indulgences", icon: "🍕" },
      { value: "poor", label: "Skipped meals or unhealthy", icon: "🍔" },
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