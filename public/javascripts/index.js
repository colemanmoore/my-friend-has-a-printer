document.getElementById('file-to-print').addEventListener('change', function(e) {
    var filename = e.target.files[0].name;
    var feedbackElem = document.getElementById('file-feedback');
    feedbackElem.appendChild(document.createTextNode(filename));
});

document.getElementById('passcode').addEventListener('blur', validateInputs);

document.getElementById('file-to-print').addEventListener('blur', validateInputs);

function validateInputs() {
    var file = document.getElementById('file-to-print');
    var passcode = document.getElementById('passcode');

    if (
        file && file.files && file.files[0] &&
        passcode.value
    ) {
        document.getElementById('send-to-printer-button').removeAttribute('disabled');

    } else {
        document.getElementById('send-to-printer-button').setAttribute('disabled', 'true');
    }
}
