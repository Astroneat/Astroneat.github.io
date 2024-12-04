const api_address = 'https://api.counterapi.dev/v1';
const namespace = 'astroneat-github.io';
const key = 'counter-count';

/*
'req' can be:
- "up"
- "down"
- "set"
- "": means get
- "list": idk what this does
*/
function fetch_counter(req) {
    let xhr = new XMLHttpRequest();
    xhr.open("GET", `${api_address}/${namespace}/${key}/${req}`);
    console.log(`${api_address}/${namespace}/${key}/${req}`);
    xhr.responseType = "json";
    xhr.onload = function() {
        document.getElementById('count').textContent = this.response.count;
        console.log(this.response.count);
    }
    xhr.send();
}

function update_count() {
    fetch_counter("");
}

function countup() {
    fetch_counter("up");

    // let current_count = parseInt(document.getElementById("count").innerHTML);
    // current_count += 1;
    // document.getElementById("count").innerHTML = current_count;
}