// Description:
//   ZeroBot Introduce.
//
var stateMafia = false;
var stateHardCore = false;
var stateReadyProcess = false;

var Players = [];

var stringTable = {};

stringTable.notRegisteredAccountError = {};
stringTable.notRegisteredAccountError["_0"] = "당신은 가입하지 않았습니다. 가입하려면 [회원가입]를 입력하십시오.";

stringTable.stringMafiaAlreadyPlaying = {};
stringTable.stringMafiaAlreadyPlaying["_0"] = "ㅡㅡ 기다려라 겜 아직 안끝났다...";
stringTable.stringMafiaAlreadyPlaying["_4"] = "게임이 이미 진행중입니다. 진행중이 게임이 종료될 때까지 기다려 주세요.";

stringTable.stringMafiaRegistrationDuplicatedAttempt = {};
stringTable.stringMafiaRegistrationDuplicatedAttempt["_0"] = "아 좀 닥쳐라 ㅡㅡ";
stringTable.stringMafiaRegistrationDuplicatedAttempt["_4"] = "중복된 요청입니다.";

stringTable.stringMafiaPlayerRegistration = {};
stringTable.stringMafiaPlayerRegistration["_0"] = "니가 뭔데 마피아를 시작하냐? 누가 [게임준비 마피아]를 입력하겠어?";
stringTable.stringMafiaPlayerRegistration["_4"] = "마피아 게임을 준비합니다. 게임에 참여할 분들은 [게임준비 마피아]를 입력해 주세요.";

stringTable.stringMafiaPlayerRegistrationHardcore = {};
stringTable.stringMafiaPlayerRegistrationHardcore["_0"] = "ㅁ친 이샛기가 하드코어를 한답니다 ㅋㅋㅋㅋㅋㅋㅋ";
stringTable.stringMafiaPlayerRegistrationHardcore["_4"] = "마피아 게임(하드코어 모드)을 준비합니다. 게임에 참여할 분들은 [게임준비 마피아]를 입력해 주세요.";

stringTable.stringMafiaPlayerJoin = {};
stringTable.stringMafiaPlayerJoin["_0"] = "가 마피아에 참여한다.";
stringTable.stringMafiaPlayerJoin["_4"] = "님께서 마피아 게임에 참여하셨습니다.";

function imbue(someString, level) {
  while (level>=0) {
    if (someString["_"+level] != null)
      return someString["_"+level];

    level--;
  }
  return "UNDEFINED";
}

function mafiaPush(res) {
  Players.push(res.envelope.user);
}

function mafiaRegister(res) {
  mafiaPush(res);
  res.send(res.envelope.user.name+imbue(stringTable.stringMafiaPlayerJoin, level));
}

function isRegisteringDuplicated(res) {
  for (var each in Players) {
    if (Players[each].id == res.envelope.user.id) return true;
  }
  return false;
}

function violationPenalty(user) {

}

function terminateMafia() {

}

module.exports = function(robot) {

  robot.hear(
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

  robot.hear(
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

  robot.hear(
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

  robot.hear(
    /게임준비 마피아( 하드코어)?/i,
    function(res) {
      //가입하지 않은 사용자가 시도한 경우
      if(robot.brain[""+res.envelope.user.id] == null) {
        res.send(imbue(stringTable.notRegisteredAccountError, 0));
        return;
      }

      level = robot.brain[""+res.envelope.user.id].goza;

      //이미 진행 중인 경우
      if (stateMafia == true) {
        res.send(imbue(stringTable.stringMafiaAlreadyPlaying, level));
        return;
      }

      //모집 중 참여인 경우
      if (stateReadyProcess == true) {
        if (res.match[1] == " 하드코어") {
          if (stateHardCore == false)
            return;
        } else if (stateHardCore == true) return;

        if (isRegisteringDuplicated(res)) { //중복참여 배제
          res.send(imbue(stringTable.stringMafiaRegistrationDuplicatedAttempt, level));
          return;
        }
        mafiaRegister(res);
        return;
      };

      //최초 모집 시전 하는 경우
      stateReadyProcess = true;
      if (res.match[1] == " 하드코어") stateHardCore = true;

      mafiaPush(res);
      if (stateHardCore == true) {
        res.send(imbue(stringTable.stringMafiaPlayerRegistrationHardcore, level));
      } else {
        res.send(imbue(stringTable.stringMafiaPlayerRegistration, level));
      }
    }
  );

  robot.hear(
    /supervise( stateMafia[\+\-])?( stateHardCore[\+\-])?( stateReadyProcess[\+\-])?/,
    function(res) {
      var arg = res.match[0];
      
      if (arg.match(/stateMafia\+/)) {
        stateMafia = true;
        res.send("Set flag stateMafia : true");
      } else if (arg.match(/stateMafia\-/)) {
        stateMafia = false;
        res.send("Set flag stateMafia : false");
      }
      
      if (arg.match(/stateHardCore\+/)) {
        stateHardCore = true;
        res.send("Set flag stateHardCore : true");
      } else if (arg.match(/stateHardCore\-/)) {
        stateHardCore = false;
        res.send("Set flag stateHardCore : false");
      }

      if (arg.match(/stateReadyProcess\+/)) {
        stateReadyProcess = true;
        res.send("Set flag stateReadyProcess : true");
      } else if (arg.match(/stateReadyProcess\-/)) {
        stateReadyProcess = false;
        res.send("Set flag stateReadyProcess : false");
      }
    }
  );


  robot.hear(
    /게임시작( 구구단)?/i,
      function(res)
      {
        if(robot.brain[""+res.envelope.user.id] == null) 
        {
          res.send("넌 가입을 하지 않았다.")
        }
        else{
          robot.brain["gugu"] = {problem:0, answer:0};

          var num1 = Math.floor(Math.random() *100);
          var num2 = Math.floor(Math.random() *100);
     
          robot.brain["gugu"].answer = num1*num2;

          res.send(num1 +" * "+num2+" = ? ");
          robot.brain["gugu"].problem = 1
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
          res.send("정답"); 
        }
        else
        {
          robot.brain[""+res.envelope.user.id].money -= 50 ;
          res.send("오답");
        }
        robot.brain["gugu"].problem = 0
      }
    }
  );      
}
  

