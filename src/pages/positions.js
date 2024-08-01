import React, { useState, useEffect, useRef, useMemo } from "react";
import {
  Col,
  Row,
  Card,
  Form,
  Button,
  InputGroup,
} from "@themesberg/react-bootstrap";

import axios from "axios";
import Swal from "sweetalert2";
import "react-responsive-modal/styles.css";
import { Formik, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { Modal } from "react-responsive-modal";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faTrash, faPlus } from "@fortawesome/free-solid-svg-icons";
import { MDBDataTable } from "mdbreact";
import Box from "@mui/material/Box";
import Tab from "@mui/material/Tab";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import TabPanel from "@mui/lab/TabPanel";
import {
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Paper,
} from "@material-ui/core";
import { useLocation } from "react-router-dom";
import jsPDF from "jspdf";
import "jspdf-autotable";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { MaterialReactTable } from "material-react-table";

export const Positions = () => {
  const [value, setValue] = useState("1");
  const [userExamDetails, setUserExamDetails] = useState([]);

  // const [Editopen, setEditOpen] = useState(false);
  // const onEditOpenModal = () => setEditOpen(true);
  // const onEditCloseModal = () => setEditOpen(false);
  const [isError, setIsError] = useState("");
  // const [editData, setEditData] = useState({});
  const tableRef = useRef();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const id = queryParams.get("id");

  const columns = useMemo(
    //column definitions...
    () => [
      {
        accessorKey: "firstName",
        header: "First Name",
      },
      {
        accessorKey: "lastName",
        header: "Last Name",
      },
      {
        accessorKey: "city",
        header: "City",
      },
    ],
    []
    //end
  );

  const rows = [
    { id: 1, firstName: "Jhon", lastName: "Doe", city: "New York, USA" },
    { id: 2, firstName: "Jane", lastName: "Doe", city: "Washington, USA" },
  ];

  const [data, setData] = useState([
    { id: 1, firstName: "Jhon", lastName: "Doe", city: "New York, USA" },
    { id: 2, firstName: "Jane", lastName: "Doe", city: "Washington, USA" },
  ]);

  const getUserExamdata = async () => {
    const token = localStorage.getItem("token");
    try {
      const res = await axios.get(
        `${process.env.REACT_APP_BASE_URL}/api/getReportbyUser/${id}`,
        {
          headers: { Authorization: token },
        }
      );
      setUserExamDetails(res.data);
      console.log(res.data, "UserExam Data");
    } catch (error) {
      setIsError(error.response);
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
    fontSize: "18px",
    fontWeight: "bold",
    textTransform: "uppercase",
    padding: "10px 20px",
    margin: "0 5px",
    borderRadius: "5px",
    cursor: "pointer",
    color: "#333",
    background: "#fff",
    boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
    transition: "background 0.3s ease-in-out",
  };

  const activeTabStyles = {
    background: "#007bff", // Change this to the desired background color for the active tab
    color: "#fff", // Change this to the desired text color for the active tab
  };

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const generatePDF = () => {
    const doc = new jsPDF();
    doc.autoTable({
      head: [
        [
          "Exam Name",
          "Category Name",
          "SubCategory Name",
          "Topic Name",
          "Attempt No",
          "Total Marks",
          "Mark's Obtained",
          "Rank",
          "Percentage",
        ],
      ],
      body: userExamDetails.map((user) => [
        user.examName,
        user.category_name,
        user.subcategory_name,
        user.topic_name,
        user.Attempt,
        user.totalMarks,
        user.mymark,
        user.userRank,
        user.percentage,
      ]),
      startY: 20,
    });
    doc.save("user-exam-details.pdf");
  };

  const handleChangeNew = (field, label) => {
    // for (const col of columns) {
    //   if (col.field === field) {
    //     col.label = label
    //   }
    // }
    // setColumns([...columns])
  };

  const onDragEnd = (columns) => {
    // setColumns([...columns])
  };
  const [datatable, setDatatable] = useState({
    columns: [
      {
        label: "No",
        field: "id",
        width: 270,
      },
      {
        label: "full name",
        field: "fullname",
        width: 100,
      },
      {
        label: "Start Date",
        field: "start_date",
        width: 100,
      },
      {
        label: "Expiration Date",
        field: "expiration_date",
        width: 100,
      },

      {
        label: "Action",
        field: "actions",
        width: 100,
      },
    ],
  });

  const getSubscription = async () => {
    const token = localStorage.getItem("token");
    try {
      const res = await axios.get(
        `${process.env.REACT_APP_BASE_URL}/api/Order/getUserOrder/${id}`,
        {
          headers: { Authorization: token },
        }
      );

      const data = res.data?.map((item, index) => {
        return {
          id: index + 1,
          fullname: item.name,
          plan_name: item.plan_name,
          start_date: formatDate(item.start_date),
          expiration_date: formatDate(item.expiration_date),
          amount: item.amount,

          actions: (
            <div>
              <FontAwesomeIcon icon={faEdit} onClick={() => handleEdit(item)} />
              <FontAwesomeIcon
                icon={faTrash}
                className="mx-3"
                onClick={() => handleDelete(item._id)}
              />
            </div>
          ),
        };
      });
      setDatatable((prevState) => ({
        ...prevState,
        rows: data,
      }));
    } catch (error) {
      setIsError(error.response);
    }
  };

  const handleEdit = (data) => {
    let iajsbd = {
      ...data,
      start_date: new Date(data.start_date),
      expiration_date: new Date(data.expiration_date),
    };
    // setEditData(iajsbd);
    // setEditOpen(true);
    // Set the data of the selected row
  };

  const updateSubscription = async (id, updatedData) => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.put(
        `${process.env.REACT_APP_BASE_URL}/api/updateOrder/${id}`,
        updatedData,
        {
          headers: { Authorization: token },
        }
      );
      console.log(res.data); // Log the response or handle it as required.
      // Optionally, you can refetch the subcategory data after successful update.
      // getMySubCategoryData();
      // onEditCloseModal(); // Close the modal after successful update.
      Swal.fire({
        position: "center",
        icon: "success",
        title: " user Subscription Updated Successfully",
        showConfirmButton: false,
        timer: 1500,
      });
      getSubscription();
    } catch (error) {
      console.error(error.response); // Handle error responses
    }
  };

  const handleDelete = (id) => {
    // Show the confirmation dialog using SweetAlert
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        // Proceed with the delete operation
        try {
          const token = localStorage.getItem("token");
          const res = await axios.delete(
            `${process.env.REACT_APP_BASE_URL}/api/deleteOrder/${id}`,
            {
              headers: { Authorization: token },
            }
          );
          console.log(res.data); // Log the response or handle it as required.
          // Optionally, you can refresh the subcategory data after successful deletion.
          // getMySubCategoryData();
          // Show a success message using SweetAlert
          Swal.fire("Deleted!", "Category has been deleted.", "success");
          getSubscription();
        } catch (error) {
          console.error(error.response); // Handle error responses
          // Show an error message using SweetAlert
          Swal.fire("Error", "Failed to delete the Category.", "error");
        }
      }
    });
  };

  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "long", day: "numeric" };
    const formattedDate = new Date(dateString).toLocaleDateString(
      "en-US",
      options
    );
    return formattedDate;
  };

  const EditSchema = Yup.object().shape({
    name: Yup.string().required("Name is Require"),
    start_date: Yup.string().required("start date is Required"),
    expiration_date: Yup.string().required("expiry date is Required"),
  });

  useEffect(() => {
    getUserExamdata();
    getSubscription();
  }, []);

  return (
    <>
      <Card border="light" className="bg-white shadow-sm mb-4">
        <Card.Body>
          <TabContext value={value}>
            <TabList style={tabListStyles} onChange={handleChange}>
              <Tab
                style={
                  value === "1"
                    ? { ...tabStyles, ...activeTabStyles }
                    : tabStyles
                }
                label="Subscription"
                value="1"
              />
              <Tab
                style={
                  value === "2"
                    ? { ...tabStyles, ...activeTabStyles }
                    : tabStyles
                }
                label="Exam Details"
                value="2"
              />
            </TabList>
            <TabPanel value="1">
              {/* <MDBDataTable striped bordered small data={datatable} /> */}
              {/* <TableDraggable
                data={rows}
                editable={true}
                onChange={handleChangeNew}
                columns={datatable.columns}
                onDragEnd={onDragEnd}
              /> */}
              <MaterialReactTable
                autoResetPageIndex={false}
                columns={columns}
                data={data}
                enableRowOrdering
                enableSorting={false}
                muiTableBodyRowDragHandleProps={({ table }) => ({
                  onDragEnd: () => {
                    const { draggingRow, hoveredRow } = table.getState();
                    if (hoveredRow && draggingRow) {
                      data.splice(
                        hoveredRow.index,
                        0,
                        data.splice(draggingRow.index, 1)[0]
                      );
                      setData([...data]);
                    }
                  },
                })}
              />
            </TabPanel>
            <TabPanel value="2">
              <div>
                {/* <h1>Data with PDF Table</h1> */}

                <Button className="btn btn-primary" onClick={generatePDF}>
                  Generate PDF
                </Button>
                <div></div>
              </div>
            </TabPanel>
          </TabContext>
        </Card.Body>
      </Card>
    </>
  );
};
