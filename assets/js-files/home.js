$('.image').click(function() {
  //function to toggle the login and logout function when the profile image is clicked
  const userAuthState = $('#userAuthState');
  if (userAuthState) {
    userAuthState.toggle()
  } else {
    console.error('Element with id "userAuthState" not found');
  }
})

function logoutHandler() {
  window.location.href = "/logout";
}

function loginHandler() {
  window.location.href = "/log-in";
}

$('document').ready(function(){
  $('#logout').click(function(){
    logoutHandler()
    userAuthState.style.display = "none";
  })
  $('#logout').attr('method', 'GET')
  
  $('#login').click(function(){
    loginHandler()
    userAuthState.style.display = "none";
  })
  $('#login').attr('method', 'GET')
  
  $('#copy').click(function(){
      console.log('copied')
    setTimeout(function() {
    $('#copied').toggleClass('copied1')
    }, 1500);
    $('#copied').toggleClass('copied1')
    console.log('pass copied')
  })
})