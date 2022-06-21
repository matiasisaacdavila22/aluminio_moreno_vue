<template>
  <div class="q-pa-md">
    <div class="index_title">
      <p class="index_p">
        <span class="idex_span"> App Dashboard</span>
      </p>
    </div>

    <div class="index_contenedor">
      <Card
        v-for="card in essentialLinks"
        :class="card.title == select ? 'card_active' : 'card_my-card'"
        :key="card.title"
        v-bind="card"
        :totalEvents="card.totalEvents"
        @click="select = card.title"
      />
    </div>
    <div class="q-pa-md">
      <q-btn
        label="Agregar +"
        color="primary"
        @click="showform(); evento = { title: 'Agregar', action: 'add', card: this.select };"
      />
    </div>

    <div class="index_contenedor_table" v-if="select == 'Modelos'">
      <q-dialog v-model="showAddModel">
        <add-models @close="showAddModel= false" />
      </q-dialog>
      <q-table
        title="Table Models"
        :rows="getModels"
        :columns="columnsModels"
        row-key="name"
        binary-state-sort
      >
       <template v-slot:body="props">
        <q-tr :props="props">
          <q-td key="name" :props="props">
            {{ props.row.name }}
            <q-popup-edit v-model="props.row.name" title="Update Name" buttons persistent  v-slot="scope">
              <q-input v-model="scope.value" dense autofocus counter hint="Use buttons to close"/>
            </q-popup-edit>
          </q-td>
          <q-td key="cost" :props="props">
            {{ props.row.cost }}
            <q-popup-edit v-model="props.row.cost" title="Update Cost" buttons persistent  v-slot="scope">
              <q-input v-model="scope.value" dense autofocus counter hint="Use buttons to close"/>
            </q-popup-edit>
          </q-td>
          <q-td key="factor" :props="props">
            {{ props.row.factor }}
            <q-popup-edit v-model="props.row.factor" title="Update factor" buttons persistent  v-slot="scope">
             <q-select outlined v-model="scope.value"  :options="getFactores" label="Outlined" />
            </q-popup-edit>
          </q-td>
          <q-td key="description" :props="props">
            <div class="text-pre-wrap">{{ props.row.description.slice(0,35)}}</div>
            <q-popup-edit v-model="props.row.description" title="Update Description" buttons persistent  v-slot="scope">
              <q-input type="textarea" v-model="scope.value" dense autofocus hint="Use buttons to close"/>
            </q-popup-edit>
          </q-td>
            <q-td key="activeFactor" :props="props">
              <div v-if="props.row.activeFactor">
                    <q-btn size="10px" class="glossy" round color="secondary" icon="local_florist" @click="activeFactor(props.row.id)"/>
                </div>
                <div v-if="!props.row.activeFactor">
                  <q-btn size="10px" class="glossy" round color="deep-orange" icon="layers_clear" @click="activeFactor(props.row.id)"/>
              </div>
           </q-td>
           <q-td key="active" :props="props">
              <div v-if="props.row.active">
                    <q-btn size="10px" class="glossy" round color="secondary" icon="local_florist" @click="activeModel(props.row.id)"/>
                </div>
                <div v-if="!props.row.active">
                  <q-btn size="10px" class="glossy" round color="deep-orange" icon="layers_clear" @click="activeModel(props.row.id)"/>
              </div>
           </q-td>
          <q-td key="actions" class="row">
            <div class="col">
              <q-btn class="col" size="12px" round color="green-5" icon="cached" @click="editModel(props.row.id)" /> 
            </div>
             <div class="col">
              <q-btn size="12px" round color="red-5" icon="delete"  @click="confirm(props.row.id)" />
            </div>              
          </q-td>
        </q-tr>
      </template>
      </q-table>
    </div>
  </div> 
</template>    

<script>
import { defineComponent } from "vue";
import { db } from "boot/firebase";
import { mapState, mapActions, mapGetters } from "vuex";
import { doc, updateDoc } from "firebase/firestore";
import { useQuasar } from "quasar";
import addModels from "components/models/addModels.vue";
import { ref } from "vue";
import { auth } from "boot/firebase";
import Card from "components/dashboard/Card.vue";


const linksList = [
          {
            title: 'Modelos',
            totalEvents: 0,
            icon: 'date_range',
            active: false,
           // to: '#/events'
          }, 
       ];

