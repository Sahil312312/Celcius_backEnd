const express = require('express')
const morgan = require('morgan')

const app = express();


const eventRouter = require('./routes/eventRoutes');
const commonRouter = require('./routes/commonRoutes')
const userRouter = require('./routes/userRoutes')


  app.use(morgan('dev'));

  app.use(express.json({ limit: '10kb' }));



//3.) Routes
app.use("/api/v1/event",eventRouter);
app.use("/api/v1/common",commonRouter);
app.use("/api/v1/user",userRouter);



module.exports = app;


