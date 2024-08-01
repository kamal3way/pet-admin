import React, { useState, useEffect, useMemo } from "react";
import axios from "axios";
import { Card } from "@themesberg/react-bootstrap";
import { MaterialReactTable } from "material-react-table";
import Tab from "@mui/material/Tab";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import TabPanel from "@mui/lab/TabPanel";
import DownloadExcelButton from "./downloadExel";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye } from "@fortawesome/free-solid-svg-icons";
import { useHistory } from "react-router-dom";

export const Vetservices = () => {
  const [jsonData, setJsonData] = useState([]);
  const [jsonData1, setJsonData1] = useState([]);
  const [value, setValue] = useState("2"); 

  const columns = useMemo(
    () => [
      { accessorKey: "uName", header: "Name" },
      { accessorKey: "uMobile", header: "Mobile" },
      { accessorKey: "serviceAt", header: "SERVICE AT" },
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

  const columns1 = useMemo(
    () => [
      { accessorKey: "pName", header: "Name" },
      { accessorKey: "pMobile", header: "Mobile" },
      { accessorKey: "businessName", header: "BUSINESS NAME" },
      { accessorKey: "actions", header: "Actions" },
    ],
    []
  );

  const history = useHistory();
  const navigateDetails = (personalDetails, serviceType, items) => {
    console.log("234567", items);
    history.push({
        pathname: "/Vetservicedetails",
        state: { personalDetails, serviceType, items }
    });
};

  const navigateDetails1 = (serviceLocation) => {
    console.log("serviceLocation",serviceLocation);
    history.push({
      pathname: "/Vetservicedetail",
      state: {serviceLocation }
    });
  };
  useEffect(() => {
    getVetServices();
    getVendorDetails();
  }, []);

  const handleChange = (event, newValue) => {
    setValue(newValue);
    if (newValue === "1") {
      getVetServices();
    }
  };

  const getVetServices = async () => {
    const token1 = localStorage.getItem("token1");
    const accessToken = localStorage.getItem("accessToken");
    try {
      const res = await axios.get(
        `https://pets.dev.savaapi.com/api/schema/dev1/mongodb/pets/vet_service_bookings?deep=userId`,
        {
          headers: {
            "x-am-authorization": token1,
            "x-am-user-authorization": accessToken,
          },
        }
      );

      const data = res.data?.data?.map((item) => {
        return {
          uMobile: item.userId.uMobile,  
          uName: item.userId.uName,     
          serviceAt: item.serviceAt,
          serviceCharge: item.serviceCharge,
          bookingPurpose: item.bookingPurpose,
          bookingDate: new Date(item.bookingDate).toLocaleDateString(),
          bookingTimeSlot: item.bookingTimeSlot,
          paymentMethod: item.paymentDetails.paymentMethod, 
          paymentType: item.paymentDetails.paymentType,   
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
        };
      });
      setJsonData(data.reverse());
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
        serviceId: "65f94c47489020ecc8cda9d6",
        find: {
          serviceType: {
            $elemMatch: {
              serviceId: "65f94c47489020ecc8cda9d6"
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

  return (
    <Card border="light" className="bg-white shadow-sm mb-4">
      <Card.Body>
        <h4 style={{ marginBottom: "-10px" }}>Vet Services</h4>
        <div style={{marginLeft:"83%"}}>
          <DownloadExcelButton jsonData={jsonData} fileName="Vet services"/>
        </div>

        <TabContext value={value}>
          <TabList style={tabListStyles} onChange={handleChange}>
            <Tab
              style={value === "1" ? { ...tabStyles, ...activeTabStyles } : tabStyles}
              label="Order"
              value="1"
            />
            <Tab
              style={value === "2" ? { ...tabStyles, ...activeTabStyles } : tabStyles}
              label="Vendor"
              value="2"
            />
          </TabList>

          <TabPanel value="1">
            <MaterialReactTable
              autoResetPageIndex={false}
              columns={columns}
              data={jsonData}
              enableRowOrdering
              enableSorting={false}
              muiTableBodyRowDragHandleProps={({ table }) => ({
                onDragEnd: () => {
                  const state = table.getState();
                  if (state && state.draggingRow && state.hoveredRow) {
                    const { draggingRow, hoveredRow } = state;
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

          <TabPanel value="2">
            <MaterialReactTable
              autoResetPageIndex={false}
              columns={columns1}
              data={jsonData1}
              enableRowOrdering
              enableSorting={false}
              muiTableBodyRowDragHandleProps={({ table }) => ({
                onDragEnd: () => {
                  const state = table.getState();
                  if (state && state.draggingRow && state.hoveredRow) {
                    const { draggingRow, hoveredRow } = state;
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
      </Card.Body>
    </Card>
  );
};
