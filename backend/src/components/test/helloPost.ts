import { RequestHandler } from "express";
import axios from "axios";

const helloPost: RequestHandler = async (req, res, next) => {
    const name: string = req.body.name;

    const result = await axios.post(
        "https://jsonplaceholder.typicode.com/posts",
        {
            id: 1
        }
    );

    console.log(result.data);
    return res.status(200).send("Nice to meet you, " + name + "!");
};

export default helloPost;
