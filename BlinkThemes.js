// Variables used by Scriptable.
// These must be at the very top of the file. Do not edit.
// icon-color: deep-purple; icon-glyph: magic;
// NOTE: This script was written by mtoohey31: https://github.com/mtoohey31/scriptable

const fm = FileManager.local();
if (
  !fm.isDirectory(
    fm.joinPath(fm.cacheDirectory(), "dk.simonbs.Scriptable/Cache.BlinkThemes")
  )
) {
  fm.createDirectory(
    fm.joinPath(fm.cacheDirectory(), "dk.simonbs.Scriptable/Cache.BlinkThemes")
  );
}
const cacheDir = fm.joinPath(
  fm.cacheDirectory(),
  "dk.simonbs.Scriptable/Cache.BlinkThemes"
);

module.exports.themes = async function () {
  let req = new Request(
    "https://api.github.com/repos/blinksh/themes/git/trees/master?recursive=1"
  );
  let res = await req.loadJSON();
  let themesSoFar = [];
  res.tree.forEach((path) => {
    if (path.path.slice(0, 7) == "themes/") {
      themesSoFar.push(path.path.slice(7, path.path.length - 3));
    }
  });
  return themesSoFar;
};

module.exports.theme = async function (themeName) {
  saveThemeString(addExports(await fetchThemeString(themeName)), themeName);
  try {
    let importedValues = importModule(fm.joinPath(cacheDir, `${themeName}.js`));
    try {
      return renameKeys(importedValues);
    } catch {
      throw "The specified theme does not contain the required keys.";
    }
  } catch {
    throw "The specified theme contains unsupported syntax.";
  }
};

async function fetchThemeString(themeName) {
  let req = new Request(
    `https://raw.githubusercontent.com/blinksh/themes/master/themes/${themeName}.js`
  );
  let res = req.loadString();
  if ((await res) === "404: Not Found") {
    throw "The specified theme was not found in the GitHub repository.";
  }
  return res;
}

function addExports(themeString) {
  return `const t = {
  prefs_: {
    set: exportValue,
  }
}

function exportValue (key, value) {
  module.exports[key.replace(/-/g, "_")] = value;
}

${themeString}`;
}

function saveThemeString(exportableThemeString, themeName) {
  fm.writeString(
    fm.joinPath(cacheDir, `${themeName}.js`),
    exportableThemeString
  );
}

function renameKeys(importedValues) {
  return {
    special: {
      background: importedValues.background_color,
      foreground: importedValues.foreground_color,
      cursor: importedValues.cursor_color,
    },
    colors: {
      color0: importedValues.color_palette_overrides[0],
      color1: importedValues.color_palette_overrides[1],
      color2: importedValues.color_palette_overrides[2],
      color3: importedValues.color_palette_overrides[3],
      color4: importedValues.color_palette_overrides[4],
      color5: importedValues.color_palette_overrides[5],
      color6: importedValues.color_palette_overrides[6],
      color7: importedValues.color_palette_overrides[7],
      color8: importedValues.color_palette_overrides[8],
      color9: importedValues.color_palette_overrides[9],
      color10: importedValues.color_palette_overrides[10],
      color11: importedValues.color_palette_overrides[11],
      color12: importedValues.color_palette_overrides[12],
      color13: importedValues.color_palette_overrides[13],
      color14: importedValues.color_palette_overrides[14],
      color15: importedValues.color_palette_overrides[15],
    },
  };
}

