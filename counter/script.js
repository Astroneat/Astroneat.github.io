function countup() {
    let current_count = document.getElementById("count").innerText;
    current_count += 1;
    document.getElementById("count").innerText = current_count;
}