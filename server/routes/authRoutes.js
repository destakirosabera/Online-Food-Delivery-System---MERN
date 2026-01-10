import express from 'express';
const router = express.Router();

router.post('/login', (req, res) => {
    // Academic simplified login
    const { email } = req.body;
    res.json({
        _id: 'mockId',
        name: 'Admas Student',
        email,
        isAdmin: email.includes('admin'),
        token: 'mock-jwt-token'
    });
});

export default router;