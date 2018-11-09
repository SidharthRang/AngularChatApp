var bcrypt = require('bcrypt');
var { Users } = require('../models/Users');

var auth = (req, res, next) => {
    Users.findOne({ userName: req.body.userName }).then((user) => {
        console.log(user);
        if (!user) {
            res.locals.status = 'failure';
            next();
        } else {
            bcrypt.compare(req.body.password, user.password, (err, result) => {
                if (result) {
                    if (user['profilePic']) {
                        var path = __dirname + '\\src\\assets\\' + user['profilePic'];
                        var imageUrl = fs.readFileSync(path, 'base64');
                        user['profilePic'] = imageUrl;
                    }
                    res.locals.status = 'success';
                    next();
                } else {
                    res.locals.status = 'failure';
                    next();
                }
            });
        }
    });
}
module.exports = { auth };