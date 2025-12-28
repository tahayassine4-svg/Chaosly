import React, { useEffect } from 'react';
import { Modal, View, Text, TouchableOpacity } from 'react-native';
import { useAppStore } from '../store/useAppStore';
import * as Haptics from 'expo-haptics';

export const CelebrationModal: React.FC = () => {
  const isOpen = useAppStore((state) => state.isCelebrationOpen);
  const closeCelebration = useAppStore((state) => state.closeCelebration);
  const startSession = useAppStore((state) => state.startSession);

  useEffect(() => {
    if (isOpen) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }
  }, [isOpen]);

  const handleStartAnother = (duration: number) => {
    startSession(duration);
    closeCelebration();
  };

  return (
    <Modal
      visible={isOpen}
      transparent
      animationType="fade"
      onRequestClose={closeCelebration}
    >
      <View className="flex-1 bg-black/90 justify-center items-center px-6">
        <View className="bg-card rounded-3xl p-8 w-full items-center">
          <Text className="text-6xl mb-4">🎉</Text>
          <Text className="text-white text-3xl font-bold mb-2">
            Great Job!
          </Text>
          <Text className="text-textSecondary text-lg text-center mb-8">
            You completed your focus session
          </Text>

          <Text className="text-white text-lg font-semibold mb-4">
            Start another session?
          </Text>

          <View className="w-full gap-3">
            {[15, 25, 45, 60].map((duration) => (
              <TouchableOpacity
                key={duration}
                onPress={() => handleStartAnother(duration)}
                className="bg-primary py-4 rounded-full"
              >
                <Text className="text-white text-center font-semibold text-lg">
                  {duration} minutes
                </Text>
              </TouchableOpacity>
            ))}

            <TouchableOpacity
              onPress={closeCelebration}
              className="bg-background border border-gray-700 py-4 rounded-full mt-2"
            >
              <Text className="text-white text-center font-semibold text-lg">
                Done for now
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};
