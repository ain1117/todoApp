const express = require('express') //라이브러리 첨부 
const { Db } = require('mongodb')
const app = express() //라이브러리로 객체 생성
const MongoClient = require('mongodb').MongoClient
const methodOverride = require('method-override')
app.use(methodOverride('_method'))
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

app.get('/detail/:id', function(req, res){
    
    db.collection('post').findOne({ _id : parseInt(req.params.id) }, function(err, result){
    
        res.render('detail.ejs', {data : result} )
    })
  });


app.get('/list', function(req,res){

    db.collection('post').find().toArray(function(err,result){
        //콜백함수의 파라미터에는 에러와 결과가 들어간다.
        console.log(result)
        res.render('list.ejs',{posts:result}) //list.ejs를 불러오고
        //서버에서 받아온 데이터를
        //list.ejs에 posts라는 이름으로 전달한다. (반드시 이 콜백함수 안에서 작성해야 한다.)

    });  //파일명이 post인 db 찾아 정보를 가져온다.
 

})


app.get('/edit/:id', function(req, res){
    db.collection('post').findOne({_id:parseInt(req.params.id)},function(err,result){
        // 데이터를 찾아 post라는 이름으로 전송한다.
        res.render('edit.ejs',{post:result})
    })
  
})

//서버로 put 요청이 오면, 담긴 데이터를 수정한다.

app.put('/edit', function(req,res){
    //폼에 담긴 제목 데이터, 날짜 데이터를 가지고
    // db.collection'post'에서 찾아 업데이트한다.
    // updateONe(어떤게시물을 수정할것인지,수정값,콜백함수)

    //operator $set = 업데이트 해 주시되, 없으면 추가해주세요 

    db.collection('post').updateOne({ _id:parseInt(req.body.id) },
    { $set: { title:req.body.title, date:req.body.date }},function(err,result){
      res.redirect('/list') //수정완료 시 다른 페이지로 이동한다.(응답코드)
    })
})

// passport 라이브러리를 첨부한다. node.js 환경에서 로그인 기능 구현을 쉽게 할 수 있도록 도와준다.

const passport = require('passport');
const LocalStrategy = require('passport-local')
const session = require('express-session')

//미들웨어 사용 준비를 한다.
//미들웨어 : 웹서버가 요청하면 요청과 응답 중간에 실행하는 코드들을 말한다.
app.use(session({secret:'비밀코드', resave:true, saveUninitialized: false}))
app.use(passport.initialize())
app.use(passport.session())

app.get('/login', function(req,res){
    res.render('login.ejs')
})
//passport.authenticate()를 통해 아이디와 비밀번호를 검사한다.
app.post('/login', passport.authenticate('local', //local 방식으로 인증한다.
{
    failureRedirect: '/fail' //회원인증에 실패하면 /fail로 이동한다.
}), function(req,res){
    res.redirect('/') //만일 로그인에 성공하면, 메인 페이지로 보낸다.
})

// failureRefirect가 호출되면 실행된다. 

