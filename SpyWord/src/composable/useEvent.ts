import { onMounted, onUnmounted } from 'vue'

export function useEventListener(target:HTMLElement|Window, event:string, callback:(event:Event)=>void) {
  // if you want, you can also make this
  // support selector strings as target
  onMounted(() => {
    //console.log('useEventListener')
    target.addEventListener(event, callback)
  })
  onUnmounted(() => target.removeEventListener(event, callback))
}