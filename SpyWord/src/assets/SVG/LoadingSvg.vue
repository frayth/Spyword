<template>
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 50 50" :width="size" :height="size">
    <g transform="rotate(0 25 25)">
      <circle cx="25" cy="10" r="3" :fill="color">
        <animate attributeName="opacity"
          dur="1s"
          values="1;0.3;1"
          repeatCount="indefinite"
          begin="0s"/>
      </circle>
      <circle cx="35" cy="15" r="3" :fill="color">
        <animate attributeName="opacity"
          dur="1s"
          values="1;0.3;1"
          repeatCount="indefinite"
          begin="0.125s"/>
      </circle>
      <circle cx="40" cy="25" r="3" :fill="color">
        <animate attributeName="opacity"
          dur="1s"
          values="1;0.3;1"
          repeatCount="indefinite"
          begin="0.25s"/>
      </circle>
      <circle cx="35" cy="35" r="3" :fill="color">
        <animate attributeName="opacity"
          dur="1s"
          values="1;0.3;1"
          repeatCount="indefinite"
          begin="0.375s"/>
      </circle>
      <circle cx="25" cy="40" r="3" :fill="color">
        <animate attributeName="opacity"
          dur="1s"
          values="1;0.3;1"
          repeatCount="indefinite"
          begin="0.5s"/>
      </circle>
      <circle cx="15" cy="35" r="3" :fill="color">
        <animate attributeName="opacity"
          dur="1s"
          values="1;0.3;1"
          repeatCount="indefinite"
          begin="0.625s"/>
      </circle>
      <circle cx="10" cy="25" r="3" :fill="color">
        <animate attributeName="opacity"
          dur="1s"
          values="1;0.3;1"
          repeatCount="indefinite"
          begin="0.75s"/>
      </circle>
      <circle cx="15" cy="15" r="3" :fill="color">
        <animate attributeName="opacity"
          dur="1s"
          values="1;0.3;1"
          repeatCount="indefinite"
          begin="0.875s"/>
      </circle>
    </g>
  </svg>
</template>

<script setup lang="ts">
defineProps({
  color: {
    type: String,
    default: 'white'
  },
  size:{
    type: Number,
    default: 50
  }
})
</script>

<style scoped>

</style>