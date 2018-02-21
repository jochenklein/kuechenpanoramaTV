var resorts; // JSON-formatted list of resorts and their webcam streams
var tracks; // JSON-formatted list (playlist) of music files
var currentResortIndex = 2;
var currentCamIndex = 0; // Counter of the currently playing cam [0 ... resort.cams.length-1]
var currentAudioCounter = 0;
var timeInterval = 5 * 60 * 1000; // 5 minutes in milliseconds
var htmlVideoPlayer;
var htmlAudioPlayer;

document.addEventListener("DOMContentLoaded", function(event) {
    htmlVideoPlayer = document.getElementById("video");
    htmlVideoPlayer.addEventListener('ended', videoEndedHandler, false);

    htmlAudioPlayer = document.getElementById("audio");
    htmlAudioPlayer.addEventListener('ended', audioEndedHandler, false);
});

setInterval(
    function() { setNextResort() },
    timeInterval);

loadJson("tracks.json", function(text) {
    tracks = JSON.parse(text);
    htmlAudioPlayer.src = tracks[currentAudioCounter].file;
});

function videoEndedHandler(event) {
    playNextVideo();
}

function audioEndedHandler(event) {
    playNextAudio();
}

function loadJson(file, callback) {
    var xmlHttpRequest = new XMLHttpRequest();
    xmlHttpRequest.overrideMimeType("application/json");
    xmlHttpRequest.open("GET", file, true);
    xmlHttpRequest.onreadystatechange = function() {
        if (xmlHttpRequest.readyState === 4 && xmlHttpRequest.status == "200") {
            callback(xmlHttpRequest.responseText);
        }
    }
    xmlHttpRequest.send(null);
}

function initVideo(resortIndex = 0, camIndex = 0) {
    currentResortIndex = resortIndex;
    currentCamIndex = camIndex;
    htmlVideoPlayer.src = resorts[currentResortIndex].cams[currentCamIndex].url;
    initInfoBanner();
}

function setNextResort() {
    currentCamIndex = 0;
    currentResortIndex++;
    if (currentResortIndex >= resorts.length) {
        currentResortIndex = 0;
    }
    playNextVideo();
}

function playNextVideo() {
    currentCamIndex++;
    if (currentCamIndex >= resorts[currentResortIndex].cams.length) {
        currentCamIndex = 0;
    }

    var nextUrl = resorts[currentResortIndex].cams[currentCamIndex].url;
    htmlVideoPlayer.src = nextUrl;
    initInfoBanner();

    console.log("currentResortIndex: " + currentResortIndex + ", currentCamIndex: " + currentCamIndex + " - " + nextUrl);
}

function initInfoBanner() {
    if (resorts[currentResortIndex].request) {
        document.getElementById("banner_bottom").style.display = 'block';
    } else {
        document.getElementById("banner_bottom").style.display = 'none';
    }
    document.getElementById("resort_name").innerHTML = resorts[currentResortIndex].name;
    document.getElementById("webcam_name").innerHTML = resorts[currentResortIndex].cams[currentCamIndex].name;
    document.getElementById("webcam_time").innerHTML = resorts[currentResortIndex].cams[currentCamIndex].time;
    document.getElementById("temperature").innerHTML = resorts[currentResortIndex].cams[currentCamIndex].temperature;
}

function playNextAudio() {
    currentAudioCounter++;
    if (currentAudioCounter == tracks.length) {
        currentAudioCounter = 0;
    }

    var nextTrack = tracks[currentAudioCounter].file;
    htmlAudioPlayer.src = nextTrack;
}

function toggleMute() {
    if (htmlAudioPlayer.muted) {
        htmlAudioPlayer.muted = false;
    } else {
        htmlAudioPlayer.muted = true;
    }
}

// update resorts
function updateResorts(data) {
    resorts = data;
}
