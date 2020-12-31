// Variables used by Scriptable.
// These must be at the very top of the file. Do not edit.
// icon-color: deep-gray; icon-glyph: terminal;
// NOTE: This script was written by mtoohey31: https://github.com/mtoohey31/scriptable, and was adapted from https://github.com/evandcoleman/scriptable and https://gist.github.com/spencerwooo/7955aefc4ffa5bc8ae7c83d85d05e7a4.

const Cache = importModule("Cache");
const cache = new Cache("iFetchCache");
const BlinkThemes = importModule("BlinkThemes");

// const LIGHT_THEME = BlinkThemes.colorTheme(await BlinkThemes.hexTheme("Nord"));
// const DARK_THEME = BlinkThemes.colorTheme(
//   await BlinkThemes.hexTheme("Hardcore")
// );
// const THEME = BlinkThemes.dynamicTheme(LIGHT_THEME, DARK_THEME);
const THEME = BlinkThemes.colorTheme(await BlinkThemes.hexTheme("Nord")); // Change your theme here, or uncomment the lines above the create a dynamic theme that reacts to the Light/Dark mode state.

const CONFIG = {
  asciiArt: {
    text:
      "       .:'\n    _ :'_\n .'`_`-'_``.\n:________.-'\n:_______:\n:_______:\n :_______`-;\n  `._.-._.'", // Change this to switch the ASCII art, if you replace it with a traditionally quoted string ("string") be sure to replace newlines with \n and escape all double quotes (") in the string with escaped quotes (\"). If you prefer you can also use a string template (`string`) in which case you can avoid replacing the newlines, but then you will have to replace all grave accents (`) with their escaped versions (\`).
    colors: [
      THEME.colors.color2,
      THEME.colors.color3,
      THEME.colors.color1,
      THEME.colors.color5,
      THEME.colors.color4,
    ],
  },
  bars: [
    [
      THEME.colors.color0,
      THEME.colors.color1,
      THEME.colors.color2,
      THEME.colors.color3,
      THEME.colors.color4,
      THEME.colors.color5,
      THEME.colors.color6,
      THEME.colors.color7,
    ],
    [
      THEME.colors.color8,
      THEME.colors.color9,
      THEME.colors.color10,
      THEME.colors.color11,
      THEME.colors.color12,
      THEME.colors.color13,
      THEME.colors.color14,
      THEME.colors.color15,
    ],
  ],
  barColorWidth: 3,
  barCharacter: "█",
  defaultColor: THEME.special.foreground,
  background: THEME.special.background,
  defaultFont: new Font("Menlo-Regular", 10),
  infoSpacing: 10,
  defaultSpacing: 5,
  infoLines: [
    {
      content: [
        {
          text: "user", // Replace this with your username
          color: THEME.colors.color2,
          font: new Font("Menlo-Bold", 10),
        },
        {
          text: "@",
          color: THEME.special.foreground,
          font: new Font("Menlo-Bold", 10),
        },
        {
          text: fetchHostname(),
          color: THEME.colors.color2,
          font: new Font("Menlo-Bold", 10),
        },
      ],
      spacing: 0,
    },
    {
      content: [
        {
          text: "-".repeat(`user@${fetchHostname()}`.length), // Replace this with your username too so that the spacer lines up.
        },
      ],
    },
    {
      content: [
        {
          text: "💾 OS:",
          color: THEME.colors.color3,
          font: new Font("Menlo-Bold", 10),
        },
        {
          text: fetchOS(),
        },
      ],
    },
    {
      content: [
        {
          text: "💻 Host:",
          color: THEME.colors.color3,
          font: new Font("Menlo-Bold", 10),
        },
        {
          text: fetchHost(),
        },
      ],
    },
    {
      content: [
        {
          text: "🔋 Battery:",
          color: THEME.colors.color3,
          font: new Font("Menlo-Bold", 10),
        },
        {
          text: fetchBattery(10),
        },
      ],
    },
    {
      content: [
        {
          text: "📍 Location:",
          color: THEME.colors.color3,
          font: new Font("Menlo-Bold", 10),
        },
        {
          text: await fetchCity({ latitude: 0.0, longitude: 0.0 }), // Put your default longitude and latitude here.
        },
      ],
    },
    {
      content: [
        {
          text: "💡 Lamp:",
          font: new Font("Menlo-Bold", 10),
          color: THEME.colors.color3,
        },
        {
          text:
            (
              await fetchHomeAssistant(
                "states/switch.lamp",
                "", // Put your Home Assistant API Base URL here.
                "" // Put your Home Assistant access token here.
              )
            ).state === "on"
              ? "On"
              : "Off",
        },
      ],
    },
    {
      content: [
        {
          text: `${await fetchWeatherEmoji(
            {
              latitude: 0.0, // Put your default lon and lat here too.
              longitude: 0.0,
            },
            "" // Put your Open Weather API key here, you can get one for free here: https://home.openweathermap.org/api_keys
          )} Weather:`,
          color: THEME.colors.color3,
          font: new Font("Menlo-Bold", 10),
        },
        {
          text: await fetchWeatherText(
            {
              latitude: 0.0, // And put default lon and lat here too.
              longitude: 0.0,
            },
            "" // Put the Open Weather API key here too.
          ),
        },
      ],
    },
    {
      content: [
        {
          text: "🖥 Resolution:",
          color: THEME.colors.color3,
          font: new Font("Menlo-Bold", 10),
        },
        {
          text: fetchResolution(),
        },
      ],
    },
    {
      content: [
        {
          text: "🗓 Calendar:",
          color: THEME.colors.color3,
          font: new Font("Menlo-Bold", 10),
        },
        {
          text: await fetchEvents([""]), // Put the names of the calendars you want to show events from in this list.
        },
      ],
    },
  ],
};

