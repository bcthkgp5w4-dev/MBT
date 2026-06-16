import 'date_utils.dart';

class StreakCalculator {
  static int calculateCurrentStreak(List<DateTime> completionDates) {
    if (completionDates.isEmpty) return 0;
    final sorted = completionDates.map(AppDateUtils.startOfDay).toSet().toList()
      ..sort((a, b) => b.compareTo(a));

    final today = AppDateUtils.startOfDay(DateTime.now());
    final yesterday = today.subtract(const Duration(days: 1));

    if (sorted.first != today && sorted.first != yesterday) return 0;

    int streak = 1;
    for (int i = 0; i < sorted.length - 1; i++) {
      final diff = sorted[i].difference(sorted[i + 1]).inDays;
      if (diff == 1) {
        streak++;
      } else {
        break;
      }
    }
    return streak;
  }

  static int calculateLongestStreak(List<DateTime> completionDates) {
    if (completionDates.isEmpty) return 0;
    final sorted = completionDates.map(AppDateUtils.startOfDay).toSet().toList()
      ..sort();

    int longest = 1, current = 1;
    for (int i = 1; i < sorted.length; i++) {
      if (sorted[i].difference(sorted[i - 1]).inDays == 1) {
        current++;
        if (current > longest) longest = current;
      } else {
        current = 1;
      }
    }
    return longest;
  }

  static double calculateCompletionRate(List<DateTime> completionDates, DateTime startDate) {
    final daysSinceStart = DateTime.now().difference(startDate).inDays + 1;
    if (daysSinceStart <= 0) return 0;
    return (completionDates.length / daysSinceStart).clamp(0.0, 1.0);
  }

  static bool isStreakAtRisk(List<DateTime> completionDates) {
    if (completionDates.isEmpty) return false;
    final sorted = completionDates.map(AppDateUtils.startOfDay).toSet().toList()
      ..sort((a, b) => b.compareTo(a));
    final today = AppDateUtils.startOfDay(DateTime.now());
    return sorted.first == today.subtract(const Duration(days: 1)) && DateTime.now().hour >= 20;
  }
}
