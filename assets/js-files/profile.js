function leftClick() {
    $('#btn').css('left', '0');
    $('#setting').css('display', 'none');
    $('#profile').css('display', 'block');
}

function rightClick() {
    $('#btn').css('left', '110px');
    $('#setting').css('display', 'block');
    $('#profile').css('display', 'none');
}

$(document).ready(function() {

    const overlay = document.getElementById('overlay');
    
    $('#prof-login').click(function() {
        window.location.href = '/log-in'
    })

    function logoutHandler() {
        window.location.href = "/logout";
    }

    $('#prof-logout').click(function() {
        logoutHandler();
    });
    $('#prof-logout').attr('method', 'GET');

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
});

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