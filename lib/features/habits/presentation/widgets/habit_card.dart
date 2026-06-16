import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:flutter_animate/flutter_animate.dart';
import '../../../../core/constants/app_colors.dart';
import '../../domain/entities/habit_entity.dart';
import '../providers/habit_provider.dart';
import 'habit_completion_button.dart';

class HabitCard extends ConsumerWidget {
  final HabitEntity habit;
  final int index;

  const HabitCard({super.key, required this.habit, this.index = 0});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final completedAsync = ref.watch(completedTodayProvider(habit.id));
    final color = Color(int.parse('FF${habit.colorHex}', radix: 16));

    return GestureDetector(
      onTap: () => context.push('/habit/${habit.id}'),
      child: Container(
        margin: const EdgeInsets.only(bottom: 12),
        decoration: BoxDecoration(
          color: AppColors.backgroundCard,
          borderRadius: BorderRadius.circular(16),
          border: Border.all(color: AppColors.border, width: 0.5),
        ),
        child: Padding(
          padding: const EdgeInsets.all(16),
          child: Row(
            children: [
              Container(
                width: 48, height: 48,
                decoration: BoxDecoration(
                  color: color.withOpacity(0.15),
                  borderRadius: BorderRadius.circular(14),
                ),
                child: Center(child: Text(habit.emoji, style: const TextStyle(fontSize: 24))),
              ),
              const SizedBox(width: 14),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(habit.title,
                        style: const TextStyle(fontSize: 16, fontWeight: FontWeight.w600, color: AppColors.textPrimary)),
                    const SizedBox(height: 4),
                    Row(children: [
                      Icon(Icons.local_fire_department, size: 14, color: AppColors.streakFire),
                      const SizedBox(width: 4),
                      Text('${habit.currentStreak} day streak',
                          style: const TextStyle(fontSize: 12, color: AppColors.textSecondary)),
                      const SizedBox(width: 12),
                      Icon(Icons.check_circle_outline, size: 14, color: AppColors.success),
                      const SizedBox(width: 4),
                      Text('${habit.totalCompletions} total',
                          style: const TextStyle(fontSize: 12, color: AppColors.textSecondary)),
                    ]),
                  ],
                ),
              ),
              completedAsync.when(
                data: (completed) => HabitCompletionButton(
                  habitId: habit.id,
                  isCompleted: completed,
                ),
                loading: () => const SizedBox(width: 44, height: 44, child: CircularProgressIndicator(strokeWidth: 2, color: AppColors.primary)),
                error: (_, __) => const Icon(Icons.error_outline, color: AppColors.error),
              ),
            ],
          ),
        ),
      ),
    ).animate(delay: Duration(milliseconds: index * 80)).fadeIn(duration: 300.ms).slideX(begin: 0.1, end: 0);
  }
}
