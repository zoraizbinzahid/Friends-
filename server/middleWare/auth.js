import jwt from "jsonwebtoken";

export const verifyToken = async (req, res, next) => {
  try {
    let token = req.header("Authorization");

    if (!token) {
      return res.status(401).send("Access Denied");
    }

    if (token.startsWith("Bearer ")) {
      token = token.sice(7, token.length).trimLeft();
    }

    const verified = jwt.verify(token, process.env.JWT_SEC);
    req.user = verified;
    next();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
