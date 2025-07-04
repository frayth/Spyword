import { defineStore } from 'pinia'
import { computed, ref, watch } from 'vue'

export const useErrorsStore = defineStore('errors', () => {
  const errorsList = ref<{ id: number; message: string }[]>([])
  const showError = ref(false)
  let timeOutForHide: null | number = null // Default timeout to hide error messages
  const addError = (error: string) => {
    errorsList.value.push({
      id: Date.now(),
      message: error,
    })
    if(errorsList.value.length > 5) {
      removeError(errorsList.value[0].id) // Remove the oldest error if more than 5
    }
  }
  watch(
    errorsList.value,
    newLength => {
      if (timeOutForHide !== null) {
        clearTimeout(timeOutForHide)
      }
      if (newLength.length > 0) {
        showError.value = true
        // Hide after 5 seconds
      } else {
        timeOutForHide = setTimeout(() => {
          showError.value = false
        }, 1000)
      }
    },
    { immediate: true, deep: true },
  )
  const removeError = (id: number) => {
    errorsList.value = errorsList.value.filter(error => error.id !== id)
  }

  // Optionally, you can add a method to clear all errors
  const clearErrors = () => {
    errorsList.value = []
  }

  const haveErrors = computed(() => {
    return errorsList.value.length > 0
  })

  return { errorsList, addError, removeError, clearErrors, haveErrors,showError }
})
