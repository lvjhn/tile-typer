2<script setup>
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue';
import MainLayout from '../layouts/MainLayout.vue';
import DefaultTopbar from '../sections/topbar/DefaultTopbar.vue';
import GameKeyboard from '../components/GameKeyboard.vue';
import { useState } from '../stores/state.store';
import { storeToRefs } from 'pinia';
import { useRoute } from 'vue-router';
import Chance from "chance"
import { startPlaylist, stopPlaylist } from '../plugins/radio';

const route = useRoute()
const chance = new Chance()

const letters = "123456789QWERTYUIOPASDFGHJKLZXCVBNM"

const isFillIndicatorsEnabled = ref(false)
const timeFreezeTime = ref(null)
let timeFreezeTimer;

const GRID_SIZE = 7

const powerUps = ref({
    "FILL INDICATORS" : 500 , 
    "TIME FREEZE": 1000 , 
    "CLEAR RISKS": 1500 , 
    "GRID WIPE": 2500 
})

const $state = useState()
const state = storeToRefs($state)
let timer;
let tileInserter;

const isInvalidKey = ref(false)
const gamePhase = ref("main")       // main, paused, or finish
const showGamePowerups = ref(false) 
const isPaused = computed(() => gamePhase.value == "paused")
const isFrozen = ref(false)


let horizontalCounts = []
let verticalCounts = [] 
let tileCount = 0
let gameOver = ref({
    hasEnded: false,
    direction: null, 
    index: null
})
let rewardMedal = ref({
    name: null, 
    icon: null
})

let disabledPowerups = ref(new Set())


const score = ref(0)
const time = ref(0)
const ppk = ref(0)
const tiles = ref([])
const interval = ref(0)
const game = state.activeGame;

function initializeGame() {
    score.value = 0
    time.value = 0 
    ppk.value = 1
    interval.value = 1000
    gameOver.value.hasEnded = false

    initializeTiles()
}

function initializeTiles() {
    tileCount = 0
    tiles.value = []
    for(let i = 0; i < GRID_SIZE; i++) {
        const row = []
        for(let j = 0; j < GRID_SIZE; j++) {
            row.push({
                key: null
            })
        }
        tiles.value.push(row)
    }
}

function handleKeyboardInput(key) {
    if(key == "POWER-UPS") {
        showGamePowerups.value = true;
        isPaused.value = true
    }
    else if(key == "PAUSE") {
        gamePhase.value = "paused"
    }
    else {
        handleLetter(key)
    }
}

watch(isPaused, (value) => {
    if(value == false) insertNewTile()
})


// --- create tile inserter 
function insertNewTile() {
    if(!gameOver.value.hasEnded && !isPaused.value && !isFrozen.value) {
        tileInserter = setTimeout(() => {
            insertRandomTile()
            interval.value *= 0.99
            clearTimeout(tileInserter)
            tileInserter = setTimeout(insertNewTile, interval.value)
        }, interval.value)
    }
}


function startGame() {
    isFillIndicatorsEnabled.value = false

    if(state.soundSettings.value.music) {
        startPlaylist()
    } 

    clearInterval(timer)
    clearTimeout(tileInserter)

    const baseTime = route.query.subpage == "arcade" ? 15 : 30

    // --- create game timer 
    timer = setInterval(() => {
        // --- check if game is paused before inserting a tile
        if(!isPaused.value && !gameOver.value.hasEnded && !isFrozen.value) {
            time.value += 1
            ppk.value = 1 + time.value / baseTime
        }   
    }, 1000)

    insertRandomTile()
    insertRandomTile()
    insertRandomTile()
    insertRandomTile()

    insertNewTile()
}

function insertRandomTile() {
    const position = determineNewTilePosition()
    const randomLetter = randomKey()
    insertAtTile(position, randomLetter)
}

function determineNewTilePosition() {
    const possible = []
    for(let i = 0; i < GRID_SIZE; i++) {
        for(let j = 0; j < GRID_SIZE; j++) {
            if(tiles.value[i][j].key == null) {
                possible.push([i, j])
            }
        }
    }   
    return chance.pick(possible)
}

function randomKey() {
    return chance.pick(letters)
}

function insertAtTile(position, key) {
    tiles.value[position[0]][position[1]].key = key
    checkGame()
    tileCount++
}

