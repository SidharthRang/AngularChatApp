//Modules
require('./config/config.js');
var express = require('express');
var bodyParser = require('body-parser');
var formidable = require('formidable');
const hbs = require('hbs');
var fs = require('fs');
var mv = require('mv');
const http = require('http');
var { socket_io } = require('./socketEvents');

//Root Path
var rootPath = __dirname + '/./..';

//Models
var { Users } = require('./models/Users');
var { Messages } = require('./models/Messages');

//Middleware
var { auth } = require('./middleware/authentication');

//Paths and URLS
var port = process.env.PORT;
var mongodb_url = process.env.MONGODB_URI;
var angularPath = rootPath + "/views/angular";

//Mongoose instance
var mongoose = require('mongoose');
mongoose.Promise = global.Promise;

var app = express();

//SocketIO Connection
var server = http.createServer(app);
socket_io.init(server);

app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies

mongoose.connect(mongodb_url, { useNewUrlParser: true }).then(() => console.log('Connected To Database'))
    .catch((err) => console.error(err));

app.set("view engine", "hbs");

app.get('/', (req, res) => {
    res.render("loginPage.hbs");
});

app.get('/register', (req, res) => {
    res.render("registerPage.hbs");
});

app.post('/registerUser', (req, res) => {
    var user = req.body;
    var newUser = new Users(user);
    newUser.save().then((savedUser) => {
        res.render("loginPage.html");
    });
});

app.use(express.static(angularPath));

app.post('/loginUser', auth, (req, res) => {
    var status = res.locals.status;
    if (status == 'success') {
        res.render(angularPath + "/index.hbs", { user: req.body.userName });
    } else {
        res.render("loginPage.hbs", { status: 'failure' });
    }
});

app.get('/getUsers', (req, res) => {
    Users.find().then((users) => {
        var userlist = [];
        users.map((user) => {
            userlist.push(user.userName);
        });
        res.send({ users: userlist });
    });
});

app.put('/updateProfilePic', (req, res) => {
    var userId = req.header('X-auth');;
    var form = new formidable.IncomingForm();
    form.parse(req, (err, fields, files) => {
        if (err) {
            console.log('File not Found');
        } else {
            var oldpath = files.user_pic.path;
            var newpath = __dirname + '\\src\\assets\\' + files.user_pic.name;
            mv(oldpath, newpath, (err) => {
                if (err) {
                    console.log(err);
                    console.log('Error,File Not Moved');
                } else {
                    Users.findByIdAndUpdate(userId, { profilePic: files.user_pic.name }, (err, result) => {
                        if (err) {
                            res.send({ status: 'Error' });
                        }
                        var imageUrl = fs.readFileSync(newpath, 'base64');
                        res.send({ url: imageUrl });
                    });
                }
            });
        }
    });
});

app.delete('/deleteUser', (req, res) => {
    var userId = req.header('X-id');
    Users.findByIdAndRemove(userId, (err, result) => {
        if (err) {
            res.send({ status: 'Fail' });
        }
        if (result) {
            res.send({ status: 'Success' });
        } else {
            res.send({ status: 'Error' });
        }
    });
});

app.post('/sendMessage', (req, res) => {
    var message = new Messages(req.body);
    message.save().then((savedMessage) => {
        res.send({ status: "success" });
    });
});

app.get('/getMessages', (req, res) => {
    var from = req.query.from,
        to = req.query.to;
    Messages.find({ from, to }).then((messages) => {
        res.send(messages);
    });
});

server.listen(port, () => {
    console.log('Connected to Server');
});