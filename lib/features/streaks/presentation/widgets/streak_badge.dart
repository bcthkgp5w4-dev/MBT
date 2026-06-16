import 'package:flutter/material.dart';
import 'package:flutter_animate/flutter_animate.dart';
import '../../../../core/constants/app_colors.dart';

class StreakBadge extends StatelessWidget {
  final int streak;
  final bool large;

  const StreakBadge({super.key, required this.streak, this.large = false});

  @override
  Widget build(BuildContext context) {
    final size = large ? 80.0 : 48.0;
    final fontSize = large ? 28.0 : 16.0;
    final labelSize = large ? 12.0 : 9.0;

    return Container(
      width: size,
      height: size,
      decoration: BoxDecoration(
        shape: BoxShape.circle,
        gradient: const LinearGradient(
          colors: [AppColors.streakOrange, Color(0xFFFF4500)],
          begin: Alignment.topLeft,
          end: Alignment.bottomRight,
        ),
        boxShadow: [
          BoxShadow(
            color: AppColors.streakOrange.withOpacity(0.5),
            blurRadius: 12,
            spreadRadius: 2,
          ),
        ],
      ),
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Text('🔥', style: TextStyle(fontSize: fontSize * 0.7)),
          Text(
            '$streak',
            style: TextStyle(
              color: Colors.white,
              fontSize: fontSize,
              fontWeight: FontWeight.w900,
              height: 1,
            ),
          ),
          Text(
            'DAYS',
            style: TextStyle(
              color: Colors.white70,
              fontSize: labelSize,
              fontWeight: FontWeight.w600,
            ),
          ),
        ],
      ),
    ).animate(key: ValueKey(streak)).scale(
      begin: const Offset(0.8, 0.8),
      duration: 500.ms,
      curve: Curves.elasticOut,
    );
  }
}
