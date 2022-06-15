$('.link-share-btn').on('click', () => {
    if (navigator.share) {
        navigator.share({
            title: 'Web Share API Draft',
            url: window.location,
        })
            .then(() => console.log('Successful share'))
            .catch((error) => console.log('Error sharing', error));
    } else {
        console.log('Share not supported on this browser, do it the old way.');
    }
});

var audio = $('#recording')[0];

var audio_duration = Math.floor(audio.duration);
var audio_time = Math.floor(audio.currentTime);

function update_time(current_time, audio_duration){
    // $("#currentAudioTime").html(format_time(current_time));
    // $("#totalAudioDuration").html(format_time(audio_duration));
    $('#duration').text('0:0'+ current_time + ' / 0:0' + audio_duration)
}

audio.ontimeupdate = function() {
    update_time(Math.floor(this.currentTime), Math.floor(this.duration))
}


// const isPlaying = (audio) => {
//     return !audio.paused;
//   };

$('.skip-btn').click(function() {
    alert(audio.currentTime="seconds")
})

$('.play-pause-btn').click(function() {
    if(audio.paused){
        audio.play();
        $('#pause-play-icon').addClass('fa-pause').removeClass('fa-play');
      } else {
        audio.pause();
        $('#pause-play-icon').addClass('fa-play').removeClass('fa-pause');
      }
    // setTimeout(function() {
    //     audio.load();
    //     $('#pause-play-icon').addClass('fa-play').removeClass('fa-pause');
    // }, 10000)
})
const recordButton = document.getElementById("record-btn");
// set preview
const preview = document.getElementById("audio-playback");

$('.record-btn').click(function() {
    recordButton.disabled = true
    $('.progress').addClass('recording-animation')
    $('.hide-msg').hide()
    $('.recording-duration').prepend("0:0")
    $('.recording-duration span').countTo({
        from: 0,
        to: 9,
        speed: 10000,
        refreshInterval: 1000
    })
    navigator.mediaDevices.getUserMedia({ audio: true })
    .then(function (stream) {
        audio_stream = stream;
        recorder = new MediaRecorder(stream);

        // when there is data, compile into object for preview src
        recorder.ondataavailable = function (e) {
            const url = URL.createObjectURL(e.data);
            preview.src = url;
        };
        recorder.start();

        setTimeout(function () {
            console.log("10 second timeout");
            stopRecording();
            $('.progress-circle').hide()
            $('.recording-duration').hide()
        }, 10000);
    });
})

function stopRecording() {
    recorder.stop();
    audio_stream.getAudioTracks()[0].stop();
}

