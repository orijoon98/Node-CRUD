# Node CRUD 연습

## 목표

- 백엔드에서 프론트와 함께 CRUD 기능 연습을 위해 HTTP GET, POST로 MongoDB에 있는 데이터 CRUD 해서 결과 전달해보기

## 서버 실행

```jsx
var express = require("express");

var app = express();
var port = 3000;
app.listen(port, function () {
  console.log("server on! http://localhost:" + port);
});
```

임의로 3000번 포트로 서버를 실행했다.

## DB 연결 및 스키마, 모델 생성

```jsx
var mongoose = require("mongoose");

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
```

로컬에 설치한 mongoDB와 연결하고 만들려고 하는 json 형태가

{"id" : Number, "text" : String, "checked" : Boolean} 이기 때문에 형태에 맞게 스키마를 생성하고 사용할 수 있게 모델링을 해줬다.

## CREATE

```jsx
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
```

/list URI로 POST 요청을 받을 때 처리하는 부분이다.

프론트에서 리스트를 생성을 할 때 저장하고자 하는 String을 보내면 id값과 checked값은 서버에서 지정한 후 mongoDB에 저장한다.

결과값으로는 Saved라는 텍스트만 보낸다.

### 결과

![스크린샷 2021-10-20 오후 2 55 22](https://user-images.githubusercontent.com/74812188/138037889-a946d6d6-2474-48e6-b4e3-0863f101104c.png)


텍스트로 example list를 보냈다.

![스크린샷 2021-10-20 오후 2 56 04](https://user-images.githubusercontent.com/74812188/138037911-8460818b-51d3-4bf6-8bc2-e27e93986eb0.png)

mongoDB에 잘 저장된 걸 확인했다.

## READ

```jsx
app.get("/list", function (req, res) {
  Todo.find(function (error, todos) {
    if (error) {
      console.log(error);
    }
    res.send(todos);
  });
});
```

/list URI로 GET 요청을 받을 때 처리하는 부분이다.

결과값으로 mongoDB에 저장된 리스트를 보내준다.

### 결과

![스크린샷 2021-10-20 오후 2 58 53](https://user-images.githubusercontent.com/74812188/138037924-38803e10-2140-4783-9e86-e161164a90ca.png)

## UPDATE

```jsx
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
```

/list URI로 PUT 요청을 받을 때 처리하는 부분이다.

프론트에서 수정하고 싶은 리스트의 id값과 수정할 내용을 함께 보내주면 id값으로 mongoDB에서 리스트를 찾아서 해당 내용으로 text를 수정한 후 저장한다.

### 결과

![스크린샷 2021-10-20 오후 2 59 35](https://user-images.githubusercontent.com/74812188/138037939-6386ade5-f885-421d-b30e-75c0b3ed20e5.png)

id가 1인 텍스트를 updated list로 바꿔달라는 요청이다.

![스크린샷 2021-10-20 오후 3 00 12](https://user-images.githubusercontent.com/74812188/138037959-4273249f-d8e6-4236-b27b-39a40c31c3f5.png)

GET 요청으로 다시 결과를 확인해보면 정상적으로 수정이 된 걸 확인할 수 있다.

## DELETE

```jsx
app.delete("/list", function (req, res) {
  var i = req.body["id"];
  Todo.deleteOne({ id: i }, function (error) {
    if (error) {
      console.log(error);
    }
  });
  res.send("Deleted");
});
```

/list URI 로 DELETE 요청을 받을 때 처리하는 부분이다.

프론트에서 삭제할 리스트의 id값을 전달해주면 해당 id값으로 저장된 리스트를 mongoDB에서 삭제해준다.

### 결과

![스크린샷 2021-10-20 오후 3 03 40](https://user-images.githubusercontent.com/74812188/138037970-7de32fe5-1b0c-4683-910c-b4746f17f2bb.png)

![스크린샷 2021-10-20 오후 3 03 57](https://user-images.githubusercontent.com/74812188/138037977-749e39ba-49ac-4c28-a6be-caa458db3fbc.png)

삭제 요청을 보내고 다시 GET 요청을 보내보면 id가 1이었던 리스트가 정상적으로 삭제 된 걸 확인 할 수 있다.

## 전체 코드

```jsx
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
```

/clist URI로 POST 요청을 받으면 전달 받은 id 값의 리스트의 checked를 true로 저장해주는 부분도 있지만 자세한 설명은 생략한다.
