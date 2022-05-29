<template>
  <div class="q-pa-md">
    <div class="index_title">
      <p class="index_p">
        <span class="idex_span"> App Dashboard</span>
      </p>
    </div>

    <div class="index_contenedor">
      <Card
        v-for="card in getCardList"
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

    <div class="index_contenedor_table" v-if="select == 'Productos'">
      <q-dialog v-model="showAddProduct">
        <add-products @close="showAddProduct = false" />
      </q-dialog>
      <q-table
        title="Table Products"
        :rows="getProducts"
        :columns="columns"
        row-key="name"
        binary-state-sort
      >
 
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
import addProducts from "components/products/addProducts.vue";
import addCategories from 'components/categories/addCategories.vue';
import { ref } from "vue";
import { auth } from "boot/firebase";
import Card from "components/dashboard/Card.vue";

export default defineComponent({
  name: "AdminProducts",

  components: {
    addProducts,
    addCategories,
    Card,
  },

  setup() {
    const $q = useQuasar();

    function confirm(id) {
      $q.dialog({
        dark: true,
        title: "Confirm",
        message: "Would you delete to Product on list?",
        cancel: true,
        persistent: true,
      })
        .onOk(async () => {
          try {
            const query = await db.collection("products").doc(id).delete();
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
          this.deleteProduct(id);
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
      confirm,
      prompt,
      select: ref('Productos'),
      options: ['Productos', 'Categorias', 'Ventas', 'Compras']
    };
  },

  data() {
    return {
      productsAux: [],
      categoriesAux: [],
      salesAux: [],
      showAddProduct: false,
      showAddCategory: false,
      showAddSale: false,
      showAddCompras: false,
      evento: null,
      totalEvento : 10,
    };
  },

  created() {
   // this.listProducts();
   // this.listCategories();
  //  this.listSales();
  //console.log(this.getCategories)
  },


  computed: {
   // ...mapState("products/products", ["products", "columns"]),
   // ...mapState("categories/categories", ["categories",'columnsCategories']),
   // ...mapState('sales/sales', ['sales','columnsSales']),
    ...mapGetters("products/products", ["getProducts"]),
    ...mapGetters("dashboard/dashboard", ["getCardList"]),
  //  ...mapGetters('sales/sales', ['getSales'])
  },
/*
  methods: {
    ...mapActions("products/products", ["setProducts", "deleteProduct"]),
    ...mapActions("categories/categories", ["setCategories"]),
    ...mapActions('sales/sales',["SET_SALES"]),
    ...mapActions('dashboard/dashboard', ['SET_PRODUCTS_TOTAL','SET_CATEGORIES_TOTAL','SET_SALES_TOTAL']),

    showform() {
      switch (this.select) {
        case "Productos":
          console.log("es Productos");
        if (this.getProducts.length <= 0) {
            this.$q.notify({
              message: "No tienes Categorias Disponibles!!",
              type: "warning",
              position: "center",
              timeout: 1000,
              multiLine: false,
            });
            break;
          } else {
          this.showAddProduct = true;
          break;
          }

        case "Categorias":
          console.log("es Categorias");
           this.showAddCategory = true;
            break;

        case "Ventas":
          console.log("es Ventas");
          this.showAddSale = true;
              break;

        case "Compras":
          console.log("es Compras");
          break;

        default:
        // code block
      }
    },

    async listProducts() {
      try {
        if (true) {
          console.log(this.getProducts);
          var user = await auth.currentUser;
          console.log(user.uid);
          const resDb = await db.collection("products").where("author", "==", user.uid).get();
          this.SET_PRODUCTS_TOTAL(resDb.size);

          resDb.forEach((element) => {
            const product = {
              id: element.id,
              name: element.data().name,
              category: element.data().category,
              description: element.data().description,
              stock: element.data().stock,
              cost: element.data().cost,
              price: element.data().price,
              stars: element.data().stars,
              active: element.data().active,
              model: element.data().model,
              images: element.data().images,
            };
            this.productsAux.push(product);
          });
          this.setProducts(this.productsAux);
        }
      } catch (error) {
        console.log(error);
      }
    },

    async listCategories() {
      try {
        if (this.getCategories.length <= 0) {
          const resDb = await db.collection("categories").get();
            this.SET_CATEGORIES_TOTAL(resDb.size);
          resDb.forEach((element) => {
            const category = {
              id: element.id,
              name: element.data().name,
              description: element.data().description,
              active: element.data().active,
            };
            this.categoriesAux.push(category);
          });
          this.setCategories(this.categoriesAux);
        }
      } catch (error) {
        console.log(error);
      }
    },


    async listSales() {
      try {
        if (this.getSales.length <= 0) {
          const resDb = await db.collection("orders").get();
          this.SET_SALES_TOTAL(resDb.size);
          resDb.forEach((element) => {
            const order = {
              id: element.id,
              name: element.data().name,
              email: element.data().email,
              phone: element.data().phone,
              active: element.data().active,
            };
            this.salesAux.push(order);
          });
          this.SET_SALES(this.salesAux);
        }
      } catch (error) {
        console.log(error);
      }
    },

    async activeProduct(id) {
      const product = this.products.find((product) => product.id === id);
      if (product !== null) {
        const washingtonRef = doc(db, "products", id);

        await updateDoc(washingtonRef, {
          active: !product.active,
        })
          .then((reesp) => {
            const productsUpdate = this.products.map((p) => {
              if (p.id === id) {
                p.active = !p.active;
              }
              return p;
            });
            this.products = productsUpdate; // hay que colocar el action correspondiente para actualizar
          })
          .catch((error) => {
            console.log("erro :", error);
          });
      }
    },

    async editProduct(id) {
      const product = this.products.find((product) => product.id === id);
      if (product !== null) {
        const washingtonRef = doc(db, "products", id);

        // Set the "capital" field of the city 'DC'
        await updateDoc(washingtonRef, {
          name: product.name,
          category: product.category,
          description: product.description,
          stock: product.stock,
          cost: product.cost,
          price: product.price,
          stars: product.stars,
          active: product.active,
          model: product.model,
          imgaes: product.images,
        })
          .then((reesp) => {
            this.$q.notify({
              message: "Task updated successfully",
              type: "positive",
              position: "top-right",
              timeout: 1000,
              multiLine: false,
            });
          })
          .catch((error) => {
            console.log("erro :", error);
          });
      }
    },

   async activeCategory(id) {
      const category = this.categories.find(category => category.id === id);
      if(category !== null){
        const washingtonRef = doc(db, "categories", id);

        await updateDoc(washingtonRef, {
                      active: !category.active,
        })
        .then( (resp) => {
            const categoriesUpdate = this.categories.map(p => {
              if(p.id === id){
                p.active = !p.active
              }
              return p;
              });
           this.categories = categoriesUpdate;            
        })
        .catch( (error) => {
          console.log('erro :', error)
        });

      }
    },
 

   async editCategory(id) {
      const category = this.categories.find(category => category.id === id);
      if(category !== null){
        const washingtonRef = doc(db, "categories", id);

        // Set the "capital" field of the city 'DC'
        await updateDoc(washingtonRef, {
                  name: category.name,
                  description: category.description,
                  active: category.active,
        })
        .then( (reesp) => {
                  this.$q.notify({
                   message: 'Task updated successfully',
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

   async activeSale(id){
      const sale = this.sales.find(sale => sale.id === id);
      if(sale !== null){
        const washingtonRef = doc(db, "orders", id);

        await updateDoc(washingtonRef, {
                      active: !sale.active,
        })
        .then( (resp) => {
            const salesUpdate = this.sales.map(p => {
              if(p.id === id){
                p.active = !p.active
              }
              return p;
              });
           this.sales = salesUpdate;            
        })
        .catch( (error) => {
          console.log('erro :', error)
        });

      }
    },

  },
*/

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