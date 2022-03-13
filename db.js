const mongoose = require('mongoose')
const app = require('./index.js')
const PORT = 5000;
mongoose.connect(process.env.MONGOURI, {

    useNewUrlParser: true,
    useUnifiedTopology: true
})
    .then(() => {
        console.log("Connected to DB");
        app.listen(PORT, () => {
            console.log("server is running");
        })
    })
    .catch((err) => {
        console.log("error with connecting database");
    })



// all db calls should be done in model while controller execute api
