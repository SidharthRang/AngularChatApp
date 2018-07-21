var express = require('express');
var bodyParser = require('body-parser');
var formidable = require('formidable');
var fs = require('fs');
var mv = require('mv');
var { Users } = require('./models/Users');

var port = process.env.PORT || 4200;
var mongodb_url = process.env.CUSTOMCONNSTR_MONGODB_URI || 'mongodb://localhost:27017/MongoApps';

var mongoose = require('mongoose');
mongoose.Promise = global.Promise;

var app = express();

app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies

mongoose.connect(mongodb_url);

app.use(express.static(__dirname + '/dist/'));

app.post('/registerUser', (req, res) => {
    var user = req.body;
    var newUser = new Users(user);
    newUser.save().then((savedUser) => {
        res.send(user);
    });
});

app.post('/login', (req, res) => {
    Users.findOne({ userName: req.body.userName }).then((user) => {
        if (!user) {
            res.send({ status: 'failure', result: {} });
        } else {
            if (user['profilePic']) {
                var path = __dirname + '\\src\\assets\\' + user['profilePic'];
                var imageUrl = fs.readFileSync(path, 'base64');
                user['profilePic'] = imageUrl;
            }
            res.send({ status: 'success', result: user });
        }
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

app.listen(port, () => {
    console.log('Listening');
});