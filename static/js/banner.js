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
    let serviceName = demo.find('#serviceName');
    let serviceNameInput = serviceName.find('input');
    let servicePassword = demo.find('#servicePassword');
    let servicePasswordSpinner = servicePassword.find('.fa-spin');
    let servicePasswordButton = servicePassword.find('button');
    let servicePasswordInput = servicePasswordButton.find('input')
    let infoMessage = demo.find('p.info');
    let errorMessage = demo.find('p.error');

    mpw = new Worker("./js/mpw-js/mpw.js");
    mpw.onmessage = function (msg) {
        errorMessage.text(msg.data.error || null);
        servicePasswordInput.val(msg.data.result || null);
        demo.find(`#${msg.data.cause}`).addClass("error")

        spinner(masterPasswordSpinner, -1);
        spinner(servicePasswordSpinner, -1);
    };

    $([fullName[0], masterPassword[0]]).on('focusout', function () {
        errorMessage.text(null);
        fullName.removeClass("error");
        masterPassword.removeClass("error");
        serviceName.removeClass("error");
        spinner(masterPasswordSpinner, +1);
        spinner(servicePasswordSpinner, +1);

        mpw.postMessage({
            "fullName": fullNameInput[0].value,
            "masterPassword": masterPasswordInput[0].value,
            "serviceName": serviceNameInput[0].value,
        });
    });

    serviceName.on('input', function () {
        errorMessage.text(null);
        fullName.removeClass("error");
        masterPassword.removeClass("error");
        serviceName.removeClass("error");
        spinner(servicePasswordSpinner, +1);

        mpw.postMessage({
            "serviceName": serviceNameInput[0].value,
        });
    });

    servicePasswordButton.on('click', function () {
        servicePasswordInput.select()
        document.execCommand('copy');

        servicePasswordButton.attr("title", "Copied!").tooltip("_fixTitle").tooltip("show");
        setTimeout(function () {
            servicePasswordButton.tooltip("hide").attr("title", "Copy Password").tooltip("_fixTitle");
        }, 1000);
    });

    masterPasswordSpinner.fadeOut();
    servicePasswordSpinner.fadeOut();
});
