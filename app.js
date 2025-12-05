import express from "express";
import dotenv from "dotenv";
import * as utils from "./utils/utils.js";
dotenv.config();
import * as db from "./utils/database.js";
//let data = ["Project 1", " Project 2", " Project 3"];//mock data
//let projects = [];//global array to hold project data
import cors from "cors";

let projects = [];
let contracts = [];
let mints = [];


const app = express();//create an express application
app.use(cors());
const port = 3000;//port number for local server
app.set("view engine", "ejs");//tells Express to use EJS as the template engine for rendering HTML
app.use(express.json());//middleware to parse JSON request bodies
app.use(express.static("public"));//serve static files (images, CSS, JS) from the "public" folder

// app.get('/', (req, res) => {
//   res.render("index.ejs");
// });

/*-- NEW Route for Home page --*/
app.get("/", async (req, res, next) => {
  try {
    await db.connect();
    const projects = await db.getAllProjects();

    //Populate contracts and mints arrays
    let contracts = [];
    let mints = [];
    projects.forEach((item) => {
      contracts.push(item.contractAddress || "");
      mints.push(0); //Placeholder, will be updated client-side
    });

    //Pick featured project (random or daily)
    const featuredID = utils.getDailyFeaturedProjectId(projects);
    const featuredProject = projects.find(p => p.id === featuredID);

    res.render("index.ejs", {
      activePage: "home",
      featuredProject,
      contracts,
      mints,
      projects,
    });
  } catch (err) {
    next(err);
  }
});

/*-- CURRENT Route for Home page --*/
// app.get("/", async (req, res, next) => {
//   try {
//     await db.connect();//connect to the database (MYSQL server)
//     const projects = await db.getAllProjects();//fetch all projects as an array from the database
//     const featuredID = utils.getDailyFeaturedProjectId(projects);//get the daily featured project ID using a utility function
//     const featuredProject = projects.find(p => p.id === featuredID);//find the project with the matching ID
//     console.log(projects);//log the projects array to the console to verify data retrieval
//     res.render("index.ejs", { activePage: "home", featuredProject });//render the index.ejs template, passing the active page and the randomly selected featured project
//   } catch (err) {//catch any errors that occur during the process
//     next(err);//pass the error to the next middleware (error handler)
//   }
// });

// /*-- Route for Home page --*/
// app.get("/", async (req, res, next) => {
//   try {
//     await db.connect();//connect to the database
//     const projects = await db.getAllProjects();//fetch all projects as an array from the database
//     console.log(projects);//log the projects array to the console to verify data retrieval
//     let randomFeaturedProject = Math.floor(Math.random() * projects.length);//select a random project index for the featured project
//     res.render("index.ejs", { activePage: "home", featuredProject: projects[randomFeaturedProject] });//render the index.ejs template, passing the active page and the randomly selected featured project
//   } catch (err) {//catch any errors that occur during the process
//     next(err);//pass the error to the next middleware (error handler)
//   }
// });

/*-- NEW Route for All Projects page --*/
app.get("/projects", async (req, res, next) => {
  try {
    await db.connect();
    const projects = await db.getAllProjects();

    // Populate contracts and mints arrays from projects
    let contracts = [];
    let mints = [];
    projects.forEach((item) => {
      contracts.push(item.contractAddress || "");
      mints.push(0); // Placeholder, will be updated client-side
    });

    res.render("projects.ejs", {
      projectArray: projects,
      activePage: "projects",
      contracts,
      mints,
      projects,
    });
  } catch (err) {
    next(err);
  }
});

// /*-- CURRENT Route for All Projects page --*/
// app.get("/projects", async (req, res, next) => {
//     try {
//     await db.connect();
//     const projects = await db.getAllProjects();
//     res.render("projects.ejs", { projectArray: projects, activePage: "projects" });
//   } catch (err) {
//     next(err);
//   }
// });

/*-- NEW Route for Featured Project page --*/
app.get("/project/featured", async (req, res, next) => {
  try {
    await db.connect();
    const projects = await db.getAllProjects();
    const featuredID = utils.getDailyFeaturedProjectId(projects);
    const project = projects.find(p => p.id === featuredID);

    //Populate contracts and mints arrays
    let contracts = [];
    let mints = [];
    projects.forEach((item) => {
      contracts.push(item.contractAddress || "");
      mints.push(0);
    });

    res.render("project.ejs", {
      project,
      which: "Featured Project",
      activePage: "featured",
      contracts,
      mints,
      projects,
    });
  }
  catch (err) {
    next(err);
  }
});
/*-- CURRENT Route for Featured Project page --*/
 /*-- This must come before the route to individual project pages or nav menu link won't work because of route matching order --*/
// app.get("/project/featured", async (req, res, next) => {
//   try {
//     await db.connect();
//     const projects = await db.getAllProjects();
//     const featuredID = utils.getDailyFeaturedProjectId(projects);
//     const project = projects.find(p => p.id === featuredID);
//     res.render("project.ejs", { project, which: "Featured Project", activePage: "featured" });
//   }
//   catch (err) {
//     next(err);
//   }
// });

/*-- NEW Route for individual project pages --*/
app.get("/project/:id", async (req, res, next) => {
  try {
    await db.connect();
    const projects = await db.getAllProjects();

    // Populate contracts and mints arrays from projects
    let contracts = [];
    let mints = [];
    projects.forEach((item) => {
      contracts.push(item.contractAddress || "");
      mints.push(0); // Placeholder, will be updated client-side
    });

    let id = Number(req.params.id);
    let project = projects.find(p => p.id === id);
    if (!project) {
      res.status(404).render("404.ejs");
      return;
    }
    res.render("project.ejs", {
      project,
      which: id,
      activePage: "project",
      contracts,
      mints,
      projects,
    });
  } catch (err) {
    next(err);
  }
});

/*-- CURRENT Route for individual project pages --*/
// app.get("/project/:id", async(req, res, next) => {
//     try {
//     await db.connect();//connect to the database
//     const projects = await db.getAllProjects();//fetch all projects as an array from the database
//     let id = Number(req.params.id);//using Number to convert string to number//Get the project ID from the URL and convert it from a string to a number
//     let project = projects.find(p => p.id === id);
//       if (!project) {
//         res.status(404).render("404.ejs");
//         return;
//       }
//     console.log(project);//log the selected project to the console to verify correct retrieval
//     res.render("project.ejs", {project, which: id, activePage: "project"});//render the project.ejs template, passing the selected project, its ID, and the active page
//     } catch (err) {//catch any errors that occur during the process
//     next(err);//pass the error to the next middleware (error handler)
//   }
// });



// /*-- Route for Featured Project page --*/
// app.get("/project", (req, res) => {
//   res.render("project.ejs", { which: "Featured Project", activePage: "featured" });
// });

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

/*-- Testing My 500 Error Page --*/
app.get("/cause-error", (req, res, next) => {
  throw new Error("This is a test server error!");
});

/*-- Error handling project pages outside the array range for individual projects (500 Error) --*/
app.use((err, req, res, next) => {//error handling middleware function with four parameters
    console.log(err);//log the error to the console for debugging
    res.status(500).render("500.ejs");//render the error.ejs template to show a friendly error page
});

/*-- 404 Error handling for non-existent routes --*/
app.use((req, res, next) => {
  res.status(404).render("404.ejs");
});

app.listen(port, () => {//start the server and listen on the specified port
  console.log(`Example app listening on port ${port}`);//log a message to the console when the server is running
});
