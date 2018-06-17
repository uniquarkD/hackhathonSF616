pragma solidity 0.4.24;
contract Kedu {
   address public student;
   uint256 public minScore = 0;
   uint256 public maxScore = 100;
   unit256 public gradeC = 60
   unit256 public gradeB = 80
   unit256 public gradeA = 95
   unit256 public unitReward = 1

   struct Student {
     unit256 id;
     unit256 quizId;
     uint256 score;
   }

   constructor() public {
      owner = msg.sender;
    }

    function checkScore(uint256 score) public payable {
      require(score >= minScore && score <= maxScore)

      studentInfo[msg.sender].score = score;
      student.push(msg.sender);

      if (score >= gradeA){
        rewardStudent(gradeA)
      }else if (score >= gradeB && score < gradeA) {
        rewardStudent(gradeB)
      } else if (score >= gradeC && score < gradeB ) {
        rewardStudent(gradeC)
      } else {
        // no pay
      }
    }

    function rewardStudent(uint256 grade) public {
      switch(grade) {
        case gradeA:
          student.transfer(unitReward * 3)
          break;
        case gradeB:
          student.transfer(unitReward * 2)
          break;
        case gradeC:
          student.transfer(unitReward * 1)
          break;
        default:
          break;
      }
    }

   function kill() public {
      if(msg.sender == owner) selfdestruct(owner);

   }
}
