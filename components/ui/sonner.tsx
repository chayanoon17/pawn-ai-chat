"use client"

import { useTheme } from "next-themes"
import { Toaster as Sonner, ToasterProps } from "sonner"

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme()

  return (
    <Sonner
      position="top-right"
      theme={theme as ToasterProps["theme"]}
      closeButton
      richColors
      toastOptions={{
        classNames: {
          toast: "bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-700 rounded-xl shadow-xl text-sm",
          title: "font-semibold text-gray-800 dark:text-white",
          description: "text-xs text-gray-500 dark:text-gray-300",
        },
      }}
    />
  )
}

export { Toaster }
