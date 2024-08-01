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
import { faEdit, faTrash, faPlus } from "@fortawesome/free-solid-svg-icons";
import DownloadExcelButton from "./downloadExel";
// import { MDBDataTable } from "mdbreact";
import { useLocation } from "react-router-dom";
import { faEye } from "@fortawesome/free-solid-svg-icons";
import { useHistory } from "react-router-dom";
import { MaterialReactTable } from "material-react-table";
import Select from "react-select";
import Tab from "@mui/material/Tab";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import TabPanel from "@mui/lab/TabPanel";
import ReactLogo from "../assets/img/technologies/loading-loader-svgrepo-com.svg";
import { Image } from "@themesberg/react-bootstrap"

export const Petfriendly = () => {
  const [open, setOpen] = useState(false);
  const onOpenModal = () => setOpen(true);
  const onCloseModal = () => setOpen(false);

  const [updatedBookData, setUpdatedBookData] = useState(null);
  const handleSubmit = (values) => {

  };

  // edit model
  const [Editopen, setEditOpen] = useState(false);
  const onEditOpenModal = () => setEditOpen(true);
  const onEditCloseModal = () => setEditOpen(false);
  const [EditOfferopen, setEditOfferOpen] = useState(false);
  const onEditOpenOfferModal = () => setEditOfferOpen(true);
  const onEditCloseOfferModal = () => setEditOfferOpen(false);
  const [jsonData, setJsonData] = useState([]);
  const [SubscriptionData, setMySubscriptionData] = useState([]);
  const [code, setCode] = useState("");
  const [discountPrize, setDiscountPrize] = useState(0);
  const [value, setValue] = useState("1");
  const [myData, setMyData] = useState({
    category: "",
    placeName: "",
    mainImg: "",
    addressInfo: "",
    openHours: "",
    terms: "",
    rating: "",
  });
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const id = queryParams.get("id");
  useEffect(() => {
    if (value === "1") {
      getpetfriendly();
    } else if (value === "2") {
      // gettraningcenter();
    }
  }, [value]);
  const [isError, setIsError] = useState("");
  const [isLoadingData, setIsLoadingData] = useState(true);

  const [editData, setEditData] = useState({});
  const [editOfferData, setEdiOfferData] = useState({});
  // const history = useHistory();
  useEffect(() => {
    getpetfriendly();

  }, []);

  const columns = useMemo(
    () => [
      { accessorKey: "placeName", header: "PLACE NAME " },
      // { accessorKey: "placeName", header: "placeName" },
      { accessorKey: "mainImg", header: "MAIN IMG" },
      { accessorKey: "addressInfo", header: "ADDRESS INFO" },

      // { accessorKey: "openHours", header: "openHours" },
      { accessorKey: "terms", header: "TERMS" },

      // { accessorKey: "actions", header: "ACTIONS" },
    ],
    []
  );

  const columns1 = useMemo(
    () => [
      { accessorKey: "placeName", header: "PLACE NAME " },
      // { accessorKey: "placeName", header: "placeName" },
      { accessorKey: "mainImg", header: "MAIN IMG" },
      { accessorKey: "addressInfo", header: "ADDRESS INFO" },

      // { accessorKey: "openHours", header: "openHours" },
      { accessorKey: "terms", header: "TERMS" },

      { accessorKey: "actions", header: "ACTIONS" },
    ],
    []
  );
  const handleEdit = (data) => {
    setEditData(data);
    setEditOpen(true);
  };
  const handleChange = (event, newValue) => {
    console.log("🚀  handleChange  newValue:", newValue);
    if (newValue === "1") {
      getpetfriendly();
    } else {
     
    }
    setValue(newValue);
  };

  useEffect(() => {
    if (value === "1") {
      // getOrderdetail();
    } else if (value === "2") {
      getpetfriendly();
    }
  }, [value]);
  // const EditSchema = Yup.object().shape({
  //     category: Yup.string().required('Required'),
  //     placeName: Yup.string().required('Required'),
  //     addressInfo: Yup.number().required('Required'),
  //     openHours: Yup.string().required('Required'),
  //     terms: Yup.string().required('Required'),


  //   });
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
  const getpetfriendly = async () => {
    const token1 = localStorage.getItem("token1");
    const accessToken = localStorage.getItem("accessToken");
    try {
      let res = await axios.get(
        `https://pets.dev.savaapi.com/api/schema/dev1/mongodb/pets/pet_friendly_places`,
        {
          headers: {
            "x-am-authorization": token1,
            "x-am-user-authorization": accessToken
          },
        }
      );
      const data = res.data?.data?.map((item) => {
        return {
          category: item.category,
          placeName: item.placeName,
          mainImg: <img src={item.mainImg} alt={item.placeName} style={{ width: "100px", height: "100px" }} />,
          addressInfo: item.addressInfo,
          openHours: item.openHours,
          terms: item.terms,
        };
      });
      setJsonData(data);
    } catch (error) {
      console.error(error);
    }
  };



  const handleDelete = (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
      handleCheckboxChange: "#CCFFCC"
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const token1 = localStorage.getItem("token1");
          const accessToken = localStorage.getItem("accessToken");

          const res = await axios.delete(
            `https://pets.dev.savaapi.com/api/schema/dev1/mongodb/pets/pet_friendly_places${id}`,
            {
              headers: {
                "x-am-authorization": token1,
                "x-am-user-authorization": accessToken
              }
            }
          );
          console.log(res.data);
          Swal.fire("Deleted!", "User has been deleted.", "success");
          getpetfriendly();
        } catch (error) {
          console.error(error.response);
          Swal.fire("Error", "Failed to delete the Users.", "error");
        }
      }
    });
  };
  return (
    <Card border="light" className="bg-white shadow-sm mb-4">
      <Card.Body>
        <h4
          style={{ marginBottom: "-60px" }}>
          Pet friendly spot</h4>
        <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center py-4">
          <div className="">
          </div>
          <DownloadExcelButton jsonData={jsonData} fileName="Pet Friendly" />
        </div>

        <TabContext value={value}>
          <TabList style={tabListStyles} onChange={handleChange}>

          {/* <Tab
              style={
                value === "2" ? { ...tabStyles, ...activeTabStyles } : tabStyles
              }
              label="User"
              value="2"
            /> */}
            <Tab
              style={
                value === "1" ? { ...tabStyles, ...activeTabStyles } : tabStyles
              }
              label="Vendor"
              value="1"
            />

     
          </TabList>


          <TabPanel value="1">

            {/* <b><h3 style={{ fontFamily: "initial" }}>Product</h3></b> */}

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

          <TabPanel value="2">

{/* <b><h3 style={{ fontFamily: "initial" }}>Product</h3></b> */}

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
      </Card.Body>
    </Card>
  )
}

export default Petfriendly