const widget = createWidget();
Script.setWidget(widget);
Script.complete();

function createWidget() {
  const widget = new ListWidget();
  widget.backgroundColor = CONFIG.background;
  widget.setPadding(5, 5, 5, 5);

  const stack = widget.addStack();
  stack.layoutHorizontally();
  stack.topAlignContent();

  if (CONFIG.hasOwnProperty("asciiArt")) {
    const asciiStack = stack.addStack();
    asciiStack.layoutVertically();
    asciiStack.topAlignContent();

    if (!CONFIG.asciiArt.hasOwnProperty("colors")) {
      const asciiArt = asciiStack.addText(CONFIG.asciiArt.text);

      if (CONFIG.asciiArt.hasOwnProperty("color")) {
        asciiArt.textColor = CONFIG.asciiArt.color;
      } else {
        asciiArt.textColor = CONFIG.defaultColor;
      }

      if (asciiArt.hasOwnProperty("font")) {
        asciiArt.font = CONFIG.asciiArt.font;
      } else {
        asciiArt.font = CONFIG.defaultFont;
      }
    } else {
      asciiStack.spacing = 0;
      let splitLines = CONFIG.asciiArt.text.split("\n");
      let lineAssignments = assignLines(
        splitLines.length,
        CONFIG.asciiArt.colors
      );
      for (let x = 0; x < splitLines.length; x++) {
        let currentLine = asciiStack.addText(splitLines[x]);
        currentLine.textColor = lineAssignments[x];
        if (CONFIG.asciiArt.hasOwnProperty("font")) {
          currentLine.font = CONFIG.asciiArt.font;
        } else {
          currentLine.font = CONFIG.defaultFont;
        }
      }
    }

    stack.addSpacer(6);
  }

  const infoStack = stack.addStack();
  infoStack.layoutVertically();
  infoStack.topAlignContent();
  infoStack.spacing = CONFIG.infoSpacing;

  CONFIG.infoLines.forEach((line) => {
    let currentLine = infoStack.addStack();

    currentLine.layoutHorizontally();
    if (line.hasOwnProperty("spacing")) {
      currentLine.spacing = line.spacing;
    } else {
      currentLine.spacing = CONFIG.defaultSpacing;
    }
    line.content.forEach((item) => {
      let currentItem = currentLine.addText(item.text);
      currentItem.lineLimit = 1;

      if (item.hasOwnProperty("color")) {
        currentItem.textColor = item.color;
      } else {
        currentItem.textColor = CONFIG.defaultColor;
      }

      if (item.hasOwnProperty("font")) {
        currentItem.font = item.font;
      } else {
        currentItem.font = CONFIG.defaultFont;
      }
    });
  });

  if (CONFIG.hasOwnProperty("bars")) {
    const barStack = infoStack.addStack();
    barStack.layoutVertically();
    barStack.topAlignContent();

    CONFIG.bars.forEach((bar) => {
      let currentBar = barStack.addStack();
      currentBar.layoutHorizontally();
      currentBar.topAlignContent();
      currentBar.spacing = 0;

      bar.forEach((color) => {
        let currentColor = currentBar.addText(
          CONFIG.barCharacter.repeat(CONFIG.barColorWidth)
        );
        currentColor.textColor = color;

        if (CONFIG.hasOwnProperty("barFont")) {
          currentColor.font = CONFIG.barFont;
        } else {
          currentColor.font = CONFIG.defaultFont;
        }
      });
    });
  }

  widget.addSpacer();

  return widget;
}