export default defineComponent({
  name: "AdminModel",

  components: {
    addModels,
    Card,
  },

  setup() {
    const $q = useQuasar();

    function confirm(id) {
      $q.dialog({
        dark: true,
        title: "Confirm",
        message: "Would you delete to Model on list?",
        cancel: true,
        persistent: true,
      })
        .onOk(async () => {
          try {
            const query = await db.collection("models").doc(id).delete();
          } catch (error) {
            this.$q.notify({
              message: error,
              color: "red",
              textColor: "white",
              icon: "clear",
            });
          }
        })
        .onOk(() => {
          this.deleteModel(id);
          this.$q.notify({
            message: "Task Deleted successfully",
            type: "negative",
            position: "top-right",
            timeout: 1000,
            multiLine: false,
          });
        })
        .onCancel(() => {})
        .onDismiss(() => {});
    }

    return {
      essentialLinks: linksList,
      confirm,
      prompt,
      select: ref('Modelos'),
      options: ['Modelelos']
    };
  },

  data() {
    return {
      modelsAux: [],
      showAddModel: false,
      evento: null,
      totalEvento : 10,
    };
  },

  created() {
   this.listModels();
  },


  computed: {
    ...mapState("models/models", ["models",'columnsModels']),
    ...mapGetters("models/models", ["getModels", "getFactores"]),
    ...mapGetters("dashboard/dashboard", ["getCardList"]),
  },

  methods: {
    ...mapActions("models/models", ["setModels", "deleteModel"]),
    ...mapActions('dashboard/dashboard', ['SET_PRODUCTS_TOTAL','SET_CATEGORIES_TOTAL','SET_SALES_TOTAL']),

    showform() {
      switch (this.select) {

        case "Modelos":
          console.log("es modelos");
           this.showAddModel = true;
            break;

        default:
        // code block
      }
    },

    async listModels() {
      try {
        if (this.getModels.length <= 0) {
          const resDb = await db.collection("models").get();
          //  this.SET_CATEGORIES_TOTAL(resDb.size);
          resDb.forEach((element) => {
            const model = {
              id: element.id,
              name: element.data().name,
              description: element.data().description,
              active: element.data().active,
              cost: element.data().cost,
              factor: element.data().factor,
              activeFactor: element.data().activeFactor
            };
            this.modelsAux.push(model);
          });
          this.setModels(this.modelsAux);
        }
      } catch (error) {
        console.log(error);
      }
    },


   async activeModel(id) {
      const model = this.models.find(model => model.id === id);
      if(model !== null){
        const washingtonRef = doc(db, "models", id);

        await updateDoc(washingtonRef, {
                      active: !model.active,
        })
        .then( (resp) => {
            const modelUpdate = this.models.map(p => {
              if(p.id === id){
                p.active = !p.active
              }
              return p;
              });
           this.models = modelUpdate;            
        })
        .catch( (error) => {
          console.log('erro :', error)
        });

      }
    },

       async activeFactor(id) {
      const model = this.models.find(model => model.id === id);
      if(model !== null){
        const washingtonRef = doc(db, "models", id);

        await updateDoc(washingtonRef, {
                      activeFactor: !model.activeFactor,
        })
        .then( (resp) => {
            const modelUpdate = this.models.map(p => {
              if(p.id === id){
                p.activeFactor = !p.activeFactor
              }
              return p;
              });
           this.models = modelUpdate;            
        })
        .catch( (error) => {
          console.log('erro :', error)
        });

      }
    },
 

   async editModel(id) {
      const model = this.models.find(model => model.id === id);
      if(model !== null){
        const washingtonRef = doc(db, "models", id);

        // Set the "capital" field of the city 'DC'
        await updateDoc(washingtonRef, {
                  name: model.name,
                  description: model.description,
                  active: model.active,
                  active: model.activeFactor,
                  cost: model.cost,
                  factor: model.factor
        })
        .then( (reesp) => {
                  this.$q.notify({
                   message: 'model updated successfully',
                   type: 'positive',
                   position: 'top-right',
                   timeout: 1000,
                   multiLine: false,
                   })
        })
        .catch( (error) => {
          console.log('erro :', error)
        });

      }
    },

 },


});
</script>

<style lang="scss">
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  font-family: Raleway;
}