function handleLetter(inputKey) {
    if(gameOver.value.hasEnded) { 
        return 
    }

    let invalidKey = true;
    for(let i = 0; i < GRID_SIZE; i++) {
        for(let j = 0; j < GRID_SIZE; j++) {
            const currentTile = tiles.value[i][j] 
            const key = currentTile.key 
            if(inputKey == key) {
                invalidKey = false;
                currentTile.correct = true
                score.value += ppk.value
                if(score.value < 0) {
                    score.value = 0
                }
                tileCount--
                setTimeout(() => {
                    tiles.value[i][j].key = null
                    delete currentTile.correct 
                }, 100)
            }
        }
    }

    if(invalidKey) {
        const position = determineNewTilePosition()
        const letter = randomKey()
        setTimeout(() => {
            if(state.soundSettings.value.soundEffects) {
                const invalidSound = new Audio("/sounds/error.wav")
                invalidSound.play()
            }
        }, 100)
        score.value -= ppk.value
        if(score.value < 0) {
            score.value = 0
        }
        insertAtTile(position, letter)
        tiles.value[position[0]][position[1]].invalid = true 
        setTimeout(() => {
            tiles.value[position[0]][position[1]].invalid = false 
        }, 100)
    }

    while(tileCount < 5) {
        insertRandomTile()
    }
}

function isErrorCell(rowNo, colNo) {
    if(gameOver.value.hasEnded) {
        if(gameOver.value.direction == "H") {
            if(rowNo == gameOver.value.index) {
                return true
            } else {
                return false
            }
        }
        else {
            if(colNo == gameOver.value.index) {
                return true
            } else {
                return false
            }
        }
    }
}

function handlePowerUp(powerUp) {
    if(powerUp == "FILL INDICATORS") {
        isFillIndicatorsEnabled.value = true
        disabledPowerups.value.add(powerUp)
        state.coins.value -= powerUps.value[powerUp]
    }
    else if(powerUp == "TIME FREEZE") {
        isFrozen.value = true 
        disabledPowerups.value.add(powerUp)
        state.coins.value -= powerUps.value[powerUp]
        timeFreezeTime.value = 20
        timeFreezeTimer = setInterval(() => {
            timeFreezeTime.value -= 1
            console.log(timeFreezeTime.value)
            if(isFrozen.value && timeFreezeTime.value <= 0) {
                disabledPowerups.value.delete(powerUp)
                isFrozen.value = false
                clearInterval(timeFreezeTimer)
                insertNewTile()
            }
        }, 1000)
    }
    else if(powerUp == "GRID WIPE") {
        state.coins.value -= powerUps.value[powerUp]
        initializeTiles()
        while(tileCount < 5) {
            insertRandomTile()
        }
    }
    else if(powerUp == "CLEAR RISKS") {
        clearRisks()
    }

    if(state.soundSettings.value.soundEffects) {
        const invalidSound = new Audio("/sounds/power-up.wav")
        invalidSound.play()
    }
}

function clearRisks() {
    state.coins.value -= powerUps.value["CLEAR RISKS"]
    

    for(let i = 0; i < GRID_SIZE; i++) {
        for(let j = 0; j < GRID_SIZE; j++) {
            console.log(isIndicatedCell(i, j))
            if(isIndicatedCell(i, j)) {
                tiles.value[i][j].key = null;
                tileCount--;
            }
        }
    }
}

function isIndicatedCell(rowNo, colNo) {
    if(isFillIndicatorsEnabled.value) {
        if(tiles.value[rowNo][colNo].key == null) {
            return false
        }
        if(horizontalCounts[rowNo] >= 5) {
            return true
        }
        if(verticalCounts[colNo] >= 5) {
            return true
        }
    }
}

