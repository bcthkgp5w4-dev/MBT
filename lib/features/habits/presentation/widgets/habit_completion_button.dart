import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:flutter_animate/flutter_animate.dart';
import '../../../../core/constants/app_colors.dart';
import '../providers/habit_provider.dart';

class HabitCompletionButton extends ConsumerStatefulWidget {
  final String habitId;
  final bool isCompleted;

  const HabitCompletionButton({
    super.key,
    required this.habitId,
    required this.isCompleted,
  });

  @override
  ConsumerState<HabitCompletionButton> createState() => _HabitCompletionButtonState();
}

class _HabitCompletionButtonState extends ConsumerState<HabitCompletionButton> {
  bool _localCompleted = false;
  bool _isAnimating = false;

  @override
  void initState() {
    super.initState();
    _localCompleted = widget.isCompleted;
  }

  Future<void> _handleTap() async {
    if (_localCompleted || _isAnimating) return;
    setState(() { _isAnimating = true; _localCompleted = true; });
    HapticFeedback.mediumImpact();
    
    final success = await ref.read(habitNotifierProvider.notifier).completeHabit(widget.habitId);
    if (!success && mounted) {
      setState(() { _localCompleted = false; _isAnimating = false; });
    } else {
      ref.invalidate(completedTodayProvider(widget.habitId));
      ref.invalidate(habitsStreamProvider);
      setState(() => _isAnimating = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: _handleTap,
      child: AnimatedContainer(
        duration: const Duration(milliseconds: 300),
        curve: Curves.elasticOut,
        width: 44,
        height: 44,
        decoration: BoxDecoration(
          color: _localCompleted ? AppColors.success : Colors.transparent,
          shape: BoxShape.circle,
          border: Border.all(
            color: _localCompleted ? AppColors.success : AppColors.border,
            width: 2,
          ),
        ),
        child: _localCompleted
            ? const Icon(Icons.check, color: Colors.white, size: 22)
                .animate().scale(duration: 300.ms, curve: Curves.elasticOut)
            : const Icon(Icons.circle_outlined, color: AppColors.textHint, size: 22),
      ),
    );
  }
}
