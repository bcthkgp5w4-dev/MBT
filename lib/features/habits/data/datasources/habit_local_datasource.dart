import 'package:hive/hive.dart';
import '../../../../core/constants/app_constants.dart';
import '../models/habit_model.dart';

abstract class HabitLocalDataSource {
  Future<List<Map<String, dynamic>>> getCachedHabits(String userId);
  Future<void> cacheHabits(String userId, List<Map<String, dynamic>> habits);
  Future<void> clearCache(String userId);
}

class HabitLocalDataSourceImpl implements HabitLocalDataSource {
  @override
  Future<List<Map<String, dynamic>>> getCachedHabits(String userId) async {
    final box = await Hive.openBox<dynamic>(AppConstants.habitsBox);
    final data = box.get(userId);
    if (data == null) return [];
    return List<Map<String, dynamic>>.from(
      (data as List).map((e) => Map<String, dynamic>.from(e as Map)));
  }

  @override
  Future<void> cacheHabits(String userId, List<Map<String, dynamic>> habits) async {
    final box = await Hive.openBox<dynamic>(AppConstants.habitsBox);
    await box.put(userId, habits);
  }

  @override
  Future<void> clearCache(String userId) async {
    final box = await Hive.openBox<dynamic>(AppConstants.habitsBox);
    await box.delete(userId);
  }
}
