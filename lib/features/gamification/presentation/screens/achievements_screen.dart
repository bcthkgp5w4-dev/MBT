import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../../../core/constants/app_colors.dart';
import '../../../../core/constants/app_constants.dart';
import '../../../auth/presentation/providers/auth_provider.dart';

class AchievementsScreen extends ConsumerWidget {
  const AchievementsScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final user = ref.watch(currentUserProvider);

    final achievements = [
      _Achievement(title: 'First Step', description: 'Complete your first habit', icon: Icons.directions_walk, xp: 50, unlocked: true, color: AppColors.success),
      _Achievement(title: 'Week Warrior', description: 'Maintain a 7-day streak', icon: Icons.local_fire_department, xp: 100, unlocked: (user?.longestStreak ?? 0) >= AppConstants.bronzeStreakThreshold, color: AppColors.streakBronze),
      _Achievement(title: 'Monthly Master', description: 'Maintain a 30-day streak', icon: Icons.military_tech, xp: 500, unlocked: (user?.longestStreak ?? 0) >= AppConstants.silverStreakThreshold, color: AppColors.streakSilver),
      _Achievement(title: 'Century Club', description: 'Maintain a 100-day streak', icon: Icons.workspace_premium, xp: 1000, unlocked: (user?.longestStreak ?? 0) >= AppConstants.goldStreakThreshold, color: AppColors.streakGold),
      _Achievement(title: 'Year of Habits', description: 'Maintain a 365-day streak', icon: Icons.diamond, xp: 5000, unlocked: (user?.longestStreak ?? 0) >= AppConstants.platinumStreakThreshold, color: const Color(0xFF00E5FF)),
      _Achievement(title: 'Social Butterfly', description: 'Connect with 5 friends', icon: Icons.people, xp: 200, unlocked: false, color: AppColors.info),
      _Achievement(title: 'Challenge Champion', description: 'Complete your first challenge', icon: Icons.emoji_events, xp: 300, unlocked: false, color: AppColors.primary),
      _Achievement(title: 'Tribe Leader', description: 'Create a community with 10+ members', icon: Icons.groups, xp: 500, unlocked: false, color: AppColors.secondary),
    ];

    return Scaffold(
      backgroundColor: AppColors.backgroundDark,
      appBar: AppBar(
        title: const Text('Achievements', style: TextStyle(fontWeight: FontWeight.bold)),
        backgroundColor: AppColors.backgroundDark,
      ),
      body: Column(
        children: [
          // XP Summary Banner
          Container(
            width: double.infinity,
            padding: const EdgeInsets.all(20),
            color: AppColors.backgroundCard,
            child: Row(
              mainAxisAlignment: MainAxisAlignment.spaceAround,
              children: [
                _XPStat(label: 'Total XP', value: '${user?.totalXP ?? 0}', icon: Icons.star_rounded, color: AppColors.streakGold),
                _XPStat(label: 'Level', value: '${user?.level ?? 1}', icon: Icons.military_tech_rounded, color: AppColors.primary),
                _XPStat(label: 'Earned', value: '${achievements.where((a) => a.unlocked).length}/${achievements.length}', icon: Icons.emoji_events, color: AppColors.success),
              ],
            ),
          ),
          Expanded(
            child: GridView.builder(
              padding: const EdgeInsets.all(16),
              gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
                crossAxisCount: 2,
                crossAxisSpacing: 12,
                mainAxisSpacing: 12,
                childAspectRatio: 0.85,
              ),
              itemCount: achievements.length,
              itemBuilder: (context, i) => _AchievementCard(achievement: achievements[i]),
            ),
          ),
        ],
      ),
    );
  }
}

class _Achievement {
  final String title;
  final String description;
  final IconData icon;
  final int xp;
  final bool unlocked;
  final Color color;
  const _Achievement({required this.title, required this.description, required this.icon, required this.xp, required this.unlocked, required this.color});
}

class _AchievementCard extends StatelessWidget {
  final _Achievement achievement;
  const _AchievementCard({required this.achievement});

  @override
  Widget build(BuildContext context) {
    final unlocked = achievement.unlocked;
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: AppColors.backgroundCard,
        borderRadius: BorderRadius.circular(16),
        border: Border.all(
          color: unlocked ? achievement.color.withOpacity(0.4) : AppColors.border,
        ),
        boxShadow: unlocked
            ? [BoxShadow(color: achievement.color.withOpacity(0.1), blurRadius: 12, spreadRadius: 2)]
            : null,
      ),
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Container(
            width: 56,
            height: 56,
            decoration: BoxDecoration(
              color: unlocked ? achievement.color.withOpacity(0.15) : AppColors.backgroundElevated,
              shape: BoxShape.circle,
            ),
            child: Icon(
              achievement.icon,
              color: unlocked ? achievement.color : AppColors.textHint,
              size: 30,
            ),
          ),
          const SizedBox(height: 10),
          Text(
            achievement.title,
            style: TextStyle(
              fontSize: 14,
              fontWeight: FontWeight.bold,
              color: unlocked ? AppColors.textPrimary : AppColors.textHint,
            ),
            textAlign: TextAlign.center,
          ),
          const SizedBox(height: 4),
          Text(
            achievement.description,
            style: const TextStyle(fontSize: 11, color: AppColors.textHint),
            textAlign: TextAlign.center,
            maxLines: 2,
            overflow: TextOverflow.ellipsis,
          ),
          const SizedBox(height: 8),
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 3),
            decoration: BoxDecoration(
              color: unlocked ? achievement.color.withOpacity(0.15) : AppColors.backgroundElevated,
              borderRadius: BorderRadius.circular(12),
            ),
            child: Row(
              mainAxisSize: MainAxisSize.min,
              children: [
                Icon(Icons.star, size: 12, color: unlocked ? achievement.color : AppColors.textHint),
                const SizedBox(width: 3),
                Text('${achievement.xp} XP', style: TextStyle(fontSize: 12, fontWeight: FontWeight.bold, color: unlocked ? achievement.color : AppColors.textHint)),
              ],
            ),
          ),
          if (!unlocked) ...[
            const SizedBox(height: 4),
            const Icon(Icons.lock, size: 14, color: AppColors.textHint),
          ],
        ],
      ),
    );
  }
}

class _XPStat extends StatelessWidget {
  final String label;
  final String value;
  final IconData icon;
  final Color color;
  const _XPStat({required this.label, required this.value, required this.icon, required this.color});

  @override
  Widget build(BuildContext context) {
    return Column(
      children: [
        Icon(icon, color: color, size: 26),
        const SizedBox(height: 4),
        Text(value, style: TextStyle(fontSize: 20, fontWeight: FontWeight.bold, color: color)),
        Text(label, style: const TextStyle(fontSize: 12, color: AppColors.textSecondary)),
      ],
    );
  }
}
