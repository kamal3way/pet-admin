import React, { useState, useEffect, useMemo } from "react";
import { Card } from "@themesberg/react-bootstrap";
import { MaterialReactTable } from "material-react-table";
import Tab from "@mui/material/Tab";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import TabPanel from "@mui/lab/TabPanel";
import axios from "axios";
import { useHistory } from "react-router-dom";

export const Adoptioncenter = () => {
  const [complaintData, setComplaintData] = useState([]);
  const [vendorData, setVendorData] = useState([]);
  const [value, setValue] = useState("1");
  const history = useHistory();

  const handleChange = (event, newValue) => {
    setValue(newValue);
    if (newValue === "1") {
      getComplaintData();
    } else if (newValue === "2") {
      getVendorData();
    }
  };

  const complaintColumns = useMemo(
    () => [
      { accessorKey: "vendorName", header: "NAME" },
      { accessorKey: "vendoruMobile", header: "MOBILE" },
      { accessorKey: "vendorEmail", header: "EMAIL" },
      { accessorKey: "complainType", header: "COMPLAINT TYPE" },
      { accessorKey: "complainMessage", header: "COMPLAINT MESSAGE" },
      {
        accessorKey: "complainImg",
        header: "COMPLAINT IMAGE",
        Cell: ({ cell }) => (
          <img
            src={cell.getValue()}
            alt="Complaint"
            style={{ width: "50px", height: "50px", borderRadius: "50%" }}
          />
        ),
      },
    ],
    []
  );

  const vendorColumns = useMemo(
    () => [
      { accessorKey: "uName", header: "NAME" },
      { accessorKey: "uMobile", header: "MOBILE" },
      { accessorKey: "petName", header: "PET NAME" },
      { accessorKey: "petType", header: "PET TYPE" },
      { accessorKey: "petAge", header: "PET AGE" },
      { accessorKey: "petWeight", header: "PET WEIGHT" },
      { accessorKey: "petGender", header: "PET GENDER" },
      {
        accessorKey: "petImage",
        header: "PET IMAGE",
        Cell: ({ cell }) => (
          <img
            src={cell.getValue()}
            alt="Pet"
            style={{ width: "50px", height: "50px", borderRadius: "50%" }}
          />
        ),
      },
      {
        accessorKey: "address",
        header: "ADDRESS",
        Cell: ({ cell }) => (
          <div>
            <div>
              {cell.getValue().buildingName}, {cell.getValue().landmark},
            </div>
            <div>
              {cell.getValue().city}, {cell.getValue().state},{" "}
              {cell.getValue().pinCode}
            </div>
          </div>
        ),
      },
    ],
    []
  );

  const getComplaintData = async () => {
    const token1 = localStorage.getItem("token1");
    const accessToken = localStorage.getItem("accessToken");
    try {
      const res = await axios.post(
        `https://pets.dev.savaapi.com/api/schema/dev1/mongodb/pets/pet_adoption_complaints/query`,
        {
          deep: "vendorId",
        },
        {
          headers: {
            "x-am-authorization": token1,
            "x-am-user-authorization": accessToken,
          },
        }
      );

      const data = res.data.data.map((item) => ({
        vendorName: item.vendorId.uName,
        vendoruMobile: item.vendorId.uMobile,
        vendorEmail: item.vendorId.uEmail,
        complainType: item.complainType,
        complainMessage: item.complainMessage,
        complainImg: item.complainImg,
      }));
      setComplaintData(data);
    } catch (error) {
      console.error(error);
    }
  };

  const getVendorData = async () => {
    const token1 = localStorage.getItem("token1");
    const accessToken = localStorage.getItem("accessToken");
    try {
      const res = await axios.post(
        `https://pets.dev.savaapi.com/api/schema/dev1/mongodb/pets/pet_adoption_inquiries/query`,
        {
          find: {
            isAdopted: false,
          },
          deep: "petId,adoptReqUserDetails.adoptReqUserId,vendorId,petId.petType",
        },
        {
          headers: {
            "x-am-authorization": token1,
            "x-am-user-authorization": accessToken,
          },
        }
      );

      const data = res.data.data.map((item) => ({
        uMobile: item.adoptReqUserDetails[0]?.adoptReqUserId.uMobile,
        uName: item.adoptReqUserDetails[0]?.adoptReqUserId.uName,
        petName: item.petId.petName,
        petAge: item.petId.petAge,
        petWeight: item.petId.petWeight,
        petGender: item.petId.petGender,
        petType: item.petId.petType.petType,
        petImage: item.petId.petType.petImage,
        address: item.petId.address,
      }));
      setVendorData(data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getComplaintData();
    getVendorData();
  }, []);

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
        <div>
          <TabContext value={value}>
            <TabList style={tabListStyles} onChange={handleChange}>
              <Tab
                style={
                  value === "1" ? { ...tabStyles, ...activeTabStyles } : tabStyles
                }
                label="User Complaint"
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
                columns={complaintColumns}
                data={complaintData}
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
            <TabPanel value="2">
              <MaterialReactTable
                autoResetPageIndex={false}
                columns={vendorColumns}
                data={vendorData}
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

export default Adoptioncenter;
