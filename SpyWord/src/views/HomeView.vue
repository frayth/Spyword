<script setup lang="ts">
import { useAppliStore } from '@/stores/appli';
const {infoWindow} = useAppliStore()
</script>

<template>
  <main class="flex flex-col items-center w-full bg-white pb-5 ">
    <!-- Titre principal -->
    <h1 class="text-xl font-bold text-center md:text-4xl">
      Bienvenue dans <span class="font-black text-2xl md:text-6xl text-amber-600">Spyword</span>
    </h1>

    <!-- Vidéo -->
    <div class="p-2 bg-amber-100 rounded-xl shadow-md m-5">
      <iframe
        ref="video"
        :width="infoWindow.width >= 660 ? '560' : infoWindow.width - 100"
        :height="infoWindow.width >= 660 ? '315' : (infoWindow.width - 100) * 0.5625"
        src="https://www.youtube.com/embed/x_l7Am7v7XM"
        title="YouTube video player"
        frameborder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        referrerpolicy="strict-origin-when-cross-origin"
        allowfullscreen
        class="rounded-md"
      ></iframe>
    </div>

    <!-- Sections de jeu -->
    <section class="w-full flex flex-col items-center px-5 py-4">
      <h2 class="text-xl font-bold">Rôle et but</h2>
      <hr class="w-full h-[2px] bg-black my-2">
      <p class="text-center text-sm max-w-2xl">
        Il y a 3 groupes dans le jeu : les <b>Civils</b>, les <b>Undercovers</b> et les <b>Mr.Whites</b>.
        La majorité des résidents sont des pacifiques Civils, tandis que les autres sont des Imposteurs.
      </p>
    </section>

    <section class="w-full flex flex-col items-center px-5 py-4">
      <h2 class="text-xl font-bold">Recevez votre mot secret</h2>
      <hr class="w-full h-[2px] bg-black my-2">
      <div class="text-center text-sm max-w-2xl">
        <p>
          Chaque partie est basée sur une <b>paire de mots</b> assez proches (par ex. « chat » et « chien »).
          Au début de la partie, chacun reçoit l’un de ces mots.
        </p>
        <p class="font-bold my-4 text-red-600">Assurez-vous de garder votre mot secret !</p>
        <p>
          Les Civils reçoivent tous le même mot. Les Undercovers reçoivent l’autre mot de la paire.
          Les Mr.Whites ne reçoivent aucun mot. Vous ne savez pas encore votre rôle...
        </p>
      </div>
    </section>

    <section class="w-full flex flex-col items-center px-5 py-4">
      <h2 class="text-xl font-bold">Phases du jeu</h2>
      <hr class="w-full h-[2px] bg-black my-2">
      <p class="text-sm max-w-2xl text-left">
        Il y a <b>3 phases principales</b>. Après chaque cycle, un joueur est éliminé.
        Continuez jusqu'à ce qu'un groupe (Civils, Undercovers, Mr.Whites) gagne.
      </p>

      <!-- Phase 1 -->
      <h3 class="font-semibold py-3 text-lg text-left w-full max-w-2xl">Phase de Description</h3>
      <p class="text-sm max-w-2xl text-left">
        Un joueur commence à décrire son mot. Chacun décrit ensuite son mot en une phrase courte.
        <b>Mr.White doit improviser</b>, puisqu'il/elle n'a pas de mot.
      </p>

      <!-- Phase 2 -->
      <h3 class="font-semibold py-3 text-lg text-left w-full max-w-2xl">Phase de Discussion</h3>
      <p class="text-sm max-w-2xl text-left">
        Les joueurs débattent pour identifier les imposteurs et se rallier à leurs alliés.
        Pendant ce temps, <b>Mr.White tente d’apprendre le mot secret</b>...
      </p>

      <!-- Phase 3 -->
      <h3 class="font-semibold py-3 text-lg text-left w-full max-w-2xl">Phase d’Élimination</h3>
      <p class="text-sm max-w-2xl text-left">
        Tous votent pour éliminer un joueur. Attention, <b>Mr.White peut gagner</b> s’il devine le mot des Civils après son élimination !
      </p>
    </section>
  </main>
</template>

<style scoped>
.shadowlo{
  box-shadow: 1px 0 15px 0 rgba(0,0,0,0.3), -1px 0 15px 0 rgba(0,0,0,0.3), 0 1px 15px 0 rgba(0,0,0,0.3), 0 -1px 15px 0 rgba(0,0,0,0.3);
}
</style>