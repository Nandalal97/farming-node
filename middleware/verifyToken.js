const jwt = require('jsonwebtoken');

const verifyToken=(req,res,next)=>{
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Extract token after "Bearer"

  if (!token) {
    return res.status(401).json({ status: 0, msg: 'Unauthorized. Token missing.' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET); // use your secret key
    req.user = decoded; // Attach user info to request
    next();
  } catch (err) {
    return res.status(403).json({ status: 0, msg: 'Invalid or expired token.' });
  }

}

module.exports=verifyToken