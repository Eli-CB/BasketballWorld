const DbClient = require("../DbClient");

before(async () => {
    await DbClient.connect("bbworld_test");
});

export class MockReq {
    public body: any;
    public cookies: any;
    public params: any;
    constructor() {
        this.body = null;
        this.cookies = null;
        this.params = null;
    }
    public setUserName(name: string) {
        this.cookies = {
            username: name,
        };
    }
    public setThreadID(id: string) {
        this.params = {
            id: id,
        };
    }
    public setThreadAspects(title: string, desc: string, tag0: string, tag1: string, tag2: string) {
        this.body = {
            description: desc,
            tag0: tag0,
            tag1: tag1,
            tag2: tag2,
            title: title,
        };
    }

}
export class MockRes {
    public options: any;
    constructor() {
        this.options = null;
    }
    public render(pug: string, options: any) {
        this.options = options;
    }
}
