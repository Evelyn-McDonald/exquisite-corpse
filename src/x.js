// -----------------------------------------
// Character name validation
var nameInput = $('#characterName');
// var nameDiv = $('#characterNameVal');
var nameDiv = $('#characterNameVal2');
var nameError = $('#nameError');
var name = nameInput.val();

nameDiv.html(name);

var revealBtn = $('#revealBtn');
var submitBtn = $('#corpseSave');

var spotlightAnimWrapper = document.getElementById('spotlight');
var spotlight = {
    container: spotlightAnimWrapper,
    renderer: 'svg',
    autoplay: true,
    loop: false,
    animationData : spotlightAnim
};

revealBtn.css('background-color', '#2F90BA');
revealBtn.disabled = true;
if (window.innerWidth > 480) {
    revealBtn.attr('href', null);
}

nameInput.on('input', function(e) {
    name = e.target.value;

    if (name) {
        revealBtn.css('background-color', '#4EC3F7');
        revealBtn.disabled = false;
        nameInput.css('border', 'none');
        nameInput.css('background', '#ffffff');
        nameError.hide();
    } else {
        revealBtn.css('background-color', '#2F90BA');
        revealBtn.disabled = true;
    }

    // var formattedName = ''
    // name.split('').map(function(c, i) {
    //     if (!(i % 3)) formattedName += '<span class="text-span-2">'+c+'</span>';
    //     else formattedName += c
    // })
    nameDiv.html(name);
});

$('#changeBtn').click(function() {
    nameInput.val('');
});

var msgEnum = 0;

revealBtn.click(function(e) {
    // -----------------------------------------
    // dynamic completion message
    var msgs = ['Excellent', 'Nice Work', 'Perfection', 'Crafty', 'Terrifying'];
    msgEnum = (msgEnum + 1) % msgs.length;
    $('#completionMessage').html(msgs[msgEnum]);

    if (!nameInput.val()) {
        e.stopPropagation();
        nameInput.css('border', '2px solid #FF8366');
        nameInput.css('background', '#ffff url(https://uploads-ssl.webflow.com/5bba10d5002d8a181406de36/5bd8fd5c557fae3a134af68a_warning-symbol.svg) no-repeat 95% 50%');
        nameInput.css('background-size', '30px');
        nameError.show();
    } else {
        nameInput.css('border', 'none');
        nameInput.css('background', '#ffffff');
        nameError.hide();

        spotlightAnimWrapper.innerHTML = '';
        bodymovin.loadAnimation(spotlight);
    }
});


// -----------------------------------------
// build auto sizing
var build = $('#buildWrapper');

$(window).on("resize", setHeight).resize();

function setHeight() {
    var width = build.width();
    // if (!width) width = window.innerWidth - 40;
    if (!width) width = 280;

    if (width < 500) {
        build.height(width);
    } else {
        build.height(width * 0.79);
    }
}


// -----------------------------------------
// build

var CURRENT_HEAD = 1;
var CURRENT_TORSO = 1;
var CURRENT_LEGS = 1;

var TOTAL_HEAD = 20;
var TOTAL_TORSO = 20;
var TOTAL_LEGS = 20;

var headBuildWrapper = document.getElementById('headBuildWrapper');
var torsoBuild = document.getElementById('torsoBuild');
var legsBuild = document.getElementById('legsBuild');

updateCorpse(eval('torso_'+CURRENT_TORSO), torsoBuild);
updateCorpse(eval('legs_'+CURRENT_LEGS), legsBuild);
updateHead();


// arrow interaction
$('.arrow').each(function() {
    $(this).on('click', function() {
        var id = $(this).attr('id');
        var direction = id.split('-')[1];
        var component = id.split('-')[0];

        if (direction == 'right') {
            var begin = '100%';
            var end = '-100%';
        } else {
            var begin = '-100%';
            var end = '100%';
        }

        if (component == 'head') slideHead(begin, end, direction);
        if (component == 'torso') slideTorso(begin, end, direction);
        if (component == 'legs') slideLegs(begin, end, direction);

        updateShadow();
    })
});

// swipe interaction
$('#headSelector').swipe( {
    swipeRight:function() { slideHead('100%', '-100%', 'right') },
    swipeLeft:function() { slideHead('-100%', '100%', 'left') },
    threshold: 80,
});

$('#torsoSelector').swipe( {
    swipeRight:function() { slideTorso('100%', '-100%', 'right') },
    swipeLeft:function() { slideTorso('-100%', '100%', 'left') },
    threshold: 80,
});

$('#legsSelector').swipe( {
    swipeRight:function() { slideLegs('100%', '-100%', 'right') },
    swipeLeft:function() { slideLegs('-100%', '100%', 'left')},
    threshold: 80,
});


// -----------------------------------------
// Update hidden canvas

