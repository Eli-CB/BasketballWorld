import {Shoe} from "./shoe_m";
export class Profile {

    public name: string;
    public email: string;
    public pw: string;
    public tags: string[];
    public shoes: Shoe[];

    constructor(name: string, email: string, pw: string, tags: string[], shoes: Shoe[]) {
        this.name = name;
        this.email = email;
        this.pw = pw;
        this.tags = tags;
        this.shoes = shoes;
    }

    public isValid() {
        return(this.name !== "" && this.email !== "" && this.pw !== "");
    }

    public verify(pw: string) {
        return(this.pw === pw);
    }
}
