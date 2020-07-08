let baseUrl = "https://api.themoviedb.org/3";
let apiKey = "2075ef90eb9938cbd1598b633dad0740";
let readToken = "eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIyMDc1ZWY5MGViOTkzOGNiZDE1OThiNjMzZGFkMDc0MCIsInN1YiI6IjU5ZjRkMmIxYzNhMzY4MjAxNzAxODEyMiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.fwn5gnhGkIGMuztHZCDnJYTI3ylni79B02HM3ep5wV8";
let headers = {"Authentication": readToken};
let movieCount = 559770;
const fetch = require("node-fetch");

async function getMoviesFromActor(actorId) {
    requestString = baseUrl + "/person/" + actorId + "/credits?api_key=" + apiKey;
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
    requestString = baseUrl + "/movie/" + movieId + "/credits?api_key=" + apiKey;
    console.log(requestString);
    let actorIds = [];
    let response = await fetch(requestString);
    let json = await response.json();
    
    let r = json["cast"];
    for (let i = 0; i < r.length; i++) {
        actorIds.push(r[i]["id"]);
    }
    return actorIds;
}

async function getActorsOneMovieAway(actorId) {
    
    getMoviesFromActor().then(movies => {
        actorIds = Set();
        movies.forEach(movie =>
            getActorsFromMovie(movie).then(actors =>
                actors.forEach(actor => actorIds.add(actor))
            )
        );
        console.log(actorIds);
    });
}

getActorsOneMovieAway(1).then();