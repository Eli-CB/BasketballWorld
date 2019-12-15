// https://mochajs.org/#getting-started
// https://www.chaijs.com/api/assert/
// https://stackoverflow.com/a/47450902

import {MongoClient} from "mongodb";
import {assert} from 'chai';
const ObjectId = require("mongodb").ObjectID;

const DbClient = require("../DbClient");

describe('USER TEST SUITE', function async () {
    it("findOne() user", async () => {
        const result = await DbClient.usersCol.findOne({_id: "5deb415d1c9d4400002392c3"});
        assert.equal(true, true);
    });
});

after(function() {
    process.exit();
});
