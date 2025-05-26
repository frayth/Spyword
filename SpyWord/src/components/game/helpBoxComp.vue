<template>
<div class="w-full max-w-300px   grid items-center justify-center justify-items-center  lg:( max-w-4xl)">

  <!-- Contenu texte -->
  <div class="w-full h-fit lg:w-1/2 p-3 lg:p-6 text-black space-y-3 relative z-20 bg-white/100 rounded-2xl border border-white/20 shadow-xl">
    <p class="text-xl font-semibold tracking-wide">{{ name }}</p>

    <p class="text-sm italic opacity-80">
      {{presenceText}} 
    </p>
    <div class="flex items-center justify-between">
          <p class="text-sm italic opacity-80">
      {{ locked ? 'Rôle Obligatoire' : 'Rôle Optionnel' }}
    </p>
    <p v-if="condition" class="text-sm italic opacity-80 color-red-500">
      {{ condition }}
    </p>
    </div>


    <div class="pt-4 text-sm leading-relaxed opacity-90 ">
      <p v-for="(text, index) in helpText" :key="index">
        {{ text }}
      </p>
    </div>
  </div>
</div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useGameStore } from '@/stores/game'
const gameStore = useGameStore()
type Props = {
  name: string
  isPresent: boolean
  locked: boolean
  img: string
}
const props=defineProps<Props>()
const helpText=computed(() => {
 switch (props.name) {
   case 'Civil':
     return [
  "Le civil est un rôle standard, tous les joueurs commencent comme civils sauf ceux avec un rôle particulier.",
  "Les civils n’ont aucune connaissance spécifique sur leur rôle au départ.",
  "Ils doivent rester discrets tout en étant attentifs aux mots des autres pour débusquer les espions.",
  "Leur objectif est d’observer et d’identifier les espions sans se faire remarquer."
]
    case 'Espion':
      return [
  "L’espion est un joueur unique possédant un mot différent de celui des civils.",
  "Au début de la partie, il ne connaît pas son rôle.",
  "Il doit rester discret et se fondre dans la masse pour ne pas se faire démasquer.",
  "Son but est de tromper les autres et de gagner la partie sans être découvert."
]
    case 'Mr.White':
      return [
  "Mr White connaît son rôle dès le début de la partie mais n’a aucun mot.",
  "Il doit se fondre dans la masse en s’appuyant sur les propositions des autres joueurs.",
  "S’il se fait démasquer, il peut tenter de deviner le mot des civils pour gagner la partie.",
  "S’il échoue, il est éliminé normalement.",
  "Mr White doit éliminer l’espion pour espérer gagner en fin de partie."
]
      default:
      return ['Role inconnu, veuillez consulter les règles du jeu pour plus d’informations.']
    }
    })
const numberOfPlayers=computed(()=>{
  const optionalRoles = gameStore.currentGame.gameOption.whiteIsPresent ? 1 : 0;
  switch (props.name) {
    case 'Civil':
      return gameStore.currentGame.users.length - 1 - optionalRoles; // Exclude the spy
    case 'Espion':
      return 1; // Exclude the spy
    case 'Mr.White':
      return gameStore.currentGame.gameOption.whiteIsPresent? 1 : 0; // Exclude the spy and Mr. White if present
    default:
      return gameStore.currentGame.users.length; // Default case, should not happen
  }
})
const presenceText =computed(() => {
 return `${props.name}${numberOfPlayers.value > 1 ? 's' : ''} présent${numberOfPlayers.value > 1 ? 's' : ''}: ${numberOfPlayers.value}`
})
const condition=computed(() => {
  if (!props.locked) {
    return '4 joueurs min'
  } else {
    return false
  }
})
</script>

<style scoped>

</style>