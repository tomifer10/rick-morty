import { Episode, CharacterInfos, Location, Seasons } from "./types/interface";

const episodesList: HTMLUListElement =
  document.querySelector(".nav-container")!;
const characterInfoContainer = document.querySelector(
  ".character-list-container"
) as HTMLElement;
const welcomeContainer = document.querySelector(
  ".welcome-container"
) as HTMLElement;
const episodeDatas = document.querySelector(".episode-datas") as HTMLElement;

function hideWelcomeContainer(container: HTMLElement): void {
  container.innerHTML = ""; // Clear the content
}

let episodes: Episode[] = [];
async function fetchEpisodes(): Promise<Episode[]> {
  const allEpisodes: Episode[] = [];

  const fetchPage = async (pageNumber: number): Promise<void> => {
    try {
      const response = await fetch(
        `https://rickandmortyapi.com/api/episode?page=${pageNumber}`
      );
      const data = await response.json();
      allEpisodes.push(...data.results);
    } catch (error) {
      console.error(`Error fetching episodes for page ${pageNumber}:`, error);
      throw error; // Propagate the error to the outer catch block
    }
  };
  try {
    await Promise.all([1, 2, 3].map(fetchPage));
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

async function fetchCharacterInfo(url: string): Promise<CharacterInfos> {
  try {
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`Request failed with status ${response.status}`);
    }

    const characterInfo: CharacterInfos = await response.json();

    return {
      id: characterInfo.id,
      name: characterInfo.name,
      status: characterInfo.status,
      species: characterInfo.species,
      type: characterInfo.type,
      gender: characterInfo.gender,
      origin: characterInfo.origin,
      location: characterInfo.location,
      image: characterInfo.image,
      episode: characterInfo.episode,
      url: characterInfo.url,
      created: characterInfo.created,
    };
  } catch (error) {
    console.error(`Error fetching character info from ${url}:`, error);
    throw error;
  }
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
  episodeDatas.innerHTML = ` 
  <h2>Episode ${episode.id}: ${episode.name}</h2>
  <p>Air Date: ${episode.air_date}</p>
  <p>Episode Code: ${episode.episode}</p>
  <p>Characters:</p>
  `;

  try {
    const characterInfoArray = await fetchCharactersInfo(episode.characters);
    for (const characterInfo of characterInfoArray) {
      container.innerHTML += `<div class="character-card" character-id="${characterInfo.id}">
      <img src=${characterInfo.image} alt=${characterInfo.name}/>
      <p>${characterInfo.name}</p>
      <p>Status: ${characterInfo.status}</p>
      <p> Species: ${characterInfo.species}</p>
      <button> View </button>
      </div>`;
    }
  } catch (error) {
    console.error("Error fetching characters information:", error);
  }
}

fetchEpisodes()
  .then((episodes) => {
    console.log("Fetched episodes:", episodes);

    // Prevent default behavior for clicks inside characterInfoContainer
    characterInfoContainer.addEventListener("click", (event) => {
      event.preventDefault();
    });

    // Add a new event listener specifically for episodesList
    episodesList?.addEventListener("click", async (event) => {
      const clickedElement = event.target as HTMLElement;

      if (clickedElement.tagName === "LI") {
        const episodeCode = clickedElement.dataset.episode;
        const selectedEpisode = episodes.find(
          (episode) => episode.episode === episodeCode
        );

        if (selectedEpisode) {
          if (characterInfoContainer instanceof HTMLElement) {
            displayEpisodeDetails(selectedEpisode, characterInfoContainer);
            hideWelcomeContainer(welcomeContainer);
          }
        }
      }
    });
  })
  .catch((error) => {
    console.error("Error:", error);
  });

document.addEventListener("click", (event) => {
  const clickedElement = event.target as HTMLElement;

  // Ocultar character-cards al hacer clic en una
  if (clickedElement.classList.contains("character-card")) {
    event.preventDefault();
    const characterCards = document.querySelectorAll(".character-card");
    characterCards.forEach((card) => card.classList.add("hidden"));

    // Ocultar episodeDatas
    episodeDatas.innerHTML = " ";
  }

  // Mostrar todo nuevamente al hacer clic en cualquier otro luga
});

async function showSelectedCharacter(characterId: number) {
  const episodeContainer = document.querySelector(".episode-container");
  if (!episodeContainer) return;

  try {
    // Fetch the selected character by ID
    const selectedCharacterInfo = await fetchCharacterInfo(
      `https://rickandmortyapi.com/api/character/${characterId}`
    );
    console.log(fetchCharacterInfo);

    // Fetch episode names sequentially using the URLs
    const episodeNames = [];
    for (const episodeUrl of selectedCharacterInfo.episode) {
      const episodeData = await fetch(episodeUrl);
      const episodeJson = await episodeData.json();
      episodeNames.push(episodeJson.name);
    }
    console.log(selectedCharacterInfo);

    // Create a new div to hold the selected character information
    const characterDiv = document.createElement("div");
    characterDiv.classList.add("selected-character-container");

    // Display the selected character information in the new div
    characterDiv.innerHTML = `
      <img src=${selectedCharacterInfo.image} alt=${
      selectedCharacterInfo.name
    }/>
      <h2>${selectedCharacterInfo.name}</h2>
      <p>Status: ${selectedCharacterInfo.status}</p>
      <p>Species: ${selectedCharacterInfo.species}</p>
      <p>Type: ${selectedCharacterInfo.type}</p>
      <p>Gender: ${selectedCharacterInfo.gender}</p>
      <p>Origin: ${selectedCharacterInfo.origin.name}</p>
      <p>Location: ${selectedCharacterInfo.location.name}</p>
      <p>Episodes: ${episodeNames.join(", ")}</p>
    `;

    // Replace the content of episode-container with the new div
    episodeContainer.innerHTML = "";
    episodeContainer.appendChild(characterDiv);
  } catch (error) {
    console.error("Error fetching character information:", error);
  }
}
document.addEventListener("click", (event) => {
  const clickedElement = event.target as HTMLElement;

  // Check if the clicked element is a character card
  if (clickedElement.classList.contains("character-card")) {
    // Prevent default behavior
    event.preventDefault();

    // Get the character ID from the clicked card
    const characterId = parseInt(
      clickedElement.getAttribute("character-id") || "0"
    );

    // Show only the selected character card in episode-container
    showSelectedCharacter(characterId);
  }
});
characterInfoContainer.addEventListener("click", (event) => {
  event.preventDefault();
});
