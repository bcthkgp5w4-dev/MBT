import 'package:equatable/equatable.dart';

enum HabitCategory { health, fitness, mindfulness, learning, productivity, social, finance, creativity, custom }
enum HabitFrequency { daily, weekly, custom }

class HabitEntity extends Equatable {
  final String id;
  final String userId;
  final String title;
  final String? description;
  final HabitCategory category;
  final HabitFrequency frequency;
  final List<int> weekdays;
  final String emoji;
  final String colorHex;
  final DateTime createdAt;
  final bool isActive;
  final bool reminderEnabled;
  final String? reminderTime;
  final int currentStreak;
  final int longestStreak;
  final int totalCompletions;
  final bool isPremium;

  const HabitEntity({
    required this.id,
    required this.userId,
    required this.title,
    this.description,
    required this.category,
    required this.frequency,
    required this.weekdays,
    required this.emoji,
    required this.colorHex,
    required this.createdAt,
    required this.isActive,
    required this.reminderEnabled,
    this.reminderTime,
    required this.currentStreak,
    required this.longestStreak,
    required this.totalCompletions,
    required this.isPremium,
  });

  @override
  List<Object?> get props => [id, userId, title, category, currentStreak];
}
