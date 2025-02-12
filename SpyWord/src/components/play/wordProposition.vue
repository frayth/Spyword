<template>
  <div class="flex flex-center-col text-align-center gap-5 relative">
    <div
      v-if="!wordRefused"
      class="flex flex-col items-center text-center bg-white/80 dark:bg-gray-800/80 border border-gray-300 dark:border-gray-600 shadow-md rounded-lg p-4 max-w-md mx-auto"
    >
      <div class="font-semibold text-lg text-gray-900 dark:text-white">
        Veuillez saisir un mot à transmettre aux autres joueurs.
      </div>
      <div class="text-gray-700 dark:text-gray-300 mt-2">
        Le leader de la partie devra vérifier sa validité avant son acceptation.
      </div>
      <div class="text-gray-700 dark:text-gray-300 mt-2">
        Ne choisissez pas un mot déjà proposé par vous ou un autre joueur.
      </div>
    </div>

    <div v-else class="flex-center-col justify-center gap-2 relative">
      <div
        :class="`w-150px h100px rounded-full overflow-hidden flex-center lg:(w-200px h150px) `"
        :style="{
          backgroundImage: `url(${url}${masterPlayer?.gameStat?.urlAvatar})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundPositionY: 'top',
        }"
      >
        <div
          class="absolute top-10px right-35px bg-amber w-25px rounded-full p-1 lg:(w-30px right-30px)"
        >
          <img
            src="../../assets//images//superUser.png"
            class="w-full"
            alt=""
          />
        </div>
      </div>
      <span
        ><span class="font-bold text-size-lg">{{
          masterPlayer?.fullName
        }}</span>
        à refuser votre mot</span
      >
    </div>

    <div class="relative m-t-6 max-w-350px min-w-300px">
      <input
        @keyup.enter="handleValidation"
        :disabled="currentGame.properties.verifyPhase"
        type="text"
        class="w-full h-70px p-y-2 p-x-4 rounded-md outline-none shad"
        placeholder=""
        autocomplete="off"
        v-model="inputValue"
        @focus="isFocused = true"
        @blur="isFocused = false"
        @input="handleValue"
        id="input"
      />
      <label
        :class="{
          'text-size-3 absolute top-50% transform-translate-y--50% left-10px transi bg-white p-x-2 p-y-1 rounded-md cursor-text lg:(text-size-4) ': true,
          'top-0! portrait cursor-default!': isFocused || inputValue,
        }"
        for="input"
      >
        saisir un mot
      </label>
      <Transition name="comeToLeft">
      <div v-if="currentGame.properties.verifyPhase"
        :class="` absolute top-50% right-0% translate  overflow-hidden  translate flex-center-col `"
      >
        <div
          :class="` w-40px h40px rounded-full overflow-hidden flex-center lg:(w-40px h40px) `"
          :style="{
            backgroundImage: `url(${url}${masterPlayer?.gameStat?.urlAvatar})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundPositionY: 'top',
          }"
        ></div>
        <Transition appear name="down"><div v-if="true" class="text-size-2 color-red-5">Vérification</div></Transition>
        
      </div>
    </Transition>
    </div>
    <div>
      <button
        @click="handleValidation"
        :disabled="!isValid"
        :class="{
          'relative w-200px h-50px  group overflow-hidden rounded-xl bg-gradient-to-r from-amber-500 to-yellow-400 px-6 py-3 text-white font-semibold shadow-[0_5px_15px_rgba(255,193,7,0.5)] transition-all duration-300 ease-out hover:scale-105 hover:shadow-[0_8px_20px_rgba(255,193,7,0.7)] active:scale-100 focus:outline-none focus:ring-4 focus:ring-yellow-300':
            isValid,
          'relative rounded-xl bg-gray-300 w-200px h-50px text-gray-500 px-6 py-3 font-semibold shadow-[0_3px_10px_rgba(0,0,0,0.15)] cursor-not-allowed opacity-50':
            !isValid,
        }"
      >
        <span
          v-if="isValid"
          class="absolute inset-0 bg-white opacity-10 transition-opacity duration-300 group-hover:opacity-20"
        ></span>
        <span v-if="!isLoading && !currentGame.properties.verifyPhase" class="relative z-10 w-fit">Valider</span>
        <LoadingSvg
          :size="40"
          color="black"
          v-else
          class="absolute left-50% top-50% translate z-10"
        />
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useFetch } from '@/composable/useFetch'
import LoadingSvg from '@/assets/SVG/LoadingSvg.vue'
import { useGameStore } from '@/stores/game'
import { storeToRefs } from 'pinia'

const { currentGame } = storeToRefs(useGameStore())
const masterPlayer = computed(() => {
  return currentGame.value.users.find(
    user => user.id === currentGame.value.ownerId,
  )
})
const url = import.meta.env.VITE_URL_API

const inputValue = ref('')
const isFocused = ref(false)
const wordRefused = ref(false)
const isLoading = ref(false)
const isValid = computed(
  () =>
    inputValue.value.length > 0 &&
    currentGame.value.properties.verifyPhase === false,
)

function handleValue() {
  const forbiddenChar = [
    ' ',
    '!',
    '@',
    '#',
    '$',
    '%',
    '^',
    '&',
    '*',
    '(',
    ')',
    '_',
    '+',
    '=',
    '{',
    '}',
    '[',
    ']',
    '|',
    '\\',
    ':',
    ';',
    '"',
    "'",
    '<',
    '>',
    ',',
    '.',
    '?',
    '/',
    '°',
    '§',
    '²',
    '³',
    '£',
    'µ',
    '€',
    '¨',
  ]
  if (
    forbiddenChar.includes(inputValue.value.slice(-1)) ||
    inputValue.value.length > 20
  ) {
    inputValue.value = inputValue.value.slice(0, -1)
  } else {
    if (inputValue.value.length === 1) {
      inputValue.value = inputValue.value.toUpperCase()
    } else if (inputValue.value.length > 1) {
      inputValue.value =
        inputValue.value.slice(0, 1).toUpperCase() +
        inputValue.value.slice(1).toLowerCase()
    }
  }
}

async function handleValidation() {
  if (isLoading.value || currentGame.value.properties.verifyPhase) return
  const { fetchData, loading } = useFetch('api/games/proposition', {
    method: 'POST',
    body: { word: inputValue.value },
  })
  watch(loading, () => {
    isLoading.value = loading.value
  })

  if (!isValid.value) return
  await fetchData()
}
</script>

<style scoped>
.transi {
  transition: all 0.3s;
}
.portrait {
  box-shadow: 0 5px 5px rgba(0, 0, 0, 0.5);
  animation: levitation-5 2s ease-in-out infinite;
}
@keyframes levitation-5 {
  0% {
    transform: translateY(-50%);
  }
  50% {
    transform: translateY(calc(-50% - 2px));
  }
  100% {
    transform: translateY(-50%);
  }
}
.shad:focus {
  box-shadow: 0 0 10px rgba(52, 152, 219, 0.5);
}
.comeToLeft-enter-active,
.comeToLeft-leave-active {
  transition: all 0.3s;
}
.comeToLeft-enter-from,
.comeToLeft-leave-to {

  opacity: 0;
}


.down-enter-active,
.down-leave-active {
  transition: all 0.3s;
  transition-delay:0.3s
  
}
.down-enter-from,
.down-leave-to {
  transform: translateY(-100%);
  opacity: 0;
}
.down-enter-to,
.down-leave-from {
  transform: translateY(0);
}
</style>
