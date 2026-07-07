import express, { type Express } from "express";
import cors from "cors";
import pinoHttp from "pino-http";
import { clerkMiddleware } from "@clerk/express";
import { publishableKeyFromHost } from "@clerk/shared/keys";
import router from "./routes";
import { logger } from "./lib/logger";
import {
  CLERK_PROXY_PATH,
  clerkProxyMiddleware,
  getClerkProxyHost,
} from "./middlewares/clerkProxyMiddleware";

const app: Express = express();
const clerkPublishableKey = process.env.CLERK_PUBLISHABLE_KEY;
const hasValidClerkPublishableKey =
  typeof clerkPublishableKey === "string" &&
  /^pk_(test|live)_[A-Za-z0-9_-]{20,}$/.test(clerkPublishableKey);

app.use(
  pinoHttp({
    logger,
    serializers: {
      req(req) {
        return {
          id: req.id,
          method: req.method,
          url: req.url?.split("?")[0],
        };
      },
      res(res) {
        return {
          statusCode: res.statusCode,
        };
      },
    },
  }),
);

// Clerk proxy must run before body parsers (it streams raw bytes).
app.use(CLERK_PROXY_PATH, clerkProxyMiddleware());

app.use(cors({ credentials: true, origin: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

if (hasValidClerkPublishableKey) {
  // Resolve the publishable key from the incoming request host so the same
  // server can serve multiple Clerk custom domains. Falls back to
  // CLERK_PUBLISHABLE_KEY when the host doesn't map to a custom domain.
  app.use(
    clerkMiddleware((req) => ({
      publishableKey: publishableKeyFromHost(
        getClerkProxyHost(req) ?? "",
        clerkPublishableKey,
      ),
    })),
  );
} else {
  logger.warn(
    "CLERK_PUBLISHABLE_KEY is missing or invalid; Clerk API middleware is disabled.",
  );
}

app.use("/api", router);

export default app;
