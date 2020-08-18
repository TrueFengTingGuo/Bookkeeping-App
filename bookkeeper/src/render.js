//these are the var which is always const
const name = "name";
const category = "category";

const addBtn = document.getElementById('addBtn');
const namingBar = document.getElementById('namingBar');
const categoryBar = document.getElementById('categoryBar');
const DateBar = document.getElementById('DateBar');
const moneyBar = document.getElementById('moneyBar');
const suggestionContainer = document.getElementById('suggestionContainer');
const recordContainer = document.getElementById('recordContainer');
const totalCostDispplay = document.getElementById('totalCost');
const namingBars = document.getElementById('namingBars');
const categoryBars = document.getElementById('categoryBars');

const fs = require('fs');
const readline = require('readline');
const stringSimilarity = require('string-similarity');
const dataStoreSystem = require('./storeRecordData.js');



// First instantiate the class
const recordStoreSystem = new dataStoreSystem({
    // We'll call our data file 'user-preferences'
    configName: 'user-record',
    defaults: {
        record:[
            //some stored examples
                {"name":"restaurant", "date": "1","category":"food", "money":"0"},
            ]
    }
  });

  
window.onload = ()=>{

    displayRecord();
    //adding quick searching for name of the record
    namingBar.addEventListener('input',()=>{
        giveSuggestionforNaming(namingBar.value,name);

    });

    categoryBar.addEventListener('input',()=>{
        giveSuggestionforNaming(categoryBar.value,category);

    });

};

//when add button is pressed
addBtn.onclick = e => {

    if(namingBar.value !== '' && DateBar.value !== '' && categoryBar !== '' && moneyBar.value!== ''){
        recordStoreSystem.addToArray('record',  {"name":namingBar.value, "date":DateBar.value, "category":categoryBar.value, "money":moneyBar.value});
        displayRecord();
        console.log("added successfully");
    }
};


//this function will put suggestions to the suggestionContainer div
function giveSuggestionforNaming(inputName,sectionToLook){

    let recentRecord = recordStoreSystem.get('record');
    let sortable = [];


    //this will save all crosponding textfields
    let sectionDic = {

        name: namingBars,
        category: categoryBars
        
    };


    //empty the html eveytime use is typing
    sectionDic[sectionToLook].innerHTML = '';

    //sorting record with order (string Similarity)
    for (i = 0; i < recentRecord.length; i++) {


        let similarity = stringSimilarity.compareTwoStrings(inputName, recentRecord[i][sectionToLook]); 
        
        if(similarity >= 0.3){
            
            sortable.push([recentRecord[i][sectionToLook],similarity]);
        }
        
    }

    sortable.sort(function(a, b) {
        return a[1] - b[1];
    });


   uniqueArray = multiDimensionalUnique(sortable);

   //add all possible suggestion to the field
    for (i = 0; i < uniqueArray.length; i++) {

        sectionDic[sectionToLook].innerHTML += `<option value=" ${uniqueArray[i][0]} ">`;
    }
}

//display all record in the window
function displayRecord(){

    let recentRecord = recordStoreSystem.get('record');
    let sortable = [];
    let totalCost = 0;

    recordContainer.innerHTML = '';

    //sorting record with order (string Similarity)
    for (i = 0; i < recentRecord.length; i++) {

            //calculate the total money
            totalCost += Number(recentRecord[i].money);

            //sort the record by date
            sortable.push([recentRecord[i].name,recentRecord[i].date,recentRecord[i].category,recentRecord[i].money]);
        
    }

    //comparsion function for date
    sortable.sort(function(a, b) {

        //getting date from two record
        let d1 = new Date(a[1]);
        let d2 = new Date(b[1]);
        if(d1 < d2){
            return 1;
        }
        if(d1 > d2){
            return -1;
        }
        if(d1 = d2){
            return 0;
        }
    });

    //put all record in the container (in order)
    for (i = 0; i < sortable.length; i++) {

        recordContainer.innerHTML += 
            `<div class="single_record">
                <h1 class="record_description" ">${sortable[i][0]}</h1>
                <h1 class="record_date" ">${sortable[i][1]}</h1>
                <h1 class="record_amount" ">$ ${sortable[i][3]}</h1>
                <button onClick="deleteRecord('${sortable[i][0]}','${sortable[i][1]}','${sortable[i][3]}')"> <span>More</span> </button>
                
            </div>`;
    }

    totalCostDispplay.innerHTML = `Total Cost: ${totalCost}`;
}


function deleteRecord(description,date,amount){
    let arrayOfInfo = [];

    //collect info to an array
    arrayOfInfo.push(description);
    arrayOfInfo.push(date);
    arrayOfInfo.push(amount);

    recordStoreSystem.findAndDelete('record',arrayOfInfo);

    displayRecord();

}

//finding duplicates from a multidimensions array
function multiDimensionalUnique(inputArray) {

    var uniques = [];
    var Found = {};
    for(var i = 0, l = inputArray.length; i < l; i++) {

        //all input are modified into string
        var stringified = JSON.stringify(inputArray[i]);
        //console.log(stringified);
        if(Found[stringified]) { 
            continue;
        }

        //this function will first store first found item into an array
        uniques.push(inputArray[i]);
        Found[stringified] = true;
    }

    //console.log(uniques);
    return uniques;
}
