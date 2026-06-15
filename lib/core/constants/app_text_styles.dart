import 'package:flutter/material.dart';
import 'app_colors.dart';

class AppTextStyles {
  static const String fontFamily = 'Roboto';

  static const TextStyle h1 = TextStyle(
    fontSize: 32, fontWeight: FontWeight.bold, color: AppColors.textPrimary, letterSpacing: -0.5,
  );
  static const TextStyle h2 = TextStyle(
    fontSize: 24, fontWeight: FontWeight.bold, color: AppColors.textPrimary, letterSpacing: -0.3,
  );
  static const TextStyle h3 = TextStyle(
    fontSize: 20, fontWeight: FontWeight.w600, color: AppColors.textPrimary,
  );
  static const TextStyle h4 = TextStyle(
    fontSize: 18, fontWeight: FontWeight.w600, color: AppColors.textPrimary,
  );
  static const TextStyle body1 = TextStyle(
    fontSize: 16, fontWeight: FontWeight.normal, color: AppColors.textPrimary,
  );
  static const TextStyle body2 = TextStyle(
    fontSize: 14, fontWeight: FontWeight.normal, color: AppColors.textSecondary,
  );
  static const TextStyle caption = TextStyle(
    fontSize: 12, fontWeight: FontWeight.normal, color: AppColors.textHint,
  );
  static const TextStyle button = TextStyle(
    fontSize: 16, fontWeight: FontWeight.w600, color: AppColors.textPrimary, letterSpacing: 0.5,
  );
  static const TextStyle label = TextStyle(
    fontSize: 13, fontWeight: FontWeight.w500, color: AppColors.textSecondary,
  );
  static TextStyle streakNumber = const TextStyle(
    fontSize: 48, fontWeight: FontWeight.bold, color: AppColors.streakFire,
    shadows: [Shadow(blurRadius: 10, color: AppColors.streakFire, offset: Offset(0, 0))],
  );
}
