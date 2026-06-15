import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../../../core/constants/app_colors.dart';

class PartnerStreakScreen extends ConsumerWidget {
  final String partnerId;
  const PartnerStreakScreen({super.key, required this.partnerId});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    return Scaffold(
      backgroundColor: AppColors.backgroundDark,
      appBar: AppBar(
        title: const Text('Partner Streak'),
        backgroundColor: AppColors.backgroundDark,
      ),
      body: Padding(
        padding: const EdgeInsets.all(20),
        child: Column(
          children: [
            const SizedBox(height: 24),
            // Partner vs Me display
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceEvenly,
              children: [
                _PartnerStreakAvatar(name: 'You', streak: 0, isMe: true),
                Column(
                  children: [
                    const Icon(Icons.local_fire_department, color: AppColors.streakFire, size: 36),
                    const Text('VS', style: TextStyle(fontSize: 22, fontWeight: FontWeight.bold, color: AppColors.textSecondary)),
                  ],
                ),
                _PartnerStreakAvatar(name: 'Partner', streak: 0, isMe: false),
              ],
            ),
            const SizedBox(height: 40),
            Container(
              width: double.infinity,
              padding: const EdgeInsets.all(20),
              decoration: BoxDecoration(
                color: AppColors.backgroundCard,
                borderRadius: BorderRadius.circular(16),
                border: Border.all(color: AppColors.border),
              ),
              child: const Column(
                children: [
                  Icon(Icons.handshake_outlined, size: 48, color: AppColors.primary),
                  SizedBox(height: 12),
                  Text('Accountability Partner', style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold, color: AppColors.textPrimary)),
                  SizedBox(height: 8),
                  Text(
                    'You and your partner keep each other accountable. Complete habits together to maintain your shared streak!',
                    textAlign: TextAlign.center,
                    style: TextStyle(color: AppColors.textSecondary, fontSize: 14),
                  ),
                ],
              ),
            ),
            const SizedBox(height: 24),
            ElevatedButton.icon(
              onPressed: () {},
              icon: const Icon(Icons.check_circle_outline, color: Colors.white),
              label: const Text('Mark Today Complete', style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold)),
              style: ElevatedButton.styleFrom(
                backgroundColor: AppColors.primary,
                minimumSize: const Size(double.infinity, 52),
                shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
              ),
            ),
          ],
        ),
      ),
    );
  }
}

class _PartnerStreakAvatar extends StatelessWidget {
  final String name;
  final int streak;
  final bool isMe;
  const _PartnerStreakAvatar({required this.name, required this.streak, required this.isMe});

  @override
  Widget build(BuildContext context) {
    return Column(
      children: [
        CircleAvatar(
          radius: 40,
          backgroundColor: isMe ? AppColors.primary.withOpacity(0.2) : AppColors.secondary.withOpacity(0.2),
          child: Icon(Icons.person, size: 44, color: isMe ? AppColors.primary : AppColors.secondary),
        ),
        const SizedBox(height: 8),
        Text(name, style: const TextStyle(fontWeight: FontWeight.bold, color: AppColors.textPrimary)),
        Row(
          children: [
            const Icon(Icons.local_fire_department, color: AppColors.streakFire, size: 14),
            Text(' $streak days', style: const TextStyle(color: AppColors.textSecondary, fontSize: 13)),
          ],
        ),
      ],
    );
  }
}
