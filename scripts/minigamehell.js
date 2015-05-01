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


  robot.hear(
    /게임시작/i, 
    function(res){
      if(robot.brain[""+res.envelope.user.id] == null) 
      {
      	res.send("안녕 "+res.envelope.user.name+". 지금부터 게임을 시작한다")
      	robot.brain[""+res.envelope.user.id] = {id:res.envelope.user.id, money:99999999, goza:1};
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
    	if(robot.brain[""+res.envelope.user.id] == null){
    		res.send("넌 가입을 하지 않았다.")
    	}
    	else{
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

    		if(robot.brain[""+res.envelope.user.id].money > upgrade_money){
    			robot.brain[""+res.envelope.user.id].money = robot.brain[""+res.envelope.user.id].money - upgrade_money

    			if(Math.random() <= Math.pow(0.9, robot.brain[""+res.envelope.user.id].goza-1)){
    				robot.brain[""+res.envelope.user.id].goza = robot.brain[""+res.envelope.user.id].goza + 1;
    				res.send(res.envelope.user.name+" 신분상승 성공! "+robot.brain[""+res.envelope.user.id].goza+" 단계가 되었다");
    			}
    			else {
    				robot.brain[""+res.envelope.user.id].goza=1;
    				res.send(res.envelope.user.name+" 신분상승 실패! 신분 초기화됨 병1신");
    			}
    		}
    		else{
    			res.send("신분상승을 하려면 $"+upgrade_money+" 만큼의 돈이 필요하다");
    		}
    }
  );
}
  

