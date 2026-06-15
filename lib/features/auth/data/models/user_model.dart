import 'package:cloud_firestore/cloud_firestore.dart';
import '../../domain/entities/user_entity.dart';

class UserModel extends UserEntity {
  const UserModel({
    required super.id,
    required super.email,
    super.displayName,
    super.photoUrl,
    super.phoneNumber,
    required super.createdAt,
    super.totalXP,
    super.level,
    super.currentStreak,
    super.longestStreak,
    super.badges,
    super.isProfileComplete,
  });

  factory UserModel.fromFirestore(DocumentSnapshot doc) {
    final data = doc.data() as Map<String, dynamic>;
    return UserModel(
      id: doc.id,
      email: data['email'] ?? '',
      displayName: data['displayName'],
      photoUrl: data['photoUrl'],
      phoneNumber: data['phoneNumber'],
      createdAt: (data['createdAt'] as Timestamp?)?.toDate() ?? DateTime.now(),
      totalXP: data['totalXP'] ?? 0,
      level: data['level'] ?? 1,
      currentStreak: data['currentStreak'] ?? 0,
      longestStreak: data['longestStreak'] ?? 0,
      badges: List<String>.from(data['badges'] ?? []),
      isProfileComplete: data['isProfileComplete'] ?? false,
    );
  }

  factory UserModel.fromEntity(UserEntity entity) => UserModel(
        id: entity.id,
        email: entity.email,
        displayName: entity.displayName,
        photoUrl: entity.photoUrl,
        phoneNumber: entity.phoneNumber,
        createdAt: entity.createdAt,
        totalXP: entity.totalXP,
        level: entity.level,
        currentStreak: entity.currentStreak,
        longestStreak: entity.longestStreak,
        badges: entity.badges,
        isProfileComplete: entity.isProfileComplete,
      );

  Map<String, dynamic> toFirestore() => {
        'email': email,
        'displayName': displayName,
        'photoUrl': photoUrl,
        'phoneNumber': phoneNumber,
        'createdAt': Timestamp.fromDate(createdAt),
        'totalXP': totalXP,
        'level': level,
        'currentStreak': currentStreak,
        'longestStreak': longestStreak,
        'badges': badges,
        'isProfileComplete': isProfileComplete,
      };
}
