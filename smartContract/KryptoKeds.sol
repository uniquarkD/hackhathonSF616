pragma solidity 0.4.24;


contract KyrptoKeds {
    address public owner;
    int constant public MIN_SCORE = 75;
    //1/10th of ether - wei
    uint constant public REWARD_UNIT = 0.01 ether;

    constructor() public {
        owner = msg.sender;
    }

    //Transfer money to the Owner before selfdestruct
    //In future iteration, send the money back to donors
    function kill() public {
        if (msg.sender == owner) {
            owner.transfer(address(this).balance);
            selfdestruct(owner);
        }
    }

    //Donate money from Donor address to the Contract address
    function donate() public payable {
        if (msg.value == 0) { return; }
    }

    //Pay out to the toAddress (kids address) from the Contract address
    function reward(address toAddress, int testScore) public {
        //Sender must be the owner - Don't let others call this function
        //If you are using MetaMask - you will get warning that transaction may fail
        require(msg.sender == owner);

        //Contract address must have minimum balance before rewarding
        //If you are using MetaMask - you will get warning that transaction may fail
        //First donate from Donor address to Contract address either directly only the network or using donate function
        require(address(this).balance > REWARD_UNIT);

        //testScore must be greater than the threshold
        //Ok to call function with less testScore; nothing will be transferred
        if (testScore > MIN_SCORE) {
            //Sending from owners address to the kids address
            toAddress.transfer(REWARD_UNIT);
        }
    }

    //Returns Contract address balance
    function balance() public constant returns(uint256) {
        return address(this).balance;
    }
}
