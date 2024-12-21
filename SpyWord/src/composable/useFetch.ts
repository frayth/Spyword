import { ref } from 'vue'
import { useAuthStore } from '@/stores/auth'

interface FetchOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH'
  body?: object
  token?: string
}
export interface Error {
  error: {
    message: string | null
    code: number | null
  }
  data?: {
    message: string
    code: number
  }
}
export function useFetch<T>(url: string, options: FetchOptions) {

  const data = ref<T | null>(null)
  const error = ref<Error>({ error: { message: null, code: null } })
  const loading = ref(false)
  const inError = ref(false)
  const isComplete = ref(false)

   const fetchData = async () => {
    loading.value = true
    const {isCredentials,credentials}=useAuthStore()
    try {
      const headers: HeadersInit = {
        'Content-Type': 'application/json',
      }
      if (isCredentials) {
        headers['Authorization'] = `${credentials.token.type} ${credentials.token.value}`
      }

      const res = await fetch(`http://maison.laurisceresoli.fr:5003/${url}`, {
        method: options.method || 'GET',
        headers,
        body: options.body ? JSON.stringify(options.body) : null,
      })
      if (!res.ok) {
        inError.value = true
        const data = await res.json()
        error.value.data = { message: data.message, code: data.code }
        error.value.error={ message: res.statusText, code: res.status }
        throw {}
      }
      data.value = await res.json()
      isComplete.value = true
    } catch (err) {
      console.log(err)
      isComplete.value = false
    } finally {
      loading.value = false
    }
  }
  const getErrorMessage = ():string => {
    switch (error.value.data?.code) {
      case 4031:
        return 'Ce nom est déja pris et le mot de passe est incorrect'
      case 4011:
      case 4012: 
        return 'Erreur d\'identification'
      default:
        return 'Erreur inconnue'
    }
  }
  return { data, error, loading, fetchData, getErrorMessage,inError,isComplete }
}
