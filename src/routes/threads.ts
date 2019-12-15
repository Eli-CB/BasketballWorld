import {Request, Response, NextFunction, Router} from "express";
import {isLoggedIn, isLoggedIn_NoRender, pushTag, retrieveProfile} from "../managers/profile";
const DbClient = require("../DbClient");
const router = Router();
const ObjectId = require("mongodb").ObjectID;
import createPostForm from "../mymodels/createPost";
import {isBanned, isAdmin, isBannedBy_account, canModify, canModify_Thread, canModify_Post} from "../managers/activityHandling";
import {
    listThreads,
    createThread,
    deleteThread,
    editThread,
    retrieveTaggedThreads,
    retrieveMyThreads,
    findAllPosts,
    getThread, pushLike, pullLike, pushDislike, pullDislike, report,
} from "../managers/thread";

router.get("/view", (req: Request, res: Response) => {
    listThreads()
        .then(async (threads: any) => {
            res.render("threads/view", {
                user: req.cookies.username,
                profile: await retrieveProfile(req, res).catch((e: any) => console.log(e)),
                threads: threads[0],
                links: threads[1]});
        });
});

router.get("/create", (req: Request, res: Response) => {
    isBanned(req, res)
        .then((bool: boolean) => {
            if (!bool) {
                res.render("threads/create", {user: req.cookies.username});
            }
        });
});

router.post("/create", async (req: Request, res: Response) => {
    if (!(await isBanned(req, res))) {
        await createThread(req, res).then((id: any) => {
            res.redirect("/threads/" + id.insertedId.toString());
        });
    }
});

router.post("/delete/:id", async (req: Request, res: Response) => {
    if (await deleteThread(req, res)) {
        res.redirect("/profile/home");
    }
});

router.post("/edit/:id", async (req: Request, res: Response) => {
    const threadID = new ObjectId(req.params.id);

    if (await canModify_Thread(ObjectId(req.params.id), req, res)) {
        res.render("threads/edit", {
            thread: await getThread(threadID).catch((err: any) => console.log(err)),
            user: req.cookies.username,
        });
    }
});

router.post("/confirm", async (req: Request, res: Response) => {
    await editThread(req, res);
    res.redirect("/profile/home");
});

router.get("/editPost/:id", (req: Request, res: Response) => {
    DbClient.postsCol.findOne({_id: ObjectId(req.params.id)})
        .then((post: any) => {
            if (post === null) {
                res.render("index", {
                    message: "post does not exist",
                    user: req.cookies.username,
                });
                return;
            }
            canModify(post, req, res)
                .then((bool: boolean) => {
                    if (bool) {
                        res.render("threads/editPost", {user: req.cookies.username, post: post});
                    }
                });
        });
});
router.post("/editPost/:parent/:id", (req: Request, res: Response) => {
    canModify_Post(ObjectId(req.params.id), req, res)
        .then((bool: boolean) => {
            if (bool) {
                DbClient.postsCol.updateOne({_id: ObjectId(req.params.id)}, {$set: {content: req.body.content}})
                    .then(() => {
                        res.redirect("/threads/" + req.params.parent);
                    });
            }
        });
});
router.get("/editThread/:id", (req: Request, res: Response) => {
    canModify_Thread(req.params.id, req, res)
        .then((bool: boolean) => {
            if (bool) {
                DbClient.threadsCol.findOne({_id: ObjectId(req.params.id)})
                    .then((thread: any) => {
                        if (thread === null) {
                            res.render("index", {
                                message: "thread does not exist",
                                user: req.cookies.username,
                            });
                        }
                        res.render("threads/edit", {user: req.cookies.username, thread: thread});
                    });
            }
        });
});

router.get("/report/:id", async (req: Request, res: Response) => {
    await report(req.params.id).catch((e: any) => console.log(e));
    res.redirect("/threads/view");
});

router.post("/pushLike/:id", async (req: Request, res: Response) => {
    await pushLike(req, res).catch((e: any) => console.log(e));
    res.redirect("/threads/view");
});

router.post("/pullLike/:id", async (req: Request, res: Response) => {
    await pullLike(req, res).catch((e: any) => console.log(e));
    res.redirect("/threads/view");
});

router.post("/pushDislike/:id", async (req: Request, res: Response) => {
    await pushDislike(req, res).catch((e: any) => console.log(e));
    res.redirect("/threads/view");
});

router.post("/pullDislike/:id", async (req: Request, res: Response) => {
    await pullDislike(req, res).catch((e: any) => console.log(e));
    res.redirect("/threads/view");
});


router.get("/:thread", (req: Request, res: Response) => {
    getThread(req.params.thread)
        .then((thread: any) => {
            if (thread === null) {
                res.render("index", { message: "couldn't find page, sorry" });
            } else {
                isAdmin(req)
                    .then((amAdmin: boolean) => {
                        let thisIsMine: boolean;
                        thisIsMine = amAdmin || req.cookies.username === thread.author;
                        findAllPosts(req.params.thread)
                            .then((posts) => {
                                let isMine: any;
                                if (!amAdmin) {
                                    isMine = posts.map((post: any) => (post.author === req.cookies.username));
                                } else {
                                    isMine = posts.map((post: any) => true);
                                }
                                res.render("threads/thread", {
                                    isMine: isMine,
                                    posts: posts,
                                    target: "/threads/" + req.params.thread,
                                    thisIsMine: thisIsMine,
                                    thread: thread,
                                    user: req.cookies.username,
                                });
                            });
                    });
            }
        });
});

router.post("/:thread",  (req: Request, res: Response) => {
    isBanned(req, res)
        .then((bool: boolean) => {
            if (!bool) {
                if (!isLoggedIn_NoRender(req, res)) {
                    return;
                }
                const newPost = new createPostForm(req);
                if (newPost.isFormComplete(res)) {
                    DbClient.postsCol.insertOne({
                        author: newPost.author,
                        content: newPost.content,
                        date: newPost.date,
                        ms: newPost.ms,
                        parentThread: newPost.parentThread,
                    }).then(() => {
                            res.redirect("/threads/" + req.params.thread);
                        });
                }
            }
        });
});

module.exports = router;
