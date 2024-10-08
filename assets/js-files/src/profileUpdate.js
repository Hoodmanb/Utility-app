//const connectWebSocket = require('./webSocket');
//const reloadDynamicData = connectWebSocket;

$(document).ready(() => {
    //import connectWebSocket from './webSocket'

    const editPop = $('.editPop');
    const profileForm = $('#profileForm');
    const updateForm = $('#update-form');
    const itemToEdit = $('#itemToEdit');
    const greet = document.getElementById('greet')

    let type = {
        field: ''
    };

    $('#close').click(() => {
        $("#popup-card").fadeOut(500, function() {
            $(this).hide();
        });
    });

    const formHeadPlaceHolder = [
        ['Update Name', 'Name'],
        ['Update Number', 'Number'],
        ['Update Display Name', 'Display Name'],
        ['Update Gender', 'Gender'],
        ['Update Country', 'Country']
    ];

    editPop.each(function(index) {
        $(this).click((e) => {
            updateForm.text(formHeadPlaceHolder[index][0]);
            itemToEdit.attr('placeholder', formHeadPlaceHolder[index][1]);

            let id = e.target.id;
            console.log(id);
            type.field = id;

            $("#popup-card").fadeIn(500, function() {
                $(this).show();
            });

        });
    });

    function fetchData(toEdit, data) {
        const element = document.getElementById(`socket-${toEdit}`);

        if (toEdit === 'photoURL') {
            element.src = data[toEdit]
        } else if (toEdit === 'displayName') {
            element.textContent = data[toEdit]
            greet.textContent = `Hello ${data[toEdit]}`
        } else {
            element.textContent = data[toEdit];
        }

    }



    async function updateProfile(form, toEdit) {

        const fd = new FormData(form[0]); // form[0] to get the DOM element
        fd.append('type',
            JSON.stringify(toEdit));

        const urlEncoded = new URLSearchParams(fd).toString();

        try {
            const response = await fetch('/updateUserInfo',
                {
                    method: 'POST',
                    body: urlEncoded,
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded'
                    }
                });
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            if (!('authState' in data)) {
                fetchData(toEdit, data)
            }
            console.log('Response from server:', data);
            console.log(toEdit)



        } catch (error) {
            console.error('Error:', error);
        }
    }

    profileForm.on('submit', function(event) {
        event.preventDefault();
        updateProfile(profileForm, type.field);
        profileForm[0].reset();
        $('#popup-card').hide();

    });
});