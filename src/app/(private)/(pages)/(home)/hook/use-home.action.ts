'use client'

import { useModal } from "@/src/shared/contexts/modal-context"
import { UsedModal } from "../_components/used.modal"

export function useHomeAction() {
  const { openModal } = useModal()

  const handleOpenUsedModal = (blNumber: string, numberContainer: number, setNumberContainer: (number: number) => void) => {
    openModal('used-modal', UsedModal, { blNumber, numberContainer, setNumberContainer: (number: number) => setNumberContainer(number) })
  }

  const trackBl = async (code: string) => {
    const trimmed = code.trim()
    if (!trimmed) return { numberContainer: undefined as number | undefined }

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
      console.log(json)
      if (!response.ok) {
        return { numberContainer: 0 }
      }

      console.log(json.data)

      return { numberContainer: json.data.numberOfContainers }
    } catch {
      return { numberContainer: undefined as number | undefined }
    }

  }

  return {
    trackBl,
    handleOpenUsedModal
  }
}