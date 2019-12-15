import {Request, Response, Router} from "express";
import {isAdmin_render, createRoot} from "../managers/activityHandling";
import {retrieveProfiles, deleteProfileByID} from "../managers/profile";
const DbClient = require("../DbClient");
const router = Router();
const ObjectId = require("mongodb").ObjectID;

router.get("/", (req: Request, res: Response) => {
    isAdmin_render(req, res)
        .then((bool: boolean) => {
            if (bool) {
                res.render("placeholders/admin", {user: req.cookies.username});
            }
        });
});
router.get("/profiles", (req: Request, res: Response) => {
    isAdmin_render(req, res)
        .then((bool: boolean) => {
            if (bool) {
                retrieveProfiles()
                    .then((profiles: any) => {
                        const ids = profiles.map((profile: any) => profile._id.toString());
                        res.render("placeholders/admin_list_profiles", {
                            ids: ids,
                            profiles: profiles,
                            user: req.cookies.username,
                        });
                    });
            }
        });

});

router.get("/delete/:id", (req: Request, res: Response) => {
    isAdmin_render(req, res)
        .then((bool: boolean) => {
            if (bool) {
                deleteProfileByID(req.params.id)
                    .then((val: any) => {
                        res.redirect("/admin/profiles");
                    });
            }
        });
});

async function makeUserAdmin(userId: any) {
    await DbClient.usersCol.updateOne({_id: ObjectId(userId)}, {$set: {level : 2}});
}

async function makeUserBan(userId: any) {
    await DbClient.usersCol.updateOne({_id: ObjectId(userId)}, {$set: {level : 0}});
}

async function makeUserNormal(userId: any) {
    await DbClient.usersCol.updateOne({_id: ObjectId(userId)}, {$set: {level : 1}});
}

router.get("/makeAdmin/:id", (req: Request, res: Response) => {
   isAdmin_render(req, res)
       .then((bool: boolean) => {
           if (bool) {
               makeUserAdmin(req.params.id)
                   .then(() => {
                       res.redirect("/admin/profiles");
                   });
           }
       });
});
router.get("/makeNormal/:id", (req: Request, res: Response) => {
    isAdmin_render(req, res)
        .then((bool: boolean) => {
            if (bool) {
                makeUserNormal(req.params.id)
                    .then(() => {
                        res.redirect("/admin/profiles");
                    });
            }
        });
});
router.get("/ban/:id", (req: Request, res: Response) => {
    isAdmin_render(req, res)
        .then((bool: boolean) => {
            if (bool) {
                makeUserBan(req.params.id)
                    .then(() => {
                        res.redirect("/admin/profiles");
                    });
            }
        });
});
router.get("/createRoot", (req: Request, res: Response) => {
    createRoot()
        .then(() => {
            res.render("index", {user: req.cookies.user, message: "root created"});
        });
});

module.exports = router;
