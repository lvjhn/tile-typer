<script setup>
import { storeToRefs } from 'pinia';
import StatFolder from '../components/StatFolder.vue';
import MainLayout from '../layouts/MainLayout.vue';
import LabeledTopbar from '../sections/topbar/LabeledTopbar.vue';
import { average } from '../plugins/average';
import { useState } from '../stores/state.store';
import { ref } from 'vue';
import EnterPlayerNameModal from '../components/modals/EnterPlayerNameModal.vue';

const $state = useState()
const state = storeToRefs($state)

const enterPlayerNameModal = ref(false)
const downloadSaveFileModal = ref(false)
const uploadSaveFileModal = ref(false)

function editPlayerName() {
    enterPlayerNameModal.value = true 
}

import { Filesystem, Directory, Encoding } from '@capacitor/filesystem';
import DownloadSaveFileModal from '../components/modals/DownloadSaveFileModal.vue';

async function downloadSaveFile() {
    await Filesystem.writeFile({
        path: 'tile-typer-' + state.playerName.value + ".json",
        data: localStorage['app-state'],
        directory: Directory.Documents,
        encoding: Encoding.UTF8,
    });
    downloadSaveFileModal.value = true;
}

function uploadSaveFile() {
    return new Promise((resolve, reject) => {
        // Create the file input dynamically
        const input = document.createElement('input');
        input.type = 'file';
        input.style.display = 'none';

        // Append it temporarily to body
        document.body.appendChild(input);

        input.onchange = async (event) => {
            const file = input.files[0];
            if (!file) {
                reject('No file selected');
                document.body.removeChild(input);
                return;
            }

            try {
                const text = await file.text(); // Read as text
                const data = JSON.parse(text)
                state.playerName.value = data.playerName 
                state.coins.value = data.coins 
                state.stats.value = data.stats

            } catch (err) {
                reject(err);
            } finally {
                // Clean up
                document.body.removeChild(input);
            }
        };

        // Trigger the file picker
        input.click();
    });
}

</script>

<template>
    <MainLayout>
        <template v-slot:topbar>
            <LabeledTopbar title="PLAYER STATS" />
        </template>
        <template v-slot:content>
            <div class="content">
                <div class="controls">
                    <button class="edit-name" @click="editPlayerName()">
                        Edit Player Name
                    </button>

                    <button class="edit-name" @click="downloadSaveFile()">
                        Download Save File
                    </button>

                    <button class="edit-name" @click="uploadSaveFile()">
                        Upload Save File
                    </button>
                </div>


                <Transition name="fade">
                    <DownloadSaveFileModal v-if="downloadSaveFileModal" @close="downloadSaveFileModal = false" />
                </Transition>


                <Transition name="fade">
                    <EnterPlayerNameModal v-if="enterPlayerNameModal" @close="enterPlayerNameModal = false" />
                </Transition>

                <StatFolder 
                    title="Player"
                    :data="[
                        { key: 'Name', value: state.playerName.value }, 
                        { key: 'Coins', value: state.coins.value }
                    ]"
                />

                <StatFolder 
                    title="Medals (Classic)"
                    :data="[
                        { icon: 'bronze-medal', key: 'Bronze (500 pts)', value: state.stats.value.medals.classic.bronze }, 
                        { icon: 'silver-medal', key: 'Silver (1500 pts)', value: state.stats.value.medals.classic.silver }, 
                        { icon: 'gold-medal', key: 'Gold (2500 pts)', value: state.stats.value.medals.classic.gold }, 
                        { icon: 'diamond-medal', key: 'Diamond (3500 pts)', value: state.stats.value.medals.classic.diamond }
                    ]"
                />

                <StatFolder 
                    title="Medals (Arcade)"
                    :data="[
                        { icon: 'bronze-medal', key: 'Bronze (2000 pts)', value: state.stats.value.medals.arcade.bronze }, 
                        { icon: 'silver-medal', key: 'Silver (3500 pts)', value: state.stats.value.medals.arcade.silver }, 
                        { icon: 'gold-medal', key: 'Gold (5000 pts)', value: state.stats.value.medals.arcade.gold }, 
                        { icon: 'diamond-medal', key: 'Diamond (7000 pts)', value: state.stats.value.medals.arcade.diamond }
                    ]"
                />

                <StatFolder 
                    title="Games Played"
                    :data="[
                        { key: 'Arcade', value: state.stats.value.gamesPlayed.arcade }, 
                        { key: 'Classic', value: state.stats.value.gamesPlayed.classic }
                    ]"
                />

                <StatFolder 
                    title="Best Scores"
                    :data="[
                        { key: 'Arcade', value: state.stats.value.bestScores.arcade }, 
                        { key: 'Classic', value: state.stats.value.bestScores.classic }
                    ]"
                />

                <StatFolder 
                    title="Best Time"
                    :data="[
                        { key: 'Arcade', value: state.stats.value.bestTimes.arcade }, 
                        { key: 'Classic', value: state.stats.value.bestTimes.classic }
                    ]"
                />

                <StatFolder 
                    title="Average Scores (Last 100 Plays)"
                    :data="[
                        { key: 'Arcade', value: average(state.stats.value.averageScores.arcade) }, 
                        { key: 'Classic', value: average(state.stats.value.averageScores.classic) }
                    ]"
                />

                <StatFolder 
                    title="Average Times (Last 100 Plays)"
                    :data="[
                        { key: 'Arcade', value: average(state.stats.value.averageTimes.arcade) }, 
                        { key: 'Classic', value: average(state.stats.value.averageTimes.classic) }
                    ]"
                />
                
            </div>
        </template>   
    </MainLayout>
</template>

<style lang="scss" scoped>
    .content {
        padding-top: 20px;
        height: calc(100vh - 50px);
        overflow-y: scroll;
        display: flex;
        flex-direction: column;
        gap: 15px;
        padding-bottom: 20px;

      
        .controls {
            margin: 0 auto;
            width: 90%;
            display: flex;
            flex-direction: column;
            gap: 5px;

            button {
                margin: 0 auto;
                width: 100%;
                font-size: 25px; 
            }

        }
    }
</style>