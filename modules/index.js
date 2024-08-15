// Get references to the HTML elements used in the alarm clock
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

// Initialize variables to store alarms, the currently active alarm, and the snooze timeout
let alarms = [];
let activeAlarm = null;
let snoozeTimeout = null;

// Function to populate the hour and minute dropdown options
function populateTimeOptions() {
  // Populate hour options (01 to 12)
  for (let i = 1; i <= 12; i++) {
    const option = document.createElement("option");
    option.value = i.toString().padStart(2, "0");
    option.textContent = i.toString().padStart(2, "0");
    alarmHourInput.appendChild(option);
  }

  // Populate minute options (00 to 59)
  for (let i = 0; i < 60; i++) {
    const option = document.createElement("option");
    option.value = i.toString().padStart(2, "0");
    option.textContent = i.toString().padStart(2, "0");
    alarmMinuteInput.appendChild(option);
  }
}

// Function to update the clock every second and check for alarms
function updateClock() {
  const now = new Date();
  const hours = String(now.getHours()).padStart(2, "0");
  const minutes = String(now.getMinutes()).padStart(2, "0");
  const seconds = String(now.getSeconds()).padStart(2, "0");
  const period = hours >= 12 ? "PM" : "AM";

  // Display the current time on the clock
  clockElement.textContent = `${hours}:${minutes}:${seconds} ${period}`;

  // Check if any alarms match the current time
  alarms.forEach((alarm) => {
    const alarmTime = formatTime(alarm.hour, alarm.minute, alarm.period);
    if (alarmTime === `${hours}:${minutes} ${period}`) {
      triggerAlarm(alarm);
    }
  });
}

// Function to format the time for comparison and display
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

// Function to set a new alarm
function setAlarm() {
  const hour = alarmHourInput.value;
  const minute = alarmMinuteInput.value;
  const period = alarmPeriodInput.value;

  // Check if all fields are filled
  if (!hour || !minute) {
    alarmMessage.textContent = "Please fill all fields to set an alarm.";
    return;
  }

  const newAlarm = { hour, minute, period };

  // Check if the alarm time is already set
  const existingAlarm = alarms.find(
    (alarm) =>
      alarm.hour === hour && alarm.minute === minute && alarm.period === period
  );

  if (existingAlarm) {
    alarmMessage.textContent = "An alarm is already set for this time.";
    return;
  }

  // Add the new alarm to the list and update the UI
  alarms.push(newAlarm);
  renderAlarms();
  alarmMessage.textContent = `Alarm set for ${formatTime(
    hour,
    minute,
    period
  )}`;

  // Clear the message after 5 seconds
  if (alarmMessage.textContent.includes("Alarm set for")) {
    setTimeout(() => {
      alarmMessage.innerHTML = "";
    }, 5000);
  }

  // Clear the input fields
  clearInputs();
}

// Function to trigger the alarm when the time matches
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

// Function to stop the currently active alarm
function stopAlarm() {
  if (activeAlarm) {
    alarmSound.pause();
    alarmSound.currentTime = 0;
    alarmMessage.innerHTML = "";

    // Remove the stopped alarm from the list
    alarms = alarms.filter((alarm) => alarm !== activeAlarm);
    renderAlarms();
    stopAlarmButton.classList.add("hidden");
    snoozeAlarmButton.classList.add("hidden");
    activeAlarm = null;
    alarmRingingImg.src = "./modules/alarm-5961342_1280.png";

    // Cancel the automatic snooze
    clearTimeout(snoozeTimeout);
  }
}

// Function to snooze the currently active alarm for 2 minutes
function snoozeAlarm() {
  if (activeAlarm) {
    stopAlarm();
    const snoozeTime = new Date();
    snoozeTime.setMinutes(snoozeTime.getMinutes() + 2);
    const snoozeHour = snoozeTime.getHours() % 12 || 12;
    const snoozeMinute = String(snoozeTime.getMinutes()).padStart(2, "0");
    const snoozePeriod = snoozeTime.getHours() >= 12 ? "PM" : "AM";

    // Set a new alarm for the snooze time
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

// Function to render the list of active alarms in the UI
function renderAlarms() {
  alarmsList.innerHTML = "";
  alarms.forEach((alarm, index) => {
    const li = document.createElement("li");
    const alarmTime = formatTime(alarm.hour, alarm.minute, alarm.period);
    li.innerHTML = `<span class="alarm-text">${alarmTime}</span><button class="remove-alarm" data-index="${index}">Remove</button>`;
    alarmsList.appendChild(li);
  });

  // Add event listeners to the remove buttons
  const removeButtons = document.querySelectorAll(".remove-alarm");
  removeButtons.forEach((button) => {
    button.addEventListener("click", removeAlarm);
  });
}

// Function to remove an alarm from the list
function removeAlarm(e) {
  const index = e.target.dataset.index;
  alarms.splice(index, 1);
  renderAlarms();
}

// Function to clear the alarm input fields
function clearInputs() {
  alarmHourInput.value = "01";
  alarmMinuteInput.value = "00";
  alarmPeriodInput.value = "AM";
}

// Add event listeners to the set, stop, and snooze alarm buttons
setAlarmButton.addEventListener("click", setAlarm);
stopAlarmButton.addEventListener("click", stopAlarm);
snoozeAlarmButton.addEventListener("click", snoozeAlarm);

// Populate time options for the select elements
populateTimeOptions();

// Update the clock immediately and then every second
updateClock();
setInterval(updateClock, 1000);
