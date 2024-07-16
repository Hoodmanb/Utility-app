const greet = document.getElementById('greet')
const image = document.getElementById('image')
function fetchData(list, data) {
    list.forEach(item => {
        const element = document.getElementById(`socket-${item}`);
        if (data[item]) {
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
        }
    });
}

document.addEventListener("DOMContentLoaded", () => {
    const list = [
        'names',
        'phone',
        'displayName',
        'gender',
        'country',
        'email',
        'photoURL'

    ];

    fetch('/api/dynamic-data')
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json(); // Parse JSON response
    })
    .then(data => {
        if (!('message' in data)) {
            fetchData(list, data)
            greet.textContent += data['displayName']
        }
        console.log(data); // Handle the JSON data
    })
    .catch(error => {
        console.error('There was a problem with the fetch operation:', error);
    });
});