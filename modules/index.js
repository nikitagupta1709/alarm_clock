import { addingTimer } from "./settingTime.js";

const currTime = document.getElementById("current_time");
const setting_timer = document.getElementById("setting_timer");

let hour = "",
  min = "",
  sec = "",
  zone = "";
let timerValue;
// DISPLAY CUURENT TIME
function getCurrTime() {
  const date = new Date();
  currTime.textContent = date.toLocaleTimeString();
}
setInterval(() => {
  getCurrTime();
  activeTimer();
}, 1000);

const heading = document.createElement("h2");
heading.textContent = "Set timer";
setting_timer.appendChild(heading);

addingTimer();

const buttonHandle = document.createElement("div");
buttonHandle.className = "buttonHandle";

const setTimBtn = document.createElement("button");
setTimBtn.className = "setTimBtn";
setTimBtn.textContent = "Set timer";

setTimBtn.addEventListener("click", () => {
  if (hour !== "" && min != "" && sec !== "" && zone !== "") {
    timerValue = hour + ":" + min + ":" + sec + zone;
    console.log("timerValue", timerValue);
  } else {
    alert("Select all the fields");
  }
});
const resetBtn = document.createElement("button");
resetBtn.className = "resetBtn";
resetBtn.textContent = "Reset timer";

resetBtn.addEventListener("click", () => {
  timerValue = "";
});
buttonHandle.append(setTimBtn, resetBtn);
setting_timer.appendChild(buttonHandle);

export function handleChangeValue(value, fieldName) {
  console.log("value", value);
  if (fieldName === "hour") {
    hour = value;
  } else if (fieldName === "min") {
    min = value;
  } else if (fieldName === "sec") {
    sec = value;
  } else if (fieldName === "zone") {
    zone = value;
  }
}

function activeTimer() {
  if (timerValue === currTime.textContent) {
    console.log("currTime", currTime);
    alert("Wake up");
  }
}
