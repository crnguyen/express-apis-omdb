const express = require("express");
const db = require("../models");
const router = express.Router();

router.get("/", (req,res) => {
    db.fave.findAll()
    .then(response => {
        console.log(response);
        res.render("faves", { faves: response })
    })
    .catch(err=> {
        console.log(err);
    })
})

router.post("/", (req,res) => {
    let formData = req.body;
    db.fave.findOrCreate({
        where: { title: formData.title },
        defaults: { imdbId: formData.imdbId }
    })
    .then(([newFave, created])=> {
        console.log("This was created");
        res.redirect("faves");
    })
    .catch(err=> {
        console.log("Error", err)
    })

});

module.exports = router;