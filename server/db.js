'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema,
  _   = require('lodash'),
  db = {};

// User model
var TaskSchema = new Schema({
  title: String,
  description: String,
  duedate: Date,
  assignee: String
});

mongoose.model('Task', TaskSchema);
mongoose.connect('localhost', 'tasks', function(err) {
  if (err) {
    console.log('Could not connect to database: ' + err);
    process.exit(1);
  }
});
