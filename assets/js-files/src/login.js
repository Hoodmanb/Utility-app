$(document).ready(() => {

    //toggling the visibility of password
    const password = $('#password');
    $('#eyeicon').click(() => {
        const type = password.attr('type') === 'password' ? 'text': 'password';
        password.attr('type', type);
        $('#eyeicon').html(type === 'password' ? '<i class="fa-solid fa-eye"></i>': '<i class="fa-solid fa-eye-slash"></i>');
    });

    //this function handles feedback from the server to the client through the //form submit button
    const feedBack = (text, color) => {
        if (text === '') {
            let t = 'All Fields Are Required!!!'
            $('#bold').text(t);
        } else {
            $('#bold').text(text);
            $('#log-in').css('backgroundColor', color).removeAttr('disabled');

            const $createSpan = $('#create-span');
            if ($createSpan.hasClass("spinner-border") || $createSpan.hasClass("spinner-border-sm")) {
                $createSpan.removeClass("spinner-border spinner-border-sm");
            }
        }

        setTimeout(() => {
            $('#bold').text('Create');
            $('#log-in').css('backgroundColor', '#0062FF');
        }, 2000);
    };

    //this function filter the responce from the server
    const dataCheck = (data) => {
        if (data === '') {
            let text = ''
            feedBack(text);
        } else if (data === 'Successful!') {
            feedBack('Successful', 'green');
            window.location.href = '/dashboard';
            $('#signUpForm')[0].reset(); // Corrected reset syntax
        } else {
            feedBack(data, '#D03D37');
        }
    };

    //submit form and send user data to backend for authentication
    $('#logInForm').submit((e) => {
        e.preventDefault();

        const email = $('#email').val()
        const password = $('#password').val()

        if (email === "" || password === "") {
            dataCheck('');
        } else {

            $('#bold').text('Processing');
            $('#create-span').addClass("spinner-border spinner-border-sm");
            $('#log-in').attr('disabled', true);

            $.ajax({
                url: '/login',
                method: 'POST',
                data: {
                    email: email,
                    password: password
                },
                success: function(response) {
                    console.log('Success:', response);
                    $('#logInForm').trigger('reset');
                    dataCheck(response)
                },
                error: function(xhr, status, error) {
                    console.error('Error:', xhr.responseText);
                    dataCheck(xhr.responseText)
                }
            });
        }

    });
});