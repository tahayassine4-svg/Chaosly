import React, { useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAppStore } from '../../store/useAppStore';
import { FocusTimer } from '../../components/FocusTimer';
import { BrainDumpModal } from '../../components/BrainDumpModal';
import { CelebrationModal } from '../../components/CelebrationModal';
import * as Notifications from 'expo-notifications';
import { Ionicons } from '@expo/vector-icons';

const FOCUS_DURATIONS = [
  { label: '15 min', value: 15 },
  { label: '25 min', value: 25 },
  { label: '45 min', value: 45 },
  { label: '60 min', value: 60 },
];

export default function FocusScreen() {
  const session = useAppStore((state) => state.session);
  const startSession = useAppStore((state) => state.startSession);
  const endSession = useAppStore((state) => state.endSession);
  const updateTimeRemaining = useAppStore((state) => state.updateTimeRemaining);
  const openBrainDump = useAppStore((state) => state.openBrainDump);
  const openCelebration = useAppStore((state) => state.openCelebration);

  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const fiveMinWarningShown = useRef(false);

  useEffect(() => {
    // Setup notification handler
    Notifications.setNotificationHandler({
      handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: false,
      }),
    });
  }, []);

  useEffect(() => {
    if (session.isActive && !session.isPaused) {
      // Start timer
      timerRef.current = setInterval(() => {
        const newTime = Math.max(0, session.timeRemaining - 1);
        updateTimeRemaining(newTime);

        // 5-minute warning notification
        if (newTime === 300 && !fiveMinWarningShown.current) {
          fiveMinWarningShown.current = true;
          Notifications.scheduleNotificationAsync({
            content: {
              title: '5 Minutes Remaining',
              body: 'Your focus session is almost complete!',
            },
            trigger: null,
          });
        }

        // Session complete
        if (newTime === 0) {
          if (timerRef.current) clearInterval(timerRef.current);
          endSession();
          openCelebration();
          fiveMinWarningShown.current = false;
        }
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [session.isActive, session.isPaused, session.timeRemaining]);

  return (
    <SafeAreaView className="flex-1 bg-background">
      <ScrollView contentContainerClassName="flex-1">
        <View className="flex-1 px-6 py-8">
          {/* Header */}
          <View className="mb-8">
            <Text className="text-white text-4xl font-bold mb-2">Focus</Text>
            <Text className="text-textSecondary text-lg">
              Choose your focus duration
            </Text>
          </View>

          {/* Timer or Duration Selection */}
          <View className="flex-1 justify-center items-center">
            {session.isActive ? (
              <FocusTimer />
            ) : (
              <View className="w-full max-w-md">
                <View className="gap-4">
                  {FOCUS_DURATIONS.map((duration) => (
                    <TouchableOpacity
                      key={duration.value}
                      onPress={() => startSession(duration.value)}
                      className="bg-card border-2 border-gray-800 py-6 rounded-2xl active:bg-primary/10 active:border-primary"
                    >
                      <Text className="text-white text-center font-semibold text-2xl">
                        {duration.label}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>

                <View className="mt-8 bg-card/50 rounded-2xl p-6">
                  <Text className="text-textSecondary text-center">
                    💡 Tip: Use the brain dump button during your session to
                    quickly capture thoughts without breaking focus
                  </Text>
                </View>
              </View>
            )}
          </View>

          {/* Brain Dump Floating Button */}
          {session.isActive && (
            <TouchableOpacity
              onPress={openBrainDump}
              className="absolute bottom-8 right-6 bg-primary w-16 h-16 rounded-full items-center justify-center shadow-lg"
              style={{
                shadowColor: '#6366f1',
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.5,
                shadowRadius: 8,
              }}
            >
              <Ionicons name="create-outline" size={28} color="white" />
            </TouchableOpacity>
          )}
        </View>
      </ScrollView>

      <BrainDumpModal />
      <CelebrationModal />
    </SafeAreaView>
  );
}
