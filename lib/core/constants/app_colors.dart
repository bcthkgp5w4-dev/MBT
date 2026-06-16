import 'package:flutter/material.dart';

class AppColors {
  static const Color primary = Color(0xFFFF6B35);
  static const Color primaryDark = Color(0xFFE55A24);
  static const Color primaryLight = Color(0xFFFF8C5A);
  static const Color secondary = Color(0xFFFFB347);
  static const Color accent = Color(0xFFFFD700);

  static const Color backgroundDark = Color(0xFF0D0D0D);
  static const Color backgroundCard = Color(0xFF1A1A1A);
  static const Color backgroundElevated = Color(0xFF252525);

  static const Color textPrimary = Color(0xFFFFFFFF);
  static const Color textSecondary = Color(0xFFB0B0B0);
  static const Color textHint = Color(0xFF606060);

  static const Color success = Color(0xFF4CAF50);
  static const Color error = Color(0xFFE53935);
  static const Color warning = Color(0xFFFF9800);
  static const Color info = Color(0xFF2196F3);

  static const Color streakFire = Color(0xFFFF4500);
  static const Color streakGold = Color(0xFFFFD700);
  static const Color streakSilver = Color(0xFFC0C0C0);
  static const Color streakBronze = Color(0xFFCD7F32);

  static const Color divider = Color(0xFF2A2A2A);
  static const Color border = Color(0xFF333333);

  static const LinearGradient primaryGradient = LinearGradient(
    colors: [primary, secondary],
    begin: Alignment.topLeft,
    end: Alignment.bottomRight,
  );

  static const LinearGradient backgroundGradient = LinearGradient(
    colors: [backgroundDark, Color(0xFF1A0A00)],
    begin: Alignment.topCenter,
    end: Alignment.bottomCenter,
  );

  static const LinearGradient cardGradient = LinearGradient(
    colors: [backgroundCard, backgroundElevated],
    begin: Alignment.topLeft,
    end: Alignment.bottomRight,
  );
}
