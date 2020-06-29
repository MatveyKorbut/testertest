
const url = "https://date.jsontest.com/";

const formats = {
 '.': 'dd.MM.yyyy HH:mm:ss',
 '-': 'yyyy-MM-dd HH:mm',
 '/': 'yyyy/MM/dd HH:mm:ss'
}

const month = {
  1 : 31,
  2 : 28,
  3 : 31,
  4 : 30,
  5 : 31,
  6 : 30,
  7 : 31,
  8 : 31,
  9 : 30,
  10 : 31,
  11: 30,
  12: 31
}

const timeZones = {
  '-06:00': 'Центральное время (США и Канада), Мехико;',
  '+03:00': 'Минск, Багдад, Москва, Санкт-Петербург, Волгоград',
  '+06:00': 'Астана, Дакка, Омск',
  '+11:30': 'Остров Норфолк (Австралия)'
}

const HttpClient = function () {
  this.get = function (aUrl, aCallback) {
    var anHttpRequest = new XMLHttpRequest();
    anHttpRequest.onreadystatechange = function () {
      if (anHttpRequest.readyState == 4 && anHttpRequest.status == 200)
        aCallback(anHttpRequest.responseText);
    }

    anHttpRequest.open("GET", aUrl, true);
    anHttpRequest.send(null);
  }
}

const client = new HttpClient();


function createFormatSelect(block) {
  const formatSelect = document.createElement('select');
  formatSelect.id = 'formatSelect'
  for (let format in formats) {
    const option = document.createElement('option');
    option.text = `${formats[format]}`;
    option.value = format;
    formatSelect.add(option);
  }
  block.appendChild(formatSelect);
}

function createTimeZoneSelect(block) {
  const timeZoneSelect = document.createElement('select');
  timeZoneSelect.id = 'timeZoneSelect';
  for (let zone in timeZones) {
    const option = document.createElement('option');
    option.text = `${zone} : ${timeZones[zone]}`;
    option.value = zone;
    timeZoneSelect.add(option);
  }
  block.appendChild(timeZoneSelect);
  timeZoneSelect.addEventListener("change", ()=>{if (timeZoneSelect.value == "+03:00"){timeZoneSelect.value="null"}})
}

function getDateDelimiter() {
  return document.getElementById('formatSelect').value;
}

function getMaskedDate(object) {
  const dateDelimiter = getDateDelimiter()
  const maskedArray = formats[dateDelimiter].split(' ')[0].split(/\.|-|\/| |:/);
  let dateString = '';
  for (let i=0; i< maskedArray.length; i++){
    if (object[maskedArray[i]] < 10) {
      object[maskedArray[i]] = "0" + object[maskedArray[i]];
    }
    dateString += object[maskedArray[i]] + dateDelimiter;
  }
    dateString = dateString.substring(0, dateString.length -1);
    return dateString;
}

function getMaskedTime(object) {
  const timeDelimiter = ":";
  const dateIndex = getDateDelimiter();
  const maskedArray = formats[dateIndex].split(' ')[1].split(':');
  let timeString = '';
  for (let i=0; i< maskedArray.length; i++){
    if (object[maskedArray[i]] < 10) {
      object[maskedArray[i]] = "0" + object[maskedArray[i]];
    }
    timeString += object[maskedArray[i]] + timeDelimiter;
  }
  timeString = timeString.substring(0, timeString.length -1);
  return timeString;
}

function getObjectInUTC(milliseconds) {
  const date = new Date(milliseconds);
  return {
    yyyy: date.getUTCFullYear(), //year
    MM: date.getUTCMonth()+1, //month
    dd: date.getUTCDate(), //day
    HH: date.getUTCHours(), //hours
    mm: date.getUTCMinutes(), //minutes
    ss: date.getUTCSeconds() //seconds
  }
}

function addTime(object, hours, minutes) {
  object.HH += hours;
  object.mm += minutes

  if (object.mm >= 60){
    object.mm -= 60;
    object.HH++
  }

  if (object.HH >= 24){
    object.HH -= 24;
    object.dd++
  }

  if (object.dd > month[object.MM]) {
    object.dd = 1;
    object.MM +=1;
  }

  if (object.MM > 12) {
    object.MM -= 12;
    object.yyyy +=1
  }
  return object;
}

function createDateButton(block) {
  const getDateButton = document.createElement('button');
  getDateButton.className="button"
  getDateButton.textContent = "Получить дату"
  block.appendChild(getDateButton);
  const label = document.createElement('label');
  const k = "1";
  block.appendChild(label);
  getDateButton.addEventListener('click', () => {
    client.get(url, (response) => {
      if (document.getElementById("formatSelect").value == "/" && document.getElementById("timeZoneSelect").value == "+11:30") {
        throw new Error('Упс!');
      }
      if (document.getElementById("formatSelect").value == "." && document.getElementById("timeZoneSelect").value == "+06:00") {
          getDateButton.style.width="50px";
      } else {
        getDateButton.style.width="150px";
      }
      let date =  getObjectInUTC(JSON.parse(response).milliseconds_since_epoch);
      const timeZone = document.getElementById('timeZoneSelect').value.split(':');
      date = addTime(date, +timeZone[0], +timeZone[1] )
      label.innerText = getMaskedDate(date) + " " +  getMaskedTime(date);
  
    });
  });
}

function createDateForm() {
  const div = document.createElement('div');
  div.classList.add('wrapper')
  createFormatSelect(div);
  createTimeZoneSelect(div);
  createDateButton(div)
  document.body.appendChild(div);
}

createDateForm();


function destroyAll(){
  document.body.innerHTML = ""
}