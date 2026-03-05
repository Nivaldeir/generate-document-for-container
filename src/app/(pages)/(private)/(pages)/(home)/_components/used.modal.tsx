"use client"

import { Input } from "@/src/shared/components/ui/input";
import { PageTitle } from "@/src/shared/components/ui/page-title";
import { ModalProps } from "@/src/shared/types/modal";

interface UsedModalData {
  blNumber: string
  numberContainer?: number
  setNumberContainer: (value: number) => void
  name: string
}

export function UsedModal({ onClose, data }: ModalProps<UsedModalData>) {
  if (!data) return null
  const { blNumber, numberContainer, setNumberContainer, name } = data

  return (
    <div className="flex flex-col gap-6 p-6 w-full max-w-md">
      {/* Header */}
      <div className="flex flex-col gap-2">
        <PageTitle variant="h1" className="text-xl font-semibold">
          BL já utilizado
        </PageTitle>
        <p className="text-sm text-muted-foreground leading-relaxed">
          O BL <span className="font-medium">{blNumber}</span> já foi encontrado no sistema de rastreamento.
        </p>
        <p className="text-sm text-muted-foreground leading-relaxed">
          <span className="font-medium">Destino:</span> {name}
        </p>
      </div>

      {/* Content */}
      <div className="flex flex-col gap-2">
        <label className="text-sm font-medium">
          Quantidade de containers
        </label>
        <Input
          type="number"
          min={0}
          value={numberContainer?.toString() ?? ''}
          onChange={(event) => {
            const parsed = Number(event.target.value)
            if (Number.isNaN(parsed)) return
            setNumberContainer(parsed)
          }}
        />
      </div>

      {/* Footer */}
      <div className="flex justify-end gap-3 pt-2">
        <button
          onClick={onClose}
          className="px-4 py-2 text-sm font-medium rounded-lg border hover:bg-muted transition"
        >
          Cancelar
        </button>

        <button
          onClick={() => {
            setNumberContainer(numberContainer ?? 0)
            onClose()
          }}
          className="px-4 py-2 text-sm font-medium rounded-lg bg-primary text-white hover:opacity-90 transition"
        >
          Confirmar
        </button>
      </div>
    </div>
  )
}