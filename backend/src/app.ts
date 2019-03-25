import bodyParser from "body-parser";
import cors from "cors";
import express from "express";
import Router from "./Router";

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use("/api", Router);

export default app;
