function generateToken(length) {
  const charset = "0123456789eazymass";
  let token = "";
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * charset.length);
    token += charset[randomIndex];
  }
  return token;
}

document.addEventListener("DOMContentLoaded", () => {
  const ball = document.querySelector(".ball");
  const joinButton = document.querySelector(".btn-join");

  ball.style.top = "0%";

  joinButton.addEventListener("click", (e) => {
    e.preventDefault();

    ball.style.top = "-120%";

    setTimeout(() => {
      const storedUid = localStorage.getItem("uid");

      if (storedUid) {
        const token = generateToken(120);
        window.location.href = `dashboard.html?token=${token}&uid=${storedUid}&token=${token}`;
      } else {
        window.location.href = "loginsignup.html";
      }
    }, 2000);
  });
});




function requestFullScreen() {
  const docEl = document.documentElement;

  if (docEl.requestFullscreen) {
      docEl.requestFullscreen();
  } else if (docEl.webkitRequestFullscreen) { // Safari support
      docEl.webkitRequestFullscreen();
  } else if (docEl.msRequestFullscreen) { // IE/Edge support
      docEl.msRequestFullscreen();
  }
}

function attemptFullscreenOnInteraction() {
  requestFullScreen();

  document.removeEventListener('click', attemptFullscreenOnInteraction);
  document.removeEventListener('touchstart', attemptFullscreenOnInteraction);
}

document.addEventListener('click', attemptFullscreenOnInteraction);
document.addEventListener('touchstart', attemptFullscreenOnInteraction);

document.addEventListener('DOMContentLoaded', requestFullScreen);
