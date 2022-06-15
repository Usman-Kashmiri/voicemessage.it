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
    $('#duration').text('0:0'+ current_time + ' / 0:0' + audio_duration)
}

audio.ontimeupdate = function() {
    update_time(Math.floor(this.currentTime), Math.floor(this.duration))
}


// const isPlaying = (audio) => {
//     return !audio.paused;
//   };

$('.pause-play-btn').click(function() {
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

const recording = document.getElementById("audio-playback");

$('#recording-duration-and-visualizier').hide();
$('.save-or-delete').hide();

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

        // when there is data, compile into object for recording src
        recorder.ondataavailable = function (e) {
            const url = URL.createObjectURL(e.data);
            recording.src = url;
        };
        recorder.start();

        setTimeout(function () {
            console.log("10 second timeout");
            stopRecording();
            $('.progress-circle').hide()
            $('.recording-duration').hide()
            $('.recording-modal-btns').html(
                `<button id="play-pause-btn" class="record-btn d-flex flex-column justify-content-center align-items-center">
                    <span class="d-flex justify-content-center align-items-center">
                        <i id="play-icon" class="fa fa-play"></i>
                    </span>
                </button>`
            )
            var recording = $('#audio-playback')[0];

            var recording_duration = Math.floor(recording.duration);
            var recording_time = Math.floor(recording.currentTime);

            function update_time(current_time, recording_duration){
                $('#recording-duration').text('0:0'+ current_time + ' / 0:09')
            }

            recording.ontimeupdate = function() {
                update_time(Math.floor(this.currentTime), Math.floor(this.duration))
            }
            $('#play-pause-btn').click(function() {
                if(recording.paused){
                    recording.play();
                    $('#play-icon').addClass('fa-pause').removeClass('fa-play');
                  } else {
                    recording.pause();
                    $('#play-icon').addClass('fa-play').removeClass('fa-pause');
                  }
                  $('#recording-duration-and-visualizier').show();
            })
            $('.save-or-delete').show();
        }, 10000);
    });
})

$('#save-btn').click(function() { 
    $('#recordingModal').stopPropagation();
 })

function stopRecording() {
    recorder.stop();
    audio_stream.getAudioTracks()[0].stop();
}

