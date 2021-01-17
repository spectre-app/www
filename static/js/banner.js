function spinner(element, delta) {
    let spin = Math.max(0, (element.data("spin") || 0) + delta);
    element.data("spin", spin);

    if (spin) {
        element.finish().fadeIn();
    } else {
        element.finish().fadeOut();
    }
}

$(function () {
    mpw = new Worker("./js/mpw-js/mpw.js");
    mpw.onmessage = function (msg) {
        $('#banner .error').text(msg.data.error || null);
        $('#banner #sitePassword input').val(msg.data.sitePassword || null);

        spinner($('#banner #masterPassword .fa-spin'), -1);
        spinner($('#banner #sitePassword .fa-spin'), -1);
    };

    $('#banner #fullName, #banner #masterPassword').on('focusout', function () {
        $('#banner .error').text(null);
        spinner($('#banner #masterPassword .fa-spin'), +1);
        spinner($('#banner #sitePassword .fa-spin'), +1);

        mpw.postMessage({
            "fullName": $('#banner #fullName input')[0].value,
            "masterPassword": $('#banner #masterPassword input')[0].value,
            "siteName": $('#banner #siteName input')[0].value,
        });
    });

    $('#banner #siteName').on('input', function () {
        $('#banner .error').text(null);
        spinner($('#banner #sitePassword .fa-spin'), +1);

        mpw.postMessage({
            "siteName": $('#banner #siteName input')[0].value,
        });
    });

    $('#banner #sitePassword button').on('click', function () {
        $('#banner #sitePassword input')[0].select();
        document.execCommand('copy');
        $('#banner .info').text("Password Copied!");
        $('#banner .info').fadeIn().fadeOut({duration: 2000});
    });

    $('#banner #masterPassword .fa-spin').fadeOut();
    $('#banner #sitePassword .fa-spin').fadeOut();
});
