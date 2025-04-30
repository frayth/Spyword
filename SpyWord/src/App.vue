<script setup lang="ts">
import Alert from '@/components/alert/alertComponent.vue'
import { useAlertStore } from '@/stores/alert'
import { storeToRefs } from 'pinia'


const { alerts, alertIsVisible } = storeToRefs(useAlertStore())
</script>

<template>
  <div
    v-if="alertIsVisible"
    class="z-1000 bg-black/50 w-full h-full absolute overflow-hidden"
  >

    <Alert
      v-for="(alert, i) in alerts"
      :zIndex="alert.zIndex!"
      :message="alert.message"
      :type="alert.type!"
      :index="i"
      :visible="alertIsVisible"
      :key="`${i}alert`"
    />
  </div>

  <RouterView
    :class="{
      'scrollbar scrollbar-thumb-color-bluegray font-default font-size-3   sm:(font-size-4)': true,
      'blur-1': alertIsVisible,
    }"
  />
</template>

<style>
@keyframes levitation {
  0% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-10px);
  }
  100% {
    transform: translateY(0);
  }
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
::-webkit-scrollbar {
  width: 6px; /* Largeur de la barre verticale */
  height: 6px; /* Hauteur de la barre horizontale */
}

::-webkit-scrollbar-thumb {
  background: rgba(100, 100, 100, 0.5); /* Couleur de la poignée */
  border-radius: 10px; /* Bords arrondis */
}

::-webkit-scrollbar-thumb:hover {
  background: rgba(100, 100, 100, 0.7); /* Assombri au survol */
}

::-webkit-scrollbar-track {
  background: transparent; /* Cache la piste */
}

/* Scrollbar pour Firefox */
* {
  scrollbar-width: thin; /* Mince */
  scrollbar-color: rgba(100, 100, 100, 0.5) transparent; /* Poignée + fond */
}
/*header {
  line-height: 1.5;
  max-height: 100vh;
}

.logo {
  display: block;
  margin: 0 auto 2rem;
}

nav {
  width: 100%;
  font-size: 12px;
  text-align: center;
  margin-top: 2rem;
}

nav a.router-link-exact-active {
  color: var(--color-text);
}

nav a.router-link-exact-active:hover {
  background-color: transparent;
}

nav a {
  display: inline-block;
  padding: 0 1rem;
  border-left: 1px solid var(--color-border);
}

nav a:first-of-type {
  border: 0;
}

@media (min-width: 1024px) {
  header {
    display: flex;
    place-items: center;
    padding-right: calc(var(--section-gap) / 2);
  }

  .logo {
    margin: 0 2rem 0 0;
  }

  header .wrapper {
    display: flex;
    place-items: flex-start;
    flex-wrap: wrap;
  }

  nav {
    text-align: left;
    margin-left: -1rem;
    font-size: 1rem;

    padding: 1rem 0;
    margin-top: 1rem;
  }
}
*/
</style>
