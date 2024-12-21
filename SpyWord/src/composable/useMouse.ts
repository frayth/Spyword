// mouse.js
import { ref } from 'vue'
import { useEventListener } from './useEvent'

export function useMouse() {
  const x = ref(0)
  const y = ref(0)

  useEventListener(window, 'mousemove', (event) => {
    if(event instanceof MouseEvent){
    x.value = event.pageX 
    y.value = event.pageY
    }
  })

  return { x, y }
}