import 'package:cloud_firestore/cloud_firestore.dart';
import 'package:uuid/uuid.dart';
import '../../../../core/constants/app_constants.dart';
import '../../../../core/utils/streak_calculator.dart';
import '../../../../core/utils/date_utils.dart';
import '../models/habit_model.dart';
import '../models/habit_log_model.dart';
import '../../domain/entities/habit_entity.dart';

abstract class HabitRemoteDataSource {
  Stream<List<HabitModel>> watchUserHabits(String userId);
  Future<HabitModel> createHabit(HabitEntity habit);
  Future<HabitModel> updateHabit(HabitEntity habit);
  Future<void> deleteHabit(String habitId);
  Future<HabitLogModel> completeHabit(String habitId, String userId, {String? note});
  Future<List<HabitLogModel>> getHabitLogs(String habitId, {DateTime? startDate, DateTime? endDate});
  Future<bool> isCompletedToday(String habitId, String userId);
  Future<List<HabitModel>> getUserHabits(String userId);
}

class HabitRemoteDataSourceImpl implements HabitRemoteDataSource {
  final FirebaseFirestore _firestore;
  final Uuid _uuid;

  HabitRemoteDataSourceImpl({required FirebaseFirestore firestore})
      : _firestore = firestore,
        _uuid = const Uuid();

  @override
  Stream<List<HabitModel>> watchUserHabits(String userId) {
    return _firestore
        .collection(AppConstants.habitsCollection)
        .where('userId', isEqualTo: userId)
        .where('isActive', isEqualTo: true)
        .orderBy('createdAt', descending: true)
        .snapshots()
        .map((snap) => snap.docs.map(HabitModel.fromFirestore).toList());
  }

  @override
  Future<HabitModel> createHabit(HabitEntity habit) async {
    final id = _uuid.v4();
    final newModel = HabitModel(
      id: id,
      userId: habit.userId,
      title: habit.title,
      description: habit.description,
      emoji: habit.emoji,
      category: habit.category,
      frequency: habit.frequency,
      targetDays: habit.targetDays,
      createdAt: DateTime.now(),
      reminderTime: habit.reminderTime,
      isActive: true,
      currentStreak: 0,
      longestStreak: 0,
      totalCompletions: 0,
      colorHex: habit.colorHex,
    );
    await _firestore.collection(AppConstants.habitsCollection).doc(id).set(newModel.toFirestore());
    return newModel;
  }

  @override
  Future<HabitModel> updateHabit(HabitEntity habit) async {
    final model = HabitModel.fromEntity(habit);
    await _firestore.collection(AppConstants.habitsCollection).doc(habit.id).update(model.toFirestore());
    return model;
  }

  @override
  Future<void> deleteHabit(String habitId) async {
    await _firestore.collection(AppConstants.habitsCollection).doc(habitId).update({'isActive': false});
  }

  @override
  Future<HabitLogModel> completeHabit(String habitId, String userId, {String? note}) async {
    final isAlreadyDone = await isCompletedToday(habitId, userId);
    if (isAlreadyDone) throw Exception('Already completed today');

    final logId = _uuid.v4();
    final log = HabitLogModel(
      id: logId,
      habitId: habitId,
      userId: userId,
      completedAt: DateTime.now(),
      note: note,
      xpEarned: AppConstants.habitCompleteXP,
    );

    await _firestore.collection(AppConstants.habitLogsCollection).doc(logId).set(log.toFirestore());

    // Update streak
    final logs = await getHabitLogs(habitId);
    final dates = logs.map((l) => l.completedAt).toList();
    dates.add(DateTime.now());
    final streak = StreakCalculator.calculateCurrentStreak(dates);
    final longest = StreakCalculator.calculateLongestStreak(dates);

    await _firestore.collection(AppConstants.habitsCollection).doc(habitId).update({
      'currentStreak': streak,
      'longestStreak': longest,
      'totalCompletions': FieldValue.increment(1),
    });

    return log;
  }

  @override
  Future<List<HabitLogModel>> getHabitLogs(String habitId, {DateTime? startDate, DateTime? endDate}) async {
    Query query = _firestore.collection(AppConstants.habitLogsCollection).where('habitId', isEqualTo: habitId);
    if (startDate != null) query = query.where('completedAt', isGreaterThanOrEqualTo: Timestamp.fromDate(startDate));
    if (endDate != null) query = query.where('completedAt', isLessThanOrEqualTo: Timestamp.fromDate(endDate));
    final snap = await query.orderBy('completedAt', descending: true).get();
    return snap.docs.map((d) => HabitLogModel.fromFirestore(d)).toList();
  }

  @override
  Future<bool> isCompletedToday(String habitId, String userId) async {
    final today = AppDateUtils.startOfDay(DateTime.now());
    final tomorrow = today.add(const Duration(days: 1));
    final snap = await _firestore
        .collection(AppConstants.habitLogsCollection)
        .where('habitId', isEqualTo: habitId)
        .where('userId', isEqualTo: userId)
        .where('completedAt', isGreaterThanOrEqualTo: Timestamp.fromDate(today))
        .where('completedAt', isLessThan: Timestamp.fromDate(tomorrow))
        .get();
    return snap.docs.isNotEmpty;
  }

  @override
  Future<List<HabitModel>> getUserHabits(String userId) async {
    final snap = await _firestore
        .collection(AppConstants.habitsCollection)
        .where('userId', isEqualTo: userId)
        .where('isActive', isEqualTo: true)
        .get();
    return snap.docs.map(HabitModel.fromFirestore).toList();
  }
}
