import 'package:cloud_firestore/cloud_firestore.dart';
import 'package:dartz/dartz.dart';
import '../../../../core/errors/failures.dart';
import '../../domain/entities/streak_entity.dart';
import '../../domain/repositories/streak_repository.dart';
import '../models/streak_model.dart';

class StreakRepositoryImpl implements StreakRepository {
  final FirebaseFirestore firestore;
  StreakRepositoryImpl(this.firestore);

  @override
  Future<Either<Failure, StreakEntity>> getStreak(String habitId, String userId) async {
    try {
      final doc = await firestore.collection('streaks').doc('${userId}_$habitId').get();
      if (!doc.exists) {
        return Right(StreakModel(
          habitId: habitId,
          userId: userId,
          currentStreak: 0,
          longestStreak: 0,
          isFrozen: false,
          freezesRemaining: 3,
          inRecoveryMode: false,
        ));
      }
      return Right(StreakModel.fromFirestore(doc.data()!));
    } catch (e) {
      return Left(ServerFailure(e.toString()));
    }
  }

  @override
  Future<Either<Failure, void>> freezeStreak(String habitId, String userId) async {
    try {
      await firestore.collection('streaks').doc('${userId}_$habitId').update({
        'isFrozen': true,
        'freezesRemaining': FieldValue.increment(-1),
      });
      return const Right(null);
    } catch (e) {
      return Left(ServerFailure(e.toString()));
    }
  }
}
