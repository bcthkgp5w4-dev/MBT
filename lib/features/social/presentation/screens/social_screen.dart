import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import '../../../../core/constants/app_colors.dart';

class SocialScreen extends ConsumerStatefulWidget {
  const SocialScreen({super.key});

  @override
  ConsumerState<SocialScreen> createState() => _SocialScreenState();
}

class _SocialScreenState extends ConsumerState<SocialScreen>
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
        title: const Text('Social', style: TextStyle(fontWeight: FontWeight.bold)),
        backgroundColor: AppColors.backgroundDark,
        actions: [
          IconButton(icon: const Icon(Icons.person_add_outlined), onPressed: () {}),
          IconButton(icon: const Icon(Icons.search), onPressed: () {}),
        ],
        bottom: TabBar(
          controller: _tabController,
          indicatorColor: AppColors.primary,
          labelColor: AppColors.primary,
          unselectedLabelColor: AppColors.textHint,
          tabs: const [
            Tab(text: 'Feed'),
            Tab(text: 'Friends'),
            Tab(text: 'Communities'),
          ],
        ),
      ),
      body: TabBarView(
        controller: _tabController,
        children: [
          _FeedTab(),
          _FriendsTab(),
          _CommunitiesTab(),
        ],
      ),
    );
  }
}

class _FeedTab extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return ListView(
      padding: const EdgeInsets.all(16),
      children: [
        _ActivityCard(
          name: 'Alex Johnson',
          action: 'completed Morning Run',
          streak: 14,
          timeAgo: '2m ago',
          avatarColor: AppColors.primary,
        ),
        const SizedBox(height: 12),
        _ActivityCard(
          name: 'Sara Williams',
          action: 'hit a 30-day streak on Meditation!',
          streak: 30,
          timeAgo: '15m ago',
          avatarColor: AppColors.secondary,
          isMilestone: true,
        ),
        const SizedBox(height: 12),
        _ActivityCard(
          name: 'Mike Chen',
          action: 'joined the 30-Day Fitness Challenge',
          streak: 5,
          timeAgo: '1h ago',
          avatarColor: const Color(0xFF4CAF50),
        ),
        const SizedBox(height: 20),
        Center(
          child: TextButton(
            onPressed: () {},
            child: const Text('Load more', style: TextStyle(color: AppColors.primary)),
          ),
        ),
      ],
    );
  }
}

class _ActivityCard extends StatelessWidget {
  final String name;
  final String action;
  final int streak;
  final String timeAgo;
  final Color avatarColor;
  final bool isMilestone;

  const _ActivityCard({
    required this.name,
    required this.action,
    required this.streak,
    required this.timeAgo,
    required this.avatarColor,
    this.isMilestone = false,
  });

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: AppColors.backgroundCard,
        borderRadius: BorderRadius.circular(16),
        border: Border.all(
          color: isMilestone ? AppColors.streakGold.withOpacity(0.4) : AppColors.border,
        ),
      ),
      child: Column(
        children: [
          Row(
            children: [
              CircleAvatar(
                radius: 20,
                backgroundColor: avatarColor.withOpacity(0.2),
                child: Text(name[0], style: TextStyle(color: avatarColor, fontWeight: FontWeight.bold)),
              ),
              const SizedBox(width: 12),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    RichText(
                      text: TextSpan(
                        children: [
                          TextSpan(text: name, style: const TextStyle(fontWeight: FontWeight.bold, color: AppColors.textPrimary, fontSize: 14)),
                          TextSpan(text: ' $action', style: const TextStyle(color: AppColors.textSecondary, fontSize: 14)),
                        ],
                      ),
                    ),
                    const SizedBox(height: 2),
                    Row(
                      children: [
                        const Icon(Icons.local_fire_department, size: 12, color: AppColors.streakFire),
                        const SizedBox(width: 2),
                        Text('$streak day streak', style: const TextStyle(fontSize: 11, color: AppColors.textHint)),
                        const SizedBox(width: 8),
                        Text(timeAgo, style: const TextStyle(fontSize: 11, color: AppColors.textHint)),
                      ],
                    ),
                  ],
                ),
              ),
              if (isMilestone)
                const Icon(Icons.emoji_events, color: AppColors.streakGold, size: 22),
            ],
          ),
          const SizedBox(height: 12),
          Row(
            children: [
              _ReactionButton(icon: Icons.favorite_outline, label: 'Like', count: 0),
              const SizedBox(width: 16),
              _ReactionButton(icon: Icons.emoji_emotions_outlined, label: 'Cheer', count: 0),
              const SizedBox(width: 16),
              _ReactionButton(icon: Icons.comment_outlined, label: 'Comment', count: 0),
            ],
          ),
        ],
      ),
    );
  }
}

class _ReactionButton extends StatelessWidget {
  final IconData icon;
  final String label;
  final int count;
  const _ReactionButton({required this.icon, required this.label, required this.count});

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: () {},
      child: Row(
        children: [
          Icon(icon, size: 16, color: AppColors.textHint),
          const SizedBox(width: 4),
          Text('$label${count > 0 ? ' $count' : ''}', style: const TextStyle(fontSize: 12, color: AppColors.textHint)),
        ],
      ),
    );
  }
}

class _FriendsTab extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Center(
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          const Icon(Icons.people_outline, size: 60, color: AppColors.textHint),
          const SizedBox(height: 16),
          const Text('No friends yet', style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold, color: AppColors.textPrimary)),
          const SizedBox(height: 8),
          const Text('Invite friends to track habits together', style: TextStyle(color: AppColors.textSecondary)),
          const SizedBox(height: 24),
          ElevatedButton.icon(
            onPressed: () {},
            icon: const Icon(Icons.person_add, color: Colors.white),
            label: const Text('Invite Friends', style: TextStyle(color: Colors.white)),
            style: ElevatedButton.styleFrom(backgroundColor: AppColors.primary),
          ),
        ],
      ),
    );
  }
}

class _CommunitiesTab extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return ListView(
      padding: const EdgeInsets.all(16),
      children: [
        _CommunityCard(name: 'Morning Warriors', members: 1243, category: 'Fitness'),
        const SizedBox(height: 12),
        _CommunityCard(name: 'Mindful Readers', members: 876, category: 'Mindfulness'),
        const SizedBox(height: 12),
        _CommunityCard(name: 'Code Every Day', members: 2105, category: 'Learning'),
      ],
    );
  }
}

class _CommunityCard extends StatelessWidget {
  final String name;
  final int members;
  final String category;
  const _CommunityCard({required this.name, required this.members, required this.category});

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: AppColors.backgroundCard,
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: AppColors.border),
      ),
      child: Row(
        children: [
          Container(
            width: 48,
            height: 48,
            decoration: BoxDecoration(
              color: AppColors.primary.withOpacity(0.15),
              borderRadius: BorderRadius.circular(12),
            ),
            child: const Icon(Icons.groups_rounded, color: AppColors.primary),
          ),
          const SizedBox(width: 14),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(name, style: const TextStyle(fontSize: 15, fontWeight: FontWeight.bold, color: AppColors.textPrimary)),
                Text('$members members · $category', style: const TextStyle(fontSize: 12, color: AppColors.textSecondary)),
              ],
            ),
          ),
          OutlinedButton(
            onPressed: () {},
            style: OutlinedButton.styleFrom(
              side: const BorderSide(color: AppColors.primary),
              shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(8)),
              padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 6),
              minimumSize: Size.zero,
            ),
            child: const Text('Join', style: TextStyle(color: AppColors.primary, fontSize: 13)),
          ),
        ],
      ),
    );
  }
}
