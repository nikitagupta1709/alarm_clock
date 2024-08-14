import { handleChangeValue } from "./index.js";

const setting_timer = document.getElementById("setting_timer");
const setting_timer_box = document.createElement("div");
setting_timer_box.className = "setting_timer_box";

const createTimeSelect = (options, defaultLabel, fieldName) => {
  const select = document.createElement("select");
  select.className = "form-select form-select-sm";

  const defaultOption = document.createElement("option");
  defaultOption.value = "";
  defaultOption.label = defaultLabel;
  select.add(defaultOption);

  options.forEach((option) => {
    const opt = document.createElement("option");
    opt.value = option;
    opt.label = option;
    select.add(opt);
  });

  // Add event listener to call handleChangeValue on selection change
  select.addEventListener("change", (event) => {
    handleChangeValue(event.target.value, fieldName);
  });

  return select;
};

export const addingTimer = () => {
  const hourInput = createTimeSelect(
    Array.from({ length: 12 }, (_, i) => i + 1),
    "Hours",
    "hour"
  );
  const minInput = createTimeSelect(
    Array.from({ length: 60 }, (_, i) => i + 1),
    "Minutes",
    "min"
  );
  const secInput = createTimeSelect(
    Array.from({ length: 60 }, (_, i) => i + 1),
    "Seconds",
    "sec"
  );
  const zoneInput = createTimeSelect(["AM", "PM"], "Zone", "zone");

  setting_timer_box.append(
    hourInput,
    ":",
    minInput,
    ":",
    secInput,
    "-",
    zoneInput
  );
  setting_timer.append(setting_timer_box);
};
