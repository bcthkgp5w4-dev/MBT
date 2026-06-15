import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import '../../features/auth/presentation/providers/auth_provider.dart';
import '../../features/auth/presentation/screens/splash_screen.dart';
import '../../features/auth/presentation/screens/login_screen.dart';
import '../../features/auth/presentation/screens/profile_setup_screen.dart';
import '../../features/habits/presentation/screens/home_screen.dart';
import '../../features/habits/presentation/screens/create_habit_screen.dart';
import '../../features/habits/presentation/screens/habit_detail_screen.dart';
import '../../features/social/presentation/screens/social_screen.dart';
import '../../features/social/presentation/screens/community_screen.dart';
import '../../features/social/presentation/screens/partner_streak_screen.dart';
import '../../features/challenges/presentation/screens/challenges_screen.dart';
import '../../features/challenges/presentation/screens/challenge_detail_screen.dart';
import '../../features/gamification/presentation/screens/achievements_screen.dart';
import '../../features/analytics/presentation/screens/analytics_screen.dart';
import '../../features/ai_coach/presentation/screens/ai_coach_screen.dart';
import '../../shared/widgets/bottom_nav_bar.dart';

final appRouterProvider = Provider<GoRouter>((ref) {
  final authState = ref.watch(authStateProvider);

  return GoRouter(
    initialLocation: '/splash',
    redirect: (context, state) {
      final isAuthenticated = authState.valueOrNull != null;
      final isOnAuthPage = state.matchedLocation == '/login' || state.matchedLocation == '/splash';
      if (!isAuthenticated && !isOnAuthPage) return '/login';
      if (isAuthenticated && isOnAuthPage && state.matchedLocation != '/splash') return '/home';
      return null;
    },
    routes: [
      GoRoute(path: '/splash', builder: (c, s) => const SplashScreen()),
      GoRoute(path: '/login', builder: (c, s) => const LoginScreen()),
      GoRoute(path: '/profile-setup', builder: (c, s) => const ProfileSetupScreen()),
      ShellRoute(
        builder: (context, state, child) => MainScaffold(child: child),
        routes: [
          GoRoute(path: '/home', builder: (c, s) => const HomeScreen()),
          GoRoute(path: '/social', builder: (c, s) => const SocialScreen()),
          GoRoute(path: '/challenges', builder: (c, s) => const ChallengesScreen()),
          GoRoute(path: '/analytics', builder: (c, s) => const AnalyticsScreen()),
          GoRoute(path: '/ai-coach', builder: (c, s) => const AiCoachScreen()),
        ],
      ),
      GoRoute(path: '/create-habit', builder: (c, s) => const CreateHabitScreen()),
      GoRoute(
        path: '/habit/:id',
        builder: (c, s) => HabitDetailScreen(habitId: s.pathParameters['id']!),
      ),
      GoRoute(
        path: '/community/:id',
        builder: (c, s) => CommunityScreen(communityId: s.pathParameters['id']!),
      ),
      GoRoute(
        path: '/partner-streak/:id',
        builder: (c, s) => PartnerStreakScreen(partnerId: s.pathParameters['id']!),
      ),
      GoRoute(
        path: '/challenge/:id',
        builder: (c, s) => ChallengeDetailScreen(challengeId: s.pathParameters['id']!),
      ),
      GoRoute(path: '/achievements', builder: (c, s) => const AchievementsScreen()),
    ],
  );
});
