var h = $("#pause-play-btn").html();
$('#pause-play-btn').html(h)

$(document).ready(function() { 
    maudio({
      obj: '#recording'
  })
 })
// playingAudioTime;
$(".link-share-btn").on("click", () => {
  if (navigator.share) {
    navigator
      .share({
        title: "Web Share API Draft",
        url: window.location,
      })
      .then(() => console.log("Successful share"))
      .catch((error) => console.log("Error sharing", error));
  } else {
    console.log("Share not supported on this browser, do it the old way.");
  }
});

var audio = $("#recording")[0];

audio.addEventListener("ended", function () {
  $("#pause-play-icon").addClass("fa-play").removeClass("fa-pause");
  skipAudio();
});

var audio_duration = Math.floor(audio.duration);
var audio_time = Math.floor(audio.currentTime);

function update_time(current_time, audio_duration) {
  $("#duration").text("0:0" + current_time + " / 0:0" + audio_duration);
}

audio.ontimeupdate = function () {
  update_time(Math.floor(this.currentTime), Math.floor(this.duration));
};

// const isPlaying = (audio) => {
//     return !audio.paused;
//   };

$(".pause-play-btn").click(function () {
  if (audio.paused) {
    audio.play();
    $("#pause-play-icon").addClass("fa-pause").removeClass("fa-play");
  } else {
    audio.pause();
    $("#pause-play-icon").addClass("fa-play").removeClass("fa-pause");
  }
  // setTimeout(function() {
  //     audio.load();
  //     $('#pause-play-icon').addClass('fa-play').removeClass('fa-pause');
  // }, 10000)
});

// var originalState = $("#recordingModal").html();

const recordButton = document.getElementById("record-btn");

const recording = document.getElementById("audio-playback");
var bolb = null;
var rDuration = null;

$(".record-btn").click(function () {
  recordButton.disabled = true;
  $(".progress").addClass("recording-animation");
  $(".hide-msg").hide();
  $(".recording-duration").prepend("0:0");
  $(".recording-duration span").countTo({
    from: 0,
    to: 9,
    speed: 10000,
    refreshInterval: 1000,
  });
  navigator.mediaDevices.getUserMedia({ audio: true }).then(function (stream) {
    audio_stream = stream;
    recorder = new MediaRecorder(stream);

    recorder.start();

    // when there is data, compile into object for recording src
    const audioChunks = [];
    recorder.ondataavailable = function (e) {
      const url = URL.createObjectURL(e.data);
      recording.src = url;
      audioChunks.push(e.data);
    };

    // stop handler
    recorder.addEventListener("stop", () => {
      // generate bolb to upload
      bolb = new Blob(audioChunks);
      // rDuration = recorder.duration;
      // while (typeof rDuration == "undefined") {
      //   rDuration = recorder.duration;
      // }
    });

    // stop recording
    $(this).click(function () {
      // $(this,'.card').next().addClass('active').siblings().removeClass('active')
      // $('.card.active').css({'transform': 'scale(1) translateX(0%)','opacity': 1})
      if (recorder.state == "recording") {
        stopRecording();
      }
    });

    setTimeout(function () {
      if (recorder.state == "recording") {
        stopRecording();
      }
    }, 10000);
  });
});

$("#save-btn").click(function () {
  $("#recordingModal").modal("hide");
  // $("#recordingModal").html(originalState);
});

