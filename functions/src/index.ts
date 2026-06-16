import * as functions from "firebase-functions";
import * as admin from "firebase-admin";

admin.initializeApp();
const db = admin.firestore();

// Update streak when habit is completed
export const onHabitCompleted = functions.firestore
  .document("habit_logs/{logId}")
  .onCreate(async (snap, context) => {
    const log = snap.data();
    const { habitId, userId, completedAt } = log;
    const streakId = `${userId}_${habitId}`;
    const streakRef = db.collection("streaks").doc(streakId);
    const streakDoc = await streakRef.get();

    const today = new Date(completedAt.toDate());
    today.setHours(0, 0, 0, 0);

    if (!streakDoc.exists) {
      await streakRef.set({
        habitId,
        userId,
        currentStreak: 1,
        longestStreak: 1,
        lastCompletedDate: completedAt,
        isFrozen: false,
        freezesRemaining: 3,
        inRecoveryMode: false,
      });
    } else {
      const data = streakDoc.data()!;
      const lastDate = data.lastCompletedDate?.toDate();
      let currentStreak = data.currentStreak || 0;

      if (lastDate) {
        const lastDay = new Date(lastDate);
        lastDay.setHours(0, 0, 0, 0);
        const diffDays = Math.floor(
          (today.getTime() - lastDay.getTime()) / 86400000
        );

        if (diffDays === 1) {
          currentStreak += 1;
        } else if (diffDays === 0) {
          return; // Already completed today
        } else {
          currentStreak = 1; // Streak broken
        }
      } else {
        currentStreak = 1;
      }

      const longestStreak = Math.max(currentStreak, data.longestStreak || 0);
      await streakRef.update({
        currentStreak,
        longestStreak,
        lastCompletedDate: completedAt,
        isFrozen: false,
      });
      await db.collection("habits").doc(habitId).update({
        currentStreak,
        longestStreak,
      });
    }

    // Award XP
    await awardXP(userId, 10);

    // Check achievements
    await checkAchievements(userId, habitId);
  });

async function awardXP(userId: string, amount: number) {
  const gamRef = db.collection("gamification").doc(userId);
  const gamDoc = await gamRef.get();

  if (!gamDoc.exists) {
    await gamRef.set({ userId, xp: amount, level: 1, badges: [], rank: 0 });
  } else {
    const data = gamDoc.data()!;
    const newXP = (data.xp || 0) + amount;
    const newLevel = Math.floor(newXP / 500) + 1;
    await gamRef.update({ xp: newXP, level: newLevel });
  }
}

async function checkAchievements(userId: string, habitId: string) {
  const streakDoc = await db
    .collection("streaks")
    .doc(`${userId}_${habitId}`)
    .get();
  if (!streakDoc.exists) return;

  const { currentStreak } = streakDoc.data()!;
  const badges: Array<{
    id: string;
    name: string;
    emoji: string;
    description: string;
  }> = [];

  if (currentStreak === 7) {
    badges.push({
      id: "week_warrior",
      name: "Week Warrior",
      emoji: "⚡",
      description: "7 day streak!",
    });
  }
  if (currentStreak === 30) {
    badges.push({
      id: "monthly_master",
      name: "Monthly Master",
      emoji: "🏆",
      description: "30 day streak!",
    });
  }
  if (currentStreak === 100) {
    badges.push({
      id: "century_club",
      name: "Century Club",
      emoji: "💎",
      description: "100 day streak!",
    });
  }
  if (currentStreak === 365) {
    badges.push({
      id: "year_legend",
      name: "Year Legend",
      emoji: "👑",
      description: "365 day streak!",
    });
  }

  if (badges.length > 0) {
    const gamRef = db.collection("gamification").doc(userId);
    for (const badge of badges) {
      await gamRef.update({
        badges: admin.firestore.FieldValue.arrayUnion({
          ...badge,
          earnedAt: admin.firestore.FieldValue.serverTimestamp(),
        }),
      });
    }
    await sendBadgeNotification(userId, badges[0]);
  }
}

