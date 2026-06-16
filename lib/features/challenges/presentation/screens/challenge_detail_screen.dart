import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../../../core/constants/app_colors.dart';

class ChallengeDetailScreen extends ConsumerWidget {
  final String challengeId;
  const ChallengeDetailScreen({super.key, required this.challengeId});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    return Scaffold(
      backgroundColor: AppColors.backgroundDark,
      body: CustomScrollView(
        slivers: [
          SliverAppBar(
            expandedHeight: 200,
            pinned: true,
            backgroundColor: AppColors.backgroundDark,
            flexibleSpace: FlexibleSpaceBar(
              title: const Text('Challenge', style: TextStyle(fontWeight: FontWeight.bold)),
              background: Container(
                decoration: const BoxDecoration(gradient: AppColors.primaryGradient),
                child: const Center(
                  child: Icon(Icons.emoji_events, size: 80, color: Colors.white),
                ),
              ),
            ),
          ),
          SliverToBoxAdapter(
            child: Padding(
              padding: const EdgeInsets.all(20),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text('Challenge #$challengeId', style: const TextStyle(fontSize: 24, fontWeight: FontWeight.bold, color: AppColors.textPrimary)),
                  const SizedBox(height: 8),
                  const Text('Join this challenge and build a life-changing habit with others.', style: TextStyle(color: AppColors.textSecondary, fontSize: 15)),
                  const SizedBox(height: 24),
                  // Stats Row
                  Row(
                    children: [
                      _ChallengeStatCard(label: 'Duration', value: '30 days', icon: Icons.calendar_today_outlined),
                      const SizedBox(width: 12),
                      _ChallengeStatCard(label: 'Participants', value: '0', icon: Icons.people_outline),
                      const SizedBox(width: 12),
                      _ChallengeStatCard(label: 'XP Reward', value: '500', icon: Icons.star_outline),
                    ],
                  ),
                  const SizedBox(height: 24),
                  const Text('About', style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold, color: AppColors.textPrimary)),
                  const SizedBox(height: 8),
                  const Text(
                    'This challenge is designed to help you build a consistent habit over 30 days. Track your progress daily and compete with other participants on the leaderboard.',
                    style: TextStyle(color: AppColors.textSecondary, fontSize: 14, height: 1.6),
                  ),
                  const SizedBox(height: 24),
                  const Text('Rules', style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold, color: AppColors.textPrimary)),
                  const SizedBox(height: 8),
                  _RuleItem(text: 'Complete the habit every day'),
                  _RuleItem(text: 'Log your activity before midnight'),
                  _RuleItem(text: 'Missing a day resets your streak'),
                  _RuleItem(text: 'Encourage other participants'),
                  const SizedBox(height: 32),
                  SizedBox(
                    width: double.infinity,
                    child: ElevatedButton(
                      onPressed: () {},
                      style: ElevatedButton.styleFrom(
                        backgroundColor: AppColors.primary,
                        padding: const EdgeInsets.symmetric(vertical: 16),
                        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(14)),
                      ),
                      child: const Text('Join Challenge', style: TextStyle(color: Colors.white, fontSize: 16, fontWeight: FontWeight.bold)),
                    ),
                  ),
                  const SizedBox(height: 24),
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }
}

class _ChallengeStatCard extends StatelessWidget {
  final String label;
  final String value;
  final IconData icon;
  const _ChallengeStatCard({required this.label, required this.value, required this.icon});

  @override
  Widget build(BuildContext context) {
    return Expanded(
      child: Container(
        padding: const EdgeInsets.all(12),
        decoration: BoxDecoration(
          color: AppColors.backgroundCard,
          borderRadius: BorderRadius.circular(14),
          border: Border.all(color: AppColors.border),
        ),
        child: Column(
          children: [
            Icon(icon, color: AppColors.primary, size: 22),
            const SizedBox(height: 6),
            Text(value, style: const TextStyle(fontSize: 15, fontWeight: FontWeight.bold, color: AppColors.textPrimary)),
            Text(label, style: const TextStyle(fontSize: 11, color: AppColors.textHint), textAlign: TextAlign.center),
          ],
        ),
      ),
    );
  }
}

class _RuleItem extends StatelessWidget {
  final String text;
  const _RuleItem({required this.text});

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 8),
      child: Row(
        children: [
          const Icon(Icons.check_circle, color: AppColors.success, size: 18),
          const SizedBox(width: 10),
          Expanded(child: Text(text, style: const TextStyle(color: AppColors.textSecondary, fontSize: 14))),
        ],
      ),
    );
  }
}
