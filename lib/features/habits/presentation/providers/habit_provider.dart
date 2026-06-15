import 'package:cloud_firestore/cloud_firestore.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../data/datasources/habit_remote_datasource.dart';
import '../../data/datasources/habit_local_datasource.dart';
import '../../data/repositories/habit_repository_impl.dart';
import '../../domain/entities/habit_entity.dart';
import '../../domain/entities/habit_log_entity.dart';
import '../../domain/repositories/habit_repository.dart';
import '../../domain/usecases/create_habit.dart';
import '../../domain/usecases/complete_habit.dart';
import '../../domain/usecases/get_habits.dart';
import '../../domain/usecases/get_habit_logs.dart';
import '../../../auth/presentation/providers/auth_provider.dart';

final habitRemoteDataSourceProvider = Provider<HabitRemoteDataSource>((ref) {
  return HabitRemoteDataSourceImpl(firestore: FirebaseFirestore.instance);
});

final habitLocalDataSourceProvider = Provider<HabitLocalDataSource>((ref) {
  return HabitLocalDataSourceImpl();
});

final habitRepositoryProvider = Provider<HabitRepository>((ref) {
  return HabitRepositoryImpl(ref.watch(habitRemoteDataSourceProvider));
});

final habitsStreamProvider = StreamProvider<List<HabitEntity>>((ref) {
  final user = ref.watch(currentUserProvider);
  if (user == null) return const Stream.empty();
  return GetHabits(ref.watch(habitRepositoryProvider)).call(user.id);
});

final habitLogsProvider = FutureProvider.family<List<HabitLogEntity>, String>((ref, habitId) async {
  final result = await GetHabitLogs(ref.watch(habitRepositoryProvider)).call(habitId);
  return result.fold((f) => [], (logs) => logs);
});

final completedTodayProvider = FutureProvider.family<bool, String>((ref, habitId) async {
  final user = ref.watch(currentUserProvider);
  if (user == null) return false;
  final result = await ref.watch(habitRepositoryProvider).isCompletedToday(habitId, user.id);
  return result.fold((_) => false, (v) => v);
});

class HabitNotifier extends StateNotifier<AsyncValue<void>> {
  final HabitRepository _repository;
  final String _userId;

  HabitNotifier(this._repository, this._userId) : super(const AsyncValue.data(null));

  Future<bool> createHabit(HabitEntity habit) async {
    state = const AsyncValue.loading();
    final result = await CreateHabit(_repository).call(habit);
    return result.fold(
      (f) { state = AsyncValue.error(f.message, StackTrace.current); return false; },
      (_) { state = const AsyncValue.data(null); return true; },
    );
  }

  Future<bool> completeHabit(String habitId, {String? note}) async {
    state = const AsyncValue.loading();
    final result = await CompleteHabit(_repository).call(habitId, _userId, note: note);
    return result.fold(
      (f) { state = AsyncValue.error(f.message, StackTrace.current); return false; },
      (_) { state = const AsyncValue.data(null); return true; },
    );
  }

  Future<bool> deleteHabit(String habitId) async {
    final result = await _repository.deleteHabit(habitId);
    return result.fold((_) => false, (_) => true);
  }
}

final habitNotifierProvider = StateNotifierProvider<HabitNotifier, AsyncValue<void>>((ref) {
  final user = ref.watch(currentUserProvider);
  return HabitNotifier(ref.watch(habitRepositoryProvider), user?.id ?? '');
});
