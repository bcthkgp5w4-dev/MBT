import 'package:dartz/dartz.dart';
import '../../../../core/errors/failures.dart';
import '../entities/streak_entity.dart';

abstract class StreakRepository {
  Future<Either<Failure, StreakEntity>> getStreak(String habitId, String userId);
  Future<Either<Failure, void>> freezeStreak(String habitId, String userId);
}
