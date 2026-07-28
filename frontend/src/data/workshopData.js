const workshopData = [
  {
    id: "ws1",
    title: "Mindful Mornings",
    date: "2026-08-05",
    time: "6:30 PM",
    duration: "60 min",
    category: "Mindfulness",
    summary: "Start your day with intention and focus through guided morning meditation.",
    description: "Join our specialist-led morning session to set positive intentions and cultivate mindfulness practices that last throughout your day.",
    maxAttendees: 30,
    attendees: 24,
    instructor: "Dr. Nina Patel",
  },
  {
    id: "ws2",
    title: "Stress Relief Circle",
    date: "2026-08-07",
    time: "7:00 PM",
    duration: "75 min",
    category: "Mental Health",
    summary: "Share, connect, and practice grounding techniques in a supportive group.",
    description: "A supportive group session where you can share experiences, learn grounding techniques, and find comfort in community.",
    maxAttendees: 20,
    attendees: 18,
    instructor: "Mina Alvarez",
  },
  {
    id: "ws3",
    title: "Confidence Bootcamp",
    date: "2026-08-09",
    time: "11:00 AM",
    duration: "90 min",
    category: "Coaching",
    summary: "Build self-trust and healthy boundaries through interactive exercises.",
    description: "An interactive workshop designed to help you build self-confidence, set healthy boundaries, and develop a stronger sense of self-worth.",
    maxAttendees: 25,
    attendees: 22,
    instructor: "Aiden Brooks",
  },
  {
    id: "ws4",
    title: "Sleep & Wellness",
    date: "2026-08-10",
    time: "5:00 PM",
    duration: "45 min",
    category: "Nutrition",
    summary: "Optimize rest for better wellbeing with practical sleep hygiene strategies.",
    description: "Learn evidence-based strategies for improving sleep quality, from evening routines to environmental optimization.",
    maxAttendees: 25,
    attendees: 20,
    instructor: "Sophia Chen",
  },
  {
    id: "ws5",
    title: "Creative Expression Workshop",
    date: "2026-08-12",
    time: "3:00 PM",
    duration: "90 min",
    category: "Therapy",
    summary: "Explore emotions through art and creative expression in a safe space.",
    description: "A hands-on creative workshop where you can express yourself through art and discover new ways to process emotions.",
    maxAttendees: 20,
    attendees: 12,
    instructor: "Elena Rodriguez",
  },
  {
    id: "ws6",
    title: "Nutrition for Wellbeing",
    date: "2026-08-14",
    time: "12:00 PM",
    duration: "60 min",
    category: "Nutrition",
    summary: "Learn how food impacts your mood and energy with practical meal planning tips.",
    description: "Understand the connection between nutrition and mental health, and leave with practical meal planning strategies.",
    maxAttendees: 30,
    attendees: 15,
    instructor: "Sophia Chen",
  },
];

const getUpcomingWorkshops = () => {
  const today = new Date().toISOString().split("T")[0];
  return workshopData.filter((ws) => ws.date >= today);
};

const getWorkshopById = (id) => {
  return workshopData.find((ws) => ws.id === id) || null;
};

export { workshopData, getUpcomingWorkshops, getWorkshopById };
