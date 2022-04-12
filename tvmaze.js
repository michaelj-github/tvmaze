"use strict";

const $showsList = $("#showsList");
const $episodesArea = $("#episodesArea");
const $searchForm = $("#searchForm");


/** Given a search term, search for tv shows that match that query.
 *
 *  Returns (promise) array of show objects: [show, show, ...].
 *    Each show object should contain exactly: {id, name, summary, image}
 *    (if no image URL given by API, put in a default image URL)
 */

async function getShowsByTerm(searchFor) {
  // ADD: Remove placeholder & make request to TVMaze search shows API.
  // console.log("Search for = ", searchFor);
  const theResponse = await axios.get(`https://api.tvmaze.com/search/shows?q= ${searchFor} `);
  //   console.log(theResponse);
  //   console.log(theResponse.data);
  // console.log(theResponse.data.length);
  // console.log("Show ID = ", theResponse.data[0].show.id);
  // console.log("Show Image = ", theResponse.data[0].show.image.medium);
const returnArray = [];
for (let aResponse of theResponse.data){
  // console.log(aResponse.show.image.medium);
// check if image.medium exists
  returnArray.push({
    id: aResponse.show.id,
    name: aResponse.show.name,
    summary: `${aResponse.show.summary}`,
    image: `${aResponse.show.image.medium}`
  });

}
// console.log(returnArray);
return returnArray;
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
             <button class="getEpisodes">
               Get Episodes
             </button>
           </div>
         </div>
       </div>
      `);
let theShow = $show;
      // console.log("4. the show = ", theShow);
    $showsList.append($show);
  }
  // $episodesArea.show();
}

/** Handle search form submission: get shows from API and display.
 *    Hide episodes area (that only gets shown if they ask for episodes)
 */

async function searchForShowAndDisplay() {
  const term = $("#search-query").val();
  const shows = await getShowsByTerm(term);
  const clearInputBox = document.querySelector("#search-query");
  clearInputBox.value = '';
// console.log("2. shows = ", shows);
  $episodesArea.hide();
  populateShows(shows);
}

// $searchForm.on("submit", async function (evt) {
$("#search-form").on("submit", async function(evt) {
  evt.preventDefault();
  // console.log("1. submit");
  let theSearch = $("#search-query").val();
  if (theSearch.length >= 1) {
    // console.log("The search term = ", theSearch);
    await searchForShowAndDisplay();
  }
  // await searchForShowAndDisplay();
});


/** Given a show ID, get from API and return (promise) array of episodes:
 *      { id, name, season, number }
 */

// async function getEpisodesOfShow(id) { }

/** Write a clear docstring for this function... */

// function populateEpisodes(episodes) { }
