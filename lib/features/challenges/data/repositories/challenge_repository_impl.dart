import 'package:cloud_firestore/cloud_firestore.dart';
import 'package:dartz/dartz.dart';
import '../../../../core/errors/failures.dart';
import '../../domain/entities/challenge_entity.dart';
import '../../domain/repositories/challenge_repository.dart';
import '../models/challenge_model.dart';

class ChallengeRepositoryImpl implements ChallengeRepository {
  final FirebaseFirestore firestore;
  ChallengeRepositoryImpl(this.firestore);

  @override
  Stream<List<ChallengeEntity>> getChallenges() {
    return firestore
        .collection('challenges')
        .where('isPublic', isEqualTo: true)
        .orderBy('memberCount', descending: true)
        .snapshots()
        .map((s) => s.docs.map((d) => ChallengeModel.fromFirestore(d)).toList());
  }

  @override
  Future<Either<Failure, void>> joinChallenge(String challengeId, String userId) async {
    try {
      final batch = firestore.batch();
      batch.update(firestore.collection('challenges').doc(challengeId), {
        'memberCount': FieldValue.increment(1),
        'members': FieldValue.arrayUnion([userId]),
      });
      batch.set(
        firestore.collection('challenge_members').doc('${challengeId}_$userId'),
        {
          'challengeId': challengeId,
          'userId': userId,
          'joinedAt': FieldValue.serverTimestamp(),
          'progress': 0,
        },
      );
      await batch.commit();
      return const Right(null);
    } catch (e) {
      return Left(ServerFailure(e.toString()));
    }
  }

  @override
  Stream<List<ChallengeEntity>> getUserChallenges(String userId) {
    return firestore
        .collection('challenges')
        .where('members', arrayContains: userId)
        .snapshots()
        .map((s) => s.docs.map((d) => ChallengeModel.fromFirestore(d)).toList());
  }
}
