window.onload = function() {
    var allPassFields = document.getElementsByTagName('input');
    var len = allPassFields.length;
    var input = null;
    
    if (len > 0) {
        //turn them all red
        for (var i = 0; i < len; i++) {
            input = allPassFields[i];
            if (input.getAttribute('type') == 'password') { 
                console.log("found");
                input.style.backgroundColor = 'red';
            }
        }//for
    }
};
