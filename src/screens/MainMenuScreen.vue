<script setup>
import { onMounted, ref } from 'vue';
import MainLayout from '../layouts/MainLayout.vue';
import { startPlaylist, stopPlaylist } from '../plugins/radio';
import DefaultTopbar from '../sections/topbar/DefaultTopbar.vue';
import { useState } from '../stores/state.store';
import { useRouter } from 'vue-router';
import ArcadeModal from '../components/modals/ArcadeModal.vue';
import { storeToRefs } from 'pinia';
import EnterPlayerNameModal from '../components/modals/EnterPlayerNameModal.vue';

const $state = useState()
const state = storeToRefs($state)

const enterPlayerName = ref(false)
const router = useRouter()

function goto(page, subpage) {
    router.push({ path: page, query: { subpage: subpage }})
}


if(state.playerName.value == "Unnamed") {
    enterPlayerName.value = true 
}

onMounted(() => {
    stopPlaylist()
})

const arcadeModalShown = ref(false)

function enterArcade() {
    arcadeModalShown.value = true; 
}


</script>

<template>
    <MainLayout>
        <template v-slot:topbar>
            <DefaultTopbar :home="false" />
        </template>
        <template v-slot:content>
            <div class="content">
                <div class="logo">
                    <img src="/logo-pixelated.png" width="100" height="100" />
                </div>
                <div class="header">
                    <span class="text">TILE TYPER</span>
                </div>
                <div class="options">
                    <button class="classic" @click="goto('game', 'classic')">
                        CLASSIC
                    </button>
                    <button class="arcade" @click="enterArcade()">
                        ARCADE 
                    </button>
                    <button class="stats" @click="goto('stats')">
                        STATS
                    </button>
                    <button class="instructions" @click="goto('instructions')">
                        INSTRUCTIONS
                    </button>
                    <button class="about" @click="goto('about')">
                        ABOUT
                    </button>
                </div>
            </div>


            <Transition name="fade">
                <EnterPlayerNameModal v-if="enterPlayerName" @close="enterPlayerName = false" />
            </Transition>  

            <Transition name="fade">
                <ArcadeModal v-if="arcadeModalShown" @close="arcadeModalShown = false" />
            </Transition>  
        </template>   
    </MainLayout>
</template>

<style lang="scss" scoped>
    .content {
        height: 100%;
        display: flex; 
        align-items: center;
        justify-content: center;
        flex-direction: column;
        background-image: url('/icons/webb.png') !important;

        .header {
            .text {
                font-size: 3rem;
                color: black;
                font-weight: bold;
            }
        }

        .options {
            display: flex; 
            flex-direction: column;
            margin-top: 10px;
            gap: 5px;
            position: relative;
            width: 300px;
        
        }
    }
</style>