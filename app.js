import express from "express";
import dotenv from "dotenv";
import * as utils from "./utils/utils.js";
dotenv.config();
import * as db from "./utils/database.js";
let data = ["Project 1", " Project 2", " Project 3"];
let projects = [];

const app = express();
const port = 3000;
app.set("view engine", "ejs");
app.use(express.json());
app.use(express.static("public"));

// app.get('/', (req, res) => {
//   res.render("index.ejs");
// });

/*-- Route for Home page --*/
app.get("/", async (req, res, next) => {
  try {
    await db.connect();
    //query the database for all projects
    projects = await db.getAllProjects();
    console.log(projects);
    res.render("index.ejs", { activePage: "home"});
  } catch (err) {
    next(err);
  }
});

/*-- Route for All Projects page --*/
app.get("/projects", (req, res) => {
  res.render("projects.ejs", {projectArray: projects, activePage: "projects" });
});

/*-- Route for individual project pages --*/
app.get("/project/:id", (req, res) => {
    let id = req.params.id;
    if(id > data.length) {
        throw new Error("No project with that ID");
    }
    res.render("project.ejs", {projectArray: data, which: id, activePage: "featured"});
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
app.post('/mail', async (req, res) => {
  await utils
  .sendMessage(req.body.sub, req.body.txt)
  .then(() => {
    res.send({ result: "Message successfully sent!" });
  })
  .catch(() => {
    res.send({ result: "Message failure." });
  });
});

/*-- Error handling project pages outside the array range for individual projects --*/
app.use((err, req, res, next) => {
    console.log(err);
    res.render("error.ejs");
});


app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
});
