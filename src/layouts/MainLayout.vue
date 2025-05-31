<script setup>

</script>

<template>
    <div class="layout main-layout">
        <!-- Topbar -->
        <div class="topbar">
            <slot name="topbar">
                Topbar
            </slot> 
        </div>

        <!-- Main Content -->
        <div class="content">
            <slot name="content">
                Content
            </slot>
        </div>
    </div>
</template>

<style lang="scss" scoped>
    .layout {
        display: flex;
        flex-direction: column;

        .topbar {
            height: 45px;
            background: rgb(214, 214, 214);
            box-shadow: 0px 0px 2px 10px black;
            color: white;
        }
        
        .content {
            flex: 1;
            background: rgb(235, 235, 235);
            color: white;
        }
    }
</style>