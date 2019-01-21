<template>
    <div class="mainBlock">
        <div class="pollName">{{pollData.pollName.charAt(0).toUpperCase()}}{{pollData.pollName.slice(1).toLowerCase()}}</div>
        <div class="activeBlock">
            <div class="activeBlockStatus">
                <div class="activeBlockStatusKey">Status :</div>
                <div id="pollStatus" v-if="pollData.active == false" class="activeBlockStatusValueInactive">Inactive</div>
                <div id="pollStatus" v-else class="activeBlockStatusValueActive">Active</div>
            </div>
            <button id="pollActivate" v-if="pollData.active == false" @click="activateContractOpenPrompt" class="activeBlockButton">Activate Contract</button>
        </div>
        <div class="contractAddress">
            <div class="contractAddressKey">Contract address :</div>
            <div class="contractAddressValue">{{contractAddress}}</div>
        </div>
        <div class="pollDates">
            <div class="pollDateBlock">
                <div class="pollDateKey">Created :</div>
                <div class="pollDateValue">{{buildDate(pollData.creationDate)}}</div>
            </div>
            <div class="pollDateBlock">
                <div class="pollDateKey">End :</div>
                <div class="pollDateValue">{{buildDate(pollData.finishDate)}}</div>
            </div>
        </div>
        <div class="pollItems">
            <div class="pollItemsTitle">Items</div>
            <div class="pollItemsTotal">
                <div class="pollItemsTotalKey">Total Amount Of Votes :</div>
                <div class="pollItemsTotalValue">{{pollData.totalVotes}}</div>
            </div>
            <ul id="pollItemsList" class="pollItemsList">
                <li class="pollItemsListElement">
                    <div class="pollItemsListElementLabel">Name</div>
                    <div class="pollItemsListElementLabel">Votes</div>
                </li>
                <li class="pollItemsListElement" v-for="item in pollData.pollItems">
                    <div class="pollItemsListElementValue">{{item.name}}</div>
                    <div class="pollItemsListElementValue">{{item.votes}}</div>
                </li>
            </ul>
            <button id="addItem" v-if="pollData.active == false" @click="addItemOpenForm" class="pollItemsAdd">Add Item</button>
        </div>
        <button @click="pollVoteOpenPrompt" id="pollVote" v-if="pollData.active == true" class="pollVote">Vote</button>
        <button @click="pollVoteOpenPrompt" id="pollVote" v-else class="pollVote" style="display:none">Vote</button>
        <button @click="closePollOpenPrompt" id="pollClose" class="pollClose">End Poll</button>
        <div class="vote">
            <!--
            <b-button @click="vote">vote</b-button>
            <b-button @click="closePoll">closePoll</b-button>-->
        </div>
    </div>
</template>

<script>
    import Vue from 'vue';
    //import BootstrapVue from 'bootstrap-vue';
    import jquery from 'jquery';
    import BlockPoll from '../eth.js';

    //import 'bootstrap/dist/css/bootstrap.css'
    //import 'bootstrap-vue/dist/bootstrap-vue.css'
    //import 'pc-bootstrap4-datetimepicker/build/css/bootstrap-datetimepicker.css';
    import { clearInterval } from 'timers';
