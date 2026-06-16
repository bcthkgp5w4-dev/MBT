import 'package:dartz/dartz.dart';
import '../../../../core/errors/failures.dart';
import '../entities/habit_entity.dart';
import '../repositories/habit_repository.dart';

class GetHabits {
  final HabitRepository repository;
  const GetHabits(this.repository);
  
  Stream<List<HabitEntity>> call(String userId) => repository.watchUserHabits(userId);
}
