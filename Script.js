// ======================================
// Weather Dashboard Pro
// Part 1A
// ======================================

// ---------- DOM ELEMENTS ----------

const cityInput = document.getElementById("cityInput");
const searchBtn = document.getElementById("searchBtn");
const locationBtn = document.getElementById("locationBtn");
const darkModeBtn = document.getElementById("darkModeBtn");

const loading = document.getElementById("loading");
const errorBox = document.getElementById("errorBox");

const cityName = document.getElementById("cityName");
const country = document.getElementById("country");
const weatherIcon = document.getElementById("weatherIcon");
const temperature = document.getElementById("temperature");
const condition = document.getElementById("condition");
const dateTime = document.getElementById("dateTime");

const feelsLike = document.getElementById("feelsLike");
const humidity = document.getElementById("humidity");
const wind = document.getElementById("wind");
const pressure = document.getElementById("pressure");
const visibility = document.getElementById("visibility");
const uv = document.getElementById("uv");
const sunrise = document.getElementById("sunrise");
const sunset = document.getElementById("sunset");

const highlights = document.getElementById("highlights");

const forecastContainer =
document.getElementById("forecastContainer");

const historyList =
document.getElementById("historyList");

const copyBtn =
document.getElementById("copyBtn");

const downloadBtn =
document.getElementById("downloadBtn");

const shareBtn =
document.getElementById("shareBtn");

// ---------- STORAGE ----------

let recentCities =
JSON.parse(
localStorage.getItem("recentCities")
) || [];

let currentWeather = null;

// ---------- INITIALIZE ----------

window.onload = function () {

    loadTheme();

    renderHistory();

}

// ---------- EVENTS ----------

searchBtn.addEventListener(
    "click",
    searchCity
);

locationBtn.addEventListener(
    "click",
    getCurrentLocation
);

cityInput.addEventListener(
    "keypress",
    function(e){

        if(e.key==="Enter"){

            searchCity();

        }

    }
);

darkModeBtn.addEventListener(
    "click",
    toggleTheme
);

copyBtn.addEventListener(
    "click",
    copyReport
);

downloadBtn.addEventListener(
    "click",
    downloadReport
);

shareBtn.addEventListener(
    "click",
    shareReport
);

// ---------- LOADING ----------

function showLoading(){

    loading.classList.remove("hidden");

}

function hideLoading(){

    loading.classList.add("hidden");

}

// ---------- ERROR ----------

function showError(message){

    errorBox.classList.remove("hidden");

    errorBox.innerHTML=

    `<p>${message}</p>`;

}

function hideError(){

    errorBox.classList.add("hidden");

}

// ---------- SEARCH CITY ----------

async function searchCity(){

    hideError();

    const city=
    cityInput.value.trim();

    if(city===""){

        showError(
            "Please enter a city."
        );

        return;

    }

    showLoading();

    try{

        const location=
        await getCoordinates(city);

        if(!location){

            hideLoading();

            showError(
                "City not found."
            );

            return;

        }

        await loadWeather(
            location
        );

        addRecentCity(city);

    }

    catch(error){

        console.log(error);

        showError(
            "Unable to fetch weather."
        );

    }

    hideLoading();

}

// ---------- GEOCODING ----------

async function getCoordinates(city){

    const url=

`https://geocoding-api.open-meteo.com/v1/search?name=${city}&count=1&language=en&format=json`;

    const response=
    await fetch(url);

    const data=
    await response.json();

    if(!data.results){

        return null;

    }

    const place=
    data.results[0];

    return{

        city:place.name,

        country:place.country,

        latitude:place.latitude,

        longitude:place.longitude

    };

}

// ---------- GEOLOCATION ----------

function getCurrentLocation(){

    if(!navigator.geolocation){

        showError(
            "Geolocation not supported."
        );

        return;

    }

    showLoading();

    navigator.geolocation.getCurrentPosition(

        async(position)=>{

            const latitude=
            position.coords.latitude;

            const longitude=
            position.coords.longitude;

            await loadWeather({

                city:"Current Location",

                country:"",

                latitude,

                longitude

            });

            hideLoading();

        },

        ()=>{

            hideLoading();

            showError(
                "Unable to access location."
            );

        }

    );

}

// ---------- HISTORY ----------

function addRecentCity(city){

    if(recentCities.includes(city)){

        return;

    }

    recentCities.unshift(city);

    if(recentCities.length>5){

        recentCities.pop();

    }

    localStorage.setItem(

        "recentCities",

        JSON.stringify(recentCities)

    );

    renderHistory();

}

function renderHistory(){

    historyList.innerHTML="";

    recentCities.forEach(city=>{

        const li=
        document.createElement("li");

        li.textContent=city;

        li.onclick=function(){

            cityInput.value=city;

            searchCity();

        }

        historyList.appendChild(li);

    });

}

// ---------- THEME ----------

function toggleTheme(){

    document.body.classList.toggle("dark");

    const mode=

    document.body.classList.contains("dark")

    ? "dark"

    : "light";

    localStorage.setItem(

        "theme",

        mode

    );

}

function loadTheme(){

    const theme=

    localStorage.getItem("theme");

    if(theme==="dark"){

        document.body.classList.add("dark");

    }

}
