import React, { useState, useEffect, useMemo } from "react";
import axios from "axios";
import { Card, CardBody, Modal, Button, Form } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye } from "@fortawesome/free-solid-svg-icons";
import DownloadExcelButton from "./downloadExel";
import MaterialReactTable from "material-react-table"; // Import this if it's a third-party component

export const Payment = () => {
  const [jsonData, setJsonData] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [amount, setAmount] = useState("");

  const colvendor = useMemo(
    () => [
      { header: "No", accessorKey: "No" },
      { header: "uName", accessorKey: "vendorName" },
      { header: "uMobile", accessorKey: "vendorMobile" },
      { header: "Service Title", accessorKey: "serviceTitle" },
      { header: "Service Name", accessorKey: "serviceName" },
      { header: "Service Start Date", accessorKey: "serviceStartDate" },
      { header: "Service End Date", accessorKey: "serviceEndDate" },
      { header: "Total Amount", accessorKey: "totalAmount" },
      { header: "Service Location", accessorKey: "serviceLocation" }, // Combined column
      { header: "Payment Method", accessorKey: "paymentMethod" },
      { header: "Action", accessorKey: "actions" },
    ],
    []
  );

  const getUserList = async () => {
    const token1 = localStorage.getItem("token1");
    const accessToken = localStorage.getItem("accessToken");
    try {
      let res = await axios.post(
        `https://pets.dev.savaapi.com/api/custom-api/dev1/payment/payment-history-get-all`,
        {
          Year: "2024",
          deep: "vendorId",
        },
        {
          headers: {
            "x-am-authorization": token1,
            "x-am-user-authorization": accessToken,
          },
        }
      );
      console.log(res.data);
      const data = res.data.data.myBookings.map((item, index) => {
        const vetService = item.vetServiceData[0] || {};
        const serviceDetails = vetService.serviceWithDetails ? vetService.serviceWithDetails[0] : {};
        const vendor = serviceDetails.vendorId || {};
        const location = serviceDetails.serviceLocation || {};
        return {
          No: index + 1,
          vendorName: vendor.uName || "N/A",
          vendorMobile: vendor.uMobile || "N/A",
          serviceTitle: vetService.title || "N/A",
          serviceName: vetService.serviceName || "N/A",
          serviceStartDate: vetService.startDate || "N/A",
          serviceEndDate: vetService.endDate || "N/A",
          totalAmount: vetService.totalAmount || "N/A",
          serviceLocation: `
            ${location.buildingName || "N/A"}, 
            ${location.landmark || "N/A"}, 
            ${location.pinCode || "N/A"}, 
            ${location.city || "N/A"}, 
            ${location.state || "N/A"}, 
            ${location.addressType || "N/A"}
          `,
          paymentMethod: serviceDetails.paymentDetails ? serviceDetails.paymentDetails.paymentMethod : "N/A",
          actions: (
            <div>
              <FontAwesomeIcon
                icon={faEye}
                onClick={() => handleEyeClick(item)}
              />
            </div>
          ),
        };
      });
      setJsonData(data); // Update jsonData directly
    } catch (error) {
      console.error(error);
    }
  };

  const handleEyeClick = (item) => {
    setSelectedBooking(item);
    setShowModal(true);
  };

  const handleAmountChange = (e) => {
    setAmount(e.target.value);
  };

  const handleSaveAmount = () => {
    // Save the amount (send to server or update state as necessary)
    console.log(`Amount entered: ${amount}`);
    setShowModal(false);
  };

  useEffect(() => {
    getUserList();
  }, []);

  return (
    <Card border="light" className="bg-white shadow-sm mb-4">
      <CardBody>
        <h5 style={{ marginTop: "30px", position: "absolute" }}>Payment</h5>
        <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center py-4">
          <div></div>
          <div>
            <DownloadExcelButton jsonData={jsonData} fileName="user" />
          </div>
        </div>
        <MaterialReactTable
          autoResetPageIndex={false}
          columns={colvendor}
          data={jsonData} 
          enableRowOrdering
          enableSorting={false}
        />
      </CardBody>

      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Enter Amount</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group>
            <Form.Label>Amount</Form.Label>
            <Form.Control
              type="text"
              value={amount}
              onChange={handleAmountChange}
            />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="primary" onClick={handleSaveAmount}>
            Send
          </Button>
        </Modal.Footer>
      </Modal>
    </Card>
  );
};
