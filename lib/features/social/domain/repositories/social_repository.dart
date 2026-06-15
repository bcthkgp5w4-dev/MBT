import 'package:dartz/dartz.dart';
import '../../../../core/errors/failures.dart';
import '../entities/community_entity.dart';
import '../entities/partner_streak_entity.dart';
import '../entities/post_entity.dart';

abstract class SocialRepository {
  Stream<List<CommunityEntity>> getCommunities();
  Future<Either<Failure, void>> joinCommunity(String communityId, String userId);
  Stream<List<PostEntity>> getCommunityPosts(String communityId);
  Future<Either<Failure, void>> createPost(PostEntity post);
  Future<Either<Failure, void>> likePost(String postId, String userId);
  Stream<List<PartnerStreakEntity>> getPartnerStreaks(String userId);
  Future<Either<Failure, void>> invitePartner(String habitId, String inviteeEmail, String inviterId);
}
