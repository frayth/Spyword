<template>
  <div
    class="flex justify-between items-center relative p-3 md:p-5 bg-gray-900 text-white shadow-md"
    ref="header"
  >
    <!-- Nom de l'utilisateur -->
    <div class="ml-3 md:ml-5">
      <p class="font-bold text-lg md:text-2xl text-cyan-400">
        {{ infoUser.fullName }}
      </p>
    </div>

    <!-- Liens de navigation -->
    <div
      class="flex gap-6 md:gap-10 items-center"
      v-if="infoWindow.width >= 660"
    >
      <div class="relative">
        <RouterLink
          to="/"
          class="text-sm md:text-lg font-semibold tracking-wide relative after:content-[''] after:block after:h-0.5 after:w-0 after:bg-cyan-400 after:transition-all hover:after:w-full"
          @mouseover.stop="handleAfterElement(1)"
          @mouseleave="handleAfterElement(0)"
        >
          Règles
        </RouterLink>
      </div>

      <div class="relative">
        <RouterLink
          to="game"
          class="text-sm md:text-lg font-semibold tracking-wide relative after:content-[''] after:block after:h-0.5 after:w-0 after:bg-cyan-400 after:transition-all hover:after:w-full"
          @mouseover.stop="handleAfterElement(2)"
          @mouseleave="handleAfterElement(0)"
        >
          Jouer
        </RouterLink>
      </div>

      <!-- Bouton de déconnexion -->
      <button
        @click="logout"
        class="bg-red-600 text-white px-4 py-2 rounded-full transition-all duration-300 hover:bg-red-700 active:scale-95"
      >
        Se déconnecter
      </button>
    </div>
    <div v-else @click="menuIsOpen = !menuIsOpen" ref="burger">
      <svg
        :class="{ burger: true, open: menuIsOpen }"
        viewBox="0 0 100 100"
        xmlns="http://www.w3.org/2000/svg"
        width="100"
        height="100"
      >
        <line class="top" x1="20" y1="30" x2="80" y2="30" />
        <line class="middle" x1="20" y1="50" x2="80" y2="50" />
        <line class="bottom" x1="20" y1="70" x2="80" y2="70" />
      </svg>
    </div>
    <!-- Le conteneur transparent fixe -->
    <Transition name="menu" mode="out-in" appear>
      <div
        ref="menu"
        v-show="menuIsOpen && infoWindow.width < 660"
        class="absolute top-[100px] right-0 w-1/1 h-[calc(100vh-100px)] bg-transparent z-40"
      >
        <div
          v-if="menuIsOpen"
          ref="menu"
          class="h-full bg-gray-900 text-white p-8 shadow-xl z-50 flex flex-col items-center justify-center space-y-8"
        >
          <RouterLink
            to="/"
            class="text-lg font-semibold tracking-wide relative after:content-[''] after:block after:h-0.5 after:w-0 after:bg-cyan-400 after:transition-all hover:after:w-full"
            @mouseover.stop="handleAfterElement(1)"
            @mouseleave="handleAfterElement(0)"
            @click="menuIsOpen = false"
          >
            Règles
          </RouterLink>

          <RouterLink
            to="game"
            class="text-lg font-semibold tracking-wide relative after:content-[''] after:block after:h-0.5 after:w-0 after:bg-cyan-400 after:transition-all hover:after:w-full"
            @mouseover.stop="handleAfterElement(2)"
            @mouseleave="handleAfterElement(0)"
            @click.self="menuIsOpen = false"
          >
            Jouer
          </RouterLink>

          <button
            @click="logout"
            class="text-white px-6 py-3 rounded-full font-semibold text-sm min-w-200px shadow-md hover:bg-red-700 active:scale-95 transition-all duration-300"
          >
            Se déconnecter
          </button>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { useAuthStore } from '@/stores/auth'
import { ref, useTemplateRef, watch } from 'vue'
import { useAppliStore } from '@/stores/appli'
import { onClickOutside } from '@vueuse/core'

const menuIsOpen = ref(false)

const { infoUser, logout } = useAuthStore()
const { infoWindow } = useAppliStore()
const overElement = ref(0)
const header = ref<HTMLElement | null>(null)
defineExpose({ header })
function handleAfterElement(element: number) {
  overElement.value = element
}
const menu = useTemplateRef('menu')
const burger = useTemplateRef('burger')
onClickOutside(
  menu,
  target => {
    console.log(target.target)
    menuIsOpen.value = false
  },
  {
    ignore: [burger],
  },
)
watch(menuIsOpen, (isOpen) => {
  if(isOpen) {
    (document.querySelector('#app > div') as HTMLElement).style.overflow = 'hidden'
  } else {
    (document.querySelector('#app > div') as HTMLElement).style.overflow = 'auto'
  }
})
</script>

<style scoped>
.toto-enter-active,
.v-leave-active {
  transition: all 0.5s ease;
}

.toto-enter-from {
  width: 0;
  opacity: 0;
}
.toto-enter-to {
  width: 100%;
  opacity: 1;
}
.toto-leave-to {
  width: 0;
  opacity: 0;
}
.toto-leave-from {
  width: 100%;
  opacity: 1;
}
.burger {
  width: 40px;
  height: 40px;
  cursor: pointer;
  transition: all 0.3s ease;
}
.burger line {
  fill: none;
  stroke: #00bfff;
  stroke-width: 6;
  stroke-linecap: round;
  transition: all 0.3s ease;
}

/* Animation vers la croix */
.burger.open .top {
  transform: rotate(45deg) translate(0px, 20px);
  transform-origin: 50% 50%;
}
.burger.open .middle {
  opacity: 0;
}
.burger.open .bottom {
  transform: rotate(-45deg) translate(0px, -20px);
  transform-origin: 50% 50%;
}
.menu-enter-active,
.menu-leave-active {
  transition: all 0.5s ease;
}

.menu-enter-from {
  width: 0;
  opacity: 0;
}
.menu-enter-to {
  opacity: 1;
}
.menu-leave-to {
  width: 0;
  opacity: 0;
}
.menu-leave-from {
  width: 100%;
  opacity: 1;
}
</style>
