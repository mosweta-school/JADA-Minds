const wellnessTips = [
  {
    id: "tip1",
    category: "energy",
    title: "Boost Your Energy",
    description: "Start your day with a 5-minute stretch and a glass of water to wake up your body and mind.",
  },
  {
    id: "tip2",
    category: "mood",
    title: "Lift Your Mood",
    description: "Take a 10-minute walk outside. Natural light and fresh air can significantly improve your emotional state.",
  },
  {
    id: "tip3",
    category: "stress",
    title: "Manage Stress",
    description: "Try the 4-7-8 breathing technique: inhale for 4 seconds, hold for 7, exhale for 8. Repeat 3 times.",
  },
  {
    id: "tip4",
    category: "sleep",
    title: "Improve Sleep",
    description: "Avoid screens 30 minutes before bed. Try reading or gentle stretching instead to wind down.",
  },
  {
    id: "tip5",
    category: "nutrition",
    title: "Eat Mindfully",
    description: "Slow down during meals. Chew thoroughly and pay attention to how food makes you feel.",
  },
  {
    id: "tip6",
    category: "social",
    title: "Stay Connected",
    description: "Reach out to one person you care about today. A simple message can strengthen your sense of belonging.",
  },
  {
    id: "tip7",
    category: "mindfulness",
    title: "Practice Gratitude",
    description: "Write down three things you are grateful for today. This simple habit can shift your perspective.",
  },
  {
    id: "tip8",
    category: "activity",
    title: "Move Your Body",
    description: "Even 15 minutes of gentle movement can boost endorphins and reduce tension in your body.",
  },
];

const getTipsByCategory = (category) => {
  if (!category) return wellnessTips;
  return wellnessTips.filter((tip) => tip.category === category);
};

export { wellnessTips, getTipsByCategory };