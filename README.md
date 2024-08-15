# Alarm Clock

This project is a web-based Alarm Clock that allows users to set alarms, snooze them, and manage multiple alarms. The application is built using HTML, CSS, and JavaScript, with a focus on a simple and interactive user interface.

## Features

- **Live Clock Display:** The current time is displayed in real-time with updates every second.
- **Set Alarms:** Users can set multiple alarms for specific times, specifying the hour, minute, and AM/PM period.
- **Alarm Notifications:** When an alarm time is reached, an audio alert is played, and a message is displayed on the screen.
- **Snooze Functionality:** Users can snooze an active alarm for 2 minutes. The snooze is also automatically triggered after 3 minutes if the alarm is not manually stopped.
- **Manage Alarms:** Users can view a list of all active alarms and remove any alarm from the list.
- **Custom Alarm Sound:** The alarm plays a custom audio file, which can be replaced with another audio file if desired.
- **Visual Alerts:** The alarm triggers a visual change in the displayed alarm image when ringing.

## Project Structure

- **HTML (index.html):** The main structure of the application, including elements for the live clock, alarm settings, and alarm list.
- **CSS (index.css):** Styles for the application, providing a clean and modern interface.
- **JavaScript (index.js):** The functionality of the alarm clock, including time updates, alarm management, and user interactions.

## How to Use

1. **Set the Alarm:**

   - Select the desired hour, minute, and period (AM/PM) from the dropdown menus.
   - Click the "Set Alarm" button to add the alarm to the list.

2. **Manage Alarms:**

   - The list of alarms is displayed in the "Alarms List" section.
   - Each alarm shows the time and includes a "Remove" button to delete it.

3. **Alarm Notifications:**

   - When an alarm goes off, the alarm sound plays, and a visual alert is shown.
   - Use the "Stop Alarm" button to stop the alarm and remove it from the list.
   - Use the "Snooze Alarm" button to snooze the alarm for 2 minutes.

4. **Snooze Feature:**
   - If the alarm is not stopped within 3 minutes, it will automatically snooze.
