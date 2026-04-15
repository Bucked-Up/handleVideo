const handleVideo = ({ videoSelector, videoUrl }) => {
  const handleText = (text) => {
    if (text.style.maxWidth === "0px") {
      text.style.maxWidth = "200px";
      text.style.maxHeight = "20px";
      text.style.paddingLeft = "8px";
    } else {
      text.style.maxWidth = "0px";
      text.style.maxHeight = "0px";
      text.style.paddingLeft = "0px";
      text.style.overflow = "hidden";
    }
  };
  const video = document.querySelector(videoSelector);
  if (video.canPlayType("application/vnd.apple.mpegurl")) {
    video.src = videoUrl;
  } else if (Hls.isSupported()) {
    const hls = new Hls();
    hls.loadSource(videoUrl);
    hls.attachMedia(video);
  }
  const observer = new IntersectionObserver(
    ([entry]) => {
      if (entry.isIntersecting) {
        video.play().catch(() => {});
        observer.disconnect();
      }
    },
    { threshold: 0.25 }
  );
  observer.observe(video);
  const parent = video.parentElement;
  parent.style.position = "relative";
  const button = document.createElement("div");
  Object.assign(button.style, {
    width: "100%",
    height: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    position: "absolute",
    top: "0",
    left: "0",
    zIndex: "1",
    cursor: "pointer",
  });
  parent.appendChild(button);
  const svgWrapper = document.createElement("div");
  const text = document.createElement("span");
  text.innerHTML = "Click for sound";
  text.style.transition = "max-height 0.2s, max-width 0.2s, padding 0.2s";
  text.style.lineHeight = "1";
  handleText(text);
  svgWrapper.appendChild(text);
  button.appendChild(svgWrapper);
  Object.assign(svgWrapper.style, {
    width: "fit-content",
    background: "rgba(0, 0, 0, 0.7)",
    borderRadius: "100px",
    padding: "6px",
    color: "white",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  });
  svgWrapper.insertAdjacentHTML(
    "beforeend",
    '<svg viewBox="0 0 237 237" width="40" height="40"><style>@keyframes waveSmall{0%{opacity:0}33%{opacity:1}66%{opacity:1}100%{opacity:0}}@keyframes waveLarge{0%{opacity:0}33%{opacity:1}66%{opacity:1}100%{opacity:0}}.wave-small{animation:waveSmall 2s infinite;opacity:0}.wave-large{animation:waveLarge 2s infinite 0.3s;opacity:0}</style><path fill="#fff" d="M88 107H65v24h24l23 23V84z"/><g fill="none" stroke="#fff" stroke-linecap="round" stroke-width="10"><path d="M142 86c9 21 9 44 0 65" class="wave-small"/><path d="M165 74c13 23 13 66 0 89" class="wave-large"/></g></svg>'
  );
  button.addEventListener("click", () => {
    video.muted = false;
    video.currentTime = 0;
    button.remove();
  });
  button.addEventListener("mouseenter", () => handleText(text));
  button.addEventListener("mouseleave", () => handleText(text));
};