var canvas = document.getElementById('shareable-character');
var ctx = canvas.getContext('2d');

var shadowCanvas = document.getElementById('reveal-character-shadow');
var ctx2 = shadowCanvas.getContext('2d');

var layerCount = 0;

var bg = new Image();
var drawLogo = new Image()
var legs = new Image();
var torso = new Image();
var head = new Image();
var legsShadow = new Image();
var torsoShadow = new Image();
var headShadow = new Image();

bg.onload = function() { drawCanvasLayers() }
drawLogo.onload = function() { drawCanvasLayers() }
legs.onload = function() { drawCanvasLayers() }
torso.onload = function() { drawCanvasLayers() }
head.onload = function() { drawCanvasLayers() }
legsShadow.onload = function() { drawCanvasLayers(); drawShadows(); }
torsoShadow.onload = function() { drawCanvasLayers(); drawShadows(); }
headShadow.onload = function() { drawCanvasLayers(); drawShadows(); }

updateShadow();

function drawShadows() {
    ctx2.save();
    ctx2.beginPath();
    ctx2.arc(shadowCanvas.width/2, shadowCanvas.height/2, 380, 0, Math.PI * 2, false);
    ctx2.closePath();

    ctx2.clip();
        ctx2.fillStyle = 'white';
        ctx2.beginPath();
        ctx2.arc(shadowCanvas.width/2, shadowCanvas.height/2, 376, 0, Math.PI * 2, false);
        ctx2.closePath();
        ctx2.fill();

        ctx2.globalCompositeOperation = 'destination-out';

        ctx2.drawImage(legsShadow, 120, 100, 810, 810);
        ctx2.drawImage(torsoShadow, 120, 100, 810, 810);
        ctx2.drawImage(headShadow, 120, 100, 810, 810)
    ctx2.restore();
}

function updateShadow() {
    bg.src = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(exportBg);
    drawLogo.src = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(logo);

    legsShadow.src = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(eval('legs_shadow_'+CURRENT_LEGS));
    torsoShadow.src = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(eval('torso_shadow_'+CURRENT_TORSO));
    headShadow.src = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(eval('head_shadow_'+CURRENT_HEAD));
}

submitBtn.click(function(e) {
    legs.src = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(eval('legs_'+CURRENT_LEGS));
    torso.src = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(eval('torso_'+CURRENT_TORSO));
    head.src = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(eval('head_'+CURRENT_HEAD));

    updateShadow();
});


// function drawCanvasLayers() {
//     layerCount++;
//     ctx.clearRect(0, 0, canvas.width, canvas.height);

//     if (layerCount >= 8) {
//         ctx.imageSmoothingEnabled = false;
//         ctx.save();
//         ctx.beginPath();
//         ctx.arc(200, 213, 160, 0, Math.PI * 2, false);
//         ctx.closePath();

//         ctx.clip();
//             ctx.fillStyle = 'white';
//             ctx.beginPath();
//             ctx.arc(200, 213, 158, 0, Math.PI * 2, false);
//             ctx.closePath();
//             ctx.fill();

//             ctx.globalCompositeOperation = 'destination-out';
//             ctx.drawImage(legsShadow, 50, 110, 300, 300);
//             ctx.drawImage(torsoShadow, 50, 110, 300, 300);
//             ctx.drawImage(headShadow, 50, 110, 300, 300);
//         ctx.restore();

//         ctx.globalCompositeOperation = 'destination-over';
//         ctx.drawImage(bg, 0, 0);
//         ctx.fillStyle = 'black';
//         ctx.fillRect(0, 0, canvas.width, canvas.height, 220, 50);

//         ctx.globalCompositeOperation = 'source-over';
//         ctx.drawImage(legs, 80, 80, 300, 300);
//         ctx.drawImage(torso, 80, 80, 300, 300);
//         ctx.drawImage(head, 80, 80, 300, 300);

//         ctx.drawImage(drawLogo, canvas.width / 2, 20);

//         ctx.font = "30px Spyscape";
//         ctx.fillStyle = 'white';
//         ctx.textAlign = 'center';
//         ctx.fillText(name, canvas.width/2, canvas.height-20)
//     }
// }

// ------------------------------
// form handling
var filename = '';
var url = '';
var submitName = $('#name');
var submitEmail = $('#email');

