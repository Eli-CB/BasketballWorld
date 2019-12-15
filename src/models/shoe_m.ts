// intended to prevent each user from liking/disliking shoes as many times as they want
class userMap {
    public name: string;
    public status: number;

    constructor(name: string, status: number) {
        this.name = name;
        this.status = status;
    }
}

export class Shoe {

    public image: any;
    public model: string;
    public player: string;
    public price: number;
    public likes: number;
    public dislikes: number;
    public users: userMap[];

    // constructs shoe
    constructor(image: any, model: string, player: string, price: number, likes: number, dislikes: number) {
        this.image = image;
        this.model = model;
        this.player = player;
        this.price = price;
        this.likes = likes;
        this.dislikes = dislikes;
        this.users = [];
    }
}
