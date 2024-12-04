function update_count() {
    let xhr = new XMLHttpRequest();
    xhr.open("GET", "https://abacus.jasoncameron.dev/get/astroneat.github.io/counter-count");
    xhr.responseType = "json";
    xhr.onload = function() {
        document.getElementById('count').innerText = this.response.value;
        console.log(this.response.value);
    }
    xhr.send();
}

function countup() {
    let xhr = new XMLHttpRequest();
    xhr.open("GET", "https://abacus.jasoncameron.dev/hit/astroneat.github.io/counter-count");
    xhr.responseType = "json";
    xhr.onload = function() {
        document.getElementById('count').innerText = this.response.value;
        console.log(this.response.value);
    }
    xhr.send();

    // let current_count = parseInt(document.getElementById("count").innerHTML);
    // current_count += 1;
    // document.getElementById("count").innerHTML = current_count;
}