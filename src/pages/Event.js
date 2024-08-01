import React, { useState, useEffect, useMemo } from "react";
import { Card } from "@themesberg/react-bootstrap";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye } from "@fortawesome/free-solid-svg-icons";
import { useHistory } from "react-router-dom";
import { MaterialReactTable } from "material-react-table";
import Tab from "@mui/material/Tab";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import TabPanel from "@mui/lab/TabPanel";
import {
  Col,
  Row,
  Form,
  Button,
  InputGroup,
} from "@themesberg/react-bootstrap";
import { Formik } from "formik";
import * as Yup from "yup";

export const Event = () => {
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
      { accessorKey: "pEmail", header: "Email" },
      { accessorKey: "businessName", header: "BUSINESS NAME" },
      { accessorKey: "actions", header: "Actions" },
    ],
    []
  );

  const tabListStyles = {
    display: "flex",
    justifyContent: "flex-start", // Change to 'flex-start' to align left
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

  const history = useHistory();
  const navigateDetails = (personalDetails, serviceType) => {
    console.log("serviceType", serviceType);
    history.push({
      pathname: "/Eventdetails",
      state: { personalDetails, serviceType }
    });
  };

  const navigateDetails1 = (serviceLocation) => {
    console.log("serviceLocation", serviceLocation);
    history.push({
      pathname: "/Subcategory",
      state: { serviceLocation }
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
    try {
      const requestBody = {
        latLong: "20.8009246,70.6960306",
        radius: "3000000000",
        serviceId: "65f94c47489020ecc8cda9dc",
        find: {
          serviceType: {
            $elemMatch: {
              serviceId: "65f94c47489020ecc8cda9dc"
            }
          }
        }
      };

      const res = await axios.post(
        "https://pets.dev.savaapi.com/api/custom-api/dev1/clinic/vendor-within-radius",
        requestBody,
        {
          headers: {
            "x-am-authorization": token1,
            "x-am-user-authorization": accessToken,
          },
        }
      );

      const data = res.data?.data?.map((item) => ({
        pName: item.serviceType[0]?.personalDetails?.pName,
        pMobile: item.serviceType[0]?.personalDetails?.pMobile,
        pEmail: item.serviceType[0]?.personalDetails?.pEmail,
        businessName: item.serviceType[0]?.businessName,
        actions: (
          <div>
            <FontAwesomeIcon
              icon={faEye}
              onClick={() => navigateDetails(item.serviceType[0]?.personalDetails, item.serviceType)}
            />
          </div>
        ),
      }));
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
        "https://pets.dev.savaapi.com/api/schema/dev1/mongodb/pets/pet_services",
        {
          headers: {
            "x-am-authorization": token1,
            "x-am-user-authorization": accessToken,
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
        "https://pets.dev.savaapi.com/api/schema/dev1/mongodb/pets/grooming_service_bookings",
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
        paymentMethod: item.paymentDetails[0]?.paymentMethod,
        paymentType: item.paymentDetails[0]?.paymentType,
        bookingStatus: item.bookingStatus,
        bookingCancelReason: item.bookingCancelReason,
        actions: (
          <div>
            <FontAwesomeIcon
              icon={faEye}
              onClick={() => {
                setEditOpen(true);
                setEditData(item);
              }}
            />
          </div>
        ),
      }));
      setJsonData(data.reverse());
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>
      <Row>
        <Col>
          <Formik
            initialValues={{
              serviceId: "",
            }}
            validationSchema={Yup.object().shape({
              serviceId: Yup.string().required("Service is required"),
            })}
            onSubmit={async (values) => {
              setSelectedService(values.serviceId);
              await getVendorDetails(values.serviceId);
            }}
          >
            {({
              handleSubmit,
              handleChange,
              handleBlur,
              values,
              touched,
              errors,
            }) => (
              <Form className="mb-4" onSubmit={handleSubmit}>
                {/* <Row>
                  <Col md="6" className="mb-3">
                    <Form.Group id="serviceId">
                      <Form.Label>Service Name</Form.Label>
                      <InputGroup>
                        <Form.Control
                          as="select"
                          name="serviceId"
                          value={values.serviceId}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          isInvalid={touched.serviceId && !!errors.serviceId}
                        >
                          <option value="">Select Service</option>
                          {services.map((service) => (
                            <option key={service._id} value={service._id}>
                              {service.name}
                            </option>
                          ))}
                        </Form.Control>
                        <Form.Control.Feedback type="invalid">
                          {errors.serviceId}
                        </Form.Control.Feedback>
                      </InputGroup>
                    </Form.Group>
                  </Col>
                  <Col md="6" className="mb-3 d-flex align-items-end">
                    <Button variant="primary" type="submit">
                      Submit
                    </Button>
                  </Col>
                </Row> */}
              </Form>
            )}
          </Formik>
        </Col>
      </Row>

      <TabContext value={value}>
        <div style={tabListStyles}>
          <TabList onChange={handleChange}>
            <Tab
              label="Order"
              value="1"
              style={{
                ...tabStyles,
                ...(value === "1" ? activeTabStyles : {}),
              }}
            />
            <Tab
              label="Vendor"
              value="2"
              style={{
                ...tabStyles,
                ...(value === "2" ? activeTabStyles : {}),
              }}
            />
          </TabList>
        </div>
        <TabPanel value="1">
          <Card>
            <MaterialReactTable columns={columns1} data={jsonData} />
          </Card>
        </TabPanel>
        <TabPanel value="2">
          <Card>
            <MaterialReactTable columns={columns2} data={jsonData1} />
          </Card>
        </TabPanel>
      </TabContext>
    </div>
  );
};

export default Event;
