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
    // Event emitted when bid is processed successfully
    event BidProcessed(address indexed bidder, uint256 amount);

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
        if (endBlock < block.number) {
            currentPrice = reservePrice;
            return currentPrice;
        } else {
        currentPrice = reservePrice + (endBlock - block.number) * offerPriceDecrement;
        return currentPrice;
        }


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
            emit BidProcessed(msg.sender, msg.value); // Emit the BidProcessed event

        } else {
            payable(msg.sender).transfer(msg.value); // Transfer bid to sender

        }
    }

}
