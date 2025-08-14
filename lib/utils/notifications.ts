// lib/utils/notifications.ts
/**
 * Browser Notification Utility Functions
 * 
 * This module provides functions for handling browser notifications
 * including permission management and notification display.
 */

/**
 * Check if browser notifications are supported
 * @returns boolean indicating if notifications are supported
 */
export const isNotificationSupported = (): boolean => {
  return 'Notification' in window;
};

/**
 * Check current notification permission status
 * @returns Promise resolving to permission status ('granted', 'denied', or 'default')
 */
export const checkNotificationPermission = async (): Promise<NotificationPermission> => {
  if (!isNotificationSupported()) {
    return 'denied';
  }

  // For modern browsers
  if (Notification.permission) {
    return Notification.permission;
  }

  // For older browsers that might not have direct access to permission
  return 'default';
};

/**
 * Request notification permission from the user
 * @returns Promise resolving to boolean indicating if permission was granted
 */
export const requestNotificationPermission = async (): Promise<boolean> => {
  if (!isNotificationSupported()) {
    console.warn('Notifications not supported in this browser');
    return false;
  }

  // If already granted, return true
  if (Notification.permission === 'granted') {
    return true;
  }

  // If explicitly denied, don't ask again
  if (Notification.permission === 'denied') {
    console.warn('Notification permission was previously denied');
    return false;
  }

  // Request permission
  try {
    const permission = await Notification.requestPermission();
    return permission === 'granted';
  } catch (error) {
    console.error('Error requesting notification permission:', error);
    return false;
  }
};

/**
 * Show a notification with the specified title and options
 * @param title - Notification title
 * @param options - Notification options (body, icon, etc.)
 * @returns Promise resolving to Notification object or null if failed
 */
export const showNotification = async (
  title: string,
  options?: NotificationOptions
): Promise<Notification | null> => {
  // Check if notifications are supported and permission is granted
  if (!isNotificationSupported() || Notification.permission !== 'granted') {
    return null;
  }

  try {
    // Create and show notification
    const notification = new Notification(title, options);
    return notification;
  } catch (error) {
    console.error('Error showing notification:', error);
    return null;
  }
};

/**
 * Get appropriate notification content based on timer mode
 * @param mode - Current timer mode
 * @returns Object with title and body for notification
 */
export const getNotificationContent = (mode: 'pomodoro' | 'shortBreak' | 'longBreak') => {
  switch (mode) {
    case 'pomodoro':
      return {
        title: 'Focus Time Complete!',
        body: 'Great job! Time for a break.',
      };
    case 'shortBreak':
      return {
        title: 'Short Break Complete!',
        body: 'Back to focus mode!',
      };
    case 'longBreak':
      return {
        title: 'Long Break Complete!',
        body: 'You\'re refreshed and ready to focus!',
      };
    default:
      return {
        title: 'Session Complete!',
        body: 'Session completed successfully.',
      };
  }
};