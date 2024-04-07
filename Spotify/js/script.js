// Global variable
var currentsong = new Audio();
let songs;
let currentfolder;
let songul;
let cardContainer = document.querySelector(".cardContainer");
let songs_Links_For_Next_And_Previous;
function formatTime(seconds) {
  // Ensure seconds is a non-negative number
  seconds = Math.max(0, seconds);

  // Calculate minutes and remaining seconds
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60); // Use Math.floor to round down

  // Pad with leading zeros and concatenate
  return `${String(minutes).padStart(2, "0")}:${String(
    remainingSeconds
  ).padStart(2, "0")}`;
}

async function getsongs(folder) {
  let a = await fetch(`./${folder}`);
  currentfolder = folder;
  let response = await a.text();
  let div = document.createElement("div");
  div.innerHTML = response;

  let as = div.getElementsByTagName("a");

  songs = [];
  for (let index = 0; index < as.length; index++) {
    const element = as[index];
    if (element.href.endsWith(".mp3")) {
      songs.push(element.href.split(`${folder}`)[1]);
    }
  }

  songul = document.querySelector(".songlists").getElementsByTagName("ul")[0];
  songul.innerHTML = "";

  for (const song of songs) {
    songul.innerHTML =
      songul.innerHTML +
      `<li>
    <img class="invert" src="SVG/music.svg" alt="" />
    <div class="info">
    <div>${song
      .replaceAll("%20", " ")
      .replaceAll("%2C", " ")
      .replaceAll("/", "")}</div>
      <div></div>
      <a href=${currentfolder}/${song}></a>
      </div>
      <div class="playnow">
      <span>Play Now</span>
      <img class="invert" src="SVG/play.svg" alt="" />
    </div>
    </li>`;
  }

  // Attach an event listner to each song

  let playlists = Array.from(
    document.querySelector(".songlists").getElementsByTagName("li")
  );
  playlists.forEach((e) => {
    e.addEventListener("click", () => {
      songinfo = e.querySelector(".info").firstElementChild.innerHTML;
      document.querySelector(".songinfo").innerHTML = songinfo;
      playmusic(e.querySelector(".info").lastElementChild.href);
    });
  });

  // making array of links to play next and previous
  let linklist = songul.getElementsByTagName("a");
  songs_Links_For_Next_And_Previous = [];
  for (let index = 0; index < linklist.length; index++) {
    const element = linklist[index];
    if (element.href.endsWith("mp3")) {
      songs_Links_For_Next_And_Previous.push(element.href);
    }
  }

  return { songs, songs_Links_For_Next_And_Previous };
}
const playmusic = (track, pause = false) => {
  currentsong.src = track;
  if (!pause) {
    currentsong.play();
    play.src = "SVG/pause.svg";
  }
  document.querySelector(".songinfo").innerHTML = track
    .split(`${currentfolder}`)[1]
    .replaceAll("%20", " ")
    .replaceAll("%2C", " ")
    .replaceAll("/", "");
};

async function DisplayAlbums() {
  let a = await fetch("./music/");
  let response = await a.text();
  let div = document.createElement("div");
  div.innerHTML = response;
  let anchors = div.getElementsByTagName("a");
  let array = Array.from(anchors);
  for (let index = 0; index < array.length; index++) {
    const e = array[index];

    if (e.href.includes("music/")) {
      let foldername = e.title;
      // Get the metadata of the folder
      let a = await fetch(`./music/${foldername}/info.json`);
      let response = await a.json();
      cardContainer.innerHTML =
        cardContainer.innerHTML +
        `            <div data-folder="${foldername}" class="cards border-red pr-1">
        <div class="play flex justify-content align-items">
        <img src="SVG/playlist-play.svg" alt="play-playlists" />
        </div>
              <img
              src=./music/${foldername}/cover.jpg
              alt="hello"
              />
              <h2>${response.Title}</h2>
              <p>${response.Discription}</p>
              </div>`;
    }
  }
  // Add an eventlistner to load all the album on click
  Array.from(document.getElementsByClassName("cards")).forEach((e) => {
    e.addEventListener("click", async (item) => {
      await getsongs(`music/${item.currentTarget.dataset.folder}`);
      playmusic(songs_Links_For_Next_And_Previous[0]);
    });
  });
}

