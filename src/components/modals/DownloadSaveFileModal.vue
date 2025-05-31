<script setup>
import Modal from '../Modal.vue';
defineEmits('close')
import { useState } from '../../stores/state.store';
const $state = useState()
const state = storeToRefs($state)
import { useRouter } from 'vue-router';
import { onMounted, ref } from 'vue';
import { storeToRefs } from 'pinia';

import QRCode from "qrcode"

</script>

<template>
    <Modal 
        title="Downloaded Save File" 
        @close="$emit('close')"
    >
        <div class="content">
            <section>
                The file has been saved in your phone's <code>Documents/</code> folder.
                <br /><br />
                <b>Filename:</b>
                <br />
                <code>{{ 'tile-typer-' + state.playerName.value + ".json"}}</code>
            </section>
            
        </div>
    </Modal>
</template>

<style lang="scss" scoped>
    #qr {
        border: 2px solid black;
        margin-top: 20px;
    }

    .content {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        font-size: 20px;
        padding-top: 10px;
        padding-bottom: 50px;
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