import 'package:cloud_firestore/cloud_firestore.dart';
import '../../domain/entities/streak_entity.dart';

class StreakModel extends StreakEntity {
  const StreakModel({
    required super.habitId,
    required super.userId,
    required super.currentStreak,
    required super.longestStreak,
    super.lastCompletedDate,
    required super.isFrozen,
    required super.freezesRemaining,
    required super.inRecoveryMode,
  });

  factory StreakModel.fromFirestore(Map<String, dynamic> data) {
    return StreakModel(
      habitId: data['habitId'] ?? '',
      userId: data['userId'] ?? '',
      currentStreak: data['currentStreak'] ?? 0,
      longestStreak: data['longestStreak'] ?? 0,
      lastCompletedDate: data['lastCompletedDate'] != null
          ? (data['lastCompletedDate'] as Timestamp).toDate()
          : null,
      isFrozen: data['isFrozen'] ?? false,
      freezesRemaining: data['freezesRemaining'] ?? 3,
      inRecoveryMode: data['inRecoveryMode'] ?? false,
    );
  }

  Map<String, dynamic> toFirestore() => {
    'habitId': habitId,
    'userId': userId,
    'currentStreak': currentStreak,
    'longestStreak': longestStreak,
    'lastCompletedDate': lastCompletedDate != null ? Timestamp.fromDate(lastCompletedDate!) : null,
    'isFrozen': isFrozen,
    'freezesRemaining': freezesRemaining,
    'inRecoveryMode': inRecoveryMode,
  };
}
