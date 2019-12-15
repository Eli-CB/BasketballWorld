import {Request, Response} from "express";
import {isLoggedIn, retrieveProfile} from "./profile";
import {Shoe} from "../models/shoe_m"
const DbClient = require("../DbClient");

// simplifies the insert functionality
 export async function insertShoe(image: any, model: string, player: string, price: number, likes: number, dislikes: number) {
     const shoe = new Shoe(image, model, player, price, likes, dislikes);
     const temp = await DbClient.shoesCol.findOne({model: model});
     if (temp === null) {
         return await DbClient.shoesCol.insertOne(shoe);
     } else {
         return;
     }
 }
// removes shoe from data base (used this before i was connected to mongo atlas)
export async function deleteShoe(player: string) {
    const shoe = await DbClient.shoesCol.findOne({player: player});
    return await DbClient.shoesCol.deleteOne(shoe);
}

// increments an object of class shoe's "likes" number
export async function like(ID: string) {
    const shoe = await DbClient.shoesCol.findOne({_id: ID});
    return await DbClient.shoesCol.updateOne({_id: shoe._id}, {$inc: {likes: 1}});
}

// increments an object of class shoe's "dislikes" number
export async function dislike(ID: string) {
    const shoe = await DbClient.shoesCol.findOne({_id: ID});
    return await DbClient.shoesCol.updateOne({_id: shoe._id}, {$inc: {dislikes: 1}});
}

// sorts shoe order based on parameters
export async function sortShoes(order: any) {
    const shoes = await DbClient.shoesCol.find().sort(order).toArray();
    const likes = shoes.map((shoe: any) => "/shoes/likes/" + shoe._id.toString());
    const dislikes = shoes.map((shoe: any) => "/shoes/dislikes/" + shoe._id.toString());
    return [shoes, likes, dislikes];
}
