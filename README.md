# Scriptable

This repository contains some of my [Scriptable](https://scriptable.app/) scripts.

## BlinkThemes

This module can be used to get objects containing terminal color themes from the
[Blink Themes GitHub repo](https://github.com/blinksh/themes/).

### Usage

The module contains two asynchronous functions: `.themes()` and
`.theme(theme_name: string)`.

`.themes()` lists all available themes in the Blink Themes repository, and `.theme()`
fetches the theme with the specified name.

**Security Note:** If you plan on using this script, please be aware that the themes
files in the Blink Themes repository are `.js` files and the `.theme()` method
works by downloading the content of the `${theme}.js` file, prepending a few
lines to the start that define a function that pretends to be Blink's
`t.prefs_.set()` function. This function then adds any values that are passed to
`t.prefs_.set()` to `module.exports`. This means that it is running all the
code in the `${theme}.js` file, so to be safe, you should make sure that you
trust the code in each theme file before you run it call `.theme()` on it, and
you should **never** modify this module to allow insecure downloads over http.

With the big scary warning out of the way, example usage is as follows:

```javascript
const BlinkThemes = importModule("BlinkThemes");

console.log(await BlinkThemes.themes());
console.log(await BlinkThemes.theme("Nord"));
```
