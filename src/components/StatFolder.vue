<script setup>
import { defineProps } from 'vue';

const props = defineProps({
    title: {
        default: "Unnamed"
    },
    data: {}
})

</script>

<template>
    <div class="stat-folder">
        <div class="title">
            {{ title }}
        </div>
        <div class="data">
            <div v-for="dataItem in data" class="data-item">
                <div class="icon" v-if="dataItem.icon">
                    <img :src="'/icons/' + dataItem.icon + '.png'" width="30" />
                </div>
                <div v-html="dataItem.key" class="label"></div>
                <div class="value">
                    {{ dataItem.value.toFixed ? dataItem.value.toFixed(0) : dataItem.value }}
                </div>
            </div>
        </div>
    </div>
</template>

<style lang="scss" scoped>
    .stat-folder {
        width: 90%;
        display: flex; 
        flex-direction: column;
        margin: 0 auto;

        .title {
            background-color: black;
            color: white; 
            font-size: 1.5rem;
            width: fit-content;
            padding: 5px 10px;
            border-top-left-radius: 5px;
            border-top-right-radius: 5px;
        }

        .data-item {
            width: 100%;
            background-color: white;
            color: black; 
            font-size: 25px;
            padding: 10px;
            display: flex; 
            flex-direction: row;
            gap: 10px;

            .icon {
                display: flex;
                align-items: center;
                justify-content: center;
                padding-top: 5px;
            }

            .label {
                flex: 1;
                font-weight: bold;
                display: flex;
                align-items: center;
                justify-content: start;
            }

            .value {
                width: fit-content;
            }
        }
        
        .data-item:first-child {
            border-top-right-radius: 5px;
        }

        .data-item:last-child {
            border-bottom-left-radius: 5px;
            border-bottom-right-radius: 5px;
        }
    }
</style>