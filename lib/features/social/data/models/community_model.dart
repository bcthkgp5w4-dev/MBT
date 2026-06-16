import 'package:cloud_firestore/cloud_firestore.dart';
import '../../domain/entities/community_entity.dart';

class CommunityModel extends CommunityEntity {
  const CommunityModel({
    required super.id,
    required super.name,
    required super.description,
    required super.emoji,
    required super.coverImageUrl,
    required super.memberCount,
    required super.habitCategories,
    required super.isPublic,
    required super.createdBy,
    required super.createdAt,
  });

  factory CommunityModel.fromFirestore(DocumentSnapshot doc) {
    final d = doc.data() as Map<String, dynamic>;
    return CommunityModel(
      id: doc.id,
      name: d['name'] ?? '',
      description: d['description'] ?? '',
      emoji: d['emoji'] ?? '👥',
      coverImageUrl: d['coverImageUrl'] ?? '',
      memberCount: d['memberCount'] ?? 0,
      habitCategories: List<String>.from(d['habitCategories'] ?? []),
      isPublic: d['isPublic'] ?? true,
      createdBy: d['createdBy'] ?? '',
      createdAt: (d['createdAt'] as Timestamp).toDate(),
    );
  }

  Map<String, dynamic> toFirestore() => {
    'name': name,
    'description': description,
    'emoji': emoji,
    'coverImageUrl': coverImageUrl,
    'memberCount': memberCount,
    'habitCategories': habitCategories,
    'isPublic': isPublic,
    'createdBy': createdBy,
    'createdAt': Timestamp.fromDate(createdAt),
  };
}
