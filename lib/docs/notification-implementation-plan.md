# Browser Notification Implementation Plan

## Overview
This document outlines the implementation plan for adding browser notification functionality to the Jeda pomodoro timer application. The feature will request notification permissions and display notifications when timer sessions complete, synchronized with alarm sounds.

## Requirements
1. Request notification permission before each play session if not already granted
2. Display browser notifications when focus/break/longbreak sessions complete
3. Synchronize notifications with alarm sound
4. Integrate with existing pomodoro timer components and state management
5. Add notification settings to allow users to enable/disable notifications

## Implementation Steps

### 1. Create Notification Utility Functions
Create a new utility file `lib/utils/notifications.ts` with functions for:
- Checking notification permission status
- Requesting notification permission
- Showing notifications with appropriate messages for each timer mode
- Handling permission denial gracefully

### 2. Update Settings Store
Modify `lib/store/timer.ts` to include:
- Add `enableNotifications` boolean setting to Settings interface
- Add default value for `enableNotifications` in `defaultSettings`
- Update SettingsData type in settings dialog

### 3. Update Settings UI
Modify `components/feature/settings-dialog.tsx` to include:
- Add notification toggle switch in the settings dialog
- Update form state to include notification settings
- Save notification preferences with other settings

### 4. Integrate with Timer Component
Modify `components/feature/pomodoro-timer.tsx` to:
- Request notification permission when timer starts (if enabled)
- Show notifications when timer sessions complete
- Synchronize notification display with alarm sound playback

### 5. Implementation Details

#### Notification Utility Functions
```typescript
// lib/utils/notifications.ts
export const checkNotificationPermission = (): boolean => {
  // Check if browser supports notifications
  // Check current permission status
};

export const requestNotificationPermission = async (): Promise<boolean> => {
  // Request permission if not already granted
};

export const showNotification = (mode: TimerMode): void => {
  // Show appropriate notification based on timer mode
  // Handle cases where permission is denied
};
```

#### Settings Store Updates
```typescript
// lib/store/timer.ts
export type Settings = {
  // ... existing settings
  enableNotifications: boolean;
};

export const defaultSettings: Settings = {
  // ... existing defaults
  enableNotifications: true,
};
```

#### Settings UI Updates
Add a new section in the settings dialog for notifications:
- Toggle switch for enabling/disabling notifications
- Permission status indicator

#### Timer Component Integration
```typescript
// components/feature/pomodoro-timer.tsx
useEffect(() => {
  // Request notification permission when timer starts
  if (isRunning && settings.enableNotifications) {
    requestNotificationPermission();
  }
}, [isRunning, settings.enableNotifications]);

// In timer completion handler
const handleTimerEnd = async () => {
  // ... existing logic
  if (settings.enableNotifications) {
    showNotification(mode);
  }
  playAlarm(); // Synchronized with notification
};
```

## Files to Modify
1. `lib/utils/notifications.ts` (new file)
2. `lib/store/timer.ts` (add notification settings)
3. `components/feature/settings-dialog.tsx` (add notification UI)
4. `components/feature/pomodoro-timer.tsx` (integrate notifications)

## Testing Considerations
- Test notification permission flow in different browsers
- Test notification display for all timer modes
- Test behavior when notifications are disabled
- Test behavior when permission is denied
- Test synchronization with alarm sounds