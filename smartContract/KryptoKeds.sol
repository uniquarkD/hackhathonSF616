pragma solidity 0.4.24;


contract KyrptoKeds {
    address public owner;
    uint256 public minScore = 75;
    uint256 public rewardUnit = 0.001;

    constructor() public {
        owner = msg.sender;
    }

    //fallback payable
    function() public payable {}

    function kill() public {
        if (msg.sender == owner) selfdestruct(owner);
    }

    function reward(address toKid, uint256 result) payable {
        if (msg.sender == owner) {
            if (result > minScore) {
                //Sending from SC address to the kids address
                toKid.transfer(rewardUnit);
            }
        }
    }
}
