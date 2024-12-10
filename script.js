async function getSongs() {
  try {
    const response = await fetch("./Public/Music/music.json");
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error("Error fetching songs:", error);
    return [];
  }
}

let isDragging = false;
let currentSong = new Audio();
function showAllSongs(songs) {
  let songUl = document
    .querySelector(".song-list")
    .getElementsByTagName("ul")[0];

  for (const song of songs) {
    songUl.innerHTML =
      songUl.innerHTML +
      ` <li class="flex gap-x-3 justify-between border rounded-md p-2 text-white
    bg-gradient-to-r from-yellow-500 to-red-500">
                          <img src="./img/music.svg" alt="">
                          <span class="gap-x-2">${song.title}</span>
                          <img src="./img/play.svg" alt="">
                      </li>`;
  }
}
async function main() {
  let songs = await getSongs();

  // show all the songs int he playlist

  showAllSongs(songs);

  //Attach even listener to each song
  Array.from(
    document.querySelector(".song-list").getElementsByTagName("li")
  ).forEach((e) => {
    e.addEventListener("click", (event) => {
      playSong(e.getElementsByTagName("span")[0].textContent);
    });
  });

  // Attaching event listener of play and pause at seekbar
  play.addEventListener("click", () => {
    if (currentSong.paused) {
      currentSong.play();
      play.src = "./img/pause.svg";
    } else {
      currentSong.pause();
      play.src = "./img/play.svg";
    }
  });

  // Add drag functionality to the circle
  const circle = document.querySelector(".circle");
  const seekBar = document.querySelector(".seekbar");

  if (circle && seekBar) {
    circle.addEventListener("mousedown", (event) => {
      event.preventDefault(); // Prevent unwanted behaviors
      isDragging = true;
    });

    document.addEventListener("mousemove", (event) => {
      if (isDragging) {
        const rect = seekBar.getBoundingClientRect();
        const offsetX = event.clientX - rect.left;
        const percentage = Math.min(Math.max(offsetX / rect.width, 0), 1);
        circle.style.left = percentage * 100 + "%";
        currentSong.currentTime = percentage * currentSong.duration;
      }
    });

    document.addEventListener("mouseup", () => {
      isDragging = false;
    });
  }
}

function playSong(song) {
  getSongs().then((songs) => {
    for (const songObj of songs) {
      if (song === songObj.title) {
        currentSong.src = "./Public/" + songObj.file;

        // Update the current time dynamically
        currentSong.addEventListener("timeupdate", () => {
          if (!isDragging) {
            document.querySelector(".circle").style.left =
              (currentSong.currentTime / currentSong.duration) * 100 + "%";
          }
          const currentTime = formatTime(currentSong.currentTime);
          const totalDuration = formatTime(currentSong.duration);

          // Update the current time dynamically
          document.querySelector(
            ".songTime"
          ).innerHTML = `<p>${currentTime} / ${totalDuration}
            </p>`;

          document.querySelector(
            ".songName"
          ).innerHTML = `<p><span class='text-white'>${songObj.title}</span>
            </p>`;
        });

        play.src = "./img/pause.svg";
        currentSong.play();
        break;
      }
    }
  });
}
function formatTime(seconds) {
  const minutes = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${minutes}:${secs < 10 ? "0" : ""}${secs}`;
}

document.addEventListener("DOMContentLoaded", () => {
  main();
});
