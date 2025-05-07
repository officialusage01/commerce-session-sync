
import { useState, useCallback } from 'react'
import { ToastActionElement, ToastProps } from '@/components/ui/toast'

const TOAST_LIMIT = 10
export type ToasterToast = ToastProps & {
  id: string
  title?: React.ReactNode
  description?: React.ReactNode
  action?: ToastActionElement
}

let count = 0

function generateId() {
  count = (count + 1) % Number.MAX_VALUE
  return count.toString()
}

const toasts: ToasterToast[] = []

type ToastOptions = Omit<ToasterToast, "id">

export function toast(opts: ToastOptions) {
  const id = generateId()
  const newToast = { id, ...opts }
  
  toasts.push(newToast)
  
  return {
    id,
    dismiss: () => {
      // Find and remove the toast with the given id
      const index = toasts.findIndex((toast) => toast.id === id)
      if (index !== -1) {
        toasts.splice(index, 1)
      }
    },
    update: (props: ToastOptions) => {
      const index = toasts.findIndex((toast) => toast.id === id)
      if (index !== -1) {
        toasts[index] = { ...toasts[index], ...props }
      }
    },
  }
}

export function useToast() {
  const [, forceUpdate] = useState(0)

  const dismiss = useCallback((toastId?: string) => {
    const index = toasts.findIndex((toast) => toast.id === toastId)

    if (index !== -1) {
      toasts.splice(index, 1)
    }
    
    forceUpdate((count) => count + 1)
  }, [])

  return {
    toast,
    dismiss,
    toasts: [...toasts].slice(0, TOAST_LIMIT),
  }
}
