var express = require('express'),
    app = express(),
    http = require('http').Server(app),
    path = require('path'),
    fs = require('fs'),
    db = require('./server/db'),
    mongoose = require('mongoose'),
    bodyParser = require('body-parser');

app.get('/', function(req, res) {
    res.sendFile(path.join(__dirname + '/index.html'));
});

app.use(express.static(__dirname + '/store'));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));

// Post and get routes

var server = app.listen(process.env.PORT || 3000, function() {
    console.log("Great! Widgets are ready.");
});

app.route('/add_task')
    .post(function(req, res) {
        addTask(req.body, function(err, reponse) {
            if (err) return res.status(400).send(err);
            res.send({
                success: 'done'
            });
        });
    });

app.route('/get_tasks')
    .get(function(req, res) {
        console.log(req.body);
        getTask(req.body, function(err, response) {
            if (err) return res.status(400).send(err);
            res.send(response);
        });
    });

app.route('/remove_task')
    .post(function(req, res) {
        console.log(req.body);
        removeTask(req.body, function(err, response) {
            if (err) return res.status(400).send(err);
            res.send(response);
        });
    });

function removeTask(query, callback) {
    let Task = mongoose.model('Task');

    Task.remove({
        _id: query.id
    }, function(err) {
        if (err) {
            return callback(err);
        }
        callback(null, 'removed');
    });
}

function getTask(query, callback) {
    console.log(query);
    let Task = mongoose.model('Task');

    Task.find()
        .exec(function(err, tasks) {
            if (err) {
                return callback(err);
            }
            callback(null, tasks);
        })

}

function addTask(task, callback) {
    console.log(task);
    let Task = mongoose.model('Task');

    let taskIns = new Task(task);

    taskIns.save(function(err) {
        if (err) {
            return callback(err);
        }

        callback(null, 'done');
    })

}
