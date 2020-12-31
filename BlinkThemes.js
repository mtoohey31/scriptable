// Variables used by Scriptable.
// These must be at the very top of the file. Do not edit.
// icon-color: cyan; icon-glyph: palette;
// NOTE: This script was written by mtoohey31: https://github.com/mtoohey31/scriptable

const fm = FileManager.iCloud();
if (!fm.isDirectory(fm.joinPath(fm.documentsDirectory(), "BlinkThemesCache"))) {
  fm.createDirectory(fm.joinPath(fm.documentsDirectory(), "BlinkThemesCache"));
}
const cacheDir = fm.joinPath(fm.documentsDirectory(), "BlinkThemesCache");

module.exports.listThemes = async function () {
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

module.exports.hexTheme = async function (themeName) {
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

module.exports.colorTheme = function (hexTheme) {
  try {
    return {
      special: {
        background: new Color(hexTheme.special.background),
        foreground: new Color(hexTheme.special.foreground),
        cursor: new Color(hexTheme.special.cursor),
      },
      colors: {
        color0: new Color(hexTheme.colors.color0),
        color1: new Color(hexTheme.colors.color1),
        color2: new Color(hexTheme.colors.color2),
        color3: new Color(hexTheme.colors.color3),
        color4: new Color(hexTheme.colors.color4),
        color5: new Color(hexTheme.colors.color5),
        color6: new Color(hexTheme.colors.color6),
        color7: new Color(hexTheme.colors.color7),
        color8: new Color(hexTheme.colors.color8),
        color9: new Color(hexTheme.colors.color9),
        color10: new Color(hexTheme.colors.color10),
        color11: new Color(hexTheme.colors.color11),
        color12: new Color(hexTheme.colors.color12),
        color13: new Color(hexTheme.colors.color13),
        color14: new Color(hexTheme.colors.color14),
        color15: new Color(hexTheme.colors.color15),
      },
    };
  } catch {
    throw "The given hexTheme argument contains unsupported syntax.";
  }
};

module.exports.dynamicTheme = function (colorThemeLight, colorThemeDark) {
  try {
    return {
      special: {
        background: Color.dynamic(
          colorThemeLight.special.background,
          colorThemeDark.special.background
        ),
        foreground: Color.dynamic(
          colorThemeLight.special.foreground,
          colorThemeDark.special.foreground
        ),
        cursor: Color.dynamic(
          colorThemeLight.special.cursor,
          colorThemeDark.special.cursor
        ),
      },
      colors: {
        color0: Color.dynamic(
          colorThemeLight.colors.color0,
          colorThemeDark.colors.color0
        ),
        color1: Color.dynamic(
          colorThemeLight.colors.color1,
          colorThemeDark.colors.color1
        ),
        color2: Color.dynamic(
          colorThemeLight.colors.color2,
          colorThemeDark.colors.color2
        ),
        color3: Color.dynamic(
          colorThemeLight.colors.color3,
          colorThemeDark.colors.color3
        ),
        color4: Color.dynamic(
          colorThemeLight.colors.color4,
          colorThemeDark.colors.color4
        ),
        color5: Color.dynamic(
          colorThemeLight.colors.color5,
          colorThemeDark.colors.color5
        ),
        color6: Color.dynamic(
          colorThemeLight.colors.color6,
          colorThemeDark.colors.color6
        ),
        color7: Color.dynamic(
          colorThemeLight.colors.color7,
          colorThemeDark.colors.color7
        ),
        color8: Color.dynamic(
          colorThemeLight.colors.color8,
          colorThemeDark.colors.color8
        ),
        color9: Color.dynamic(
          colorThemeLight.colors.color9,
          colorThemeDark.colors.color9
        ),
        color10: Color.dynamic(
          colorThemeLight.colors.color10,
          colorThemeDark.colors.color10
        ),
        color11: Color.dynamic(
          colorThemeLight.colors.color11,
          colorThemeDark.colors.color11
        ),
        color12: Color.dynamic(
          colorThemeLight.colors.color12,
          colorThemeDark.colors.color12
        ),
        color13: Color.dynamic(
          colorThemeLight.colors.color13,
          colorThemeDark.colors.color13
        ),
        color14: Color.dynamic(
          colorThemeLight.colors.color14,
          colorThemeDark.colors.color14
        ),
        color15: Color.dynamic(
          colorThemeLight.colors.color15,
          colorThemeDark.colors.color15
        ),
      },
    };
  } catch {
    throw "One of the given arguments contains unsupported syntax.";
  }
};

