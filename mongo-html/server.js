const express = require('express');
const mongoose = require('mongoose');
const app = express();
const ejs = require('ejs');
const bodyParser = require('body-parser');
const { kStringMaxLength } = require('buffer');
const { urlencoded } = require('body-parser');

app.set('view engine', 'ejs');

mongoose.connect('mongodb+srv://pranamya:mady123@cluster0.kybnra9.mongodb.net/TakeCare?retryWrites=true&w=majority');

const doctorsSchema = {

    name: String,
    address: String,
    exp: String,
    location: String,
    specialization: String,
    email_id: String
}


app.use(urlencoded({ extended: true }));


app.get("/", function (req, res) {
    res.sendFile(__dirname + "/index1.html");
});

app.post('/', (req, res) => {
    // console.log(req.body);
    const r = req.body;
    const Doctor = mongoose.models.Doctor || mongoose.model('Doctor', doctorsSchema)

    Doctor.find({ specialization: r.sp }, function (err, Doctors) {
        // console.log(r.sp);
        //  console.log(Doctors);
        res.render('index', {
            dList: Doctors
        })
    })
})

app.listen(27017, function () {
    console.log('server is running');
})
