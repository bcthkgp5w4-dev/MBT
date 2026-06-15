import 'package:cloud_firestore/cloud_firestore.dart';
import '../../domain/entities/habit_log_entity.dart';

class HabitLogModel extends HabitLogEntity {
  const HabitLogModel({
    required super.id,
    required super.habitId,
    required super.userId,
    required super.completedAt,
    super.note,
    super.xpEarned,
  });

  factory HabitLogModel.fromFirestore(DocumentSnapshot doc) {
    final d = doc.data() as Map<String, dynamic>;
    return HabitLogModel(
      id: doc.id,
      habitId: d['habitId'] ?? '',
      userId: d['userId'] ?? '',
      completedAt: (d['completedAt'] as Timestamp?)?.toDate() ?? DateTime.now(),
      note: d['note'],
      xpEarned: d['xpEarned'] ?? 10,
    );
  }

  Map<String, dynamic> toFirestore() => {
    'habitId': habitId,
    'userId': userId,
    'completedAt': Timestamp.fromDate(completedAt),
    'note': note,
    'xpEarned': xpEarned,
  };
}
