import { Db } from "mongodb";

class DbClient {
    public database!: Db;
    public threadsCol: any;
    public postsCol: any;
    public shoesCol: any;
    public usersCol: any;

    public async connect(databaseName: string) {
        // setup cloud database
        const MongoClient = require("mongodb").MongoClient;
        const uri = "mongodb+srv://admin:y!jPVfF3@*J54AC@bbworldcluster1-pisam.mongodb.net/test?retryWrites=true&w=majority";
        const client = await MongoClient(uri, { useUnifiedTopology: true, useNewUrlParser: true }).connect();
        this.database = client.db(databaseName);
        this.threadsCol = this.database.collection("threads");
        this.postsCol = this.database.collection("posts");
        this.usersCol = this.database.collection("users");
        this.shoesCol = this.database.collection("shoes");
    }
}

export = new DbClient();
