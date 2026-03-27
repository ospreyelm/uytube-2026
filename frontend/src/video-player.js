var tag = document.createElement("script");

tag.src = "https://www.youtube.com/iframe_api";
var firstScriptTag = document.getElementsByTagName("script")[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

function onYouTubeIframeAPIReady() {
  const UYTUBE_URL = "https://www.youtube-nocookie.com";
  player = new YT.Player("player", {
    ...smallPlayerSize,
    videoId: '',
    events: {
      'onReady': onPlayerReady,
      'onStateChange': onSectionChange
    },
    playerVars: {
      'cc_load_policy': 0,
      'fs': 0,
      'hl': 'en-us',
      'iv_load_policy': 3,
      'enablejsapi': 1,
      'origin': UYTUBE_URL,
      'playsinline': 1,
      'rel': 0,
      'showinfo': 0
      // 'modestbranding': 1, // depreciated
    },
  });
}

function onPlayerReady() {
  // when the page & player loads, fetch the id from the URL
  const urlId = new URLSearchParams(window.location.search).get("id");
  if (urlId != null) {
    $("#idInput").attr("value", urlId);
    fetchData(urlId);
  }
}

function playFromFirstSection(leadTime = 0) {
  player.playVideo();
  player.seekTo(Math.max(state.sections[0].time - leadTime, 0));
}

function onPlayButtonClick() {
  const opaque =
    document.getElementById("svg-play-button").getAttribute("opacity") == 1;
  if (opaque) {
    pauseSVG();
  } else {
    playSVG();
  }
  if (!player.getPlayerState || !player.getCurrentTime) {
    return;
  }
  const playerState = player.getPlayerState();
  const currTime = player.getCurrentTime();
  const leadTime = 2.5;
  if (currTime < state?.sections[0]?.time) {
    if (currTime < state?.sections[0]?.time - leadTime) {
      playFromFirstSection(leadTime);
    } else {
      playFromFirstSection();
    }
  } else if (playerState == 1) {
    player.pauseVideo();
  } else if (playerState == 2) {
    player.playVideo();
  }
}

function updateSVGPlaying() {
  const playerState = player.getPlayerState();
  if (!state?.youtubeId || playerState != 1) {
    pauseSVG();
    // raise a visual alert that the SVG is running independently
  } else {
    if (player.getCurrentTime) playSVG(player?.getCurrentTime());
  }
}
