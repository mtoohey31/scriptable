// Variables used by Scriptable.
// These must be at the very top of the file. Do not edit.
// icon-color: light-gray; icon-glyph: sitemap;
module.exports.resolveObject = async function (object) {
  let promisePaths = new Array();
  getPromisePaths(object, promisePaths, []);

  console.log(promisePaths);

  let promises = returnPathValues(object, promisePaths);

  console.log(promises);

  let resolutions = await Promise.all(promises);
  console.log(resolutions);
  reassignPathValues(object, promisePaths, resolutions);
};

function getPromisePaths(object, pathArray, currentPath) {
  Object.keys(object).forEach((key) => {
    if (typeof object[key].then === "function") {
      pathArray.push(currentPath.concat([key]));
    } else if (typeof object[key] === "object") {
      getPromisePaths(object[key], pathArray, currentPath.concat([key]));
    }
  });
}

function returnPathValues(object, pathArray) {
  let valuesSoFar = new Array();
  pathArray.forEach((path) => {
    valuesSoFar.push(returnPathValue(object, path));
  });
  return valuesSoFar;
}

function returnPathValue(object, path) {
  if (path.length === 0) {
    return object;
  } else {
    return returnPathValue(object[path[0]], path.slice(1));
  }
}

function reassignPathValues(object, pathArray, values) {
  if (pathArray.length !== values.length) {
    throw "pathArray and values must be of equal length";
  }
  for (let x = 0; x < pathArray.length; x++) {
    reassignPathValue(object, pathArray[x], values[x]);
  }
}

function reassignPathValue(object, path, value) {
  if (path.length - 1 === 0) {
    object[path[0]] = value;
  } else {
    let pathValue = returnPathValue(object, path.slice(0, path.length - 1));
    pathValue[path[path.length - 1]] = value;
    reassignPathValue(object, path.slice(0, path.length - 1), pathValue);
  }
}

