'use client'

import { useModal } from "@/src/shared/contexts/modal-context"
import { UsedModal } from "../_components/used.modal"

export function useHomeAction() {
  const { openModal } = useModal()

  const handleOpenUsedModal = (blNumber: string, numberContainer: number, setNumberContainer: (number: number) => void, name: string) => {
    openModal('used-modal', UsedModal, { blNumber, numberContainer, setNumberContainer: (number: number) => setNumberContainer(number), name })
  }

  const trackBl = async (code: string) => {
    const trimmed = code.trim()
    if (!trimmed) return { numberContainer: undefined as number | undefined, existed: false }

    try {
      const response = await fetch('/api/track', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          code: trimmed,
          carrier: 'msc',
        }),
      })

      const json = await response.json().catch(() => null)
      if (!response.ok || json?.data?.status == "NOT_FOUND") {
        return { numberContainer: 0, existed: false }
      }

      return { numberContainer: json.data.numberOfContainers, existed: true, destination: json.data.destination }
    } catch {
      return { numberContainer: undefined as number | undefined, existed: false }
    }

  }

  return {
    trackBl,
    handleOpenUsedModal
  }
}