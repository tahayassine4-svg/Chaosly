# Chaosly 🎯

A beautiful Focus & Productivity app built with Expo/React Native. Chaosly helps you manage focus sessions, capture ideas during flow states, and review them with an intuitive Tinder-style interface.

## Features

### 🎯 Focus Sessions
- Timer-based focus sessions (15, 25, 45, 60 minutes)
- Circular progress animation
- Pause/Resume functionality
- 5-minute warning notification
- Live Activity support for iOS Dynamic Island
- Session completion celebration

### 💡 Brain Dump
- Quick capture modal accessible during focus sessions
- Capture thoughts without breaking flow
- All ideas go to Inbox for later review

### 📬 Inbox (Idea Management)
- Tinder-style card interface
- Swipe gestures:
  - **Swipe Right** → Keep the idea
  - **Swipe Left** → Delete the idea
  - **Swipe Up** → Save for "Maybe Later"
- Visual feedback with color-coded overlays
- Empty state celebration when all ideas are reviewed

## Tech Stack

- **Framework**: Expo SDK 51 + React Native
- **Navigation**: Expo Router (file-based)
- **State Management**: Zustand
- **Persistence**: AsyncStorage
- **Animations**: Reanimated 3
- **Gestures**: React Native Gesture Handler
- **Styling**: NativeWind (Tailwind CSS)
- **Notifications**: Expo Notifications
- **Haptics**: Expo Haptics

## Project Structure

```
Chaosly/
├── src/
│   ├── app/                    # Expo Router pages
│   │   ├── (tabs)/
│   │   │   ├── _layout.tsx     # Tab navigation
│   │   │   ├── index.tsx       # Focus screen
│   │   │   └── inbox.tsx       # Inbox screen
│   │   └── _layout.tsx         # Root layout
│   ├── components/
│   │   ├── FocusTimer.tsx      # Timer with circular progress
│   │   ├── BrainDumpModal.tsx  # Quick capture modal
│   │   ├── IdeaCard.tsx        # Swipeable card component
│   │   └── CelebrationModal.tsx # Session complete modal
│   ├── store/
│   │   └── useAppStore.ts      # Zustand store
│   └── hooks/
│       └── useLiveActivity.ts  # iOS Live Activity hook
├── assets/                     # App assets (see ASSETS.md)
├── app.json                    # Expo configuration
├── package.json
└── tailwind.config.js
```

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- Expo CLI (`npm install -g expo-cli`)
- iOS Simulator (Mac only) or Android Emulator

### Installation

1. Clone the repository:
```bash
git clone <your-repo-url>
cd Chaosly
```

2. Install dependencies:
```bash
npm install
```

3. Add required assets (see ASSETS.md for details):
```bash
# Create assets directory
mkdir -p assets
# Add your icon.png, splash.png, etc.
```

### Running the App

```bash
# Start development server
npm start

# Run on iOS
npm run ios

# Run on Android
npm run android

# Run on web
npm run web
```

## Usage

### Starting a Focus Session

1. Open the app to the **Focus** tab
2. Choose your focus duration (15, 25, 45, or 60 minutes)
3. Tap to start the session
4. Use the circular timer to track your progress
5. Pause/Resume as needed

### Brain Dump During Focus

1. During an active session, tap the floating **Brain Dump** button (bottom right)
2. Type your thought or idea
3. Tap **Save** to add it to your Inbox
4. Return to focus immediately

### Reviewing Ideas in Inbox

1. Switch to the **Inbox** tab
2. Review the top card
3. Swipe:
   - **Right** to keep the idea
   - **Left** to delete it
   - **Up** for "maybe later"
4. Continue until you reach Inbox Zero!

## Configuration

### Notification Permissions

The app will request notification permissions on first launch. These are used for:
- 5-minute warning before session ends

### Tailwind Configuration

Customize colors and styles in `tailwind.config.js`:

```javascript
theme: {
  extend: {
    colors: {
      primary: '#6366f1',      // Main accent color
      background: '#0a0a0a',   // App background
      card: '#1a1a1a',         // Card background
      text: '#ffffff',         // Primary text
      textSecondary: '#9ca3af', // Secondary text
    },
  },
}
```

## iOS Live Activity Setup

For Dynamic Island support on iOS 16.1+, you'll need to:

1. Set up native iOS module for Live Activities
2. Configure ActivityKit in Xcode
3. Update the `useLiveActivity` hook with native implementation

See `src/hooks/useLiveActivity.ts` for placeholder code.

## Development

### State Management

The app uses Zustand for simple, performant state management. See `src/store/useAppStore.ts` for:
- Focus session state
- Ideas management
- Modal states

### Data Persistence

Ideas are automatically saved to AsyncStorage and loaded on app start. Session state is ephemeral.

## Building for Production

### iOS

```bash
eas build --platform ios
```

### Android

```bash
eas build --platform android
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License.

## Acknowledgments

- Built with [Expo](https://expo.dev)
- UI inspired by modern iOS design patterns
- Tinder-style swipe inspired by dating apps' UX excellence 
