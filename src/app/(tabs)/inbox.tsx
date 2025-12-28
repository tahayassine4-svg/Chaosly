import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAppStore } from '../../store/useAppStore';
import { IdeaCard } from '../../components/IdeaCard';
import { BrainDumpModal } from '../../components/BrainDumpModal';
import { Ionicons } from '@expo/vector-icons';

export default function InboxScreen() {
  const ideas = useAppStore((state) => state.ideas);
  const removeIdea = useAppStore((state) => state.removeIdea);
  const keepIdea = useAppStore((state) => state.keepIdea);
  const maybeIdea = useAppStore((state) => state.maybeIdea);
  const loadIdeas = useAppStore((state) => state.loadIdeas);
  const openBrainDump = useAppStore((state) => state.openBrainDump);

  const [removedIds, setRemovedIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    loadIdeas();
  }, []);

  const inboxIdeas = ideas.filter(
    (idea) => idea.status === 'inbox' && !removedIds.has(idea.id)
  );

  const handleSwipeLeft = (id: string) => {
    setRemovedIds((prev) => new Set(prev).add(id));
    setTimeout(() => removeIdea(id), 300);
  };

  const handleSwipeRight = (id: string) => {
    setRemovedIds((prev) => new Set(prev).add(id));
    setTimeout(() => keepIdea(id), 300);
  };

  const handleSwipeUp = (id: string) => {
    setRemovedIds((prev) => new Set(prev).add(id));
    setTimeout(() => maybeIdea(id), 300);
  };

  return (
    <SafeAreaView className="flex-1 bg-background">
      <View className="flex-1 px-6 py-8">
        {/* Header */}
        <View className="mb-8 flex-row justify-between items-center">
          <View>
            <Text className="text-white text-4xl font-bold mb-2">Inbox</Text>
            <Text className="text-textSecondary text-lg">
              {inboxIdeas.length} {inboxIdeas.length === 1 ? 'idea' : 'ideas'}{' '}
              to review
            </Text>
          </View>

          <TouchableOpacity
            onPress={openBrainDump}
            className="bg-primary w-14 h-14 rounded-full items-center justify-center"
          >
            <Ionicons name="add" size={32} color="white" />
          </TouchableOpacity>
        </View>

        {/* Card Stack or Empty State */}
        <View className="flex-1 items-center justify-center">
          {inboxIdeas.length > 0 ? (
            <View className="relative w-full items-center">
              {/* Instructions */}
              <View className="mb-8 bg-card/50 rounded-2xl p-4">
                <Text className="text-textSecondary text-center text-sm">
                  Swipe right to keep • Swipe left to delete • Swipe up for
                  maybe later
                </Text>
              </View>

              {/* Card Stack */}
              <View className="relative" style={{ height: 500 }}>
                {inboxIdeas
                  .slice(0, 3)
                  .reverse()
                  .map((idea, index) => (
                    <IdeaCard
                      key={idea.id}
                      idea={idea}
                      onSwipeLeft={handleSwipeLeft}
                      onSwipeRight={handleSwipeRight}
                      onSwipeUp={handleSwipeUp}
                      index={inboxIdeas.length - 1 - index}
                    />
                  ))}
              </View>

              {/* Card counter */}
              {inboxIdeas.length > 1 && (
                <View className="mt-8 flex-row gap-2">
                  {inboxIdeas.slice(0, 5).map((_, index) => (
                    <View
                      key={index}
                      className={`w-2 h-2 rounded-full ${
                        index === 0 ? 'bg-primary' : 'bg-gray-700'
                      }`}
                    />
                  ))}
                  {inboxIdeas.length > 5 && (
                    <Text className="text-textSecondary text-xs ml-1">
                      +{inboxIdeas.length - 5} more
                    </Text>
                  )}
                </View>
              )}
            </View>
          ) : (
            <View className="items-center px-8">
              <Text className="text-6xl mb-6">📭</Text>
              <Text className="text-white text-2xl font-bold mb-3 text-center">
                Inbox Zero!
              </Text>
              <Text className="text-textSecondary text-lg text-center mb-8">
                You've reviewed all your ideas. Start a focus session and
                capture new thoughts!
              </Text>
              <TouchableOpacity
                onPress={openBrainDump}
                className="bg-primary px-8 py-4 rounded-full"
              >
                <Text className="text-white font-semibold text-lg">
                  Add New Idea
                </Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </View>

      <BrainDumpModal />
    </SafeAreaView>
  );
}
