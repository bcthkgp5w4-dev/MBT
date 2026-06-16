import 'package:equatable/equatable.dart';

class CommunityEntity extends Equatable {
  final String id;
  final String name;
  final String description;
  final String emoji;
  final String coverImageUrl;
  final int memberCount;
  final List<String> habitCategories;
  final bool isPublic;
  final String createdBy;
  final DateTime createdAt;

  const CommunityEntity({
    required this.id,
    required this.name,
    required this.description,
    required this.emoji,
    required this.coverImageUrl,
    required this.memberCount,
    required this.habitCategories,
    required this.isPublic,
    required this.createdBy,
    required this.createdAt,
  });

  @override
  List<Object?> get props => [id, name, memberCount];
}
