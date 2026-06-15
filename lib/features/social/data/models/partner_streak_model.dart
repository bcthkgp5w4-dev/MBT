import 'package:cloud_firestore/cloud_firestore.dart';
import '../../domain/entities/partner_streak_entity.dart';

class PartnerStreakModel extends PartnerStreakEntity {
  const PartnerStreakModel({
    required super.id,
    required super.userIds,
    required super.habitIds,
    required super.sharedStreak,
    required super.longestSharedStreak,
    required super.startedAt,
    required super.isActive,
    required super.memberStreaks,
  });

  factory PartnerStreakModel.fromFirestore(DocumentSnapshot doc) {
    final d = doc.data() as Map<String, dynamic>;
    return PartnerStreakModel(
      id: doc.id,
      userIds: List<String>.from(d['userIds'] ?? []),
      habitIds: List<String>.from(d['habitIds'] ?? []),
      sharedStreak: d['sharedStreak'] ?? 0,
      longestSharedStreak: d['longestSharedStreak'] ?? 0,
      startedAt: (d['startedAt'] as Timestamp).toDate(),
      isActive: d['isActive'] ?? true,
      memberStreaks: Map<String, int>.from(d['memberStreaks'] ?? {}),
    );
  }
}
