<script setup lang="ts">
import { useAppliStore } from '@/stores/appli';
const {infoWindow} = useAppliStore()
</script>

<template>
  <main class="flex-center-col w-full grid  bg-white p-b-20px">
    <h1 class="title">Bienvenue dans <span class="font-900 text-size-2xl md:text-size-6xl ">Spyword</span></h1>
    <div class="p-10px bg-amber border-rounded-xl shadow-amber shadowlo m-20px">
      <iframe
      ref="video"
        :width="infoWindow.width>=660?'560':infoWindow.width-100"
        :height="infoWindow.width>=660?'315':(infoWindow.width-100)*0.5625"
        src="https://www.youtube.com/embed/x_l7Am7v7XM"
        title="YouTube video player"
        frameborder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        referrerpolicy="strict-origin-when-cross-origin"
        allowfullscreen
        
      ></iframe>
    </div>
    <section class="w-full flex-center-col p-20px">
      <h2 class="title">Rôle et but</h2>
      <hr class="h-1px color-black w-full p-5px">
      <div class="text-center flex-center text-size-sm">
        <p >Il y a 3 groupes dans le jeu : les Civils, les Undercovers et les Mr.Whites. La majorité des résidents sont de pacifiques Civils. Les autres sont des Imposteurs.</p>
      </div>
    </section>
    <section class="w-full flex-center-col p-20px">
      <h2 class="title">Recevez votre mot secret</h2>
      <hr class="h-1px color-black w-full p-5px">
      <div class=" text-left text-size-sm  ">
        <p >Chaque partie est basée sur <span class="font-900">une paire de mots</span> assez proches (par exemple « chat » et « chien »). Au début de la partie, chacun reçoit l’un de ces mots.</p>
        <p class="font-900 m-y-20px">Assurez-vous de garder votre mot secret !</p>
        <p class="sm:p-x-50px text-center">Les Civils reçoivent tous le même mot. Les Undercovers reçoivent l’autre mot de la paire, légèrement different de celui des Civils. Les Mr.Whites ne reçoivent aucun mot. Pour l’instant, vous ne savez pas si vous êtes Civil ou Undercover…</p>
      </div>
      </section>
      <section class="w-full flex-center-col p-20px">
        <h2 class="title">Phases du jeu</h2>
        <hr class="h-1px color-black w-full p-5px">
        <div class=" text-left text-size-sm m-b-4  ">
          <p >Il y a 3 phases principales dans le jeu. Après un cycle des 3 phases, un joueur est éliminé de la partie. Répétez ce cycle autant de fois que nécessaire jusqu’à ce que l’un de groupes (Civils, Undercovers ou Mr.Whites) gagne.</p>
        </div>
        <h3 class="font-600 justify-self-start p-y-15px text-size-lg">Phase de Description</h3>
        <div class=" text-left text-size-sm m-b-4  ">
          <p >Dès que chacun a reçu son mot secret, un joueur est désigné aléatoirement pour commencer à décrire son mot secret. Un par un, chacun décrit son mot avec un mot ou une courte phrase. Mr.White doit improviser, puisqu’il/elle n’a pas de mot secret.</p>
          <p class="p-y-10px">Utilisez cette phase pour révéler assez d’informations pour trouver vos alliés, mais pas trop pour éviter que Mr.White ne devine le mot.</p>
        </div>
        <h3 class="font-600 justify-self-start p-y-15px text-size-lg">Phase de Discussion</h3>
        <div class=" text-left text-size-sm  m-b-4 ">
          <p >Une fois la phase de description terminée, les joueurs discutent et débattent sur qui ils pensent que les Civils ou les Imposteurs sont.</p>
          <p class="p-y-10px">Les Civils et les Undercovers doivent utiliser cette phase pour rassembler des indices sur leur identité, construire des alliances et identifier leurs ennemis. Pendant ce temps, pour Mr.White c’est le moment idéal pour essayer d’en apprendre plus sur le mot des Civils.</p>
          <p>Un conseil : ne vous exposez pas trop tôt ! Utilisez votre charme pour faire pencher la balance en votre faveur.</p>
        </div>
        <h3 class="font-600 justify-self-start p-y-15px text-size-lg">Phase d’Élimination</h3>
        <div class=" text-left text-size-sm m-b-4  ">
          <p >Une fois la discussion terminée, les joueurs restants votent pour éliminer un joueur de leur choix. Rappelez-vous, les joueurs éliminés ne peuvent plus voter.</p>
          <p class="p-y-10px">Le joueur qui a reçu le plus de votes est expulsé du jeu ! À moins que le joueur en question ne soit Mr.White !… Dans ce cas, il/elle a encore une chance de deviner le mot des Civils. S’il/elle devine le mot des Civils correctement, Mr.White gagne immédiatement.</p>
          <p>Si après l’élimination, les conditions de victoires indiquées ci-dessous ne sont pas remplies, répétez les 3 phases jusqu’à ce que l’un de groupes (Civils, Undercovers ou Mr.Whites) gagne.</p>
        </div>
        </section>
  </main>
</template>
<style scoped>
.shadowlo{
  box-shadow: 1px 0 15px 0 rgba(0,0,0,0.3), -1px 0 15px 0 rgba(0,0,0,0.3), 0 1px 15px 0 rgba(0,0,0,0.3), 0 -1px 15px 0 rgba(0,0,0,0.3);
}
</style>