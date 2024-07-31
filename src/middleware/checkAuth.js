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

    try {
        // Periksa token di database
        const checkTokenDatabase = await prisma.token.findFirst({
            where: { token },
            include:{
                user: true
            }
        });

        if (!checkTokenDatabase) {
            return res.status(401).json({ 
                status: 'error', 
                message: 'Invalid Token' 
            });
        }

        // Verifikasi token
        const decoded = jwt.verify(token, JWT_SECRET);

        // Periksa waktu kadaluarsa token
        if (checkTokenDatabase.expiresAt < new Date()) {
            // Hapus token dari database jika sudah kadaluarsa
            await prisma.token.delete({
                where: { token }
            });

            return res.status(400).json({ 
                status: 'error',
                message: 'Expired Token'
            });
        }

        req.user = {
            ...decoded,
            name: checkTokenDatabase.user.name,
            username: checkTokenDatabase.user.username,
            email: checkTokenDatabase.user.email,
            address: checkTokenDatabase.user.address

        };

        next();
    } catch (error) {
        if (error.name === "TokenExpiredError") {
            // Token kadaluarsa
            await prisma.token.delete({
                where: { token }
            });
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

module.exports = checkAuth;
