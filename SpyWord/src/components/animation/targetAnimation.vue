<template>
  <div class="grid place-items-center text-white p-6 w-full h-full bg-gray-950">
    <div class="flex flex-col gap-6 w-full lg:w-90%">
      <div
        v-for="{ target, idList } in game.currentGame.properties.resultRound
          ?.history"
        :key="target"
        class=" b b-amber grid grid-rows-[20px_3fr] grid-cols-[auto_1fr] gap-x-4 items-center w-full bg-gray-800 p-4 rounded-2xl shadow-lg  md:(grid-rows-[1fr_3fr] grid-cols-[auto_1fr] gap-x-10) lg:(min-h-200px )"
      >
        <!-- Joueur cible (celui qui a reçu des votes) -->
        <div class="grid-row-start-1 grid-row-end-3 ">
          <div class="relative w-fit">
            <div
              class="w-20 h-20 rounded-full overflow-hidden border-4 border-white shadow-md relative lg:(w-40 h-40)"
            >
              <portraitComp
                :url="
                  game.currentGame.users.find(el => el.id === target)?.gameStat
                    ?.urlAvatar!
                "
                class="relative"
              >
              </portraitComp>
            </div>
            <span
              class="absolute -bottom-3 left-1/2 transform -translate-x-1/2 bg-red-600 text-white text-xs font-bold px-3 py-1 rounded-full shadow"
            >
              Cible
            </span>
          </div>
        </div>

        <!-- Liste des votants -->
        <div class="grid-row-start-2 flex flex-wrap justify-left gap-2">
          <TransitionGroup
            tag="div"
            class="flex flex-wrap justify-center gap-2 lg:(gap-5)"
            appear
            @before-enter="beforeEnter"
            @enter="enter"
          >
            <div
              v-for="id in idList"
              :key="`ennemy-${id}`"
              class="relative w-14 h-14 opacity-0 lg:(w-20 h-20)"
            >
              <div
                class="w-full h-full rounded-full overflow-hidden border-2 border-red-500 shadow-md"
              >
                <portraitComp
                  :url="
                    game.currentGame.users.find(el => el.id === id)?.gameStat
                      ?.urlAvatar!
                  "
                ></portraitComp>
              </div>
            </div>
          </TransitionGroup>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useGameStore } from '@/stores/game'
import portraitComp from '@/components/animation/assets/portraitComp.vue'
const game = useGameStore()

const beforeEnter = (el: Element) => {
  ;(el as HTMLElement).style.opacity = '0'
  ;(el as HTMLElement).style.transform = 'translateY(-5px)'
}

const enter = (el: Element, done: () => void) => {
  const delay = (Array.from(el.parentNode!.children).indexOf(el) + 1) * 500

  setTimeout(() => {
    ;(el as HTMLElement).style.transition = 'all 0.5s'
    ;(el as HTMLElement).style.opacity = '1'
    ;(el as HTMLElement).style.transform = 'translateY(0px)'
    done()
  }, delay)
}
</script>

<style scoped>
.fade-enter-active {
  animation: fadeIn 0.5s ease-in-out both;
}

.fade-leave-active {
  animation: fadeOut 0.3s ease-in-out both;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes fadeOut {
  from {
    opacity: 1;
    transform: translateY(0);
  }
  to {
    opacity: 0;
    transform: translateY(-10px);
  }
}
</style>
