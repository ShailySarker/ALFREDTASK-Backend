
// module.exports = (req, res, next) => {
//   const token = req.header("Authorization")?.split(" ")[1];
//   if (!token) return res.status(401).json({ message: "Access Denied" });

//   try {
//     const verified = jwt.verify(token, process.env.JWT_SECRET);
//     req.user = verified;
//     next();
//   } catch {
//     res.status(403).json({ message: "Invalid Token" });
//   }
// };

const jwt = require("jsonwebtoken");

const verifyUser = (req, res, next) => {
  const authInfo = req.headers.authorization;
  // console.log(authInfo);
  const token = authInfo?.split(' ')[1];
  if (!token) {
      return res.status(403).json({ message: 'Access denied, no token provided!' });
  }
  try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = decoded;
      next();
  } catch (error) {
      return res.status(403).json({ message: 'Invalid or expired token!' });
  }
};

module.exports = { verifyUser };
