// main_sketch_v2.js

//D3: Define the 3 Mood Groups
//Each mood group is an array of genre ID's.
//These ID's correspond to the genres defined in the TMDd csv data file.
const moodGroups = {
    "Fun & Lighthearted": [35, 16, 10749],//Comedy(35), Animation(16), Romance(10749)
    "Intense & Exciting": [28, 878, 53],//Action(28), Sci-Fi(878), Thriller(53)
    "Serious & Emotional": [18, 99, 36]//Drama(18), Documentary(99), History(36)
};

//D3: Need to create a function to filter movies by mood
function getMoodGroup(genre_ids) {
  //genre_ids might be a string like "[35, 16]" or an array (csv file is a text doc so even though it looks like an array, it's actually a string)
  let ids = genre_ids;//create a variable to hold genre_ids
  if (typeof genre_ids === "string") {//If genre_ids is a string, convert it to an array
    ids = genre_ids.replace(/\[|\]|\s/g, '').split(',').map(Number);//remove brackets and whitespace, split by comma, and convert to numbers
  }
  //Loop through each mood group
  //check if any of the genre ID's in the movie match the ID's in the mood group
  for (const [mood, idsArr] of Object.entries(moodGroups)) {//create two variables, one for mood and one for idsArr & find those in the moodGroups object
    if (ids.some(id => idsArr.includes(id))) {//if any of the genre ID's in the movie match the ID's in the mood group
      return mood;//return the mood group name
    }
  }
  return "Other";//if no match is found, return "Other"
}

//D3: CANVAS SETUP
//Set up the SVG canvas for D3 to draw in. This creates an SVG element inside the #viz div.
const svg = d3.select("#viz")
  .append("svg")
  .attr("id", "SVGCanvas")//create an ID for the SVG canvas element
  .attr("width", 800)
  .attr("height", 800);

//D3: LEGEND SETUP
svg.append("text")
  .attr("x", 400)
  .attr("y", 50)
  .attr("text-anchor", "middle")
  .attr("class", "legend-title")
  .style("font-size", "16px")
  .text("Movie Flowers - Visualizing Films by Mood and Metadata");

//KEY
svg.append("text")
  .attr("x", 300)
  .attr("y", 80)
  .attr("text-anchor", "middle")
  .style("font-size", "12px")
  .text("Key:");

const key = [
  "Top 3 petals: Genre Categories",
  "Bottom Left: TMDb (The Movie Database) Rating",
  "Bottom Center: Year",
  "Bottom Right: Language"
];

key.forEach((text, i) => {
  svg.append("text")
    .attr("x", 300)
    .attr("y", 100 + i * 20)
    .attr("text-anchor", "middle")
    .style("font-size", "11px")
    .text(text);
});