async function main() {
  // get the lists of all the songs
  await getsongs("music/TopTrending");
  playmusic(songs_Links_For_Next_And_Previous[0], true);

  // display all the  Albums on thge page
  DisplayAlbums();

  // Attach an event listner to play,pause,next and previous

  play.addEventListener("click", () => {
    if (currentsong.paused) {
      currentsong.play();
      play.src = "SVG/pause.svg";
    } else {
      currentsong.pause();
      play.src = "SVG/play.svg";
    }
  });

  // listen for timeupdate event
  currentsong.addEventListener("timeupdate", () => {
    // console.log(currentsong.currentTime, currentsong.duration);
    index = songs_Links_For_Next_And_Previous.indexOf(currentsong.src);

    // Autoplay next song and Restart playlist
    if (
      currentsong.currentTime == currentsong.duration &&
      index + 1 < songs_Links_For_Next_And_Previous.length
    ) {
      playmusic(songs_Links_For_Next_And_Previous[index + 1]);
    } else if (
      currentsong.currentTime == currentsong.duration &&
      index == songs_Links_For_Next_And_Previous.length - 1
    ) {
      playmusic(songs_Links_For_Next_And_Previous[0]);
    }

    // using setinterval to avoid few seconds of NANAN at Duration
    setInterval(() => {
      document.querySelector(".songtimer").innerHTML = `${formatTime(
        currentsong.currentTime
      )} / ${formatTime(currentsong.duration)}`;
    }, 1000);
    document.querySelector(".circle").style.left =
      (currentsong.currentTime / currentsong.duration) * 100 + "%";
  });

  // updatecurrentsong currentTime as per seekbar offsetX click
  document.querySelector(".seekbar").addEventListener("click", (e) => {
    let percent = (e.offsetX / e.target.getBoundingClientRect().width) * 100;
    document.querySelector(".circle").style.left = percent + "%";
    currentsong.currentTime = (currentsong.duration * percent) / 100;
  });

  // Add an eventlistner for menu
  document.querySelector(".menu").addEventListener("click", () => {
    document.querySelector(".left").style.left = "0";
  });

  // Add an eventlistner for close
  document.querySelector(".close").addEventListener("click", () => {
    document.querySelector(".left").style.left = "-120%";
  });

  // Add an event listener for previous button
  previous.addEventListener("click", () => {
    console.log("previous was clicked");
    // Get the index of the current song in the array of song links
    index = songs_Links_For_Next_And_Previous.indexOf(currentsong.src);
    // If the index is greater tha zero, play the previous song in the array
    if (index > 0) {
      playmusic(songs_Links_For_Next_And_Previous[index - 1]);
    } else {
      // If the index is the first one, play the last song in the array
      playmusic(
        songs_Links_For_Next_And_Previous[
          songs_Links_For_Next_And_Previous.length - 1
        ]
      );
    }
  });

  // Add an event listener for next button
  next.addEventListener("click", () => {
    console.log("next was clicked");
    // Get the index of the current song in the array of song links
    index = songs_Links_For_Next_And_Previous.indexOf(currentsong.src);
    // If the index is not the last one, play the next song in the array
    if (index + 1 < songs_Links_For_Next_And_Previous.length) {
      playmusic(songs_Links_For_Next_And_Previous[index + 1]);
      console.log(index);
    } else {
      // If the index is the last one, play the first song in the array
      playmusic(songs_Links_For_Next_And_Previous[0]);
    }
  });

  // Add an event listner for volume

  document
    .querySelector(".volume")
    .getElementsByTagName("input")[0]
    .addEventListener("change", (e) => {
      console.log("setting volume to ", e.target.value, "/100");
      currentsong.volume = parseInt(e.target.value) / 100;
    });

  // Add event listner to mute the volume track

  document.querySelector(".volume>img").addEventListener("click", (e) => {
    if (e.target.src.includes("volume.svg")) {
      e.target.src = e.target.src.replace("volume.svg", "mute.svg");
      currentsong.volume = 0;
      document.querySelector(".volume").getElementsByTagName("input")[0].value =
        0 / 100;
    } else {
      e.target.src = e.target.src.replace("mute.svg", "volume.svg");
      currentsong.volume = 0.1;
      document
        .querySelector(".volume")
        .getElementsByTagName("input")[0].value = 60;
    }
  });
}
main();
function LoginFun() {
  let buttons = document.querySelector(".buttons");

  // Click on login button
  let LoginIn = document.querySelector(".Login-in");
  let SignIn = document.querySelector(".Sign-in");
  LoginIn.addEventListener("click", (e) => {
    document.querySelector(".login-container").style.display = "inherit";
  });
  SignIn.addEventListener("click", (e) => {
    document.querySelector(".login-container").style.display = "inherit";
  });

  // Click on Submit button
  let Submit = document.querySelector("#submit");

  Submit.addEventListener("click", (e) => {
    e.preventDefault();

    // Get all required inputs
    const requiredInputs = document.querySelectorAll("input[required]");
    let allInputsFilled = true;

    // Check if all required inputs are filled
    requiredInputs.forEach((input) => {
      if (!input.value.trim()) {
        allInputsFilled = false;
      }
    });

    // Check if email format is valid
    const emailInput = document.querySelector("#email");
    const emailValue = emailInput.value.trim();
    const emailRegex = /^\S+@\S+\.\S+$/; // General email format regex
    const validEmail = emailRegex.test(emailValue);

    // If all required inputs are filled and email format is valid, execute the event listener
    if (allInputsFilled && validEmail) {
      var usernametextinput = document.querySelector("#username");
      var userName = usernametextinput.value;

      // Clear previous content and update with new content
      buttons.innerHTML = `
 <div class="username">${userName}</div>
            <div class="userprofile"><img src="./SVG/user.svg" alt="" /></div> 
      `;
      document.querySelector(".login-container").style.display = "none";
    } else if (!validEmail) {
      alert("Please enter valid email");
    } else {
      // If any required input is empty or email format is invalid, prevent default form submission
      if (!allInputsFilled) {
        alert("Please fill in all required fields.");
      } else if (!validEmail) {
        alert("Please enter a valid email address.");
      }
    }
  });
}
LoginFun();
// // Call the Login function after the DOM is fully loaded

// function profile() {
//   var buttons = document.querySelector(".buttons");

//   let LoginIn = document.querySelector(".Login-in");
//   LoginIn.addEventListener("click", (e) => {
//     document.querySelector(".login-container").style.display = "inherit";
//   });

//   // Click on Submit button
//   let Submit = document.querySelector("#submit");

//   //  Event Click on Submit button
//   Submit.addEventListener("click", (e) => {
//     e.preventDefault();
//     var usernametextinput = document.querySelector("#username");
//     var userName = usernametextinput.value;

//     buttons.innerHTML = `
//  <div class="username">Chirag</div>
//             <div class="userprofile"><img src="./SVG/user.svg" alt="" /></div>
//       `;
//     console.log(buttons.innerHTML);
//   });
// }
// profile();
