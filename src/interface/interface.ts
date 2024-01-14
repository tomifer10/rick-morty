export interface MyCustomElements {
  mainContainer: HTMLElement | null;
}

const mainContainer: HTMLElement | null =
  document.querySelector(".episode-container");

if (mainContainer) {
  console.log("elemento encontrado");
} else {
  console.error("No se ha encontrado el id");
}
console.log(mainContainer);
//Una interface es un tipo de esquema de como seria el dato devuelto por le fetch
// Debemos conocer la estructura del JSON
export interface listEpisodes {
  count: number;
  next: string | null;
  previous: string | null;
  results: {
    id: number;
    name: string;
    air_date: string;
    episode: string;
    characters: string[];
  }[];
}

export interface character {
  id: number;
  name: string;
  image: string;
}
