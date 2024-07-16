document.addEventListener('DOMContentLoaded', () => {
    const gender = document.querySelectorAll('.gender');

    //function to change the color for the gender buttons
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
    const show = document.getElementById('show')
    const popUp = document.getElementById('popUp');
    let file = null; // Declare file variable in accessible scope

    //chose a image and preview it on the popup
    photoInput.addEventListener('change', (event) => {
        popUp.style.display = 'block';
        file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                imagePreview.src = e.target.result;
                show.src = e.target.result;
            };
            reader.readAsDataURL(file);
        }
    });

    // function to cancel the chosen image and go back to default
    const cancel = function() {
        popUp.style.display = 'none';
        show.src = '/assets/images/images.png'
    };

    //funtion to continue to use the chosen image
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

    //skip the whole process of setting user data and redirect to app dashboard
    const skip = document.getElementById('skip');
    skip.addEventListener('click', () => {
        window.location.href = 'dashboard'
    })
});


//send form data to backend for processing
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

    $.ajax({
        url: '/profileSetup',
        type: 'POST',
        data: formData,
        contentType: false,
        processData: false,
        success: function(response) {
            console.log('response:', response)
            /*if (response === 'Successful') {
                window.location.href = '/dashboard'
                $('#setupform').trigger('reset')
            }*/
            window.location.href = '/dashboard'
            $('#setupform').trigger('reset')
        },
        error: function(error) {
            console.error('error:', error)
        }
    })

})