import {  ref } from "vue"
interface FetchOptions {
  method?: string
  body?:object,
  token?:string,
}

export function useFetch<T>(url: string,options:FetchOptions) {
  const data = ref<T | null>(null)
  const error = ref<unknown>(null)
  const loading = ref(true)

  const fetchData = async () => {
    try {
      const headers: HeadersInit = {
        'Content-Type': 'application/json',
      }
      if (options.token) {
        headers['Authorization'] = `Bearer ${options.token}`
      }

      const res = await fetch(`http://localhost:3000/${url}`,{
        method:options.method || 'GET',
        headers,
        body:options.body ? JSON.stringify(options.body) : null
      })
      if (!res.ok) {
        throw { message: res.statusText, code: res.status }
      }
      data.value = await res.json()
    } catch (err) {
      error.value = err
    } finally {
      loading.value = false
    }
  }
  return { data, error, loading,fetchData }
}
