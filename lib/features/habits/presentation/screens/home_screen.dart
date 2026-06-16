import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:flutter_animate/flutter_animate.dart';
import '../../../../core/constants/app_colors.dart';
import '../../../../core/constants/app_constants.dart';
import '../../../auth/presentation/providers/auth_provider.dart';

class HomeScreen extends ConsumerWidget {
  const HomeScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final user = ref.watch(currentUserProvider);

    return Scaffold(
      backgroundColor: AppColors.backgroundDark,
      appBar: AppBar(
        title: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              'Good ${_greeting()}, ${user?.displayName?.split(' ').first ?? 'Tribler'}!',
              style: const TextStyle(fontSize: 18, fontWeight: FontWeight.bold, color: AppColors.textPrimary),
            ),
            const Text('Keep the streak alive 🔥', style: TextStyle(fontSize: 12, color: AppColors.textSecondary)),
          ],
        ),
        centerTitle: false,
        actions: [
          IconButton(
            icon: const Icon(Icons.notifications_outlined, color: AppColors.textPrimary),
            onPressed: () {},
          ),
          GestureDetector(
            onTap: () {},
            child: CircleAvatar(
              radius: 18,
              backgroundColor: AppColors.primary.withOpacity(0.2),
              backgroundImage: user?.photoUrl != null ? NetworkImage(user!.photoUrl!) : null,
              child: user?.photoUrl == null
                  ? const Icon(Icons.person, color: AppColors.primary, size: 20)
                  : null,
            ),
          ),
          const SizedBox(width: 16),
        ],
      ),
      body: RefreshIndicator(
        color: AppColors.primary,
        onRefresh: () async {},
        child: SingleChildScrollView(
          physics: const AlwaysScrollableScrollPhysics(),
          padding: const EdgeInsets.all(16),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              // Streak Card
              _StreakCard(currentStreak: user?.currentStreak ?? 0)
                  .animate()
                  .fadeIn(duration: 400.ms)
                  .slideY(begin: 0.2, end: 0),
              const SizedBox(height: 20),
              // Today's Progress
              _SectionHeader(title: "Today's Habits", onSeeAll: () {}),
              const SizedBox(height: 12),
              _EmptyHabitsCard(onAdd: () => context.push('/create-habit'))
                  .animate()
                  .fadeIn(delay: 200.ms),
              const SizedBox(height: 20),
              // Quick Stats
              _SectionHeader(title: 'Quick Stats', onSeeAll: () => context.go('/analytics')),
              const SizedBox(height: 12),
              _QuickStatsRow(
                totalXP: user?.totalXP ?? 0,
                level: user?.level ?? 1,
                longestStreak: user?.longestStreak ?? 0,
              ).animate().fadeIn(delay: 300.ms),
              const SizedBox(height: 20),
              // Tribe Activity
              _SectionHeader(title: 'Tribe Activity', onSeeAll: () => context.go('/social')),
              const SizedBox(height: 12),
              _TribeActivityPlaceholder().animate().fadeIn(delay: 400.ms),
              const SizedBox(height: 80),
            ],
          ),
        ),
      ),
      floatingActionButton: FloatingActionButton.extended(
        onPressed: () => context.push('/create-habit'),
        backgroundColor: AppColors.primary,
        icon: const Icon(Icons.add, color: Colors.white),
        label: const Text('New Habit', style: TextStyle(color: Colors.white, fontWeight: FontWeight.w600)),
      ),
    );
  }

  String _greeting() {
    final hour = DateTime.now().hour;
    if (hour < 12) return 'morning';
    if (hour < 17) return 'afternoon';
    return 'evening';
  }
}

class _StreakCard extends StatelessWidget {
  final int currentStreak;
  const _StreakCard({required this.currentStreak});

  @override
  Widget build(BuildContext context) {
    return Container(
      width: double.infinity,
      padding: const EdgeInsets.all(20),
      decoration: BoxDecoration(
        gradient: const LinearGradient(
          colors: [Color(0xFF1A0A00), Color(0xFF2D1200)],
          begin: Alignment.topLeft,
          end: Alignment.bottomRight,
        ),
        borderRadius: BorderRadius.circular(20),
        border: Border.all(color: AppColors.primary.withOpacity(0.3)),
      ),
      child: Row(
        children: [
          Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              const Text('Current Streak', style: TextStyle(color: AppColors.textSecondary, fontSize: 14)),
              const SizedBox(height: 4),
              Row(
                children: [
                  Text(
                    '$currentStreak',
                    style: const TextStyle(
                      fontSize: 48,
                      fontWeight: FontWeight.bold,
                      color: AppColors.streakFire,
                    ),
                  ),
                  const SizedBox(width: 8),
                  const Text('days', style: TextStyle(fontSize: 18, color: AppColors.textSecondary)),
                ],
              ),
              const Text('Keep going! You\'re on fire 🔥', style: TextStyle(color: AppColors.textHint, fontSize: 12)),
            ],
          ),
          const Spacer(),
          const Icon(Icons.local_fire_department, size: 64, color: AppColors.streakFire),
        ],
      ),
    );
  }
}