function assignLines(numLines, colors) {
  let linesSoFar = [];

  colors.reverse();

  while (colors.length > 0) {
    let colorLines = Math.ceil(numLines / colors.length);
    numLines -= colorLines;

    for (let x = 0; x < colorLines; x++) {
      linesSoFar.push(colors[colors.length - 1]);
    }
    colors.pop();
  }
  return linesSoFar;
}

/*
 * Synchronous Functions
 */

function fetchHostname() {
  let deviceName = Device.name().toLowerCase();
  let dashedName = deviceName.replace(" ", "-");
  let regex = /[\w\d-.]/g;
  let filteredName = (dashedName.match(regex) || []).join("");
  return filteredName;
}

function fetchOS() {
  return `${Device.systemName()} ${Device.systemVersion()}`;
}

function fetchHost() {
  return Device.model();
}

function fetchBattery(length) {
  const batteryLevel = Device.batteryLevel();
  if (length === undefined) {
    return `${Math.round(batteryLevel * 100)}%`;
  } else {
    const juice = "#".repeat(Math.floor(batteryLevel * length));
    const used = ".".repeat(length - juice.length);
    const batteryAscii = `[${juice}${used}] ${Math.round(batteryLevel * 100)}%`;
    return batteryAscii;
  }
}

function fetchResolution() {
  const deviceResolution = Device.screenResolution();
  if (Device.isInPortrait() || Device.isInPortraitUpsideDown()) {
    return `${deviceResolution.width}x${deviceResolution.height}`;
  } else {
    return `${deviceResolution.height}x${deviceResolution.width}`;
  }
}

/*
 * Asynchronous Functions
 */

async function fetchEvents(calendarNames) {
  let calendars = [];
  for (let c = 0; c < calendarNames.length; c++) {
    let currentCal = await Calendar.forEventsByTitle(calendarNames[c]);
    calendars.push(currentCal);
  }

  let events = await CalendarEvent.today(calendars);

  let df = new DateFormatter();
  df.useShortTimeStyle();
  eventNames = [];
  events.forEach((event) => {
    eventNames.push(
      `${event.title}: ${df.string(event.startDate)} - ${df.string(
        event.endDate
      )}`
    );
  });

  return eventNames.join(", ");
}

async function fetchCity(defaultLocation) {
  location = await fetchLocation(defaultLocation);
  let geocode = await Location.reverseGeocode(
    location.latitude,
    location.longitude
  );
  return geocode[0].locality;
}

async function fetchLocation(defaultLocation) {
  let location = await cache.read("location");
  if (!location) {
    try {
      Location.setAccuracyToThreeKilometers();
      location = await Location.current();
    } catch (error) {
      location = await cache.read("location");
    }
  }
  if (!location) {
    location = defaultLocation;
  }
  return location;
}

