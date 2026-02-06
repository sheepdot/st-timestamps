// The main script for the extension
// The following are examples of some basic extension functionality

//You'll likely need to import extension_settings, getContext, and loadExtensionSettings from extensions.js
import { extension_settings, getContext, loadExtensionSettings } from "../../../extensions.js";

//You'll likely need to import some other functions from the main script
import { saveSettingsDebounced } from "../../../../script.js";

// Keep track of where your extension is located, name should match repo name
const extensionName = "st-timestamps";
const extensionFolderPath = `scripts/extensions/third-party/${extensionName}`;
const extensionSettings = extension_settings[extensionName];
const defaultSettings = {};


 
// Loads the extension settings if they exist, otherwise initializes them to the defaults.
async function loadSettings() {
  //Create the settings if they don't exist
  extension_settings[extensionName] = extension_settings[extensionName] || {};
  if (Object.keys(extension_settings[extensionName]).length === 0) {
    Object.assign(extension_settings[extensionName], defaultSettings);
  }

  // Updating settings in the UI
  $("#example_setting").prop("checked", extension_settings[extensionName].example_setting).trigger("input");
}

// This function is called when the extension settings are changed in the UI
function onExampleInput(event) {
  const value = Boolean($(event.target).prop("checked"));
  extension_settings[extensionName].example_setting = value;
  saveSettingsDebounced();
}

// This function is called when the button is clicked
function onButtonClick() {
  // You can do whatever you want here
  // Let's make a popup appear with the checked setting
  toastr.info(
    `The checkbox is ${extension_settings[extensionName].example_setting ? "checked" : "not checked"}`,
    "A popup appeared because you clicked the button!"
  );
}

// This function is called when the extension is loaded
jQuery(async () => {
  // This is an example of loading HTML from a file
  const settingsHtml = await $.get(`${extensionFolderPath}/example.html`);

  // Append settingsHtml to extensions_settings
  // extension_settings and extensions_settings2 are the left and right columns of the settings menu
  // Left should be extensions that deal with system functions and right should be visual/UI related 
  $("#extensions_settings").append(settingsHtml);

  // These are examples of listening for events
  $("#my_button").on("click", onButtonClick);
  $("#example_setting").on("input", onExampleInput);

  // Load settings when starting things up (if you have any)
  loadSettings();
  eventSource.on(event_types.GENERATION_STARTED, (type, stuff, dry) => on_chat_event('before_message', {'type': type, 'dry': dry}))

});

globalThis.timestamp_interceptor = async function(chat, contextSize, abort, type) {
  //Iterate through chat messages and add timestamps
    for (let i = 0; i < chat.length; i++) {
        //if there is an existing timestamp, skip. We look for the class .timestamp_display in the message element, so we can add a timestamp if there isn't one, but we don't want to add multiple timestamps if there already is one. This is especially important because this function can be called multiple times for the same messages, and we don't want to keep adding timestamps every time.
        if (chat[i].element && chat[i].element.querySelector(".timestamp_display")) {
          continue; // Skip if timestamp already exists
        }
        // Get the message and its send date, then format the date as a timestamp string. You can customize the formatting as needed. Here I'm just using toLocaleString for simplicity.
        const message = chat[i];  
        const date = new Date(message.send_date);
        const timestamp = date.toLocaleString(); // You can customize the format as needed
        // Create a new div element to display the timestamp and add the timestamp_display class for styling
        const timestampDiv = document.createElement("div");
        timestampDiv.classList.add("timestamp_display");
        timestampDiv.textContent = `Sent at: ${timestamp}`;
        if (chat[i].element) {
          chat[i].element.appendChild(timestampDiv);
        }
      }
      
}

// Event handling
async function on_chat_event(event=null, data=null) {
    // When the chat is updated, check if the timestamp should be triggered
    debug("Chat updated:", event, data)

    const context = getContext();
    let index = data

    switch (event) {
        case 'user_message':
//            if (!chat_enabled()) break;  // if chat is disabled, do nothing
//            if (!get_settings('auto_summarize')) break;  // if auto-summarize is disabled, do nothing

            // add timestamps to user messages if the setting is enabled
            if (get_settings('include_user_messages')) {
                debug("New user message detected, summarizing")
                await auto_summarize_chat();  // auto-summarize the chat (checks for exclusion criteria and whatnot)
            }

            break;
      }
  }