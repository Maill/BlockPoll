pragma solidity >=0.4.22 <0.6.0;
pragma experimental ABIEncoderV2;

library Lib {
    struct Poll {
        string pollName;
        address creator;
        uint256 totalVotes;
        uint256 creationDate;
        uint256 finishDate;
        bool active;
    }
    
    struct PollItem {
        string name;
        uint8 votes;
    }
}

contract Voting {
    Lib.Poll poll;
    mapping (string => Lib.PollItem) pollItems;
    string[] pollItemsEntries;
    mapping (address => bool) voters;
    
    constructor(string memory _name, uint256 _endDate) public { 
        poll = Lib.Poll({pollName: _name, creator: msg.sender, totalVotes: 0, creationDate: now, finishDate: _endDate, active: false});
    }
    
    //Add an PollItem to a poll
    function addPollItem(string memory _namePollItem) public  {
        require(!poll.active && msg.sender == poll.creator, "Not Authorized");
        require(now < poll.finishDate, "Finish date has been reached");
        Lib.PollItem memory newPollItem = Lib.PollItem({name: _namePollItem, votes: 0});
        pollItems[_namePollItem] = newPollItem;
        pollItemsEntries.push(_namePollItem);
    }

    //Vote for a PollItem on a poll
    function vote(string memory _pollItemToVote) public {
        require(poll.active, "Not Active");
        require(now < poll.finishDate, "Finish date has been reached");
        require(voters[msg.sender] == false, "You have already vote");
        pollItems[_pollItemToVote].votes = pollItems[_pollItemToVote].votes + 1;
        voters[msg.sender] = true;
        poll.totalVotes = poll.totalVotes + 1;
    }
    
    function setActive() public {
        require(msg.sender == poll.creator, "Not Authorized");
        require(now < poll.finishDate, "Finish date has been reached");
        poll.active = true;
    }
    
    function closePoll() public {
        require(msg.sender == poll.creator, "Not Authorized");
        poll.active = false;
    }
    
    //Get the data for the poll
    function getPollData() public view returns (string memory pollName, address creator, bool active, uint256 totalVotes, uint256 creationDate, uint256 finishDate, uint256 items) {
        return (poll.pollName, poll.creator, poll.active, poll.totalVotes, poll.creationDate, poll.finishDate, pollItemsEntries.length);
    }
    
    //Get the info of a PollItem
    function getPollItemFromPoll(uint256 _index) public view returns (string memory, uint8) {
        Lib.PollItem memory pollItem = pollItems[pollItemsEntries[_index]];
        return (pollItem.name, pollItem.votes);
    }
}