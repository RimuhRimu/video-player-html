const $ = document
const supportsVideo = !!$.createElement("video").canPlayType 
// check if support video media

if (supportsVideo) {
  const video = $.getElementById("video")
  video.controls = false //ensuring that we have controls disable from the start

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
  
  //show/hide loader when waiting for the video or  when is already loaded
  let loader = $.getElementById("loader")
  video.addEventListener("seeking", () => loader.style.display = "inline-block")
  video.addEventListener("loadstart", () => loader.style.display = "inline-block")
  video.addEventListener("waiting", () => loader.style.display = "inline-block")
  video.addEventListener("seeked", () => loader.style.display = "none")
  video.addEventListener("loadeddata", () => loader.style.display = "none")
  
  // Fontawesome classes
  const [iconPlay, iconPause] = ["svg-inline--fa fa-pause playpause icon","svg-inline--fa fa-play playpause icon"]

  //playpause logic
  const triggerPlayPause = () => {
    let playpause = $.getElementsByClassName("playpause")[0]
    //changing the classes changes the icon
    if(video.paused || video.ended) {
      video.play()
      playpause.className.baseVal = iconPlay 
    }
    else {
      video.pause()
      playpause.className.baseVal = iconPause
    }
  }
  
  const playpauseContainer = $.getElementById("playpause")
  //once data is loaded, it is safe to add the event listeners that needs that data
  // and is safe to jump to in the video
  video.addEventListener("loadeddata", () => {
    playpauseContainer.addEventListener("click",() => {
      triggerPlayPause()
      hideUnhide()
    })
    $.addEventListener("keyup", (event) => {
      let key = event.key.toLowerCase()
      if(key === "enter" || key === " ") {
        triggerPlayPause()
        hideUnhide()
      }
    })
    
    //Jump to in the video
    progress.addEventListener("click", (event) => {
      let rect = progress.getBoundingClientRect()
      let pos = (event.pageX - rect.left) / progress.offsetWidth
      // this is explained in MDN https://developer.mozilla.org/en-US/docs/Web/Guide/Audio_and_video_delivery/cross_browser_video_player#skip_ahead
      video.currentTime = pos * video.duration
    })
  })
  
  //update progress bar and duration
  const progress = $.getElementById("progress")
  video.addEventListener("loadedmetadata", () => {
    const minutes = Math.floor(video.duration/60)
    const seconds = Math.floor(video.duration)-minutes*60
    duration.textContent = `${minutes > 9 ? minutes : `0${minutes}`}:${seconds > 9 ? seconds : `0${seconds}`}`
    progress.setAttribute("max", video.duration) //set max duration as value to the progress bar
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

  //raise and decrease volume logic
  const volSlider = $.getElementById("volSlider")
  volSlider.addEventListener("input", () => video.volume = volSlider.value/100)
  const volume = $.getElementById("volume")
  video.volume = volSlider.value/100

  let volumeTrigger = () => {
    video.muted = !video.muted
    const [volTrue,volFalse] = ["svg-inline--fa fa-volume-high icon","svg-inline--fa fa-volume-off icon"]
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
  
   //fullscreen logic, also check if fullscreen is supported
  const container = $.querySelector("figure")
  const fullscreen = $.getElementById("fullscreen")
  const fullscreenEnabled = !!(document.fullscreenEnabled || document.mozFullScreenEnabled || document.msFullscreenEnabled || document.webkitSupportsFullscreen || document.webkitFullscreenEnabled || document.createElement('video').webkitRequestFullScreen)
  const isFullscreen = () => {
   return !!(document.fullscreen || document.webkitIsFullScreen || document.mozFullScreen || document.msFullscreenElement || document.fullscreenElement);
}
  if (!fullscreenEnabled) fullscreen.style.display = 'none'

  fullscreen.addEventListener("click", () => handleFullscreen())
  fullscreen.addEventListener("keyup", (e) => e.key === " " || e.key.toLowerCase() === "enter" ? handleFullscreen() : '')

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
