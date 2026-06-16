import 'package:dartz/dartz.dart';
import '../../../../core/errors/failures.dart';
import '../entities/habit_log_entity.dart';
import '../repositories/habit_repository.dart';

class CompleteHabit {
  final HabitRepository repository;
  const CompleteHabit(this.repository);
  
  Future<Either<Failure, HabitLogEntity>> call(String habitId, String userId, {String? note}) =>
      repository.completeHabit(habitId, userId, note: note);
}
