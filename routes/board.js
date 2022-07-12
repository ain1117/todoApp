const router = require('express').Router(); //express 라이브러리의 Router라는 함수를 사용하겠습니다.



router.get('/sports', function(req,res){
    //개별 router에 로그인 검사 미들웨어를 적용한다.
    res.send('스포츠 게시판.')
  })
  
router.get('/game',function(req,res){
    res.send('게임 게시판.')
  })

  module.exports = router 
  //module.exports = 내보낼 변수명
  //다른 곳에서 shop.js를 사용할 때 내보낼 변수명이다. 
