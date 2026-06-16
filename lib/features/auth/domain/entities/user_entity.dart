import 'package:equatable/equatable.dart';

class UserEntity extends Equatable {
  final String id;
  final String email;
  final String? displayName;
  final String? photoUrl;
  final String? phoneNumber;
  final DateTime createdAt;
  final int totalXP;
  final int level;
  final int currentStreak;
  final int longestStreak;
  final List<String> badges;
  final bool isProfileComplete;

  const UserEntity({
    required this.id,
    required this.email,
    this.displayName,
    this.photoUrl,
    this.phoneNumber,
    required this.createdAt,
    this.totalXP = 0,
    this.level = 1,
    this.currentStreak = 0,
    this.longestStreak = 0,
    this.badges = const [],
    this.isProfileComplete = false,
  });

  @override
  List<Object?> get props => [id, email, displayName, photoUrl, totalXP, level, currentStreak];

  UserEntity copyWith({
    String? displayName,
    String? photoUrl,
    int? totalXP,
    int? level,
    int? currentStreak,
    int? longestStreak,
    List<String>? badges,
    bool? isProfileComplete,
  }) {
    return UserEntity(
      id: id,
      email: email,
      displayName: displayName ?? this.displayName,
      photoUrl: photoUrl ?? this.photoUrl,
      phoneNumber: phoneNumber,
      createdAt: createdAt,
      totalXP: totalXP ?? this.totalXP,
      level: level ?? this.level,
      currentStreak: currentStreak ?? this.currentStreak,
      longestStreak: longestStreak ?? this.longestStreak,
      badges: badges ?? this.badges,
      isProfileComplete: isProfileComplete ?? this.isProfileComplete,
    );
  }
}
