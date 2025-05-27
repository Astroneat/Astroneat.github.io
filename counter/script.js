const api_address = 'https://abacus.jasoncameron.dev';
const namespace = 'astroneat.github.io';
const key = 'counter-count';

/*
'req' can be:
- "get"
- "hit": count up by 1
*/
function fetch_counter(req) {
    let xhr = new XMLHttpRequest();
    xhr.open("GET", `${api_address}/${req}/${namespace}/${key}`);
    console.log(`${api_address}/${req}/${namespace}/${key}`);
    xhr.responseType = "json";
    xhr.onload = function() {
        document.getElementById('count').textContent = this.response.value;
        console.log(this.response.value);
    }
    xhr.send();
}

function update_count() {
    fetch_counter("get");
}

function countup() {
    fetch_counter("hit");
}