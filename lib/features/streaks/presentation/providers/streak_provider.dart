import 'package:cloud_firestore/cloud_firestore.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../data/repositories/streak_repository_impl.dart';
import '../../domain/entities/streak_entity.dart';
import '../../../auth/presentation/providers/auth_provider.dart';

final streakRepositoryProvider = Provider((ref) =>
    StreakRepositoryImpl(FirebaseFirestore.instance));

final streakProvider = FutureProvider.family<StreakEntity?, String>((ref, habitId) async {
  final user = ref.watch(currentUserProvider);
  if (user == null) return null;
  final repo = ref.watch(streakRepositoryProvider);
  final result = await repo.getStreak(habitId, user.id);
  return result.fold((l) => null, (r) => r);
});
