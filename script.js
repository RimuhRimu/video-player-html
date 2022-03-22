const $ = document
const supportsVideo = !!$.createElement("video").canPlayType

if (supportsVideo) {
  const video = $.getElementById("video")
  video.controls = false

  const title = $.getElementById("title")
  const controls = $.getElementById("controls")
  
  //hidding controls when mouse is no moving
  const hideUnhide = () => {
    controls.style.opacity = "100%"
    title.style.opacity = "100%"
    let hide = () => {
      controls.style.opacity = "0"
      title.style.opacity = "0"
    }
    setTimeout(hide, 6000)
  }

  video.addEventListener("focus", hideUnhide)
  video.addEventListener("click", hideUnhide)

  //show/hide loader when waiting for the video
  let loader = $.getElementById("loader")
  video.addEventListener("seeking", () => loader.style.display = "inline-block")
  video.addEventListener("seeked", () => loader.style.display = "none")
  video.addEventListener("loadstart", () => loader.style.display = "inline-block")
  video.addEventListener("waiting", () => loader.style.display = "inline-block")

  // Fontawesome classes
  const [iconPlay, iconPause] = ["svg-inline--fa fa-pause playpause","svg-inline--fa fa-play playpause"]

  //playpause logic
  const triggerPlayPause = () => {
    let playpause = $.getElementsByClassName("playpause")[0]
    if(video.paused || video.ended) {
      video.play()
      playpause.className.baseVal = iconPlay
    }
    else {
      video.pause()
      playpause.className.baseVal = iconPause
    }
  }

  //raise and decrease volume logic
  const volSlider = $.getElementById("volSlider")
  volSlider.addEventListener("input", () => video.volume = volSlider.value/100)
  const volume = $.getElementById("volume")
  video.volume = volSlider.value/100

  let volumeTrigger = () => {
    video.muted = !video.muted
    const [volTrue,volFalse] = ["svg-inline--fa fa-volume-high","svg-inline--fa fa-volume-off"]
    if(video.muted) {
      volume.children[0].className.baseVal = volFalse
    }
    else {
      volume.children[0].className.baseVal = volTrue
    }
  }
  volume.addEventListener("click", volumeTrigger)
  volume.addEventListener("keyup", (event) => {
    let key = event.key.toLowerCase()
    if (key === "enter") {
      volumeTrigger()
      hideUnhide()
    }
  })
  
  //update progress bar and duration
  const progress = $.getElementById("progress")
  const playpauseContainer = $.getElementById("playpause")
  const duration = $.getElementById("duration")
  video.addEventListener("loadedmetadata", () => {
    const minutes = Math.floor(video.duration/60)
    const seconds = Math.floor(video.duration)-minutes*60
    duration.textContent = `${minutes > 9 ? minutes : `0${minutes}`}:${seconds > 9 ? seconds : `0${seconds}`}`
    progress.setAttribute("max", video.duration)
  })

  video.addEventListener("timeupdate", () => {
    loader.style.display = "none"
    let playpause = playpauseContainer.children[0]
    progress.value = video.currentTime
    const minutes = Math.floor(video.currentTime/60)
    const seconds = Math.floor(video.currentTime)-minutes*60
    currentDuration.textContent = `${minutes > 9 ? minutes : `0${minutes}`}:${seconds > 9 ? seconds : `0${seconds}`}`
    if(video.ended) playpause.className = iconPause
  })
  
  //once data is loaded, it is safe to add the event listeners that needs that data
  video.addEventListener("loadeddata", () => {

    playpauseContainer.addEventListener("click",triggerPlayPause)
    playpauseContainer.addEventListener("keyup", (event) => {
      let key = event.key.toLowerCase()
      if(key === "enter") {
        triggerPlayPause()
        hideUnhide()
      }
    })
    $.addEventListener("keyup", (event) => {
      let key = event.key.toLowerCase()
      if(key === " ") {
        triggerPlayPause()
        hideUnhide()
      }
    })

    //Jump to in the video
    progress.addEventListener("click", (event) => {
      let rect = progress.getBoundingClientRect()
      let pos = (event.pageX - rect.left) / progress.offsetWidth
      video.currentTime = pos * video.duration
    })
  })

    //fullscreen logic, also check if fullscreen is supported
  const container = $.querySelector("figure")
  const fullscreen = $.getElementById("fullscreen")
  const fullscreenEnabled = !!(document.fullscreenEnabled || document.mozFullScreenEnabled || document.msFullscreenEnabled || document.webkitSupportsFullscreen || document.webkitFullscreenEnabled || document.createElement('video').webkitRequestFullScreen)
  const isFullscreen = () => {
   return !!(document.fullscreen || document.webkitIsFullScreen || document.mozFullScreen || document.msFullscreenElement || document.fullscreenElement);
}
  if (!fullscreenEnabled) fullscreen.style.display = 'none'

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
