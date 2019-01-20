<template>
    <div class="vote">
        Contract address : {{contractAddress}}
        <b-button @click="getPollData">getPollData</b-button>
        <b-button @click="addPollItem">addPollItem</b-button>
        <b-button @click="vote">vote</b-button>
        <b-button @click="setActive">setActive</b-button>
        <b-button @click="closePoll">closePoll</b-button>
        <b-button @click="getPollItemFromPoll">getPollItemFromPoll</b-button>
    </div>
</template>

<script>
    import Vue from 'vue';
    import BootstrapVue from 'bootstrap-vue';
    import jquery from 'jquery';
    import BlockPoll from '../eth.js';

    import 'bootstrap/dist/css/bootstrap.css'
    import 'bootstrap-vue/dist/bootstrap-vue.css'
    import 'pc-bootstrap4-datetimepicker/build/css/bootstrap-datetimepicker.css';


    Vue.use(BootstrapVue);
    Vue.use(jquery);
    Vue.use(BlockPoll);

    //console.log(this.$router.params.contractAddress);

    export default {
        data() {
            return {
                contractAddress: this.$router.history.current.params.contractAddress
            }
        },
        name: 'Vote',
        mounted() {
            this.$nextTick(function () {
                window.instanceVue = this;
            });
        },
        methods: {
            getPollData() {
                BlockPoll.getContract(this.contractAddress).then(function (result) {
                    BlockPoll.getPollData(result).then(function (result) {
                        console.log(result);
                    }).catch(function (error) {
                        console.log(error);
                    });
                }).catch(function (error) {
                    console.log(error);
                });
            },
            addPollItem() {
                BlockPoll.getContract(this.contractAddress).then(function (result) {
                    BlockPoll.addPollItem(result, "Nicolas").then(function (result) {
                        BlockPoll.getTransactionReceiptMined(result).then(function (res) {
                            console.log(res);
                        }).catch(function (err) {
                            console.log(err);
                        });
                    }).catch(function (error) {
                        console.log(error);
                    });
                }).catch(function (error) {
                    console.log(error);
                });
            },
            vote() {
                BlockPoll.getContract(this.contractAddress).then(function (result) {
                    BlockPoll.vote(result, "Nicolas").then(function (result) {
                        BlockPoll.getTransactionReceiptMined(result).then(function (res) {
                            console.log(res);
                        }).catch(function (err) {
                            console.log(err);
                        });
                    }).catch(function (error) {
                        console.log(error);
                    });
                }).catch(function (error) {
                    console.log(error);
                });
            }, 
            setActive() {
                BlockPoll.getContract(this.contractAddress).then(function (result) {
                    BlockPoll.setActive(result).then(function (result) {
                        BlockPoll.getTransactionReceiptMined(result).then(function (res) {
                            console.log(res);
                        }).catch(function (err) {
                            console.log(err);
                        });
                    }).catch(function (error) {
                        console.log(error);
                    });
                }).catch(function (error) {
                    console.log(error);
                });
            },
            closePoll() {
                BlockPoll.getContract(this.contractAddress).then(function (result) {
                    BlockPoll.closePoll(result).then(function (result) {
                        BlockPoll.getTransactionReceiptMined(result).then(function (res) {
                            console.log(res);
                        }).catch(function (err) {
                            console.log(err);
                        });
                    }).catch(function (error) {
                        console.log(error);
                    });
                }).catch(function (error) {
                    console.log(error);
                });
            },
            getPollItemFromPoll() {
                BlockPoll.getContract(this.contractAddress).then(function (result) {
                    BlockPoll.getPollItemFromPoll(result, 0).then(function (result) {
                        console.log(result);
                        console.log(result[1].toString());
                    }).catch(function (error) {
                        console.log(error);
                    });
                }).catch(function (error) {
                    console.log(error);
                });
            }
        }
    };
</script>

<style scoped>
</style>