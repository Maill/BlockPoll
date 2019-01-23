<template>
    
    <div class="home" :style="{ backgroundImage: 'url(\'' + bgimage + '\')' }">
        <b-navbar toggleable="md" type="dark" variant="dark">

            <b-navbar-toggle target="nav_collapse"></b-navbar-toggle>

            <b-navbar-brand href="#">BlockPoll</b-navbar-brand>

            <b-collapse is-nav id="nav_collapse">

                <b-nav-text>Application de vote en ligne bas&eacute;e sur la blockchain Ethereum</b-nav-text>

                <!-- Right aligned nav items -->
                <b-navbar-nav class="ml-auto">

                    <b-nav-form>
                        <b-form-input size="sm" class="mr-sm-2" type="text" placeholder="Identifiant du vote" />
                        <b-button size="sm" class="my-2 my-sm-0" type="submit">Acc&egrave;der</b-button>
                    </b-nav-form>
                </b-navbar-nav>

            </b-collapse>
        </b-navbar>

        <b-container>
            <b-row align-v="center" align-h="center" align-content="center" style="margin-top:25%">
                <b-col class="text-center center-block">
                    <h1 style="color:white">Cr&eacute;ez votre scrutin maintenant !</h1>
                    <b-button size="lg" variant="primary" v-b-modal.createVote>
                        Cr&eacute;er votre scrutin
                    </b-button>
                    <b-button size="lg" variant="primary" style="margin-left:15px" v-b-modal.help>
                        En savoir plus
                    </b-button>
                </b-col>
            </b-row>
        </b-container>

        <b-modal id="createVote" title="Creation du scrutin" centered @ok="handleOk">
            <b-container fluid>
                <b-form @submit.stop.prevent="handleSubmit" id="pollCreateForm">
                    <b-form-group id="grpName" label="Donnez un nom a votre scrutin :" label-for="date">
                        <b-form-input type="text" id="name" name="name" v-model="name" style="width:200px"></b-form-input>
                    </b-form-group>
                    <b-form-group id="grpDate" label="Choisissez la date de fin de votre scrutin :" label-for="date">
                        <b-form-input type="date" id="date" name="date" v-model="date" style="width:200px"></b-form-input>
                    </b-form-group>
                </b-form>
            </b-container>
        </b-modal>

        <b-modal id="help" title="En savoir plus" centered>
            <p class="my-4">TODO</p>
        </b-modal>
    </div>
</template>

<script>
    import Vue from 'vue';
    import BootstrapVue from 'bootstrap-vue';
    import BlockPoll from '../eth.js';
    import jquery from 'jquery';
    import Methods from '../assets/methods.js';

    import 'bootstrap/dist/css/bootstrap.css'
    import 'bootstrap-vue/dist/bootstrap-vue.css'
    import 'pc-bootstrap4-datetimepicker/build/css/bootstrap-datetimepicker.css';

    Vue.use(BootstrapVue);
    Vue.use(jquery);
    Vue.use(BlockPoll);

    export default {
        data() {
            return {
                bgimage: require('./pollbg.png'),
                date: new Date(),
                name: ''
            }
        },
        name: 'Home',
        methods: {
            handleOk(evt) {
                try {
                    if (this.name === undefined || this.name.length < 3) {
                        alert('Le nom du scrutin doit avoir au moins 3 caractères.');
                        evt.preventDefault();
                        return;
                    }

                    if (this.date === undefined) {
                        alert('La date saisie n\'est pas valide.');
                        evt.preventDefault();
                        return;
                    }

                    //this.date = this.date.split("-");
                    //var formatedSelectedDate = this.date[1] + "/" + this.date[0] + "/" + this.date[2];

                    var currentDate = new Date();
                    var selectedDate = new Date(this.date);
                    if (selectedDate < currentDate) {
                        alert('La date choisie doit être égale ou supérieure à la date actuelle.');
                        evt.preventDefault();
                        return;
                    }

                    Methods.displayBackground();

                    Methods.displayLoader((loader) =>
                    {
                        BlockPoll.deployContract(this.name, selectedDate.getTime());
                    });
                
                } catch (exp) {
                    // eslint-disable-next-line
                    console.log(exp);
                    alert('La date saisie n\'est pas valide.');
                    evt.preventDefault();
                    return;
                }
            },
            contractDeployed(contract) {
                if(document.getElementById('requestContainer')) document.getElementById('requestContainer').remove();
                if(document.getElementById('requestBackground')) document.getElementById('requestBackground').remove();
                window.location.href = '/#/' + contract.address;
            }
        },
        mounted() {
            this.$nextTick(function () {
                window.instanceVue = this;
            });
        }
    };
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
    .home {
        background-size: cover;
        height: -webkit-fill-available;
    }
</style>
