"use strict";

const $showsList = $("#showsList");
const $episodesArea = $("#episodesArea");
const $searchForm = $("#searchForm");
const noTVImage = "https://tinyurl.com/tv-missing";

/** Given a search term, search for tv shows that match that query.
 *
 *  Returns (promise) array of show objects: [show, show, ...].
 *    Each show object should contain exactly: {id, name, summary, image}
 *    (if no image URL given by API, put in a default image URL)
 */

async function getShowsByTerm(searchFor) {
  try {
    const theResponse = await axios.get(`https://api.tvmaze.com/search/shows?q= ${searchFor} `);
    // use this for testing the default image
    // if(!!theResponse.data[0].show.image.medium) {
    //   delete theResponse.data[0].show.image.medium;
    // }
  const returnArray = [];
  for (let aResponse of theResponse.data){
    let theImage = "";
    if(!aResponse.show.image) {
      theImage = noTVImage;
    } else {
      if(!aResponse.show.image.medium) {
          theImage = noTVImage;
      } else {
        theImage = aResponse.show.image.medium;
      }
    }
    let theSummary = "<p>No summary is available.</p>";
    if (!!aResponse.show.summary) {
      theSummary = aResponse.show.summary
    }
    returnArray.push({
      id: aResponse.show.id,
      name: aResponse.show.name,
      summary: theSummary,
      image: theImage
    });
  }
  return returnArray;
} catch (e) {
  // const $theErrorMessage = $(`<p class="elementFont03">An Error Occurred. Please try again later.</p>`);
const $theErrorMessage = $(`<p class="elementFont03">An Error Occurred. Please try again later.</p>`);
$showsList.empty();
$showsList.append($theErrorMessage);
}
}

/** Given list of shows, create markup for each and to DOM */

function populateShows(shows) {
  $showsList.empty();
  // console.log("3. shows = ", shows);
  for (let show of shows) {
    const $show = $(
        `<div data-show-id="${show.id}" class="Show col-md-12 col-lg-6 mb-4">
         <div class="media">
           <img
              src="${show.image}"
              alt="${show.name}"
              class="w-25 mr-3">
           <div class="media-body">
             <h5 class="text-primary">${show.name}</h5>
             <div><small>${show.summary}</small></div>
             <div id=eDiv${show.id}>
             <button class=getEpisodes id = b${show.id}>
               Get Episodes
             </button>
              <p id=p${show.id} class="elementViewOff">Episodes</p>
             <ul id=eUl${show.id}></ul>
             </div>
           </div>
         </div>
       </div>
      `);
    $showsList.append($show);
    $( "button" ).data( "show", show.id );
  }
}

/** Handle search form submission: get shows from API and display.
 *    Hide episodes area (that only gets shown if they ask for episodes)
 */

async function searchForShowAndDisplay() {
  const term = $("#search-query").val();
  const shows = await getShowsByTerm(term);
  const clearInputBox = document.querySelector("#search-query");
  clearInputBox.value = '';
  // console.log(returnArray.length);
  populateShows(shows);
}

$("#search-form").on("submit", async function(evt) {
  evt.preventDefault();
  let theSearch = $("#search-query").val();
  if (theSearch.length >= 1) {
    await searchForShowAndDisplay();
  }
});


/** Given a show ID, get from API and return (promise) array of episodes:
 *      { id, name, season, number }
 */
 $("#showsList").on("click", ".getEpisodes", async function(e) {
   e.preventDefault();
let theSearch = e.target.id;
  // console.log("target = ", e.target.id, theSearch);
    $(`#eUl${theSearch.slice(1)}`).children().remove();
    if (document.querySelector(`#${theSearch}`).innerHTML === "Hide Episodes") {
      document.querySelector(`#${theSearch}`).innerHTML = "Get Episodes";
      document.querySelector(`#p${theSearch.slice(1)}`).classList.remove("elementViewOn");
      document.querySelector(`#p${theSearch.slice(1)}`).classList.add("elementViewOff");
    } else {
      await getSomeEpisode(theSearch);
    }
 });

async function getSomeEpisode(searchFor) {
  try {
    const theResponse = await axios.get(`https://api.tvmaze.com/shows/${searchFor.slice(1)}/episodes`);
    if (theResponse.data.length > 0) {
      for (let aResponse of theResponse.data) {
        displayEpisodes(searchFor.slice(1), aResponse.name, aResponse.season, aResponse.number);
        document.querySelector(`#p${searchFor.slice(1)}`).classList.remove("elementViewOff");
        document.querySelector(`#p${searchFor.slice(1)}`).classList.add("elementViewOn");
        document.querySelector(`#p${searchFor.slice(1)}`).classList.add("elementFont02");
      }
    document.querySelector(`#${searchFor}`).innerHTML = "Hide Episodes";
  } else {
    document.querySelector(`#p${searchFor.slice(1)}`).innerHTML = "No episodes are available.";
    document.querySelector(`#p${searchFor.slice(1)}`).classList.remove("elementViewOff");
    document.querySelector(`#p${searchFor.slice(1)}`).classList.add("elementViewOn");
    document.querySelector(`#p${searchFor.slice(1)}`).classList.add("elementFont02");
    document.querySelector(`#${searchFor}`).classList.add("elementViewOff");
  }
} catch (e) {
  document.querySelector(`#p${searchFor.slice(1)}`).innerHTML = "No episodes could be found.";
  document.querySelector(`#p${searchFor.slice(1)}`).classList.remove("elementViewOff");
  document.querySelector(`#p${searchFor.slice(1)}`).classList.add("elementViewOn");
  document.querySelector(`#p${searchFor.slice(1)}`).classList.add("elementFont02");
  document.querySelector(`#${searchFor}`).classList.add("elementViewOff");
}

}

/** Write a clear docstring for this function... */

// function populateEpisodes(episodes) { }
function displayEpisodes(episodes, theName, theSeason, theNumber) {
  const theUl = document.querySelector(`#eUl${episodes}`);
  theUl.append(makeEpisodeLi(`${theName} (season ${theSeason}, number ${theNumber})`));
}

function makeEpisodeLi(episodes) {
  const aNewLi = document.createElement('li');
  aNewLi.innerHTML = episodes;
  return aNewLi;
}
