
import React, { useState, useEffect } from "react";
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
import Box from "@mui/material/Box";
import Tab from "@mui/material/Tab";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import TabPanel from "@mui/lab/TabPanel";
import DragAndDrop from "./dragAndDrop";
import * as XLSX from "xlsx";
import Select from "react-select";
import * as Yup from "yup";
import { Formik, Field, ErrorMessage } from "formik";

export const CommanForm = () => {
  const [value, setValue] = useState("1");
  const [SubData, setSubData] = useState({
    category_id: "",
  });
  const [topicData, setopicData] = useState({
    category_id: "",
    subcategory_id: "",
  });

  const SigninSchema = Yup.object().shape({
    category_id: Yup.object().required("Please Select Category"),
  });

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const [isError, setIsError] = useState("");
  const [file, setFile] = useState([]);
  const [category, setCategory] = useState([]);
  const [subcategory, setSubCategory] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedSubCategory, setSelectedSubCategory] = useState("");
  const [droppedFiles, setDroppedFiles] = useState([]);

  const getFiles = (files) => {
    console.log(files, "files in tab");
    setFile(files);
  };

  const uploadFile = async () => {
    const token = localStorage.getItem("token");

    const reader = new FileReader();

    reader.onload = async (e) => {
      const data = new Uint8Array(e.target.result);
      const workbook = XLSX.read(data, { type: "array" });

      // Assuming there's only one sheet in the XLSX file, if there are multiple sheets, you can loop through them
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];

      // Convert the worksheet to JSON
      const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

      // If you want to skip the first row (header row) and start from the second row, you can pass the 'range' option
      // const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1, range: 1 });

      const formattedResponse = jsonData.slice(1).map((row) => {
        return {
          category_name: row[0],
          description: row[1],
        };
      });

      try {
        const res = await axios.post(
          `${process.env.REACT_APP_BASE_URL}/api/category/createmultiple`,
          formattedResponse,

          {
            headers: { Authorization: `${token}` },
          }
        );

        Swal.fire({
          position: "center",
          icon: "success",
          title: "Category's Created Successfully",
          showConfirmButton: false,
          timer: 1500,
        });
      } catch (error) {
        setIsError(error.response.data.err.message);
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "Something went wrong!",
        });
      }
    };

    reader.readAsArrayBuffer(file[0]);
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

  const getMyCategoryData = async () => {
    const token = localStorage.getItem("token");
    try {
      const res = await axios.get(
        `${process.env.REACT_APP_BASE_URL}/api/Category/getAll`,
        {
          headers: { Authorization: token },
        }
      );
      setCategory(res.data);
      console.log(res.data, "category data");
    } catch (error) {
      setIsError(error.response);
    }
  };

  const uploadSubcategotyFile = async (values, setFieldValue) => {
    const token = localStorage.getItem("token");

    const reader = new FileReader();

    reader.onload = async (e) => {
      const data = new Uint8Array(e.target.result);
      const workbook = XLSX.read(data, { type: "array" });

      // Assuming there's only one sheet in the XLSX file, if there are multiple sheets, you can loop through them
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];

      // Convert the worksheet to JSON
      const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

      // If you want to skip the first row (header row) and start from the second row, you can pass the 'range' option
      // const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1, range: 1 });
      //   console.log("sub categoryjsonData ---- ", jsonData);

      const formattedResponse = jsonData.slice(1).map((row) => {
        return {
          //   category_id: selectedCategory.value,
          category_id: values.category_id.value,
          subcategory_name: row[0],
          description: row[1],
        };
      });

      console.log(formattedResponse, "formattedResponse");

      try {
        const res = await axios.post(
          `${process.env.REACT_APP_BASE_URL}/api/Subcategory/createmultipleSub`,
          formattedResponse,
          {
            headers: { Authorization: `${token}` },
          }
        );

        Swal.fire({
          position: "center",
          icon: "success",
          title: "SubCategory's Created Successfully",
          showConfirmButton: false,
          timer: 1500,
        });
        setFieldValue("category_id", "");
        setDroppedFiles("");
      } catch (error) {
        setIsError(error.response.data.err.message);
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "Something went wrong!",
        });
      }
    };

    reader.readAsArrayBuffer(file[0]);
  };

  const uploadTopicsFile = async (values, setFieldValue) => {
    const token = localStorage.getItem("token");

    const reader = new FileReader();

    reader.onload = async (e) => {
      const data = new Uint8Array(e.target.result);
      const workbook = XLSX.read(data, { type: "array" });

      // Assuming there's only one sheet in the XLSX file, if there are multiple sheets, you can loop through them
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];

      // Convert the worksheet to JSON
      const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

      // If you want to skip the first row (header row) and start from the second row, you can pass the 'range' option
      // const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1, range: 1 });
      //   console.log("sub categoryjsonData ---- ", jsonData);

      const formattedResponse = jsonData.slice(1).map((row) => {
        return {
          //   category_id: selectedCategory.value,
          //   subcategory_id: selectedSubCategory.value,
          category_id: values.category_id.value,
          subcategory_id: values.subcategory_id.value,
          topic_name: row[0],
          description: row[1],
        };
      });

      try {
        const res = await axios.post(
          `${process.env.REACT_APP_BASE_URL}/api/Topic/createmultipleatopic`,
          formattedResponse,
          {
            headers: { Authorization: `${token}` },
          }
        );

        Swal.fire({
          position: "center",
          icon: "success",
          title: "Topics's Created Successfully",
          showConfirmButton: false,
          timer: 1500,
        });

        setFieldValue("category_id", "");
        setDroppedFiles("");
      } catch (error) {
        setIsError(error.response.data.err.message);
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "Something went wrong!",
        });
      }
    };

    reader.readAsArrayBuffer(file[0]);
  };

  const getMySubCategoryData = async () => {
    const token = localStorage.getItem("token");
    try {
      const res = await axios.get(
        `${process.env.REACT_APP_BASE_URL}/api/Subcategory/getAll`,
        {
          headers: { Authorization: token },
        }
      );
      setSubCategory(res.data);
      console.log(res.data, "sub categorydata");
    } catch (error) {
      setIsError(error.response);
    }
  };

  const handleDownload = () => {
    // Sample data
    const data = [
      { category_name: "Maths", description: "Maths Description" },
      { category_name: "Biology", description: "Biology Description" },
      { category_name: "Physics", description: "Physics Description" },
    ];

    // Create a worksheet
    const ws = XLSX.utils.json_to_sheet(data);

    // Create a workbook and add the worksheet
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Sheet1");

    // Convert the workbook to a binary string
    const wbout = XLSX.write(wb, { bookType: "xlsx", type: "binary" });

    // Create a Blob from the binary string
    const blob = new Blob([s2ab(wbout)], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });

    // Create a URL for the Blob
    const url = URL.createObjectURL(blob);

    // Create a download link and trigger click event
    const link = document.createElement("a");
    link.href = url;
    link.download = "sample.xlsx";
    link.click();

    // Clean up the URL object after the download
    URL.revokeObjectURL(url);
  };

  // Utility function to convert string to ArrayBuffer
  const s2ab = (s) => {
    const buf = new ArrayBuffer(s.length);
    const view = new Uint8Array(buf);
    for (let i = 0; i < s.length; i++) {
      view[i] = s.charCodeAt(i) & 0xff;
    }
    return buf;
  };


  const SubcategoryDownload = () => {
    // Sample data
    const data = [
      { subcategory_name: "Analytical Biology", description: "Analytical Biology Description" },
      { subcategory_name: "micro Biology", description: "micro Description" },
    ];

    // Create a worksheet
    const ws = XLSX.utils.json_to_sheet(data);

    // Create a workbook and add the worksheet
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Sheet1");

    // Convert the workbook to a binary string
    const wbout = XLSX.write(wb, { bookType: "xlsx", type: "binary" });

    // Create a Blob from the binary string
    const blob = new Blob([s2ab1(wbout)], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });

    // Create a URL for the Blob
    const url = URL.createObjectURL(blob);

    // Create a download link and trigger click event
    const link = document.createElement("a");
    link.href = url;
    link.download = "sample.xlsx";
    link.click();

    // Clean up the URL object after the download
    URL.revokeObjectURL(url);
  };

  // Utility function to convert string to ArrayBuffer
  const s2ab1 = (s) => {
    const buf = new ArrayBuffer(s.length);
    const view = new Uint8Array(buf);
    for (let i = 0; i < s.length; i++) {
      view[i] = s.charCodeAt(i) & 0xff;
    }
    return buf;
  };

  const topicDownload = () => {
    // Sample data
    const data = [
      { topic_name: "Chapter 4", description: "Chapter 4 Description" },
      { topic_name: "Chapter 5", description: "Chapter 5 Description" },
    ];

    // Create a worksheet
    const ws = XLSX.utils.json_to_sheet(data);

    // Create a workbook and add the worksheet
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Sheet1");

    // Convert the workbook to a binary string
    const wbout = XLSX.write(wb, { bookType: "xlsx", type: "binary" });

    // Create a Blob from the binary string
    const blob = new Blob([s2ab2(wbout)], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });

    // Create a URL for the Blob
    const url = URL.createObjectURL(blob);

    // Create a download link and trigger click event
    const link = document.createElement("a");
    link.href = url;
    link.download = "sample.xlsx";
    link.click();

    // Clean up the URL object after the download
    URL.revokeObjectURL(url);
  };

  // Utility function to convert string to ArrayBuffer
  const s2ab2 = (s) => {
    const buf = new ArrayBuffer(s.length);
    const view = new Uint8Array(buf);
    for (let i = 0; i < s.length; i++) {
      view[i] = s.charCodeAt(i) & 0xff;
    }
    return buf;
  };


  useEffect(() => {
    getMyCategoryData();
    getMySubCategoryData();
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
                label="Category"
                value="1"
              />
              <Tab
                style={
                  value === "2"
                    ? { ...tabStyles, ...activeTabStyles }
                    : tabStyles
                }
                label="SubCategory"
                value="2"
              />
              <Tab
                style={
                  value === "3"
                    ? { ...tabStyles, ...activeTabStyles }
                    : tabStyles
                }
                label="Topic"
                value="3"
              />
            </TabList>
            <div>
              <TabPanel value="1">
                <div className="Sample-btn mb-3">
                  <button className="btn btn-info" onClick={handleDownload}>
                    Sample File Download
                  </button>
                </div>
                <DragAndDrop getFiles={getFiles} droppedFiles={droppedFiles}
                          setDroppedFiles={setDroppedFiles} />
                <div className="text-center mt-3">
                  <button className="btn btn-primary" onClick={uploadFile}>
                    Upload Category File
                  </button>
                </div>
              </TabPanel>
              <TabPanel value="2">
                <div className="Sample-btn mb-3">
                  <button className="btn btn-info" onClick={SubcategoryDownload}>
                    Sample File Download
                  </button>
                </div>
                <Formik
                  initialValues={SubData}
                  validationSchema={SigninSchema}
                  onSubmit={(
                    values,
                    { setSubmitting, setFieldValue, resetForm }
                  ) => {
                    uploadSubcategotyFile(values, setFieldValue);
                    resetForm();

                    setSubmitting(false);
                  }}
                >
                  {({
                    values,
                    errors,
                    touched,
                    handleChange,
                    handleBlur,
                    handleSubmit,
                    isSubmitting,
                    setFieldValue,
                    /* and other goodies */
                  }) => (
                    <Form>
                      <div className="form-group mb-3">
                        <Form.Label>Select Category</Form.Label>
                        <Select
                          // name="category_id"
                          // value={selectedCategory}
                          // onChange={handleCategoryChange}
                          // options={category.map((category) => ({
                          //   value: category._id,
                          //   label: category.category_name,
                          // }))}
                          name="category_id"
                          value={values.category_id}
                          onChange={(selectedOption) =>
                            setFieldValue("category_id", selectedOption)
                          }
                          options={category.map((category) => ({
                            value: category._id,
                            label: category.category_name,
                          }))}
                        />
                        <div className="mb-3 text-danger">
                          {errors.category_id &&
                            touched.category_id &&
                            errors.category_id}
                        </div>
                        <DragAndDrop
                          getFiles={getFiles}
                          droppedFiles={droppedFiles}
                          setDroppedFiles={setDroppedFiles}
                        />
                        <div className="text-center mt-3">
                          <button
                            className="btn btn-primary"
                            onClick={handleSubmit}
                          >
                            Upload SubCategory File
                          </button>
                        </div>
                      </div>
                    </Form>
                  )}
                </Formik>
              </TabPanel>
              <TabPanel value="3">
              <div className="Sample-btn mb-3">
                  <button className="btn btn-info" onClick={topicDownload}>
                    Sample File Download
                  </button>
                </div>
                <Formik
                  initialValues={topicData}
                  validationSchema={SigninSchema}
                  onSubmit={(
                    values,
                    { setSubmitting, setFieldValue, resetForm }
                  ) => {
                    uploadTopicsFile(values, setFieldValue);
                    resetForm();

                    setSubmitting(false);
                  }}
                >
                  {({
                    values,
                    errors,
                    touched,
                    handleChange,
                    handleBlur,
                    handleSubmit,
                    isSubmitting,
                    setFieldValue,
                    /* and other goodies */
                  }) => (
                    <Form>
                      <div className="form-group mb-3">
                        <Form.Label>Select Category</Form.Label>
                        <Select
                          name="category_id"
                          value={values.category_id}
                          onChange={(selectedOption) =>
                            setFieldValue("category_id", selectedOption)
                          }
                          options={category.map((category) => ({
                            value: category._id,
                            label: category.category_name,
                          }))}
                        />
                        <div className="mb-3 text-danger">
                          {errors.category_id &&
                            touched.category_id &&
                            errors.category_id}
                        </div>
                      </div>
                      <div className="form-group mb-3">
                        <Form.Label>Select Subcategory</Form.Label>
                        <Select
                          name="subcategory_id"
                          value={values.subcategory_id}
                          onChange={(selectedOption) =>
                            setFieldValue("subcategory_id", selectedOption)
                          }
                          options={subcategory
                            .filter(
                              (i) => i.category_id === values.category_id.value
                            )
                            .map((category) => ({
                              value: category._id,
                              label: category.subcategory_name,
                            }))}
                        />
                      </div>
                      <DragAndDrop
                        getFiles={getFiles}
                        droppedFiles={droppedFiles}
                        setDroppedFiles={setDroppedFiles}
                      />
                      <div className="text-center mt-3">
                        <button
                          className="btn btn-primary"
                          onClick={handleSubmit}
                        >
                          Upload Topic File
                        </button>
                      </div>
                    </Form>
                  )}
                </Formik>
              </TabPanel>
            </div>
          </TabContext>
        </Card.Body>
      </Card>
    </>
  );
};