async function sendBadgeNotification(
  userId: string,
  badge: { name: string; description: string; id: string }
) {
  const userDoc = await db.collection("users").doc(userId).get();
  const fcmToken = userDoc.data()?.fcmToken;
  if (!fcmToken) return;

  await admin.messaging().send({
    token: fcmToken,
    notification: {
      title: `🏅 New Badge: ${badge.name}`,
      body: badge.description,
    },
    data: { type: "badge", badgeId: badge.id },
    android: {
      priority: "high",
      notification: { channelId: "achievements" },
    },
  });
}

// Send habit reminders
export const sendHabitReminders = functions.pubsub
  .schedule("every 1 hours")
  .onRun(async () => {
    const now = new Date();
    const hour = now.getUTCHours();
    const minute = now.getUTCMinutes();
    const timeStr = `${hour.toString().padStart(2, "0")}:${minute
      .toString()
      .padStart(2, "0")}`;

    const habitsSnap = await db
      .collection("habits")
      .where("reminderEnabled", "==", true)
      .where("reminderTime", "==", timeStr)
      .where("isActive", "==", true)
      .get();

    const notifications = habitsSnap.docs.map(async (doc) => {
      const habit = doc.data();
      const userDoc = await db.collection("users").doc(habit.userId).get();
      const fcmToken = userDoc.data()?.fcmToken;
      if (!fcmToken) return;

      return admin.messaging().send({
        token: fcmToken,
        notification: {
          title: `${habit.emoji} Time for ${habit.title}!`,
          body: `Keep your ${habit.currentStreak} day streak going! 🔥`,
        },
        data: { type: "reminder", habitId: doc.id },
        android: {
          priority: "high",
          notification: { channelId: "habit_reminders" },
        },
      });
    });

    await Promise.allSettled(notifications);
  });

// Weekly performance review
export const weeklyReview = functions.pubsub
  .schedule("every monday 09:00")
  .timeZone("UTC")
  .onRun(async () => {
    const usersSnap = await db.collection("users").get();
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);

    await Promise.allSettled(
      usersSnap.docs.map(async (userDoc) => {
        const userId = userDoc.id;
        const fcmToken = userDoc.data().fcmToken;
        if (!fcmToken) return;

        const logsSnap = await db
          .collection("habit_logs")
          .where("userId", "==", userId)
          .where(
            "completedAt",
            ">=",
            admin.firestore.Timestamp.fromDate(weekAgo)
          )
          .get();

        const completionCount = logsSnap.size;
        const habitsSnap = await db
          .collection("habits")
          .where("userId", "==", userId)
          .where("isActive", "==", true)
          .get();
        const totalHabits = habitsSnap.size * 7;
        const rate =
          totalHabits > 0
            ? Math.round((completionCount / totalHabits) * 100)
            : 0;

        return admin.messaging().send({
          token: fcmToken,
          notification: {
            title: "📊 Your Weekly Review",
            body: `You completed ${rate}% of your habits this week! ${
              rate >= 80
                ? "🔥 Amazing!"
                : rate >= 50
                ? "👍 Good job!"
                : "💪 You can do better!"
            }`,
          },
          data: { type: "weekly_review" },
        });
      })
    );
  });

// Update leaderboard ranks
export const updateLeaderboard = functions.pubsub
  .schedule("every 6 hours")
  .onRun(async () => {
    const gamSnap = await db
      .collection("gamification")
      .orderBy("xp", "descending")
      .get();

    const batch = db.batch();
    gamSnap.docs.forEach((doc, index) => {
      batch.update(doc.ref, { rank: index + 1 });
    });
    await batch.commit();
  });

// Partner streak check
export const checkPartnerStreaks = functions.pubsub
  .schedule("every 24 hours")
  .onRun(async () => {
    const partnerSnap = await db
      .collection("partner_streaks")
      .where("isActive", "==", true)
      .get();

    await Promise.allSettled(
      partnerSnap.docs.map(async (doc) => {
        const data = doc.data();
        const memberStreaks = data.memberStreaks as Record<string, number>;

        const hasZeroStreak = Object.values(memberStreaks).some((s) => s === 0);
        if (hasZeroStreak) {
          await doc.ref.update({ sharedStreak: 0 });
        }
      })
    );
  });
