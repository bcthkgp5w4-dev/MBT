import 'package:dartz/dartz.dart';
import '../../../../core/errors/failures.dart';
import '../entities/habit_entity.dart';
import '../repositories/habit_repository.dart';

class CreateHabit {
  final HabitRepository repository;
  const CreateHabit(this.repository);
  
  Future<Either<Failure, HabitEntity>> call(HabitEntity habit) =>
      repository.createHabit(habit);
}
