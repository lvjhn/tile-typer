<script setup>
import MainLayout from '../layouts/MainLayout.vue';
import LabeledTopbar from '../sections/topbar/LabeledTopbar.vue';


</script>

<template>
    <MainLayout>
        <template v-slot:topbar>
            <LabeledTopbar title="ABOUT" />
        </template>
        <template v-slot:content>
            <div class="content">
                The game is made by <a href="https://github.com/lvjhn">LJ S.A</a>
                <br /><br /><br />
                All music (songs) in the game are also made by LJ S.A.
                <br /><br />
                Icons are from &nbsp;<b>flaticons.com</b> (Royalty Free)
                <ul style="font-size: 1.5rem;">
                    <li><img width="20px" src="/icons/silver-medal.png"/>&nbsp;<b>silver-medal</b> - iconfield</li>
                    <li><img width="20px" src="/icons/rewarded-ad.png"/>&nbsp;<b>rewarded-ad</b> - Freepik</li>
                    <li><img width="20px" src="/icons/music.png"/>&nbsp;<b>music</b> - Mayor Icons</li>
                    <li><img width="20px" src="/icons/house.png"/>&nbsp;<b>house</b> - Vectors Market</li>
                    <li><img width="20px" src="/icons/gold-medal.png"/>&nbsp;<b>gold-medal</b> - Md Tanvirul Haque</li>
                    <li><img width="20px" src="/icons/coin.png"/>&nbsp;<b>coin</b> - NajmunNahar</li>
                    <li><img width="20px" src="/icons/close.png"/>&nbsp;<b>close</b> - Nedra Wahyu</li>
                    <li><img width="20px" src="/icons/bronze-medal.png"/>&nbsp;<b>bronze-medal</b> - Pixel Buddha</li>
                    <li><img width="20px" src="/icons/headphones.png"/>&nbsp;<b>headphones</b> - Luvdat</li>
                    <li><img width="20px" src="/icons/back.png"/>&nbsp;<b>back-button</b> - Lizel Arina</li>
                </ul>
                <br />
                Sounds are &nbsp;<b>freesounds.org</b> and <b>pixabay.com</b> (Royalty Free)
                <ul style="font-size: 1.5rem;">
                    <li><b>failure/wrong-action</b> - Gabriel Araujo (freesound.org)</li>
                    <li><b>error</b> - u_31vnwfmzt6 (pixabay.com)</li>
                    <li><b>keyboard click</b> - jvelezjr (freesound.org)</li>
                    <li><b>coins</b> - ACorcuera (freesound.org)</li>
                </ul>
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