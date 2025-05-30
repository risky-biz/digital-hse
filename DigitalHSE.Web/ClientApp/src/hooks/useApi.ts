import { useState, useEffect, useCallback } from 'react'
import { AxiosError } from 'axios'

interface UseApiOptions {
  autoFetch?: boolean
  onSuccess?: (data: any) => void
  onError?: (error: any) => void
}

interface UseApiResult<T> {
  data: T | null
  loading: boolean
  error: Error | null
  refetch: () => Promise<void>
}

export function useApi<T = any>(
  apiCall: () => Promise<{ data: T }>,
  options: UseApiOptions = {}
): UseApiResult<T> {
  const { autoFetch = true, onSuccess, onError } = options
  const [data, setData] = useState<T | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  const fetchData = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const response = await apiCall()
      setData(response.data)
      if (onSuccess) {
        onSuccess(response.data)
      }
    } catch (err) {
      const error = err as AxiosError
      setError(error)
      if (onError) {
        onError(error)
      }
    } finally {
      setLoading(false)
    }
  }, [apiCall, onSuccess, onError])

  useEffect(() => {
    if (autoFetch) {
      fetchData()
    }
  }, [autoFetch, fetchData])

  return { data, loading, error, refetch: fetchData }
}