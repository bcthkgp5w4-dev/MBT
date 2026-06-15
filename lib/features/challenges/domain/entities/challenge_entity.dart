import 'package:equatable/equatable.dart';

enum ChallengeStatus { upcoming, active, completed }

class ChallengeEntity extends Equatable {
  final String id;
  final String title;
  final String description;
  final String emoji;
  final String coverImageUrl;
  final int durationDays;
  final DateTime startDate;
  final DateTime endDate;
  final int memberCount;
  final String createdBy;
  final ChallengeStatus status;
  final List<String> habitCategories;
  final bool isPublic;
  final Map<String, int> leaderboard;

  const ChallengeEntity({
    required this.id,
    required this.title,
    required this.description,
    required this.emoji,
    required this.coverImageUrl,
    required this.durationDays,
    required this.startDate,
    required this.endDate,
    required this.memberCount,
    required this.createdBy,
    required this.status,
    required this.habitCategories,
    required this.isPublic,
    required this.leaderboard,
  });

  @override
  List<Object?> get props => [id, memberCount, status];
}
