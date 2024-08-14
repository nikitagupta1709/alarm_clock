const clockElement = document.getElementById("clock");
const alarmNameInput = document.getElementById("alarm-name");
const alarmHourInput = document.getElementById("alarm-hour");
const alarmMinuteInput = document.getElementById("alarm-minute");
const alarmPeriodInput = document.getElementById("alarm-period");
const setAlarmButton = document.getElementById("set-alarm");
const stopAlarmButton = document.getElementById("stop-alarm");
const snoozeAlarmButton = document.getElementById("snooze-alarm");
const alarmMessage = document.getElementById("alarm-message");
const alarmsList = document.getElementById("alarms");
const alarmSound = document.getElementById("alarm-sound");

let alarms = [];
let activeAlarm = null;

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
  clockElement.textContent = `${hours}:${minutes}:${seconds}`;

  alarms.forEach((alarm) => {
    const alarmTime = formatTime(alarm.hour, alarm.minute, alarm.period);
    if (alarmTime === `${hours}:${minutes}`) {
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
  return `${String(formattedHour).padStart(2, "0")}:${minute}`;
}

function setAlarm() {
  const name = alarmNameInput.value.trim();
  const hour = alarmHourInput.value;
  const minute = alarmMinuteInput.value;
  const period = alarmPeriodInput.value;

  if (!name || !hour || !minute) {
    alarmMessage.classList.add("alarm-message-p");
    alarmMessage.textContent = "Please fill all fields to set an alarm.";
    return;
  }

  const newAlarm = { name, hour, minute, period };
  const existingAlarm = alarms.find(
    (alarm) =>
      alarm.hour === hour && alarm.minute === minute && alarm.period === period
  );

  if (existingAlarm) {
    alarmMessage.classList.add("alarm-message-p");
    alarmMessage.textContent = "An alarm is already set for this time.";
    return;
  }

  alarms.push(newAlarm);
  renderAlarms();
  alarmMessage.classList.add("alarm-message-p");
  alarmMessage.textContent = `Alarm set for ${formatTime(
    hour,
    minute,
    period
  )} (${name})`;
  if (alarmMessage.textContent.includes("Alarm set for")) {
    setTimeout(() => {
      alarmMessage.classList.remove("alarm-message-p");
      alarmMessage.innerHTML = "";
    }, 5000);
  }
  clearInputs();
}

function triggerAlarm(alarm) {
  alarmMessage.classList.add("alarm-message-p");
  alarmMessage.textContent = `Wake up! ${alarm.name} alarm is ringing!`;
  alarmSound.play();
  activeAlarm = alarm;
  stopAlarmButton.classList.remove("hidden");
  snoozeAlarmButton.classList.remove("hidden");
}

function stopAlarm() {
  if (activeAlarm) {
    alarmSound.pause();
    alarmSound.currentTime = 0;
    alarmMessage.classList.remove("alarm-message-p");
    alarmMessage.innerHTML = "";
    alarms = alarms.filter((alarm) => alarm !== activeAlarm);
    renderAlarms();
    stopAlarmButton.classList.add("hidden");
    snoozeAlarmButton.classList.add("hidden");
    activeAlarm = null;
  }
}

function snoozeAlarm() {
  if (activeAlarm) {
    stopAlarm();
    const snoozeTime = new Date();
    snoozeTime.setMinutes(snoozeTime.getMinutes() + 5);
    const snoozeHour = snoozeTime.getHours() % 12 || 12;
    const snoozeMinute = String(snoozeTime.getMinutes()).padStart(2, "0");
    const snoozePeriod = snoozeTime.getHours() >= 12 ? "PM" : "AM";

    alarms.push({
      name: `${activeAlarm.name} (Snooze)`,
      hour: String(snoozeHour).padStart(2, "0"),
      minute: snoozeMinute,
      period: snoozePeriod,
    });

    renderAlarms();
    alarmMessage.classList.add("alarm-message-p");
    alarmMessage.textContent = `Alarm snoozed for 5 minutes.`;
  }
}

function renderAlarms() {
  alarmsList.innerHTML = "";
  alarms.forEach((alarm, index) => {
    const li = document.createElement("li");
    const alarmTime = formatTime(alarm.hour, alarm.minute, alarm.period);
    li.innerHTML = `<span class="alarm-text">${alarmTime} - ${alarm.name}</span><button class="remove-alarm" data-index="${index}">Remove</button>`;
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
  alarmNameInput.value = "";
  alarmHourInput.value = "";
  alarmMinuteInput.value = "";
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
