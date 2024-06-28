document.addEventListener('DOMContentLoaded', () => {
    const gender = document.querySelectorAll('.gender');

    function colorChange(list) {
        list.forEach(item => {
            item.addEventListener('click', (e) => {
                list.forEach(btn => {
                    btn.style.backgroundColor = 'grey';
                    btn.setAttribute('id', 'null');
                });
                item.style.backgroundColor = 'green';
                item.setAttribute('id', 'gender');
                console.log(e.target.id, e.target.value);
            });
        });
    }

    colorChange(gender);
});

$('#setupform').on('submit', function(e) {
    e.preventDefault()
})




document.addEventListener('DOMContentLoaded', () => {
    const photoInput = document.getElementById('photoInput');
    const imagePreview = document.getElementById('image-preview');
    const popUp = document.getElementById('popUp');
    let file = null; // Declare file variable in accessible scope

    photoInput.addEventListener('change', (event) => {
        popUp.style.display = 'block';
        file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                imagePreview.src = e.target.result;
            };
            reader.readAsDataURL(file);
        }
    });

    const cancel = function() {
        popUp.style.display = 'none';
        file = null; // Reset file variable
    };

    const continueAction = function() {
        popUp.style.display = 'none';
        // Perform further actions or submit form with file data
    };

    // Attach event listeners to cancel and continue buttons/links
    const cancelBtn = document.getElementById('cancel');
    if (cancelBtn) {
        cancelBtn.addEventListener('click', cancel);
    }

    const continueBtn = document.getElementById('continue');
    if (continueBtn) {
        continueBtn.addEventListener('click', continueAction);
    }
});



$('#done').on('click', function() {

    var formData = new FormData();
    formData.append('names',
        $('#names').val());
    formData.append('number',
        $('#number').val());
    formData.append('country',
        $('#country').val());
    formData.append('gender',
        $('#gender').val());
        
    formData.append('imageFile',
        $('#photoInput')[0].files[0]);


    /*const names = document.getElementById('names').value
    const number = document.getElementById('number').value
    const country = document.getElementById('country').value
    const gender = document.getElementById('gender').value

    const myData = {
        names: names || null,
        number: number || null,
        country: country || null,
        gender: gender || null
    };*/

    $.ajax({
        url: 'profileSetup',
        type: 'POST',
        data: formData,
        contentType: false,
        processData: false,
        success: function(response) {
            console.log('response:', response)
            if (response.message === 'Successful') {
                window.location.href = '/'
            }
        },
        error: function(error) {
            console.error('error:', error)
        }
    })

})