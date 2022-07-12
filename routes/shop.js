const router = require('express').Router(); //express 라이브러리의 Router라는 함수를 사용하겠습니다.

function isLogin(req,res,next){
  if(req.user){ //로그인 후 세션이 있으면, req.user가 존재한다.
      next()
  } else{
      res.send('로그인하지 않았습니다.')
  }
}

router.use(isLogin); //여기 있는 모든 URL들에 미들웨어를 적용한다.
//또는, 파라미터로 use('/shirts', isLogin) 형식으로 이 url에만 적용할 수도 있다.

router.get('/shirts', isLogin, function(req,res){
    res.send('셔츠 파는 페이지입니다.')
  })
  
router.get('/pants',function(req,res){
    res.send('바지 파는 페이지입니다.')
  })

  module.exports = router 
  //module.exports = 내보낼 변수명
  //다른 곳에서 shop.js를 사용할 때 내보낼 변수명이다. 
