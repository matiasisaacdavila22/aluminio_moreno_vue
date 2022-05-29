<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated>
      <q-toolbar>
        <q-btn
          flat
          dense
          round
          icon="menu"
          aria-label="Menu"
          @click="toggleLeftDrawer"
        />

        <q-toolbar-title>
          AL.MORENO
        </q-toolbar-title>

        <div>
          <q-btn color='negative' v-if="isAuthenticated" @click="signOut">SignOut</q-btn>
        </div>
      </q-toolbar>
    </q-header>

    <q-drawer
      v-model="leftDrawerOpen"
      show-if-above
      bordered
    >
      <q-list>
        <q-item-label
          header
        >
          Essential Links
        </q-item-label>

        <EssentialLink
          v-for="link in essentialLinks"
          :key="link.title"
          v-bind="link"
        />
      </q-list>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script>
import { defineComponent, ref } from 'vue'
import EssentialLink from 'components/EssentialLink.vue'
import { auth, db } from "boot/firebase";
import { useAuth } from '@vueuse/firebase/useAuth'

const linksList = [

]

export default defineComponent({
  name: 'MainLayout',

  components: {
    EssentialLink
  },

  setup () {
    const leftDrawerOpen = ref(false)
    const {isAuthenticated, user} = useAuth(auth)

    return {
      essentialLinks: linksList,
      leftDrawerOpen,
      isAuthenticated,
      user,
      toggleLeftDrawer () {
        leftDrawerOpen.value = !leftDrawerOpen.value
      }
    }
  },
    methods: {
  
  async signOut() {
      try {
        await auth.signOut()
        .then(()=> {
          console.log('entro a salir')
           this.$router.push({name: 'signin'});
        })

      } catch (error) {
        
      }
    }
     },
})
</script>
