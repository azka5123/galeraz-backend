const { prisma } = require("../models/prisma");
const JWT_SECRET = process.env.JWT_SECRET;
const jwt = require('jsonwebtoken');


async function checkAuth(req, res, next) {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (!token) {
        return res.status(401).json({ 
            status: 'error', 
            message: 'Access Denied' 
        });
    }
    const checkTokenDatabase = await prisma.token.findFirst({ where: { token } });
    try {
        const check = jwt.verify(token, JWT_SECRET);
        if (!check || checkTokenDatabase.expiresAt < new Date()) {
            return res.status(400).json({ 
                status: 'error',
                message: 'Invalid Or Expired Token'
             });
        }
        req.user = check;
        next();
    } catch (error) {
        if(error.name === "TokenExpiredError"){
            checkTokenDatabase.destroy();
        }
        res.status(500).json({ 
            status: 'error', 
            message: 'Internal Server Error',
            error: {
                message: error.message,
                error: error,
              },
        });
    }
}

module.exports = checkAuth
