<script setup>
import { storeToRefs } from 'pinia';
import MainLayout from './layouts/MainLayout.vue';
import MainMenuScreen from './screens/MainMenuScreen.vue';
import { useState } from './stores/state.store';
import { watch } from 'vue';
import { startPlaylist, stopPlaylist } from './plugins/radio';


const $state = useState()
const state = storeToRefs($state)


watch($state, (value) => {
    if(!state.soundSettings.value.music) {
        stopPlaylist()
    }
}, { deep: true })
</script> 

<template>
    <div class="app">
        
        {{  state.soundSettings }}
        <RouterView />
    </div>
</template> 
``
<style lang="scss" scoped>

</style>