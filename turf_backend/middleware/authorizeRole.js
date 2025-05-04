// const authorizeRole = (...allowedRoles) => {
//   return (req, res, next) => {
//     const userRole = req.user.role?.toLowerCase(); // normalize to lowercase
//     const normalizedRoles = allowedRoles.map(role => role.toLowerCase());

//     if (!normalizedRoles.includes(userRole)) {
//       return res.status(403).json({ message: "Access denied: insufficient privileges" });
//     }

//     next();
//   };
// };

// module.exports = authorizeRole;
const authorizeRole = (...allowedRoles) => {
  return (req, res, next) => {
    // Log the user object to check if it's populated
    console.log("🚨 User data in authorizeRole:", req.user);

    if (!req.user || !req.user.role) {
      return res.status(401).json({ message: "Unauthorized: no user information found" });
    }

    const userRole = req.user.role.toLowerCase(); // normalize to lowercase
    const normalizedRoles = allowedRoles.map(role => role.toLowerCase());

    if (!normalizedRoles.includes(userRole)) {
      return res.status(403).json({ message: "Access denied: insufficient privileges" });
    }

    next();
  };
};

module.exports = authorizeRole;
