import { defineStore, storeToRefs } from 'pinia'

// --- create app state
export const useState = defineStore('app-state', {
  state: () => ({
    _init: false,

    playerName: "Unnamed",

    coins: 10000,

    soundSettings: {
        music: true, 
        soundEffects: true
    },

    stats: {
        gamesPlayed: {
            arcade: 0, 
            classic: 0
        },
        bestScores: {
            arcade: 0, 
            classic: 0
        },
        bestTimes: {
            arcade: 0, 
            classic: 0
        },
        averageScores: {
            arcade: [],
            classic: []
        },
        averageTimes: {
            arcade: [],
            classic: []
        }, 
        medals: {
            classic: {
                bronze: 0,
                silver: 0,
                gold: 0,
                diamond: 0
            },
            arcade: {
                bronze: 0, 
                silver: 0,
                gold: 0, 
                diamond: 0
            }
        }
    }

  }),
  persist: true,
})

// --- initialize to localstorage
export function initializeState() {
    storeToRefs(useState())._init.value = true
}