// main_sketch_v2.js

//D3:
//Set up the SVG canvas for D3 to draw in. This creates an SVG element inside the #viz div.
const svg = d3.select("#viz")
  .append("svg")
  .attr("id", "SVGCanvas")//create an ID for the SVG canvas element
  .attr("width", 800)
  .attr("height", 500);

//D3: START WITH STRUCTURING THE DATA 

//D3: Load the CSV data
//d3.csv loads the CSV file. then(function(data)) creates a function that then processes the loaded data.
d3.csv("data/movies_with_moods_FULL_strict_year.csv").then(function(data) {
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

  //Log a few results to check
  console.log("First 5 movies with mood groups:", moviesWithMood.slice(0, 5));
  console.log("Loaded movie data:", data);
  console.log("First movie:", data[0]);

  
//D3: DRAW THE PETALS FOR EACH MOOD GROUP

  //First need to group the movies by moodGroup so we can draw flowers based on each one
  const moviesByMood = d3.group(moviesWithMood, d => d.moodGroup);
  //create a variable to hold the grouped movies by moodGroup
  //for each movie object "d" in the array, return the value of "d.moodGroup" property (ie, genre)

  //moviesByMood is a Map:
  //"Fun & Lighthearted" => [array of movies in this group]
  //"Intense & Exciting" => [array of movies in this group]
  //"Serious & Emotional" => [array of movies in this group]
  //"Other" => [array of movies that don't fit those groups]

  //Get the list of mood group names (for drawing one flower per group)
  //if movie is in the "Other" group, it will not be drawn
  const moodNames = Array.from(moviesByMood.keys()).filter(mood => mood !== "Other");

 //Petal Shape (Pointed for "Serious & Emotional")
 //This SVG path draws a symmetrical petal shape using cubic Bézier curves:
    //M 0, 0 //Move to the starting point to the base of the petal (origin)
    //C -10, -10 //First control point (left and up from the base)
    //-10, -40 //Second control point (further up, still left)
    //0, -50 //End point (tip of the petal, straight up from the base)
    //C 10, -40 //Third control point (right and up from the tip)
    //10, -10 //Fourth control point (closer to the base, right side)
    //0, 0 //End point (back to the base, closing the petal)
const petalPath = "M 0, 0 C -10, -10  -10, -40 0, -50 C 10, -40 10, -10 0, 0";
//Draw the "Fun & Lighthearted" petal shape by appending to SVG
svg.append("path")
  .attr("d", petalPath)
  .attr("fill", "#f77") // or any color you like
  .attr("stroke", "black")
  .attr("opacity", 0.8)
  .attr("transform", "translate(100, 100)");

//This SVG path draws a rounded petal shape using cubic Bézier curves and smooth curves:
    //M 0,0 //Move to the bottom tip of the petal (origin)
    //C 30,-20 40,-50 0,-50 //Curve up the right side to the top center (rounded)
    //S -30,-20 0,0 //Smoothly curve down the left side, mirroring the right, back to the tip
    //Z //Close the path
const roundedPetalPath = 
`M 0,0 
C 30,-20 40,-50 0,-50 
S -30,-20 0,0 
Z`;
svg.append("path")
  .attr("d", roundedPetalPath)
  .attr("fill", "#6cf")
  .attr("stroke", "black")
  .attr("opacity", 0.8)
  .attr("transform", "translate(300,100)");

//This SVG path draws a symmetrical petal with 4 sharp points:
    //M 0,0 //Move to the bottom tip of the petal (origin)
    //C 12,-20 12,-60 0,-80 //Curve up the right side to a long, high point
    //C -12,-60 -12,-20 0,0 //Curve down the left side, mirroring the right, back to the tip
    //Z //Close the path
const diamondPetalPath = `M 0,0 L 20,-30 L 0,-80 L -20,-30 Z`;
svg.append("path")
  .attr("d", diamondPetalPath)
  .attr("fill", "#90ee90")
  .attr("stroke", "black")
  .attr("opacity", 0.8)
  .attr("transform", "translate(500,100)");

//Add a label under each flower
  svg.selectAll("text.moodLabel")
    .data(moodNames)
    .enter()
    .append("text")
    .attr("class", "moodLabel")
    .attr("x", (d, i) => 100 + i * 200)
    .attr("y", 150)
    .attr("text-anchor", "middle")
    .text(d => d);

//DRAW THE FLOWERS

//Serious & Emotional Flower



// 5. Draw a circle at the center (flower core)
svg.append("circle")
  .attr("cx", centerX)
  .attr("cy", centerY)
  .attr("r", 18)
  .attr("fill", "#fff")
  .attr("stroke", "#333");

});

//D3: Define the 3 Mood Groups
//Each mood group is an array of genre IDs.
//These IDs correspond to the genres defined in the TMDd csv data file.
const moodGroups = {
    "Fun & Lighthearted": [35, 16, 10749],//Comedy(35), Animation(16), Romance(10749)
    "Intense & Exciting": [28, 878, 53], //Action(28), Sci-Fi(878), Thriller(53)
    "Serious & Emotional": [18, 99, 36] //Drama(18), Documentary(99), History(36)
};

//D3: Need to create a function to filter movies by mood
function getMoodGroup(genre_ids) {
  //genre_ids might be a string like "[35, 16]" or an array (csv file is a text doc so even though it looks like an array, it's actually a string)
  let ids = genre_ids;//create a variable to hold genre_ids
  if (typeof genre_ids === "string") {//If genre_ids is a string, convert it to an array
    ids = genre_ids.replace(/\[|\]|\s/g, '').split(',').map(Number);//remove brackets and whitespace, split by comma, and convert to numbers
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
