import Vue from 'vue';
import App from './App.vue';
import Router from 'vue-router'
import home from '@/components/Home';
import vote from '@/components/Vote';

Vue.use(Router)

const routes = [
    { path: '/', component: home },
    { path: '/:contractAddress', component: vote, props: true }
];

// fix
const router = new Router({ routes });

Vue.config.productionTip = true;

new Vue({
    el: '#app',
    render: h => h(App),
    router: router,
    devServer: {
        disableHostCheck: true
    }
});
