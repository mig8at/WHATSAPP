import multer from 'multer';

export const upload = multer({ storage: multer.memoryStorage() });

export const verifyToken = (req: any, res: any, next: any) => {
    const token = req.headers['token'];
    if (token !== process.env.TOKEN) {
        return res.status(401).send('Unauthorized');
    }
    next();
};

