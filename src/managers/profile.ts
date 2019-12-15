import {Response} from "express";
const DbClient = require("../DbClient");
const ObjectId = require("mongodb").ObjectID;

// given a request, renders a message if user is not logged in
export function isLoggedIn (req: any, res: any) {
    if ("username" in req.cookies) {
       res.render("index", {
            user: req.cookies.username,
            message: "you are already logged in",
       });
       return true;
    } else {
        return false;
    }
}

// given a request, returns false if user is not logged in, else true
export function isLoggedIn_NoRender(req: any, res: any) {
    if (!("username" in req.cookies)) {
        res.render("index", {
            user: req.cookies.username,
            message: "you are not logged in",
        });
        return false;
    } else {
        return true;
    }
}

// creates new profile given form
export async function createNewProfile(form: any) {
    await DbClient.usersCol.insertOne({name: form.name, email: form.email, pw: form.pw, level: 1});
}

// retrieves profile given cookies
export async function retrieveProfile(req: any, res: any) {
    return await DbClient.usersCol.findOne({name: req.cookies.username});
}

// logs user in given login form, renders message if error occurs
export async function login(res: Response, form: any) {
    const account = await DbClient.usersCol.findOne({name: form.name});
    if (account === null) {
        res.render("profile/login", {
            message: "can't find account, sorry",
        });
    } else if (account.pw !== form.pw) {
        res.render("profile/login", {
            message: "username or password is incorrect",
        });
    } else {
        res.cookie("username", form.name);
        res.redirect("/profile/home");
    }
}

// https://docs.mongodb.com/manual/reference/operator/update/push/
export async function pushTag(req: any, res: any) {
    await DbClient.usersCol.updateOne({name: req.cookies.username}, { $push: { tags: req.body.new } });
}

// https://docs.mongodb.com/manual/reference/operator/update/pull/
export async function pullTag(req: any, res: any) {
    await DbClient.usersCol.updateOne({name: req.cookies.username}, { $pull: { tags: req.body.tag} });
}

// https://docs.mongodb.com/manual/reference/operator/update/positional/
export async function editEmail(req: any, res: any) {
    await DbClient.usersCol.updateOne({name: req.cookies.username}, { $set: { email: req.body.email } });
}

// edits user's password given request
export async function editPassword(req: any, res: any) {
    await DbClient.usersCol.updateOne({name: req.cookies.username}, { $set: { pw: req.body.password } });
}

// lists all tags associated with user
export async function allTags(req: any, res: any) {
    const tags: string[] = [];
    const count: number[] = [];
    const aggregate: any[] = [];
    const users = await DbClient.usersCol.find().toArray();
    for (const user of users) {
        if(user.tags) {
            for (const tag of user.tags) {
                let flag = 0;
                tags.forEach((item, index) => {
                    if (item === tag) {
                        count[index] += 1;
                        flag = 1;
                    }
                });
                if (flag === 0) {
                    tags.push(tag);
                    count.push(1);
                }
            }
        }
    }
    tags.forEach((item, index) => {
        aggregate.push({count: count[index], tags: tags[index]})
    });
    return aggregate.sort((a, b) => (a.count < b.count) ? 1 : -1);
}

// retrieve array of all profiles
export async function retrieveProfiles() {
    return await DbClient.usersCol.find({}).toArray();
}

// delete a profile given its ID
export async function deleteProfileByID(id: string) {
    id = ObjectId(id);
    return await DbClient.usersCol.deleteOne({_id: ObjectId(id)});
}
