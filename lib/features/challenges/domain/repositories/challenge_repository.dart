import 'package:dartz/dartz.dart';
import '../../../../core/errors/failures.dart';
import '../entities/challenge_entity.dart';

abstract class ChallengeRepository {
  Stream<List<ChallengeEntity>> getChallenges();
  Future<Either<Failure, void>> joinChallenge(String challengeId, String userId);
  Stream<List<ChallengeEntity>> getUserChallenges(String userId);
}
