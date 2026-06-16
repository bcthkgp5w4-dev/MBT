import 'package:cloud_firestore/cloud_firestore.dart';
import 'package:dartz/dartz.dart';
import '../../../../core/errors/failures.dart';
import '../../domain/entities/gamification_entity.dart';
import '../../domain/repositories/gamification_repository.dart';
import '../models/gamification_model.dart';

class GamificationRepositoryImpl implements GamificationRepository {
  final FirebaseFirestore firestore;
  GamificationRepositoryImpl(this.firestore);

  @override
  Future<Either<Failure, GamificationEntity>> getUserGamification(String userId) async {
    try {
      final doc = await firestore.collection('gamification').doc(userId).get();
      if (!doc.exists) {
        return Right(GamificationModel(
          userId: userId,
          xp: 0,
          level: 1,
          badges: [],
          rank: 0,
        ));
      }
      return Right(GamificationModel.fromFirestore(doc));
    } catch (e) {
      return Left(ServerFailure(e.toString()));
    }
  }

  @override
  Stream<List<GamificationEntity>> getLeaderboard() {
    return firestore
        .collection('gamification')
        .orderBy('xp', descending: true)
        .limit(100)
        .snapshots()
        .map((s) => s.docs.map((d) => GamificationModel.fromFirestore(d)).toList());
  }
}