import { error } from 'util';

    //Vue.use(BootstrapVue);
    Vue.use(jquery);
    Vue.use(BlockPoll);

    //console.log(this.$router.params.contractAddress);

    export default {
        data() {
            return {
                contractAddress: this.$router.history.current.params.contractAddress,
                pollData: null,
                refresh: null,
            }
        },
        name: 'Vote',
        mounted() {
            this.$nextTick(function () {
                window.instanceVue = this;
                this.getPollData();
                this.refresh = setInterval(function () {
                    window.instanceVue.getPollData();
                }, 15000);
            });
        },
        destroy() {
            clearInterval(this.refresh);
        },
        methods: {

            pollVoteOpenPrompt()
            {
                if (document.getElementById('pollVoteBackground')) return;

                var background  = document.createElement('div');
                var container   = document.createElement('div');
                var loader      = document.createElement('div');

                background      .setAttribute('id', 'pollVoteBackground');

                background      .setAttribute('class', 'requestBackground');
                container       .setAttribute('class', 'requestContainer');
                loader          .setAttribute('class', 'requestLoader');

                container       .appendChild(loader);

                document.body.appendChild(background);
                document.body.appendChild(container);

                BlockPoll.getContract(this.contractAddress).then(function(contract)
                {
                    BlockPoll.getPollData(contract).then(function(pollData)
                    {
                        BlockPoll.parsePollData(contract, pollData).then(function(pollObject)
                        {
                            self.pollData = pollObject;

                            loader.remove();

                            var popup       = document.createElement('div');
                            var buttons     = document.createElement('div');
                            var list        = document.createElement('ul');
                            var confirm     = document.createElement('button');
                            var cancel      = document.createElement('button');

                            popup           .setAttribute('class', 'requestPopup');
                            buttons         .setAttribute('class', 'requestPopupButtons');
                            confirm         .setAttribute('class', 'requestPopupConfirm');
                            cancel          .setAttribute('class', 'requestPopupCancel');

                            popup           .innerHTML += `<div class="requestPopupTitle">Vote</div>`;

                            //for(var x = 0; x < pollData.pollItems.length; x++) list.innerHTML += `<li><span>${pollObject.pollItems[x].name}</span><input type="radio" name="vote" value="${pollObject.pollItems[x].name}" /></li>`;

                            confirm         .innerText = 'Send Vote';
                            cancel          .innerText = 'Cancel';

                            cancel          .addEventListener('click', () =>
                            {
                                container.remove();
                                background.remove();
                            });

                            buttons         .appendChild(confirm);
                            buttons         .appendChild(cancel);
                            popup           .appendChild(list);
                            popup           .appendChild(buttons);
                            container       .appendChild(popup);

                        }).catch(function(error)
                        {
                            loader.remove();

                            var errorBlock = document.createElement('div');
                            var errorClose = document.createElement('button');

                            errorBlock.setAttribute('class', 'requestError');
                            errorClose.setAttribute('class', 'requestErrorClose');

                            errorBlock.innerHTML += `<div class="requestErrorTitle">Error</div>`;
                            errorBlock.innerHTML += `<div class="requestErrorMessage">${error}</div>`;

                            errorClose.innerText = 'Close';

                            errorClose.addEventListener('click', () => {
                                container.remove();
                                background.remove();
                            });

                            errorBlock.appendChild(errorClose);
                            container.appendChild(errorBlock);
                        });
                    }).catch(function(error)
                    {
                        loader.remove();

                        var errorBlock = document.createElement('div');
                        var errorClose = document.createElement('button');

                        errorBlock.setAttribute('class', 'requestError');
                        errorClose.setAttribute('class', 'requestErrorClose');

                        errorBlock.innerHTML += `<div class="requestErrorTitle">Error</div>`;
                        errorBlock.innerHTML += `<div class="requestErrorMessage">${error}</div>`;

                        errorClose.innerText = 'Close';

                        errorClose.addEventListener('click', () => {
                            container.remove();
                            background.remove();
                        });

                        errorBlock.appendChild(errorClose);
                        container.appendChild(errorBlock);
                    });
                }).catch(function(error)
                {
                    loader.remove();

                    var errorBlock = document.createElement('div');
                    var errorClose = document.createElement('button');

                    errorBlock.setAttribute('class', 'requestError');
                    errorClose.setAttribute('class', 'requestErrorClose');

                    errorBlock.innerHTML += `<div class="requestErrorTitle">Error</div>`;
                    errorBlock.innerHTML += `<div class="requestErrorMessage">${error}</div>`;

                    errorClose.innerText = 'Close';

                    errorClose.addEventListener('click', () => {
                        container.remove();
                        background.remove();
                    });

                    errorBlock.appendChild(errorClose);
                    container.appendChild(errorBlock);
                });
            },

            closePollOpenPrompt()
            {
                if (document.getElementById('closePollBackground')) return;

                var background  = document.createElement('div');
                var container   = document.createElement('div');
                var popup       = document.createElement('div');
                var buttons     = document.createElement('div');
                var confirm     = document.createElement('button');
                var cancel      = document.createElement('button');

                background      .setAttribute('id', 'closePollBackground');

                background      .setAttribute('class', 'requestBackground');
                container       .setAttribute('class', 'requestContainer');
                popup           .setAttribute('class', 'requestPopup');
                buttons         .setAttribute('class', 'requestPopupButtons');
                confirm         .setAttribute('class', 'requestPopupConfirm');
                cancel          .setAttribute('class', 'requestPopupCancel');

                popup           .innerHTML += `<div class="requestPopupTitle">Close Poll</div>`;
                popup           .innerHTML += `<div class="requestPopupMessage">Once closed, it will not be possible to vote anymore. Are you sure ?</div>`;

                confirm         .innerText = 'Close';
                cancel          .innerText = 'Cancel';

                confirm         .addEventListener('click', () =>
                {
                    popup.remove();

                    var loader = document.createElement('div');

                    loader.setAttribute('class', 'requestLoader');

                    container.appendChild(loader);

                    BlockPoll.getContract(this.contractAddress).then(function(result)
                    {
                        BlockPoll.closePoll(result).then(function(result)
                        {
                            BlockPoll.getTransactionReceiptMined(result).then(function(res)
                            {
                                container.remove();
                                background.remove();

                                if(document.getElementById('pollStatus') == null) return;

                                document.getElementById('pollStatus').setAttribute('class', 'activeBlockStatusValueInactive');
                                document.getElementById('pollStatus').innerText = 'Ended';

                                if(document.getElementById('pollActivate')) document.getElementById('pollActivate').remove();
                                if(document.getElementById('pollClose')) document.getElementById('pollClose').remove();
                                if(document.getElementById('addItem')) document.getElementById('addItem').remove();
                                if(document.getElementById('pollVote')) document.getElementById('pollVote').remove();

                            }).catch(function(error)
                            {
                                loader.remove();

                                var errorBlock = document.createElement('div');
                                var errorClose = document.createElement('button');

                                errorBlock.setAttribute('class', 'requestError');
                                errorClose.setAttribute('class', 'requestErrorClose');

                                errorBlock.innerHTML += `<div class="requestErrorTitle">Error</div>`;
                                errorBlock.innerHTML += `<div class="requestErrorMessage">${error}</div>`;

                                errorClose.innerText = 'Close';

                                errorClose.addEventListener('click', () => {
                                    container.remove();
                                    background.remove();
                                });

                                errorBlock.appendChild(errorClose);
                                container.appendChild(errorBlock);
                            });
                        }).catch(function(error)
                        {
                            loader.remove();

                            var errorBlock = document.createElement('div');
                            var errorClose = document.createElement('button');

                            errorBlock.setAttribute('class', 'requestError');
                            errorClose.setAttribute('class', 'requestErrorClose');

                            errorBlock.innerHTML += `<div class="requestErrorTitle">Error</div>`;
                            errorBlock.innerHTML += `<div class="requestErrorMessage">${error}</div>`;

                            errorClose.innerText = 'Close';

                            errorClose.addEventListener('click', () => {
                                container.remove();
                                background.remove();
                            });

                            errorBlock.appendChild(errorClose);
                            container.appendChild(errorBlock);
                        });
                    }).catch(function(error)
                    {
                        loader.remove();

                        var errorBlock = document.createElement('div');
                        var errorClose = document.createElement('button');

                        errorBlock.setAttribute('class', 'requestError');
                        errorClose.setAttribute('class', 'requestErrorClose');

                        errorBlock.innerHTML += `<div class="requestErrorTitle">Error</div>`;
                        errorBlock.innerHTML += `<div class="requestErrorMessage">${error}</div>`;

                        errorClose.innerText = 'Close';

                        errorClose.addEventListener('click', () => {
                            container.remove();
                            background.remove();
                        });

                        errorBlock.appendChild(errorClose);
                        container.appendChild(errorBlock);
                    });
                });

                cancel          .addEventListener('click', () =>
                {
                    container.remove();
                    background.remove();
                });

                buttons         .appendChild(confirm);
                buttons         .appendChild(cancel);
                popup           .appendChild(buttons);
                container       .appendChild(popup);

                document.body.appendChild(background);
                document.body.appendChild(container);
            },

            buildDate(date)
            {
                var str = '';

                str += date.getFullYear() + '/';
                str += parseInt(date.getMonth() + 1) < 10 ? `0${parseInt(date.getMonth() + 1)}/` : `${parseInt(date.getMonth() + 1)}/`;
                str += date.getDate() < 10 ? `0${date.getDate()} - ` : `${date.getDate()} - `;
                str += date.getHours() < 10 ? `0${date.getHours()}:` : `${date.getHours()}:`;
                str += date.getMinutes() < 10 ? `0${date.getMinutes()}:` : `${date.getMinutes()}:`;
                str += date.getSeconds() < 10 ? `0${date.getSeconds()}` : date.getSeconds();

                return str;
            },

            addItemOpenForm()
            {
                if (document.getElementById('addItemBackground')) return;

                var background  = document.createElement('div');
                var container   = document.createElement('div');
                var popup       = document.createElement('div');
                var buttons     = document.createElement('div');
                var confirm     = document.createElement('button');
                var cancel      = document.createElement('button');

                background      .setAttribute('id', 'addItemBackground');

                background      .setAttribute('class', 'requestBackground');
                container       .setAttribute('class', 'requestContainer');
                popup           .setAttribute('class', 'requestPopup');
                buttons         .setAttribute('class', 'requestPopupButtons');
                confirm         .setAttribute('class', 'requestPopupConfirm');
                cancel          .setAttribute('class', 'requestPopupCancel');

                popup           .innerHTML += `<div class="requestPopupTitle">Add Item</div>`;
                popup           .innerHTML += `<input id="addItemInput" placeholder="Item Name" type="text" class="requestPopupInput" />`;

                confirm         .innerText = 'Add';
                cancel          .innerText = 'Cancel';

                confirm         .addEventListener('click', () =>
                {
                    if(document.getElementById('addItemInput') == null) return;

                    document.getElementById('addItemInput').removeAttribute('style');

                    const itemName = document.getElementById('addItemInput').value.trim();

                    if(itemName.length === 0) return document.getElementById('addItemInput').style.border = '1px solid #D9534F';

                    popup.remove();

                    var loader = document.createElement('div');

                    loader.setAttribute('class', 'requestLoader');

                    container.appendChild(loader);

                    BlockPoll.getContract(this.contractAddress).then(function(result)
                    {
                        BlockPoll.addPollItem(result, itemName).then(function(result)
                        {
                            BlockPoll.getTransactionReceiptMined(result).then(function(res)
                            {
                                container.remove();
                                background.remove();

                            }).catch(function(error)
                            {
                                loader.remove();

                                var errorBlock = document.createElement('div');
                                var errorClose = document.createElement('button');

                                errorBlock.setAttribute('class', 'requestError');
                                errorClose.setAttribute('class', 'requestErrorClose');

                                errorBlock.innerHTML += `<div class="requestErrorTitle">Error</div>`;
                                errorBlock.innerHTML += `<div class="requestErrorMessage">${error}</div>`;

                                errorClose.innerText = 'Close';

                                errorClose.addEventListener('click', () => {
                                    container.remove();
                                    background.remove();
                                });

                                errorBlock.appendChild(errorClose);
                                container.appendChild(errorBlock);
                            });
                        }).catch(function(error)
                        {
                            loader.remove();

                            var errorBlock = document.createElement('div');
                            var errorClose = document.createElement('button');

                            errorBlock.setAttribute('class', 'requestError');
                            errorClose.setAttribute('class', 'requestErrorClose');

                            errorBlock.innerHTML += `<div class="requestErrorTitle">Error</div>`;
                            errorBlock.innerHTML += `<div class="requestErrorMessage">${error}</div>`;

                            errorClose.innerText = 'Close';

                            errorClose.addEventListener('click', () => {
                                container.remove();
                                background.remove();
                            });

                            errorBlock.appendChild(errorClose);
                            container.appendChild(errorBlock);
                        });
                    }).catch(function(error)
                    {
                        loader.remove();

                        var errorBlock = document.createElement('div');
                        var errorClose = document.createElement('button');

                        errorBlock.setAttribute('class', 'requestError');
                        errorClose.setAttribute('class', 'requestErrorClose');

                        errorBlock.innerHTML += `<div class="requestErrorTitle">Error</div>`;
                        errorBlock.innerHTML += `<div class="requestErrorMessage">${error}</div>`;

                        errorClose.innerText = 'Close';

                        errorClose.addEventListener('click', () => {
                            container.remove();
                            background.remove();
                        });

                        errorBlock.appendChild(errorClose);
                        container.appendChild(errorBlock);
                    });
                });

                cancel          .addEventListener('click', () =>
                {
                    container.remove();
                    background.remove();
                });

                buttons         .appendChild(confirm);
                buttons         .appendChild(cancel);
                popup           .appendChild(buttons);
                container       .appendChild(popup);

                document.body.appendChild(background);
                document.body.appendChild(container);
            },

            activateContractOpenPrompt()
            {
                if(document.getElementById('activeContractBackground')) return;

                var background  = document.createElement('div');
                var container   = document.createElement('div');
                var popup       = document.createElement('div');
                var buttons     = document.createElement('div');
                var confirm     = document.createElement('button');
                var cancel      = document.createElement('button');

                background      .setAttribute('id', 'activeContractBackground');

                background      .setAttribute('class', 'requestBackground');
                container       .setAttribute('class', 'requestContainer');
                popup           .setAttribute('class', 'requestPopup');
                buttons         .setAttribute('class', 'requestPopupButtons');
                confirm         .setAttribute('class', 'requestPopupConfirm');
                cancel          .setAttribute('class', 'requestPopupCancel');

                popup           .innerHTML += `<div class="requestPopupTitle">Activate Contract</div>`;
                popup           .innerHTML += `<div class="requestPopupMessage">This contract cannot be modified once it has started. Are you sure ?</div>`;
                
                confirm         .innerText = 'Activate';
                cancel          .innerText = 'Cancel';

                confirm         .addEventListener('click', () =>
                {
                    popup.remove();

                    var loader = document.createElement('div');

                    loader.setAttribute('class', 'requestLoader');

                    container.appendChild(loader);

                    BlockPoll.getContract(this.contractAddress).then(function(result)
                    {
                        BlockPoll.setActive(result).then(function(result)
                        {
                            BlockPoll.getTransactionReceiptMined(result).then(function(res)
                            {
                                document.getElementById('pollStatus').setAttribute('class', 'activeBlockStatusValueActive');
                                document.getElementById('pollStatus').innerText = 'Active';

                                if(document.getElementById('pollActivate')) document.getElementById('pollActivate').remove();
                                if(document.getElementById('addItem')) document.getElementById('addItem').remove();

                                if(document.getElementById('pollVote')) document.getElementById('pollVote').removeAttribute('style');

                                container.remove();
                                background.remove();

                            }).catch(function(error)
                            {
                                loader.remove();

                                var errorBlock = document.createElement('div');
                                var errorClose = document.createElement('button');

                                errorBlock.setAttribute('class', 'requestError');
                                errorClose.setAttribute('class', 'requestErrorClose');

                                errorBlock.innerHTML += `<div class="requestErrorTitle">Error</div>`;
                                errorBlock.innerHTML += `<div class="requestErrorMessage">${error}</div>`;

                                errorClose.innerText = 'Close';

                                errorClose.addEventListener('click', () =>
                                {
                                    container.remove();
                                    background.remove();
                                });

                                errorBlock.appendChild(errorClose);
                                container.appendChild(errorBlock);
                            });
                        }).catch(function(error)
                        {
                            loader.remove();

                            var errorBlock = document.createElement('div');
                            var errorClose = document.createElement('button');

                            errorBlock.setAttribute('class', 'requestError');
                            errorClose.setAttribute('class', 'requestErrorClose');

                            errorBlock.innerHTML += `<div class="requestErrorTitle">Error</div>`;
                            errorBlock.innerHTML += `<div class="requestErrorMessage">${error}</div>`;

                            errorClose.innerText = 'Close';

                            errorClose.addEventListener('click', () => {
                                container.remove();
                                background.remove();
                            });

                            errorBlock.appendChild(errorClose);
                            container.appendChild(errorBlock);
                        });
                    }).catch(function(error)
                    {
                        loader.remove();

                        var errorBlock = document.createElement('div');
                        var errorClose = document.createElement('button');

                        errorBlock.setAttribute('class', 'requestError');
                        errorClose.setAttribute('class', 'requestErrorClose');

                        errorBlock.innerHTML += `<div class="requestErrorTitle">Error</div>`;
                        errorBlock.innerHTML += `<div class="requestErrorMessage">${error}</div>`;

                        errorClose.innerText = 'Close';

                        errorClose.addEventListener('click', () => {
                            container.remove();
                            background.remove();
                        });

                        errorBlock.appendChild(errorClose);
                        container.appendChild(errorBlock);
                    });
                });

                cancel          .addEventListener('click', () =>
                {
                    container.remove();
                    background.remove();
                });

                buttons         .appendChild(confirm);
                buttons         .appendChild(cancel);
                popup           .appendChild(buttons); 
                container       .appendChild(popup);

                document.body.appendChild(background);
                document.body.appendChild(container);
            },

            getPollData() {
                var self = this;

                BlockPoll.getContract(this.contractAddress).then(function (contract) {
                    BlockPoll.getPollData(contract).then(function (pollData) {
                        BlockPoll.parsePollData(contract, pollData).then(function (pollObject) {
                            self.pollData = pollObject;
                        }).catch(function (error) {
                            console.log(error);
                        });
                    }).catch(function (error) {
                        console.log(error);
                    });
                }).catch(function (error) {
                    console.log(error);
                });
            },
            addPollItem() {
                
                BlockPoll.getContract(this.contractAddress).then(function (result) {
                    BlockPoll.addPollItem(result, "Random").then(function (result) {
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
    @import '../assets/main.css';
</style>