const express = require('express') //라이브러리 첨부 
const { Db } = require('mongodb')
const app = express() //라이브러리로 객체 생성
const MongoClient = require('mongodb').MongoClient
app.set('view engine', 'ejs')


let db

MongoClient.connect(
    'mongodb+srv://loveacraea:vermouth@cluster0.ikr8otk.mongodb.net/?retryWrites=true&w=majority'
,function(에러,client){

    if(에러) return console.log(에러)
    db = client.db('todoapp') //todoapp이라는 db에 연결한다. 이 문장을 쓰지 않으면 연결이 안 된다..

    // db.collection('post').insertOne({이름:'Joh', 나이:26}, function(에러,결과){ //콜렉션 post에 insertOne{자료}한다.
   //     console.log('저장완료'); 
    }) 

    // tod oapp이라는 database에 연결한다.
    
app.listen(8080, function() { // listen(서버 띄울 포트번호, 띄운 후 실행할 코드)

    console.log('8080서버를 오픈합니다.')

}) ;

app.use(express.urlencoded({extended: true})) 


app.get('/pet', function(요청, 응답){
    응답.send('펫쇼핑할 수 있는 페이지입니다.')
}) //pet이라는 경로로 방문 시 띄우는 안내문

app.get('/beauty', function(req,res) {
    res.send('뷰티용품 사세요')
})

app.get('/', function(req, res){
    res.sendFile(__dirname + '/index.html')
})

app.get('/write', function(req, res){
    res.sendFile(__dirname + '/write.html')
})

app.post('/add', function(req,res){ //누군가가 add로 POST요청을 하면
    res.send('전송완료') //페이지에 전송완료 응답을 한다.
    console.log(req.body)

    //counter라는 이름을 가진 콜렉션에서 내가 원하는 데이터 1개만 가져온다. 
    // = 게시물갯수를 가져온다. 
    db.collection('counter').findOne({name:'게시물갯수'}, function(err,result){
        console.log(result.totalPost)
        if (err) return console.log('게시물갯수 가져오는 중 에러 발생')
        //가져온 게시물갯수를 변수에 저장한다.
        let total = result.totalPost

        
    //_id= 총게시물갯수 + 1 (auto increment)

    db.collection('post').insertOne({_id: total + 1, title: req.body.title, date:req.body.date},function(에러,결과){
        if(에러) console.log(에러)
        console.log(result.totalPost)
        //몽고DB에서 데이터를 수정할 때 updateOne()을 사용한다. 많은 것은 updateMany이다.
        //updateOne(이런데이터를,이렇게수정해줘,function(){})

        //operator : 연산자.
    // {$set : {totalPost:바꿀값}}
    // {$inc : {totalPost:기존값에 더해줄 값}} 같은 것들이 있다.
//name이 게시물갯수인것을 찾아, 그곳의 totalPost를 수정한다.
        db.collection('counter').updateOne({name:'게시물갯수'},{ $inc : {totalPost:1}},function(err,result){
            if(err) return console.log('totalPost 증가 중 에러 발생')

        })
        

    })

    }) 


})

app.get('/list', function(req,res){

    db.collection('post').find().toArray(function(err,result){
        //콜백함수의 파라미터에는 에러와 결과가 들어간다.
        console.log(result)
        res.render('list.ejs',{posts:result}) //list.ejs를 불러오고
        //서버에서 받아온 데이터를
        //list.ejs에 posts라는 이름으로 전달한다. (반드시 이 콜백함수 안에서 작성해야 한다.)

    });  //파일명이 post인 db 찾아 정보를 가져온다.
 

})

app.delete('/delete', function(req,res){
    
})

// 어떤 사람이 /add로 post 요청을 하면, 
// 데이터 2개를 보내주는데,
// 이때 이것은 날짜와 제목이다,
// 이 때 post라는 이름을 가진 collection에 데이터 두개를 저장한다.
//오브젝트 형식으로 저장하기~