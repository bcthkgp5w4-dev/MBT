import 'package:equatable/equatable.dart';

class HabitLogEntity extends Equatable {
  final String id;
  final String habitId;
  final String userId;
  final DateTime completedAt;
  final String? note;
  final int xpEarned;

  const HabitLogEntity({
    required this.id,
    required this.habitId,
    required this.userId,
    required this.completedAt,
    this.note,
    this.xpEarned = 10,
  });

  @override
  List<Object?> get props => [id, habitId, completedAt];
}
