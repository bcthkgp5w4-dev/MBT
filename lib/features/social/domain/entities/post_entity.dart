import 'package:equatable/equatable.dart';

class PostEntity extends Equatable {
  final String id;
  final String communityId;
  final String userId;
  final String userName;
  final String? userAvatar;
  final String content;
  final String? imageUrl;
  final int likeCount;
  final int commentCount;
  final DateTime createdAt;
  final List<String> likedBy;

  const PostEntity({
    required this.id,
    required this.communityId,
    required this.userId,
    required this.userName,
    this.userAvatar,
    required this.content,
    this.imageUrl,
    required this.likeCount,
    required this.commentCount,
    required this.createdAt,
    required this.likedBy,
  });

  @override
  List<Object?> get props => [id, likeCount, commentCount];
}
