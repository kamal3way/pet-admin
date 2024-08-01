
import React, { useState, useEffect, useMemo } from "react";
import { Card } from "@themesberg/react-bootstrap";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faEye, faTrash } from "@fortawesome/free-solid-svg-icons";
import { useHistory } from "react-router-dom";
import { MaterialReactTable } from "material-react-table";
import Tab from "@mui/material/Tab";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import TabPanel from "@mui/lab/TabPanel";
import Swal from "sweetalert2";
import {
  Col,
  Row,
  Form,
  Button,
  InputGroup,
} from "@themesberg/react-bootstrap";
import Modal from "rsuite/esm/Overlay/Modal";
import { Formik } from "formik";
import * as Yup from "yup";


export const PetInsurance = () => {
  const history = useHistory();
  const navigateDetails1 = ( personalDetails,serviceType,items) => {
    console.log("serviceAddressserviceAddressserviceAddress",serviceType);
    history.push({
      pathname: `/Insurancedetails`,
      state: {  personalDetails,serviceType ,items}
    });
  };


  const navigateDetails = (personalDetails, serviceType, items) => {
    console.log("234567", items);
    history.push({
        pathname: "/Insurancedetails",
        state: { personalDetails, serviceType, items }
    });
};
    const [jsonData, setJsonData] = useState([]);
    const [value, setValue] = useState("1");
    const onEditCloseModal = () => setEditOpen(false)
    const [Editopen, setEditOpen] = useState(false);
    const [editData, setEditData] = useState({});
    const [services, setServices] = useState([]);
    const [jsonData1, setJsonData1] = useState([]);
    const [selectedService, setSelectedService] = useState("");
    const tabListStyles = {
        display: "flex",
        justifyContent: "center",
        background: "#f5f5f5",
        padding: "10px",
        borderRadius: "5px",
      };
    
      const tabStyles = {
        fontSize: "14px",
        fontWeight: "bold",
        textTransform: "uppercase",
        padding: "5px 5px",
        margin: "0 5px",
        borderRadius: "5px",
        cursor: "pointer",
        color: "#333",
        background: "#fff",
        boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
        transition: "background 0.3s ease-in-out",
      };
    
      const activeTabStyles = {
        background: "black",
        color: "white",
      };
      const columns1 = useMemo(
        () => [
          { accessorKey: "uName", header: "USER NAME" },
          { accessorKey: "uMobile", header: "UMobile" },
          { accessorKey: "serviceCharge", header: "serviceCharge" },
          { accessorKey: "serviceAt", header: "serviceAt" },
          { accessorKey: "commissionPercentage", header: "commissionPercentage" },
          { accessorKey: "commissionCharge", header: "commissionCharge" },
          { accessorKey: "totalAmount", header: "totalAmount" },
          { accessorKey: "bookingPurpose", header: "bookingPurpose" },
          { accessorKey: "bookingDate", header: "bookingDate" },
          { accessorKey: "bookingTimeSlot", header: "bookingTimeSlot" },
          { accessorKey: "paymentMethod", header: "paymentMethod" },
          { accessorKey: "paymentType", header: "paymentType" },
          { accessorKey: "bookingStatus", header: "bookingStatus" },
          { accessorKey: "bookingCancelReason", header: "bookingCancelReason" },
      
        ],
        []
      );
      const columns2 = useMemo(
        () => [
          { accessorKey: "pName", header: "Name" },
          { accessorKey: "pMobile", header: "Mobile" },
          { accessorKey: "businessName", header: "BUSINESS NAME" },
          { accessorKey: "actions", header: "Actions" },
        ],
        []
      );
      const getConsultant = async () => {
        const token1 = localStorage.getItem("token1");
        const accessToken = localStorage.getItem("accessToken");
        try {
          const res = await axios.get(
            `https://pets.dev.savaapi.com/api/schema/dev1/mongodb/pets/online_consultant_bookings`,
            {
              headers: {
                "x-am-authorization": token1,
                "x-am-user-authorization": accessToken,
              },
              params: {
                deep: 'userId',
              }
            }
          );
          const data = res.data?.data?.map((item) => ({
            uName: item.userId.uName,
            uMobile: item.userId.uMobile,
            serviceCharge: item.serviceCharge,
            serviceAt: item.serviceAt,
            commissionPercentage: item.commissionPercentage,
            commissionCharge: item.commissionCharge,
            totalAmount: item.totalAmount,
            bookingPurpose: item.bookingPurpose,
            bookingDate: item.bookingDate,
            bookingTimeSlot: item.bookingTimeSlot,
            paymentMethod: item.paymentDetails.paymentMethod,
            paymentType: item.paymentDetails.paymentType,
            bookingStatus: item.bookingStatus,
            bookingCancelReason: item.bookingCancelReason,
            bookingCancelDateTime: item.bookingCancelDateTime,
            actions: (
              <div>
                <FontAwesomeIcon
                  icon={faEye}
                  className="mx-3"
                  // onClick={() => navigateDetails1(item.serviceLocation)}
                />
              </div>
            ),
          }));
          setJsonData(data);
        } catch (error) {
          console.error(error);
        }
      };
      const handleChange = (event, newValue) => {
        setValue(newValue);
      };
    
      useEffect(() => {
        getConsultant();
        getVendorDetails();
        // getVendorDetails();
      }, []);  
  
      const getVendorDetails = async () => {
        const token1 = localStorage.getItem("token1");
        const accessToken = localStorage.getItem("accessToken");
        // const navigate = useNavigate(); // if using react-router-dom for navigation
      
        try {
          const requestBody = {
            latLong: "20.8009246,70.6960306",
            radius: "3000000000",
            serviceId: "66459e48bba1c398c8b80ea6",
            find: {
              serviceType: {
                $elemMatch: {
                  serviceId: "66459e48bba1c398c8b80ea6"
                }
              }
            }
          };
      
          const res = await axios.post(
            `https://pets.dev.savaapi.com/api/custom-api/dev1/clinic/vendor-within-radius`,
            requestBody,
            {
              headers: {
                "x-am-authorization": token1,
                "x-am-user-authorization": accessToken,
              },
            }
          );
      
          const data = res.data?.data?.map((item) => {
            const personalDetails = item.serviceType[0]?.personalDetails || {};
            const businessName = item.serviceType[0]?.businessName || '';
      
            return {
              pName: personalDetails.pName,
              pMobile: personalDetails.pMobile,
              businessName: businessName,
              actions: (
                <div>
                <FontAwesomeIcon
                    icon={faEye}
                    onClick={() => navigateDetails(item.personalDetails, item.serviceType, item)}
                />
            </div>
            
              ),
            };
          });
          setJsonData1(data.reverse());
        } catch (error) {
          console.error(error);
        }
      };
  return (
    <>
    <Card border="light" className="bg-white shadow-sm mb-4">
    <Card.Body>
      <h4 style={{ marginBottom: "40px" }}>
      Pet Insurance
      </h4>
      <div>
        <TabContext value={value}>
          <TabList style={tabListStyles} onChange={handleChange}>
            <Tab
              style={
                value === "1" ? { ...tabStyles, ...activeTabStyles } : tabStyles
              }
              label="Order"
              value="1"
            />
            <Tab
              style={
                value === "2" ? { ...tabStyles, ...activeTabStyles } : tabStyles
              }
              label="Vendor"
              value="2"
            />
          </TabList>
          <TabPanel value="2">
           
            <MaterialReactTable
              autoResetPageIndex={false}
              columns={columns2}
              data={jsonData1}
              enableRowOrdering
              enableSorting={false}
              muiTableBodyRowDragHandleProps={({ table }) => ({
                onDragEnd: () => {
                  const { draggingRow, hoveredRow } = table.getState();
                  if (hoveredRow && draggingRow) {
                    jsonData1.splice(
                      hoveredRow.index,
                      0,
                      jsonData1.splice(draggingRow.index, 1)[0]
                    );
                    setJsonData1([...jsonData1]);
                    console.log("new jsonData", jsonData1);
                    let position_data = {
                      Offer_id: [],
                      position: [],
                    };
                    jsonData1.forEach((element, index) => {
                      position_data.Offer_id.push(element._id);
                      position_data.position.push(index + 1);
                    });
                  }
                },
              })}
            />
          </TabPanel>
          <TabPanel value="1">
            <div style={{ marginTop: "20px" }}>
            
            </div>
            <MaterialReactTable
              autoResetPageIndex={false}
              columns={columns1}
              data={jsonData}
              enableRowOrdering
              enableSorting={false}
              muiTableBodyRowDragHandleProps={({ table }) => ({
                onDragEnd: () => {
                  const { draggingRow, hoveredRow } = table.getState();
                  if (hoveredRow && draggingRow) {
                    table.setData((old) => {
                      const newData = [...old];
                      const [removed] = newData.splice(draggingRow.index, 1);
                      newData.splice(hoveredRow.index, 0, removed);
                      return newData;
                    });
                  }
                },
              })}
            />
          </TabPanel>
        </TabContext>
      </div>
    </Card.Body>
  </Card>
    </>
  )
}

export default PetInsurance