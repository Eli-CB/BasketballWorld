import { assert } from "chai";
import { MockReq } from "./helper.test";
import { MockRes } from "./helper.test";
import { createThread, deleteThread, getThread, findAllPosts } from "../managers/thread";
const DbClient = require("../DbClient");
const { Thread } = require("../models/thread_m");

// A mock user created from the User model
const mockThread = new Thread();
mockThread._id = "5deb29571c9d4400009a59f9";
mockThread.title = "Test title for a thread";
mockThread.content = "Test content for a thread";
mockThread.tags = ["test tag", "other tag"];
mockThread.user = "JohnSmith";

// The test suite for threads
describe("THREAD TEST SUITE", function async() {

    it("getThread(string) function test", async () => {
        const result = await getThread(mockThread._id);
        // If the mock thread called by getThread is the same as the result then pass
        assert.equal(result._id, mockThread._id);
    });

    let newThreadID: any;

    it("createThread(req, res) function test", async () => {
        // Used to mock response and requests
        const req = new MockReq();
        const res = new MockRes();
        req.setThreadAspects("Test title", "Test description", "tag0", "tag1", "tag2");
        req.setUserName("admin");
        const result = await createThread(req, res);
        newThreadID = DbClient.threadsCol.find({_id: result._id})._id;
        // If the created thread id matches the returned result then pass
        assert.equal(result._id, newThreadID);
    });

    // it("deleteThread(req, res) function test", async () => {
    //     // Must be an admin user to call deleteThread
    //     const req = new MockReq();
    //     const res = new MockRes();
    //     req.setUserName("admin");
    //     req.setThreadID(newThreadID);
    //     await deleteThread(req, res);
    // });

    it("findAllPosts(string) function test", async () => {
        const result = await findAllPosts(mockThread._id);
        const postID = "5deb2d1b3c2df100002ba653";
        // If the post ID is the same as the one returned from findAllPosts then pass
        assert.equal(result[0]._id, postID);
    });

});
