<template>
<svg :width="size" :height="size" fill="none" :stroke="color" stroke-linecap="round" stroke-linejoin="round" :stroke-width viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
<path d="m15 18-6-6 6-6"></path>
</svg>
</template>

<script setup lang="ts">
type Props = {
  size?: number
  color?:string
  strokeWidth?: number
}

withDefaults(defineProps<Props>(), {
 size:24,
color: 'black',
strokeWidth:1
})
</script>

<style scoped>

</style>