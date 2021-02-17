import * as params from '@params';

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
    let userName = demo.find('#userName');
    let userNameInput = userName.find('input');
    let userSecret = demo.find('#userSecret');
    let userSecretInput = userSecret.find('input');
    let userSecretSpinner = userSecret.find('.fa-spin');
    let siteName = demo.find('#siteName');
    let siteNameInput = siteName.find('input');
    let sitePassword = demo.find('#sitePassword');
    let sitePasswordSpinner = sitePassword.find('.fa-spin');
    let sitePasswordButton = sitePassword.find('button');
    let sitePasswordInput = sitePasswordButton.find('input')
    let infoMessage = demo.find('p.info');
    let errorMessage = demo.find('p.error');

    let mpw = new Worker(params['mpw']);
    mpw.onmessage = function (msg) {
        errorMessage.text(msg.data.error || null);
        sitePasswordInput.val(msg.data.result || null);
        demo.find(`#${msg.data.cause}`).addClass("error")

        spinner(userSecretSpinner, -1);
        spinner(sitePasswordSpinner, -1);
    };

    $([userName[0], userSecret[0]]).on('focusout', function () {
        errorMessage.text(null);
        userName.removeClass("error");
        userSecret.removeClass("error");
        siteName.removeClass("error");
        spinner(userSecretSpinner, +1);
        spinner(sitePasswordSpinner, +1);

        mpw.postMessage({
            "userName": userNameInput[0].value,
            "userSecret": userSecretInput[0].value,
            "siteName": siteNameInput[0].value,
        });
    });

    siteName.on('input', function () {
        errorMessage.text(null);
        userName.removeClass("error");
        userSecret.removeClass("error");
        siteName.removeClass("error");
        spinner(sitePasswordSpinner, +1);

        mpw.postMessage({
            "siteName": siteNameInput[0].value,
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

    userSecretSpinner.fadeOut();
    sitePasswordSpinner.fadeOut();
});
