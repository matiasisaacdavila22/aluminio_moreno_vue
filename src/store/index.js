import { store } from 'quasar/wrappers'
import { createStore } from 'vuex'
import products from './products';
import categories from './categories';
import dashboard from './dashboard';
import lines from './lines';
import models from './models';

// import example from './module-example'

/*
 * If not building with SSR mode, you can
 * directly export the Store instantiation;
 *
 * The function below can be async too; either use
 * async/await or return a Promise which resolves
 * with the Store instance.
 */

export default store(function (/* { ssrContext } */) {
  const Store = createStore({
    modules: {
      products,
      categories,
      dashboard,
      lines,
      models,
    },

    // enable strict mode (adds overhead!)
    // for dev mode and --debug builds only
    strict: false //process.env.DEBUGGING
  })

  return Store
})
