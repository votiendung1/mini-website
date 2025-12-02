const { admin, db } = require('../config/firebase');

// Middleware xác thực user có đăng nhập
exports.authenticateUser = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ 
        success: false,
        error: 'Unauthorized: No token provided' 
      });
    }

    const token = authHeader.split('Bearer ')[1];
    
    // Verify token với Firebase Admin
    const decodedToken = await admin.auth().verifyIdToken(token);
    req.user = decodedToken;
    
    next();
  } catch (error) {
    console.error('Authentication error:', error);
    return res.status(401).json({ 
      success: false,
      error: 'Unauthorized: Invalid token' 
    });
  }
};

// Middleware kiểm tra user có phải Admin
exports.requireAdmin = async (req, res, next) => {
  try {
    const userId = req.user.uid;
    
    // Lấy thông tin user từ Firestore
    const userDoc = await db.collection('users').doc(userId).get();
    
    if (!userDoc.exists) {
      return res.status(403).json({ 
        success: false,
        error: 'Forbidden: User not found' 
      });
    }
    
    const userData = userDoc.data();
    
    if (userData.role !== 'admin') {
      return res.status(403).json({ 
        success: false,
        error: 'Forbidden: Admin access required' 
      });
    }
    
    req.userRole = userData.role;
    next();
  } catch (error) {
    console.error('Authorization error:', error);
    return res.status(403).json({ 
      success: false,
      error: 'Forbidden: Authorization failed' 
    });
  }
};