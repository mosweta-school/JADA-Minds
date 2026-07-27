const emptyStateMessages = {
  assessments: {
    emoji: "📋",
    title: "No assessments yet",
    description: "Your wellness check-ins will appear here once you complete your first assessment.",
    action: "Start your first assessment",
  },
  progress: {
    emoji: "📈",
    title: "No progress data yet",
    description: "Complete assessments to track your wellness trends and progress over time.",
    action: "Take an assessment",
  },
  specialists: {
    emoji: "👥",
    title: "No specialists found",
    description: "Try adjusting your search or filters to find a specialist that matches your needs.",
    action: "View all specialists",
  },
  workshops: {
    emoji: "🎓",
    title: "No registered workshops",
    description: "Browse available workshops and register to join a community session.",
    action: "Browse workshops",
  },
  resources: {
    emoji: "📚",
    title: "No resources saved yet",
    description: "Save resources that resonate with you for easy access later.",
    action: "Explore resources",
  },
  general: {
    emoji: "📭",
    title: "Nothing here yet",
    description: "Content is being prepared. Check back soon.",
  },
};

const successMessages = {
  assessmentComplete: {
    emoji: "✨",
    title: "Assessment complete!",
    description: "Your responses have been recorded. Check your results to see your wellness snapshot.",
  },
  profileSaved: {
    emoji: "💾",
    title: "Profile updated",
    description: "Your profile changes have been saved successfully.",
  },
  registrationConfirmed: {
    emoji: "🎉",
    title: "Registration confirmed!",
    description: "You are now registered for the workshop. Check your email for details.",
  },
  passwordChanged: {
    emoji: "🔒",
    title: "Password updated",
    description: "Your password has been changed successfully. Use your new password to sign in.",
  },
  saved: {
    emoji: "✅",
    title: "Saved successfully",
    description: "Your changes have been saved.",
  },
};

const errorMessages = {
  somethingWentWrong: {
    emoji: "❌",
    title: "Something went wrong",
    description: "Please try again. If the problem persists, contact support.",
  },
  networkError: {
    emoji: "🌐",
    title: "Network error",
    description: "Please check your internet connection and try again.",
  },
  unauthorized: {
    emoji: "🔒",
    title: "Access denied",
    description: "You do not have permission to access this resource.",
  },
  notFound: {
    emoji: "🔍",
    title: "Not found",
    description: "The resource you are looking for does not exist or has been removed.",
  },
  validationError: {
    emoji: "⚠️",
    title: "Validation error",
    description: "Please review the form and correct any errors before submitting.",
  },
  sessionExpired: {
    emoji: "⏰",
    title: "Session expired",
    description: "Your session has expired. Please sign in again to continue.",
  },
};

export { emptyStateMessages, successMessages, errorMessages };