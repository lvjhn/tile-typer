<script setup>
import MainLayout from '../layouts/MainLayout.vue';
import LabeledTopbar from '../sections/topbar/LabeledTopbar.vue';


</script>

<template>
    <MainLayout>
        <template v-slot:topbar>
            <LabeledTopbar title="INSTRUCTIONS" />
        </template>
        <template v-slot:content>
            <div class="content">
                The game is simple. 
                <br /><br />
                You are shown a grid of 7 by 7 tiles (7 rows, 7 columns).
                At random intervals of time, a letter will pop up on a random tile location.
                <br /><br />
                You must press the right key on the keyboard to remove the title.
                <br /><br />
                Prevent the tiles from forming any complete vertical or horizontal lines.
                That is, 7 tiles in a row or column.
                <br /><br />
                If the tiles form a row or column, the game will end. 
                <br /><br /> 
                <b>Classic Mode</b> does not require coins to play but disables power ups. You 
                will earn less in classic mode. If you want to earn more try arcade mode.
                <br /><br />
                <b>Arcade Mode</b> requires coins to play but disables power ups. You will 
                earn more in this mode. 

            </div>
        </template>   
    </MainLayout>
</template>

<style lang="scss" scoped>
    .content {
        height: calc(100vh - 50px);
        color: black;
        padding: 20px;
        font-size: 30px;
        overflow-y: scroll;
    }
</style>