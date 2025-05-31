import { watch } from "vue";
import { useState } from "../stores/state.store";
import { storeToRefs } from "pinia";

const musicPaths = [
    '/music/1.mp3',
    '/music/2.mp3',
    '/music/3.mp3',
    '/music/4.mp3',
    '/music/5.mp3',
    '/music/6.mp3',
];

let lastIndex = -1;

function getNextTrackIndex() {
    let index;
    do {
    index = Math.floor(Math.random() * musicPaths.length);
    } while (index === lastIndex && musicPaths.length > 1); // avoid repeat
    lastIndex = index;
    return index;
}

const audio = new Audio();

export function playNextTrack() {
    const index = getNextTrackIndex();
    audio.src = musicPaths[index];
    audio.play().catch(err => console.error('Playback error:', err));
}

export function startPlaylist() {
    playNextTrack();
}

export function stopPlaylist() {
    audio.pause();
    audio.currentTime = 0;
    lastIndex = -1;
}