function checkGame() {
    horizontalCounts = []
    verticalCounts = []


    // --- check horizontally
    for(let i = 0; i < GRID_SIZE; i++) {
        horizontalCounts.push(0)
        for(let j = 0; j < GRID_SIZE; j++) {
            if(tiles.value[i][j].key != null) {
                horizontalCounts[i]++
            }
        }
    }

    // --- check vertically
    for(let i = 0; i < GRID_SIZE; i++) {
        verticalCounts.push(0)
        for(let j = 0; j < GRID_SIZE; j++) {
            if(tiles.value[j][i].key != null) {
                verticalCounts[i]++
            }
        }
    }


    for(let i = 0; i < horizontalCounts.length; i++) {
        if(horizontalCounts[i] == 7) {
            gameOver.value.hasEnded = true
            gameOver.value.direction = "H"
            gameOver.value.index = i
            break
        } 
    }

    for(let i = 0; i < verticalCounts.length; i++) {
        if(verticalCounts[i] == 7) {
            gameOver.value.hasEnded = true
            gameOver.value.direction = "V"
            gameOver.value.index = i
            break
        } 
    }

    if(gameOver.value.hasEnded) {
        setTimeout(() => {
            gamePhase.value = "finish"
                
            try {
                stopPlaylist()
            } catch(e) {
                
            }

            if(state.soundSettings.value.soundEffects) {
                const invalidSound = new Audio("/sounds/invalid.wav")
                invalidSound.play()
            }

            const subpage = route.query.subpage

            if(subpage == "classic") {
                if(score.value >= 3500) {
                    rewardMedal.value.name = "DIAMOND MEDAL"
                    rewardMedal.value.icon = "diamond-medal"
                }
                else if(score.value >= 2500) {
                    rewardMedal.value.name = "GOLD MEDAL"
                    rewardMedal.value.icon = "gold-medal"
                }
                else if(score.value >= 1500) {
                    rewardMedal.value.name = "SILVER MEDAL"
                    rewardMedal.value.icon = "silver-medal"
                }
                else if(score.value >= 500) {
                    rewardMedal.value.name = "BRONZE MEDAL"
                    rewardMedal.value.icon = "bronze-medal"
                } else {
                    rewardMedal.value.name = null
                    rewardMedal.value.icon = null
                }
            }


            else if(subpage == "arcade") {
                if(score.value >= 7000) {
                    rewardMedal.value.name = "DIAMOND MEDAL"
                    rewardMedal.value.icon = "diamond-medal"
                }
                else if(score.value >= 5000) {
                    rewardMedal.value.name = "GOLD MEDAL"
                    rewardMedal.value.icon = "gold-medal"
                }
                else if(score.value >= 3500) {
                    rewardMedal.value.name = "SILVER MEDAL"
                    rewardMedal.value.icon = "silver-medal"
                }
                else if(score.value >= 2000) {
                    rewardMedal.value.name = "BRONZE MEDAL"
                    rewardMedal.value.icon = "bronze-medal"
                } else {
                    rewardMedal.value.name = null
                    rewardMedal.value.icon = null
                }
            }


            if(rewardMedal.value.name != null) {
                let medalName = rewardMedal.value.icon.split("-")[0]
                state.stats.value.medals[subpage][medalName] += 1
            }

            state.coins.value += score.value 

            
            if(score.value > state.stats.value.bestScores[subpage]) {
                state.stats.value.bestScores[subpage] = score.value
            }

            if(time.value > state.stats.value.bestTimes[subpage]) {
                state.stats.value.bestTimes[subpage] = time.value
            }

            state.stats.value.averageScores[subpage].push(score.value)
            state.stats.value.averageTimes[subpage].push(time.value)

            
            if(state.stats.value.averageScores[subpage].length > 100) {
                state.stats.value.averageScores[subpage].shift()
            }

            
            if(state.stats.value.averageTimes[subpage].length > 100) {
                state.stats.value.averageTimes[subpage].shift()
            }

             state.stats.value.gamesPlayed[subpage] += 1




        }, 1000)
    }
}

onMounted(() => {
    initializeGame()
    startGame()
})

onBeforeUnmount(() => {
    clearInterval(timer)
    clearTimeout(tileInserter)
})

function restartGame() {
    initializeGame()
    gameOver.value.hasEnded = false
    gamePhase.value = "main"
    startGame()
}


</script>

