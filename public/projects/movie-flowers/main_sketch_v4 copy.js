// main_sketch_v4.js

//This project is inspired by Shirley Wu's Film Flowers project
//https://sxywu.github.io/filmflowers/
//https://www.youtube.com/watch?v=rQroxWLZiCo&t=317s
//https://observablehq.com/@shiffman/shirley-wu-d3-extravaganza

//D3: Load the CSV data
let movies = [];//create an empty array to hold the movie data
d3.csv("data/tmdb_cleaned_for_project_with_year.csv").then(data => {
  //Only include movies with at least one allowed genre
  const allowedGenreIDs = [35, 16, 10749, 18, 99, 36, 28, 878, 53];//only allow these genre ID's (from the 3 mood groups)
  movies = data.filter(movie => {
    let genreList = [];//create an empty array to hold the genre ID's for each movie
    if (typeof movie.genre_ids === "string") {//if genre_ids is a string, convert it to an array
      genreList = movie.genre_ids.replace(/\[|\]|\s/g, '').split(',').map(Number);//remove brackets and whitespace, split by comma, and convert to numbers
    } else if (Array.isArray(movie.genre_ids)) {//if it's already an array, use it as is
      genreList = movie.genre_ids;//use the array as is
    }
    return genreList.some(id => allowedGenreIDs.includes(id));//check if any of the genre IDs in the movie match the allowedGenreIDs
  });
   console.log("Filtered movies count:", movies.length);

//D3: Define the 3 Mood Groups
const moodGroups = {
    "Fun & Lighthearted": [35, 16, 10749],//mood group & genre IDs from CSV
    "Intense & Exciting": [28, 878, 53],
    "Serious & Emotional": [18, 99, 36]
};

function getMoodGroup(genre_ids) {//create a function to get the mood group based on genre IDs in csv
  let ids = genre_ids;//create a variable to hold the genre IDs
  if (typeof genre_ids === "string") {//if it's a string, convert it to an array
    ids = genre_ids.replace(/\[|\]|\s/g, '').split(',').map(Number);//remove brackets and whitespace, split by comma, and convert to numbers
  }
  for (const [mood, idsArr] of Object.entries(moodGroups)) {//loop through each mood group
    if (ids.some(id => idsArr.includes(id))) {//check if any of the genre IDs in the movie match the current mood group's genre IDs
      return mood;//if a match is found, return the mood group
    }
  }
  return "Other";//if no match is found, return "Other"
}

//PETAL PATHS
const petalPath = "M 0, 0 C -10, -10  -10, -40 0, -50 C 10, -40 10, -10 0, 0";
const roundedPetalPath = `M 0,0 C 30,-15 25,-50 0,-50 S -30,-15 0,0 Z`;
const diamondPetalPath = `M 0,80 L 20,50 L 0,0 L -20,50 Z`;

//SVG CANVAS
const svg = d3.select("#viz")
  .append("svg")
  .attr("id", "SVGCanvas")
  .attr("width", 900)
  .attr("height", 1100);

//LEGEND TITLE
svg.append("text")
  .attr("x", 450)
  .attr("y", 40)
  .attr("text-anchor", "middle")
  .attr("font-weight", "bold")
  .style("font-size", "20px")
  .attr("fill", "#333")
  .text("Legend");

//COLORS SECTION
//Colors Title
svg.append("text")
  .attr("x", 450)
  .attr("y", 70)
  .attr("text-anchor", "middle")
  .attr("font-weight", "bold")
  .style("font-size", "15px")
  .attr("fill", "#333")
  .text("Colors");

const colorLegendY = 110;//shared y position for all components of the color legend
const colorLegendSpacing = 300;//spacing between each component of the color legend
const colorLegends = [//create a variable to hold the color legend array data
  { label: "Serious & Emotional", start: "#4B79E4", end: "#63E49B" },
  { label: "Fun & Lighthearted", start: "#FFD700", end: "#FF8C00" },
  { label: "Intense & Exciting", start: "#9932CC", end: "#FF0000" }
];
colorLegends.forEach((d, i) => {//loop through each color legend item
  const x = 150 + i * colorLegendSpacing;//calculate x position based on index
  svg.append("circle")//create a circle for the start color
    .attr("cx", x - 30)
    .attr("cy", colorLegendY)
    .attr("r", 14)
    .attr("fill", d.start);
  svg.append("circle")//create a circle for the end color
    .attr("cx", x + 30)
    .attr("cy", colorLegendY)
    .attr("r", 14)
    .attr("fill", d.end);
  svg.append("line")//create a line to connect the start and end colors
    .attr("x1", x - 16)
    .attr("y1", colorLegendY)
    .attr("x2", x + 16)
    .attr("y2", colorLegendY)
    .attr("stroke", "#888")
    .attr("stroke-width", 3);
  svg.append("text")//create a text label for each color legend item
    .attr("x", x)
    .attr("y", colorLegendY + 35)
    .attr("text-anchor", "middle")
    .style("font-size", "13px")
    .text(d.label);
});

//PETAL SHAPES SECTION
//"Petal Shapes" Title Text
svg.append("text")
  .attr("x", 450)
  .attr("y", 190)
  .attr("text-anchor", "middle")
  .attr("font-weight", "bold")
  .style("font-size", "15px")
  .attr("fill", "#333")
  .text("Petal Shapes");

//Serious & Emotional petal shape
const petalLegendY = 260;//shared y position for all petal shapes (save for Intense & Exciting)
svg.append("path")
  .attr("d", petalPath)//d = path data, petalPath = the path string defined above
  .attr("fill", d3.interpolateRgb("#4B79E4", "#63E49B")(0.5))//interpolate color from blue to green (.5 tells it to use half of each color)
  .attr("opacity", 0.8)
  .attr("transform", `translate(150,${petalLegendY})`);//translate to position it at (150, petalLegendY)
//"Serious & Emotional" text label
svg.append("text")
  .attr("x", 150)
  .attr("y", petalLegendY + 40)
  .attr("text-anchor", "middle")
  .style("font-size", "12px")
  .text("Serious & Emotional");
//Fun & Lighthearted petal shape
  svg.append("path")
  .attr("d", roundedPetalPath)
  .attr("fill", d3.interpolateRgb("#FFD700", "#FF8C00")(0.5))
  .attr("opacity", 0.8)
  .attr("transform", `translate(450,${petalLegendY})`);
//"Fun & Lighthearted" text label
  svg.append("text")
  .attr("x", 450)
  .attr("y", petalLegendY + 40)
  .attr("text-anchor", "middle")
  .style("font-size", "12px")
  .text("Fun & Lighthearted");
//Intense & Exciting petal shape
  svg.append("path")
  .attr("d", diamondPetalPath)
  .attr("fill", d3.interpolateRgb("#9932CC", "#FF0000")(0.5))
  .attr("opacity", 0.8)
  .attr("transform", `translate(750,${200})`);//this one needs it's own y value to line up with the other two
//"Intense & Exciting" text label
  svg.append("text")
  .attr("x", 750)
  .attr("y", petalLegendY + 40)
  .attr("text-anchor", "middle")
  .style("font-size", "12px")
  .text("Intense & Exciting");

//TOP 3 PETALS SECTION
//"Top 3 Petals" Title Text
svg.append("text")
  .attr("x", 450)
  .attr("y", 350)
  .attr("text-anchor", "middle")
  .attr("font-weight", "bold")
  .style("font-size", "15px")
  .attr("fill", "#333")
  .text("Top 3 Petals");

//Serious & Emotional Top 3 Petals
const topPetalY = 450;//shared y position for all top 3 petals
const topPetalAngles = [-60, 0, 60];//angles for each petal
const srsGenres = ["Drama", "Documentary", "Historical"];//Serious & Emotional genres
topPetalAngles.forEach((angle, i) => {//loop through each angle and genre
  svg.append("path")//append a path for each petal
    .attr("d", petalPath)
    .attr("fill", d3.interpolateRgb("#4B79E4", "#63E49B")(i / 2))//append color with interpolation, but use i/2 to get a range of colors
    .attr("opacity", 0.8)
    .attr("transform", `translate(150,${topPetalY}) rotate(${angle})`);//move and rotate each petal
  svg.append("text")//append text for each petal label
    .attr("x", 150 + 60 * Math.sin(angle * Math.PI / 180))//calculate x position based on angle
    .attr("y", topPetalY - 60 * Math.cos(angle * Math.PI / 180) - 10)//calculate y position based on angle
    .attr("text-anchor", "middle")
    .style("font-size", "11px")
    .text(srsGenres[i]);//set the text to the corresponding genre
});

//Fun & Lighthearted Top 3 Petals
const funTopY = 450;
const funTopPetalAngles = [-60, 0, 60];
const funGenres = ["Comedy", "Animation", "Romance"];
funTopPetalAngles.forEach((angle, i) => {//loop through each angle and genre
  svg.append("path")
    .attr("d", roundedPetalPath)
    .attr("fill", d3.interpolateRgb("#FFD700", "#FF8C00")(i / 2))
    .attr("opacity", 0.8)
    .attr("transform", `translate(450,${funTopY}) rotate(${angle})`);
  svg.append("text")
    .attr("x", 450 + 60 * Math.sin(angle * Math.PI / 180))
    .attr("y", funTopY - 60 * Math.cos(angle * Math.PI / 180) - 10)
    .attr("text-anchor", "middle")
    .style("font-size", "11px")
    .text(funGenres[i]);
});


//Intense & Exciting Top 3 Petals
const intenseTopY = 450;
const intenseTopPetalAngles = [120, 180, 240];
const intenseGenres = ["Action", "Sci-Fi", "Thriller"];
intenseTopPetalAngles.forEach((angle, i) => {//loop through each angle and genre
  svg.append("path")
    .attr("d", diamondPetalPath)
    .attr("fill", d3.interpolateRgb("#9932CC", "#FF0000")(i / 2))
    .attr("opacity", 0.8)
    .attr("transform", `translate(750,${intenseTopY}) rotate(${angle})`);
  svg.append("text")
    .attr("x", 750 + 60 * Math.sin(angle * Math.PI / 180))
    .attr("y", intenseTopY + 60 * Math.cos(angle * Math.PI / 180) - 25)
    .attr("text-anchor", "middle")
    .style("font-size", "11px")
    .text(intenseGenres[i]);
});


//BOTTOM 3 PETALS SECTION
//"Bottom 3 Petals" Title Text
svg.append("text")
  .attr("x", 450)
  .attr("y", 500)
  .attr("text-anchor", "middle")
  .attr("font-weight", "bold")
  .style("font-size", "15px")
  .attr("fill", "#333")
  .text("Bottom 3 Petals");

//Serious & Emotional Bottom 3 Petals
const bottomPetalY = 520;
const bottomPetalAngles = [120, 180, 240];
const bottomLabels = ["TMDb Rating", "Year", "Language"];
bottomPetalAngles.forEach((angle, i) => {//loop through each angle and label
  svg.append("path")
    .attr("d", petalPath)
    .attr("fill", d3.interpolateRgb("#4B79E4", "#63E49B")(0.5))
    .attr("opacity", 0.8)
    .attr("transform", `translate(150,${bottomPetalY}) rotate(${angle})`);
  //"Serious & Emotional" bottom petal labels
    svg.append("text")
    .attr("x", 150 + 60 * Math.sin(angle * Math.PI / 180))
    .attr("y", bottomPetalY - 60 * Math.cos(angle * Math.PI / 180) + 20)
    .attr("text-anchor", "middle")
    .style("font-size", "11px")
    .text(bottomLabels[i]);
});

//Fun & Lighthearted Bottom 3 Petals
const funBottomY = 520;
const funBottomPetalAngles = [120, 180, 240];
const funBottomLabels = ["TMDb Rating", "Year", "Language"];
funBottomPetalAngles.forEach((angle, i) => {//loop through each angle and label
  svg.append("path")
    .attr("d", roundedPetalPath)
    .attr("fill", d3.interpolateRgb("#FFD700", "#FF8C00")(0.5))
    .attr("opacity", 0.8)
    .attr("transform", `translate(450,${funBottomY}) rotate(${angle})`);
  //"Fun & Lighthearted" bottom petal labels
  svg.append("text")
    .attr("x", 450 + 60 * Math.sin(angle * Math.PI / 180))
    .attr("y", funBottomY - 60 * Math.cos(angle * Math.PI / 180) + 20)
    .attr("text-anchor", "middle")
    .style("font-size", "11px")
    .text(funBottomLabels[i]);
});


//Intense & Exciting Bottom 3 Petals
const intenseBottomY = 510;
const intenseBottomPetalAngles = [60, 0, -60];
const intenseBottomLabels = ["TMDb Rating", "Year", "Language"];
intenseBottomPetalAngles.forEach((angle, i) => {//loop through each angle and label
  svg.append("path")
    .attr("d", diamondPetalPath)
    .attr("fill", d3.interpolateRgb("#9932CC", "#FF0000")(0.5))
    .attr("opacity", 0.8)
    .attr("transform", `translate(750,${intenseBottomY}) rotate(${angle})`);
  //"Intense & Exciting" bottom petal labels
  svg.append("text")
    .attr("x", 750 + 60 * Math.sin(angle * Math.PI / 180))
    .attr("y", intenseBottomY + 60 * Math.cos(angle * Math.PI / 180) + 30)
    .attr("text-anchor", "middle")
    .style("font-size", "11px")
    .text(intenseBottomLabels[i]);
});

//D3: DRAW THE FLOWERS
const numPetals = 6;//always 6 petals for each flower
const centerY = 730;//center y position for all flowers

//"FIND YOUR FLOWER" TITLE
svg.append("text")
  .attr("x", 450)
  .attr("y", 650)
  .attr("text-anchor", "middle")
  .attr("font-weight", "bold")
  .style("font-size", "15px")
  .attr("fill", "#333")
  .text("Find Your Flower");

//SERIOUS & EMOTIONAL FLOWER
const centerX = 150;
for (let i = 0; i < numPetals; i++) {
  const angle = (360 * i) / numPetals;
  svg.append("path")
    .attr("d", petalPath)
    .attr("fill", d3.interpolateRgb("#4B79E4", "#63E49B")(i / (numPetals - 1)))
    .attr("opacity", 0.75)
    .attr("transform", `translate(${centerX},${centerY}) rotate(${angle})`);
}
svg.append("circle")
  .attr("cx", centerX)
  .attr("cy", centerY)
  .attr("r", 5)
  .attr("fill", "#FFFACD")
  .attr("opacity", 0.75);

//"SERIOUS & EMOTIONAL" MOOD LABEL
svg.append("text")
  .attr("x", centerX)
  .attr("y", centerY + 90) // adjust as needed
  .attr("text-anchor", "middle")
  .attr("font-size", "15px")
  .attr("font-weight", "bold")
  .attr("fill", "#4B79E4")
  .style("text-shadow", "1px 1px .2px rgba(255,255,255,0.5)")
  .attr("opacity", 0.8)
  .text("Serious & Emotional");


//FUN & LIGHTHEARTED FLOWER
const funCenterX = 450;
for (let i = 0; i < numPetals; i++) {
  const angle = (360 * i) / numPetals;
  svg.append("path")
    .attr("d", roundedPetalPath)
    .attr("fill", d3.interpolateRgb("#FFD700", "#E04200")(i / (numPetals - 1)))
    .attr("opacity", 0.75)
    .attr("transform", `translate(${funCenterX},${centerY}) rotate(${angle})`);
}
svg.append("circle")
  .attr("cx", funCenterX)
  .attr("cy", centerY)
  .attr("r", 15)
  .attr("fill", "#FFFACD")
  .attr("opacity", 0.75);

//"FUN & LIGHTHEARTED" MOOD LABEL
svg.append("text")
  .attr("x", funCenterX)
  .attr("y", centerY + 100) // adjust as needed
  .attr("text-anchor", "middle")
  .attr("font-size", "15px")
  .attr("font-weight", "bold")
  .attr("fill", "#FFD700")
  .style("text-shadow", "1px 1px .2px rgba(255,255,255,0.5)")
  .attr("opacity", 0.8)
  .text("Fun & Lighthearted");

//INTENSE & EXCITING FLOWER
const intenseCenterX = 750;
for (let i = 0; i < numPetals; i++) {
  const angle = (360 * i) / numPetals;
  svg.append("path")
    .attr("d", diamondPetalPath)
    .attr("fill", d3.interpolateRgb("#9932CC", "#FF0000")(i / (numPetals - 1)))
    .attr("opacity", 0.75)
    .attr("transform", `translate(${intenseCenterX},${centerY}) rotate(${angle})`);
}
svg.append("circle")
  .attr("cx", intenseCenterX)
  .attr("cy", centerY)
  .attr("r", 10)
  .attr("fill", "#FFFACD")
  .attr("opacity", 0.75);

//"INTENSE & EXCITING" MOOD LABEL
svg.append("text")
  .attr("x", intenseCenterX)
  .attr("y", centerY + 100) // adjust as needed
  .attr("text-anchor", "middle")
  .attr("font-size", "15px")
  .attr("font-weight", "bold")
  .attr("fill", "#9932CC")
  .style("text-shadow", "1px 1px .2px rgba(255,255,255,0.5)")
  .attr("opacity", 0.8)
  .text("Intense & Exciting");

//MOVIE PICKER FUNCTIONALITY
//D3: Flower Movie Selection Overlay
function showFullscreenFlower(movie) {//create a function to show the flower overlay with movie details
  document.getElementById("flowerOverlay").style.display = "flex";//set the overlay to display flex
  const svg = d3.select("#fullscreenFlowerSVG");//select the SVG element for the overlay
  svg.selectAll("*").remove();//remove the previous content from the legend screen

  //Extract CSV Information
  const title = movie.Title || movie.title;//extract title or Title (so it works with lower or upper case titled movies)
  let releaseYear = "-";//Default to "-" if no year found
  if (movie.release_date) {//Check if release_date (year) exists
    const yearMatch = movie.release_date.match(/\d{4}/);//Match 4-digit year
    if (yearMatch) releaseYear = yearMatch[0];//Use matched year if found
  } else if (movie.year && String(movie.year).length === 4) {//Check if year is a 4-digit string
    releaseYear = String(movie.year);//Use year if it's a 4-digit string
  }
  const language = movie.original_language ? movie.original_language.toUpperCase() : "";//Extract original language and convert to uppercase
  //TMDb rating extraction and formatting
  let ratingRaw = movie.TMDb_Rating || movie["TMDb_Rating"] || movie["TMDb Rating"] || movie.vote_average || movie.rating || "";//Check multiple possible fields for TMDb rating
  let rating = "-";
  if (ratingRaw !== undefined && ratingRaw !== null && ratingRaw !== "") {//Check if rating exists
    let ratingNum = parseFloat(ratingRaw);//Convert to float
    if (!isNaN(ratingNum)) rating = ratingNum.toFixed(1);//Format to 1 decimal place
  }

  let genreList = [];//Create an empty array to hold the genre IDs
  if (typeof movie.genre_ids === "string") {//If genre_ids is a string, convert it to an array
    genreList = movie.genre_ids.replace(/\[|\]|\s/g, '').split(',').map(Number);//Remove brackets and whitespace, split by comma, and convert to numbers
  } else if (Array.isArray(movie.genre_ids)) {//If it's already an array, use it as is
    genreList = movie.genre_ids;
  }
  //Map genre IDs to names
  const genreMap = {35: "Comedy", 16: "Animation", 10749: "Romance", 18: "Drama", 99: "Documentary", 36: "Historical", 28: "Action", 878: "Sci-Fi", 53: "Thriller"};
  let genreLabels = {left: "", center: "", right: ""};//Create an object to hold the genre labels, each is initialized as an empty string
  genreList.forEach(id => {//Loop through each genre ID in the movie
    if (id === 35) genreLabels.left = "Comedy";//attach genre label to the left petal
    if (id === 16) genreLabels.center = "Animation";//attach genre label to the center petal
    if (id === 10749) genreLabels.right = "Romance";//attach genre label to the right petal
    if (id === 18) genreLabels.left = "Drama";
    if (id === 99) genreLabels.center = "Documentary";
    if (id === 36) genreLabels.right = "Historical";
    if (id === 28) genreLabels.left = "Action";
    if (id === 878) genreLabels.center = "Sci-Fi";
    if (id === 53) genreLabels.right = "Thriller";
  });

  //Select flower style based on mood
  let thisPetalPath;
  let colorStart;
  let colorEnd;
  const moodGroup = getMoodGroup(movie.genre_ids);//Get the mood group for the movie based on its genre IDs
  if (moodGroup === "Serious & Emotional") {//Check if the mood group is "Serious & Emotional"
    thisPetalPath = petalPath;//use this petal path
    colorStart = "#4B79E4"; colorEnd = "#63E49B";//in these colors
  } else if (moodGroup === "Fun & Lighthearted") {
    thisPetalPath = roundedPetalPath;
    colorStart = "#FFD700"; colorEnd = "#FF8C00";
  } else if (moodGroup === "Intense & Exciting") {
    thisPetalPath = diamondPetalPath;
    colorStart = "#9932CC"; colorEnd = "#FF0000";
  } else {
    thisPetalPath = petalPath;
    colorStart = "#888"; colorEnd = "#ccc";
  }

  //Use same proportions as 'Find Your Flower' section, just scaled up
  const flowerScale = 6;//Scale factor for overlay
  const basePetalOffset = 60;//Main doc (Legend) label offset
  const baseLabelFont = 11;//Main doc (Legend) label font size
  const baseTitleFont = 15;//Main doc (Legend) title font size


  //Scaled overlay positions
  const centerX = 600;//Center X position for the flower
  const centerY = 800;//Center Y position for the flower
  const petalOffset = basePetalOffset * flowerScale;
  const labelFont = baseLabelFont * flowerScale * .9;
  const titleFont = baseTitleFont * flowerScale;
  const titleY = 150;//Place title at top
  const movieTitleY = 300;//Place movie title below

  //Define label drawing functions (to be used after petals are drawn)
  //Draw genre labels (top petals) for overlay flower
  const drawGenreLabel = (angle, text) => {//Function to draw genre labels atop petals (angle, text)
    if (!text) return;//Skip if no text provided (if text variable is falsy, exit function)
    const x = centerX + petalOffset * Math.sin(angle * Math.PI / 180);//Calculate x position based on angle
    const y = centerY - petalOffset * .5 * Math.cos(angle * Math.PI / 180) - 20 * flowerScale;//Calculate y position based on angle
    svg.append("text")
      .attr("x", x)
      .attr("y", y)
      .attr("text-anchor", "middle")
      .attr("font-size", `${labelFont}px`)//Set font size based on scaled label font
      .attr("fill", "#333")
      .attr("font-weight", "medium")
      .text(`Genre: ${text}`);//Draw the text with "Genre: " prefix
  };

  //Draw bottom info labels for overlay flower
  const drawBottomLabel = (angle, text) => {//Function to draw bottom labels that takes two arguments: (angle, text)
    const x = centerX + petalOffset * Math.sin(angle * Math.PI / 180);
    const y = centerY - petalOffset * .4 * Math.cos(angle * Math.PI / 180) + 30 * flowerScale;
    svg.append("text")
      .attr("x", x)
      .attr("y", y)
      .attr("text-anchor", "middle")
      .attr("font-size", `${labelFont}px`)//Set font size based on scaled label font
      .attr("fill", "#333")
      .attr("font-weight", "medium")
      .text(text);
  };

  //Map genre labels to correct petal angles for each mood group for overlay
  let genreAngles;
  let genreOrder;
  if (moodGroup === "Serious & Emotional") {//if mood group is "Serious & Emotional"
    genreAngles = [-60, 0, 60];//use these angles for the top petals
    genreOrder = ["Drama", "Documentary", "Historical"];//and these genres
  } else if (moodGroup === "Fun & Lighthearted") {
    genreAngles = [-60, 0, 60];
    genreOrder = ["Comedy", "Animation", "Romance"];
  } else if (moodGroup === "Intense & Exciting") {
    genreAngles = [60, 0, -60]; // FIX: top petals
    genreOrder = ["Action", "Sci-Fi", "Thriller"];
  } else {
    genreAngles = [-60, 0, 60];
    genreOrder = ["", "", ""];
  }

  //Map bottom labels to correct petal angles for each mood group for overlay
  let bottomAngles;
  let bottomOrder;
  if (moodGroup === "Serious & Emotional") {//if mood group is "Serious & Emotional"
    bottomAngles = [120, 180, 240];//use these angles for the bottom petals
    bottomOrder = [//and these labels in this order
      `TMDb Rating: ${rating}`,//show this text "TMDb Rating" with the rating value
      `Year: ${releaseYear}`,//show this text "Year" with the release year value
      `Language: ${language}`//show this text "Language" with the language value
    ];
  } else if (moodGroup === "Fun & Lighthearted") {
    bottomAngles = [120, 180, 240];
    bottomOrder = [
      `TMDb Rating: ${rating}`,
      `Year: ${releaseYear}`,
      `Language: ${language}`
    ];
  } else if (moodGroup === "Intense & Exciting") {
    bottomAngles = [110, 180, 250];//Adjusted angles for better alignment with bottom petals
    bottomOrder = [
      `TMDb Rating: ${rating}`,
      `Year: ${releaseYear}`,
      `Language: ${language}`
    ];
  } else {//safety fallback, shouldn't need it based on how I'm extracting my data from the csv, but just in case
    bottomAngles = [120, 180, 240];
    bottomOrder = ["", "", ""];
  }

  //Draw petals for my overlay flower
  for (let i = 0; i < numPetals; i++) {
    const angle = (360 * i) / numPetals;
    svg.append("path")
      .attr("d", thisPetalPath)
      .attr("fill", d3.interpolateRgb(colorStart, colorEnd)(i / (numPetals - 1)))
      .attr("opacity", 0.9)
      .attr("transform", `translate(${centerX},${centerY}) scale(${flowerScale}) rotate(${angle})`);
  }
  //Draw center circle for overlay flower (size varies by mood group)
  let centerCircleRadius = 20;//Serious & Emotional default
  if (moodGroup === "Fun & Lighthearted") centerCircleRadius = 60;
  if (moodGroup === "Intense & Exciting") centerCircleRadius = 40;
  svg.append("circle")
    .attr("cx", centerX)
    .attr("cy", centerY)
    .attr("r", centerCircleRadius)
    .attr("fill", "#FFFACD")
    .attr("opacity", 0.92);
    
  //Add mood text label towards bottom of overlay page
  const moodFontSize = 100;
  svg.append("text")
    .attr("x", centerX)
    .attr("y", centerY + 600)//Slight vertical adjustment for centering
    .attr("text-anchor", "middle")
    .attr("dominant-baseline", "middle")
    .attr("font-size", `${moodFontSize}px`)
    .attr("fill", colorStart)
    .attr("font-weight", "bold")
    .style("text-shadow", "1px 1px .2px rgba(255, 255, 255, 0.5)")
    .attr("opacity", 0.8)
    .text(moodGroup);//Just use first word (Fun, Intense, or Serious)

  //Draw text elements AFTER petals so they appear on top of flowers instead of behind

  //"Your Movie Pick" Title text at top of overlay
  svg.append("text")
    .attr("x", centerX)
    .attr("y", titleY)
    .attr("text-anchor", "middle")
    .attr("font-size", `${titleFont}px`)//Set font size based on scaled title font
    .attr("font-weight", "bold")
    .attr("fill", "#333")
    .text("Your Movie Pick");

  //"Movie Title" text for movie picked in overlay
  svg.append("text")
    .attr("x", centerX)
    .attr("y", movieTitleY)
    .attr("text-anchor", "middle")
    .attr("font-size", `${titleFont * 0.9}px`)//Set font size slightly smaller than title
    .attr("fill", colorStart)
    .attr("font-weight", "bold")
    .text(title);
  
  //Draw genre labels on top petals for overlay flower
  genreAngles.forEach((angle, i) => {//loop through each angle and genre
    const label = genreOrder[i];//get the corresponding genre label
    if (genreList.includes(Object.keys(genreMap).find(key => genreMap[key] === label) * 1)) {//only draw label if the movie has that genre ID
      drawGenreLabel(angle, label);//draw the genre label(s)
    }
  });

  //Draw bottom labels for overlay flower
  bottomAngles.forEach((angle, i) => {//loop through each angle and label
    drawBottomLabel(angle, bottomOrder[i]);//draw the bottom label(s)
  });
}

//Close Overlay
document.getElementById("closeOverlayBtn").onclick = function() {//when the close button is clicked
  document.getElementById("flowerOverlay").style.display = "none";//hide the overlay
};

//Movie Picker Button
document.getElementById("pickMovieBtn").onclick = function() {//when the "Pick a Movie" button is clicked
  // Pick a random movie
  const randomIndex = Math.floor(Math.random() * movies.length);//Pick a random movie
  const movie = movies[randomIndex];//add the movie data into the array
  //Check to see if movie was picked correctly
  console.log("Picked movie:", movie.title || movie.Title, "at index", randomIndex);
  movie.moodGroup = getMoodGroup(movie.genre_ids);//determine the mood group for the selected movie
  showFullscreenFlower(movie);//show the overlay with the selected movie
};
});