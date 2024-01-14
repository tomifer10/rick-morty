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
            xhr.onerror = function () {
                reject(new Error("Network error"));
            };
            xhr.send();
        };
    });
}
function displayEpisodeDetails(episode, container) {
    return __awaiter(this, void 0, void 0, function* () {
        container.innerHTML = `
  <h2>Episode ${episode.id}: ${episode.name}</h2>
  <p>Air Date: ${episode.air_date}</p>
  <p>Episode Code: ${episode.episode}</p>
  <p>Characters:</p>`;
        for (const characterUrl of episode.characters) {
            console.log("Character URl:", characterUrl);
            try {
                const { name, image } = yield fetchCharacterInfo(characterUrl);
                container.innerHTML += `
      <div>
        <img src="${image}" alt="${name}"/>
        <p>${name}</p>`;
            }
            catch (error) {
                console.error("Error fetching character information:", error);
            }
        }
    });
}
fetchEpisodes()
    .then((episodes) => {
    console.log("Fetched episodes:", episodes);
    episodesList === null || episodesList === void 0 ? void 0 : episodesList.addEventListener("click", (event) => {
        var _a;
        const clickedElement = event.target;
        if (clickedElement.tagName === "LI") {
            const episodeId = parseInt(((_a = clickedElement.textContent) === null || _a === void 0 ? void 0 : _a.split(" ")[1]) || "");
            const selectedEpisode = episodes.find((episode) => episode.id === episodeId);
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
//# sourceMappingURL=script.js.map