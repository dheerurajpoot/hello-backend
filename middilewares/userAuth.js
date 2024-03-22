import jwt from 'jsonwebtoken';
import 'dotenv/config';

const userAuth = (req, res, next) => {
  try {
    const token = req.cookies.token;
    if (!token) {
      return res.status(401).json({
        message: "User not authenticated",
        success: false
      });
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    req.user = decoded.userID;
    next();
  } catch (error) {
    console.error("Authentication error:", error);
    return res.status(401).json({
      message: "Invalid or expired token",
      success: false
    });
  }
};

export default userAuth;