async function fetchWeatherData(defaultLocation, weatherApiKey) {
  let location = await cache.read("location");
  if (!location) {
    try {
      Location.setAccuracyToThreeKilometers();
      location = await Location.current();
    } catch (error) {
      location = await cache.read("location");
    }
  }
  if (!location || typeof location === "undefined") {
    location = defaultLocation;
  }
  const address = await Location.reverseGeocode(
    location.latitude,
    location.longitude
  );
  const url =
    "https://api.openweathermap.org/data/2.5/onecall?lat=" +
    location.latitude +
    "&lon=" +
    location.longitude +
    "&exclude=minutely,hourly,alerts&units=metric&lang=en&appid=" +
    weatherApiKey;
  return await fetchJson(`weather_${address[0].locality}`, url);
}

async function fetchWeatherComplete(defaultLocation, weatherApiKey) {
  const data = await fetchWeatherData(defaultLocation, weatherApiKey);

  return `${getWeatherEmoji(
    data.current.weather[0].id,
    new Date().getTime() / 1000 >= data.current.sunset
  )} ${data.current.weather[0].main}, ${Math.round(
    data.current.temp
  )}°, ${Math.round(data.current.wind_speed)} km/h`;
}

async function fetchWeatherText(defaultLocation, weatherApiKey) {
  const data = await fetchWeatherData(defaultLocation, weatherApiKey);

  return `${data.current.weather[0].main}, ${Math.round(
    data.current.temp
  )}°, ${Math.round(data.current.wind_speed)} km/h`;
}

async function fetchWeatherEmoji(defaultLocation, weatherApiKey) {
  const data = await fetchWeatherData(defaultLocation, weatherApiKey);

  return getWeatherEmoji(
    data.current.weather[0].id,
    new Date().getTime() / 1000 >= data.current.sunset
  );
}

async function fetchPlex(tautulliApiBase, tautulliApiKey) {
  const url = `${tautulliApiBase}/api/v2?apikey=${tautulliApiKey}&cmd=get_activity`;
  const data = await fetchJson(`plex`, url);

  return `Streams: ${data.response.data.stream_count}, Transcodes: ${data.response.data.stream_count_transcode}`;
}

async function fetchHomeAssistant(
  path,
  homeAssistantApiBase,
  homeAssistantApiKey
) {
  return fetchJson(path, `${homeAssistantApiBase}/api/${path}`, {
    Authorization: `Bearer ${homeAssistantApiKey}`,
    "Content-Type": "application/json",
  });
}

async function fetchJson(key, url, headers) {
  const cached = await cache.read(key, 5);
  if (cached) {
    return cached;
  }

  try {
    console.log(`Fetching url: ${url}`);
    const req = new Request(url);
    req.headers = headers;
    const resp = await req.loadJSON();
    cache.write(key, resp);
    return resp;
  } catch (error) {
    try {
      return cache.read(key, 5);
    } catch (error) {
      console.log(`Couldn't fetch ${url}`);
    }
  }
}

/*
 * Conversion Functions
 */

function getWeatherEmoji(code, isNight) {
  if ((code >= 200 && code < 300) || code == 960 || code == 961) {
    return "⛈";
  } else if ((code >= 300 && code < 600) || code == 701) {
    return "🌧";
  } else if (code >= 600 && code < 700) {
    return "❄️";
  } else if (code == 711) {
    return "🔥";
  } else if (code == 800) {
    return isNight ? "🌕" : "☀️";
  } else if (code == 801) {
    return isNight ? "☁️" : "🌤";
  } else if (code == 802) {
    return isNight ? "☁️" : "⛅️";
  } else if (code == 803) {
    return isNight ? "☁️" : "🌥";
  } else if (code == 804) {
    return "☁️";
  } else if (code == 900 || code == 962 || code == 781) {
    return "🌪";
  } else if (code >= 700 && code < 800) {
    return "🌫";
  } else if (code == 903) {
    return "🥶";
  } else if (code == 904) {
    return "🥵";
  } else if (code == 905 || code == 957) {
    return "💨";
  } else if (code == 906 || code == 958 || code == 959) {
    return "🧊";
  } else {
    return "❓";
  }
}

