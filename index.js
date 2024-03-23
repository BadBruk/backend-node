import express from "express";
import router from './router.js'

const app = express();

app.use(router);
app.use(express.static('public'));
app.listen(3000, () => {
    console.log("Server listening on port 3000...");
});