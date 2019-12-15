import {Request, Response, Router} from "express";
import {
    isLoggedIn,
    createNewProfile,
    retrieveProfile,
    login,
    pushTag,
    pullTag,
    editEmail,
    editPassword,
    allTags,
} from "../managers/profile";
import {retrieveTaggedThreads, retrieveMyThreads} from "../managers/thread";
import createProfileForm from "../mymodels/createProfile";
// import {isBanned, isBannedBy_account} from "../managers/activityHandling"
const router = Router();

router.get("/create", (req: Request, res: Response) => {
    if (!isLoggedIn(req, res)) {
        res.render("profile/create");
    }
});
router.post("/create", (req: Request, res: Response) => {
    if (isLoggedIn(req, res)) {
        return;
    }
    const form = new createProfileForm(req);
    form.isValidForm(res)
        .then((bool: boolean) => {
            if (bool) {
                createNewProfile(form)
                    .then(() => {
                        return login(res, form);
                    });
            }
        });
});

router.get("/login", (req: Request, res: Response) => {
    if (!isLoggedIn(req, res)) {
        res.render("profile/login");
    }
});

router.post("/login", (req: Request, res: Response) => {
    const form = new createProfileForm(req);
    if (!isLoggedIn(req, res) || !form.isLoginFormComplete(res)) {
        login(res, form).then();
    }
});

router.get("/logout", (req: Request, res: Response) => {
    res.clearCookie("username");
    res.render("profile/login");
});
router.get("/home", async (req: Request, res: Response) => {
    res.render("profile/home", {
        myThreads: await retrieveMyThreads(req, res).catch((e: any) => console.log(e)),
        profile: await retrieveProfile(req, res).catch((e: any) => console.log(e)),
        threads: await retrieveTaggedThreads(req, res).catch((e: any) => console.log(e)),
        user: req.cookies.username,
    });
});

router.get("/discover", async (req: Request, res: Response) => {
    res.render("profile/discover", {
        allTags: await allTags(req, res).catch((e: any) => console.log(e)),
        profile: await retrieveProfile(req, res).catch((e: any) => console.log(e)),
        user: req.cookies.username,
    });
});

router.post("/pushtag", async (req: Request, res: Response) => {
    await pushTag(req, res);
    res.redirect("/profile/home");
});

router.post("/pulltag", async (req: Request, res: Response) => {
    await pullTag(req, res);
    res.redirect("/profile/home");
});

router.post("/editemail", async (req: Request, res: Response) => {
    await editEmail(req, res);
    res.redirect("/profile/home");
});

router.post("/editpassword", async (req: Request, res: Response) => {
    await editPassword(req, res);
    res.redirect("/profile/home");
});

module.exports = router;
