/*
    Stores the first string entered and never forgets it
*/
function storeStr(){
	var newStr = document.getElementById('str');

    //check to see if value is already stored
    chrome.storage.local.get('value', function(data){
		if(data.value == undefined){
            chrome.storage.local.set({'value': newStr.value});
            newStr.value = "String Stored";
        }
        else{
            newStr.value = "String has already been stored";
        }
        
	});
}

/*
    Prints the stored string to the text box
*/
function printStr(){

    chrome.storage.local.get('value', function(data){
		console.log('getting var');
        document.getElementById('str').value = data.value;
	});
}



document.addEventListener('DOMContentLoaded', foo);

//add listeners to the two buttons
function foo () {
	document.getElementById('printButton').onclick = printStr;
	document.getElementById('storeButton').onclick = storeStr;
}