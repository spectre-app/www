$(function() {
    "use strict";

    /* Close navbar when link clicked. */
    $('.navbar-collapse a').click(function () {
        $(".navbar-collapse").collapse('hide');
    });

    /* Lazy load images. */
    lozad().observe();

    /* Pop-up image zoom. */
    $('.image-popup').magnificPopup({
        type: 'image',
        removalDelay: 160, //delay removal by X to allow out-animation
        closeOnContentClick: true,
        midClick: true,
        fixedContentPos: false,
        fixedBgPos: true
    });

    /* Animated page scroll. */
    $('nav a, .page-scroll').on('click', function () {
        if (location.hostname === this.hostname &&
            location.pathname === this.pathname.replace(/^(?=[^\/]|$)/,
                location.pathname.replace(/[^\/]*$/, ""))) {
            let target = $(this.hash)[0] || $('[name=' + this.hash.slice(1) + ']')[0];
            if (target) {
                $('html').animate({
                    scrollTop: $(target).offset().top - $("#navigation").height() / 2
                }, 600);
                location.hash = this.hash
                return false;
            }
        }
    });
    
    /* Tooltips. */
    $('[title]').tooltip()

    /* OS detection. */
    $('html').attr('data-os', UAParser().os.name);

    /* Particles. */
    // tsParticles.load("banner-particles", {
    //     "fpsLimit": 10,
    //     "autoPlay": true,
    //     "detectRetina": true,
    //     "pauseOnBlur": true,
    //     "pauseOnOutsideViewport": true,
    //
    //     "interactivity": {
    //         "events": {
    //             "onDiv": {
    //                 "selectors": "#banner .demo",
    //                 "enable": true,
    //                 "mode": "repulse"
    //             },
    //         },
    //         "modes": {
    //             "repulse": {
    //                 "speed": 0.02
    //             }
    //         }
    //     },
    //
    //     "particles": {
    //         "reduceDuplicates": true,
    //         "color": {
    //             "value": "#3E8989"
    //         },
    //         "links": {
    //             "color": {
    //                 "value": "#3E8989"
    //             },
    //             "distance": 300,
    //             "enable": true,
    //             "frequency": 0.7,
    //             "opacity": 1,
    //             "width": 1,
    //         },
    //         "move": {
    //             "enable": true,
    //             "speed": 0.1
    //         },
    //         "number": {
    //             "density": {
    //                 "enable": true
    //             },
    //             "value": 5
    //         },
    //         "shape": {
    //             "options": {
    //                 "character": [
    //                     {
    //                         "fill": true,
    //                         "font": "Font Awesome 6 Brands",
    //                         "style": "",
    //                         "value": [
    //                             "", "", "", "", "", "", "", "", "", "", "", "", "", "", "",
    //                             "", "", "", "", "", "", "", "", "", "", "", "", "", "", ""
    //                         ],
    //                         "weight": "400"
    //                     }
    //                 ],
    //             },
    //             "type": ["character", "circle"],
    //         },
    //         "size": {
    //             "random": {
    //                 "enable": true,
    //                 "minimumValue": 4
    //             },
    //             "value": 20
    //         },
    //     }
    // });
});
