import { ref } from 'vue'
import { defineStore } from 'pinia'
import type { UserInfos,WindowInfos} from '@/models/appli.model'
export const useAppliStore = defineStore('appli', () => {
  const infoUser=ref<UserInfos>({
    name:null,
    isConnect:false
  })
  const infoWindow=ref<WindowInfos>({
    width:window.innerWidth,
    height:window.innerHeight
  })

  window.addEventListener('resize',()=>{
      infoWindow.value.width=window.innerWidth
      infoWindow.value.height=window.innerHeight
  })
  return {infoUser,infoWindow}
})
