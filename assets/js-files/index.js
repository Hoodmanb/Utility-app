function copy(){
  navigator.clipboard.writeText($('#acc-no').text())
}

let iClass = document.getElementsByClassName('fa');
for (let i = 0; i < iClass.length; i++) {
  if (i == 3) {
    iClass[i].style.color = 'blue';
  } else if (i == 5) {
    iClass[i].style.color = 'green';
  };
}

