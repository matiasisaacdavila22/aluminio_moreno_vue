<template>
  <q-page padding>
      <form-login v-if="!isAuthenticated"/>
  </q-page>
</template>

<script>
import { defineComponent } from 'vue';
import { useAuth } from '@vueuse/firebase/useAuth'
import { auth, db } from "boot/firebase";
import FormLogin from 'src/components/FormLogin.vue';

export default defineComponent({
  name: 'Registro',

  components: {
    FormLogin
  },
    setup(){
    const {isAuthenticated, user} = useAuth(auth)

      return{
        isAuthenticated
    }
  },

  data(){
   
   return{
   
    }
  },

  created () {
    if(!this.isAuthenticated){
       this.$router.push('/admin/products'); 
    }

   },

})
</script>