import jwt from 'jsonwebtoken';

export const authenticateJWT = (req, res, next) => {
    const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET;
    const token = req.headers['authorization']?.split(' ')[1];

    if (!token) {
        return res.sendStatus(403);
    }

    jwt.verify(token, ACCESS_TOKEN_SECRET, (err, user) => {
        if (err) {
            return res.sendStatus(403);
        }
        req.user = user;
        next();
    });
};