var Webflow = Webflow || [];
Webflow.push(function() {
    $(document).off('submit');

    $('#email-form').submit(function(e) {
        e.preventDefault();
        e.stopPropagation()

        if (submitName.val() && submitEmail.val()) {
            submitName.css('border', '1px solid #cccccc');
            submitName.css('background', '#ffffff');
            $('#name + p').hide()
            submitEmail.css('border', '1px solid #cccccc');
            submitEmail.css('background', '#ffffff');
            $('#email + p').hide()

            $('#submitBtn').val('Please wait...');

            filename = CURRENT_HEAD.toString() + CURRENT_TORSO.toString() + CURRENT_LEGS.toString() + '_' + Date.now();
            url = 'http://spyscape.com/characters/'+filename+'.png';
            $('#shareFacebook').attr('href', 'http://www.facebook.com/sharer.php?u='+url);

            var canvasToImg = canvas.toDataURL();
            var data = {
                name: submitName.val(),
                email: submitEmail.val(),
                newsletterConsent: $('#newsletter').is(':checked'),
                character: {
                    name: name,
                    head: CURRENT_HEAD,
                    torso: CURRENT_TORSO,
                    legs: CURRENT_LEGS
                },
                image: canvasToImg,
                fileName: filename
            };
            console.log(data);

            $.ajax({
                url: 'http://hooks.zapier.com/hooks/catch/2805412/l0grn0/',
                data: data,
                method: 'POST',
                dataType: 'json',
                // xhrFields: {
                //    withCredentials: true
                // },
                // beforeSend: function(xhr) {
                //    xhr.withCredentials = true;
                // },
                success: function() {
                    $('#gatherDetails').slideUp(200);
                    $('#success').show();
                },
                error: function() {
                    $('#error').show();
                    $([document.documentElement, document.body]).animate({
                        scrollTop: $("#error").offset().top
                    }, 2000);
                    $('#submitBtn').val('Submit');
                },
            })
        }
    });
});

$('#submitBtn').click(function() {
    if (!submitName.val()) {
        submitName.css('border', '2px solid #FF8366');
        submitName.css('background', '#ffff url(https://uploads-ssl.webflow.com/5bba10d5002d8a181406de36/5bd8fd5c557fae3a134af68a_warning-symbol.svg) no-repeat 95% 50%');
        submitName.css('background-size', '30px');
        $('#name + p').show()
    }
    if (!submitEmail.val()) {
        submitEmail.css('border', '2px solid #FF8366');
        submitEmail.css('background', '#ffff url(https://uploads-ssl.webflow.com/5bba10d5002d8a181406de36/5bd8fd5c557fae3a134af68a_warning-symbol.svg) no-repeat 95% 50%');
        submitEmail.css('background-size', '30px');
        $('#email + p').show()
    }
});


// ------------------------------
// Helper Functions

function updateCorpse(svg, img) {
    img.src = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg);
}

function updateHead() {
    var headAnim = {
        container: headBuildWrapper,
        renderer: 'svg',
        autoplay: true,
        loop: true,
        animationData : eval('head_anim_'+CURRENT_HEAD)
    };
    headBuildWrapper.innerHTML = '';
    bodymovin.loadAnimation(headAnim);
}

function slideHead(begin, end, direction) {
    $('#headBuildWrapper').animate({marginLeft: begin, opacity: 0}, 200, function() {
        if (direction === 'right') {
            CURRENT_HEAD = (CURRENT_HEAD + 1) % TOTAL_HEAD || TOTAL_HEAD;
        } else {
            CURRENT_HEAD = (CURRENT_HEAD - 1) % TOTAL_HEAD || TOTAL_HEAD;
        }

        updateHead();
        updateShadow();
        $('#headBuildWrapper').css({marginLeft: end});
        $('#headBuildWrapper').animate({marginLeft: 0, opacity: 1}, 200);
    });
}

function slideTorso(begin, end, direction) {
    $('#torsoBuild').animate({marginLeft: begin, opacity: 0}, 200, function() {
        if (direction === 'right') {
            CURRENT_TORSO = (CURRENT_TORSO + 1) % TOTAL_TORSO || TOTAL_TORSO;
        } else {
            CURRENT_TORSO = (CURRENT_TORSO - 1) % TOTAL_TORSO || TOTAL_TORSO;
        }

        updateCorpse(eval('torso_'+CURRENT_TORSO), eval('torsoBuild'));
        updateShadow();
        $('#torsoBuild').css({marginLeft: end});
        $('#torsoBuild').animate({marginLeft: 0, opacity: 1}, 200);
    });
}

function slideLegs(begin, end, direction) {
    $('#legsBuild').animate({marginLeft: begin, opacity: 0}, 200, function() {
        if (direction === 'right') {
            CURRENT_LEGS = (CURRENT_LEGS + 1) || TOTAL_LEGS;
        } else {
            CURRENT_LEGS = (CURRENT_LEGS - 1) || TOTAL_LEGS;
        }

        updateCorpse(eval('legs_'+CURRENT_LEGS), eval('legsBuild'));
        updateShadow();
        $('#legsBuild').css({marginLeft: end});
        $('#legsBuild').animate({marginLeft: 0, opacity: 1}, 200);
    });
}
