import 'package:dartz/dartz.dart';
import '../../../../core/errors/failures.dart';
import '../entities/habit_entity.dart';
import '../entities/habit_log_entity.dart';

abstract class HabitRepository {
  Stream<List<HabitEntity>> watchUserHabits(String userId);
  Future<Either<Failure, HabitEntity>> createHabit(HabitEntity habit);
  Future<Either<Failure, HabitEntity>> updateHabit(HabitEntity habit);
  Future<Either<Failure, void>> deleteHabit(String habitId);
  Future<Either<Failure, HabitLogEntity>> completeHabit(String habitId, String userId, {String? note});
  Future<Either<Failure, List<HabitLogEntity>>> getHabitLogs(String habitId, {DateTime? startDate, DateTime? endDate});
  Future<Either<Failure, bool>> isCompletedToday(String habitId, String userId);
  Future<Either<Failure, List<HabitEntity>>> getUserHabits(String userId);
}
