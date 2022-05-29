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

    <div class="index_contenedor_table" v-if="select == 'Lineas'">
      <q-dialog v-model="showAddLine">
        <add-lines @close="showAddLine = false" />
      </q-dialog>
      <q-table
        title="Table Lines"
        :rows="getLines"
        :columns="columnsLines"
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
          <q-td key="description" :props="props">
            <div class="text-pre-wrap">{{ props.row.description.slice(0,35)}}</div>
            <q-popup-edit v-model="props.row.description" title="Update Description" buttons persistent  v-slot="scope">
              <q-input type="textarea" v-model="scope.value" dense autofocus hint="Use buttons to close"/>
            </q-popup-edit>
          </q-td>
           <q-td key="active" :props="props">
              <div v-if="props.row.active">
                    <q-btn size="10px" class="glossy" round color="secondary" icon="local_florist" @click="activeLine(props.row.id)"/>
                </div>
                <div v-if="!props.row.active">
                  <q-btn size="10px" class="glossy" round color="deep-orange" icon="layers_clear" @click="activeLine(props.row.id)"/>
              </div>
           </q-td>
          <q-td key="actions" class="row">
            <div class="col">
              <q-btn class="col" size="12px" round color="green-5" icon="cached" @click="editLine(props.row.id)" /> 
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
import addLines from "components/lines/addLines.vue";
import { ref } from "vue";
import { auth } from "boot/firebase";
import Card from "components/dashboard/Card.vue";


const linksList = [
          {
            title: 'Lineas',
            totalEvents: 0,
            icon: 'date_range',
            active: false,
           // to: '#/events'
          }, 
       ];

export default defineComponent({
  name: "AdminLine",

  components: {
    addLines,
    Card,
  },

  setup() {
    const $q = useQuasar();

    function confirm(id) {
      $q.dialog({
        dark: true,
        title: "Confirm",
        message: "Would you delete to line on list?",
        cancel: true,
        persistent: true,
      })
        .onOk(async () => {
          try {
            const query = await db.collection("lines").doc(id).delete();
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
          this.deleteLine(id);
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
      select: ref('Lineas'),
      options: ['Lineas']
    };
  },

  data() {
    return {
      linesAux: [],
      showAddLine: false,
      evento: null,
      totalEvento : 10,
    };
  },

  created() {
   this.listLines();
  },


  computed: {
    ...mapState("lines/lines", ["lines",'columnsLines']),
    ...mapGetters("lines/lines", ["getLines"]),
    ...mapGetters("dashboard/dashboard", ["getCardList"]),
  },

  methods: {
    ...mapActions("lines/lines", ["setLines", "deleteLine"]),
    ...mapActions('dashboard/dashboard', ['SET_PRODUCTS_TOTAL','SET_CATEGORIES_TOTAL','SET_SALES_TOTAL']),

    showform() {
      switch (this.select) {

        case "Lineas":
          console.log("es Lineas");
           this.showAddLine = true;
            break;

        default:
        // code block
      }
    },

    async listLines() {
      try {
        if (this.getLines.length <= 0) {
          const resDb = await db.collection("lines").get();
          //  this.SET_CATEGORIES_TOTAL(resDb.size);
          resDb.forEach((element) => {
            const line = {
              id: element.id,
              name: element.data().name,
              description: element.data().description,
              active: element.data().active,
            };
            this.linesAux.push(line);
          });
          this.setLines(this.linesAux);
        }
      } catch (error) {
        console.log(error);
      }
    },


   async activeLine(id) {
      const line = this.lines.find(line => line.id === id);
      if(line !== null){
        const washingtonRef = doc(db, "lines", id);

        await updateDoc(washingtonRef, {
                      active: !line.active,
        })
        .then( (resp) => {
            const linesUpdate = this.lines.map(p => {
              if(p.id === id){
                p.active = !p.active
              }
              return p;
              });
           this.lines = linesUpdate;            
        })
        .catch( (error) => {
          console.log('erro :', error)
        });

      }
    },
 

   async editLine(id) {
      const line = this.lines.find(line => line.id === id);
      if(line !== null){
        const washingtonRef = doc(db, "lines", id);

        // Set the "capital" field of the city 'DC'
        await updateDoc(washingtonRef, {
                  name: line.name,
                  description: line.description,
                  active: line.active,
        })
        .then( (reesp) => {
                  this.$q.notify({
                   message: 'Line updated successfully',
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