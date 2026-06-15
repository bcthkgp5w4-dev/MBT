import 'package:dartz/dartz.dart';
import '../../../../core/errors/failures.dart';
import '../../domain/entities/habit_entity.dart';
import '../../domain/entities/habit_log_entity.dart';
import '../../domain/repositories/habit_repository.dart';
import '../datasources/habit_remote_datasource.dart';
import '../models/habit_model.dart';

class HabitRepositoryImpl implements HabitRepository {
  final HabitRemoteDataSource _remote;

  HabitRepositoryImpl(this._remote);

  @override
  Stream<List<HabitEntity>> watchUserHabits(String userId) =>
      _remote.watchUserHabits(userId);

  @override
  Future<Either<Failure, HabitEntity>> createHabit(HabitEntity habit) async {
    try {
      final result = await _remote.createHabit(habit);
      return Right(result);
    } catch (e) {
      return Left(ServerFailure(e.toString()));
    }
  }

  @override
  Future<Either<Failure, HabitEntity>> updateHabit(HabitEntity habit) async {
    try {
      final result = await _remote.updateHabit(habit);
      return Right(result);
    } catch (e) {
      return Left(ServerFailure(e.toString()));
    }
  }

  @override
  Future<Either<Failure, void>> deleteHabit(String habitId) async {
    try {
      await _remote.deleteHabit(habitId);
      return const Right(null);
    } catch (e) {
      return Left(ServerFailure(e.toString()));
    }
  }

  @override
  Future<Either<Failure, HabitLogEntity>> completeHabit(String habitId, String userId, {String? note}) async {
    try {
      final result = await _remote.completeHabit(habitId, userId, note: note);
      return Right(result);
    } catch (e) {
      return Left(ServerFailure(e.toString()));
    }
  }

  @override
  Future<Either<Failure, List<HabitLogEntity>>> getHabitLogs(String habitId, {DateTime? startDate, DateTime? endDate}) async {
    try {
      final result = await _remote.getHabitLogs(habitId, startDate: startDate, endDate: endDate);
      return Right(result);
    } catch (e) {
      return Left(ServerFailure(e.toString()));
    }
  }

  @override
  Future<Either<Failure, bool>> isCompletedToday(String habitId, String userId) async {
    try {
      final result = await _remote.isCompletedToday(habitId, userId);
      return Right(result);
    } catch (e) {
      return Left(ServerFailure(e.toString()));
    }
  }

  @override
  Future<Either<Failure, List<HabitEntity>>> getUserHabits(String userId) async {
    try {
      final result = await _remote.getUserHabits(userId);
      return Right(result);
    } catch (e) {
      return Left(ServerFailure(e.toString()));
    }
  }
}
