import { ref } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useErrorsStore } from '@/stores/errors'
const urlServeur=import.meta.env.VITE_WEBSOCKET_URL
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

      const res = await fetch(`${urlServeur}/${url}`, {
        method: options.method || 'GET',
        headers,
        body: options.body ? JSON.stringify(options.body) : null,
      })
      if (!res.ok) {
        inError.value = true
        const data = await res.json()
        const errorsStore = useErrorsStore()
        error.value.data = { message: data.message, code: data.code }
        error.value.error={ message: res.statusText, code: res.status }
        errorsStore.addError(getErrorMessage())
        return
      }
      data.value = await res.json()
      isComplete.value = true
    } catch (err) {
      const errorsStore = useErrorsStore()
      console.log(err)
      errorsStore.addError('Erreur du serveur, veuillez réessayer plus tard')
      isComplete.value = false
    } finally {
      loading.value = false
    }
  }
  const getErrorMessage = ():string => {
    switch (error.value.data?.code) {
      case 4031:
        return 'Ce nom est déja pris et le mot de passe est incorrect'
      case 4033:
        return 'Vous devez être le propriétaire de la partie pour effectuer cette action'
      case 4035:
        return 'Condition non remplie pour éffectuer cette action'
        case 4034:
        case 40311:
        case 40312:
        case 40313:
        case 4002:
        case 4041:
          return 'Erreur requete invalide'
      case 4036:
        return 'Pas assez de joueurs pour éffectuer cette action'
      case 4037:
        return 'condition non remplie pour éffectuer cette action'
      case 4038:
        return 'Partie déja en cours'
      case 4039:
        return 'impossible d\'effectuer cette action, la partie est en cours'
      case 4011:
      case 4012:
        return 'Erreur token invalide'
      case 4013:
        return 'La partie que vous essayez de rejoindre n\'existe pas'
      case 4014:
        return 'La partie est pleine'
      case 500:
        return 'Erreur serveur, veuillez réessayer plus tard'
      default:
        return 'Erreur inconnue'
    }
  }
  return { data, error, loading, fetchData, getErrorMessage,inError,isComplete }
}
