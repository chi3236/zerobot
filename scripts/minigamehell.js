// Description:
//   ZeroBot Introduce.
//
function imbue(someString, level) {
  while (level>=0) {
    if (someString["_"+level] != null)
      return someString["_"+level];

    level--;
  }
}

module.exports = function(robot) {
  var stringTable = {};
  stringTable.stringEventScreen01 = {};
  stringTable.stringEventScreen01["_3"] = "This is a string for above 3 level";
  stringTable.stringEventScreen01["_7"] = "This is a string for above 7 level";

  stringTable.stringEventScreen02 = {};
  stringTable.stringEventScreen02["_2"] = "Hello?";
  //above 3 strings are examples
  robot.brain["gugu"] = {problem:0, answer:0};

  robot.respond(
    /help/i,
      function(res){
        res.send("답을 제외한 명령어는 호출하면서 입력해야 합니다")
        res.send("회원가입: 게임을 시작");
        res.send("나의정보: 나의 현재 상태 보기");
        res.send("신분상승: 신분 상승에 도전한다");
        res.send("구구단시작: 구구단 게임을 시작한다");  
      }
    )

  robot.respond(
    /회원가입/i, 
    function(res){
      if(robot.brain[""+res.envelope.user.id] == null) 
      {
        res.send("안녕 "+res.envelope.user.name+". 지금부터 게임을 시작한다")
        robot.brain[""+res.envelope.user.id] = {id:res.envelope.user.id, money:50, goza:1};
      }
      else
      {
        res.send("넌 이미 가입되어 있다.");
      }
    }
  );

  robot.respond(
    /나의정보/i, 
    function(res){
      if(robot.brain[""+res.envelope.user.id] == null) {
        res.send("넌 가입을 하지 않았다.")
      } else {
        var next_upgrade_money = (100*(robot.brain[""+res.envelope.user.id].goza * robot.brain[""+res.envelope.user.id].goza)) - (50 * robot.brain[""+res.envelope.user.id].goza)
        res.send(res.envelope.user.name+"은(는) $"+robot.brain[""+res.envelope.user.id].money+" 만큼 돈이 있고 신분은 "+robot.brain[""+res.envelope.user.id].goza+" 단계이다.");
        res.send("다음 강화하는데 드는 비용: $ "+next_upgrade_money);
        res.send("다음 강화 성공 확률: "+Math.floor(Math.pow(0.9, robot.brain[""+res.envelope.user.id].goza-1)*100)+"%");
      }
    }
  );

  robot.respond(
    /신분상승/i, 
    function(res){
      var upgrade_money = (100*(robot.brain[""+res.envelope.user.id].goza * robot.brain[""+res.envelope.user.id].goza)) - (50 * robot.brain[""+res.envelope.user.id].goza)

      if(robot.brain[""+res.envelope.user.id].money >= upgrade_money)
      {
        robot.brain[""+res.envelope.user.id].money -= upgrade_money;

        if(Math.random() <= Math.pow(0.9, robot.brain[""+res.envelope.user.id].goza-1)) {
          robot.brain[""+res.envelope.user.id].goza = robot.brain[""+res.envelope.user.id].goza + 1;
          res.send(res.envelope.user.name+" 신분상승 성공! "+robot.brain[""+res.envelope.user.id].goza+" 단계가 되었다");
        } else {
          robot.brain[""+res.envelope.user.id].goza=1;
          res.send(res.envelope.user.name+" 신분상승 실패! 신분 초기화됨 병1신");
        }
      } else {
        res.send("신분상승을 하려면 $"+upgrade_money+" 만큼의 돈이 필요하다");
      }
    }
  );

  robot.respond(
    /게임준비( 마피아)?/i,
    function(res) {
      res.send(res.match[0]+" "+res.match[1]);
    }
  );


  robot.respond(
    /구구단시작/i,
      function(res)
      {
        if(robot.brain[""+res.envelope.user.id] == null) 
        {
          res.send("넌 가입을 하지 않았다.")
        }
        else{
          if(robot.brain["gugu"].problem == 0)
          {
          var num1 = Math.floor(Math.random() *100);
          var num2 = Math.floor(Math.random() *100);
     
          robot.brain["gugu"].answer = num1*num2;

          res.send(num1 +" * "+num2+" = ? ");
          robot.brain["gugu"].problem = 1
          }
        }
      }
  );
  robot.hear(
    /^[0-9]+$/i,
    function(res)
    {
      if(robot.brain["gugu"].problem == 1)
      {
        var user_answer = res.match[0]-0;
        if(user_answer == robot.brain["gugu"].answer)
        {
          robot.brain[""+res.envelope.user.id].money += 100;
          if(robot.brain[""+res.envelope.user.id] != null){
            res.send(res.envelope.user.name+" 정답"); 
          }
        }
        else
        {
          robot.brain[""+res.envelope.user.id].money -= 50 ;
          if(robot.brain[""+res.envelope.user.id] != null){
            res.send(res.envelope.user.name+" 오답");
          }
        }
        robot.brain["gugu"].problem = 0
      }
    }
  );      
}
  

