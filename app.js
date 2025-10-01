import express from "express";
import dotenv from "dotenv";
import * as utils from "./utils/utils.js";
dotenv.config();
import * as db from "./utils/database.js";
//let data = ["Project 1", " Project 2", " Project 3"];//mock data
//let projects = [];//global array to hold project data

const app = express();//create an express application
const port = 3000;//port number for local server
app.set("view engine", "ejs");//tells Express to use EJS as the template engine for rendering HTML
app.use(express.json());//middleware to parse JSON request bodies
app.use(express.static("public"));//serve static files (images, CSS, JS) from the "public" folder

// app.get('/', (req, res) => {
//   res.render("index.ejs");
// });

/*-- Route for Home page --*/
app.get("/", async (req, res, next) => {
  try {
    await db.connect();//connect to the database
    const projects = await db.getAllProjects();//fetch all projects as an array from the database
    console.log(projects);//log the projects array to the console to verify data retrieval
    let randomFeaturedProject = Math.floor(Math.random() * projects.length);//select a random project index for the featured project
    res.render("index.ejs", { activePage: "home", featuredProject: projects[randomFeaturedProject] });//render the index.ejs template, passing the active page and the randomly selected featured project
  } catch (err) {//catch any errors that occur during the process
    next(err);//pass the error to the next middleware (error handler)
  }
});

/*-- Route for All Projects page --*/
app.get("/projects", async (req, res, next) => {
    try {
    await db.connect();
    const projects = await db.getAllProjects();
    res.render("projects.ejs", { projectArray: projects, activePage: "projects" });
  } catch (err) {
    next(err);
  }
});

/*-- Route for individual project pages --*/
app.get("/project/:id", async(req, res, next) => {
    try {
    await db.connect();//connect to the database
    const projects = await db.getAllProjects();//fetch all projects as an array from the database
    let id = Number(req.params.id);//using Number to convert string to number//Get the project ID from the URL and convert it from a string to a number
    if(id > projects.length) {//if id is greater than the number of projects
        throw new Error("No project with that ID");//throw an error to be caught by the error handler
    }
    let project = projects[id-1];//arrays are zero indexed, so subtract 1 from id to get the correct project
    console.log(project);//log the selected project to the console to verify correct retrieval
    res.render("project.ejs", {project, which: id, activePage: "project"});//render the project.ejs template, passing the selected project, its ID, and the active page
    } catch (err) {//catch any errors that occur during the process
    next(err);//pass the error to the next middleware (error handler)
  }
});

/*-- Route for Featured Project page --*/
app.get("/project", (req, res) => {
  res.render("project.ejs", { which: "Featured Project", activePage: "featured" });
});

/*-- Route for All Projects page --*/
// app.get("/projects", (req, res) => {
//   res.render("projects.ejs");
// });

/*-- Route for Contact page --*/
app.get("/contact", (req, res) => {
  res.render("contact.ejs", { activePage: "contact" });
});

/*-- Route for Project Creation page --*/
app.get("/newProject", (req, res) => {
  res.render("newProject.ejs", { activePage: "newProject" });
});

/*-- Response for contact form submission --*/
app.post('/mail', async (req, res) => {//handle POST requests to /mail
  await utils//wait for the sendMessage function to complete
  .sendMessage(req.body.sub, req.body.txt)//call sendMessage with subject and text from request body
  .then(() => {//if successful
    res.send({ result: "Message successfully sent!" });//send a success response
  })
  .catch(() => {//if there's an error
    res.send({ result: "Message failure." });//send a failure response
  });
});

/*-- Error handling project pages outside the array range for individual projects --*/
app.use((err, req, res, next) => {//error handling middleware function with four parameters
    console.log(err);//log the error to the console for debugging
    res.render("error.ejs");//render the error.ejs template to show a friendly error page
});


app.listen(port, () => {//start the server and listen on the specified port
  console.log(`Example app listening on port ${port}`);//log a message to the console when the server is running
});
