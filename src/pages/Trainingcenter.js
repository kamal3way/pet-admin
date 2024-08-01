import React, { useState, useEffect, useMemo } from "react";
import axios from "axios";
import { useHistory } from "react-router-dom";
import { Card } from "@themesberg/react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye } from "@fortawesome/free-solid-svg-icons";
import { MaterialReactTable } from "material-react-table";
import Tab from "@mui/material/Tab";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import TabPanel from "@mui/lab/TabPanel";
import DownloadExcelButton from "./downloadExel";

export const Trainingcenter = () => {
  const [jsonData, setJsonData] = useState([]);
  const [jsonData1, setJsonData1] = useState([]);
  const [value, setValue] = useState("1");
  const history = useHistory();

  const columns1 = useMemo(
    () => [
      { accessorKey: "uName", header: "NAME" },
      { accessorKey: "uMobile", header: "MOBILE" },
      { accessorKey: "bookingPurpose", header: "BOOKING PURPOSE" },
      { accessorKey: "bookingConcern", header: "BOOKING CONCERN" },
      { accessorKey: "bookingFromDate", header: "FROM DATE" },
      { accessorKey: "bookingToDate", header: "TO DATE" },
      { accessorKey: "bookingTimeSlot", header: "TIME SLOT" },
      { accessorKey: "paymentType", header: "PAYMENT TYPE" },
      { accessorKey: "bookingStatus", header: "BOOKING STATUS" },
      { accessorKey: "bookingCancelReason", header: "CANCEL REASON" },
      { accessorKey: "actions", header: "ACTION" },
    ],
    []
  );

  const colvendor = useMemo(
    () => [
      { accessorKey: "pName", header: "Name" },
      { accessorKey: "pMobile", header: "Mobile" },
      { accessorKey: "businessName", header: "BUSINESS NAME" },
      { accessorKey: "actions", header: "Actions" },
    ],
    []
  );

  useEffect(() => {
    if (value === "1") {
      getTrainingcenter();
    } else if (value === "2") {
      getVendorDetails();
    }
  }, [value]);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

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

  const getTrainingcenter = async () => {
    const token1 = localStorage.getItem("token1");
    const accessToken = localStorage.getItem("accessToken");
    try {
      let res = await axios.get(
        `https://pets.dev.savaapi.com/api/schema/dev1/mongodb/pets/training_center_bookings`,
        {
          headers: {
            "x-am-authorization": token1,
            "x-am-user-authorization": accessToken,
          },
          params: {
            deep: "userId",
          },
        }
      );
      const data = res.data?.data?.map((item) => ({
        uName: item.userId.uName,
        uMobile: item.userId.uMobile,
        bookingPurpose: item.bookingPurpose,
        bookingConcern: item.bookingConcern,
        bookingFromDate: formatDate(item.bookingFromDate),
        bookingToDate: formatDate(item.bookingToDate),
        bookingTimeSlot: item.bookingTimeSlot,
        paymentType: item.paymentDetails.paymentType,
        bookingStatus: item.bookingStatus,
        bookingCancelReason: item.bookingCancelReason,
        actions: (
          <div>
            <FontAwesomeIcon
              icon={faEye}
              onClick={() =>
                navigateDetails1(item.service, item.serviceLocation)
              }
            />
          </div>
        ),
      }));
      setJsonData(data);
    } catch (error) {
      console.error(error);
    }
  };

  const getVendorDetails = async () => {
    const token1 = localStorage.getItem("token1");
    const accessToken = localStorage.getItem("accessToken");
    // const navigate = useNavigate(); // if using react-router-dom for navigation

    try {
      const requestBody = {
        latLong: "20.8009246,70.6960306",
        radius: "3000000000",
        serviceId: "664eedbcbba1c398c8b892a7",
        find: {
          serviceType: {
            $elemMatch: {
              serviceId: "664eedbcbba1c398c8b892a7",
            },
          },
        },
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
        const businessName = item.serviceType[0]?.businessName || "";

        return {
          pName: personalDetails.pName,
          pMobile: personalDetails.pMobile,
          businessName: businessName,
          actions: (
            <div>
              <FontAwesomeIcon
                icon={faEye}
                onClick={() => navigateDetails(item.serviceType)}
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
  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "short", day: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const navigateDetails1 = (service, serviceLocation) => {
    console.log("234567", serviceLocation);
    history.push({
      pathname: `/Trainingdetail`,
      state: { service, serviceLocation },
    });
  };
  const navigateDetails = (serviceType) => {
    console.log("234567", serviceType);
    history.push({
      pathname: "/Trainingvenderdetail",
      state: { serviceType },
    });
  };

  return (
    <Card border="light" className="bg-white shadow-sm mb-4">
      <Card.Body>
        <h4 style={{ marginBottom: "40px" }}>Training Center</h4>

        <div>
          <DownloadExcelButton jsonData={jsonData} fileName="Trainind center" />
        </div>
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

          <TabPanel value="1">
            <MaterialReactTable
              autoResetPageIndex={false}
              columns={columns1}
              data={jsonData}
              enableRowOrdering
              enableSorting={false}
            />
          </TabPanel>
          <TabPanel value="2">
            <MaterialReactTable
              autoResetPageIndex={false}
              columns={colvendor}
              data={jsonData1}
              enableRowOrdering
              enableSorting={false}
            />
          </TabPanel>
        </TabContext>
      </Card.Body>
    </Card>
  );
};

export default Trainingcenter;
