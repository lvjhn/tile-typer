<script setup>
import { computed, ref } from 'vue';
import Modal from '../../components/Modal.vue';
import RewardedAdModal from '../../components/modals/RewardedAdModal.vue';

import { useState } from '../../stores/state.store';
import { storeToRefs } from 'pinia';

import { defineProps } from 'vue';

const props = defineProps({
    home : {
        default : true
    }
})

const $state = useState()
const state = storeToRefs($state)
const coins = computed(() => Math.ceil(state.coins.value))

const showRewardedAdModal = ref(false)

function displayRewardedAdModal() {
    showRewardedAdModal.value = true
}

function closeRewardedAdModal() {
    showRewardedAdModal.value = false
}

function toggleSoundEffects() {
    state.soundSettings.value.soundEffects = !state.soundSettings.value.soundEffects 
}

function toggleMusic() {
    state.soundSettings.value.music = !state.soundSettings.value.music 
}

</script>

<template>
    <div class="default-topbar">
        <div class="controls">
            <div class="sound-effects">
                <img 
                    src="/icons/headphones.png" 
                    @click="toggleSoundEffects()"
                    width="30" height="30" 
                    :class="{
                        'disabled': !state.soundSettings.value.soundEffects
                    }"
                />
            </div>
            <div class="music">
                <img 
                    src="/icons/music.png" 
                    @click="toggleMusic()" 
                    width="30" height="30"
                    :class="{
                        'disabled': !state.soundSettings.value.music
                    }"
                />
            </div>
            <div class="home" v-if="home">
                <img
                    src="/icons/house.png" 
                    @click="$router.push('/')" width="30" height="30" 
                />
            </div>
        </div>
        <div class="spacer">

        </div>
        <div class="indicators">
            <div class="rewarded-ad" @click="displayRewardedAdModal()"> 
                <img src="/icons/rewarded-ad.png" width="35" height="35" />
            </div>
            <div class="coin-count">
                {{ coins }}
            </div>
            <div class="coins">
                <img src="/icons/coin.png" width="28" height="28" />
            </div>
        </div>
        <Transition name="fade">
            <RewardedAdModal v-if="showRewardedAdModal" @close="closeRewardedAdModal()" />
        </Transition>
    </div>
</template>

<style lang="scss" scoped>
    .default-topbar {
        display: flex; 
        justify-content: start;
        align-items: center;

        .controls {
            display: flex;
            margin-top: 5px;
            flex-direction: row;
            gap: 5px;
            margin-left: 10px;

            img:active {
                filter: grayscale(1)
            }
        }

        .spacer {
            flex: 1;
        }

        .indicators {
            display: flex;
            flex-direction: row;
            margin-right: 10px;
            justify-content: end;
            align-items: center;
            margin-top: 5px;
            gap: 5px;

            .coin-count {
                width: 150px;
                display: flex;
                align-items: center;
                justify-content: center;
                margin-top: -5px;
                height: 25px;
                font-size: 1.4rem;
                text-align: center;
                border-radius: 5px;
                font-weight: bold;
                background-color: rgb(50, 50, 50);
            }
         
        }

      
    }

    .disabled {
        filter: grayscale(1.0)
    }
</style>