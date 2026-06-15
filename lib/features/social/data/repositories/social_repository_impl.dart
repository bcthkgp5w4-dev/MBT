import 'package:cloud_firestore/cloud_firestore.dart';
import 'package:dartz/dartz.dart';
import '../../../../core/errors/failures.dart';
import '../../domain/entities/community_entity.dart';
import '../../domain/entities/partner_streak_entity.dart';
import '../../domain/entities/post_entity.dart';
import '../../domain/repositories/social_repository.dart';
import '../models/community_model.dart';
import '../models/partner_streak_model.dart';

class SocialRepositoryImpl implements SocialRepository {
  final FirebaseFirestore firestore;
  SocialRepositoryImpl(this.firestore);

  @override
  Stream<List<CommunityEntity>> getCommunities() {
    return firestore
        .collection('communities')
        .where('isPublic', isEqualTo: true)
        .orderBy('memberCount', descending: true)
        .snapshots()
        .map((s) => s.docs.map((d) => CommunityModel.fromFirestore(d)).toList());
  }

  @override
  Future<Either<Failure, void>> joinCommunity(String communityId, String userId) async {
    try {
      final batch = firestore.batch();
      batch.update(firestore.collection('communities').doc(communityId), {
        'memberCount': FieldValue.increment(1),
        'members': FieldValue.arrayUnion([userId]),
      });
      batch.set(
        firestore.collection('community_members').doc('${communityId}_$userId'),
        {
          'communityId': communityId,
          'userId': userId,
          'joinedAt': FieldValue.serverTimestamp(),
        },
      );
      await batch.commit();
      return const Right(null);
    } catch (e) {
      return Left(ServerFailure(e.toString()));
    }
  }

  @override
  Stream<List<PostEntity>> getCommunityPosts(String communityId) {
    return firestore
        .collection('posts')
        .where('communityId', isEqualTo: communityId)
        .orderBy('createdAt', descending: true)
        .limit(50)
        .snapshots()
        .map((s) => s.docs.map((d) {
              final data = d.data();
              return PostEntity(
                id: d.id,
                communityId: data['communityId'] ?? '',
                userId: data['userId'] ?? '',
                userName: data['userName'] ?? 'User',
                userAvatar: data['userAvatar'],
                content: data['content'] ?? '',
                imageUrl: data['imageUrl'],
                likeCount: data['likeCount'] ?? 0,
                commentCount: data['commentCount'] ?? 0,
                createdAt: (data['createdAt'] as Timestamp).toDate(),
                likedBy: List<String>.from(data['likedBy'] ?? []),
              );
            }).toList());
  }

  @override
  Future<Either<Failure, void>> createPost(PostEntity post) async {
    try {
      await firestore.collection('posts').add({
        'communityId': post.communityId,
        'userId': post.userId,
        'userName': post.userName,
        'userAvatar': post.userAvatar,
        'content': post.content,
        'imageUrl': post.imageUrl,
        'likeCount': 0,
        'commentCount': 0,
        'createdAt': FieldValue.serverTimestamp(),
        'likedBy': [],
      });
      return const Right(null);
    } catch (e) {
      return Left(ServerFailure(e.toString()));
    }
  }

  @override
  Future<Either<Failure, void>> likePost(String postId, String userId) async {
    try {
      await firestore.collection('posts').doc(postId).update({
        'likeCount': FieldValue.increment(1),
        'likedBy': FieldValue.arrayUnion([userId]),
      });
      return const Right(null);
    } catch (e) {
      return Left(ServerFailure(e.toString()));
    }
  }

  @override
  Stream<List<PartnerStreakEntity>> getPartnerStreaks(String userId) {
    return firestore
        .collection('partner_streaks')
        .where('userIds', arrayContains: userId)
        .where('isActive', isEqualTo: true)
        .snapshots()
        .map((s) => s.docs.map((d) => PartnerStreakModel.fromFirestore(d)).toList());
  }

  @override
  Future<Either<Failure, void>> invitePartner(
      String habitId, String inviteeEmail, String inviterId) async {
    try {
      await firestore.collection('partner_invites').add({
        'habitId': habitId,
        'inviteeEmail': inviteeEmail,
        'inviterId': inviterId,
        'status': 'pending',
        'createdAt': FieldValue.serverTimestamp(),
      });
      return const Right(null);
    } catch (e) {
      return Left(ServerFailure(e.toString()));
    }
  }
}
