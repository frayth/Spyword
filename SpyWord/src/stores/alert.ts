import { computed, ref } from 'vue'
import { defineStore } from 'pinia'
import type { Alert } from '@/models/ws.model'
import type { AlertType } from '@/models/appli.model'


export const useAlertStore = defineStore('alert', () => {
  const alerts = ref<Alert[]>([])
  const alertIsVisible = computed(()=>alerts.value.length>0)

  function addAlert(alert: Alert) {
    alert.type =getType(alert.code)
    alert.message=translateError(alert.code)
    if(alerts.value.length===0)
    alert.zIndex = 1
    else
    alert.zIndex=0

    alerts.value.push(alert)

  }


  function getType(type: number): AlertType {
    switch (type) {
      case 10:
        return 'warning'
      default:
        return 'info'
    }
  }

  function closeAlert(index: number) {
    alerts.value.splice(index, 1)
  }
  function changeAlertZIndex(index: number) {
    alerts.value[index].zIndex = 1
    alerts.value.forEach((alert, i) => {
      if (i !== index) {
        alert.zIndex = 0
      }
    })

  }
  function translateError(code:number):string{
    switch (code){
      case 10:
        return "Un joueur a quitté la partie, retour au lobby!"
      default:
        return "oups! une erreur est survenue"
    }
  }
  return {
    alerts,
    addAlert,
    alertIsVisible,
    getType,
    closeAlert,
    changeAlertZIndex
  }
})
