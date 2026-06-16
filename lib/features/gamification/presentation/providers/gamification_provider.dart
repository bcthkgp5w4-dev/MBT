import 'package:cloud_firestore/cloud_firestore.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../data/repositories/gamification_repository_impl.dart';
import '../../domain/entities/gamification_entity.dart';
import '../../../auth/presentation/providers/auth_provider.dart';

final gamificationRepositoryProvider = Provider((ref) =>
    GamificationRepositoryImpl(FirebaseFirestore.instance));

final userGamificationProvider = FutureProvider<GamificationEntity?>((ref) async {
  final user = ref.watch(currentUserProvider);
  if (user == null) return null;
  final result = await ref
      .watch(gamificationRepositoryProvider)
      .getUserGamification(user.id);
  return result.fold((l) => null, (r) => r);
});

final leaderboardProvider = StreamProvider<List<GamificationEntity>>((ref) {
  return ref.watch(gamificationRepositoryProvider).getLeaderboard();
});
