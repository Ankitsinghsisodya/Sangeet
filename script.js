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

let prev = "Nothing";
let flag = false;

async function main() {
  let currentSong;
  let songs = await getSongs();
  console.log(songs);

  // show all the songs int he playlist
  let songUl = document
    .querySelector(".song-list")
    .getElementsByTagName("ul")[0];
  console.log(songs);
  for (const song of songs) {
    songUl.innerHTML =
      songUl.innerHTML +
      ` <li class="flex gap-x-3 justify-between border rounded-md p-2 text-white
      bg-gradient-to-r from-yellow-500 to-red-500">
                            <img src="./img/music.svg" alt="">
                            <span class="gap-x-2">${song.title}</span>
                            <img src="./img/play.svg" alt="">
                        </li>`;
    console.log(songUl.innerHTML);
  }

  document
    .querySelector(".play-icon")
    .addEventListener("click", () => {
      if (flag == true) {
        prev.pause();
      }
    });
  //Attach even listener to each song
  Array.from(
    document.querySelector(".song-list").getElementsByTagName("li")
  ).forEach((e) => {
    e.addEventListener("click", (event) => {
      console.log(e.getElementsByTagName("span")[0].textContent);
      playSong(e.getElementsByTagName("span")[0].textContent);
    });
  });
}

async function playSong(song) {
  const songs = await getSongs();
  console.log(song, "playsong ke andar");
  for (const songObj of songs) {
    console.log(song);
    if (song === songObj.title) {
      if (flag) {
        prev.pause();
        prev.currentTime = 0;
      }
      flag = true;

      let audio = new Audio("./Public/" + songObj.file);
      prev = audio;
      console.log("./Public/" + songObj.file);
      audio.play();
      break;
    }
  }
}
document.addEventListener("DOMContentLoaded", () => {
  main();
});
