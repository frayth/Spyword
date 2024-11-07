<template>
  <div class="w-full h-100% grid-center" >
    <div ref="loginComp"
      class="w-100% max-w-3xl h-fit bg-gray-700 bg-op-90 pborder-2 grid grid-auto-rows-min card m-auto px-2 py-3 sm:()"
    >
      <h1
        class="
        grid-col-span-2 
        justify-self-center
        font-size-6 
        color-amber-400
        h-fit 
        m-b-5
        self-center 
        text-align-center
        sm:(font-size-8)
        "
      >
        Connectez-vous!
      </h1>
      <p class="h-fit  min-h-40px" v-if="!status.error">Veuillez saisir vos identifiants pour accéder au site</p>
      <p class="font-size-3 font-900 min-h-40px color-red h-fit  sm:(font-size-4) text-shadow-color-amber text-shadow text-shadow-color-opacity-20" v-else>Oups ! Il semble que le serveur ne réponde pas !</p>
      <inputComp
        :lock="status.loading"
        placeholder="Entrer un nom"
        type="text"
        v-model="infoUser.name.value"
        :error="infoUser.name.error"
        class="grid-col-span-2 self-center"
      />
      <inputComp
      :lock="status.loading"
      @keydown.enter="handleForm"
      placeholder="Entrer votre mot de passe"
      type="text"
      :error="infoUser.password.error"
      v-model="infoUser.password.value"
      class="grid-col-span-2 self-center"
    />
    <button @click="handleForm"
    class="pborder-1 grid-col-span-2 justify-self-center min-w-200px min-h-50px px-5 py-2 border-rounded-md bg-gray-700 grid grid-center shadow-sm shadow-amber  hover:(color-amber-400)">
      <LoadingSvg v-if="status.loading" :size="30">Chargement</LoadingSvg>
      <p v-else>Se connecter</p>
    </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import inputComp from '@/components/inputs/inputComp.vue'
import { onMounted, onUnmounted, ref, useTemplateRef, watch } from 'vue'
import {useFetch} from '@/composable/useFetch'
import LoadingSvg from '@/assets/SVG/LoadingSvg.vue';

const loginComp=useTemplateRef('loginComp')

const status=ref({
  loading:false,
  error:false
})
const infoUser = ref({
  name: {
    value: '',
    error: ''
  },
  password:{
    value: '',
    error: ''
  }
})
function handleClick(event:MouseEvent){
  if(!loginComp.value?.contains(event.target as Node)){
    infoUser.value.name.error=''
    infoUser.value.password.error=''
    status.value.error=false
  }
}
onMounted(()=>{
  window.addEventListener('click',handleClick)
})
onUnmounted(()=>{
  window.removeEventListener('click',handleClick)
})
function resetForm(){
  infoUser.value.name.value=''
  infoUser.value.password.value=''
}
async function handleForm(){
  const {data,error,loading,fetchData}=useFetch('test',{
    method:'POST',
    body:{
      name:infoUser.value.name.value,
      password:infoUser.value.password.value
    }
  })
  
  status.value.error=false  
  if(infoUser.value.name.value.length<3){
     return infoUser.value.name.error='Le nom doit contenir au moins 3 caractères'
  }
  if(infoUser.value.name.value.length>14){
     return infoUser.value.name.error='Le nom doit contenir moins de 15 caractères'
  }
  if(infoUser.value.password.value.length===0){
    return infoUser.value.password.error='Veuillez saisir un mot de passe'
  }
  status.value.loading=loading.value
  fetchData()
  watch(loading,()=>{
    if(loading.value===false){
      if(error.value){
        status.value.error=true
        resetForm()
      }
      status.value.loading=false
      if(data.value)console.log(data.value)
    }
    
  })
  infoUser.value.name.error=''
  infoUser.value.password.error=''

}
</script>

<style scoped></style>
