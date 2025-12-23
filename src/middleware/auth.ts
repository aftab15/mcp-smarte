import { RequestHandler } from "express";

export const authGate: RequestHandler = (req, res, next) => {
  try {
    const auth = (req.headers["authorization"] as string | undefined) || "";
    const apiKey = (req.headers["apikey"] as string | undefined) || "";

    const bearer = auth.startsWith("Bearer ") ? auth.slice(7) : auth;
    const provided = (bearer && auth) || apiKey;

    if (!provided) {
      res.status(401).json({
        jsonrpc: "2.0",
        error: { code: -32001, message: "Unauthorized" },
        id: null,
      });
      return;
    }

    next();
  } catch {
    res.status(500).json({
      jsonrpc: "2.0",
      error: { code: -32603, message: "Internal server error" },
      id: null,
    });
  }
};
