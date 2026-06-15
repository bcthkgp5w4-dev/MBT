import 'package:equatable/equatable.dart';

class PartnerStreakEntity extends Equatable {
  final String id;
  final List<String> userIds;
  final List<String> habitIds;
  final int sharedStreak;
  final int longestSharedStreak;
  final DateTime startedAt;
  final bool isActive;
  final Map<String, int> memberStreaks;

  const PartnerStreakEntity({
    required this.id,
    required this.userIds,
    required this.habitIds,
    required this.sharedStreak,
    required this.longestSharedStreak,
    required this.startedAt,
    required this.isActive,
    required this.memberStreaks,
  });

  @override
  List<Object?> get props => [id, sharedStreak];
}