a:link,
a:visited,
a:active {
  text-decoration: none;
}

@media screen and (min-width: 200px), print {
  .index_contenedor_padre {
    display: flex;
    flex-direction: column;
  }

  .index_contenedor {
    display: flex;
    flex-direction: column;
    margin: 10px;
  }

  .index_title {
    justify-content: center;

    p {
      span {
        text-transform: uppercase;
        font: 700 1.5em/1 "Oswald", sans-serif; /* tamanio  trazo titulo/ tamanio del titulo  */
        letter-spacing: 0;
        padding: 0.25em 0 0.325em;
        display: block;
        margin-left: 0 auto;
        text-shadow: 0 0 80px rgba(12, 11, 11, 0.5);
      }
    }
  }

  .card_items {
    margin: 5px;
  }

  .card_my-card {
    width: auto;
    height: 50px;
    border-radius: 5px;
    background: radial-gradient(circle, #3296ed 0%, #012750 100%);
    transition-duration: 0.5s, 0.5s, 0.5s, 0.5s;
    cursor: pointer;
    position: relative;
  }

  .card_sections {
    justify-content: space-between;
    display: flex;
    align-items: center;
    position: sticky;
  }

  .card_active {
    border-radius: 10px;
    height: 53px;
    -webkit-box-shadow: 11px 13px 7px -4px rgba(0, 0, 0, 0.59);
    -moz-box-shadow: 11px 13px 7px -4px rgba(0, 0, 0, 0.59);
    box-shadow: 11px 13px 7px -4px rgba(0, 0, 0, 0.59);
    background: radial-gradient(circle, #35a2ff 0%, #014a88 100%);
    transition-duration: 0.5s, 0.5s, 0.5s, 0.5s;
    cursor: pointer;
    position: relative;
    left: 6px;
    bottom: 3px;

    .card_sections {
      .text-h5 {
        color: rgb(7, 213, 69);
      }

      .text-h7 {
        color: rgb(16, 245, 16);
        //  text-shadow: 2px 0 0 #fff, -2px 0 0 #fff, 0 2px 0 #fff, 0 -2px 0 #fff, 1px 1px #fff, -1px -1px 0 #fff, 1px -1px 0 #fff, -1px 1px 0 #fff;
        text-transform: uppercase;
        font-weight: 600;
      }
    }
  }
}
@media screen and (min-width: 450px), print {
  .index_contenedor {
    /* flex-direction: column;
           flex-wrap: wrap ; /*nowrap */
  }

  .card_items {
  }

  .card_my-card {
  }
}

@media screen and (min-width: 850px), print {
  .index_contenedor {
    display: flex;
    flex-direction: row;
    align-content: flex-start;
    flex-flow: row wrap;
  }

  .card_items {
    padding: 0;
    margin: 5px;
  }

  .card_my-card {
    width: 150px;
    height: 85px;
    transition-duration: 0.5s, 0.5s, 0.5s, 0.5s;
  }

  .card_my-card:hover {
    border-radius: 7px;
    -webkit-box-shadow: 11px 13px 7px -4px rgba(0, 0, 0, 0.59);
    -moz-box-shadow: 11px 13px 7px -4px rgba(0, 0, 0, 0.59);
    box-shadow: 11px 13px 7px -4px rgba(0, 0, 0, 0.59);
    background: radial-gradient(circle, #35a2ff 0%, #014a88 100%);
    transition-duration: 0.5s, 0.5s, 0.5s, 0.5s;
  }

  .card_active {
    width: 150px;
    height: 87px;
    -webkit-box-shadow: 11px 13px 7px -4px rgba(0, 0, 0, 0.59);
    -moz-box-shadow: 11px 13px 7px -4px rgba(0, 0, 0, 0.59);
    box-shadow: 11px 13px 7px -4px rgba(0, 0, 0, 0.59);
    background: radial-gradient(circle, #35a2ff 0%, #014a88 100%);
    transition-duration: 0.5s, 0.5s, 0.5s, 0.5s;
    cursor: pointer;
    position: relative;
    left: 0px;
    bottom: 25px;
  }

  .index_contenedor_table {
    /* background-color: rgb(195, 230, 41); */
    max-width: 1300px;
    position: -webkit-sticky;
    position: sticky;
    top: 0;
  }
}
</style>