<template>
    <MainLayout>
        <template v-slot:topbar>
            <DefaultTopbar />
        </template>
        <template v-slot:content>
            <div class="phase main-phase" v-if="gamePhase == 'main'">
                <div class="game-grid" :class="{ 'frozen' : isFrozen }">
                    <template v-for="row, rowNo in tiles">
                        <template v-for="cell, colNo in row">
                            <div class="cell-container">
                                <div 
                                    :class="{
                                        'cell': true, 
                                        'is-null': cell.key == null, 
                                        'has-key': cell.key != null,
                                        'correct': cell.correct, 
                                        'invalid': cell.invalid, 
                                        'indicated': !gameOver.hasEnded && isIndicatedCell(rowNo, colNo),
                                        'error': isErrorCell(rowNo, colNo)
                                    }"
                                >
                                    {{ cell.key }}
                                </div>
                            </div>
                        </template>
                    </template>
                    <div class="frozen-timer" v-if="isFrozen">
                        Frozen: {{ timeFreezeTime  }}s
                    </div>
                </div>
                <div class="game-indicators">
                    <div class="score-label">
                        SCORE
                    </div>
                    <div class="score-value">
                        {{ Math.ceil(score) }}
                    </div>
                    <div class="time">
                        {{ time  }}s
                    </div>
                    <div class="point-per-key">
                        {{ ppk.toFixed(1) }}
                    </div>
                    <div class="interval">
                        {{ interval.toFixed(1) }}
                    </div>
                </div>
                <div 
                    class="game-keyboard"
                    v-if="!showGamePowerups"
                >
                    <GameKeyboard 
                        @keypress="handleKeyboardInput"
                    />
                </div>
                <div 
                    class="game-power-ups"
                    v-else
                >
                    <!--- Disable Power Ups in Arcade Mode -->
                    <template v-if="route.query.subpage == 'classic'">
                        <section class="description">
                            Power Ups are disabled in classic mode.
                        </section>
                        <button @click="showGamePowerups = false">
                            Back to Keyboard
                        </button>
                    </template>

                    <!--- Power Ups -->
                    <template v-if="route.query.subpage == 'arcade'">
                        <section class="power-ups">
                            <button class="return" @click="showGamePowerups = false">
                                Back to Keyboard 
                            </button>
                            <button 
                                class="power-up" 
                                :disabled="disabledPowerups.has(name) || state.coins.value < price"
                                @click="handlePowerUp(name)" 
                                v-for="price, name in powerUps"
                            >
                                <div class="label">
                                    {{ name }} 
                                </div>
                                <div class="price">
                                    <div class="amount">
                                        {{ price }}
                                    </div>
                                    <div class="icon">
                                        <img src="/icons/coin.png" width="20" />
                                    </div>
                                </div>
                            </button>

                            <button class="buffer" style="height: 50px; border: none; background: transparent;">
                           
                            </button>
                        </section>
                    </template>
                </div>
            </div>
            <div class="phase finish-phase" v-else-if="gamePhase == 'finish'">
                <section class="game-over-title">
                    <h1>Game Over</h1>
                </section>
                <section class="reward">
                    <h2>Your Reward</h2>
                    <div class="price">
                        <div class="amount">
                            {{ score.toFixed(0) }}
                        </div>
                        <div class="icon">
                            <img src="/icons/coin.png" width="30" />
                        </div>
                    </div>
                    <div v-if="rewardMedal.name" class="price">
                        <div class="amount">
                            {{ rewardMedal.name }}
                        </div>
                        <div class="icon">
                            <img :src="'/icons/' + rewardMedal.icon + '.png'" width="30" />
                        </div>
                    </div>
                </section>
                <section class="controls">
                    <button v-if="$route.query.subpage == 'arcade'" class="clear-risks" @click="clearRisksAndContinue()">
                        <div class="label">
                            Clear Risks & Continue Game
                        </div>
                        <div class="icon">
                            <img src="/icons/rewarded-ad.png" width="30" />
                        </div>
                    </button>
                    <button class="restart-button" @click="restartGame()">
                        Restart
                    </button>
                    <button class="main-menu" @click="$router.push('/')">
                        Back to Main Menu
                    </button>
                </section>
            </div>
            <div class="phase paused-phase" v-else-if="gamePhase == 'paused' && showGamePowerups == false">
                The game is paused.
                <br />
                <button @click="gamePhase = 'main'">
                    Resume Game
                </button>
            </div> 
        </template>   
    </MainLayout>
            
</template>

