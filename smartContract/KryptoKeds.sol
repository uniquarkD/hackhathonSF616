pragma solidity 0.4.24;


contract KyrptoKeds {
    address public owner;
    //uint256 public minimumBet;
    //uint256 public totalBet;
    //uint256 public numberOfBets;
    //uint256 public maxAmountOfBets = 100;
    address[] public kids;
    address[] public donors;

    struct Kids {
        uint256 amountEarned;
        uint256 totalBet;
    }

    struct Donor {
        uint256 amountDonated;
    }

    constructor() public {
        owner = msg.sender;
    }

    //fallback payable
    function() public payable {}

    // The address of the kids and => the kids info
    mapping(address => Kid) public kidsInfo;

    // The address of the donors and => the donors info
    mapping(address => Donor) public donorsInfo;

    function kill() public {
        if (msg.sender == owner) selfdestruct(owner);
    }
}
