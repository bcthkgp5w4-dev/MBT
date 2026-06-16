import 'package:cloud_firestore/cloud_firestore.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../../auth/presentation/providers/auth_provider.dart';

class AnalyticsData {
  final double weeklyCompletionRate;
  final double monthlyCompletionRate;
  final int totalCompletions;
  final int activeHabits;
  final int bestStreak;
  final Map<String, int> dailyCompletions;

  const AnalyticsData({
    required this.weeklyCompletionRate,
    required this.monthlyCompletionRate,
    required this.totalCompletions,
    required this.activeHabits,
    required this.bestStreak,
    required this.dailyCompletions,
  });
}

final analyticsProvider = FutureProvider<AnalyticsData>((ref) async {
  final user = ref.watch(currentUserProvider);
  if (user == null) {
    return const AnalyticsData(
      weeklyCompletionRate: 0,
      monthlyCompletionRate: 0,
      totalCompletions: 0,
      activeHabits: 0,
      bestStreak: 0,
      dailyCompletions: {},
    );
  }

  final firestore = FirebaseFirestore.instance;
  final now = DateTime.now();
  final weekAgo = now.subtract(const Duration(days: 7));
  final monthAgo = now.subtract(const Duration(days: 30));

  final weekLogs = await firestore
      .collection('habit_logs')
      .where('userId', isEqualTo: user.id)
      .where('completedAt', isGreaterThanOrEqualTo: Timestamp.fromDate(weekAgo))
      .get();

  final monthLogs = await firestore
      .collection('habit_logs')
      .where('userId', isEqualTo: user.id)
      .where('completedAt', isGreaterThanOrEqualTo: Timestamp.fromDate(monthAgo))
      .get();

  final habits = await firestore
      .collection('habits')
      .where('userId', isEqualTo: user.id)
      .where('isActive', isEqualTo: true)
      .get();

  final activeHabits = habits.docs.length;
  final weeklyRate =
      activeHabits > 0 ? (weekLogs.docs.length / (activeHabits * 7)) * 100 : 0.0;
  final monthlyRate =
      activeHabits > 0 ? (monthLogs.docs.length / (activeHabits * 30)) * 100 : 0.0;

  int bestStreak = 0;
  for (final h in habits.docs) {
    final s = (h.data()['longestStreak'] as int?) ?? 0;
    if (s > bestStreak) bestStreak = s;
  }

  final Map<String, int> daily = {};
  for (final log in monthLogs.docs) {
    final date = (log.data()['completedAt'] as Timestamp).toDate();
    final key =
        '${date.year}-${date.month.toString().padLeft(2, '0')}-${date.day.toString().padLeft(2, '0')}';
    daily[key] = (daily[key] ?? 0) + 1;
  }

  return AnalyticsData(
    weeklyCompletionRate: weeklyRate.clamp(0, 100),
    monthlyCompletionRate: monthlyRate.clamp(0, 100),
    totalCompletions: monthLogs.docs.length,
    activeHabits: activeHabits,
    bestStreak: bestStreak,
    dailyCompletions: daily,
  );
});
