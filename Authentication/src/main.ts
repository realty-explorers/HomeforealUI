import 'dotenv/config';
import cors from "cors";
import express from "express";
import supertokens from "supertokens-node";
import { middleware, errorHandler, SessionRequest } from "supertokens-node/framework/express";
import initSupertokens from "./supertokens-init";
import { verifySession } from "supertokens-node/recipe/session/framework/express";
import UserMetadata from "supertokens-node/recipe/usermetadata";
import Session from "supertokens-node/recipe/session";

initSupertokens();
const app = express();

app.use(
    cors({
        origin: process.env.HOST,
        allowedHeaders: ['content-type', ...supertokens.getAllCORSHeaders()],
        credentials: true,
    }),
);

app.use(middleware());
app.use(express.json());

app.use(errorHandler());
app.post("/meow", verifySession(), async (req: SessionRequest, res) => {
    console.log('hi')
    const session = req.session;
    const userId = session!.getUserId();

    await UserMetadata.updateUserMetadata(userId, { newKey: "data" });

    res.json({ message: "successfully updated user metadata" });
});

app.post("/meow2", async (req, res) => {
    console.log('hi')
    res.json({ message: "meow" });
});

app.post("/like-comment", async (req, res, next) => {
    try {
        let session = await Session.getSession(req, res);

        if (session === undefined) {
            throw Error("Should never come here")
        }

        let userId = session.getUserId();
        res.json({ 'userid': userId })
        //....
    } catch (err) {
        next(err);
    }
});

app.listen(process.env.PORT, () => {
    console.log(`server started in ${process.env.PORT}`);
});
