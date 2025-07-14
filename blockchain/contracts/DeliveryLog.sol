// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

/**
 * @title DeliveryLog
 * @dev Smart contract for immutable delivery logging and verification
 */
contract DeliveryLog is Ownable, ReentrancyGuard {
    using Counters for Counters.Counter;

    // Delivery status enum
    enum DeliveryStatus {
        PENDING,
        IN_TRANSIT,
        DELIVERED,
        REJECTED,
        CANCELLED
    }

    // Verification status enum
    enum VerificationStatus {
        UNVERIFIED,
        VERIFIED,
        FAILED,
        DISPUTED
    }

    // Delivery structure
    struct Delivery {
        uint256 id;
        uint256 vendorId;
        string purchaseOrderId;
        string trackingNumber;
        DeliveryStatus status;
        VerificationStatus verificationStatus;
        uint256 createdDate;
        uint256 expectedDeliveryDate;
        uint256 actualDeliveryDate;
        address createdBy;
        address verifiedBy;
        string deliveryLocation;
        string[] itemsDelivered;
        uint256 totalValue;
        string notes;
    }

    // Verification record structure
    struct VerificationRecord {
        uint256 id;
        uint256 deliveryId;
        VerificationStatus status;
        string verificationMethod;
        string verificationData;
        uint256 timestamp;
        address verifiedBy;
        string notes;
        string imageHash; // IPFS hash of verification image
    }

    // Delivery update structure for tracking history
    struct DeliveryUpdate {
        uint256 id;
        uint256 deliveryId;
        DeliveryStatus previousStatus;
        DeliveryStatus newStatus;
        uint256 timestamp;
        address updatedBy;
        string location;
        string notes;
    }

    // Counters for IDs
    Counters.Counter private _deliveryIds;
    Counters.Counter private _verificationIds;
    Counters.Counter private _updateIds;

    // Mappings
    mapping(uint256 => Delivery) public deliveries;
    mapping(uint256 => VerificationRecord[]) public deliveryVerifications;
    mapping(uint256 => DeliveryUpdate[]) public deliveryUpdates;
    mapping(string => uint256) public trackingNumberToDeliveryId;
    mapping(uint256 => uint256[]) public vendorDeliveries;

    // Arrays for iteration
    uint256[] public deliveryIds;

    // Events
    event DeliveryCreated(uint256 indexed deliveryId, uint256 indexed vendorId, string trackingNumber);
    event DeliveryStatusUpdated(uint256 indexed deliveryId, DeliveryStatus previousStatus, DeliveryStatus newStatus);
    event DeliveryVerified(uint256 indexed deliveryId, VerificationStatus status, address verifiedBy);
    event VerificationRecordAdded(uint256 indexed verificationId, uint256 indexed deliveryId);
    event DeliveryCompleted(uint256 indexed deliveryId, uint256 actualDeliveryDate);

    constructor() {}

    /**
     * @dev Create a new delivery record
     */
    function createDelivery(
        uint256 _vendorId,
        string memory _purchaseOrderId,
        string memory _trackingNumber,
        uint256 _expectedDeliveryDate,
        string memory _deliveryLocation,
        string[] memory _itemsDelivered,
        uint256 _totalValue,
        string memory _notes
    ) external onlyOwner returns (uint256) {
        require(_vendorId > 0, "Invalid vendor ID");
        require(bytes(_purchaseOrderId).length > 0, "Purchase Order ID cannot be empty");
        require(bytes(_trackingNumber).length > 0, "Tracking number cannot be empty");
        require(_expectedDeliveryDate > block.timestamp, "Expected delivery date must be in the future");
        require(trackingNumberToDeliveryId[_trackingNumber] == 0, "Tracking number already exists");

        _deliveryIds.increment();
        uint256 newDeliveryId = _deliveryIds.current();

        deliveries[newDeliveryId] = Delivery({
            id: newDeliveryId,
            vendorId: _vendorId,
            purchaseOrderId: _purchaseOrderId,
            trackingNumber: _trackingNumber,
            status: DeliveryStatus.PENDING,
            verificationStatus: VerificationStatus.UNVERIFIED,
            createdDate: block.timestamp,
            expectedDeliveryDate: _expectedDeliveryDate,
            actualDeliveryDate: 0,
            createdBy: msg.sender,
            verifiedBy: address(0),
            deliveryLocation: _deliveryLocation,
            itemsDelivered: _itemsDelivered,
            totalValue: _totalValue,
            notes: _notes
        });

        trackingNumberToDeliveryId[_trackingNumber] = newDeliveryId;
        vendorDeliveries[_vendorId].push(newDeliveryId);
        deliveryIds.push(newDeliveryId);

        // Create initial update record
        _createDeliveryUpdate(newDeliveryId, DeliveryStatus.PENDING, DeliveryStatus.PENDING, "Delivery created");

        emit DeliveryCreated(newDeliveryId, _vendorId, _trackingNumber);
        return newDeliveryId;
    }

    /**
     * @dev Update delivery status
     */
    function updateDeliveryStatus(
        uint256 _deliveryId,
        DeliveryStatus _newStatus,
        string memory _location,
        string memory _notes
    ) external onlyOwner {
        require(_deliveryId > 0 && _deliveryId <= _deliveryIds.current(), "Invalid delivery ID");

        Delivery storage delivery = deliveries[_deliveryId];
        DeliveryStatus previousStatus = delivery.status;

        require(previousStatus != _newStatus, "Status is already set to this value");
        require(previousStatus != DeliveryStatus.DELIVERED, "Cannot update completed delivery");
        require(previousStatus != DeliveryStatus.CANCELLED, "Cannot update cancelled delivery");

        delivery.status = _newStatus;

        // Set actual delivery date if delivered
        if (_newStatus == DeliveryStatus.DELIVERED) {
            delivery.actualDeliveryDate = block.timestamp;
            emit DeliveryCompleted(_deliveryId, block.timestamp);
        }

        _createDeliveryUpdate(_deliveryId, previousStatus, _newStatus, _notes);

        emit DeliveryStatusUpdated(_deliveryId, previousStatus, _newStatus);
    }

    /**
     * @dev Add verification record for a delivery
     * Changed visibility from 'external' to 'public' to allow internal calls.
     */
    function addVerificationRecord(
        uint256 _deliveryId,
        VerificationStatus _status,
        string memory _verificationMethod,
        string memory _verificationData,
        string memory _notes,
        string memory _imageHash
    ) public returns (uint256) { // Changed to public
        require(_deliveryId > 0 && _deliveryId <= _deliveryIds.current(), "Invalid delivery ID");
        require(bytes(_verificationMethod).length > 0, "Verification method cannot be empty");

        _verificationIds.increment();
        uint256 newVerificationId = _verificationIds.current();

        VerificationRecord memory record = VerificationRecord({
            id: newVerificationId,
            deliveryId: _deliveryId,
            status: _status,
            verificationMethod: _verificationMethod,
            verificationData: _verificationData,
            timestamp: block.timestamp,
            verifiedBy: msg.sender,
            notes: _notes,
            imageHash: _imageHash
        });

        deliveryVerifications[_deliveryId].push(record);

        // Update delivery verification status
        deliveries[_deliveryId].verificationStatus = _status;
        deliveries[_deliveryId].verifiedBy = msg.sender;

        emit VerificationRecordAdded(newVerificationId, _deliveryId);
        emit DeliveryVerified(_deliveryId, _status, msg.sender);

        return newVerificationId;
    }

    /**
     * @dev Verify delivery with QR code or barcode
     */
    function verifyDeliveryWithCode(
        uint256 _deliveryId,
        string memory _scannedCode,
        string memory _imageHash
    ) external returns (bool) {
        require(_deliveryId > 0 && _deliveryId <= _deliveryIds.current(), "Invalid delivery ID");
        require(bytes(_scannedCode).length > 0, "Scanned code cannot be empty");

        Delivery storage delivery = deliveries[_deliveryId];

        // Simple verification: check if scanned code contains tracking number
        bool isValid = _contains(delivery.trackingNumber, _scannedCode);

        VerificationStatus status = isValid ? VerificationStatus.VERIFIED : VerificationStatus.FAILED;

        // Ensure all 6 arguments are passed correctly
        addVerificationRecord(
            _deliveryId,
            status,
            "QR_CODE_SCAN",
            _scannedCode, // _verificationData
            isValid ? "Successfully verified via QR code" : "QR code verification failed", // _notes
            _imageHash
        );

        return isValid;
    }

    /**
     * @dev Get delivery information
     * Changed return type to the full Delivery struct to avoid "Stack too deep" error.
     */
    function getDelivery(uint256 _deliveryId) external view returns (Delivery memory) {
        require(_deliveryId > 0 && _deliveryId <= _deliveryIds.current(), "Invalid delivery ID");
        return deliveries[_deliveryId];
    }

    /**
     * @dev Get delivery by tracking number
     */
    function getDeliveryByTrackingNumber(string memory _trackingNumber) external view returns (uint256) {
        return trackingNumberToDeliveryId[_trackingNumber];
    }

    /**
     * @dev Get delivery verification records
     */
    function getDeliveryVerifications(uint256 _deliveryId) external view returns (VerificationRecord[] memory) {
        require(_deliveryId > 0 && _deliveryId <= _deliveryIds.current(), "Invalid delivery ID");
        return deliveryVerifications[_deliveryId];
    }

    /**
     * @dev Get delivery update history
     */
    function getDeliveryUpdates(uint256 _deliveryId) external view returns (DeliveryUpdate[] memory) {
        require(_deliveryId > 0 && _deliveryId <= _deliveryIds.current(), "Invalid delivery ID");
        return deliveryUpdates[_deliveryId];
    }

    /**
     * @dev Get all deliveries for a vendor
     */
    function getVendorDeliveries(uint256 _vendorId) external view returns (uint256[] memory) {
        return vendorDeliveries[_vendorId];
    }

    /**
     * @dev Get all deliveries
     */
    function getAllDeliveries() external view returns (uint256[] memory) {
        return deliveryIds;
    }

    /**
     * @dev Get total delivery count
     */
    function getTotalDeliveries() external view returns (uint256) {
        return _deliveryIds.current();
    }

    /**
     * @dev Get delivery items
     */
    function getDeliveryItems(uint256 _deliveryId) external view returns (string[] memory) {
        require(_deliveryId > 0 && _deliveryId <= _deliveryIds.current(), "Invalid delivery ID");
        return deliveries[_deliveryId].itemsDelivered;
    }

    /**
     * @dev Check if delivery is overdue
     */
    function isDeliveryOverdue(uint256 _deliveryId) external view returns (bool) {
        require(_deliveryId > 0 && _deliveryId <= _deliveryIds.current(), "Invalid delivery ID");

        Delivery storage delivery = deliveries[_deliveryId];

        if (delivery.status == DeliveryStatus.DELIVERED ||
            delivery.status == DeliveryStatus.CANCELLED) {
            return false;
        }

        return block.timestamp > delivery.expectedDeliveryDate;
    }

    /**
     * @dev Get delivery statistics for a vendor
     */
    function getVendorDeliveryStats(uint256 _vendorId) external view returns (
        uint256 totalDeliveries,
        uint256 completedDeliveries,
        uint256 pendingDeliveries,
        uint256 overdueDeliveries
    ) {
        uint256[] memory vendorDeliveryList = vendorDeliveries[_vendorId];

        uint256 completed = 0;
        uint256 pending = 0;
        uint256 overdue = 0;

        for (uint256 i = 0; i < vendorDeliveryList.length; i++) {
            Delivery storage delivery = deliveries[vendorDeliveryList[i]];

            if (delivery.status == DeliveryStatus.DELIVERED) {
                completed++;
            } else if (delivery.status == DeliveryStatus.PENDING ||
                       delivery.status == DeliveryStatus.IN_TRANSIT) {
                pending++;

                if (block.timestamp > delivery.expectedDeliveryDate) {
                    overdue++;
                }
            }
        }

        return (vendorDeliveryList.length, completed, pending, overdue);
    }

    /**
     * @dev Internal function to create delivery update record
     */
    function _createDeliveryUpdate(
        uint256 _deliveryId,
        DeliveryStatus _previousStatus,
        DeliveryStatus _newStatus,
        string memory _notes
    ) internal {
        _updateIds.increment();
        uint256 updateId = _updateIds.current();

        DeliveryUpdate memory update = DeliveryUpdate({
            id: updateId,
            deliveryId: _deliveryId,
            previousStatus: _previousStatus,
            newStatus: _newStatus,
            timestamp: block.timestamp,
            updatedBy: msg.sender,
            location: "",
            notes: _notes
        });

        deliveryUpdates[_deliveryId].push(update);
    }

    /**
     * @dev Internal function to check if string contains substring
     */
    function _contains(string memory _string, string memory _substring) internal pure returns (bool) {
        bytes memory stringBytes = bytes(_string);
        bytes memory substringBytes = bytes(_substring);

        if (substringBytes.length > stringBytes.length) {
            return false;
        }

        for (uint256 i = 0; i <= stringBytes.length - substringBytes.length; i++) {
            bool found = true;
            for (uint256 j = 0; j < substringBytes.length; j++) {
                if (stringBytes[i + j] != substringBytes[j]) {
                    found = false;
                    break;
                }
            }
            if (found) {
                return true;
            }
        }

        return false;
    }
}
