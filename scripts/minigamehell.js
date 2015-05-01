// Description:
//   ZeroBot Introduce.
//

module.exports = function(robot){
  robot.hear(/게임시작/i, function(res){
    if(robot.brain[""+res.envelope.user.id] == null){
    	res.send("안녕 "+res.envelope.user.name+". 지금부터 게임을 시작한다");
    	robot.brain[""+res.envelope.user.id] = {id:res.envelope.user.id, money:0};
	}
	else{
		res.send("넌 이미 가입되어 있다.");
	}
  });

  robot.hear(/나의정보/i, function(res){
  	res.send(res.envelope.user.name+"은 $"+robot.brain[""+res.envelope.user.id].money+" 만큼 돈이 있다")
  });
}
  

