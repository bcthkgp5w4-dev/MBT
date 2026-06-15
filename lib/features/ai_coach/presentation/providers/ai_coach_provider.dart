import 'package:cloud_firestore/cloud_firestore.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../../auth/presentation/providers/auth_provider.dart';

class CoachMessage {
  final String message;
  final String type; // motivation, suggestion, warning, praise
  final DateTime timestamp;

  const CoachMessage({
    required this.message,
    required this.type,
    required this.timestamp,
  });
}

final aiCoachProvider = FutureProvider<List<CoachMessage>>((ref) async {
  final user = ref.watch(currentUserProvider);
  if (user == null) return [];

  final firestore = FirebaseFirestore.instance;
  final habitsSnap = await firestore
      .collection('habits')
      .where('userId', isEqualTo: user.id)
      .where('isActive', isEqualTo: true)
      .get();

  final messages = <CoachMessage>[];
  final now = DateTime.now();

  for (final doc in habitsSnap.docs) {
    final data = doc.data();
    final streak = (data['currentStreak'] as int?) ?? 0;
    final title = data['title'] as String? ?? '';
    final emoji = data['emoji'] as String? ?? '⭐';

    if (streak == 0) {
      messages.add(CoachMessage(
        message:
            'Start your $emoji $title streak today! Every habit master began with day 1. 💪',
        type: 'motivation',
        timestamp: now,
      ));
    } else if (streak >= 7 && streak < 30) {
      messages.add(CoachMessage(
        message:
            '🔥 $streak days on $title! You\'re building a real habit. Keep the momentum going!',
        type: 'praise',
        timestamp: now,
      ));
    } else if (streak >= 30) {
      messages.add(CoachMessage(
        message:
            '👑 Incredible! $streak days of $title. You\'re in the top 5% of habit builders!',
        type: 'praise',
        timestamp: now,
      ));
    }
  }

  if (messages.isEmpty) {
    messages.add(CoachMessage(
      message:
          'Create your first habit and start your journey to becoming the best version of yourself! 🚀',
      type: 'suggestion',
      timestamp: now,
    ));
  }

  messages.add(CoachMessage(
    message:
        'Pro tip: The best time to build a habit is to stack it right after an existing one. What habit can you link to your morning routine?',
    type: 'suggestion',
    timestamp: now,
  ));

  return messages;
});
