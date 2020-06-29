function randomInteger(max) {
  let rand = 0 + Math.random() * (max + 1 - 0);
  return Math.floor(rand);
}

let decimalArray = [];
for (let i = 0; i < 50; i++) {
  decimalArray.push(randomInteger(65535))
}


function createMultiselect() {
  const multiSelect = document.createElement('select');
  const div = document.createElement('div');
  div.className = "wrapper"
  multiSelect.id='multiselect';
  document.body.appendChild(div);
  div.appendChild(multiSelect)
  multiSelect.multiple = 'multiple';
  multiSelect.size = '50';
  multiSelect.style.width = '250px';
  decimalArray.forEach(item => {
    const option = document.createElement('option');
    option.text = item;
    option.value = item;
    multiSelect.add(option);
  })
};

function changeButtonValue(e) {
  if (e.target.innerText === '0') {
    e.target.innerText = '1';
    e.target.className = "btn btn-danger"
  } else {
    e.target.innerText = '0';
    e.target.className = "btn btn-success"

  }
}

function selectValues() {
  const mask = createMask();
  const select = document.getElementById('multiselect');

  console.log("mask", mask);
  if (mask == "16513") {
    select.style.display = "none"
  } else {
    select.style.display = "block"

  }
  for (let i = 0; i < select.options.length; i++) {
    select.options[i].selected = false;
    const valueInMask = mask & select.options[i].value;
    if (mask !== 0 && valueInMask === mask){select.options[i].selected = true}
  }
}


function createMask() {
  block = document.getElementById('mask');

  let mask = '';
  const buttons = document.getElementById('mask').getElementsByTagName('button');
  for (let i = 0; i < buttons.length; i++) {
    mask += buttons[i].innerText;
  }
  return parseInt(mask,2);
}

function createFilter() {
  const div = document.createElement('div');
  div.className="wrapper"
  div.id = 'mask'
  for (let i = 0; i < 16; i++) {
    const button = document.createElement('button');
    button.className="btn btn-success";
    button.innerText = '0';
    button.addEventListener('click', (e) => {
      changeButtonValue(e);
      selectValues();
    });

    div.appendChild(button)
  }
  document.body.appendChild(div)
}

function createFilterForm() {
  createFilter();
  createMultiselect();
}

createFilterForm();

var theInterval = setInterval(function () {
  throw new Error("Time error!!")
}, 300000);