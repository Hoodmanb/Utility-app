$(document).ready(() => {
    const alertBox = $('.alert-box');
    const displayName = $("#userName").val();

    function validateEmail(email) {
        const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        return emailPattern.test(email);
    }

    function showAlert() {
        alertBox.css('display', 'flex');
    }

    function hideAlert() {
        alertBox.css('display', 'none');
    }

    const password = $('#password');
    $('#eyeicon').click(() => {
        const type = password.attr('type') === 'password' ? 'text': 'password';
        password.attr('type', type);
        $('#eyeicon').html(type === 'password' ? '<i class="fa-solid fa-eye"></i>': '<i class="fa-solid fa-eye-slash"></i>');
    });

    // Hide the alert box initially
    hideAlert();

    const feedbackDiv = $('#res-message');
    const icon = $('#icon');
    const successIcon = `<lottie-player src="https://lottie.host/5180d773-2815-4cdc-a1d7-f04dc1fb247f/znYIRWl9ZT.json" background="none" speed="1" style="width: 100px; height: 100px" autoplay direction="1" mode="normal"></lottie-player>`;
    const errorIcon = `<lottie-player src="https://lottie.host/ad739577-4469-4f8b-8e55-1822b5eb44db/94VsLUHyCK.json" background="none" speed="1" style="width: 100px; height: 100px" autoplay direction="1" mode="normal"></lottie-player>`;

    function handleContinueClick() {
        hideAlert();
        window.location.href = '/dashboard';
    }

    const dataCheck = (data) => {
        if (data === '') {

            // Handle error case
            feedbackDiv.text('All Fields Are Required');
            icon.html(successIcon).css('backgroundColor', '#D03D37');
            $('.ok-btn').text('Try Again!').css('backgroundColor', '#D03D37');
            $('.ok-btn').off('click');
            $('.ok-btn').click(hideAlert);
            showAlert();

        } else if (data === 'Successful!') {
            /*window.location.href = '/';

            feedbackDiv.text(data);
            icon.html(successIcon).css('backgroundColor', 'green');
            $('.ok-btn').text('Continue').css('backgroundColor', 'green');
            $('.ok-btn').off('click');
            $('.ok-btn').click(function() {
                hideAlert()
                window.location.href = '/setprofile';
           });
            signUpForm.reset();
            showAlert();*/
            
            window.location.href = '/setprofile';
            signUpForm.reset();
        } else {
            // Handle error case
            feedbackDiv.text(data);
            icon.html(errorIcon).css('backgroundColor', '#D03D37');
            $('.ok-btn').text('Try Again!').css('backgroundColor', '#D03D37');
            $('.ok-btn').off('click');
            $('.ok-btn').click(hideAlert);
            showAlert();
        }
    };

    const fetchData = () => {
        $.ajax({
            url: '/api/data',
            method: 'GET',
            dataType: 'json',
            success: function(data) {
                const message = data.message;
                console.log(message);
                dataCheck(message);
            },
            error: function(error) {
                console.error('Error:', error);
            }
        });
    };

    $('#signUpForm').submit(function(e) {
        e.preventDefault();

        const name = $('#userName').val();
        const email = $('#email').val();
        const password = $('#password').val();

        // Corrected the logic for checking empty fields
        if (name === "" || email === "" || password === "") {
            let data = ''
            dataCheck(data)
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

                    setTimeout(function() {
                        console.log('got to the time out')
                        $('#bold').text('Create');
                        $('#create').removeAttr('disabled');
                        if ($('#create-span').hasClass("spinner-border") || $('#create-span').hasClass("spinner-border-sm")) {
                            $('#create-span').removeClass("spinner-border spinner-border-sm");
                        }
                        fetchData();
                    },
                        3000);
                },
                error: function(xhr, status, error) {
                    console.error('Error:',
                        error);
                }
            });
        }
    });
});