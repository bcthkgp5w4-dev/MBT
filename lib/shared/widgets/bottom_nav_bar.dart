import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import '../../core/constants/app_colors.dart';

class MainScaffold extends StatelessWidget {
  final Widget child;
  const MainScaffold({super.key, required this.child});

  int _getIndex(BuildContext context) {
    final location = GoRouterState.of(context).matchedLocation;
    if (location.startsWith('/home')) return 0;
    if (location.startsWith('/social')) return 1;
    if (location.startsWith('/challenges')) return 2;
    if (location.startsWith('/analytics')) return 3;
    if (location.startsWith('/ai-coach')) return 4;
    return 0;
  }

  @override
  Widget build(BuildContext context) {
    final index = _getIndex(context);
    return Scaffold(
      body: child,
      bottomNavigationBar: Container(
        decoration: const BoxDecoration(
          color: AppColors.backgroundCard,
          border: Border(top: BorderSide(color: AppColors.border, width: 0.5)),
        ),
        child: BottomNavigationBar(
          currentIndex: index,
          onTap: (i) {
            switch (i) {
              case 0: context.go('/home'); break;
              case 1: context.go('/social'); break;
              case 2: context.go('/challenges'); break;
              case 3: context.go('/analytics'); break;
              case 4: context.go('/ai-coach'); break;
            }
          },
          items: const [
            BottomNavigationBarItem(icon: Icon(Icons.home_rounded), label: 'Home'),
            BottomNavigationBarItem(icon: Icon(Icons.people_rounded), label: 'Social'),
            BottomNavigationBarItem(icon: Icon(Icons.emoji_events_rounded), label: 'Challenges'),
            BottomNavigationBarItem(icon: Icon(Icons.bar_chart_rounded), label: 'Analytics'),
            BottomNavigationBarItem(icon: Icon(Icons.psychology_rounded), label: 'AI Coach'),
          ],
        ),
      ),
    );
  }
}
