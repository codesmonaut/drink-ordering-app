require(`dotenv`).config();

const express = require(`express`);
const mongoose = require(`mongoose`);
const cors = require(`cors`);

const drinkRouter = require(`./routes/drinks.routes`);

// APP CONFIG
const app = express();
const baseUrl = process.env.BASE_URL;
const port = process.env.PORT;
const database = process.env.DATABASE;

// MIDDLEWARES
app.use(express.json({ limit: '10kb' }));
app.use(cors());

// DB CONFIG
mongoose.connect(database).then(() => console.log(`Connected to database`));

// API ENDPOINTS
app.use(`/api/v1/drinks`, drinkRouter);

// LISTENER
app.listen(port, () => {
    console.log(`Server is running on: ${baseUrl}${port}/`);
})