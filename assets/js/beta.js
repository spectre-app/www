$(function () {
    let form = $('#beta form')
    form.find('button').click(function() {
        $.post(form.attr('action'), form.serialize(), function(result) {
            if (result["result"] === "success") {
                form.find('.info').text("Thank you! " + result["message"])
                form.find('.error').text("")
            } else {
                form.find('.info').text("")
                form.find('.error').text("Oops! " + result["message"])
            }
        }, 'json');
        
        return false;
    })
});
