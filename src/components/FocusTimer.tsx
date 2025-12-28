import React, { useEffect } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedProps,
  withTiming,
} from 'react-native-reanimated';
import Svg, { Circle } from 'react-native-svg';
import { useAppStore } from '../store/useAppStore';

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

interface FocusTimerProps {
  size?: number;
  strokeWidth?: number;
}

export const FocusTimer: React.FC<FocusTimerProps> = ({
  size = 280,
  strokeWidth = 12,
}) => {
  const session = useAppStore((state) => state.session);
  const pauseSession = useAppStore((state) => state.pauseSession);
  const resumeSession = useAppStore((state) => state.resumeSession);
  const endSession = useAppStore((state) => state.endSession);
  const updateTimeRemaining = useAppStore((state) => state.updateTimeRemaining);

  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const progress = useSharedValue(1);

  useEffect(() => {
    if (session.isActive && !session.isPaused) {
      const progressValue = session.timeRemaining / (session.duration * 60);
      progress.value = withTiming(progressValue, { duration: 1000 });
    }
  }, [session.timeRemaining, session.duration, session.isActive, session.isPaused]);

  const animatedProps = useAnimatedProps(() => {
    const strokeDashoffset = circumference * (1 - progress.value);
    return {
      strokeDashoffset,
    };
  });

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <View className="items-center justify-center">
      <Svg width={size} height={size}>
        {/* Background circle */}
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="#1a1a1a"
          strokeWidth={strokeWidth}
          fill="none"
        />
        {/* Progress circle */}
        <AnimatedCircle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="#6366f1"
          strokeWidth={strokeWidth}
          fill="none"
          strokeDasharray={circumference}
          animatedProps={animatedProps}
          strokeLinecap="round"
          rotation="-90"
          origin={`${size / 2}, ${size / 2}`}
        />
      </Svg>

      {/* Timer text */}
      <View className="absolute items-center">
        <Text className="text-6xl font-bold text-white">
          {formatTime(session.timeRemaining)}
        </Text>
        <Text className="text-lg text-textSecondary mt-2">
          {session.isPaused ? 'Paused' : 'Focus Time'}
        </Text>
      </View>

      {/* Controls */}
      <View className="flex-row gap-4 mt-8">
        <TouchableOpacity
          onPress={session.isPaused ? resumeSession : pauseSession}
          className="bg-primary px-8 py-4 rounded-full"
        >
          <Text className="text-white font-semibold text-lg">
            {session.isPaused ? 'Resume' : 'Pause'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={endSession}
          className="bg-card border border-gray-700 px-8 py-4 rounded-full"
        >
          <Text className="text-white font-semibold text-lg">End</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};
