const jwt = require("jsonwebtoken")
exports.verifyToken = (req, res, next) => {
    const token = JSON.parse(req.headers.authorization.split(' ')[1]); // Get the token from the request headers
    if (!token) {
        return res.status(401).json({ error: 'Unauthorized: Token missing' });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, decodedToken) => {
        if (err) {
            return res.status(401).json({ error: 'Unauthorized: Invalid token' });
        }
        console.log(decodedToken)
        req.userId = decodedToken.id;
        req.authMethod = decodedToken.authMethod;
        console.log(req.userId)
        next();
    });
};