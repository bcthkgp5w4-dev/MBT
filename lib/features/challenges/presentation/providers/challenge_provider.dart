import 'package:cloud_firestore/cloud_firestore.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../data/repositories/challenge_repository_impl.dart';
import '../../domain/entities/challenge_entity.dart';
import '../../../auth/presentation/providers/auth_provider.dart';

final challengeRepositoryProvider = Provider((ref) =>
    ChallengeRepositoryImpl(FirebaseFirestore.instance));

final challengesProvider = StreamProvider<List<ChallengeEntity>>((ref) {
  return ref.watch(challengeRepositoryProvider).getChallenges();
});

final userChallengesProvider = StreamProvider<List<ChallengeEntity>>((ref) {
  final user = ref.watch(currentUserProvider);
  if (user == null) return const Stream.empty();
  return ref.watch(challengeRepositoryProvider).getUserChallenges(user.id);
});
