import {Request, Response, NextFunction, Router} from "express";
import {like, dislike, sortShoes, deleteShoe} from "../managers/shoe";
import {isLoggedIn, isLoggedIn_NoRender} from "../managers/profile";
const router = Router();
const ObjectId = require("mongodb").ObjectID;

// sorts and renders shoes page.
router.get("/browse", (req, res, next) => {
    sortShoes({likes: -1})
        .then((shoes: any) => {
            res.render("shoes/browse", {user: req.cookies.username, shoes: shoes[0], likes : shoes[1], dislikes: shoes[2]});
        });
});

// like button route for each object of class shoe. user must be logged in to like anything
router.get("/likes/:id", (req, res) => {
    if (!isLoggedIn_NoRender(req, res)) {
        res.render("profile/login");
    } else {
        const ID = ObjectId(req.params.id);
        like(ID)
            .then((conf: any) => {
                res.redirect("/shoes/browse");
            });
    }
});

// dislike button route for each object of class shoe. user must be logged in to dislike anything
router.get("/dislikes/:id", (req, res) => {
    if (!isLoggedIn_NoRender(req, res)) {
        res.render("profile/login");
    } else {
        const ID = ObjectId(req.params.id);
        dislike(ID)
            .then((conf: any) => {
                res.redirect("/shoes/browse");
            });
    }
});

// drop down menu route that sorts all shoes based on likes
router.get("/browse/popular", (req, res) => {
    sortShoes({likes: -1})
        .then((conf: any) => {
            res.redirect("/shoes/browse");
        });
});

// drop down menu route that sorts all shoes based on dislikes
router.get("/browse/notpopular", (req, res) => {
    sortShoes({dislikes: -1})
        .then((shoes: any) => {
            res.render("shoes/browse", {user: req.cookies.username, shoes: shoes[0], likes: shoes[1], dislikes: shoes[2]});
        });
});

// drop down menu route that sorts all shoes based on price low to high
router.get("/browse/pricelth", (req, res) => {
    sortShoes({price: 1})
        .then((shoes: any) => {
            res.render("shoes/browse", {user: req.cookies.username, shoes: shoes[0], likes: shoes[1], dislikes: shoes[2]});
        });
});

// drop down menu route that sorts all shoes based on price high to low
router.get("/browse/pricehtl", (req, res) => {
    sortShoes({price: -1})
        .then((shoes: any) => {
            res.render("shoes/browse", {user: req.cookies.username, shoes: shoes[0], likes: shoes[1], dislikes: shoes[2]});
        });
});

// was used to insert shoes into the database. was very useful whenever changes were made tot the shoes class. allowed us to quickly reset the database

// insertShoe("/img/LBJ17.jpg", "NIKE Lebron 17", "Lebron James", 170, "An amazing shoe",0, 0)
// .then((confirm:any)=>{});
//
// insertShoe("/img/number2.jpg", "New Balance OMN1S", "Kawhi Leonard", 140, "An amazing shoe",0, 0)
//     .then((confirm:any)=>{});
//
// insertShoe("/img/greek.jpg", "NIKE Zoom Freak 1", "Giannis Antetekounmpo", 120, "An amazing shoe",0, 0)
//     .then((confirm:any)=>{});
//
// insertShoe("/img/kd.jpg", "NIKE Zoom KD12", "Kevin Durant", 150, "An amazing shoe",0, 0)
//     .then((confirm:any)=>{});
//
// insertShoe("/img/jordan.jpg", "Jordan Why Not Zer0.2", "Michael Jordan", 125, "an amazing shoe", 0, 0)
//     .then((confirm:any)=>{});
//
// insertShoe("/img/jordan2.jpg", "Air Jordan 34", "Michael Jordan", 180, "an amazing shoe", 0, 0)
//     .then((confirm:any)=>{});
//
// insertShoe("/img/harden.jpg", "Adidas Harden Vol.4", "James Harden", 130, "an amazing shoe", 0, 0)
//     .then((confirm:any)=>{});
//
// insertShoe("/img/kobe.jpg", "NIKE Kobe AD NXT FF", "Kobe Bryant", 200, "an amazing shoe", 0, 0)
//     .then((confirm:any)=>{});
//
// insertShoe("/img/dom.jpg", "Adidas D.O.N. Issue 1", "Donavan Mitchell", 100, "an amazing shoe", 0, 0)
//     .then((confirm:any)=>{});

module.exports = router;
