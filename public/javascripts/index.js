document.getElementById('myFile').addEventListener('change', function(e) {
    var filename = e.target.files[0].name;
    var feedbackElem = document.getElementById('file-feedback');
    feedbackElem.appendChild(document.createTextNode(filename));
});