passport.use(new LocalStrategy({ //Strategy방식 인증을 구현한다.
    usernameField: 'id',
    passwordField: 'pw',
    session: true,
    passReqToCallback: false,
  }, function (입력한아이디, 입력한비번, done) {
    console.log(입력한아이디, 입력한비번);
    //DB에 입력한 아이디가 있는지 찾는다.
    db.collection('login').findOne({ id: 입력한아이디 }, function (에러, 결과) {
        //에러처리
      if (에러) return done(에러)
        //일치하는 아이디가 없을 시 실행        
    //done(서버에러,성공시 사용자 db data, 에러메세지 넣는곳)
      if (!결과) return done(null, false, { message: '존재하지않는 아이디요' })
    //   아이디가 있다면 비밀번호를 검증한다. 
      if (입력한비번 == 결과.pw) {
        return done(null, 결과)
      } else {
        return done(null, false, { message: '비번틀렸어요' })
      }
    })
  }));

  //id를 이용해 세셩을 저장시킨다.(로그인 성공시 실행된다.)
  //그리고 아이디와 비밀번호로 생성한 세션을 쿠키로 보낸다.
  passport.serializeUser(function(user, done){
    done(null, user.id) 
  })

  //이 세션 아이디를 가진 사람을 db에서 찾아달라는 구문(MyPage를 만들때 사용한다.)
  passport.deserializeUser(function(아이디,done){
    db.collection('login').findOne({id:아이디},function(err,result){
      //하..여기서 변수인 result를 { result } 로 잘못 전해줘서
      // 계속 안됐었음 ㅠㅠ 변수는 오브젝트 형식으로 전해주지 않기를 잊지 말자..   
      done(null,result)
    })
  
  })

  // 파라미터로 전해진 함수는 순차적으로 실행된다.
  //즉, isLogin을 실행한 뒤 콜백 함수를 실행한다.
  app.get('/myPage', isLogin, function(req,res){
    console.log(req.user) //deserializeUser에서 찾은 정보가 들어있다. 
    console.log(req.user.id)
    res.render('myPage.ejs',{ myUser : req.user })
  })

  //미들웨어를 만든다.
  
  //1.로그인 여부를 확인한다.
  function isLogin(req,res,next){
    if(req.user){ //로그인 후 세션이 있으면, req.user가 존재한다.
        next()
    } else{
        res.send('로그인하지 않았습니다.')
    }
  }
  
  app.post('/register', function(req,res){
    //id 중복검사
        db.collection('login').findOne({id:req.body.id}, function(err,result){
      
      console.log(result) //db에서 검색한 결과 출력
      // !result가 안되는 이유 : result가 null일 경우 역연산을 할 수 없다.(비어있기 때문)
      if(result==null) { 
        console.log('가입 가능한 아이디입니다.')
        db.collection('login').insertOne({ id: req.body.id, pw: req.body.pw }, function (에러, 결과) {
        console.log(result) //가입 결과 출력
        res.send('회원가입에 성공하였습니다.')
        })
       }  else if (result) return console.log('이미 존재하는 아이디입니다.')
    })
  })

  
app.post('/add', function(req,res){ //누군가가 add로 POST요청을 하면
  res.send('전송완료') //페이지에 전송완료 응답을 한다.
  console.log(req.body)
      

  //counter라는 이름을 가진 콜렉션에서 내가 원하는 데이터 1개만 가져온다. 
  // = 게시물갯수를 가져온다. 
  db.collection('counter').findOne({name:'게시물갯수'}, function(err,result){
      console.log(result.totalPost)
      if (err) return console.log('게시물갯수 가져오는 중 에러 발생')
      //가져온 총게시물갯수를 변수에 저장한다.
      let total = result.totalPost

      //글을 저장할 때 저장할 것들 
      let savePost = { _id : total +1, title: req.body.title, date: req.body.date, writer: req.user._id }

      
  //_id= 총게시물갯수 + 1 (auto increment)

      db.collection('post').insertOne(savePost,function(에러,결과){
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

app.delete('/delete', function(req,res){
  console.log(req.body) //요청 시 보낸 데이터가 출력된다.
  // 요청.body에 담긴 정보에서 내가 삭제할 데이터를 찾아 삭제해 주세요
  req.body._id = parseInt(req.body._id)
  console.log(req.body._id)
  console.log(req.user._id)

  let deleteData = { _id: req.body._id, writer: req.user._id }

  // 실수했던곳 : deleteOne의 첫번째 파라미터는 req.body 이다. 
  // (나는 req.bkdy._id 라고 해서 실행되지 않았었음) 

  //이후, 로그인한 사람것만 삭제할 수 있도록 수정했음
  //req.body에 담겨온 게시물번호를 가진 글을 db에서 찾아 삭제해 주세요.
  db.collection('post').deleteOne(deleteData,function(err, result){
      console.log('삭제완료')
      res.status(200).send({ message:'삭제에 성공했습니다.'}); //응답에 성공했을 때 띄우는 메세지
  })
  
})
//app.use=미들웨어
app.use('/shop', require('./routes/shop')) 
app.use('/board/sub/', require('./routes/board'))

