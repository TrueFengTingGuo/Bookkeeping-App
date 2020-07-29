const electron = require('electron');
const path = require('path');
const fs = require('fs');

class Store {
  constructor(opts) {
    // Renderer process has to get `app` module via `remote`, whereas the main process can get it directly
    // app.getPath('userData') will return a string of the user's app data directory path.
    const userDataPath = (electron.app || electron.remote.app).getPath('userData'); //JS returns the left operand if it is truthy or the right operand otherwise.
    // We'll use the `configName` property to set the file name and path.join to bring it all together as a string
    this.path = path.join(userDataPath, opts.configName + '.json');
    
    this.data = parseDataFile(this.path, opts.defaults);
  }
  
  // This will just return the property on the `data` object
  get(key) {
    return this.data[key];
  }
  
  //this will reset the value inside
  set(key, val) {
    this.data[key] = val;
    try {
        // Also if we used an async API and our app was quit before the asynchronous write had a chance to complete,
        // we might lose that data. Note that in a real app, we would try/catch this.
        fs.writeFileSync(this.path, JSON.stringify(this.data));

    } catch (err) {
        console.log('Error writing Metadata.json:' + err.message)
    }
  }

  //if the variable where the info is stored is an array
  addToArray(key,val){
    this.data[key].push(val);
    try {

        fs.writeFileSync(this.path, JSON.stringify(this.data));

    } catch (err) {
        console.log('Error writing Metadata.json:' + err.message)
    }

  }
}

function parseDataFile(filePath, defaults) {
  // We'll try/catch it in case the file doesn't exist yet, which will be the case on the first application run.
  // `fs.readFileSync` will return a JSON string which we then parse into a Javascript object
  try {
    return JSON.parse(fs.readFileSync(filePath));
  } catch(error) {
    // if there was some kind of error, return the passed in defaults instead.
    return defaults;
  }
}

// expose the class
module.exports = Store;