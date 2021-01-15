jQuery(function ($) {
    "use strict";

    /*	Close navbar when link clicked. */
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

    /*	Animated page scroll. */
    var html_body = $('html, body');
    $('nav a, .page-scroll').on('click', function () {
        if (location.pathname.replace(/^\//, '') === this.pathname.replace(/^\//, '') && location.hostname === this.hostname) {
            var target = $(this.hash);
            target = target.length ? target : $('[name=' + this.hash.slice(1) + ']');
            if (target.length) {
                html_body.animate({
                    scrollTop: target.offset().top - 50
                }, 1500, 'easeInOutExpo');
                return false;
            }
        }
    });

    /*	easeInOutExpo animator. */
    jQuery.extend(jQuery.easing, {
        easeInOutExpo: function (x, t, b, c, d) {
            if (t === 0) {
                return b;
            }
            if (t === d) {
                return b + c;
            }
            if ((t /= d / 2) < 1) {
                return c / 2 * Math.pow(2, 10 * (t - 1)) + b;
            }
            return c / 2 * (-Math.pow(2, -10 * --t) + 2) + b;
        }
    });

    /*	OS detection. */
    $('html').attr('data-os', UAParser().os.name);

    /*	Particles. */
    tsParticles.load("banner-particles", {
        "fpsLimit": 20,
        "interactivity": {
            "events": {
                "onDiv": {
                    "selectors": "#banner .demo",
                    "enable": true,
                    "mode": "repulse"
                },
            },
            "modes": {
                "repulse": {
                    "speed": 0.02
                }
            }
        },
        "particles": {
            "color": {
                "value": "#3E8989"
            },
            "links": {
                "color": {
                    "value": "#3E8989"
                },
                "distance": 300,
                "enable": true,
                "frequency": 0.7,
                "opacity": 1,
                "width": 1,
            },
            "move": {
                "enable": true,
                "speed": 0.2
            },
            "number": {
                "density": {
                    "enable": true
                },
                "value": 5
            },
            "shape": {
                "options": {
                    "character": [
                        {
                            "fill": true,
                            "font": "Font Awesome 6 Brands",
                            "style": "",
                            "value": [
                                "", "", "", "", "", "", "", "", "", "", "", "", "", "", "",
                                "", "", "", "", "", "", "", "", "", "", "", "", "", "", ""
                            ],
                            "weight": "400"
                        }
                    ],
                },
                "type": ["character", "circle"],
            },
            "size": {
                "random": {
                    "enable": true,
                    "minimumValue": 4
                },
                "value": 20
            },
            "reduceDuplicates": true,
        }
    });
});
