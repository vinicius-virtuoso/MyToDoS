import "express-async-errors";
import express from "express";

import cors from "cors";
import { errorHandler } from "./errors";

import { routers } from "./routers";

export const app = express();

app.use(cors());
app.use(express.json());

app.use("/api", routers);

app.use(errorHandler);
