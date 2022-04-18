// Api key = https://api.nasa.gov/planetary/apod?api_key=wzwDEvOryFlRQgtlrLczeonvdaBLZb5efEnVRPo8
// set default date to today

const NASA_BASE_API_URL = "https://api.nasa.gov/planetary/apod?api_key=";
const USER_API_KEY = null;
const API_KEY = (USER_API_KEY || "DEMO_KEY");
const FETCH_URL = NASA_BASE_API_URL + API_KEY;
const defaultPage = localStorage.getItem("defaultPage");

window.addEventListener("DOMContentLoaded", () => {
  document.getElementById("datePicker").valueAsDate = new Date();

  // check if no research already done, put today as default search date
  if (defaultPage === null) {
    fetchUrlData(FETCH_URL, "default");
  } else {
    const info = JSON.parse(defaultPage);
    console.log(info);
    writeApiInformations(info);
  }
});

// add event listener to submit button
document.getElementById("submit").addEventListener("click", (el) => {
  el.preventDefault();
  const dateSelected = document.getElementById("datePicker").valueAsDate;
  const d1 = dateSelected.setHours(0, 0, 0, 0);
  const currentDate = new Date().setHours(0, 0, 0, 0);
  if (d1 > currentDate) {
    document.querySelector(
      ".error"
    ).textContent = `The time machine is broken. We are tempory enable to go to ${dateSelected}`;
  } else {
    // modify selected date for API
    let dateModified =
      dateSelected.getFullYear() +
      "-" +
      (dateSelected.getMonth() + 1) +
      "-" +
      dateSelected.getDate();
    fetchUrlData(`${FETCH_URL}&date=${dateModified}`);
  }

  //  fetchUrlData();
});

/**
 *
 * @param {Nasa Api Url} url
 * @default Nasa api demo key is use as url
 */
function fetchUrlData(url = NASA_BASE_API_URL + API_KEY, type = "fetch") {
  fetch(url)
    .then((response) => response.json())
    .then((data) => {
      if (type === "default") {
        localStorage.setItem("defaultPage", JSON.stringify(data));
      } else {
        writeApiInformations(data);
      }
      console.log(data);
    })
    .catch((error) => {
      console.log(error);
    });
}

/**
 * write data information in the html
 * @param {NASA Api Object} info
 */
function writeApiInformations(info) {
  document.querySelector(".title").textContent = info.title;
  document.querySelector(".owner").textContent = info.copyright;
  document.querySelector(".media", info);

  const mediaSrc = document.querySelector(".media");
  if (info.media_type === "image") {
    mediaSrc.innerHTML = "";
    if (info.hdurl !== null) {
      mediaSrc.innerHTML += `<a href="${info.hdurl}" alt="See in HD : ${info.title}" class="hdImgLink"
        target="_blank" rel="nofollow">See in HD</a>`;
    }
    mediaSrc.innerHTML += `<img src="${info.url}" alt="${info.title}" class="img" />`;
  }

  document.querySelector(".explanation").textContent = info.explanation;
}
