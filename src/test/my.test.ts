import {assert} from 'chai';
const DbClient = require("../DbClient");
import {isBanned, isBannedBy_account, isAdmin, isAdmin_render, canModify, canModify_Thread} from "../managers/activityHandling";
import { MockReq } from "./helper.test";
import { MockRes } from "./helper.test";

describe("Activity Handling Tests", ()=>{
    it ("user is not banned", async ()=>{
        let req = new MockReq();
        let res = new MockRes();
        req.setUserName("cole");
        assert.equal(await isBanned(req, res), false);
        assert((await isBannedBy_account("cole", res)) === false);
        assert(await isAdmin(req) === true);
        assert(await isAdmin_render(req, res) === true);
    });
    it ("user is banned", async ()=>{
        //let db = await DbClient.connect();
        let req = new MockReq();
        let res = new MockRes();
        req.setUserName("jerry");
        assert(await isBanned(req, res) === true);
        assert((await isBannedBy_account("jerry", res)) === true);
        assert(await isAdmin(req) === false);
    });
    it ("")
});