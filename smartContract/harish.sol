pragma solidity 0.4.24;
contract WeLearn {
   address public org;
   address public student;
   uint256 public value;
   uint256 public score;

   constructor() public payable {
        org = msg.sender;
        value = msg.value / 2;
        require((2 * value) == msg.value, "Value has to be even.");
    }

   //Grading
   enum Grade {D, C, B, A}
   Grade public grade;
   Grade constant defaultGrade = Grade.D;

   function getGrade(uint256 _score) public returns(Grade) {
     if (_score >= 95){
       return Grade.A;
     }else if (_score >= 80 && _score < 95) {
       return Grade.B;
     } else if (_score >= 60 && _score < 80 ) {
       return Grade.C;
     } else {
       return Grade.D;
     }
   }

   //modifier
   modifier condition(bool _condition) {
        require(_condition);
        _;
    }

    modifier onlyStudent() {
        require(
            msg.sender == student,
            "Only buyer can call this."
        );
        _;
    }

    modifier onlyOrg() {
        require(
            msg.sender == org,
            "Only Organization can call this."
        );
        _;
    }

    modifier inState(State _state) {
        require(
            state == _state,
            "Invalid state."
        );
        _;
    }

    //Event
    event Aborted();
    event ScoreConfirmed();
    event RewardReceived();

   enum State { Created, Locked, Inactive }
   State public state;

   //Abort donation and reclaim the ether.
   //can only be called by the org before
   // the contract is Locked
   function abort() public
    onlyOrg
    inState(State.Created)
    {
      emit Aborted();
      state = State.Inactive;
      org.transfer(address(this).balance);
    }

    function confirmScore(uint256 _score) public
      inState(State.Created)
      condition(_score >= 0 && _score <= 100)
      payable
      {
        score = uint256(getGrade(_score));
        emit ScoreConfirmed();
        student = msg.sender;
        state = State.Locked;
      }

    function confirmReceived() public
      onlyStudent
      inState(State.Locked)
    {
      emit RewardReceived();
      state =  State.Inactive;

      org.transfer(value);
      student.transfer(address(this).balance);
    }

}
