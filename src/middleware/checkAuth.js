const { prisma } = require("../models/prisma");
const jwt = require('jsonwebtoken');
const moment = require('moment-timezone');
const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
    throw new Error('JWT_SECRET is not defined in environment variables');
}

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
            include: {
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

        // Konversi expiresAt dari UTC ke UTC+7 (Asia/Jakarta)
        const expiresAtUTC = moment.utc(checkTokenDatabase.expiresAt);
        const expiresAtJakarta = expiresAtUTC.tz('Asia/Jakarta');

        // Periksa waktu kadaluarsa token
        if (expiresAtJakarta.isBefore(moment())) {
            // Hapus token dari database jika sudah kadaluarsa
            await prisma.token.delete({
                where: { id: checkTokenDatabase.id }
            });

            return res.status(401).json({ 
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
        // return res.json(req.user);

        next();
    } catch (error) {
        if (error.name === "TokenExpiredError") {
            // Token kadaluarsa
            await prisma.token.delete({
                where: { id: checkTokenDatabase.id }
            });
            return res.status(401).json({ 
                status: 'error',
                message: 'Expired Token'
            });
        }

        console.error('Internal Server Error:', error);
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
