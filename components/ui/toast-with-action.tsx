"use client"

import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"

interface ToastWithActionProps {
  title: string
  description: string
  actionLabel: string
  onAction: () => void
}

export function useToastWithAction() {
  const { toast } = useToast()

  const showToastWithAction = ({ title, description, actionLabel, onAction }: ToastWithActionProps) => {
    toast({
      title,
      description,
      action: (
        <Button
          variant="outline"
          size="sm"
          onClick={onAction}
          className="bg-white/10 border-white/20 text-white hover:bg-white/20"
        >
          {actionLabel}
        </Button>
      ),
    })
  }

  return { showToastWithAction }
}
