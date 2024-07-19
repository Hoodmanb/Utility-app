const greet = document.getElementById('greet')
const image = document.getElementById('image')
var data = {};

const list = [
    'names',
    'phone',
    'displayName',
    'gender',
    'country',
    'email',
    'photoURL'

];

async function fetchData(get, list, data) {
    await get()
    list.forEach(item => {
        // const element = document.getElementById(`socket-${item}`);
        if (data[item]) {
            console.log(data[item])
            if (item === 'country') {
                element.textContent = data[item];
                console.log(data[item])
            } else if (item === 'photoURL') {
                element.src = data[item];
                image.src = data[item]
            } else if (item === 'email') {
                const lastTenCharacters = `...${data[item].slice(-15)}`;
                element.textContent = lastTenCharacters
            } else {
                element.textContent = data[item];
            }
            if (data['displayName']) {
                greet.textContent = data['displayName']
            }
        }
    });
}

// document.addEventListener("DOMContentLoaded", () => {

function fetch() {
    fetch('/api/dynamic-data')
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json(); // Parse JSON response
    })
    .then(data => {
        if (!('message' in data)) {
            data = data
            console.log(data); // Handle the JSON data

            // fetchData(list, data)
            // greet.textContent += data['displayName']
        } else {
            console.log(data.message);
        }
    })
    .catch(error => {
        console.error('There was a problem with the fetch operation:', error);
    });
    // });
}


document.addEventListener("DOMContentLoaded", async () => {
    try {
        // await fetchData(list, data);
        console.log('got to the end');
    } catch (error) {
        console.error('Error:', error);
    }
});

fetchData(fetch, list, data);