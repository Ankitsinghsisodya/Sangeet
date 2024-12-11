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
let songs;

let isDragging = false;
let currentSong = new Audio();
function showAllSongs(songs) {
  let songUl = document
    .querySelector(".song-list")
    .getElementsByTagName("ul")[0];

  for (const song of songs) {
    songUl.innerHTML =
      songUl.innerHTML +
      ` <li class="flex gap-x-2 justify-between border rounded-md p-2 text-white
    bg-gradient-to-r from-yellow-500 to-red-500 cursor-pointer">
                          <img src="./img/music.svg" alt="">
                          <span class="gap-x-2">${song.title}</span>
                          <img src="./img/play.svg" alt="" class="pl-icon z-[10000]">
                      </li>`;

    songContainer.innerHTML += `
                      <div class="w-[200px] h-[200px] rounded-md border hover:scale-105 transition-all duration-200 relative group">
                        <img src="./img/play.svg" alt="" class="absolute bg-green-400 rounded-full p-2 hidden group-hover:block bottom-2 right-2 pl-icon2">
                        <img src="./${song.image}" alt="" class="h-[200px] w-[200px] rounded-md">
                        <h2 class="text-center text-red-500 font-bold">${song.title}</h2>
                        <p class="text-green-800 font-bold text-center">${song.author}</p>
                      </div>`;
  }
  document.querySelector("#volumeControl").addEventListener("input", (event) => {
    if (currentSong) {
      console.log(event);
      const volumeValue = event.target.value;
      currentSong.volume = volumeValue/100;
      console.log(`Volume set to: ${volumeValue}`);
    }
  });
}
async function main() {
  songs = await getSongs();

  // show all the songs int he playlist

  showAllSongs(songs);

  //Attach even listener to each song
  Array.from(
    document.querySelector(".song-list").getElementsByTagName("li")
  ).forEach((li) => {
    const playIcon = li.querySelector(".pl-icon");
    if (playIcon) {
      playIcon.addEventListener("click", (event) => {
        playSong(li.getElementsByTagName("span")[0].textContent);
      });
    }
  });

  // Attach even listener to each card also
  Array.from(
    document.querySelector("#songContainer").getElementsByTagName("div")
  ).forEach((div) => {
    const playIcon = div.querySelector(".pl-icon2");
    if (playIcon) {
      playIcon.addEventListener("click", (e) => {
        playSong(div.getElementsByTagName("h2")[0].textContent);
      });
    }
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
  const seekbar = document.querySelector(".seekbar");
  console.log(seekbar);

  if (circle && seekbar) {
    circle.addEventListener("mousedown", (event) => {
      event.preventDefault(); // Prevent unwanted behaviors
      isDragging = true;
    });

    document.addEventListener("mousemove", (event) => {
      if (isDragging) {
        const rect = seekbar.getBoundingClientRect();
        const offsetX = event.clientX - rect.left;
        const percentage = Math.min(Math.max(offsetX / rect.width, 0), 1);
        circle.style.left = percentage * 100 + "%";
        currentSong.currentTime = percentage * currentSong.duration;
      }
    });
    document.querySelector(".seekbar").addEventListener("click", (event) => {
      const rect = seekbar.getBoundingClientRect();
      const offsetX = event.clientX - rect.left;
      const percentage = Math.min(Math.max(offsetX / rect.width, 0), 1);
      circle.style.left = percentage * 100 + "%";
      currentSong.currentTime = percentage * currentSong.duration;
      console.log(percentage);
    });

    document.addEventListener("mouseup", () => {
      isDragging = false;
    });
  }

  //Add an event listener for hamburger
  document.querySelector(".hamburger").addEventListener("click", () => {
    document.querySelector(".left").style.left = 0;
    document.querySelector(".left").style.zIndex = 10000;
  });

  //Add an event listener for cross
  document.querySelector(".close").addEventListener("click", () => {
    document.querySelector(".left").style.left = "-100%";
    document.querySelector(".left").style.zIndex = "-10000";
  });

  // Add event listener for prev
  prev.addEventListener("click", (e) => {
    console.log("previous clicked");
    currentSong.pause();
    let index = songs.findIndex((song) => {
      return song.file === currentSong.src.split("/Public/")[1];
    });
    if (index - 1 >= 0 && index != -1) {
      playSong(songs[index - 1].title);
    } else currentSong.play();
  });
  // Add event listener for next
  next.addEventListener("click", (e) => {
    console.log("next clicked");

    currentSong.pause();
    console.log(currentSong.src.split("/Public/")[1].replaceAll("%20", ""));
    console.log(currentSong.src);
    let index = songs.findIndex((song) => {
      return (
        song.file === currentSong.src.split("/Public/")[1].replaceAll("%20", "")
      );
    });

    if (index + 1 < songs.length && index != -1) {
      playSong(songs[index + 1].title);
    } else currentSong.play();
  });
}

function playSong(song) {
  getSongs().then((songs) => {
    Array.from(songs).forEach((songObj) => {
      if (songObj.title == song) {
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
        }
      }
    });
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
