const addBtn = document.getElementById('addBtn');
const namingBar = document.getElementById('namingBar');
const categoryBar = document.getElementById('categoryBar');
const moneyBar = document.getElementById('moneyBar');
const { appendFile, readFile} = require('fs');
const path = './Data/'

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
    saveRecordToFile("recordNaming",namingBar.value);
    saveRecordToFile("categoryNaming",categoryBar.value);
};


//this function will put suggestions to the suggestionContainer div
function giveSuggestionforRecordNaming(inputName){


}



//this function will put suggestions to the suggestionContainer div
function giveSuggestionforCategoryNaming(inputName){


}

function saveRecordToFile(nameOfTheFile,content){


 
    appendFile(path + `${nameOfTheFile}.txt`, `${content}\n`
    , function (err) {
        if (err) throw err;
        console.log('Updated!');
     });

}

//this function returns txt file data as an array
async function readFile(fileName){
    var textByLine;
    fs.readFile(path + `${fileName}.txt`, function(err, data){
        textByLine = data.split("\n");
    });
    return textByLine;
}
