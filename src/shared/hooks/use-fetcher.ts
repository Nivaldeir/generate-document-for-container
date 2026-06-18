'use client'

import { useState, useCallback, useRef } from 'react'

export type UseFetcherOptions<T = unknown> = {
  onSuccess?: (data: T) => void
  onError?: (error: Error) => void
}

export function useFetcher<T = unknown>(options?: UseFetcherOptions<T>) {
  const [data, setData] = useState<T | null>(null)
  const [error, setError] = useState<Error | null>(null)
  const [loading, setLoading] = useState(false)
  const optsRef = useRef(options)
  optsRef.current = options

  const execute = useCallback(async (url: RequestInfo | URL, init?: RequestInit): Promise<T | undefined> => {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch(url, init)
      const json = await res.json().catch(() => null)
      if (!res.ok) {
        const err = new Error(json?.error ?? json?.message ?? `HTTP ${res.status}`)
        setError(err)
        optsRef.current?.onError?.(err)
        return undefined
      }
      setData(json as T)
      optsRef.current?.onSuccess?.(json as T)
      return json as T
    } catch (e) {
      const err = e instanceof Error ? e : new Error(String(e))
      setError(err)
      optsRef.current?.onError?.(err)
      return undefined
    } finally {
      setLoading(false)
    }
  }, [])

  const reset = useCallback(() => {
    setData(null)
    setError(null)
    setLoading(false)
  }, [])

  return { data, error, loading, execute, reset }
}
