import 'package:cloud_firestore/cloud_firestore.dart';
import '../../domain/entities/gamification_entity.dart';

class GamificationModel extends GamificationEntity {
  const GamificationModel({
    required super.userId,
    required super.xp,
    required super.level,
    required super.badges,
    required super.rank,
  });

  factory GamificationModel.fromFirestore(DocumentSnapshot doc) {
    final d = doc.data() as Map<String, dynamic>;
    final badgesData = (d['badges'] as List<dynamic>?) ?? [];
    final badges = badgesData
        .map((b) => BadgeEntity(
              id: b['id'] ?? '',
              name: b['name'] ?? '',
              description: b['description'] ?? '',
              emoji: b['emoji'] ?? '🏅',
              earnedAt: (b['earnedAt'] as Timestamp).toDate(),
            ))
        .toList();

    return GamificationModel(
      userId: doc.id,
      xp: d['xp'] ?? 0,
      level: d['level'] ?? 1,
      badges: badges,
      rank: d['rank'] ?? 0,
    );
  }
}
