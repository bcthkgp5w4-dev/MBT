import 'package:equatable/equatable.dart';

class StreakEntity extends Equatable {
  final String habitId;
  final String userId;
  final int currentStreak;
  final int longestStreak;
  final DateTime? lastCompletedDate;
  final bool isFrozen;
  final int freezesRemaining;
  final bool inRecoveryMode;

  const StreakEntity({
    required this.habitId,
    required this.userId,
    required this.currentStreak,
    required this.longestStreak,
    this.lastCompletedDate,
    required this.isFrozen,
    required this.freezesRemaining,
    required this.inRecoveryMode,
  });

  bool get isAtRisk {
    if (lastCompletedDate == null) return false;
    final diff = DateTime.now().difference(lastCompletedDate!).inDays;
    return diff >= 1 && !isFrozen;
  }

  @override
  List<Object?> get props => [habitId, userId, currentStreak, longestStreak];
}
