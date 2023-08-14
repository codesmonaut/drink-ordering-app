require(`dotenv`).config();

const express = require(`express`);
const mongoose = require(`mongoose`);
const cors = require(`cors`);
const cookieParser = require(`cookie-parser`);
const helmet = require(`helmet`);
const hpp = require(`hpp`);
const rateLimit = require(`express-rate-limit`);
const mongoSanitize = require(`express-mongo-sanitize`);

const drinkRouter = require(`./routes/drinks.routes`);
const authRouter = require(`./routes/auth.routes`);
const userRouter = require(`./routes/users.routes`);
const orderRouter = require(`./routes/orders.routes`);
const storeRouter = require(`./routes/stores.routes`);
const serverLimit = require(`./config/serverLimit`);
const ErrorResponse = require(`./utils/ErrorResponse`);
const handleError = require(`./utils/handleError`);

// APP CONFIG
const app = express();
const baseUrl = process.env.BASE_URL;
const port = process.env.PORT;
const database = process.env.DATABASE;

// MIDDLEWARES
app.use(express.json({ limit: '10kb' }));
app.use(cors());
app.use(cookieParser());
app.use(helmet());
app.use(hpp());
app.use(rateLimit(serverLimit));
app.use(mongoSanitize());

// STATIC FILES
app.use(`/img`, express.static(`./img`));

// DB CONFIG
mongoose.connect(database).then(() => console.log(`Connected to database`));

// API ENDPOINTS
app.use(`/api/v1/drinks`, drinkRouter);
app.use(`/api/v1/auth`, authRouter);
app.use(`/api/v1/users`, userRouter);
app.use(`/api/v1/orders`, orderRouter);
app.use(`/api/v1/stores`, storeRouter);

app.all(`*`, (req, res) => {
    handleError(res, new ErrorResponse(404, `Page ${req.originalUrl} not found.`));
})

// LISTENER
app.listen(port, () => {
    console.log(`Server is running on: ${baseUrl}${port}/`);
})