//D3: Load the CSV data
//d3.csv loads the CSV file. then(function(data)) creates a function that then processes the loaded data.
d3.csv("data/movies_with_moods_FULL_strict_year.csv").then(function(data) {
  //D3: Assign mood group to each movie
  //Create a new array of movie objects, each with a moodGroup property added.
  const moviesWithMood = data.map(function(movie) {
    //create a new object to hold the copied movie properties
    let newMovie = {};
    for (let key in movie) {
      newMovie[key] = movie[key];
    }
    newMovie.moodGroup = getMoodGroup(movie.genre_ids || movie.genres || "");
    return newMovie;   
  });

  //Log a few results to check
  console.log("First 5 movies with mood groups:", moviesWithMood.slice(0, 5));
  console.log("Loaded movie data:", data);
  console.log("First movie:", data[0]);
  
  //First need to group the movies by moodGroup so we can draw flowers based on each one
  const moviesByMood = d3.group(moviesWithMood, d => d.moodGroup);
  const moodNames = Array.from(moviesByMood.keys()).filter(mood => mood !== "Other");

  //Petal Shape (Pointed for "Serious & Emotional")
  const petalPath = "M 0, 0 C -10, -10  -10, -40 0, -50 C 10, -40 10, -10 0, 0";
  
  //Draw the legend petals with interpolated colors
  //Serious & Emotional - blue to green interpolation
  svg.append("path")
    .attr("d", petalPath)
    .attr("fill", d3.interpolateRgb("#4B79E4", "#63E49B")(0.5)) // Use midpoint of interpolation
    .attr("opacity", 0.8)
    .attr("transform", "translate(100, 100)");

  //Rounded Petal Shape (for "Fun & Lighthearted")
  const roundedPetalPath = 
    `M 0,0 
    C 30,-15 25,-50 0,-50 
    S -30,-15 0,0 
    Z`;
  //Fun & Lighthearted - yellow to orange interpolation
  svg.append("path")
    .attr("d", roundedPetalPath)
    .attr("fill", d3.interpolateRgb("#FFD700", "#FF8C00")(0.5)) // Use midpoint of interpolation
    .attr("opacity", 0.8)
    .attr("transform", "translate(300,100)");

  //Diamond Petal Shape (for "Intense & Exciting")
  //Drawing diamond with (0,0) at the bottom point, so it connects to center of flower
  const diamondPetalPath = `M 0,80 L 20,50 L 0,0 L -20,50 Z`;
  //Intense & Exciting - purple to red interpolation
  svg.append("path")
    .attr("d", diamondPetalPath)
    .attr("fill", d3.interpolateRgb("#9932CC", "#FF0000")(0.5)) // Use midpoint of interpolation
    .attr("opacity", 0.8)
    .attr("transform", "translate(500, 30)");

  //Add labels under the legend petals
  svg.selectAll("text.moodLabel")
    .data(moodNames)
    .enter()
    .append("text")
    .attr("class", "moodLabel")
    .attr("x", (d, i) => 100 + i * 200)
    .attr("y", 150)
    .attr("text-anchor", "middle")
    .text(d => d);

  //D3: DRAW THE FLOWERS
  
  //SERIOUS & EMOTIONAL FLOWER
  //Create a flower with 6 Serious & Emotional petals
  const numPetals = 6;
  const centerX = 100;//center of the flower
  const centerY = 700;//position it below the legend

  //Draw each petal
  for (let i = 0; i < numPetals; i++) {
    //Calculate the angle for each petal (360 degrees / number of petals)
    const angle = (360 * i) / numPetals;
    
    //Add a petal with color interpolation from blue to green
    svg.append("path")
      .attr("d", petalPath)
      .attr("fill", d3.interpolateRgb("#4B79E4", "#63E49B")(i / (numPetals - 1)))
      .attr("opacity", 0.75)
      //Move to center point, then rotate by the calculated angle
      .attr("transform", `translate(${centerX},${centerY}) rotate(${angle})`);
  }
  //Add a circle at the center (flower core)
  svg.append("circle")
    .attr("cx", centerX)
    .attr("cy", centerY)
    .attr("r", 5)//radius of the center circle
    .attr("fill", "#FFFACD")
    .attr("opacity", 0.75)


  //FUN & LIGHTHEARTED FLOWER
  //Create a flower with 6 Fun & Lighthearted petals
  const funCenterX = 300; //center of the fun flower
  const funCenterY = 700; //same height as serious flower

  //Draw each petal
  for (let i = 0; i < numPetals; i++) {
    const angle = (360 * i) / numPetals;
    
    //Add a petal with color interpolation from yellow to orange
    svg.append("path")
      .attr("d", roundedPetalPath)
      .attr("fill", d3.interpolateRgb("#FFD700", "#E04200")(i / (numPetals - 1)))
      .attr("opacity", 0.75)
      .attr("transform", `translate(${funCenterX},${funCenterY}) rotate(${angle})`);
  }
   //Add a circle at the center (flower core)
  svg.append("circle")
    .attr("cx", funCenterX)
    .attr("cy", funCenterY)
    .attr("r", 15)//radius of the center circle
    .attr("fill", "#FFFACD")
    .attr("opacity", 0.75);

   //INTENSE & EXCITING FLOWER
  //Create a flower with 6 Intense & Exciting petals
  const intenseCenterX = 500; //center of the intense flower
  const intenseCenterY = 700; //same height as serious flower

  //Draw each petal
  for (let i = 0; i < numPetals; i++) {
    const angle = (360 * i) / numPetals;
    
    //Add a petal with color interpolation from purple to red
    svg.append("path")
      .attr("d", diamondPetalPath)
      .attr("fill", d3.interpolateRgb("#9932CC", "#FF0000")(i / (numPetals - 1)))
      .attr("opacity", 0.75)
      // Move to center point, then rotate by the calculated angle
      .attr("transform", `translate(${intenseCenterX},${intenseCenterY}) rotate(${angle})`);
  }
  //Add a circle at the center (flower core)
  svg.append("circle")
    .attr("cx", intenseCenterX)
    .attr("cy", intenseCenterY)
    .attr("r", 10)//radius of the center circle
    .attr("fill", "#FFFACD")
    .attr("opacity", 0.75);

 
});
