'use client'

import { useModal } from '@/src/shared/contexts/modal-context'
import { UsedBlModal } from '@/src/shared/components/document-form/used-bl-modal'

export function useBlTracker() {
  const { openModal } = useModal()

  const openUsedBlModal = (
    blNumber: string,
    numberContainer: number,
    setNumberContainer: (n: number) => void,
    name: string,
  ) => {
    openModal('used-bl-modal', UsedBlModal, { blNumber, numberContainer, setNumberContainer, name })
  }

  const trackBl = async (code: string) => {
    const trimmed = code.trim()
    if (!trimmed) return { numberContainer: undefined as number | undefined, existed: false }

    try {
      const response = await fetch('/api/track', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: trimmed, carrier: 'msc' }),
      })

      const json = await response.json().catch(() => null)
      if (!response.ok || json?.data?.status === 'NOT_FOUND') {
        return { numberContainer: 0, existed: false }
      }

      return {
        numberContainer: json.data.numberOfContainers as number,
        existed: true,
        destination: json.data.destination as string,
      }
    } catch {
      return { numberContainer: undefined as number | undefined, existed: false }
    }
  }

  return { trackBl, openUsedBlModal }
}
