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
const episodesList = document.querySelector(".nav-container");
const episodeName = document.querySelector(".episode-title");
const episodeDetailsContainer = document.querySelector(".episode-container");
const episodeOneBtn = document.querySelector("#e1");

// Function to fetch episodes from the api using ajax
function fetchEpisodes(): Promise<Episode[]> {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    const url = "https://rickandmortyapi.com/api/episode";

    xhr.open("GET", url, true);

    xhr.onreadystatechange = function () {
      if (xhr.readyState === 4) {
        if (xhr.status === 200) {
          try {
            const response = JSON.parse(xhr.responseText);
            const episodes: Episode[] = response.results;
            resolve(episodes);
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

function fetchCharacterInfo(
  url: string
): Promise<{ name: string; image: string }> {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open("GET", url, true);

    xhr.onreadystatechange = function () {
      if (xhr.readyState === 4) {
        if (xhr.status === 200) {
          try {
            const response = JSON.parse(xhr.responseText);
            const characterInfo = {
              name: response.name,
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
      xhr.onerror = function () {
        reject(new Error("Network error"));
      };
      xhr.send();
    };
  });
}

async function displayEpisodeDetails(episode: Episode, container: HTMLElement) {
  container.innerHTML = `
  <h2>Episode ${episode.id}: ${episode.name}</h2>
  <p>Air Date: ${episode.air_date}</p>
  <p>Episode Code: ${episode.episode}</p>
  <p>Characters:</p>`;

  for (const characterUrl of episode.characters) {
    console.log("Character URl:", characterUrl);
    try {
      const { name, image } = await fetchCharacterInfo(characterUrl);
      container.innerHTML += `
      <div>
        <img src="${image}" alt="${name}"/>
        <p>${name}</p>`;
    } catch (error) {
      console.error("Error fetching character information:", error);
    }
  }
}

fetchEpisodes()
  .then((episodes) => {
    console.log("Fetched episodes:", episodes);

    episodesList?.addEventListener("click", (event) => {
      const clickedElement = event.target as HTMLElement;

      if (clickedElement.tagName === "LI") {
        const episodeId = parseInt(
          clickedElement.textContent?.split(" ")[1] || ""
        );
        const selectedEpisode = episodes.find(
          (episode) => episode.id === episodeId
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
