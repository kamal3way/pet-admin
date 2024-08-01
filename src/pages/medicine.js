import React, { useState, useEffect, useMemo } from "react";
import moment from "moment-timezone";
import Datetime from "react-datetime";
import {
  Col,
  Row,
  Card,
  Form,
  Button,
  InputGroup,
} from "@themesberg/react-bootstrap";
import { FieldArray } from "formik";
import { MDBDataTable } from "mdbreact";
import TimePicker from "react-time-picker";
import "react-time-picker/dist/TimePicker.css";
import { faClock } from "@fortawesome/free-solid-svg-icons";
import { Formik, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import axios from "axios";
import Swal from "sweetalert2";
import "react-responsive-modal/styles.css";
import { Modal } from "react-responsive-modal";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faTrash, faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import DownloadExcelButton from "./downloadExel";
// import { MDBDataTable } from "mdbreact";
import { useLocation } from "react-router-dom";
import { faEye, faPlus } from "@fortawesome/free-solid-svg-icons";
import { useHistory } from "react-router-dom";
import { MaterialReactTable } from "material-react-table";
import Select from "react-select";
import Tab from "@mui/material/Tab";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import TabPanel from "@mui/lab/TabPanel";
import ReactLogo from "../assets/img/technologies/loading-loader-svgrepo-com.svg";
import { Image } from "@themesberg/react-bootstrap";

export const Medicine = () => {
  const [jsonData,setJsonData] = useState ({});
  const [value, setValue] = useState("1");
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
  const handleChange = (event, newValue) => {
    console.log("🚀  handleChange  newValue:", newValue);
    if (newValue === "2") {
      getVetServices();
    } else {
      // gettraningcenter();
    }
    setValue(newValue);
  };

  const columns = useMemo(
    () => [
      { accessorKey: "orderSubTotal", header: "ORDER SUB TOTAL" },
      { accessorKey: "orderTax", header: "ORDER TAX" },
      { accessorKey: "orderTotal", header: "ORDER TOTAL" },
      { accessorKey: "orderQty", header: "ORDER QTY" },
      { accessorKey: "orderStatus", header: "ORDER STATUS" },
      { accessorKey: "paymentType", header: "PAYMENT TYPE" },
      { accessorKey: "orderDate", header: "ORDER DATE" },
 
    
    ],
    []
  );

useEffect (() =>{
  getVetServices();
}
)
useEffect(() => {
  if (value === "1") {
    getVetServices();
  } else if (value === "2") {
    // gettraningcenter();
  }
}, [value]);

const getVetServices = async () => {
  const token1 = localStorage.getItem("token1");
  const accessToken = localStorage.getItem("accessToken");
  try {
    let res = await axios.get(
      `https://pets.dev.savaapi.com/api/schema/dev1/mongodb/pets/medicine_orders`,
      {
        headers: {
          "x-am-authorization": token1,
          "x-am-user-authorization": accessToken,
        },
      }
    );
    const data = res.data?.data?.map((item, index) => {
      return {
        orderSubTotal: item.orderSubTotal,
        orderTax: item.orderTax,
        orderTotal: item.orderTotal,
        orderQty: item.orderQty,
        orderStatus: item.orderStatus,
        paymentType: item.paymentType,
        orderDate: item.orderDate,
    
      
       
        actions: (
          <div>
            {/* <FontAwesomeIcon
              icon={faTrash}
              className="mx-3"
              onClick={() => handleDelete(item._id)}
            />
            <FontAwesomeIcon
              icon={faEdit}
              className="mx-3"
              onClick={() => handleEdit(item)}
            /> */}
          </div>
        ),
      };
    });
    // setDatatable1((prevState) => ({
    //   ...prevState,
    //   rows: data,
    // }));
    setJsonData(res.data?.data);
  } catch (error) {
    console.error(error);
  }
};
  return (
    <Card border="light" className="bg-white shadow-sm mb-4">
      <Card.Body>
    <TabContext value={value}>
    <TabList style={tabListStyles} onChange={handleChange}>

      <Tab
        style={
          value === "1" ? { ...tabStyles, ...activeTabStyles } : tabStyles
        }
        label="Vendor"
        value="1"
      />
      {/* <Tab
        style={
          value === "2" ? { ...tabStyles, ...activeTabStyles } : tabStyles
        }
        label="Vendor"
        value="2"
      /> */}
    </TabList>


    <TabPanel value="1">

      {/* <button className="btn btn-primary " onClick={onOpenModal}>
        Add Product
        <FontAwesomeIcon icon={faPlus} className="mx-2" />
      </button> */}

      {/* <b><h3 style={{ fontFamily: "initial" }}>Product</h3></b> */}
    <h4>Medicine_Orders</h4>
    <MaterialReactTable
              autoResetPageIndex={false}
              columns={columns}
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
    <TabPanel value="1">

     

      {/* <MDBDataTable striped bordered small data={datatable} /> */}

    </TabPanel>
  </TabContext>
  </Card.Body>
  </Card>
  )
}
