import * as map from "./map.js";
import * as ajax from "./ajax.js";
import * as fb from "./firebase.js";

// I. Variables & constants
// NB - it's easy to get [longitude,latitude] coordinates with this tool: http://geojson.io/
const lnglatNYS = [-75.71615970715911, 43.025810763917775];
const lnglatUSA = [-98.5696, 39.8282];

let geojson;

let favoriteIds = ["p20", "p180"];

let current;

let app;

// II. Functions
const setupUI = () => {
	// NYS Zoom 5.2
	document.querySelector("#btn1").onclick = () =>{
		map.setZoomLevel(5.2);
		map.setPitchAndBearing(0,0);
		map.flyTo(lnglatNYS);
	}
	// NYS isometric view
	document.querySelector("#btn2").onclick = () =>{
		map.setZoomLevel(5.5);
		map.setPitchAndBearing(45,0);
		map.flyTo(lnglatNYS);
	}
	// World zoom 0
	document.querySelector("#btn3").onclick = () =>{
		map.setZoomLevel(3);
		map.setPitchAndBearing(0,0);
		map.flyTo(lnglatUSA);
	}
	fb.init();

	document.querySelector("#favorite").addEventListener("click", () => {
		let index = favoriteIds.findIndex(num => num == current);
		if(index == -1){
			favoriteIds.push(current);
			fb.incrementLikes(current);
		}
		else{
			favoriteIds.splice(index, 1);
			fb.decrementLikes(current);
		}
		refreshFavorites();
		refreshFavoritesButton();
	})
	checkLocalStorage();
}

const init = () => {
	map.initMap(lnglatNYS);
	ajax.downloadFile("data/parks.geojson", (str) =>{
		geojson = JSON.parse(str);
		console.log(geojson);
		map.addMarkersToMap(geojson, showFeatureDetails);
		setupUI();
	});
	fb.init();
};

const showFeatureDetails = id => {
	console.log(`showFeatureDetails - id=${id}`);
	const feature = getFeatureById(id);
	document.querySelector("#details-1").innerHTML = `Info for ${feature.properties.title}`;
	document.querySelector("#details-2").innerHTML = `<p>Address: ${feature.properties.address}</p>
	    <p>Phone: <a href="tel:${feature.properties.phone}">${feature.properties.phone}</a></p>
		<p>Website: <a href="${feature.properties.url}"> ${feature.properties.url}</a></p>`;
	document.querySelector("#details-3").innerHTML = feature.properties.description;

	current = id;

	refreshFavoritesButton();
};

const refreshFavoritesButton = () =>{
	const fav = document.querySelector("#favorite");
	if(favoriteIds.findIndex(num => num == current) > -1){
		fav.innerHTML = `<i class="fas fa-x"></i>Remove from favorites `;
	}
	else{
		fav.innerHTML = `<i class="fas fa-star"></i>Add to favorites`;
	}
}

const getFeatureById = (id) => geojson.features.find(feature => feature.id == id);

const refreshFavorites = () =>{
	const favoritesContainer = document.querySelector("#favorites-list");
	favoritesContainer.innerHTML = "";
	for (const id of favoriteIds){
		favoritesContainer.appendChild(createFavoriteElement(id));
	};
	localStorage.setItem("favorites", favoriteIds)
};

const createFavoriteElement = id =>{
	const feature = getFeatureById(id);
	const a = document.createElement("a");
	a.className = "panel-block";
	a.id = feature.id;
	a.onclick = () =>{
		showFeatureDetails(a.id);
		map.setZoomLevel(6);
		map.flyTo(feature.geometry.coordinates);
	};
	a.innerHTML = `
		<span class="panel-icon">
			<i class="fas fa-map-pin"></i>
		</span>
		${feature.properties.title}
	`;
	return a;
};

const checkLocalStorage = () =>{
	const toString = localStorage.getItem("favorites");
	const idArray = toString.split(",");

	favoriteIds = idArray.map(item => item);
	if(idArray != "" ){
		refreshFavorites();
	}

	if(favoriteIds.length == 1 && favoriteIds[0] == ""){
		favoriteIds = [];
	}
}
  
init();