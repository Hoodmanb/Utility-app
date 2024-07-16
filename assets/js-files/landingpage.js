//function to toggle dropdown
function toggleDropdown() {
    var dropdownContent = document.querySelector(".dropdown-content");
    var isActive = dropdownContent.parentElement.classList.contains("active");
    if (isActive) {
        dropdownContent.parentElement.classList.remove("active");
    } else {
        dropdownContent.parentElement.classList.add("active");
    }
}

//Burger nav toggle
$(document).ready(function() {
    $("#burger-container").on('click', function() {
        $(this).toggleClass("open");
        console.log(5);
    });
});

const handwriting = document.querySelector('.handwriting');

// function to simulate Handwriting
function simulateHandwriting(container, textArray) {
    let index = 0;

//funtion to type the letters
    function type() {
        container.innerHTML = textArray[index].substring(0, container.innerHTML.length + 1);
        if (container.innerHTML === textArray[index]) {
            setTimeout(erase, 10000);
        } else {
            setTimeout(type, 200);
        }
    }

//function to erase written letters
    function erase() {
        container.innerHTML = textArray[index].substring(0, container.innerHTML.length - 1);
        if (container.innerHTML === "") {
            index = (index + 1) % textArray.length;
            setTimeout(type, 200);
        } else {
            setTimeout(erase, 50);
        }
    }

    type();
}

const text = ['Welcome To Nwigiri Telecoms', 'How can we be of help?'];
simulateHandwriting(handwriting, text);

//green and red marks that signify available services on each plan
document.addEventListener('DOMContentLoaded', () => {
    const oks = document.querySelectorAll('.ok');
    const notOks = document.querySelectorAll('.not-ok');

    oks.forEach(ok => {
        ok.innerHTML += '<i class="fa-solid mark fa-circle-check" style="color:green; font-size:1em;"></i>';
    });

    notOks.forEach(not => {
        not.innerHTML += '<i class="fa-solid mark fa-circle-xmark" style="color:red; font-size:1em;"></i>'
    });


});

const form = document.getElementById('form');
const submit = document.getElementById('submit')

submit.innerHTML = 'Send'

//form submission and processing 
form.addEventListener('submit', (e) => {
    e.preventDefault();
    submit.innerHTML = `Processing... `
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const message = document.getElementById('message').value;

    const data = {
        name: name,
        email: email,
        message: message
    };

    const url = '/sendmail';

    fetch(url, {
        method: 'POST', // Specify the method
        headers: {
            'Content-Type': 'application/json', // Specify the content type
        },
        body: JSON.stringify(data), // Convert data to JSON string
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok ' + response.statusText);
        }
        return response.json(); // Parse the JSON from the response
    })
    .then(data => {
        console.log('Success:', data); // Handle the response data
        submit.innerHTML = 'Successfull!'
        form.reset()
        setTimeout(function() {
            submit.innerHTML = 'Send'
        }, 2000);
    })
    .catch(error => {
        console.error('Error:', error); // Handle any errors
        submit.style.color = 'red'
        submit.innerHTML = 'Failed'
        setTimeout(function() {
            submit.style.color = 'white'
            submit.innerHTML = 'Send'
        }, 2000);

    });
});