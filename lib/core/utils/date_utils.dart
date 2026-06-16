import 'package:intl/intl.dart';

class AppDateUtils {
  static String formatDate(DateTime date) => DateFormat('MMM d, yyyy').format(date);
  static String formatShortDate(DateTime date) => DateFormat('MMM d').format(date);
  static String formatTime(DateTime date) => DateFormat('h:mm a').format(date);
  static String formatDayName(DateTime date) => DateFormat('EEEE').format(date);
  static String formatShortDayName(DateTime date) => DateFormat('EEE').format(date);
  static String formatMonthYear(DateTime date) => DateFormat('MMMM yyyy').format(date);

  static bool isSameDay(DateTime a, DateTime b) =>
      a.year == b.year && a.month == b.month && a.day == b.day;

  static bool isToday(DateTime date) => isSameDay(date, DateTime.now());

  static bool isYesterday(DateTime date) =>
      isSameDay(date, DateTime.now().subtract(const Duration(days: 1)));

  static DateTime startOfDay(DateTime date) =>
      DateTime(date.year, date.month, date.day);

  static DateTime endOfDay(DateTime date) =>
      DateTime(date.year, date.month, date.day, 23, 59, 59);

  static List<DateTime> getDaysInMonth(DateTime date) {
    final first = DateTime(date.year, date.month, 1);
    final last = DateTime(date.year, date.month + 1, 0);
    return List.generate(last.day, (i) => DateTime(first.year, first.month, i + 1));
  }

  static List<DateTime> getLast7Days() {
    final now = DateTime.now();
    return List.generate(7, (i) => now.subtract(Duration(days: 6 - i)));
  }

  static List<DateTime> getLast30Days() {
    final now = DateTime.now();
    return List.generate(30, (i) => now.subtract(Duration(days: 29 - i)));
  }

  static String getRelativeTime(DateTime date) {
    final now = DateTime.now();
    final diff = now.difference(date);
    if (diff.inDays > 365) return '${(diff.inDays / 365).floor()}y ago';
    if (diff.inDays > 30) return '${(diff.inDays / 30).floor()}mo ago';
    if (diff.inDays > 0) return '${diff.inDays}d ago';
    if (diff.inHours > 0) return '${diff.inHours}h ago';
    if (diff.inMinutes > 0) return '${diff.inMinutes}m ago';
    return 'Just now';
  }
}
