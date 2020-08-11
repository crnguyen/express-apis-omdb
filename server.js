require('dotenv').config();
const express = require('express');
const ejsLayouts = require('express-ejs-layouts');
const axios = require('axios');
const app = express();
const router = express.Router();//*** 
let API_KEY = process.env.API_KEY
const db = require("./models");

router.use("/models", require("./models/fave"))

// Sets EJS as the view engine
app.set('view engine', 'ejs');
// Specifies the location of the static assets folder
app.use(express.static('static'));
// Sets up body-parser for parsing form data
app.use(express.urlencoded({ extended: false }));
// Enables EJS Layouts middleware
app.use(ejsLayouts);

// Adds some logging to each request
app.use(require('morgan')('dev'));

// Routes
app.get("/", (req, res) => {
  res.render("index");
});

app.get("/results", (req, res) => {
  let search = req.query.searchMovie;
  let qs = {
    params: {
      s: search,// fix this
      apikey: API_KEY
    }
  }
  axios.get("http://www.omdbapi.com", qs)
  .then((response) => {
    console.log(response.data)
    let movies = response.data.Search
    console.log(movies);
    res.render("results", {data: movies});
  })
  .catch(err => {
    console.log(err);
  })
})


app.get("/movies/:id", (req ,res) => {
  let imdbID = req.params.id;
  let qs = {
    params: {
      i: imdbID,
      apikey: API_KEY
    }
  }
  axios.get("http://www.omdbapi.com", qs)
  .then((response) => {
    let movieDetails = response.data;
    console.log(movieDetails)
    res.render("detail", {data: movieDetails})
  })
  .catch(err => {
    console.log(err)
  })
})

app.use("/fave", require("./routes/faves"))

// router.get("/", (req,res) => {
//   db.fave.findAll()
//   .then(response => {
//     res.render("fave", {fave: response})
//   })
//   .catch(err => {
//     console.log("error", err);
//     res.send("ERROR")
//   });
// })

// router.post("/", (req, res) => {
//   db.fave.findOrCreate({
//       where: { title: req.body.Title },
//       defaults: { imdbId: req.body.imdbID }
//     })
//     .then(() => {
//       res.redirect("/fave");
//     })
//     .catch(err => {
//       console.log("error", err);
//       res.send("ERROR")
//     });
// })

// router.get("/", (req, res) => {
//     //Use the fave model to get all faves from your database.
//     db.fave.findAll ({
//       where: {
//         name: req.body.name
//       }
//     })
//     .then(movies => {
//       res.render("fave", {movies})
//     })
//     .catch(err => {
//       res.send("error")
//     })
// });

// The app.listen function returns a server handle
var server = app.listen(process.env.PORT || 3000);

// We can export this server to other servers like this
module.exports = server;
