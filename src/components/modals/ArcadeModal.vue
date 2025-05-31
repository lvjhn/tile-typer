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

const price = Math.max(250, average(state.stats.value.averageScores.arcade) / 5) 

function goto(page, subpage) {
    router.push({ path: page, query: { subpage: subpage }})
}

function enterArcade() {
    state.coins.value -= price 
    if(state.soundSettings.value.soundEffects) {
        const invalidSound = new Audio("/sounds/coins.wav")
        invalidSound.play()
    }
    goto("game", "arcade")
}

</script>

<template>
    <Modal 
        title="Enter Arcade Mode" 
        @close="$emit('close')"
    >
        <div class="content">
            <section>Entering the arcade will cost you:</section>
            <section class="reward">
                <div class="amount">
                    {{ price.toFixed(0) }}
                </div>
                <div class="icon">
                    <img src="/icons/coin.png" width="20" />
                </div>
            </section>
            <section class="buttons">
                <section class="yes">
                    <button 
                        @click="enterArcade()"
                        :disabled="price > state.coins.value"
                    >
                        YES
                        {{ price > state.coins.value ? '(INSUFFICIENT COINS)' : '' }}
                    </button>
                </section>
                <section class="no">
                    <button @click="$emit('close')">NO</button>
                </section>
            </section>
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

        .reward {
            display: flex; 
            flex-direction: row;
            align-items: center;
            justify-content: center;
            gap: 5px;
            font-weight: bold;
            margin-top: 10px;

            .icon {
                display: flex;
                align-items: center;
                justify-content: center;
            }
        }

        .buttons {
            width: 100%;
            margin-top: 20px;
            display: flex;
            flex-direction: column;
            gap: 5px;
            
            button {
                font-size: 20px;
                padding: 5px;
                width: 100%;
            }
        }
    }
</style>