class AppConstants {
  static const String appName = 'HabitTribe';
  static const String appVersion = '1.0.0';

  // Firestore Collections
  static const String usersCollection = 'users';
  static const String habitsCollection = 'habits';
  static const String habitLogsCollection = 'habitLogs';
  static const String streaksCollection = 'streaks';
  static const String communitiesCollection = 'communities';
  static const String challengesCollection = 'challenges';
  static const String achievementsCollection = 'achievements';
  static const String partnerStreaksCollection = 'partnerStreaks';

  // Hive Boxes
  static const String habitsBox = 'habitsBox';
  static const String habitLogsBox = 'habitLogsBox';
  static const String userBox = 'userBox';
  static const String settingsBox = 'settingsBox';

  // Shared Preferences Keys
  static const String onboardingCompleteKey = 'onboarding_complete';
  static const String themeKey = 'theme_mode';
  static const String notificationsKey = 'notifications_enabled';

  // Habit Categories
  static const List<String> habitCategories = [
    'Health', 'Fitness', 'Mindfulness', 'Learning', 'Productivity',
    'Social', 'Finance', 'Creativity', 'Nutrition', 'Sleep',
  ];

  // Habit Frequencies
  static const List<String> habitFrequencies = ['Daily', 'Weekly', 'Custom'];

  // Achievement Thresholds
  static const int bronzeStreakThreshold = 7;
  static const int silverStreakThreshold = 30;
  static const int goldStreakThreshold = 100;
  static const int platinumStreakThreshold = 365;

  // XP Points
  static const int habitCompleteXP = 10;
  static const int streakBonusXP = 5;
  static const int challengeCompleteXP = 50;
  static const int achievementXP = 100;

  // Pagination
  static const int pageSize = 20;

  // Animation Durations
  static const Duration shortAnimation = Duration(milliseconds: 200);
  static const Duration mediumAnimation = Duration(milliseconds: 400);
  static const Duration longAnimation = Duration(milliseconds: 800);

  // Notification IDs
  static const int dailyReminderNotificationId = 1;
  static const int streakWarningNotificationId = 2;
}
