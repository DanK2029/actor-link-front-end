import {baseUrl, apiKeyMap, } from './constants.js';
const fetch = require("node-fetch");
import 
async function getMoviesFromActor(actorId) {
    requestString = baseUrl + "/person/" + actorId + "/credits?" + apiKeyMap;
    let movieIds = [];
    let response = await fetch(requestString);
    let json = await response.json();
    
    let r = json["cast"];
    for (let i = 0; i < r.length; i++) {
        movieIds.push(r[i]["id"]);
    }
    return movieIds;
}

async function getActorsFromMovie(movieId) {
    requestString = baseUrl + "/movie/" + movieId + "/credits?" + apiKeyMap;
    let actorIds = [];
    let response = await fetch(requestString);
    let json = await response.json();
    
    let r = json["cast"];
    for (let i = 0; i < r.length; i++) {
        actorIds.push(r[i]["id"]);
    }
    return actorIds;
}


// return a map of 
async function getActorsOneMovieAway(actorId) {
    let actorIdsToMovieId = new Map();
    movieIds = await getMoviesFromActor(actorId);
    for (movieId of movieIds) {
        actorsForMovieId = await getActorsFromMovie(movieId);
        actorsForMovieId.forEach(actor => actorIdsToMovieId[actor] = movieId);
    }
    return actorIdsToMovieId;
}

async function testGetActorsOneMovieAway() {
    actorsSharingMoviesWithGeorgeLucas = await getActorsOneMovieAway(1);
    markHamillId = '2';
    console.log(actorsSharingMoviesWithGeorgeLucas);
    console.log(actorsSharingMoviesWithGeorgeLucas[markHamillId]);
    console.log(markHamillId in actorsSharingMoviesWithGeorgeLucas);  
}
// testGetActorsOneMovieAway();

async function getProfileForActor(actorId) {
    requestString = baseUrl + "/person/" + actorId + "?" + apiKeyMap;
    let response = await fetch(requestString);
    let json = await response.json();
    return imageBaseUrl + json["profile_path"];
}

async function getPosterForMovie(movieId) {
    requestString = baseUrl + "/movie/" + movieId + "?" + apiKey;
    let response = await fetch(requestString);
    let json = await response.json();
    return imageBaseUrl + json["poster_path"];
}

async function testGetImages() {
    georgeLucasId = 1;
    fightClubId = 550;
    georgeLucasProfileUrl = await getProfileForActor(georgeLucasId);
    fightClubPosterUrl = await getPosterForMovie(fightClubId);
    console.log(georgeLucasProfileUrl);
    console.log(fightClubPosterUrl);

}


async function shortestPathBetween(actorOneId, actorTwoId) {
    validateSearch();
    counter = 1;
    path = [];
    currentActorOneId = actorOneId;
    currentActorTwoId = actorTwoId;
    while (true) {
        adjacentOne = await getActorsOneMovieAway(currentActorOneId);
        adjacentTwo = await getActorsOneMovieAway(currentActorTwoId);
        intersect = new Set([...adjacentOne].filter(actor => adjacentTwo.has(actor)));
        if (intersect.size > 0) {
            path.push({
                "actor": intersect[0]
            })
        }
    }
}

function validateSearch(actorOneId, actorTwoId) {
    if (actorOneId == actorTwoId) {
        throw "Please enter two different actors.";
    }
}


async function getMostLikelyActorIdFromName(actorName) {
    requestString = baseUrl + "/search/person/?query=" + actorName + "&" + apiKeyMap;
    let response = await fetch(requestString);
    let json = await response.json();
    return json["results"][0]["id"];
}

async function suggestActorsDuringTyping(actorName) {
    if (actorName.length < 2) return [];
    requestString = baseUrl + "/search/person/?query=" + actorName + "&" + apiKeyMap;
    let response = await fetch(requestString);
    let json = await response.json();
    suggested = []
    results = json["results"]
    for (let i = 0; i < 5 && i < results.length; i++) {
        suggested.push(results[i]["name"])
    }
    return suggested;
}


