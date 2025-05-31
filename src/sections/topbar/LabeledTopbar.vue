<script setup>
import { defineProps } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter() 

function goBack() {
    router.back()
}

const props = defineProps({
    "title" : "Unnamed"
})

</script>

<template>
    <div class="labeled-topbar">
        <div class="back-button" @click="goBack()">
            <img src="/icons/back.png" width="30" height="30" />
        </div>
        <div class="label">
            {{ title }}
        </div>
    </div>
</template>

<style lang="scss" scoped>
    .labeled-topbar {
        display: flex;
        flex-direction: row;
        gap: 10px;

        .back-button {
            margin-top: 6px;
            margin-left: 5px;
            opacity: 1.0;
            transition: all 0.5s;
        }

        .back-button:active {
            opacity: 0.5;
        }

        .label {
            margin-top: 9px;
            font-size: 25px;
            font-weight: bold;
            color: black;
        }
    }
</style>