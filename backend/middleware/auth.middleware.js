const authMiddleware = (req, res, next) => {
    const token = req.headers['authorization']
    if (!token) {
        return res.status(401).json({ message: 'Token não fornecido!' })
    }
    next()
}

module.exports = authMiddleware