class _SectionHeader extends StatelessWidget {
  final String title;
  final VoidCallback? onSeeAll;
  const _SectionHeader({required this.title, this.onSeeAll});

  @override
  Widget build(BuildContext context) {
    return Row(
      mainAxisAlignment: MainAxisAlignment.spaceBetween,
      children: [
        Text(title, style: const TextStyle(fontSize: 18, fontWeight: FontWeight.bold, color: AppColors.textPrimary)),
        if (onSeeAll != null)
          TextButton(
            onPressed: onSeeAll,
            child: const Text('See All', style: TextStyle(color: AppColors.primary, fontSize: 14)),
          ),
      ],
    );
  }
}

class _EmptyHabitsCard extends StatelessWidget {
  final VoidCallback onAdd;
  const _EmptyHabitsCard({required this.onAdd});

  @override
  Widget build(BuildContext context) {
    return Container(
      width: double.infinity,
      padding: const EdgeInsets.all(24),
      decoration: BoxDecoration(
        color: AppColors.backgroundCard,
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: AppColors.border),
      ),
      child: Column(
        children: [
          const Icon(Icons.add_circle_outline, size: 48, color: AppColors.textHint),
          const SizedBox(height: 12),
          const Text('No habits yet', style: TextStyle(fontSize: 16, fontWeight: FontWeight.w600, color: AppColors.textPrimary)),
          const SizedBox(height: 4),
          const Text('Start building your first habit', style: TextStyle(fontSize: 14, color: AppColors.textSecondary)),
          const SizedBox(height: 16),
          ElevatedButton(
            onPressed: onAdd,
            style: ElevatedButton.styleFrom(
              backgroundColor: AppColors.primary,
              shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
            ),
            child: const Text('Create Habit', style: TextStyle(color: Colors.white)),
          ),
        ],
      ),
    );
  }
}

class _QuickStatsRow extends StatelessWidget {
  final int totalXP;
  final int level;
  final int longestStreak;
  const _QuickStatsRow({required this.totalXP, required this.level, required this.longestStreak});

  @override
  Widget build(BuildContext context) {
    return Row(
      children: [
        _StatCard(label: 'Total XP', value: '$totalXP', icon: Icons.star_rounded, color: AppColors.streakGold),
        const SizedBox(width: 12),
        _StatCard(label: 'Level', value: '$level', icon: Icons.military_tech_rounded, color: AppColors.primary),
        const SizedBox(width: 12),
        _StatCard(label: 'Best Streak', value: '$longestStreak', icon: Icons.local_fire_department, color: AppColors.streakFire),
      ],
    );
  }
}

class _StatCard extends StatelessWidget {
  final String label;
  final String value;
  final IconData icon;
  final Color color;
  const _StatCard({required this.label, required this.value, required this.icon, required this.color});

  @override
  Widget build(BuildContext context) {
    return Expanded(
      child: Container(
        padding: const EdgeInsets.all(14),
        decoration: BoxDecoration(
          color: AppColors.backgroundCard,
          borderRadius: BorderRadius.circular(14),
          border: Border.all(color: color.withOpacity(0.2)),
        ),
        child: Column(
          children: [
            Icon(icon, color: color, size: 24),
            const SizedBox(height: 6),
            Text(value, style: TextStyle(fontSize: 20, fontWeight: FontWeight.bold, color: color)),
            Text(label, style: const TextStyle(fontSize: 11, color: AppColors.textHint)),
          ],
        ),
      ),
    );
  }
}

class _TribeActivityPlaceholder extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Container(
      width: double.infinity,
      padding: const EdgeInsets.all(20),
      decoration: BoxDecoration(
        color: AppColors.backgroundCard,
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: AppColors.border),
      ),
      child: const Column(
        children: [
          Icon(Icons.people_outline, size: 40, color: AppColors.textHint),
          SizedBox(height: 8),
          Text('Connect with friends to see their activity', style: TextStyle(color: AppColors.textSecondary, fontSize: 14), textAlign: TextAlign.center),
        ],
      ),
    );
  }
}
