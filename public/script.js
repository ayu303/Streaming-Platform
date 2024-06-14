const userVideo = document.getElementById("user-video");
const startButton = document.getElementById("start-button");
const streamKeyForm = document.getElementById("stream-key-form");
const state = { media: null };
const Socket = io();

streamKeyForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const streamKey = document.getElementById('stream-key').value;

    // Emit the stream key to the server
    Socket.emit('start-stream', { streamKey });

    // Start the media recorder
    if (state.media) {
        startMediaRecorder(state.media);
    }
});

window.addEventListener('load', async () => {
    const media = await navigator.mediaDevices.getUserMedia({ audio: true, video: true });
    userVideo.srcObject = media;
    state.media = media;
});

function startMediaRecorder(mediaStream) {
    const mediaRecorder = new MediaRecorder(mediaStream, {
        audioBitsPerSecond: 125000,
        videoBitsPerSecond: 250000,
        framerate: 25
    });

    mediaRecorder.ondataavailable = (event) => {
        console.log("Stream data:", event.data);
        Socket.emit('binarystream', event.data);
    };

    mediaRecorder.start(25); // Start recording with data available every 25ms
}
