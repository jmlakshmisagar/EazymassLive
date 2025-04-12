"use client"

import { toast, Toaster } from "sonner"

type ToastType = "success" | "error" | "warning" | "info"

export const showToast = (
  title: string,
  type: ToastType = "success",
  description?: string
) => {
  const options = {
    duration: 3000,
    description,
    className: type
  }

  switch (type) {
    case "success":
      toast.success(title, options)
      break
    case "error":
      toast.error(title, options)
      break
    case "warning":
      toast.warning(title, options)
      break
    case "info":
      toast.info(title, options)
      break
    default:
      toast(title, options)
  }
}

export function ToastProvider() {
  return (
    <Toaster
      position="top-center"
      expand={false}
      richColors={false}
      closeButton
      theme="system"
      className="toast-container"
      toastOptions={{
        classNames: {
          success: "border-primary bg-primary/10 dark:bg-primary/20",
          error: "border-destructive bg-destructive/10 dark:bg-destructive/20",
          warning: "border-warning bg-warning/10 dark:bg-warning/20",
          info: "border-secondary bg-secondary/10 dark:bg-secondary/20",
          title: "text-foreground",
          description: "text-muted-foreground"
        },
        style: {
          borderWidth: "1px",
          borderStyle: "solid",
          backgroundColor: "var(--background)",
          color: "var(--foreground)"
        }
      }}
    />
  )
}
