import 'package:flutter/material.dart';
import 'package:table_calendar/table_calendar.dart';
import '../../../../core/constants/app_colors.dart';
import '../../domain/entities/habit_log_entity.dart';
import '../../../../core/utils/date_utils.dart';

class StreakCalendar extends StatefulWidget {
  final List<HabitLogEntity> logs;

  const StreakCalendar({super.key, required this.logs});

  @override
  State<StreakCalendar> createState() => _StreakCalendarState();
}

class _StreakCalendarState extends State<StreakCalendar> {
  DateTime _focusedDay = DateTime.now();
  DateTime? _selectedDay;

  Set<DateTime> get _completedDays =>
      widget.logs.map((l) => AppDateUtils.startOfDay(l.completedAt)).toSet();

  @override
  Widget build(BuildContext context) {
    return Container(
      decoration: BoxDecoration(
        color: AppColors.backgroundCard,
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: AppColors.border, width: 0.5),
      ),
      child: TableCalendar(
        firstDay: DateTime.now().subtract(const Duration(days: 365)),
        lastDay: DateTime.now(),
        focusedDay: _focusedDay,
        selectedDayPredicate: (day) => _selectedDay != null && AppDateUtils.isSameDay(day, _selectedDay!),
        onDaySelected: (selected, focused) => setState(() { _selectedDay = selected; _focusedDay = focused; }),
        onPageChanged: (focused) => setState(() => _focusedDay = focused),
        calendarStyle: CalendarStyle(
          defaultTextStyle: const TextStyle(color: AppColors.textPrimary),
          weekendTextStyle: const TextStyle(color: AppColors.textSecondary),
          outsideTextStyle: const TextStyle(color: AppColors.textHint),
          todayDecoration: BoxDecoration(
            border: Border.all(color: AppColors.primary, width: 2),
            shape: BoxShape.circle,
          ),
          todayTextStyle: const TextStyle(color: AppColors.primary, fontWeight: FontWeight.bold),
          selectedDecoration: const BoxDecoration(color: AppColors.primary, shape: BoxShape.circle),
          markerDecoration: const BoxDecoration(color: AppColors.success, shape: BoxShape.circle),
        ),
        headerStyle: const HeaderStyle(
          formatButtonVisible: false,
          titleCentered: true,
          titleTextStyle: TextStyle(color: AppColors.textPrimary, fontSize: 16, fontWeight: FontWeight.w600),
          leftChevronIcon: Icon(Icons.chevron_left, color: AppColors.textSecondary),
          rightChevronIcon: Icon(Icons.chevron_right, color: AppColors.textSecondary),
        ),
        daysOfWeekStyle: const DaysOfWeekStyle(
          weekdayStyle: TextStyle(color: AppColors.textHint, fontSize: 12),
          weekendStyle: TextStyle(color: AppColors.textHint, fontSize: 12),
        ),
        calendarBuilders: CalendarBuilders(
          defaultBuilder: (context, day, focusedDay) {
            final isCompleted = _completedDays.contains(AppDateUtils.startOfDay(day));
            if (isCompleted) {
              return Container(
                margin: const EdgeInsets.all(4),
                decoration: const BoxDecoration(color: AppColors.success, shape: BoxShape.circle),
                child: Center(child: Text('${day.day}', style: const TextStyle(color: Colors.white, fontWeight: FontWeight.w600, fontSize: 13))),
              );
            }
            return null;
          },
        ),
      ),
    );
  }
}
