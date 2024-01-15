"use strict";
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
const episodeOneBtn = document.querySelector("#e1");
function fetchEpisodes() {
    return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        const url = "https://rickandmortyapi.com/api/episode";
        xhr.open("GET", url, true);
        xhr.onreadystatechange = function () {
            if (xhr.readyState === 4) {
                if (xhr.status === 200) {
                    try {
                        const response = JSON.parse(xhr.responseText);
                        const episodes = response.results;
                        resolve(episodes);
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
                            name: response.name,
                            status: response.status,
                            species: response.species,
                            type: response.tpye,
                            gender: response.gender,
                            origin: response.origin,
                            image: response.image,
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
        container.innerHTML = `
  <h2>Episode ${episode.id}: ${episode.name}</h2>
  <p>Air Date: ${episode.air_date}</p>
  <p>Episode Code: ${episode.episode}</p>
  <p>Characters:</p>`;
        try {
            for (const characterUrl of episode.characters) {
                const characterInfo = yield fetchCharacterInfo(characterUrl);
                container.innerHTML += `<div class="character-card">
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
        var _a;
        const clickedElement = event.target;
        if (clickedElement.tagName === "LI") {
            const episodeId = parseInt(((_a = clickedElement.textContent) === null || _a === void 0 ? void 0 : _a.split(" ")[1]) || "", 10);
            const selectedEpisode = episodes.find((episode) => episode.id === episodeId);
            if (selectedEpisode) {
                if (episodeDetailsContainer instanceof HTMLElement) {
                    displayEpisodeDetails(selectedEpisode, episodeDetailsContainer);
                }
            }
        }
    }));
})
    .catch((error) => {
    console.error("Error:", error);
});
//# sourceMappingURL=script.js.map