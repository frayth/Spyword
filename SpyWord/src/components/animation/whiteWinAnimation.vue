<template>
  <div class="grid place-items-center text-white p-6 w-full h-full bg-gray-950">
    <div
      class="space-y-6 w-full text-center   bg-black/60 backdrop-blur-md p-6 rounded-2xl border border-yellow-400 shadow-[0_0_20px_rgba(255,255,255,0.3)]"
    >
      <p class="text-lg font-bold text-white drop-shadow-lg lg:(text-xl)">
        Mr. White a découvert le mot des civils
      </p>

      <div
        class="relative w-full aspect-video rounded-xl overflow-hidden shadow-2xl border-2 border-gray-700"
      >
        <img
          src="/public/img/mrWhitevictory.png"
          alt="Mr. White victoire"
          class="object-cover w-full h-full"
        />

        <!-- Overlay texte lisible -->
        <div
          class="absolute inset-0 bg-black/40 backdrop-blur-1px flex items-center justify-center"
        >
          <p
            class="text-xl font-extrabold text-white drop-shadow-xl lg:(text-2xl)"
          >
            Mr. White remporte la partie
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts"></script>

<style scoped></style>
