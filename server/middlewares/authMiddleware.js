// import jwt from "jsonwebtoken";

// const authMiddleware = (req, res, next) => {
//   try {
//     const authHeader = req.headers.authorization;

//     if (!authHeader || !authHeader.startsWith("Bearer ")) {
//       return res.status(401).json({
//         success: false,
//         message: "No token provided",
//       });
//     }

//     const token = authHeader.split(" ")[1];

//     const decoded = jwt.verify(token, process.env.JWT_SECRET);

//     req.user = decoded;

//     next();
//   } catch (error) {
//     return res.status(401).json({
//       success: false,
//       message: "Invalid token",
//     });
//   }
// };

// export default authMiddleware;



import jwt from "jsonwebtoken";

const authMiddleware = (req, res, next) => {
  try {

    const authHeader = req.headers.authorization;

    if (
      !authHeader ||
      !authHeader.startsWith("Bearer ")
    ) {
      return res.status(401).json({
        success: false,
        message: "No token provided",
      });
    }

    const token = authHeader.split(" ")[1];

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET
    );

    console.log("Decoded JWT:", decoded);

    /*
     * Your doctor controller uses req.user.id.
     * Keep the decoded object and also provide _id
     * so patient controller can use either.
     */

    req.user = {
      ...decoded,
      _id: decoded._id || decoded.id,
      id: decoded.id || decoded._id,
    };

    console.log("Authenticated user:", req.user);

    next();

  } catch (error) {

    console.error(
      "Auth middleware error:",
      error
    );

    return res.status(401).json({
      success: false,
      message: "Invalid token",
    });
  }
};

export default authMiddleware;