$(document).ready(() => {
    const displayName = $("#userName").val();

    //function to validate email before processing
    function validateEmail(email) {
        const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        return emailPattern.test(email);
    }

    //function that toggles yhe visibility of password
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
            $('#create').css('backgroundColor', color).removeAttr('disabled');

            const $createSpan = $('#create-span');
            if ($createSpan.hasClass("spinner-border") || $createSpan.hasClass("spinner-border-sm")) {
                $createSpan.removeClass("spinner-border spinner-border-sm");
            }
        }

        setTimeout(() => {
            $('#bold').text('Create');
            $('#create').css('backgroundColor', '#0062FF');
        }, 2000);
    };

    //this function filter the responce from the server
    const dataCheck = (data) => {
        if (data === '') {
            let text = ''
            feedBack(text);
        } else if (data === 'Successful!') {
            feedBack('Successful', 'green');
            window.location.href = '/setprofile';
            $('#signUpForm')[0].reset(); // Corrected reset syntax
        } else {
            feedBack(data, '#D03D37');
        }
    };


    //jquery ajax that handles form submission and gets the responce from the server
    $('#signUpForm').submit(function(e) {
        e.preventDefault();

        const name = $('#userName').val();
        const email = $('#email').val();
        const password = $('#password').val();

        if (name === "" || email === "" || password === "") {
            dataCheck('');
        } else {
            $('#bold').text('Processing');
            $('#create-span').addClass("spinner-border spinner-border-sm");
            $('#create').attr('disabled', true);

            $.ajax({
                url: '/create',
                method: 'POST',
                data: {
                    displayName: name,
                    email: email,
                    password: password
                },
                success: function(response) {
                    console.log('Success:', response);
                    $('#signUpForm').trigger('reset');
                    dataCheck(response);
                },
                error: function(xhr, status, error) {
                    console.error('Error:', xhr.responseText);
                    dataCheck(xhr.responseText)
                }
            });
        }
    });
});