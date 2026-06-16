import 'package:dartz/dartz.dart';
import '../../../../core/errors/failures.dart';
import '../entities/habit_log_entity.dart';
import '../repositories/habit_repository.dart';

class GetHabitLogs {
  final HabitRepository repository;
  const GetHabitLogs(this.repository);
  
  Future<Either<Failure, List<HabitLogEntity>>> call(String habitId, {DateTime? startDate, DateTime? endDate}) =>
      repository.getHabitLogs(habitId, startDate: startDate, endDate: endDate);
}
