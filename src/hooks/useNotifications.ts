// src/hooks/useNotifications.ts
import { useState, useCallback } from 'react'

export interface Notification {
  id: string
  type: 'success' | 'error' | 'warning' | 'info'
  title: string
  message?: string
  duration?: number
}

export function useNotifications() {
  const [notifications, setNotifications] = useState<Notification[]>([])

  const addNotification = useCallback((notification: Omit<Notification, 'id'>) => {
    const id = Date.now().toString()
    const newNotification = {
      ...notification,
      id,
      duration: notification.duration || 5000
    }

    setNotifications(prev => [...prev, newNotification])

    // Auto remove notification
    setTimeout(() => {
      setNotifications(prev => prev.filter(n => n.id !== id))
    }, newNotification.duration)

    return id
  }, [])

  const removeNotification = useCallback((id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id))
  }, [])

  const success = useCallback((title: string, message?: string) => {
    console.log('✅ Success:', title, message)
    return addNotification({
      type: 'success',
      title,
      message
    })
  }, [addNotification])

  const error = useCallback((title: string, message?: string) => {
    console.error('❌ Error:', title, message)
    return addNotification({
      type: 'error',
      title,
      message,
      duration: 8000 // Errors stay longer
    })
  }, [addNotification])

  const warning = useCallback((title: string, message?: string) => {
    console.warn('⚠️ Warning:', title, message)
    return addNotification({
      type: 'warning',
      title,
      message
    })
  }, [addNotification])

  const info = useCallback((title: string, message?: string) => {
    console.info('ℹ️ Info:', title, message)
    return addNotification({
      type: 'info',
      title,
      message
    })
  }, [addNotification])

  return {
    notifications,
    success,
    error,
    warning,
    info,
    remove: removeNotification,
    clear: () => setNotifications([])
  }
}