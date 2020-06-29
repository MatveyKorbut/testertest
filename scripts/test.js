const url = "http://date.jsontest.com/";
console.log(url);
//let date;


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


client.get('http://date.jsontest.com', function (response) {
  const date = JSON.parse(response);
  console.log(date.milliseconds_since_epoch)
});

//console.log(date);