function stopRecording() {
  if (recorder.state == "recording") {
    recorder.stop();
  }
  audio_stream.getAudioTracks()[0].stop();
  $(".progress-circle").hide();
  $(".recording-duration").hide();
  $(".recording-modal-btns").html(
    `<button id="play-pause-btn" class="record-btn d-flex flex-column justify-content-center align-items-center">
                    <span class="d-flex justify-content-center align-items-center">
                        <i id="play-icon" class="fa fa-play"></i>
                    </span>
                </button>`
  );
  var recording = $("#audio-playback")[0];

  var recording_duration = Math.floor(recording.duration);
  var recording_time = Math.floor(recording.currentTime);
  // while (isNaN(recording.duration) || recording.duration == "infinity") {
  //   rDuration = recording.duration;
  // }
  // rDuration = recording.duration;
  rDuration = recording.duration;

  function update_time(current_time, recording_duration) {
    $("#recording-duration").text(
      "0:0" + current_time + " / 0:" + recording_duration
    );
    // rDuration = recording_duration;
  }

  recording.ontimeupdate = function () {
    update_time(Math.floor(this.currentTime), Math.floor(this.duration));
  };
  recording.addEventListener("ended", function () {
    $("#play-icon").addClass("fa-play").removeClass("fa-pause");
  });
  $("#play-pause-btn").click(function () {
    if (recording.paused) {
      recording.play();
      $("#play-icon").addClass("fa-pause").removeClass("fa-play");
    } else {
      recording.pause();
      $("#play-icon").addClass("fa-play").removeClass("fa-pause");
    }
    $("#recording-duration-and-visualizier").show();
  });
  $(".save-or-delete").show();
}

function uploadAudio() {
  var hashtag = document.getElementById("hashtag").value;
  var language = document.getElementById("language").value;
  if (hashtag.length > 15) {
    alert("Hashtag should be max 15 characters.");
  }
  var formdata = new FormData();
  formdata.append("uploadAudio", "true");
  formdata.append("audioFile", bolb);
  formdata.append("hashtag", hashtag);
  formdata.append("language", language);
  formdata.append("duration", rDuration);
  var ajax = new XMLHttpRequest();
  ajax.upload.addEventListener(
    "progress",
    function (event) {
      // progressHandler
    },
    false
  );
  ajax.addEventListener(
    "load",
    function () {
      // completeHandler
      console.log(event.target.responseText);
      document.getElementById("uploadMessage").innerHTML =
        event.target.responseText;
    },
    false
  );
  ajax.addEventListener(
    "error",
    function () {
      // errorHandler
      alert("Failed to upload voice message.");
    },
    false
  );
  ajax.addEventListener(
    "abort",
    function () {
      // abortHandler
      alert("Failed to upload voice message.");
    },
    false
  );
  ajax.open("POST", "./upload-voice", true);
  ajax.send(formdata);
}

// function deleteAudio() {
//   alert("hi");
//   var rec_modal_original_state = $("#recordingModal").html();
//   $("#recordingModal").html(rec_modal_original_state);
// }

var rec_modal_original_state = $("#recordingModal").html();

$("#recordingModal").on("hidden.bs.modal", function () {
  if (bolb !== null) {
    location.reload();
  }
});

$("#delete-btn").click(function () {
  $("#recordingModal").html(rec_modal_original_state);
});

$("#save-btn").click(function () {
  setTimeout(() => {
    $("#recordingModal").html(rec_modal_original_state);
  }, 500);
});

function startListening() {
  $("#pause-play-icon").addClass("fa-pause").removeClass("fa-play");
  audio.play();
}

function skipAudio(paused = false) {
  stopAudio();
  var formdata = new FormData();
  formdata.append("action", "fetchVoices");
  var ajax = new XMLHttpRequest();
  ajax.upload.addEventListener(
    "progress",
    function (event) {
      // progressHandler
    },
    false
  );
  ajax.addEventListener(
    "load",
    function () {
      // completeHandler
      var rsp = event.target.responseText;
      if (isJson(rsp) === true) {
        var voices = JSON.parse(rsp);
        var random = randomNum(0, parseInt(voices.data.length) - parseInt(1));
        document.getElementById("recording").src = voices.data[random].src;
        document.getElementById("playingHashtag").innerText =
          voices.data[random].hashtag;
        document.getElementById("playingAudioID").value =
          voices.data[random].id;
        document.getElementById("playingAudioTime").value =
          voices.data[random].date;
        audio = $("#recording")[0];
        $("#pause-play-icon").addClass("fa-pause").removeClass("fa-play");
        document.getElementById("elapsedTime").innerText =
          voices.data[random].elapsed;
        if (!paused) {
          audio.play();
        }
      } else {
        alert("There is not any new voice yet.");
      }
    },
    false
  );
  ajax.addEventListener(
    "error",
    function () {
      // errorHandler
      alert("Failed to upload voice message.");
    },
    false
  );
  ajax.addEventListener(
    "abort",
    function () {
      // abortHandler
      alert("Failed to upload voice message.");
    },
    false
  );
  ajax.open("POST", "./api/fetch", true);
  ajax.send(formdata);
}

