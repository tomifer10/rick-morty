// Define Type for episode data
type Episode = {
  id: number;
  name: string;
  air_date: string;
  episode: string;
  characters: string[];
  url: string;
  created: string;
};

type CharacterInfos = {
  name: string;
  status: string;
  species: string;
  type: string;
  gender: string;
  origin: {}[];
  image: string;
};
const episodesList: HTMLUListElement =
  document.querySelector(".nav-container")!;
const episodeName = document.querySelector(".episode-title");
const episodeDetailsContainer = document.querySelector(".episode-container");
const episodeOneBtn = document.querySelector("#e1");

// Function to fetch episodes from the api using ajax
async function fetchEpisodes(): Promise<Episode[]> {
  const allEpisodes: Episode[] = [];

  async function fetchPage(pageNumber: number): Promise<void> {
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      const url = `https://rickandmortyapi.com/api/episode?page=${pageNumber}`;
      xhr.open("GET", url, true);

      xhr.onreadystatechange = function () {
        if (xhr.readyState === 4) {
          if (xhr.status === 200) {
            try {
              const response = JSON.parse(xhr.responseText);
              const episodes: Episode[] = response.results;
              allEpisodes.push(...episodes);
              resolve();
            } catch (error) {
              reject(error);
            }
          } else {
            reject(new Error("Request failed with status ${xhr.status"));
          }
        }
      };
      xhr.onerror = function () {
        reject(new Error("Network error"));
      };
      xhr.send();
    });
  }
  try {
    await fetchPage(1);
    await fetchPage(2);
    await fetchPage(3);
  } catch (error) {
    console.error("Error fetching episodes:", error);
  }

  episodesList.innerHTML = "";

  allEpisodes.forEach((episode) => {
    const listItem = document.createElement("li");
    listItem.textContent = `${episode.episode}`;
    listItem.setAttribute("data-episode", episode.episode.toString());
    episodesList?.appendChild(listItem);
  });
  return allEpisodes;
}

function fetchCharacterInfo(url: string): Promise<CharacterInfos> {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open("GET", url, true);
    xhr.onreadystatechange = function () {
      if (xhr.readyState === 4) {
        if (xhr.status === 200) {
          try {
            const response = JSON.parse(xhr.responseText);
            const characterInfo: CharacterInfos = {
              name: response.name,
              status: response.status,
              species: response.species,
              type: response.type,
              gender: response.gender,
              origin: response.origin,
              image: response.image,
            };
            resolve(characterInfo);
          } catch (error: any) {
            reject(
              new Error(`Error parsing character response: ${error.message}`)
            );
          }
        } else {
          reject(new Error(`Request failed with status ${xhr.status}`));
        }
      }
    };
    xhr.onerror = function () {
      reject(new Error("Network error"));
    };
    xhr.send();
  });
}

//FUNCTION TO FETCH INFORMATION FORAN ARRAY OF CHARACTER URL
async function fetchCharactersInfo(
  characterUrl: string[]
): Promise<CharacterInfos[]> {
  const characterPromises: Promise<CharacterInfos>[] =
    characterUrl.map(fetchCharacterInfo);
  return Promise.all(characterPromises);
}

async function displayEpisodeDetails(episode: Episode, container: HTMLElement) {
  container.innerHTML = `
  <h2>Episode ${episode.id}: ${episode.name}</h2>
  <p>Air Date: ${episode.air_date}</p>
  <p>Episode Code: ${episode.episode}</p>
  <p>Characters:</p>`;

  try {
    const characterInfoArray = await fetchCharactersInfo(episode.characters);
    for (const characterInfo of characterInfoArray) {
      container.innerHTML += `<div class="character-card">
      <img src=${characterInfo.image} alt=${characterInfo.name}/>
      <p>${characterInfo.name}</p>
      <p>Status: ${characterInfo.status}</p>
      <p> Species: ${characterInfo.species}</p>
      </div>`;
    }
  } catch (error) {
    console.error("Error fetching characters information:", error);
  }
}

fetchEpisodes()
  .then((episodes) => {
    console.log("Fetched episodes:", episodes);

    episodesList?.addEventListener("click", async (event) => {
      const clickedElement = event.target as HTMLElement;

      if (clickedElement.tagName === "LI") {
        const episodeCode = clickedElement.dataset.episode;
        const selectedEpisode = episodes.find(
          (episode) => episode.episode === episodeCode
        );

        if (selectedEpisode) {
          if (episodeDetailsContainer instanceof HTMLElement) {
            displayEpisodeDetails(selectedEpisode, episodeDetailsContainer);
          }
        }
      }
    });
  })
  .catch((error) => {
    console.error("Error:", error);
  });
