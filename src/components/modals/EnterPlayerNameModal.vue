<script setup>
import { storeToRefs } from 'pinia';

import { useState } from '../../stores/state.store';
const $state = useState()
const state = storeToRefs($state)
import { useRouter } from 'vue-router';

const router = useRouter()

import Modal from '../Modal.vue';
import { average } from '../../plugins/average';
defineEmits('close')


</script>

<template>
    <Modal 
        title="Enter Player Name" 
        @close="$emit('close')"
    >
        <div class="content">
            <section>What's your player name?</section>
            <input class="player-name-input" v-model="state.playerName.value" />
            <button @click="$emit('close')">OK</button>
        </div>
    </Modal>
</template>

<style lang="scss" scoped>
    .content {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        font-size: 20px;
        padding-top: 10px;
        padding-bottom: 20px;
        padding-left: 20px;
        padding-right: 20px;
        font-size: 25px;

        .player-name-input {
            font-size: 25px;
            width: 100%;
        }

        button {
            margin-top: 10px;
            width: 100%;
            font-size: 25px;
        }
    }
</style>