/*jslint node:true, vars:true, bitwise:true, unparam:true */
/*jshint unused:true */

var LinuxInputListener = require('linux-input-device');

var SW_LID = 0x00,
    KEY_RETURN = 28,
    tagSequence = "";

var input = new LinuxInputListener('/dev/input/event2');

input.on('state', function(isDown, keyCode, kind) {
    //console.log('State is now:', isDown, 'for key', key, 'of kind', kind);

    if(isDown) {
        if(keyCode == KEY_RETURN) //Tag read ends with ENTER/RETURN key
            sendToCovisint();
        else
            addToTagSequence(keyCode);
    }
});

input.on('error', console.error);

//start by querying for the initial state.
//input.query('EV_SW', SW_LID);

function addToTagSequence(keyCode) {
    var keyChar = translateToChar(keyCode);
    console.log(keyCode + " mapped to " + keyChar);

    tagSequence += keyChar;
}

function sendToCovisint() {
    console.log(tagSequence + " sent to Covisint!");
    tagSequence = "";
}

function translateToChar(keyCode) {
    if(keyCode >=2 && keyCode <= 10)
        return (keyCode - 1).toString();
    else if(keyCode === 11)
        return "0";
}
