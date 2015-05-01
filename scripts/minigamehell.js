// Description:
//   ZeroBot Introduce.
//

module.exports = function(robot){
  robot.hear(/게임시작/i, function(res){
    res.send("안녕 "+res.envelope.user.name+:". 지금부터 게임을 시작한다");
	//res.send("Repository : https://github.com/zeropage/zerobot");
    //res.send("기능 추가 및 버그 수정은 github Repository에 Pull Request로 보내주시기 바랍니다.");
    //res.send("※ Zerobot을 사용하기 위해서는 각 채널에 초대를 하시기 바랍니다.");
  });
}

