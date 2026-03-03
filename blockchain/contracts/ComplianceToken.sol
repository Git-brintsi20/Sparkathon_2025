// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title ComplianceToken
 * @dev ERC-20 token used for vendor compliance rewards and staking.
 *      Vendors earn tokens for high compliance scores and on-time deliveries.
 *      Tokens can be slashed for violations.
 */
contract ComplianceToken is ERC20, ERC20Burnable, Ownable {
    // --- State ---
    uint256 public constant MAX_SUPPLY = 100_000_000 * 1e18; // 100 M tokens
    uint256 public rewardRate = 10 * 1e18; // 10 tokens per reward event
    uint256 public penaltyRate = 5 * 1e18; // 5 tokens slashed per penalty

    mapping(address => bool) public authorizedMinters;
    mapping(address => uint256) public vendorStakes;
    mapping(address => uint256) public lastRewardTimestamp;

    // --- Events ---
    event VendorRewarded(address indexed vendor, uint256 amount, string reason);
    event VendorPenalized(address indexed vendor, uint256 amount, string reason);
    event TokensStaked(address indexed vendor, uint256 amount);
    event TokensUnstaked(address indexed vendor, uint256 amount);
    event MinterUpdated(address indexed account, bool authorized);
    event RewardRateUpdated(uint256 oldRate, uint256 newRate);
    event PenaltyRateUpdated(uint256 oldRate, uint256 newRate);

    // --- Modifiers ---
    modifier onlyMinter() {
        require(authorizedMinters[msg.sender] || msg.sender == owner(), "Not authorized to mint");
        _;
    }

    constructor() ERC20("ComplianceToken", "CMPL") {
        // Mint initial supply to deployer (treasury)
        _mint(msg.sender, 10_000_000 * 1e18); // 10 M to treasury
    }

    // ========================
    //   Admin Functions
    // ========================

    /**
     * @dev Add or remove an authorized minter (e.g. the backend service address).
     */
    function setMinter(address _account, bool _authorized) external onlyOwner {
        require(_account != address(0), "Invalid address");
        authorizedMinters[_account] = _authorized;
        emit MinterUpdated(_account, _authorized);
    }

    /**
     * @dev Update the reward rate.
     */
    function setRewardRate(uint256 _newRate) external onlyOwner {
        require(_newRate > 0, "Rate must be > 0");
        emit RewardRateUpdated(rewardRate, _newRate);
        rewardRate = _newRate;
    }

    /**
     * @dev Update the penalty rate.
     */
    function setPenaltyRate(uint256 _newRate) external onlyOwner {
        require(_newRate > 0, "Rate must be > 0");
        emit PenaltyRateUpdated(penaltyRate, _newRate);
        penaltyRate = _newRate;
    }

    // ========================
    //   Reward / Penalty
    // ========================

    /**
     * @dev Reward a vendor for good compliance. Mints new tokens if below MAX_SUPPLY.
     */
    function rewardVendor(address _vendor, uint256 _amount, string calldata _reason) external onlyMinter {
        require(_vendor != address(0), "Invalid vendor address");
        require(_amount > 0, "Amount must be > 0");
        require(totalSupply() + _amount <= MAX_SUPPLY, "Exceeds max supply");

        _mint(_vendor, _amount);
        lastRewardTimestamp[_vendor] = block.timestamp;
        emit VendorRewarded(_vendor, _amount, _reason);
    }

    /**
     * @dev Convenience wrapper that uses the default reward rate.
     */
    function rewardVendorDefault(address _vendor, string calldata _reason) external onlyMinter {
        require(_vendor != address(0), "Invalid vendor address");
        require(totalSupply() + rewardRate <= MAX_SUPPLY, "Exceeds max supply");

        _mint(_vendor, rewardRate);
        lastRewardTimestamp[_vendor] = block.timestamp;
        emit VendorRewarded(_vendor, rewardRate, _reason);
    }

    /**
     * @dev Penalize a vendor by burning tokens from their balance.
     */
    function penalizeVendor(address _vendor, uint256 _amount, string calldata _reason) external onlyMinter {
        require(_vendor != address(0), "Invalid vendor address");
        require(_amount > 0, "Amount must be > 0");
        require(balanceOf(_vendor) >= _amount, "Insufficient balance to penalize");

        _burn(_vendor, _amount);
        emit VendorPenalized(_vendor, _amount, _reason);
    }

    /**
     * @dev Convenience wrapper that uses the default penalty rate.
     */
    function penalizeVendorDefault(address _vendor, string calldata _reason) external onlyMinter {
        require(_vendor != address(0), "Invalid vendor address");
        require(balanceOf(_vendor) >= penaltyRate, "Insufficient balance to penalize");

        _burn(_vendor, penaltyRate);
        emit VendorPenalized(_vendor, penaltyRate, _reason);
    }

    // ========================
    //   Staking
    // ========================

    /**
     * @dev Stake tokens as a compliance deposit.
     */
    function stake(uint256 _amount) external {
        require(_amount > 0, "Stake must be > 0");
        require(balanceOf(msg.sender) >= _amount, "Insufficient balance");

        _transfer(msg.sender, address(this), _amount);
        vendorStakes[msg.sender] += _amount;
        emit TokensStaked(msg.sender, _amount);
    }

    /**
     * @dev Unstake tokens (subject to no active penalties).
     */
    function unstake(uint256 _amount) external {
        require(_amount > 0, "Amount must be > 0");
        require(vendorStakes[msg.sender] >= _amount, "Insufficient staked balance");

        vendorStakes[msg.sender] -= _amount;
        _transfer(address(this), msg.sender, _amount);
        emit TokensUnstaked(msg.sender, _amount);
    }

    // ========================
    //   View Functions
    // ========================

    function getStake(address _vendor) external view returns (uint256) {
        return vendorStakes[_vendor];
    }

    function getLastRewardTimestamp(address _vendor) external view returns (uint256) {
        return lastRewardTimestamp[_vendor];
    }

    function remainingMintableSupply() external view returns (uint256) {
        return MAX_SUPPLY - totalSupply();
    }
}
