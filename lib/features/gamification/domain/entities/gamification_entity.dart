import 'package:equatable/equatable.dart';

class BadgeEntity extends Equatable {
  final String id;
  final String name;
  final String description;
  final String emoji;
  final DateTime earnedAt;

  const BadgeEntity({
    required this.id,
    required this.name,
    required this.description,
    required this.emoji,
    required this.earnedAt,
  });

  @override
  List<Object?> get props => [id];
}

class GamificationEntity extends Equatable {
  final String userId;
  final int xp;
  final int level;
  final List<BadgeEntity> badges;
  final int rank;

  const GamificationEntity({
    required this.userId,
    required this.xp,
    required this.level,
    required this.badges,
    required this.rank,
  });

  int get xpToNextLevel => (level * 500) - xp;
  double get levelProgress => (xp % 500) / 500;

  @override
  List<Object?> get props => [userId, xp, level];
}
