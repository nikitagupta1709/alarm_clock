const clockElement = document.getElementById("clock");
const alarmHourInput = document.getElementById("alarm-hour");
const alarmMinuteInput = document.getElementById("alarm-minute");
const alarmPeriodInput = document.getElementById("alarm-period");
const setAlarmButton = document.getElementById("set-alarm");
const stopAlarmButton = document.getElementById("stop-alarm");
const snoozeAlarmButton = document.getElementById("snooze-alarm");
const alarmMessage = document.getElementById("alarm-message");
const alarmsList = document.getElementById("alarms");
const alarmSound = document.getElementById("alarm-sound");
const alarmRingingImg = document.getElementById("alarm-ringing");

let alarms = [];
let activeAlarm = null;
let snoozeTimeout = null;

function populateTimeOptions() {
  for (let i = 1; i <= 12; i++) {
    const option = document.createElement("option");
    option.value = i.toString().padStart(2, "0");
    option.textContent = i.toString().padStart(2, "0");
    alarmHourInput.appendChild(option);
  }

  for (let i = 0; i < 60; i++) {
    const option = document.createElement("option");
    option.value = i.toString().padStart(2, "0");
    option.textContent = i.toString().padStart(2, "0");
    alarmMinuteInput.appendChild(option);
  }
}

function updateClock() {
  const now = new Date();
  const hours = String(now.getHours()).padStart(2, "0");
  const minutes = String(now.getMinutes()).padStart(2, "0");
  const seconds = String(now.getSeconds()).padStart(2, "0");
  const period = hours >= 12 ? "PM" : "AM";
  clockElement.textContent = `${hours}:${minutes}:${seconds} ${period}`;
  alarms.forEach((alarm) => {
    const alarmTime = formatTime(alarm.hour, alarm.minute, alarm.period);
    if (alarmTime === `${hours}:${minutes} ${period}`) {
      triggerAlarm(alarm);
    }
  });
}

function formatTime(hour, minute, period) {
  let formattedHour = parseInt(hour);
  if (period === "PM" && formattedHour !== 12) {
    formattedHour += 12;
  }
  if (period === "AM" && formattedHour === 12) {
    formattedHour = 0;
  }
  return `${String(formattedHour).padStart(2, "0")}:${minute} ${period}`;
}

function setAlarm() {
  const hour = alarmHourInput.value;
  const minute = alarmMinuteInput.value;
  const period = alarmPeriodInput.value;

  if (!hour || !minute) {
    alarmMessage.textContent = "Please fill all fields to set an alarm.";
    return;
  }

  const newAlarm = { hour, minute, period };
  const existingAlarm = alarms.find(
    (alarm) =>
      alarm.hour === hour && alarm.minute === minute && alarm.period === period
  );

  if (existingAlarm) {
    alarmMessage.textContent = "An alarm is already set for this time.";
    return;
  }

  alarms.push(newAlarm);
  renderAlarms();
  alarmMessage.textContent = `Alarm set for ${formatTime(
    hour,
    minute,
    period
  )}`;
  if (alarmMessage.textContent.includes("Alarm set for")) {
    setTimeout(() => {
      alarmMessage.innerHTML = "";
    }, 5000);
  }
  clearInputs();
}

function triggerAlarm(alarm) {
  alarmMessage.textContent = `Wake up! alarm is ringing!`;
  alarmRingingImg.src = "./modules/Alarm_Clock_Animation_High_Res.png";
  alarmSound.play();
  activeAlarm = alarm;
  stopAlarmButton.classList.remove("hidden");
  snoozeAlarmButton.classList.remove("hidden");

  // Automatically snooze after 3 minutes if not stopped
  snoozeTimeout = setTimeout(snoozeAlarm, 180000);
}

function stopAlarm() {
  if (activeAlarm) {
    alarmSound.pause();
    alarmSound.currentTime = 0;
    alarmMessage.innerHTML = "";
    alarms = alarms.filter((alarm) => alarm !== activeAlarm);
    renderAlarms();
    stopAlarmButton.classList.add("hidden");
    snoozeAlarmButton.classList.add("hidden");
    activeAlarm = null;
    alarmRingingImg.src = "./modules/alarm-5961342_1280.png";
    clearTimeout(snoozeTimeout); // Cancel the automatic snooze
  }
}

function snoozeAlarm() {
  if (activeAlarm) {
    stopAlarm();
    const snoozeTime = new Date();
    snoozeTime.setMinutes(snoozeTime.getMinutes() + 2);
    const snoozeHour = snoozeTime.getHours() % 12 || 12;
    const snoozeMinute = String(snoozeTime.getMinutes()).padStart(2, "0");
    const snoozePeriod = snoozeTime.getHours() >= 12 ? "PM" : "AM";

    alarms.push({
      hour: String(snoozeHour).padStart(2, "0"),
      minute: snoozeMinute,
      period: snoozePeriod,
    });

    renderAlarms();
    alarmMessage.textContent = `Alarm snoozed for 2 minutes.`;
    alarmRingingImg.src = "./modules/alarm-5961342_1280.png";
  }
}

function renderAlarms() {
  alarmsList.innerHTML = "";
  alarms.forEach((alarm, index) => {
    const li = document.createElement("li");
    const alarmTime = formatTime(alarm.hour, alarm.minute, alarm.period);
    li.innerHTML = `<span class="alarm-text">${alarmTime}</span><button class="remove-alarm" data-index="${index}">Remove</button>`;
    alarmsList.appendChild(li);
  });

  const removeButtons = document.querySelectorAll(".remove-alarm");
  removeButtons.forEach((button) => {
    button.addEventListener("click", removeAlarm);
  });
}

function removeAlarm(e) {
  const index = e.target.dataset.index;
  alarms.splice(index, 1);
  renderAlarms();
}

function clearInputs() {
  alarmHourInput.value = "01";
  alarmMinuteInput.value = "00";
  alarmPeriodInput.value = "AM";
}

setAlarmButton.addEventListener("click", setAlarm);
stopAlarmButton.addEventListener("click", stopAlarm);
snoozeAlarmButton.addEventListener("click", snoozeAlarm);

// Populate time options for the select elements
populateTimeOptions();

// Update the clock immediately and then every second
updateClock();
setInterval(updateClock, 1000);
