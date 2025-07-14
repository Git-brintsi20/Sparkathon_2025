// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

/**
 * @title VendorCompliance
 * @dev Smart contract for managing vendor compliance records with immutable history
 */
contract VendorCompliance is Ownable, ReentrancyGuard {
    using Counters for Counters.Counter;

    // Vendor compliance levels
    enum ComplianceLevel { PENDING, LOW, MEDIUM, HIGH, CRITICAL }

    // Dispute status
    enum DisputeStatus { OPEN, UNDER_REVIEW, RESOLVED, REJECTED }

    // Vendor structure
    struct Vendor {
        uint256 id;
        string name;
        string email;
        address walletAddress;
        uint256 complianceScore;
        ComplianceLevel complianceLevel;
        uint256 registrationDate;
        bool isActive;
        uint256 totalDeliveries;
        uint256 successfulDeliveries;
        string[] certifications;
    }

    // Compliance record structure
    struct ComplianceRecord {
        uint256 id;
        uint256 vendorId;
        uint256 score;
        ComplianceLevel level;
        string reason;
        uint256 timestamp;
        address updatedBy;
    }

    // Dispute structure
    struct Dispute {
        uint256 id;
        uint256 vendorId;
        string title;
        string description;
        DisputeStatus status;
        uint256 createdDate;
        uint256 resolvedDate;
        address createdBy;
        address resolvedBy;
        string resolution;
    }

    // Counters for IDs
    Counters.Counter private _vendorIds;
    Counters.Counter private _complianceRecordIds;
    Counters.Counter private _disputeIds;

    // Mappings
    mapping(uint256 => Vendor) public vendors;
    mapping(address => uint256) public vendorAddressToId;
    mapping(uint256 => ComplianceRecord[]) public vendorComplianceHistory;
    mapping(uint256 => Dispute[]) public vendorDisputes;
    mapping(uint256 => Dispute) public disputes;

    // Arrays for iteration
    uint256[] public vendorIds;
    uint256[] public disputeIds;

    // Events
    event VendorRegistered(uint256 indexed vendorId, string name, address walletAddress);
    event ComplianceUpdated(uint256 indexed vendorId, uint256 score, ComplianceLevel level);
    event DisputeCreated(uint256 indexed disputeId, uint256 indexed vendorId, string title);
    event DisputeResolved(uint256 indexed disputeId, DisputeStatus status, string resolution);
    event VendorDeactivated(uint256 indexed vendorId);
    event VendorReactivated(uint256 indexed vendorId);

    constructor() {}

    /**
     * @dev Register a new vendor
     */
    function registerVendor(
        string memory _name,
        string memory _email,
        address _walletAddress,
        string[] memory _certifications
    ) external onlyOwner returns (uint256) {
        require(bytes(_name).length > 0, "Name cannot be empty");
        require(bytes(_email).length > 0, "Email cannot be empty");
        require(_walletAddress != address(0), "Invalid wallet address");
        require(vendorAddressToId[_walletAddress] == 0, "Vendor already exists");

        _vendorIds.increment();
        uint256 newVendorId = _vendorIds.current();

        vendors[newVendorId] = Vendor({
            id: newVendorId,
            name: _name,
            email: _email,
            walletAddress: _walletAddress,
            complianceScore: 100, // Start with perfect score
            complianceLevel: ComplianceLevel.HIGH,
            registrationDate: block.timestamp,
            isActive: true,
            totalDeliveries: 0,
            successfulDeliveries: 0,
            certifications: _certifications
        });

        vendorAddressToId[_walletAddress] = newVendorId;
        vendorIds.push(newVendorId);

        // Create initial compliance record
        _createComplianceRecord(newVendorId, 100, ComplianceLevel.HIGH, "Initial registration");

        emit VendorRegistered(newVendorId, _name, _walletAddress);
        return newVendorId;
    }

    /**
     * @dev Update vendor compliance score
     */
    function updateComplianceScore(
        uint256 _vendorId,
        uint256 _score,
        string memory _reason
    ) external onlyOwner {
        require(_vendorId > 0 && _vendorId <= _vendorIds.current(), "Invalid vendor ID");
        require(_score <= 100, "Score cannot exceed 100");
        require(bytes(_reason).length > 0, "Reason cannot be empty");

        Vendor storage vendor = vendors[_vendorId];
        require(vendor.isActive, "Vendor is not active");

        vendor.complianceScore = _score;
        vendor.complianceLevel = _calculateComplianceLevel(_score);

        _createComplianceRecord(_vendorId, _score, vendor.complianceLevel, _reason);

        emit ComplianceUpdated(_vendorId, _score, vendor.complianceLevel);
    }

    /**
     * @dev Create a dispute for a vendor
     */
    function createDispute(
        uint256 _vendorId,
        string memory _title,
        string memory _description
    ) external returns (uint256) {
        require(_vendorId > 0 && _vendorId <= _vendorIds.current(), "Invalid vendor ID");
        require(bytes(_title).length > 0, "Title cannot be empty");
        require(bytes(_description).length > 0, "Description cannot be empty");

        _disputeIds.increment();
        uint256 newDisputeId = _disputeIds.current();

        Dispute memory newDispute = Dispute({
            id: newDisputeId,
            vendorId: _vendorId,
            title: _title,
            description: _description,
            status: DisputeStatus.OPEN,
            createdDate: block.timestamp,
            resolvedDate: 0,
            createdBy: msg.sender,
            resolvedBy: address(0),
            resolution: ""
        });

        disputes[newDisputeId] = newDispute;
        vendorDisputes[_vendorId].push(newDispute);
        disputeIds.push(newDisputeId);

        emit DisputeCreated(newDisputeId, _vendorId, _title);
        return newDisputeId;
    }

    /**
     * @dev Resolve a dispute
     */
    function resolveDispute(
        uint256 _disputeId,
        DisputeStatus _status,
        string memory _resolution
    ) external onlyOwner {
        require(_disputeId > 0 && _disputeId <= _disputeIds.current(), "Invalid dispute ID");
        require(_status != DisputeStatus.OPEN, "Cannot resolve to OPEN status");
        require(bytes(_resolution).length > 0, "Resolution cannot be empty");

        Dispute storage dispute = disputes[_disputeId];
        require(dispute.status == DisputeStatus.OPEN, "Dispute already resolved");

        dispute.status = _status;
        dispute.resolvedDate = block.timestamp;
        dispute.resolvedBy = msg.sender;
        dispute.resolution = _resolution;

        // Update vendor disputes array
        Dispute[] storage vendorDisputeArray = vendorDisputes[dispute.vendorId];
        for (uint256 i = 0; i < vendorDisputeArray.length; i++) {
            if (vendorDisputeArray[i].id == _disputeId) {
                vendorDisputeArray[i] = dispute;
                break;
            }
        }

        emit DisputeResolved(_disputeId, _status, _resolution);
    }

    /**
     * @dev Update vendor delivery statistics
     */
    function updateDeliveryStats(
        uint256 _vendorId,
        bool _successful
    ) external onlyOwner {
        require(_vendorId > 0 && _vendorId <= _vendorIds.current(), "Invalid vendor ID");

        Vendor storage vendor = vendors[_vendorId];
        vendor.totalDeliveries++;

        if (_successful) {
            vendor.successfulDeliveries++;
        }

        // Auto-update compliance score based on delivery success rate
        if (vendor.totalDeliveries >= 5) {
            uint256 successRate = (vendor.successfulDeliveries * 100) / vendor.totalDeliveries;
            uint256 newScore = (vendor.complianceScore + successRate) / 2;

            vendor.complianceScore = newScore;
            vendor.complianceLevel = _calculateComplianceLevel(newScore);

            _createComplianceRecord(
                _vendorId,
                newScore,
                vendor.complianceLevel,
                "Auto-updated based on delivery performance"
            );
        }
    }

    /**
     * @dev Deactivate a vendor
     */
    function deactivateVendor(uint256 _vendorId) external onlyOwner {
        require(_vendorId > 0 && _vendorId <= _vendorIds.current(), "Invalid vendor ID");

        vendors[_vendorId].isActive = false;
        emit VendorDeactivated(_vendorId);
    }

    /**
     * @dev Reactivate a vendor
     */
    function reactivateVendor(uint256 _vendorId) external onlyOwner {
        require(_vendorId > 0 && _vendorId <= _vendorIds.current(), "Invalid vendor ID");

        vendors[_vendorId].isActive = true;
        emit VendorReactivated(_vendorId);
    }

    /**
     * @dev Get vendor information
     */
    function getVendor(uint256 _vendorId) external view returns (
        uint256 id,
        string memory name,
        string memory email,
        address walletAddress,
        uint256 complianceScore,
        ComplianceLevel complianceLevel,
        uint256 registrationDate,
        bool isActive,
        uint256 totalDeliveries,
        uint256 successfulDeliveries,
        string[] memory certifications // Added certifications to the return
    ) {
        require(_vendorId > 0 && _vendorId <= _vendorIds.current(), "Invalid vendor ID");

        Vendor storage vendor = vendors[_vendorId];
        return (
            vendor.id,
            vendor.name,
            vendor.email,
            vendor.walletAddress,
            vendor.complianceScore,
            vendor.complianceLevel,
            vendor.registrationDate,
            vendor.isActive,
            vendor.totalDeliveries,
            vendor.successfulDeliveries,
            vendor.certifications // Return certifications
        );
    }

    /**
     * @dev Get vendor compliance history
     */
    function getVendorComplianceHistory(uint256 _vendorId) external view returns (ComplianceRecord[] memory) {
        require(_vendorId > 0 && _vendorId <= _vendorIds.current(), "Invalid vendor ID");
        return vendorComplianceHistory[_vendorId];
    }

    /**
     * @dev Get vendor disputes
     */
    function getVendorDisputes(uint256 _vendorId) external view returns (Dispute[] memory) {
        require(_vendorId > 0 && _vendorId <= _vendorIds.current(), "Invalid vendor ID");
        return vendorDisputes[_vendorId];
    }

    /**
     * @dev Get all vendor IDs
     */
    function getAllVendorIds() external view returns (uint256[] memory) {
        return vendorIds;
    }

    /**
     * @dev Get total vendor count
     */
    function getTotalVendors() external view returns (uint256) {
        return _vendorIds.current();
    }

    /**
     * @dev Get vendor by wallet address
     */
    function getVendorByAddress(address _walletAddress) external view returns (uint256) {
        return vendorAddressToId[_walletAddress];
    }

    /**
     * @dev Internal function to create compliance record
     */
    function _createComplianceRecord(
        uint256 _vendorId,
        uint256 _score,
        ComplianceLevel _level,
        string memory _reason
    ) internal {
        _complianceRecordIds.increment();
        uint256 recordId = _complianceRecordIds.current();

        ComplianceRecord memory record = ComplianceRecord({
            id: recordId,
            vendorId: _vendorId,
            score: _score,
            level: _level,
            reason: _reason,
            timestamp: block.timestamp,
            updatedBy: msg.sender
        });

        vendorComplianceHistory[_vendorId].push(record);
    }

    /**
     * @dev Internal function to calculate compliance level based on score
     */
    function _calculateComplianceLevel(uint256 _score) internal pure returns (ComplianceLevel) {
        if (_score >= 90) return ComplianceLevel.HIGH;
        if (_score >= 70) return ComplianceLevel.MEDIUM;
        if (_score >= 50) return ComplianceLevel.LOW;
        return ComplianceLevel.CRITICAL;
    }
}
