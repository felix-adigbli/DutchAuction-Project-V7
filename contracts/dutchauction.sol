// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract DutchAuction {
    address payable public seller;
    uint256 public reservePrice;
    uint256 public numBlocksAuctionOpen;
    uint256 public offerPriceDecrement;
    uint256 public startBlock;
    uint256 public endBlock;
    uint256 public currentPrice;
    bool public auctionEnded;
    address public bidWinner;

    // Seller Placed A bid

    constructor(
        uint256 _reservePrice,
        uint256 _numBlocksAuctionOpen,
        uint256 _offerPriceDecrement
    ) {
        seller = payable(msg.sender);
        reservePrice = _reservePrice;
        numBlocksAuctionOpen = _numBlocksAuctionOpen;
        offerPriceDecrement = _offerPriceDecrement;
        startBlock = block.number;
        endBlock = startBlock + numBlocksAuctionOpen;
        auctionEnded = false;
    }

    function getCurrentPrice() public returns (uint256) {
        require(block.number <= endBlock, "Auction has expired");
        currentPrice = reservePrice + (endBlock - block.number) * offerPriceDecrement;
        return currentPrice;
    }

    // Function to get the bid winner
    function getBidWinner() public view returns (address) {
        return bidWinner;
    }

    // Function for bidders to place bid and process the bid
    function placeBid() external payable {
        require(!auctionEnded, "Auction has ended");
        getCurrentPrice(); // Get current price
        require(block.number <= endBlock, "Auction has expired");
        if (msg.value >= currentPrice) {
            auctionEnded = true;
            seller.transfer(msg.value); // Transfer bid to seller
            bidWinner = msg.sender;
            string memory message = string(abi.encodePacked("Bid process successful and the winner is ", addressToString(bidWinner)));
            revert(message);
        } else {
            payable(msg.sender).transfer(msg.value); // Transfer bid to sender
            string memory message = string(abi.encodePacked("Bid process unsuccessful. Please place a higher bid. Your bid amount: ", uintToString(msg.value)));
            revert(message);
        }
    }

    // Helper function to convert address to string
function addressToString(address _address) internal pure returns (string memory) {
    bytes32 value = bytes32(uint256(uint160(_address)));
    bytes memory alphabet = "0123456789abcdef";
    bytes memory str = new bytes(42);
    str[0] = "0";
    str[1] = "x";
    for (uint256 i = 0; i < 20; i++) {
        uint8 byteValue = uint8(value[i + 12]);
        str[2 + i * 2] = alphabet[byteValue >> 4];
        str[3 + i * 2] = alphabet[byteValue & 0x0f];
    }
    return string(str);
}

 // Helper function to convert uint to string
    function uintToString(uint256 value) internal pure returns (string memory) {
        if (value == 0) {
            return "0";
        }
        uint256 temp = value;
        uint256 digits;
        while (temp != 0) {
            digits++;
            temp /= 10;
        }
        bytes memory buffer = new bytes(digits);
        uint256 index = digits - 1;
        temp = value;
        while (temp != 0) {
            buffer[index--] = bytes1(uint8(48 + temp % 10));
            temp /= 10;
        }
        return string(buffer);
    }
}
