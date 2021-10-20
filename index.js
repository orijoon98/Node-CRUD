var express = require("express");
var mongoose = require("mongoose");
var bodyParser = require("body-parser");
var app = express();
app.use(bodyParser.json());

mongoose.connect("mongodb://localhost:27017/testdb");
var db = mongoose.connection;
db.on("error", function () {
  console.log("Connection Failed!");
});
db.once("open", function () {
  console.log("Connected");
});

var todo = mongoose.Schema({
  id: Number,
  text: String,
  checked: Boolean,
});

var Todo = mongoose.model("todo", todo);

var id = 1;

app.post("/list", function (req, res) {
  var i = id++;
  var t = req.body["text"];
  var b = false;
  var newTodo = new Todo({ id: i, text: t, checked: b });

  newTodo.save(function (error) {
    if (error) {
      console.log(error);
    }
  });
  res.send("Saved");
});

app.get("/list", function (req, res) {
  Todo.find(function (error, todos) {
    if (error) {
      console.log(error);
    }
    res.send(todos);
  });
});

app.put("/list", function (req, res) {
  var i = req.body["id"];
  var t = req.body["text"];
  Todo.findOne({ id: i }, function (error, todo) {
    if (error) {
      console.log(error);
    } else {
      todo.text = t;
      todo.save(function (error) {
        if (error) {
          console.log(error);
        }
      });
    }
  });
  res.send("updated");
});

app.delete("/list", function (req, res) {
  var i = req.body["id"];
  Todo.deleteOne({ id: i }, function (error) {
    if (error) {
      console.log(error);
    }
  });
  res.send("Deleted");
});

app.post("/clist", function (req, res) {
  var i = req.body["id"];
  var b = true;
  Todo.findOne({ id: i }, function (error, todo) {
    if (error) {
      console.log(error);
    } else {
      todo.checked = b;
      todo.save(function (error) {
        if (error) {
          console.log(error);
        }
      });
    }
  });
  res.send("checked");
});

var port = 3000;
app.listen(port, function () {
  console.log("server on! http://localhost:" + port);
});
