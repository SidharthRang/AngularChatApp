var express = require('express');
var bodyParser = require('body-parser');
var formidable = require('formidable');
var fs = require('fs');
var mv = require('mv');
var { Users } = require('./models/Users');

var port = process.env.PORT || 4200;
var mongodb_url = 'mongodb://mongodb-1.documents.azure.com:10255/mean?ssl=true';

var mongoose = require('mongoose');
mongoose.Promise = global.Promise;

var app = express();

app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies

mongoose.connect(mongodb_url, {
    auth: {
        user: 'mongodb-1',
        password: '3Jgqe0F0EkwijiEFiosUyTLG5BCon2W7QCNDqpSwzJzIXfHAczvz2ieqBc6iIBqLHuYUATEz889mw1CdCX7ugw=='
    },
    useNewUrlParser: true
}).then(() => console.log('connection successful'))
    .catch((err) => console.error(err));

app.use(express.static(__dirname + '/dist/'));

app.post('/registerUser', (req, res) => {
    var user = req.body;
    var newUser = new Users(user);
    console.log(mongodb_url);
    newUser.save().then((savedUser) => {
        res.send(savedUser);
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