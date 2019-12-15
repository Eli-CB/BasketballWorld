import DbClient = require("../DbClient");
import {assert} from "chai";
import {like, dislike, insertShoe} from "../managers/shoe";
import {Shoe} from "../models/shoe_m";

const testshoe =  new Shoe("/img/LBJ17", "test model", "dak prescott", 12, 0, 0);

describe("SHOES TEST SUITE", () => {
    // tests insertShoe() functionality
    it("insertShoe()", async () => {
        await insertShoe(testshoe.image, testshoe.model, testshoe.player, testshoe.price, testshoe.likes, testshoe.likes);
        const test = await DbClient.shoesCol.findOne({player: testshoe.player});
        assert(test.player === "dak prescott");
    });

    // tests like() functionality
    it("like()", async () => {
        const test = await DbClient.shoesCol.findOne({player: testshoe.player});
        const likenumber = test.likes;
        const ID = test._id;
        await like(ID);
        const test2 = await DbClient.shoesCol.findOne({player: testshoe.player});
        const likenumber2 = test2.likes;
        assert(likenumber2 === likenumber + 1);
    });

    // tests dislike() functionality
    it("dislike()", async () => {
        const test = await DbClient.shoesCol.findOne({player: testshoe.player});
        const dislikenumber = test.dislikes;
        const ID = test._id;
        await dislike(ID);
        const test2 = await DbClient.shoesCol.findOne({player: testshoe.player});
        const dislikenumber2 = test2.dislikes;
        assert(dislikenumber2 === dislikenumber + 1);
    });

});
