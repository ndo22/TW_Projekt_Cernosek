document.addEventListener('DOMContentLoaded', async () => {
    const response = await fetch('http://api.icndb.com/jokes/random');
    const json = await response.json();
    const bubble = document.getElementById("daily-joke");
    if (json.type == "success") bubble.innerText = json.value.joke;
    else bubble.innerText = "404 Joke Not Found";
 }, false);

