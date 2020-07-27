const addBtn = document.getElementById('addBtn');
const namingBar = document.getElementById('namingBar');
const categoryBar = document.getElementById('categoryBar');
const moneyBar = document.getElementById('moneyBar');
const suggestionContainer = document.getElementById('suggestionContainer');
const fs = require('fs');
const readline = require('readline');
const dataStoreSystem = require('./storeRecordData.js');




// First instantiate the class
const recordStoreSystem = new dataStoreSystem({
    // We'll call our data file 'user-preferences'
    configName: 'user-record',
    defaults: {
        record:[
            //some stored examples
                {"name":"restaurant", "categoryBar":"food"},
                {"name":"toy", "categoryBar":"toy"}
            ]
    }
  });

  
window.onload = ()=>{


    //adding quick searching for name of the record
    namingBar.addEventListener('input',()=>{
        giveSuggestionforRecordNaming(namingBar.value);

    });

    categoryBar.addEventListener('input',()=>{
        giveSuggestionforCategoryNaming(categoryBar.value);

    });

};


addBtn.onclick = e => {

    recordStoreSystem.addToArray('record',  {"name":namingBar.value, "categoryBar":categoryBar.value});

};


//this function will put suggestions to the suggestionContainer div
function giveSuggestionforRecordNaming(inputName){


    let recentRecord = recordStoreSystem.get('record');

    console.log(recentRecord);
    suggestionContainer.innerHTML = '';

    for (i = 0; i < recentRecord.length; i++) {
        suggestionContainer.innerHTML += `<div class="suggestionBlock"><button id="suggestionUseBtn">${recentRecord[i].name}</button></div>`;
      }


    


}

 

//this function will put suggestions to the suggestionContainer div
function giveSuggestionforCategoryNaming(inputName){


}



