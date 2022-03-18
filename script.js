const $ = document
const supportsVideo = !!$.createElement("video").canPlayType

if (supportsVideo) {
  const video = $.getElementById("video")
  video.controls = false
  const container = $.querySelector("figure")

  // controls and title
  const title = $.getElementById("caption")
  const playpause = $.getElementById("playpause")
  const controls = $.getElementById("controls")
  const progress = $.getElementById("progress")
  const duration = $.getElementById("duration")
  const volSlider = $.getElementById("volSlider")
  const volume = $.getElementById("volume")
  video.volume = volSlider.value/100

  //fullscreen support checking
  const fullscreen = $.getElementById("fullscreen")
  const fullscreenEnabled = !!(document.fullscreenEnabled || document.mozFullScreenEnabled || document.msFullscreenEnabled || document.webkitSupportsFullscreen || document.webkitFullscreenEnabled || document.createElement('video').webkitRequestFullScreen)
  const isFullscreen = () => {
   return !!(document.fullscreen || document.webkitIsFullScreen || document.mozFullScreen || document.msFullscreenElement || document.fullscreenElement);
}
  if (!fullscreenEnabled) {
     fullscreen.style.display = 'none';
  }

  // for Fontawesome behaving
  const iconClass = ["fa-solid fa-play playpause","fa-solid fa-pause playpause"]

  //playpause logic
  const triggerPlayPause = () => {
    if(video.paused || video.ended) {
      video.play()
      playpause.children[0].className = iconClass[1]
    }
    else {
      video.pause()
      playpause.children[0].className = iconClass[0]
    }
  }

  playpause.addEventListener("click",triggerPlayPause)

  //raise and decrease volume logic
  volume.addEventListener("click", () => {
    const icons = [$.getElementById("volTrue"),$.getElementById("volFalse")]
    if(video.muted) {
      icons[0].style.display = "block"
      icons[1].style.display = "none"
    }
    else {
      icons[0].style.display = "none"
      icons[1].style.display = "block"
    }
    video.muted = !video.muted
  })

  volSlider.addEventListener("input", () => {
    video.volume = volSlider.value/100
  })

  //update progress bar and duration
  video.addEventListener("loadedmetadata", () => {
    const minutes = Math.floor(video.duration/60)
    const seconds = Math.floor(video.duration)-minutes*60
    duration.textContent = `${minutes > 9 ? minutes : `0${minutes}`}:${seconds > 9 ? seconds : `${seconds}0`}`
    console.log(minutes,seconds)
    progress.setAttribute("max", video.duration)
  })

  video.addEventListener("timeupdate", () => {
    progress.value = video.currentTime
    if(video.ended) playpause.children[0].className = iconClass[0]
  })

  //hidding controls when mouse is quiet
  const hideUnhide = () => {
    controls.style.opacity = "100%"
    title.style.opacity = "100%"
    setTimeout(() => {
      controls.style.opacity = "0"
      title.style.opacity = "0"
    }, 4000);
  }

  video.addEventListener("focus", hideUnhide)

  progress.addEventListener("click", (event) => {
    let rect = progress.getBoundingClientRect()
    let pos = (event.pageX - rect.left) / progress.offsetWidth
    video.currentTime = pos * video.duration
  })

  $.addEventListener("keyup", (event) => {
    if(event.key === " ") {
      triggerPlayPause()
      hideUnhide()
    }
  })

  //fullscreen logic
  fullscreen.addEventListener("click", () => handleFullscreen())

  let handleFullscreen = () => {
    if (isFullscreen()) {
      if ($.exitFullscreen) $.exitFullscreen()
      else if ($.mozCancelFullScreen) $.mozCancelFullScreen()
      else if ($.webkitCancelFullScreen) $.webkitFullScreenchange()
      else if ($.msExitFullScreen) $.msExitFullScreen()
      setFullscreenData(false)
    }
    else {
      if (container.requestFullscreen) container.requestFullscreen()
      else if (container.mozRequestFullScreen) container.mozRequestFullScreen()
      else if (container.webkitRequestFullScreen) container.webkitRequestFullScreen()
      else if (container.msRequestFullScreen) container.msRequestFullScreen()
      setFullscreenData(true)
    }
  }

  const setFullscreenData = (state) => container.setAttribute("data-fullscreen", !!state)

  $.addEventListener("fullscreenchange", () => setFullscreenData(!!($.fullscreen || $.fullscreenElement)))
  $.addEventListener("webkitfullscreenchange", () => setFullscreenData(!!$.webkitfullscreenchange))
  $.addEventListener("mozfullscreenchange", () => setFullscreenData(!!$.mozFullScreen))
  $.addEventListener("msfullscreenchange", () => setFullscreenData(!!$.msFullscreenElement))
}
