<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated class="bg-cyan-8">
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
          <div class="text-black" height-hint="10px">{{isAuthenticated ? user.email : 'My Tienda'}}</div>
        </q-toolbar-title>

        <q-space />

        <div class="GPLAY__toolbar-input-container row no-wrap">
          <q-input dense outlined square placeholder="Search" class="bg-white col" />
          <q-btn class="GPLAY__toolbar-input-btn" color="primary" icon="search" unelevated />
        </div>

        <div>
          <q-btn color='negative' v-if="isAuthenticated" @click="signOut">SignOut</q-btn>
        </div>

        <q-space />

      </q-toolbar>
    </q-header>

    <q-drawer
      v-model="leftDrawerOpen"
      show-if-above
      bordered
      :width="200"
      v-bind:class="[dark ? 'bg-grey-10' : 'grey-2']" 
    >
    <q-scroll-area style="height: calc(100% - 150px); margin-top: 150px; border-right: 1px solid #ddd">
      <q-list padding> 
           <q-item clickable v-ripple to="/" active-class="my-menu-link" exact>
              <q-item-section avatar>
                <q-icon name="home" />
              </q-item-section>

              <q-item-section>
                Home
              </q-item-section>
            </q-item>

        <EssentialLink
          v-for="link in essentialLinks"
          :key="link.title"
          v-bind="link"
        />
      </q-list>
               <div class="bg-grey-8 text-black" height-hint="10px">HolaSur S.A</div>
           </q-scroll-area>
        <div>
        <q-img class="absolute-top" src="images/ventana_1.webp" style="height: 150px">
          <div class="absolute-bottom bg-transparent">
          </div>
        </q-img>
        </div>
           
    </q-drawer>

    <q-page-container>

      <router-view />
    </q-page-container>
     <q-footer elevated class="bg-grey-8 text-white" height-hint="10px">
      
    </q-footer>
  </q-layout>
</template>

<script>
import EssentialLink from 'components/EssentialLink.vue'
import { defineComponent, ref } from 'vue'
import { auth, db } from "boot/firebase";
import { useAuth } from '@vueuse/firebase/useAuth'



const linksList = [
  {
    name: 'Products',
    description: 'Panel de Administracion',
    icon: 'school',
    to: '/admin/products'
  },
  {
    name: 'Categories',
    description: 'administracion de Productos',
    icon: 'code',
    to: '/admin/categories'
  },
  {
    name: 'Lineas',
    description: 'administracion y Configuracion Lineas',
    icon: 'config',
    to: '/admin/line'
  },
  {
    name: 'Config',
    description: 'administracion y Configuracion',
    icon: 'config',
    to: '/admin/config'
  },
];


export default defineComponent({
  name: 'MainLayoutAdmin',

  components: {
    EssentialLink
  },

  setup () {
    const leftDrawerOpen = ref(false)
    const {isAuthenticated, user} = useAuth(auth)

    return {
      isAuthenticated,
      user,
      essentialLinks: linksList,
      leftDrawerOpen,
      toggleLeftDrawer () {
        leftDrawerOpen.value = !leftDrawerOpen.value
      },

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

<style lang="sass">

.my-menu-link
  color: white
  background: #F2C037


.GPLAY
  &__toolbar
    height: 60px
  &__logo
    width: 183px
    height: 39px
  &__toolbar-input-container
    min-width: 100px
    width: 55%
  &__toolbar-input-btn
    border-radius: 0
    max-width: 60px
    width: 100%
  &__drawer-link
    .q-item__section--avatar
      margin: -8px 0 -8px -16px
      padding: 8px 0 8px 16px
    .q-item__section--main
      margin: -8px -16px -8px 16px
      padding: 8px 16px 8px 2px
      font-size: 18px
      font-weight: 300
    &--apps, &--movies, &--music, &--books, &--devices
      background: #f5f5f5!important
      &:hover
        color: #eee !important
    &--apps:hover
      background: #43a047!important
    &--movies:hover
      background: #e53935!important
    &--music:hover
      background: #fb8c00!important
    &--books:hover
      background: #1e88e5!important
    &--devices:hover
      background: #546e7a!important
  &__drawer-item
    padding: 6px 12px 6px 23px
  &__sticky
    min-height: 49px
    border-bottom: 1px solid rgba(0,0,0,0.12)
  &__sticky-help
    border: 1px solid #ccc
    padding-left: 8px
    padding-right: 8px
  &__sticky-settings
    padding-left: 17px
    padding-right: 17px
    border: 1px solid #ccc
</style>