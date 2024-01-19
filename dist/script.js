var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const episodesList = document.querySelector(".nav-container");
const characterInfoContainer = document.querySelector(".character-list-container");
const welcomeContainer = document.querySelector(".welcome-container");
const episodeDatas = document.querySelector(".episode-datas");
function hideWelcomeContainer(container) {
    container.innerHTML = "";
}
let episodes = [];
function fetchEpisodes() {
    return __awaiter(this, void 0, void 0, function* () {
        const allEpisodes = [];
        const fetchPage = (pageNumber) => __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield fetch(`https://rickandmortyapi.com/api/episode?page=${pageNumber}`);
                const data = yield response.json();
                allEpisodes.push(...data.results);
            }
            catch (error) {
                console.error(`Error fetching episodes for page ${pageNumber}:`, error);
                throw error;
            }
        });
        try {
            yield Promise.all([1, 2, 3].map(fetchPage));
        }
        catch (error) {
            console.error("Error fetching episodes:", error);
        }
        episodesList.innerHTML = "";
        allEpisodes.forEach((episode) => {
            const listItem = document.createElement("li");
            listItem.textContent = `${episode.episode}`;
            listItem.setAttribute("data-episode", episode.episode.toString());
            episodesList === null || episodesList === void 0 ? void 0 : episodesList.appendChild(listItem);
        });
        return allEpisodes;
    });
}
function fetchCharacterInfo(url) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const response = yield fetch(url);
            if (!response.ok) {
                throw new Error(`Request failed with status ${response.status}`);
            }
            const characterInfo = yield response.json();
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
        }
        catch (error) {
            console.error(`Error fetching character info from ${url}:`, error);
            throw error;
        }
    });
}
function fetchCharactersInfo(characterUrl) {
    return __awaiter(this, void 0, void 0, function* () {
        const characterPromises = characterUrl.map(fetchCharacterInfo);
        return Promise.all(characterPromises);
    });
}
function displayEpisodeDetails(episode, container) {
    return __awaiter(this, void 0, void 0, function* () {
        episodeDatas.innerHTML = ` 
  <h2>Episode ${episode.id}: ${episode.name}</h2>
  <p>Air Date: ${episode.air_date}</p>
  <p>Episode Code: ${episode.episode}</p>
  <p>Characters:</p>
  `;
        try {
            const characterInfoArray = yield fetchCharactersInfo(episode.characters);
            for (const characterInfo of characterInfoArray) {
                container.innerHTML += `<div class="character-card" character-id="${characterInfo.id}">
      <img src=${characterInfo.image} alt=${characterInfo.name}/>
      <p>${characterInfo.name}</p>
      <p>Status: ${characterInfo.status}</p>
      <p> Species: ${characterInfo.species}</p>
      <button> View </button>
      </div>`;
            }
        }
        catch (error) {
            console.error("Error fetching characters information:", error);
        }
    });
}
fetchEpisodes()
    .then((episodes) => {
    console.log("Fetched episodes:", episodes);
    characterInfoContainer.addEventListener("click", (event) => {
        event.preventDefault();
    });
    episodesList === null || episodesList === void 0 ? void 0 : episodesList.addEventListener("click", (event) => __awaiter(void 0, void 0, void 0, function* () {
        const clickedElement = event.target;
        if (clickedElement.tagName === "LI") {
            const episodeCode = clickedElement.dataset.episode;
            const selectedEpisode = episodes.find((episode) => episode.episode === episodeCode);
            if (selectedEpisode) {
                if (characterInfoContainer instanceof HTMLElement) {
                    displayEpisodeDetails(selectedEpisode, characterInfoContainer);
                    hideWelcomeContainer(welcomeContainer);
                }
            }
        }
    }));
})
    .catch((error) => {
    console.error("Error:", error);
});
document.addEventListener("click", (event) => {
    const clickedElement = event.target;
    if (clickedElement.classList.contains("character-card")) {
        event.preventDefault();
        const characterCards = document.querySelectorAll(".character-card");
        characterCards.forEach((card) => card.classList.add("hidden"));
        episodeDatas.innerHTML = " ";
    }
});
function showSelectedCharacter(characterId) {
    return __awaiter(this, void 0, void 0, function* () {
        const episodeContainer = document.querySelector(".episode-container");
        if (!episodeContainer)
            return;
        try {
            const selectedCharacterInfo = yield fetchCharacterInfo(`https://rickandmortyapi.com/api/character/${characterId}`);
            console.log(fetchCharacterInfo);
            const episodeNames = [];
            for (const episodeUrl of selectedCharacterInfo.episode) {
                const episodeData = yield fetch(episodeUrl);
                const episodeJson = yield episodeData.json();
                episodeNames.push(episodeJson.name);
            }
            console.log(selectedCharacterInfo);
            const characterDiv = document.createElement("div");
            characterDiv.classList.add("selected-character-container");
            characterDiv.innerHTML = `
      <img src=${selectedCharacterInfo.image} alt=${selectedCharacterInfo.name}/>
      <h2>${selectedCharacterInfo.name}</h2>
      <p>Status: ${selectedCharacterInfo.status}</p>
      <p>Species: ${selectedCharacterInfo.species}</p>
      <p>Type: ${selectedCharacterInfo.type}</p>
      <p>Gender: ${selectedCharacterInfo.gender}</p>
      <p>Origin: ${selectedCharacterInfo.origin.name}</p>
      <p>Location: ${selectedCharacterInfo.location.name}</p>
      <p>Episodes: ${episodeNames.join(", ")}</p>
    `;
            episodeContainer.innerHTML = "";
            episodeContainer.appendChild(characterDiv);
        }
        catch (error) {
            console.error("Error fetching character information:", error);
        }
    });
}
document.addEventListener("click", (event) => {
    const clickedElement = event.target;
    if (clickedElement.classList.contains("character-card")) {
        event.preventDefault();
        const characterId = parseInt(clickedElement.getAttribute("character-id") || "0");
        showSelectedCharacter(characterId);
    }
});
characterInfoContainer.addEventListener("click", (event) => {
    event.preventDefault();
});
export {};
//# sourceMappingURL=script.js.map