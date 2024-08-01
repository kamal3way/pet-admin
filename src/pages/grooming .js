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

export const Grooming = () => {
  const [jsonData, setJsonData] = useState([]);
  const [value, setValue] = useState("1");
  const onEditCloseModal = () => setEditOpen(false)
  const [Editopen, setEditOpen] = useState(false);
  const [editData, setEditData] = useState({});
  const [services, setServices] = useState([]);
  const [jsonData1, setJsonData1] = useState([]);
  const [selectedService, setSelectedService] = useState("");

  const columns1 = useMemo(
    () => [
      { accessorKey: "userName", header: "USER NAME" },
      { accessorKey: "serviceTitle", header: "SERVICE TITLE" },
      { accessorKey: "serviceDescription", header: "SERVICE DESCRIPTION" },
      { accessorKey: "serviceCharge", header: "SERVICE CHARGE" },
      { accessorKey: "bookingPurpose", header: "BOOKING PURPOSE" },
      { accessorKey: "bookingDate", header: "BOOKING DATE" },
      { accessorKey: "bookingTimeSlot", header: "BOOKING TIME SLOT" },
      { accessorKey: "paymentMethod", header: "PAYMENT METHOD" },
      { accessorKey: "paymentType", header: "PAYMENT TYPE" },
      { accessorKey: "bookingStatus", header: "BOOKING STATUS" },
      { accessorKey: "bookingCancelReason", header: "BOOKING CANCEL REASON" },
      { accessorKey: "actions", header: "ACTIONS" },
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

  const handleSubmit = (values) => {
    // updateBook(editData._id, values);
  };

  // useEffect(() => {
  //   if (value === "1") {
  //     getGrooming();
  //   } else if (value === "2") {
  //     handleServiceChange({ target: { value: selectedService } });
  //   }
  // }, [value, selectedService]);

  const history = useHistory();
  // const navigateDetails = (item) => {
  //   console.log("itemitem", item);
  //   history.push({
  //     pathname: "/PreparingFor",
  //     state: {item}
  //   });
  // };
  const navigateDetails = (personalDetails, serviceType, items) => {
    console.log("Navigating to Groomingdetails with:", { personalDetails, serviceType, items });
    history.push({
      pathname: "/Groomingdetails",
      state: { personalDetails, serviceType, items },
    });
};

  

  const navigateDetails1 = (serviceLocation) => {
    console.log("itemitem", serviceLocation);
    history.push({
      pathname: "/Groomingdetail",
      state: {serviceLocation}
    });
  };

  const formatDate = (isoString) => {
    const date = new Date(isoString);
    const options = {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    };

    const parts = new Intl.DateTimeFormat('en-GB', options).formatToParts(date);
    const day = parts.find(part => part.type === 'day').value;
    const month = parts.find(part => part.type === 'month').value;
    const year = parts.find(part => part.type === 'year').value;
    const hour = parts.find(part => part.type === 'hour').value;
    const minute = parts.find(part => part.type === 'minute').value;
    const dayPeriod = parts.find(part => part.type === 'dayPeriod').value.toUpperCase();

    return `${day}-${month}-${year} ${hour}:${minute} ${dayPeriod}`;
  };

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  useEffect(() => {
    getGrooming();
    getPetServices();
    getVendorDetails();
  }, []);

  const getVendorDetails = async () => {
    const token1 = localStorage.getItem("token1");
    const accessToken = localStorage.getItem("accessToken");
    // const navigate = useNavigate(); // if using react-router-dom for navigation
  
    try {
      const requestBody = {
        latLong: "20.8009246,70.6960306",
        radius: "3000000000",
        serviceId: "65f94c47489020ecc8cda9d7",
        find: {
          serviceType: {
            $elemMatch: {
              serviceId: "65f94c47489020ecc8cda9d7"
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

  const getPetServices = async () => {
    const token1 = localStorage.getItem("token1");
    const accessToken = localStorage.getItem("accessToken");
    try {
      const res = await axios.get(
        `https://pets.dev.savaapi.com/api/schema/dev1/mongodb/pets/pet_services`,
        {
          headers: {
            "x-am-authorization": token1,
            "x-am-user-authorization": accessToken
            ,
          },
        }
      );

      const data = res.data?.data?.map((item) => ({
        _id: item._id,
        name: item.serviceName,
        category: item.serviceCategory,
        img: item.serviceImg,
      }));

      setServices(data);
    } catch (error) {
      console.error(error);
    }
  };

  const getGrooming = async () => {
    const token1 = localStorage.getItem("token1");
    const accessToken = localStorage.getItem("accessToken");
    try {
      const res = await axios.get(
        `https://pets.dev.savaapi.com/api/schema/dev1/mongodb/pets/grooming_service_bookings`,
        {
          headers: {
            "x-am-authorization": token1,
            "x-am-user-authorization": accessToken,
          },
          params: {
            limit: 1000,
            deep: 'userId',
            getTotalCount: false,
          }
        }
      );
      const data = res.data?.data?.map((item) => ({
        userName: item.userId?.uName,
        serviceTitle: item.service?.[0]?.serviceTitle,
        serviceDescription: item.service?.[0]?.serviceDescription,
        serviceCharge: item.service?.[0]?.serviceCharge,
        bookingPurpose: item.bookingPurpose,
        bookingDate: item.bookingDate,
        bookingTimeSlot: item.bookingTimeSlot,
        // bookingDate: formatDate(item.bookingDate),
        // bookingTimeSlot: formatDate(item.bookingTimeSlot),
        paymentMethod: item.paymentDetails[0]?.paymentMethod,
        paymentType: item.paymentDetails[0]?.paymentType,
        bookingStatus: item.bookingStatus,
        bookingCancelReason: item.bookingCancelReason,
        actions: (
          <div>
            <FontAwesomeIcon
              icon={faEye}
              className="mx-3"
            onClick={() => navigateDetails1(item.serviceLocation)}
            />
          </div>
        ),
      }));
      setJsonData(data);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Card border="light" className="bg-white shadow-sm mb-4">
      <Card.Body>
        <h4 style={{ marginBottom: "40px" }}>
          Grooming & Spa
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
              {/* <div style={{ marginBottom: "20px" }}>
                <select
                  id="serviceDropdown"
                  value={selectedService}
                  onChange={handleServiceChange}
                  style={{
                    width: "180px",
                    marginLeft: "710px",
                    height: "35px",
                    backgroundColor: "#f9f9f9",
                    borderColor: "#ccc",
                    borderRadius: "5px",
                    fontSize: "16px",
                    color: "#333",
                    marginTop:"-160px",
                    position:"absolute"
                  }}
                >
                  <option value="" disabled>
                    Select a service
                  </option>
                  {services.map((service) => (
                    <option key={service._id} value={service._id}>
                      {service.name}
                    </option>
                  ))}
                </select>
              </div> */}
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
                <b>
                  {/* {/ <h4 style={{ fontFamily: "inherit", marginTop: '-30px' }}>Grooming Detail</h4> /} */}
                </b>
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
  );
};

export default Grooming;
