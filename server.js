require(`dotenv`).config();

const express = require(`express`);
const mongoose = require(`mongoose`);
const cors = require(`cors`);
const cookieParser = require(`cookie-parser`);

const drinkRouter = require(`./routes/drinks.routes`);
const authRouter = require(`./routes/auth.routes`);
const userRouter = require(`./routes/users.routes`);
const orderRouter = require(`./routes/orders.routes`);

// APP CONFIG
const app = express();
const baseUrl = process.env.BASE_URL;
const port = process.env.PORT;
const database = process.env.DATABASE;

// MIDDLEWARES
app.use(express.json({ limit: '10kb' }));
app.use(cors());
app.use(cookieParser());

// STATIC FILES
app.use(`/img`, express.static(`./img`));

// DB CONFIG
mongoose.connect(database).then(() => console.log(`Connected to database`));

// API ENDPOINTS
app.use(`/api/v1/drinks`, drinkRouter);
app.use(`/api/v1/auth`, authRouter);
app.use(`/api/v1/users`, userRouter);
app.use(`/api/v1/orders`, orderRouter);

// LISTENER
app.listen(port, () => {
    console.log(`Server is running on: ${baseUrl}${port}/`);
})