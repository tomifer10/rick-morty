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
const episodeName = document.querySelector(".episode-title");
const episodeDetailsContainer = document.querySelector(".episode-container");
const characterInfoContainer = document.querySelector(".character-list-container");
const characterCard = document.querySelector(".character-card");
const welcomeContainer = document.querySelector(".welcome-container");
function toggleVisibility(element) {
    if (element.classList.contains("hidden")) {
        element.classList.remove("hidden");
    }
    else {
        element.classList.add("hidden");
    }
}
function hideWelcomeContainer(container) {
    container.innerHTML = "";
}
let episodes = [];
function fetchEpisodes() {
    return __awaiter(this, void 0, void 0, function* () {
        const allEpisodes = [];
        function fetchPage(pageNumber) {
            return __awaiter(this, void 0, void 0, function* () {
                return new Promise((resolve, reject) => {
                    const xhr = new XMLHttpRequest();
                    const url = `https://rickandmortyapi.com/api/episode?page=${pageNumber}`;
                    xhr.open("GET", url, true);
                    xhr.onreadystatechange = function () {
                        if (xhr.readyState === 4) {
                            if (xhr.status === 200) {
                                try {
                                    const response = JSON.parse(xhr.responseText);
                                    const episodes = response.results;
                                    allEpisodes.push(...episodes);
                                    resolve();
                                }
                                catch (error) {
                                    reject(error);
                                }
                            }
                            else {
                                reject(new Error("Request failed with status ${xhr.status"));
                            }
                        }
                    };
                    xhr.onerror = function () {
                        reject(new Error("Network error"));
                    };
                    xhr.send();
                });
            });
        }
        try {
            yield fetchPage(1);
            yield fetchPage(2);
            yield fetchPage(3);
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
    return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.open("GET", url, true);
        xhr.onreadystatechange = function () {
            if (xhr.readyState === 4) {
                if (xhr.status === 200) {
                    try {
                        const response = JSON.parse(xhr.responseText);
                        const characterInfo = {
                            id: response.id,
                            name: response.name,
                            status: response.status,
                            species: response.species,
                            type: response.type,
                            gender: response.gender,
                            origin: response.origin,
                            location: response.location,
                            image: response.image,
                            episode: response.episode,
                            url: response.url,
                            created: response.created,
                        };
                        resolve(characterInfo);
                    }
                    catch (error) {
                        reject(new Error(`Error parsing character response: ${error.message}`));
                    }
                }
                else {
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
function fetchCharactersInfo(characterUrl) {
    return __awaiter(this, void 0, void 0, function* () {
        const characterPromises = characterUrl.map(fetchCharacterInfo);
        return Promise.all(characterPromises);
    });
}
function displayEpisodeDetails(episode, container) {
    return __awaiter(this, void 0, void 0, function* () {
        container.innerHTML = ` <div class="episodes-datas">
  <h2>Episode ${episode.id}: ${episode.name}</h2>
  <p>Air Date: ${episode.air_date}</p>
  <p>Episode Code: ${episode.episode}</p>
  <p>Characters:</p>
  </div>`;
        try {
            const characterInfoArray = yield fetchCharactersInfo(episode.characters);
            for (const characterInfo of characterInfoArray) {
                container.innerHTML += `<div class="character-card" character-id="${characterInfo.id}">
      <img src=${characterInfo.image} alt=${characterInfo.name}/>
      <p>${characterInfo.name}</p>
      <p>Status: ${characterInfo.status}</p>
      <p> Species: ${characterInfo.species}</p>
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
export {};
//# sourceMappingURL=script.js.map