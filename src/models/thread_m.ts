const ObjectId = require("mongodb").ObjectID;

export class Thread {

    public _id: any;
    public user: string;
    public title: string;
    public content: string;
    public tags: string[];

    constructor(_id: string, user: string, title: string, content: string, tags: string[]) {
        this._id = ObjectId(_id);
        this.user = user;
        this.title = title;
        this.content = content;
        this.tags = tags;
    }

    public isValid() {
        return(this.title !== "" && this.content !== "");
    }
}