<style lang="scss" scoped>
    .phase {
        color: black;
    }

    .main-phase {
        height: calc(100vh - 50px);
        display: flex;
        flex-direction: column;

        .game-grid {
            flex: 1;
        }

        .game-indicators {
            height: 50px;
        }

        .game-keyboard, .game-power-ups {
            height: 300px;
            background-color: rgb(214, 214, 214);
        }

        .game-power-ups {
            display: flex;
            flex-direction: column;
            gap: 10px;
            align-items: center;
            justify-content: center;

            .description {
                width: 80%;
                text-align: center;
                font-size: 30px;
            }
        }
    }

    .paused-phase {
        height: calc(100vh - 50px);
        font-size: 40px;
        display: flex; 
        align-items: center;
        justify-content: center;
        flex-direction: column;
        gap: 10px;
    }

    .game-indicators {
        display: flex; 
        flex-direction: row;
        height: 50px;
        align-items: center;

        .score-label {
            display: flex;
            width: 80px;
            font-size: 25px;
            align-items: center;
            justify-content: center;
            font-weight: bold;
        }

        .score-value {
            display: flex;
            flex: 1;
            font-size: 25px;
            align-items: center;
            justify-content: center;
            text-align: center;
        }

        .time {
            display: flex;
            width: 100px;
            font-size: 25px;
            align-items: center;
            justify-content: center;
        }

        .point-per-key {
            display: flex;
            width: 50px;
            font-size: 25px;
            align-items: center;
            justify-content: center;
        }

        .interval {
            display: flex;
            width: 100px;
            font-size: 25px;
            align-items: center;
            justify-content: center;
        }
    }

   .game-grid {
        display: grid;
        position: relative;
        margin: 10px;
        /* each column is exactly 50px, each row is exactly 50px */
        grid-template-columns: repeat(7, 50px);
        grid-auto-rows: 50px;
        align-items: center;
        justify-content: center;

        /* same gap in both directions */
        gap: 1.5px;

        .frozen-timer {
            position: absolute;
            font-size: 30px;
            background-color: rgb(50, 50, 50);
            color: white;
            text-align: center;
            bottom: -20px;
            right: 0px;
            padding: 2px 20px;
        }

        .cell {
            /* no width/height needed any more */
            background-color: grey;
            aspect-ratio: 1 / 1;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 30px;
            background-color: rgb(46, 63, 80);
            color: white;
            transition: background-color 0.1;
        }

        .cell.is-null {
            background-color: rgb(200, 200, 200);
        }

        .cell.correct {
            background-color: rgb(119, 236, 168);
        }

        .cell.invalid {
            background-color: rgb(233, 111, 111);
        }

        .cell.error {
            background-color: rgb(250, 139, 139);
        } 

        .cell.indicated {
            background-color: yellow;
            color: black;
        }
    }


    .price {
        display: flex; 
        flex-direction: row;
        align-items: center;
        justify-content: center;
        gap: 5px;
        font-weight: bold;

        .icon {
            display: flex;
            align-items: center;
            justify-content: center;
        }
    }

    .power-ups {
        display: flex;
        width: 90%;
        flex-direction: column;
        gap: 5px;

        > div {

        }

        .power-up {
            border: 2px solid grey;
            display: flex;
            flex-direction: row;
            font-size: 1.5rem;
            padding: 5px;
            text-align: left;

            .label {
                flex: 1;
                text-align: left;
            }

            .price {
                width: min-content;
                display: flex;
                align-items: center;
                justify-content: center;
            }
        }
    }

    .finish-phase {
        display: flex;
        align-items: center; 
        justify-content: center; 
        height: 100%;
        flex-direction: column;
        text-align: center;

        .game-over-title {
            font-size: 50px;
        }


        .reward {
            display: flex;
            flex-direction: column;

            h2 {
                font-size: 35px;
            }
        }


        .price {
            font-size: 40px;
        }

        .controls {
            margin-top: 30px;
            display: flex;
            flex-direction: column;
            gap: 5px;
            align-items: center;
            justify-content: center;
            
            > button {
                width: 300px;
            }

            .clear-risks {
                display: flex;
                gap: 5px;
                background-color: rgb(142, 142, 255);
                color: white;
                font-weight: bold;
                > * {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }
            }
        }
    }

    .frozen {
        .cell.is-null {
            background-color: rgb(182, 182, 243);
        }
    }
</style>