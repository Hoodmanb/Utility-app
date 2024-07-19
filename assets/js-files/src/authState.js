const userAuthState = $('#userAuthState');
const UserAuthState = $('#pro')
const overlay = document.getElementById('overlay');

//funtion to copy account number to clipboard when clicked
function copy() {
    navigator.clipboard.writeText($('#acc-no').text())
}

function logoutHandler() {
    window.location.href = "/logout";
}

function loginHandler() {
    window.location.href = "/log-in";
}
function proceedToDelete() {

    $("#delete").click(function() {
        overlay.style.display = 'block';
        $("#delete-pop").fadeIn(500, function() {
            $(this).show();
        });
    })

    $('#cancel').click(function() {
        overlay.style.display = 'none';
        $("#delete-pop").fadeOut(500, function() {
            $(this).hide();
        });
    })

    $('#c-delete').click(function() {
        $.ajax({
            url: '/accountDelete',
            type: 'GET',
            success: function(response) {
                console.log('response:', response)
            },
            error: function(error) {
                console.error('error:', error)
            }
        })
    })
}

function isUser(state) {
    $(state).click(function() {
        if (state === '#logout') {
            logoutHandler();
        } else {
            loginHandler();
        }
        userAuthState.hide();
    }).attr('method',
        'GET');
}

function userAuthed(state) {
    $(state).click(function() {
        if (state === '#prof-logout') {
            logoutHandler();
        } else {
            loginHandler();
        }
    }).attr('method',
        'GET');
}

// Function to toggle the login and logout function when the profile image is clicked
function get() {
    $.ajax({
        url: '/isUser',
        method: 'GET',
        success: function(response) {
            let state = response.state;
            let view = response.view;
            let auth = response.auth;
            let authState = response.authState

            if (response.remove) {
                let remove = response.remove;
                let deleteAndState = auth + remove
                UserAuthState.html(deleteAndState)
                proceedToDelete()
            } else {
                UserAuthState.html(auth)
            }

            userAuthState.html(view);


            console.log(state);

            isUser(state);
            userAuthed(authState)
        },
        error: function(error) {
            console.log(error);
        }
    });
}

get()

$('document').ready(function() {
    get()

    $('.image').click(function() {
        get()
        userAuthState.toggle();
    });

    $('#copy').click(function() {
        console.log('copied')
        setTimeout(function() {
            $('#copied').toggleClass('copied1')
        },
            1500);
        $('#copied').toggleClass('copied1')
        console.log('pass copied')
    })
})