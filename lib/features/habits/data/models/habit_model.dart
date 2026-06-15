import 'package:cloud_firestore/cloud_firestore.dart';
import '../../domain/entities/habit_entity.dart';

class HabitModel extends HabitEntity {
  const HabitModel({
    required super.id,
    required super.userId,
    required super.title,
    super.description,
    super.emoji,
    super.category,
    super.frequency,
    super.targetDays,
    required super.createdAt,
    super.reminderTime,
    super.isActive,
    super.currentStreak,
    super.longestStreak,
    super.totalCompletions,
    super.colorHex,
  });

  factory HabitModel.fromFirestore(DocumentSnapshot doc) {
    final d = doc.data() as Map<String, dynamic>;
    return HabitModel(
      id: doc.id,
      userId: d['userId'] ?? '',
      title: d['title'] ?? '',
      description: d['description'] ?? '',
      emoji: d['emoji'] ?? '✅',
      category: HabitCategory.values.firstWhere(
        (e) => e.name == d['category'], orElse: () => HabitCategory.health),
      frequency: HabitFrequency.values.firstWhere(
        (e) => e.name == d['frequency'], orElse: () => HabitFrequency.daily),
      targetDays: List<int>.from(d['targetDays'] ?? [0,1,2,3,4,5,6]),
      createdAt: (d['createdAt'] as Timestamp?)?.toDate() ?? DateTime.now(),
      reminderTime: d['reminderTime'] != null ? (d['reminderTime'] as Timestamp).toDate() : null,
      isActive: d['isActive'] ?? true,
      currentStreak: d['currentStreak'] ?? 0,
      longestStreak: d['longestStreak'] ?? 0,
      totalCompletions: d['totalCompletions'] ?? 0,
      colorHex: d['colorHex'] ?? 'FF6B35',
    );
  }

  factory HabitModel.fromEntity(HabitEntity e) => HabitModel(
    id: e.id,
    userId: e.userId,
    title: e.title,
    description: e.description,
    emoji: e.emoji,
    category: e.category,
    frequency: e.frequency,
    targetDays: e.targetDays,
    createdAt: e.createdAt,
    reminderTime: e.reminderTime,
    isActive: e.isActive,
    currentStreak: e.currentStreak,
    longestStreak: e.longestStreak,
    totalCompletions: e.totalCompletions,
    colorHex: e.colorHex,
  );

  Map<String, dynamic> toFirestore() => {
    'userId': userId,
    'title': title,
    'description': description,
    'emoji': emoji,
    'category': category.name,
    'frequency': frequency.name,
    'targetDays': targetDays,
    'createdAt': Timestamp.fromDate(createdAt),
    'reminderTime': reminderTime != null ? Timestamp.fromDate(reminderTime!) : null,
    'isActive': isActive,
    'currentStreak': currentStreak,
    'longestStreak': longestStreak,
    'totalCompletions': totalCompletions,
    'colorHex': colorHex,
  };
}
