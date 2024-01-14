fetch("https://rickandmortyapi.com/api/episode")
  .then((response) => response.json())
  .then((data) => console.log(data));
