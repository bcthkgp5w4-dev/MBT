import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import '../../../../core/constants/app_colors.dart';

class ChallengesScreen extends ConsumerStatefulWidget {
  const ChallengesScreen({super.key});

  @override
  ConsumerState<ChallengesScreen> createState() => _ChallengesScreenState();
}

class _ChallengesScreenState extends ConsumerState<ChallengesScreen>
    with SingleTickerProviderStateMixin {
  late TabController _tabController;

  @override
  void initState() {
    super.initState();
    _tabController = TabController(length: 3, vsync: this);
  }

  @override
  void dispose() {
    _tabController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.backgroundDark,
      appBar: AppBar(
        title: const Text('Challenges', style: TextStyle(fontWeight: FontWeight.bold)),
        backgroundColor: AppColors.backgroundDark,
        actions: [
          IconButton(icon: const Icon(Icons.add_circle_outline), onPressed: () {}),
        ],
        bottom: TabBar(
          controller: _tabController,
          indicatorColor: AppColors.primary,
          labelColor: AppColors.primary,
          unselectedLabelColor: AppColors.textHint,
          tabs: const [
            Tab(text: 'Active'),
            Tab(text: 'Browse'),
            Tab(text: 'Completed'),
          ],
        ),
      ),
      body: TabBarView(
        controller: _tabController,
        children: [
          _ActiveChallengesTab(),
          _BrowseChallengesTab(),
          _CompletedChallengesTab(),
        ],
      ),
    );
  }
}

class _ActiveChallengesTab extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Center(
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          const Icon(Icons.emoji_events_outlined, size: 60, color: AppColors.textHint),
          const SizedBox(height: 16),
          const Text('No active challenges', style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold, color: AppColors.textPrimary)),
          const SizedBox(height: 8),
          const Text('Join a challenge to compete with friends', style: TextStyle(color: AppColors.textSecondary)),
          const SizedBox(height: 24),
          ElevatedButton(
            onPressed: () {},
            style: ElevatedButton.styleFrom(backgroundColor: AppColors.primary),
            child: const Text('Browse Challenges', style: TextStyle(color: Colors.white)),
          ),
        ],
      ),
    );
  }
}

class _BrowseChallengesTab extends StatelessWidget {
  final _sampleChallenges = const [
    {'title': '30-Day Morning Run', 'category': 'Fitness', 'participants': 342, 'days': 30, 'icon': Icons.directions_run},
    {'title': '21-Day Meditation', 'category': 'Mindfulness', 'participants': 891, 'days': 21, 'icon': Icons.self_improvement},
    {'title': '100 Days of Code', 'category': 'Learning', 'participants': 2104, 'days': 100, 'icon': Icons.code},
    {'title': 'No Sugar November', 'category': 'Nutrition', 'participants': 567, 'days': 30, 'icon': Icons.no_food},
    {'title': '7-Day Sleep Reset', 'category': 'Sleep', 'participants': 234, 'days': 7, 'icon': Icons.bedtime},
  ];

  @override
  Widget build(BuildContext context) {
    return ListView.separated(
      padding: const EdgeInsets.all(16),
      itemCount: _sampleChallenges.length,
      separatorBuilder: (_, __) => const SizedBox(height: 12),
      itemBuilder: (context, i) {
        final c = _sampleChallenges[i];
        return _ChallengeCard(
          title: c['title'] as String,
          category: c['category'] as String,
          participants: c['participants'] as int,
          days: c['days'] as int,
          icon: c['icon'] as IconData,
          onTap: () => context.push('/challenge/${i + 1}'),
        );
      },
    );
  }
}

class _ChallengeCard extends StatelessWidget {
  final String title;
  final String category;
  final int participants;
  final int days;
  final IconData icon;
  final VoidCallback onTap;

  const _ChallengeCard({
    required this.title,
    required this.category,
    required this.participants,
    required this.days,
    required this.icon,
    required this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: onTap,
      child: Container(
        padding: const EdgeInsets.all(16),
        decoration: BoxDecoration(
          color: AppColors.backgroundCard,
          borderRadius: BorderRadius.circular(16),
          border: Border.all(color: AppColors.border),
        ),
        child: Row(
          children: [
            Container(
              width: 52,
              height: 52,
              decoration: BoxDecoration(
                color: AppColors.primary.withOpacity(0.15),
                borderRadius: BorderRadius.circular(14),
              ),
              child: Icon(icon, color: AppColors.primary, size: 28),
            ),
            const SizedBox(width: 14),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(title, style: const TextStyle(fontSize: 15, fontWeight: FontWeight.bold, color: AppColors.textPrimary)),
                  const SizedBox(height: 4),
                  Row(
                    children: [
                      Container(
                        padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 2),
                        decoration: BoxDecoration(
                          color: AppColors.primary.withOpacity(0.1),
                          borderRadius: BorderRadius.circular(6),
                        ),
                        child: Text(category, style: const TextStyle(fontSize: 11, color: AppColors.primary)),
                      ),
                      const SizedBox(width: 8),
                      const Icon(Icons.people_outline, size: 13, color: AppColors.textHint),
                      const SizedBox(width: 3),
                      Text('$participants', style: const TextStyle(fontSize: 12, color: AppColors.textHint)),
                      const SizedBox(width: 8),
                      const Icon(Icons.calendar_today_outlined, size: 13, color: AppColors.textHint),
                      const SizedBox(width: 3),
                      Text('$days days', style: const TextStyle(fontSize: 12, color: AppColors.textHint)),
                    ],
                  ),
                ],
              ),
            ),
            const Icon(Icons.chevron_right, color: AppColors.textHint),
          ],
        ),
      ),
    );
  }
}

class _CompletedChallengesTab extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return const Center(
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Icon(Icons.check_circle_outline, size: 60, color: AppColors.textHint),
          SizedBox(height: 16),
          Text('No completed challenges yet', style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold, color: AppColors.textPrimary)),
          SizedBox(height: 8),
          Text('Complete your first challenge to see it here', style: TextStyle(color: AppColors.textSecondary)),
        ],
      ),
    );
  }
}
