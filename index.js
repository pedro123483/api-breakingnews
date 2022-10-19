import express from 'express';
import userRoute from './src/routes/user.route.js';

const app = express();
const PORT = 3000;

app.use('/soma', userRoute);

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
