<script setup>

import { defineProps } from 'vue';

const props = defineProps({
    title: {
        default: "Dialog"
    }
})

defineEmits([ 'close' ])


</script>

<template>
    <div class="overlay-modal">
        <div class="dialog">
            <div class="header">
                <div class="title">
                    {{ title }}
                </div>
                <div class="close" @click="$emit('close')">
                    <img src="/icons/close.png" width="30" height="30" />
                </div>
            </div>
            <div class="content">
                <slot></slot>
            </div>
        </div>
    </div>
</template>

<style lang="scss" scoped>
    .overlay-modal {
        position: fixed;
        top: 0px;
        height: 0px;
        width: 100%;
        height: 100%;
        background-color: rgba(0, 0, 0, 0.8);
        z-index: 9999999;
        display: flex; 
        align-items: center;
        justify-content: center;

        .dialog {
            min-width: 200px;
            max-width: 300px;

            .header {
                display: flex;
                flex-direction: row;
                background-color: rgb(234, 234, 234);
                padding: 2.5px 5px;
                font-size: 1.4rem;
                color: black;
                font-weight: bold;
                border-top-left-radius: 5px;
                border-top-right-radius: 5px;

                .title {
                    flex: 1;
                    display: flex; 
                    align-items: center;
                    justify-content: start;
                }
            }

            .content {
                min-height: 50px;
                border-bottom-right-radius: 5px;
                border-bottom-left-radius: 5px;
                background-color: white;
                color: black;
            }
        }
    }
</style>