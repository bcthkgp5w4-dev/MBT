import 'package:flutter/material.dart';
import 'package:flutter_animate/flutter_animate.dart';
import '../../../../core/constants/app_colors.dart';

class StreakFireAnimation extends StatelessWidget {
  final int streak;

  const StreakFireAnimation({super.key, required this.streak});

  @override
  Widget build(BuildContext context) {
    return SizedBox(
      height: 120,
      child: Stack(
        alignment: Alignment.center,
        children: [
          Text(
            '🔥',
            style: TextStyle(
              fontSize: streak > 30
                  ? 80
                  : streak > 7
                      ? 64
                      : 48,
            ),
          )
              .animate(onPlay: (c) => c.repeat())
              .shimmer(
                duration: 2.seconds,
                color: AppColors.streakOrange.withOpacity(0.6),
              ),
          Positioned(
            bottom: 0,
            child: Text(
              '$streak',
              style: const TextStyle(
                color: Colors.white,
                fontSize: 36,
                fontWeight: FontWeight.w900,
                shadows: [
                  Shadow(color: AppColors.streakOrange, blurRadius: 8),
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }
}
