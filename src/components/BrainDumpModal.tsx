import React, { useState, useRef, useEffect } from 'react';
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
} from 'react-native';
import { useAppStore } from '../store/useAppStore';
import * as Haptics from 'expo-haptics';

export const BrainDumpModal: React.FC = () => {
  const [text, setText] = useState('');
  const inputRef = useRef<TextInput>(null);

  const isOpen = useAppStore((state) => state.isBrainDumpOpen);
  const closeBrainDump = useAppStore((state) => state.closeBrainDump);
  const addIdea = useAppStore((state) => state.addIdea);

  useEffect(() => {
    if (isOpen) {
      // Focus input when modal opens
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    } else {
      // Clear text when modal closes
      setText('');
    }
  }, [isOpen]);

  const handleSave = () => {
    if (text.trim()) {
      addIdea(text.trim());
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      setText('');
      closeBrainDump();
    }
  };

  const handleClose = () => {
    Keyboard.dismiss();
    closeBrainDump();
  };

  return (
    <Modal
      visible={isOpen}
      transparent
      animationType="fade"
      onRequestClose={handleClose}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1"
      >
        <TouchableOpacity
          activeOpacity={1}
          onPress={handleClose}
          className="flex-1 bg-black/80 justify-center items-center px-6"
        >
          <TouchableOpacity activeOpacity={1} className="w-full">
            <View className="bg-card rounded-3xl p-6 w-full">
              <Text className="text-white text-2xl font-bold mb-4">
                Brain Dump
              </Text>
              <Text className="text-textSecondary mb-4">
                Capture your thought quickly and get back to focus
              </Text>

              <TextInput
                ref={inputRef}
                value={text}
                onChangeText={setText}
                placeholder="What's on your mind?"
                placeholderTextColor="#6b7280"
                multiline
                numberOfLines={4}
                className="bg-background text-white rounded-xl p-4 text-lg mb-4 min-h-[120px]"
                style={{ textAlignVertical: 'top' }}
                returnKeyType="default"
                blurOnSubmit={false}
              />

              <View className="flex-row gap-3">
                <TouchableOpacity
                  onPress={handleClose}
                  className="flex-1 bg-background border border-gray-700 py-4 rounded-full"
                >
                  <Text className="text-white text-center font-semibold text-lg">
                    Cancel
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={handleSave}
                  disabled={!text.trim()}
                  className={`flex-1 py-4 rounded-full ${
                    text.trim() ? 'bg-primary' : 'bg-gray-700'
                  }`}
                >
                  <Text className="text-white text-center font-semibold text-lg">
                    Save
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </TouchableOpacity>
        </TouchableOpacity>
      </KeyboardAvoidingView>
    </Modal>
  );
};
