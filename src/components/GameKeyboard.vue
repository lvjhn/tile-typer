<script setup>
import { ref } from 'vue'
import { defineEmits } from 'vue'

const $emit = defineEmits(['keypress'])

import { useState } from '../stores/state.store'
import { storeToRefs } from 'pinia'
const $state = useState()
const state = storeToRefs($state)

const keys = [
    [1, 2, 3, 4, 5, 6, 7, 8, 9, 0], 
    ["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P"],
    ["A", "S", "D", "F", "G", "H", "J", "K", "L"],
    ["Z", "X", "C", "V", "B", "N",  "M"],
    ["PAUSE", "POWER-UPS"]
]

const activeKeys = ref(new Set())

function setActiveKey(key) {
    activeKeys.value.add(key)
    if(state.soundSettings.value.soundEffects) {
        const clickAudio = new Audio("/sounds/click.wav"); // Load audio file
        clickAudio.play()
    }
    $emit('keypress', key)
}

function setInactiveKey(key) {
    activeKeys.value.delete(key)
}




</script>

<template>
    <div class="on-screen-keyboard">
        <div v-for="row, rowNo in keys" :class="'row row-' + rowNo">
            <div 
                v-for="key in row"
                @touchstart="setActiveKey(key)"
                @touchend="setInactiveKey(key)"
                :class="{
                    'key' : true,
                    'is-active' : activeKeys.has(key)
                }"
            >
                {{ key }}               
            </div>
        </div>
    </div>
</template>

<style lang="scss" scoped>
    .on-screen-keyboard {
        display: flex;
        height: 100%;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        gap: 5px;

        .row {
            display: flex;
            flex-direction: row;
            gap: 1.5px;

            .key {
                padding: 8px 11px;
                border-radius: 5px;
                font-size: 30px;
                background-color: white;
                border: 1px solid black;
            }

            .key.is-active {
                background-color: black;
                color: white;
            }

        }
    }
</style>