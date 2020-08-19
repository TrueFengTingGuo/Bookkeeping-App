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

  //find the sepcified record to delete
  findAndDelete(key,arrayOfInfoToLook){

    let arrayOfData = this.data[key];

    
    //find difference
    for (let indexOfSingleData = 0; indexOfSingleData < arrayOfData.length; indexOfSingleData++) {

     
      //recursiveToFindDiff will the difference and return true if there is a difference
      if(!recursiveToFindDiff(Object.values(this.data[key][indexOfSingleData]),arrayOfInfoToLook)){
       
        //console.log("data:  " + this.data[key][indexOfSingleData]);
        //console.log("arrayOfInfoToLook:" + arrayOfInfoToLook);
        //console.log("indexOfSingleData:" + indexOfSingleData);
        //delete the record form the data
        if (indexOfSingleData > -1) {
          this.data[key].splice(indexOfSingleData, 1);
          console.log("deleted successfully");
          break;
        }
      }
    }


    //save data
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


//this function will search for difference between two provided arrays
//if all info that "arrayOfInfoToLook" is provided are correct and in order, then it returns false
function recursiveToFindDiff(recordToLook, arrayOfInfoToLook){

  if((recordToLook.length === 0 && arrayOfInfoToLook.length !== 0)|| (arrayOfInfoToLook === undefined || recordToLook === undefined)){

    //return true if there is difference between the data and the info is provided
    return true;
  }
  else if(arrayOfInfoToLook.length === 0 ){

    //retur false if there is no difference between two 
    return false;
  }
  

  if(recordToLook[0] == arrayOfInfoToLook[0]){

    //take out the first element of each array cause the comparsion is over
    recordToLook.shift();
    arrayOfInfoToLook.shift();
    return recursiveToFindDiff(recordToLook,arrayOfInfoToLook);

  }
  else {

    //since the record doesnt have it, go to next element see if there is a same one
    recordToLook.shift()
    return recursiveToFindDiff(recordToLook,arrayOfInfoToLook);
  }

  console.log("Error");
  return true;
}






// expose the class
module.exports = Store;