function stopAudio() {
  audio.pause();
  $("#pause-play-icon").addClass("fa-play").removeClass("fa-pause");
}

function reportAbuse() {
  var reportingAudio = document.getElementById("playingAudioID");
  var formdata = new FormData();
  formdata.append("audio", reportingAudio.value);
  var ajax = new XMLHttpRequest();
  ajax.upload.addEventListener(
    "progress",
    function (event) {
      // progressHandler
    },
    false
  );
  ajax.addEventListener(
    "load",
    function () {
      // completeHandler
      var rsp = event.target.responseText;
      if (isJson(rsp) === true) {
        document.getElementById("playingHashtag").innerText = "REPORTED";
        skipAudio(true);
        $("#listeningModal").modal("hide");
      } else {
        alert("Failed to report recording due to some issue.");
      }
    },
    false
  );
  ajax.addEventListener(
    "error",
    function () {
      // errorHandler
      alert("Failed to upload voice message.");
    },
    false
  );
  ajax.addEventListener(
    "abort",
    function () {
      // abortHandler
      alert("Failed to upload voice message.");
    },
    false
  );
  ajax.open("POST", "./api/report-audio", true);
  ajax.send(formdata);
}

$("#reportAbuse").click(function () {
  audio.pause();
});

function isJson(obj) {
  try {
    var jsonObj = JSON.parse(obj);
    return true;
  } catch (err) {
    return false;
  }
}

function randomNum(min, max) {
  return Math.floor(Math.random() * max) + min;
}

const MONTH_NAMES = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

// alert(timeAgo("2022-6-25 6:5:12"));

function getFormattedDate(date, prefomattedDate = false, hideYear = false) {
  const day = date.getDate();
  const month = MONTH_NAMES[date.getMonth()];
  const year = date.getFullYear();
  const hours = date.getHours();
  let minutes = date.getMinutes();

  if (minutes < 10) {
    // Adding leading zero to minutes
    minutes = `0${minutes}`;
  }

  if (prefomattedDate) {
    // Today at 10:20
    // Yesterday at 10:20
    return `${prefomattedDate} at ${hours}:${minutes}`;
  }

  if (hideYear) {
    // 10. January at 10:20
    return `${day}. ${month} at ${hours}:${minutes}`;
  }

  // 10. January 2017. at 10:20
  return `${day}. ${month} ${year}. at ${hours}:${minutes}`;
}

// --- Main function
function timeAgo(dateParam) {
  if (!dateParam) {
    return null;
  }

  const date = typeof dateParam === "object" ? dateParam : new Date(dateParam);
  const DAY_IN_MS = 86400000; // 24 * 60 * 60 * 1000
  const today = new Date();
  const yesterday = new Date(today - DAY_IN_MS);
  const seconds = Math.round((today - date) / 1000);
  const minutes = Math.round(seconds / 60);
  const isToday = today.toDateString() === date.toDateString();
  const isYesterday = yesterday.toDateString() === date.toDateString();
  const isThisYear = today.getFullYear() === date.getFullYear();

  if (seconds < 5) {
    return "now";
  } else if (seconds < 60) {
    return `${seconds} seconds ago`;
  } else if (seconds < 90) {
    return "about a minute ago";
  } else if (minutes < 60) {
    return `${minutes} minutes ago`;
  } else if (isToday) {
    return getFormattedDate(date, "Today"); // Today at 10:20
  } else if (isYesterday) {
    return getFormattedDate(date, "Yesterday"); // Yesterday at 10:20
  } else if (isThisYear) {
    return getFormattedDate(date, false, true); // 10. January at 10:20
  }

  return getFormattedDate(date); // 10. January 2017. at 10:20
}

$("#thanksModal").on("hide.bs.modal", function () {
  location.reload();
});