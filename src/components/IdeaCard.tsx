import React from 'react';
import { View, Text, Dimensions } from 'react-native';
import { PanGestureHandler } from 'react-native-gesture-handler';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  useAnimatedGestureHandler,
  withSpring,
  runOnJS,
  interpolate,
} from 'react-native-reanimated';
import { Idea } from '../store/useAppStore';
import * as Haptics from 'expo-haptics';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const SWIPE_THRESHOLD = SCREEN_WIDTH * 0.3;

interface IdeaCardProps {
  idea: Idea;
  onSwipeLeft: (id: string) => void;
  onSwipeRight: (id: string) => void;
  onSwipeUp: (id: string) => void;
  index: number;
}

export const IdeaCard: React.FC<IdeaCardProps> = ({
  idea,
  onSwipeLeft,
  onSwipeRight,
  onSwipeUp,
  index,
}) => {
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);

  const triggerHaptic = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
  };

  const gestureHandler = useAnimatedGestureHandler({
    onActive: (event) => {
      translateX.value = event.translationX;
      translateY.value = event.translationY;
    },
    onEnd: (event) => {
      // Swipe up (maybe later)
      if (translateY.value < -SWIPE_THRESHOLD && Math.abs(translateX.value) < SWIPE_THRESHOLD) {
        translateY.value = withSpring(-SCREEN_WIDTH * 2);
        runOnJS(triggerHaptic)();
        runOnJS(onSwipeUp)(idea.id);
      }
      // Swipe right (keep)
      else if (translateX.value > SWIPE_THRESHOLD) {
        translateX.value = withSpring(SCREEN_WIDTH * 2);
        runOnJS(triggerHaptic)();
        runOnJS(onSwipeRight)(idea.id);
      }
      // Swipe left (delete)
      else if (translateX.value < -SWIPE_THRESHOLD) {
        translateX.value = withSpring(-SCREEN_WIDTH * 2);
        runOnJS(triggerHaptic)();
        runOnJS(onSwipeLeft)(idea.id);
      }
      // Return to center
      else {
        translateX.value = withSpring(0);
        translateY.value = withSpring(0);
      }
    },
  });

  const cardStyle = useAnimatedStyle(() => {
    const rotate = interpolate(
      translateX.value,
      [-SCREEN_WIDTH / 2, 0, SCREEN_WIDTH / 2],
      [-15, 0, 15]
    );

    const opacity = interpolate(
      Math.abs(translateX.value) + Math.abs(translateY.value),
      [0, SWIPE_THRESHOLD],
      [1, 0.5]
    );

    return {
      transform: [
        { translateX: translateX.value },
        { translateY: translateY.value },
        { rotate: `${rotate}deg` },
        { scale: 1 - index * 0.05 },
      ],
      opacity,
      zIndex: -index,
    };
  });

  const deleteOverlayStyle = useAnimatedStyle(() => {
    const opacity = interpolate(
      translateX.value,
      [-SWIPE_THRESHOLD, -SWIPE_THRESHOLD / 2, 0],
      [1, 0.5, 0]
    );

    return {
      opacity,
    };
  });

  const keepOverlayStyle = useAnimatedStyle(() => {
    const opacity = interpolate(
      translateX.value,
      [0, SWIPE_THRESHOLD / 2, SWIPE_THRESHOLD],
      [0, 0.5, 1]
    );

    return {
      opacity,
    };
  });

  const maybeOverlayStyle = useAnimatedStyle(() => {
    const opacity = interpolate(
      translateY.value,
      [-SWIPE_THRESHOLD, -SWIPE_THRESHOLD / 2, 0],
      [1, 0.5, 0]
    );

    return {
      opacity,
    };
  });

  return (
    <PanGestureHandler onGestureEvent={gestureHandler}>
      <Animated.View
        style={cardStyle}
        className="absolute bg-card rounded-3xl p-6 shadow-2xl"
        pointerEvents={index === 0 ? 'auto' : 'none'}
      >
        <View className="w-[340px] h-[480px] justify-center">
          {/* Delete overlay (red) */}
          <Animated.View
            style={deleteOverlayStyle}
            className="absolute inset-0 bg-red-500/20 rounded-3xl border-4 border-red-500 items-center justify-center"
            pointerEvents="none"
          >
            <Text className="text-red-500 text-4xl font-bold rotate-[-25deg]">
              DELETE
            </Text>
          </Animated.View>

          {/* Keep overlay (green) */}
          <Animated.View
            style={keepOverlayStyle}
            className="absolute inset-0 bg-green-500/20 rounded-3xl border-4 border-green-500 items-center justify-center"
            pointerEvents="none"
          >
            <Text className="text-green-500 text-4xl font-bold rotate-[25deg]">
              KEEP
            </Text>
          </Animated.View>

          {/* Maybe overlay (blue) */}
          <Animated.View
            style={maybeOverlayStyle}
            className="absolute inset-0 bg-blue-500/20 rounded-3xl border-4 border-blue-500 items-center justify-center"
            pointerEvents="none"
          >
            <Text className="text-blue-500 text-4xl font-bold">MAYBE</Text>
          </Animated.View>

          {/* Card content */}
          <View className="flex-1 justify-center">
            <Text className="text-white text-2xl leading-relaxed">
              {idea.text}
            </Text>
          </View>

          {/* Timestamp */}
          <Text className="text-textSecondary text-sm mt-4">
            {new Date(idea.createdAt).toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric',
              hour: 'numeric',
              minute: '2-digit',
            })}
          </Text>
        </View>
      </Animated.View>
    </PanGestureHandler>
  );
};
