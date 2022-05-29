<template>
  <div class="formulario"  >
   
    <h5>{{ access ? "Login" : "Registro" }}</h5>
    <q-form class="q-gutter-md" @submit.prevent="submitForm">
      <q-input v-if="!access"  label="Usuario" v-model="user.username" :rules="[ val => val.length >= 3 || 'Please use maximum 3 characters']" ref="username"/>
      <q-input label="Email" v-model="user.email" type="email"  :rules="[val => !!val || 'Email is missing', isValidEmail() ]" ref="email" />
            <p v-if="errors.indexOf('email') > -1">
              <span class="errors">
                !! El Email que Intenta usar ya se Encuentra Registrado !!
              </span>
            </p>
      <q-input label="Password" v-model="user.password" type="password" :rules="[ val => val.length >= 3 || 'Please use maximum 3 characters']"  ref="password" />

      <q-btn color="primary" type="submit">{{
        access ? "Login" : "Registro"
      }}</q-btn>
      <q-btn color="primary" outline @click="access = true" v-if="!access">
        ¿Ya tienes cuenta? 
      </q-btn>
      <q-btn color="negative" outline @click="access = false" v-else>
        ¿No tienes cuenta?   {{getProducts}}
      </q-btn>
    </q-form>
  </div>
</template>

<script>
import { defineComponent } from 'vue'
import { ref } from 'vue'
import { auth } from 'boot/firebase'
import { useQuasar } from 'quasar';
import { mapState, mapActions, mapGetters } from "vuex";



export default defineComponent({
  name: 'FormLogin',

    setup() {
    const email = ref('test@test.com')
    const password = ref('123456')
    const access = ref(true)
    const $q = useQuasar()

    return {
        email,
        password,
        access,
        model: ref(null),
    }
  },

  data() {
      return {
          errors:[],
          user: {
                username: 'Info.Aluminio.Moreno2022',
                email: 'info.aluminio.moreno@gmail.com',
                password: 'admin123',          
                },
               
            }
        },


    created() {



        console.log(this.products)
    },

    computed: {

  
            },            

    methods: {
           ...mapState("./store/products", ["products", "columns"]),
            submitForm() {
   
                this.$refs.email.validate()
                this.$refs.password.validate()

              if(!this.$refs.email.hasError && !this.$refs.password.hasErrors){
                 if(this.access){
                    this.login(this.user);
                 }else{
                    this.$refs.username.validate()
                    if(!this.$refs.username.hasError ){
                      this.register(this.user);
                    }
                 }
                }
            }, 

        async login(user){
            try {
                    //longin
          const userCredential = await auth.signInWithEmailAndPassword(
            user.email,
            user.password
          );
          if(userCredential){
             console.log(userCredential.user);
             this.$router.push({name: 'adminProducts'});
 
              this.$q.notify({
                                message: 'Bienvenido!',
                                type: 'positive',
                                position: 'top-right',
                                timeout: 1000,
                                multiLine: false,
                              })
            }
            } catch (error) {
              console.log(error.message)
                  this.$q.notify({
                   message: 'Email o Password ICORRECTO!!',
                   type: 'negative',
                   position: 'center',
                   timeout: 1000,
                   multiLine: false,
                   })
            }
          },  

        async register(user){
          console.log('metodo no habilitado');
           /* try {
             this.errors = []; 
                  //register
              const userCredential = await auth.createUserWithEmailAndPassword(
              email.value,
              password.value
              );
             console.log(userCredential.user);
            } catch (error) {
              this.errors.push(error.response.data.message[0].field)
              if(error.response.data.message[0].field == 'email'){
                  const email = {
                            field:'email',
                            message: 'El Email que Intenta usar ya se Encuentra Registrado!!'
                          }
                this.errors.push(email)
              }
           }
           */ 
          },

         isValidEmail () {
                const emailPattern = /^(?=[a-zA-Z0-9@._%+-]{6,254}$)[a-zA-Z0-9._%+-]{1,64}@(?:[a-zA-Z0-9-]{1,63}\.){1,8}[a-zA-Z]{2,63}$/;
                return emailPattern.test(this.regEmail) || 'Invalid email';
              },  

    },

})
</script>

<style>
   .formulario {
    width: 90%;
    border-color: black;
    background-color: rgb(226, 233, 250);
    padding: 10px;
    border-radius: 10px;
    max-width: 600px;
    
  } 

  .active {
      background-color: rgb(33, 33, 34);
  }

  .errors{
        text-transform: uppercase;
        font: 600 0.8em/1 "Oswald", sans-serif;  /* tamanio  trazo titulo/ tamanio del titulo  */
        letter-spacing: 0;
        color:brown;
  }

</style>