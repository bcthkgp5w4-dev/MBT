import 'package:cloud_firestore/cloud_firestore.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../data/repositories/social_repository_impl.dart';
import '../../domain/entities/community_entity.dart';
import '../../domain/entities/partner_streak_entity.dart';
import '../../domain/entities/post_entity.dart';
import '../../../auth/presentation/providers/auth_provider.dart';

final socialRepositoryProvider = Provider((ref) =>
    SocialRepositoryImpl(FirebaseFirestore.instance));

final communitiesProvider = StreamProvider<List<CommunityEntity>>((ref) {
  return ref.watch(socialRepositoryProvider).getCommunities();
});

final communityPostsProvider =
    StreamProvider.family<List<PostEntity>, String>((ref, communityId) {
  return ref.watch(socialRepositoryProvider).getCommunityPosts(communityId);
});

final partnerStreaksProvider = StreamProvider<List<PartnerStreakEntity>>((ref) {
  final user = ref.watch(currentUserProvider);
  if (user == null) return const Stream.empty();
  return ref.watch(socialRepositoryProvider).getPartnerStreaks(user.id);
});
