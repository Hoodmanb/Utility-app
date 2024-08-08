const eventSource = new EventSource('/api/dynamic-data');
let greet = document.getElementById('greet');
let image = document.getElementById('image');

async function updateDOM(list, data) {
  greet.textContent = data.displayName ? `Hello ${data.displayName}`: 'Hello';

  list.forEach(item => {
    const element = document.getElementById(`socket-${item}`);
    if (element && data[item]) {
      // Check if element exists
      console.log(data[item]);
      if (item === 'country') {
        element.textContent = data[item] ? data[item]: '';
        console.log(data[item]);
      } else if (item === 'photoURL') {
        element.src = data[item] ? data[item]: '/assets/images/f7befea457f0a186b1637212bb9bb4b6.jpg';
        if (image) {
          // Check if image exists
          image.src = data[item] ? data[item]: '/assets/images/f7befea457f0a186b1637212bb9bb4b6.jpg';
        }
      } else if (item === 'email') {
        const lastTenCharacters = `...${data[item].slice(-15)}`;
        element.textContent = data[item] ? lastTenCharacters: '..@gmail.com';
      } else {
        element.textContent = data[item] ? data[item]: '';
      }
    }
  });
}


const list = [
  'names',
  'phone',
  'displayName',
  'gender',
  'country',
  'email',
  'photoURL'
];

eventSource.onmessage = async (event) => {
  const receivedData = JSON.parse(event.data);

  await updateDOM(list,
    receivedData);
  // console.log(data)
  // console.log(data.displayName)
};

eventSource.onerror = (error) => {
  console.error('EventSource failed:',
    error);
};

document.addEventListener("DOMContentLoaded",
  async () => {
    try {
      // await fetchDataFromApi(); // Fetch data once on DOMContentLoaded
    //  await updateDOM(list, data); // Call the function to update DOM
      console.log('got to the end');
    } catch (error) {
      console.error('Error:', error);
    }
  });