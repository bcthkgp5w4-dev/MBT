import 'package:dartz/dartz.dart';
import '../../../../core/errors/failures.dart';
import '../entities/gamification_entity.dart';

abstract class GamificationRepository {
  Future<Either<Failure, GamificationEntity>> getUserGamification(String userId);
  Stream<List<GamificationEntity>> getLeaderboard();
}
