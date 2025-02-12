<template>
  <div>
    <div class=" w-full p-5">
      <div
        class="flex gap-4 overflow-auto lg:(grid grid-row-auto gap-3 w-full)"
      >
        <div
          v-for="player in currentGame.users"
          :key="player.id"
          class="p-2 flex-center-col gap-4 w-100px bg-cyan lg:(w-full h-auto grid-rows-[auto] grid-cols-[100px_auto_50px] grid)"
        >
          <div
            :class="`bg-white rounded-full relative w-70px h-70px lg:(col-start-1) bg-cover bg-center `"
            :style="{
              backgroundImage: `url(http://maison.laurisceresoli.fr:5003/api/${player.gameStat?.urlAvatar})`,
            }"
          >
            <div
              :class="{
                'h-20px w-20px bg-green bottom-0 absolute left-0px rounded-full p-1px grid-center': true,
              }"
              v-if="player.id === infoUser.id"
            >
              <img src="../../assets/images/UserProfile.png" class="image-13" />
            </div>
            <div
              :class="{
                'h-20px w-20px bg-red bottom-0 absolute right-0px rounded-full p-2px grid-center lg:(hidden)': true,
                'bg-amber!': player.id === currentGame.ownerId,
                'bg-transparent' : currentGame.inGame && !(player.id === currentGame.ownerId)
              }"
              v-if="
                player.id === currentGame.ownerId ||
                infoUser.id === currentGame.ownerId
              "
              @click="kick(player.id === currentGame.ownerId, player.id)"
            >
              <img
                v-if="player.id === currentGame.ownerId"
                src="../../assets/images/superUser.png"
                alt=""
                class="image-13"
              />
              <img
                v-else-if="!currentGame.inGame"
                src="../../assets/images/delete.png"
                alt=""
                class="image-13 cursor-pointer"
              />
            </div>
          </div>
          <div
            class="overflow-hidden w-full flex justify-start text-ellipsis text-left whitespace-nowrap lg:(col-start-2 justify-self-center)"
          >
            <p class="text-size-xs c-black text-left">{{ player.fullName }}</p>
          </div>
          <div v-if="infoWindow.width > 1025">
            <img
              v-if="player.id === currentGame.ownerId"
              src="../../assets/images/superUser.png"
              alt=""
              class="image-25"
            />
            <img
              v-else-if="
                (player.id !== currentGame.ownerId &&
                infoUser.id === currentGame.ownerId)
              "
              src="../../assets/images/delete.png"
              alt=""
              class="image-25 cursor-pointer"
              @click="kick(player.id === currentGame.ownerId, player.id)"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useGameStore } from '@/stores/game'
import { storeToRefs } from 'pinia'
import { useAuthStore } from '@/stores/auth'
import { useFetch } from '@/composable/useFetch'
import { useAppliStore } from '@/stores/appli'
const { infoWindow } = useAppliStore()
const { currentGame } = storeToRefs(useGameStore())
const { infoUser } = storeToRefs(useAuthStore())
async function kick(isOwner: boolean, playerId: number) {
  if (isOwner) return
  const { fetchData } = useFetch(`api/games/kick?user_id=${playerId}`, {
    method: 'PUT',
  })
  await fetchData()
}
</script>

<style scoped></style>
