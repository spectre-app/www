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
    let demo = $('#banner .demo');
    let fullName = demo.find('#fullName');
    let fullNameInput = fullName.find('input');
    let masterPassword = demo.find('#masterPassword');
    let masterPasswordInput = masterPassword.find('input');
    let masterPasswordSpinner = masterPassword.find('.fa-spin');
    let siteName = demo.find('#siteName');
    let siteNameInput = siteName.find('input');
    let sitePassword = demo.find('#sitePassword');
    let sitePasswordSpinner = sitePassword.find('.fa-spin');
    let sitePasswordButton = sitePassword.find('button');
    let sitePasswordInput = sitePasswordButton.find('input')
    let infoMessage = demo.find('.info');
    let errorMessage = demo.find('.error');

    mpw = new Worker("./js/mpw-js/mpw.js");
    mpw.onmessage = function (msg) {
        errorMessage.text(msg.data.error || null);
        sitePasswordInput.val(msg.data.result || null);

        spinner(masterPasswordSpinner, -1);
        spinner(sitePasswordSpinner, -1);
    };

    $([fullName[0], masterPassword[0]]).on('focusout', function () {
        $('#banner .demo .error').text(null);
        spinner(masterPasswordSpinner, +1);
        spinner(sitePasswordSpinner, +1);

        mpw.postMessage({
            "fullName": fullNameInput[0].value,
            "masterPassword": masterPasswordInput[0].value,
            "serviceName": siteNameInput[0].value,
        });
    });

    siteName.on('input', function () {
        errorMessage.text(null);
        spinner(sitePasswordSpinner, +1);

        mpw.postMessage({
            "serviceName": siteNameInput[0].value,
        });
    });

    sitePasswordButton.on('click', function () {
        sitePasswordInput.select()
        document.execCommand('copy');

        sitePasswordButton.attr("title", "Copied!").tooltip("_fixTitle").tooltip("show");
        setTimeout(function () {
            sitePasswordButton.tooltip("hide").attr("title", "Copy Password").tooltip("_fixTitle");
        }, 1000);
    });

    masterPasswordSpinner.fadeOut();
    sitePasswordSpinner.fadeOut();
});
