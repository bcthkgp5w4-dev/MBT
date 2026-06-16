import 'package:cloud_firestore/cloud_firestore.dart';
import '../../domain/entities/challenge_entity.dart';

class ChallengeModel extends ChallengeEntity {
  const ChallengeModel({
    required super.id,
    required super.title,
    required super.description,
    required super.emoji,
    required super.coverImageUrl,
    required super.durationDays,
    required super.startDate,
    required super.endDate,
    required super.memberCount,
    required super.createdBy,
    required super.status,
    required super.habitCategories,
    required super.isPublic,
    required super.leaderboard,
  });

  factory ChallengeModel.fromFirestore(DocumentSnapshot doc) {
    final d = doc.data() as Map<String, dynamic>;
    final now = DateTime.now();
    final start = (d['startDate'] as Timestamp).toDate();
    final end = (d['endDate'] as Timestamp).toDate();

    ChallengeStatus status;
    if (now.isBefore(start)) {
      status = ChallengeStatus.upcoming;
    } else if (now.isAfter(end)) {
      status = ChallengeStatus.completed;
    } else {
      status = ChallengeStatus.active;
    }

    return ChallengeModel(
      id: doc.id,
      title: d['title'] ?? '',
      description: d['description'] ?? '',
      emoji: d['emoji'] ?? '🏆',
      coverImageUrl: d['coverImageUrl'] ?? '',
      durationDays: d['durationDays'] ?? 30,
      startDate: start,
      endDate: end,
      memberCount: d['memberCount'] ?? 0,
      createdBy: d['createdBy'] ?? '',
      status: status,
      habitCategories: List<String>.from(d['habitCategories'] ?? []),
      isPublic: d['isPublic'] ?? true,
      leaderboard: Map<String, int>.from(d['leaderboard'] ?? {}),
    );
  }
}
