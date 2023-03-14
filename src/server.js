import Express from "express";
import cors from "cors";
import listEndpoints from "express-list-endpoints";
import blogpostsRouter from "./api/blogposts/index.js";
import authorsRouter from "./api/authors/index.js";
import {
  badReqHandler,
  generalErrorHandler,
  notFoundHandler,
} from "./errorsHandlers.js";
import avatarRouter from "./api/files/avatar.js";
import coverRouter from "./api/files/cover.js";
import commentsRouter from "./api/comments/index.js";
import createHttpError from "http-errors";
import pdfRouter from "./api/files/pdf.js";
import csvRouter from "./api/files/csv.js";

const server = Express();
const port = process.env.PORT;

const whitelist = [process.env.FE_DEV_URL, process.env.FE_PROD_URL];

const corsOpts = {
  origin: (origin, corsNext) => {
    console.log("CURRENT ORIGIN: ", origin);
    if (!origin || whitelist.indexOf(origin) !== -1) {
      // If current origin is in the whitelist you can move on
      corsNext(null, true);
    } else {
      // If it is not --> error
      corsNext(
        createHttpError(400, `Origin ${origin} is not in the whitelist!`)
      );
    }
  },
};

server.use(cors(corsOpts));
server.use(Express.static("public"));

server.use(Express.json());

// ************************** ENDPOINTS ***********************

server.use("/", csvRouter);
server.use("/authors", authorsRouter);
server.use("/blogposts", blogpostsRouter);
server.use("/authors", avatarRouter);
server.use("/blogposts", coverRouter);
server.use("/blogposts", commentsRouter);
server.use("/blogposts", pdfRouter);

// ************************* ERROR HANDLERS *******************

server.use(badReqHandler);
server.use(notFoundHandler);
server.use(generalErrorHandler);

server.listen(port, () => {
  console.table(listEndpoints(server));
  console.log("Server works on port: ", port);
});
