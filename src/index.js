
// Character name validation
var nameInput = $('#characterName');
var nameDiv = document.getElementById('characterNameVal');
// var nameDiv = $('#characterNameVal');
var revealBtn = $('#revealBtn');

revealBtn.css('background-color', '#2F90BA');
revealBtn.disabled = true;

nameInput.on('input', function(e) {
    if (e.target.value) {    
        revealBtn.css('background-color', '#4EC3F7');
        revealBtn.disabled = false;
    } else {
        revealBtn.css('background-color', '#2F90BA');
        revealBtn.disabled = true;
    }

    nameDiv.innerHTML = e.target.value;
});

revealBtn.click(function(e) {
    if (!nameInput.val()) e.stopPropagation();
});


var headReveal = document.getElementById('headReveal');
var torsoReveal = document.getElementById('torsoReveal');
var legsReveal = document.getElementById('legsReveal');

var headRevealWrapper = document.getElementById('headRevealWrapper');
// var animData = {
//     container: headRevealWrapper,
//     renderer: 'svg',
//     autoplay: true,
//     loop: true,
//     animationData : jsonAnim
// };
// bodymovin.loadAnimation(animData);


// Create hidden canvas
var canvas = document.getElementById('shareable-character');
var ctx = canvas.getContext("2d");

var img1 = new Image();
img1.onload = function() {
    ctx.drawImage(img1, 0, 0);
    var canvasToImg = canvas.toDataURL();

    $.ajax({
        url: 'https://hooks.zapier.com/hooks/catch/2805412/l0grn0/',
        data: {
            image: canvasToImg,
            fileName: 'papa3'
        },
        method: 'POST'
    })
}
img1.src = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(headSVG);
// var drawHead = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(headSVG);
// ctx.drawImage(drawHead, 0, 0);
// ctx.drawImage(torsoReveal, 0, 0);
// ctx.drawImage(legsReveal, 0, 0);



// $('#shareable-character').on('click', function() {
//     var link = document.createElement('a');
//     link.download = 'corpse.png';
//     link.href = canvas.toDataURL()
//     link.click();
// })


var revealWrapper = document.getElementById('buildWrapper');
// var revealWrapper = document.getElementById('revealWrapper');

