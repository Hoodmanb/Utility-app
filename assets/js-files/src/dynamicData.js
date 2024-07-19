const greet = document.getElementById('greet');
const image = document.getElementById('image');
let data = {};

const list = [
    'names',
    'phone',
    'displayName',
    'gender',
    'country',
    'email',
    'photoURL'
];

async function fetchDataFromApi() {
    try {
        const response = await fetch('/api/dynamic-data');
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const jsonData = await response.json();
        if (!('message' in jsonData)) {
            data = jsonData;
            console.log(data); // Handle the JSON data
            await updateDOM(list, data); // Call the function to update DOM
        } else {
            console.log(jsonData.message);
        }
    } catch (error) {
        console.error('There was a problem with the fetch operation:', error);
    }
}

async function updateDOM(list, data) {
    if (data['displayName'] && greet) {
        // Check if greet exists
        greet.textContent += data['displayName'];
    }
    list.forEach(item => {
        const element = document.getElementById(`socket-${item}`);
        if (element && data[item]) {
            // Check if element exists
            console.log(data[item]);
            if (item === 'country') {
                element.textContent = data[item];
                console.log(data[item]);
            } else if (item === 'photoURL') {
                element.src = data[item];
                if (image) {
                    // Check if image exists
                    image.src = data[item];
                }
            } else if (item === 'email') {
                const lastTenCharacters = `...${data[item].slice(-15)}`;
                element.textContent = lastTenCharacters;
            } else {
                element.textContent = data[item];
            }
        }
    });
}

document.addEventListener("DOMContentLoaded", async () => {
    try {
        await fetchDataFromApi(); // Fetch data once on DOMContentLoaded
        console.log('got to the end');
    } catch (error) {
        console.error('Error:', error);
    }
});