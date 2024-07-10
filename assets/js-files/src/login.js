$(document).ready(() => {
  const alertBox = $('.alert-box');

  function showAlert() {
    alertBox.css('display', 'flex');
  }

  function hideAlert() {
    alertBox.css('display', 'none');
  }

  hideAlert();

  const successIcon = `<lottie-player src="https://lottie.host/5180d773-2815-4cdc-a1d7-f04dc1fb247f/znYIRWl9ZT.json" background="none" speed="1" style="width: 100px; height: 100px" autoplay direction="1" mode="normal"></lottie-player>`;
  const errorIcon = `<lottie-player src="https://lottie.host/ad739577-4469-4f8b-8e55-1822b5eb44db/94VsLUHyCK.json" background="none" speed="1" style="width: 100px; height: 100px" autoplay direction="1" mode="normal"></lottie-player>`;

  const password = $('#password');
  $('#eyeicon').click(() => {
    const type = password.attr('type') === 'password' ? 'text': 'password';
    password.attr('type', type);
    $('#eyeicon').html(type === 'password' ? '<i class="fa-solid fa-eye"></i>': '<i class="fa-solid fa-eye-slash"></i>');
  });

  let logInMessage = null;

  $('#logInForm').submit((e) => {
    e.preventDefault();
    $.ajax({
      url: '/login',
      method: 'POST',
      data: {
        email: $('#email').val(),
        password: $('#password').val()
      },
      success: function(response) {
        console.log('Success:', response);
        $('#logInForm').trigger('reset');
      },
      error: function(xhr, status, error) {
        console.error('Error:', error);
      }
    });

    setTimeout(() => {
      fetchData();
    }, 3000);

  });

  const dataCheck = (data) => {
    if (data === 'Sucessful!') {
      window.location.href = '/dashboard';
    } else {
      // Handle error case
      $('#res-message').text(data);
      $('#icon').html(errorIcon).css('backgroundColor', '#D03D37');
      $('.ok-btn').text('Try Again!').css('backgroundColor', '#D03D37');
      $('.ok-btn').click(hideAlert);
      showAlert();
    }
  };

  const fetchData = () => {
    $.ajax({
      url: '/api/logInData',
      method: 'GET',
      dataType: 'json',
      success: function(data) {
        logInMessage = data.logInMessage;
        dataCheck(logInMessage);
      },
      error: function(error) {
        console.error(error);
      }
    });
  };
});