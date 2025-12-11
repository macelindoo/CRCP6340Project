//main_sketch.js

//D3:
const svg = d3.select("#viz")
  .append("svg")
  .attr("width", 800)
  .attr("height", 500);

// svg.append("circle")
//   .attr("cx", 400)
//   .attr("cy", 250)
//   .attr("r", 100)
//   .attr("fill", "orange");

 //D3: START WITH STRUCTURING THE DATA 

//D3: Load the CSV data
//d3.csv loads the CSV file. then(function(data)) creates a function that then processes the loaded data.
d3.csv("data/movies_with_moods_FULL_strict_year.csv").then(function(data) {
    //D3: DRAW THE FLOWERS

//First need to group the movies by moodGroup so we can draw flowers based on each one
const moviesByMood = d3.group(moviesWithMood, d => d.moodGroup);
//create a variable to hold the grouped movies by moodGroup
//for each movie object "d" in teh array, return the value of "d.moodGroup" property (ie, genre)

//moviesByMood is a Map:
//"Fun & Lighthearted" => [array of movies in this group]
//"Intense & Exciting" => [array of movies in this group]
//"Serious & Emotional" => [array of movies in this group]
//"Other" => [array of movies that don't fit those groups]

const moodNames = Array.from(moviesByMood.keys());
svg.selectAll("circle.moodFlower")
  .data(moodNames)
  .enter()
  .append("circle")
  .attr("class", "moodFlower")
  .attr("cx", (d, i) => 150 + i * 250) // x position: space them out
  .attr("cy", 250)                     // y position: all on the same row
  .attr("r", 60)                       // radius: size of the flower
  .attr("fill", (d, i) => d3.schemeCategory10[i % 10]) // color
  .attr("stroke", "black");

// Log a few results to check
console.log("First 5 movies with mood groups:", moviesWithMood.slice(0, 5));


  console.log("Loaded movie data:", data);
  //Check the first row:
  console.log("First movie:", data[0]);
});

//D3: Define the 3 Mood Groups
//Each mood group is an array of genre IDs.
//These IDs correspond to the genres defined in the TMDd csv data file.
const moodGroups = {//create an object to hold the mood groups (array of arrays)
    "Fun & Lighthearted": [35, 16, 10749],//Comedy(35), Animation(16), Romance(10749)
    "Intense & Exciting": [28, 878, 53], //Action(28), Sci-Fi(878), Thriller(53)
    "Serious & Emotional": [18, 99, 36] //Drama(18), Documentary(99), History(36)
};

//D3: Need to create a function to filter movies by mood
function getMoodGroup(genre_ids) {
  //genre_ids might be a string like "[35, 16]" or an array (csv file is a text doc so even though it looks like an array, it's actually a string)
  let ids = genre_ids;//create a variable to hold genre_ids
  if (typeof genre_ids === "string") {//If genre_ids is a string, convert it to an array
    ids = genre_ids.replace(/\\[|\\]|\\s/g, '').split(',').map(Number);//remove brackets and whitespace, split by comma, and convert to numbers
  }
  //Loop through each mood group
  //check if any of the genre IDs in the movie match the IDs in the mood group
  for (const [mood, idsArr] of Object.entries(moodGroups)) {//create two variables, one for mood and one for idsArr & find those in the moodGroups object
    if (ids.some(id => idsArr.includes(id))) {//if any of the genre IDs in the movie match the IDs in the mood group
      return mood;//return the mood group name
    }
  }
  return "Other";//if no match is found, return "Other"
}

//D3: Assign mood group to each movie
//Create a new array of movie objects, each with a moodGroup property added.
//For each movie in the data array, call the getMoodGroup function to determine its mood group,
//passing the movie's genre_ids or genres property to the function.

//create a new array of movie object from that data array
const moviesWithMood = data.map(function(movie) {
  //create a new object to hold the copied movie properties
  let newMovie = {};
  //create a variable, (key), to hold the various properties from the CSV file
  //loop through each property, (key), in the movie object (like title, genre_ids, release_date, etc.)
  for (let key in movie) {
    //for each property, copy the value from the original movie to the new movie object
    newMovie[key] = movie[key];
  }
  //add a new moodGroup property to the new movie object (based on genre_ids or genres, if none is found, it will return "Other")
  newMovie.moodGroup = getMoodGroup(movie.genre_ids || movie.genres || "");
  //Return the new object
  return newMovie;
});




//Three.js:
// const threejsDiv = document.getElementById('threejs');
// const width = threejsDiv.clientWidth;
// const height = threejsDiv.clientHeight;

// //Create renderer with transparent background
// const renderer = new THREE.WebGLRenderer({ alpha: true });
// renderer.setSize(width, height);
// threejsDiv.appendChild(renderer.domElement);

// //Create scene and camera
// const scene = new THREE.Scene();
// const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
// camera.position.z = 2;

// //Add a cube
// const geometry = new THREE.BoxGeometry();
// const material = new THREE.MeshNormalMaterial();
// const cube = new THREE.Mesh(geometry, material);
// scene.add(cube);

// //Animation loop
// function animate() {
//   requestAnimationFrame(animate);
//   cube.rotation.x += 0.01;
//   cube.rotation.y += 0.01;
//   renderer.render(scene, camera);
// }
// animate();