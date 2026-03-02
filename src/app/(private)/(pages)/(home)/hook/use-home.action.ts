import { useModal } from "@/src/shared/contexts/modal-context"
import { UsedModal } from "../_components/used.modal"

export function useHomeAction() {
  const { openModal } = useModal()

  const handleOpenUsedModal = (blNumber: string, numberContainer: number, setNumberContainer: (number: number) => void) => {
    openModal('used-modal', UsedModal, { blNumber, numberContainer, setNumberContainer: (number: number) => setNumberContainer(number) })
  }

  const trackBl = async (code: string) => {
    const trimmed = code.trim()
    if (!trimmed) return

    const response = await fetch('/api/track', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        code: trimmed,
        carrier: 'msc',
      }),
    })

    const json = await response.json().catch(() => null)
    if (!response.ok) {
      return { error: `Status ${response.status}` }
    }

    return { success: true, numberContainer: 23 }

  }

  return {
    trackBl,
    handleOpenUsedModal
  }
}