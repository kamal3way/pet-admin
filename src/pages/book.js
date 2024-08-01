import React, { useState, useEffect, useMemo } from "react";
import Dropdown from "react-bootstrap/Dropdown";
import DropdownButton from "react-bootstrap/DropdownButton";

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
import { Image } from "@themesberg/react-bootstrap";
export const Book = () => {
  const [open, setOpen] = useState(false);
  const onOpenModal = () => setOpen(true);
  const onCloseModal = () => setOpen(false);

  const [updatedBookData, setUpdatedBookData] = useState(null);
  const handleSubmit = (values) => {
    updateBook(editData._id, values);
  };
  // const [datatable,setDatatale] = useState ({});
  // edit model
  const [Editopen, setEditOpen] = useState(false);
  const onEditOpenModal = () => setEditOpen(true);
  const onEditCloseModal = () => setEditOpen(false);

  // const [openOffer, setOpenOffer] = useState(false);
  // const onOpenOfferModal = () => setOpenOffer(true);
  // const onCloseOffereModal = () => setOpenOffer(false);

  const [EditOfferopen, setEditOfferOpen] = useState(false);
  const onEditOpenOfferModal = () => setEditOfferOpen(true);
  const onEditCloseOfferModal = () => setEditOfferOpen(false);

  const [jsonData, setJsonData] = useState([]);

  const [SubscriptionData, setMySubscriptionData] = useState([]);
  const [code, setCode] = useState("");
  const [discountPrize, setDiscountPrize] = useState(0);

  const [value, setValue] = useState("1");

  const [myData, setMyData] = useState({
    code: "",
    discountPrize: "",
  });
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const id = queryParams.get("id");

  const [isError, setIsError] = useState("");
  const [isLoadingData, setIsLoadingData] = useState(true);

  const [editData, setEditData] = useState({});
  const [editOfferData, setEdiOfferData] = useState({});
  const history = useHistory();
  useEffect(() => {
    // getMySubscriptionData();
    getMyBookorderData();
    getMyBookData();
  }, []);

  const navigateDetails = (userId) => {
    history.push(`/topics?id=${userId}`);
  };

  const columns1 = useMemo(
    () => [
      {
        accessorKey: "bookName",
        header: "BookName",
      },
      {
        accessorKey: "volume",
        header: "Volume",
      },
      {
        accessorKey: "price",
        header: "Price",
      },
      {
        accessorKey: "comboPrice",
        header: "ComboPrice",
      },
      {
        accessorKey: "bookType",
        header: "BookType",
      },
      {
        accessorKey: "bookImg",
        header: "BookImg",
      },
      {
        accessorKey: "description",
        header: "Description ",
      },

      {
        accessorKey: "actions",
        header: "Actions",
      },
    ],
    []
    //end
  );
  // const columns2 = useMemo(
  //   () => [
  //     {
  //       accessorKey: "Price",
  //       header: "Price",
  //     },
  //     {
  //       accessorKey: "status",
  //       header: "Status",
  //     },
  //     // {
  //     //   accessorKey: "offerAmount",
  //     //   header: "Offer Amount",
  //     // },

  //     {
  //       accessorKey: "actions",
  //       header: "actions",
  //     },
  //   ],
  //   []
  //   //end
  // );

  const columns5 = useMemo(
    () => [
      {
        accessorKey: "name",
        header: "Name",
      },
      {
        accessorKey: "Price",
        header: "Price",
      },
      {
        accessorKey: "phone",
        header: "Phone",
      },
      {
        accessorKey: "bookName",
        header: "BookName",
      },
      {
        accessorKey: "status",
        header: "Status",
      },

      {
        accessorKey: "actions",
        header: "Actions",
      },
    ],
    []
    //end
  );

  // const getMySubscriptionData = async (values) => {
  //   const token = localStorage.getItem("token");
  //   try {
  //     const res = await axios.get(
  //       `${process.env.REACT_APP_BASE_URL}/api/getAllBookOrder`,
  //       {
  //         headers: { Authorization: token },
  //       }
  //     );
  //     setMySubscriptionData(res.data);
  //     setIsLoadingData(false);
  //   } catch (error) {
  //     setIsError(error.response);

  //   }
  // };
  const getMyBookorderData = async () => {
    const token = localStorage.getItem("token");
    setIsLoadingData(true);
    try {
      const res = await axios.get(
        `${process.env.REACT_APP_BASE_URL}/api/getAllBookOrder`,
        {
          headers: { Authorization: token },
        }
      );
      console.log("🚀 ~ getMyBookorderData ~ res:", res)

      const data = res.data?.map((item, index) => {
        return {
          id: index + 1,
          status: item.status,
          Price: item.Price,

          actions: (
            <div>
              <FontAwesomeIcon
                icon={faEdit}
                onClick={() => handleEdit1(item)}
              />

              <FontAwesomeIcon
                className="mx-3"
                icon={faTrash}
                onClick={() => handleDelete(item._id)}
              />
            </div>
          ),
        };
      });
      setIsLoadingData(false);
      setJsonData(data);
      setIsLoadingData(false);
      // setDatatable((prevState) => ({
      //   ...prevState,
      //   rows: data,
      // }));
    } catch (error) {
      setIsError(error.response);
      setIsLoadingData(false);
    }
  };

  const getMyprocessingData = async () => {
    const token = localStorage.getItem("token");
    setIsLoadingData(true);
    try {
      const res = await axios.get(
        `${process.env.REACT_APP_BASE_URL}/api/getAllBookOrder`,
        {
          headers: { Authorization: token },
        }
      );

      const data = res.data?.map((item, index) => {
        return {
          id: index + 1,
          status: item.status,
          Price: item.Price,

          actions: (
            <div>
              <FontAwesomeIcon
                icon={faEdit}
                onClick={() => handleEdit1(item)}
              />

              <FontAwesomeIcon
                className="mx-3"
                icon={faTrash}
                onClick={() => handleDelete(item._id)}
              />
            </div>
          ),
        };
      });
      setIsLoadingData(false);
      setJsonData(data);
      setIsLoadingData(false);
      // setDatatable((prevState) => ({
      //   ...prevState,
      //   rows: data,
      // }));
    } catch (error) {
      setIsError(error.response);
      setIsLoadingData(false);
    }
  };

  const getMycompleteData = async () => {
    const token = localStorage.getItem("token");
    setIsLoadingData(true);
    try {
      const res = await axios.get(
        `${process.env.REACT_APP_BASE_URL}/api/getAllBookOrderByStatus?status=complete`,
        {
          headers: { Authorization: token },
        }
      );

      const data = res.data?.map((item, index) => {
        return {
          id: index + 1,
          status: item.status,
          Price: item.Price,

          actions: (
            <div>
              <FontAwesomeIcon
                icon={faEdit}
                onClick={() => handleEdit1(item)}
              />

              <FontAwesomeIcon
                className="mx-3"
                icon={faTrash}
                onClick={() => handleDelete(item._id)}
              />
            </div>
          ),
        };
      });
      setIsLoadingData(false);
      setJsonData(data);
      setIsLoadingData(false);
      // setDatatable((prevState) => ({
      //   ...prevState,
      //   rows: data,
      // }));
    } catch (error) {
      setIsError(error.response);
      setIsLoadingData(false);
    }
  };

  const getMypaddingData = async () => {
    const token = localStorage.getItem("token");
    setIsLoadingData(true);
    try {
      const res = await axios.get(
        `${process.env.REACT_APP_BASE_URL}/api/getAllBookOrderByStatus?status=Pending`,
        {
          headers: { Authorization: token },
        }
      );

      const data = res.data?.map((item, index) => {
        return {
          id: index + 1,
          status: item.status,
          Price: item.Price,

          actions: (
            <div>
              <FontAwesomeIcon
                icon={faEdit}
                onClick={() => handleEdit1(item)}
              />

              <FontAwesomeIcon
                className="mx-3"
                icon={faTrash}
                onClick={() => handleDelete(item._id)}
              />
            </div>
          ),
        };
      });
      setIsLoadingData(false);
      setJsonData(data);
      setIsLoadingData(false);
      // setDatatable((prevState) => ({
      //   ...prevState,
      //   rows: data,
      // }));
    } catch (error) {
      setIsError(error.response);
      setIsLoadingData(false);
    }
  };
  const getMyBookData = async () => {
    const token = localStorage.getItem("token");
    setIsLoadingData(true);
    try {
      const res = await axios.get(
        `${process.env.REACT_APP_BASE_URL}/api/Book/getAll`,
        {
          headers: { Authorization: token },
        }
      );
      console.log("🚀 ~ getMyBookData ~ res:", res.data);

      const data = res.data?.map((item, index) => {
        return {
          id: index + 1,
          name: item.name,
          phone: item.phone,
          email: item.email,
          preparing: item.preparing,
          amount: item.amount,
          volume: item.volume,
          notesOverview: item.notesOverview,
          bookType: item.bookType,
          price: item.price,
          comboPrice: item.comboPrice,
          bookName: item.bookName,
          description: item.description,
          bookImg: item.bookImg,
          _id: item._id,
          actions: (
            <div>
              <FontAwesomeIcon icon={faEdit} onClick={() => handleEdit(item)} />

              <FontAwesomeIcon
                className="mx-3"
                icon={faTrash}
                onClick={() => handleDelete(item._id)}
              />
            </div>
          ),
        };
      });

      setJsonData(data);
      setIsLoadingData(false);
      // setDatatable((prevState) => ({
      //   ...prevState,
      //   rows: data,
      // }));
    } catch (error) {
      setIsError(error.response);
      setIsLoadingData(false);
    }
  };

  // const getMyOfferData = async () => {
  //   const token = localStorage.getItem("token");
  //   try {
  //     const res = await axios.get(
  //       `${process.env.REACT_APP_BASE_URL}/api/Offer/getAll`,
  //       {
  //         headers: { Authorization: token },
  //       }
  //     );

  //     // const data = res.data?.map((item, index) => {
  //     //   return {
  //     //     id: index + 1,
  //     //     code: item.code,
  //     //     discountPrize: item.discountPrize,
  //     //     _id: item._id,
  //     //     actions: (
  //     //       <div>
  //     //         <FontAwesomeIcon icon={faEdit} onClick={() => handleEditOffer(item)} />

  //     //         <FontAwesomeIcon
  //     //           className="mx-3"
  //     //           icon={faTrash}
  //     //           onClick={() => handleDelete(item._id)}
  //     //         />

  //     //       </div>
  //     //     ),
  //     //   };
  //     // });

  //     // setJsonData(data);
  //     // setDatatable((prevState) => ({
  //     //   ...prevState,
  //     //   rows: data,
  //     // }));
  //   } catch (error) {
  //     setIsError(error.response);
  //   }
  // };

  const addCoupon = async (values) => {
    const token = localStorage.getItem("token");
    try {
      const res = await axios.post(
        `${process.env.REACT_APP_BASE_URL}/api/Book/create`,
        values,
        {
          headers: { Authorization: `${token}` },
        }
      );
      setMyData(res.data);
      Swal.fire({
        position: "center",
        icon: "success",
        title: "Book Added Successfully ",
        showConfirmButton: false,
        timer: 1500,
      });
      getMyBookData();
      onCloseModal();
      setMyData({
        code: "",
        discountPrize: "",
      });
    } catch (error) {
      setIsError(error.response.data.err.message);
    }
  };
  const updateBook = async (id, updatedData) => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.put(
        `${process.env.REACT_APP_BASE_URL}/api/updateBook/${id}`,
        updatedData,
        {
          headers: { Authorization: token },
        }
      );
      console.log(res.data, "update book"); // Log the response or handle it as required.
      setUpdatedBookData(res.data.data);
      // Optionally, you can refetch the subcategory data after successful update.
      // getMySubCategoryData();
      onEditCloseModal(); // Close the modal after successful update.
      Swal.fire({
        position: "center",
        icon: "success",
        title: " Book Updated Successfully",
        showConfirmButton: false,
        timer: 1500,
      });
      getMyBookData();
    } catch (error) {
      console.error(error.response); // Handle error responses
    }
  };

  const updateOrderBook = async (id, updatedData) => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.put(
        `${process.env.REACT_APP_BASE_URL}/updateBookOrder/6639b85c75598b2c2724799d`,
        updatedData,
        {
          headers: { Authorization: token },
        }
      );

      console.log(res.data, "****************"); // Log the response or handle it as required.
      // Optionally, you can refetch the subcategory data after successful update.
      // getMySubCategoryData();
      onEditCloseModal(); // Close the modal after successful update.
      Swal.fire({
        position: "center",
        icon: "success",
        title: " Category Updated Successfully",
        showConfirmButton: false,
        timer: 1500,
      });
      getMyBookorderData();
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
            `${process.env.REACT_APP_BASE_URL}/api/deleteBook/${id}`,
            {
              headers: { Authorization: token },
            }
          );
          console.log(res.data, "delete"); // Log the response or handle it as required.
          // Optionally, you can refresh the subcategory data after successful deletion.
          // getMySubCategoryData();
          // Show a success message using SweetAlert
          Swal.fire("Deleted!", "Your book  has been deleted.", "success");
          getMyBookData();
        } catch (error) {
          console.error(error.response); // Handle error responses
          // Show an error message using SweetAlert
          Swal.fire("Error", "Failed to delete the Book.", "error");
        }
      }
    });
  };

  // const handleDelete = (id) => {
  //   // Show the confirmation dialog using SweetAlert
  //   Swal.fire({
  //     title: "Are you sure?",
  //     text: "You won't be able to revert this!",
  //     icon: "warning",
  //     showCancelButton: true,
  //     confirmButtonColor: "#3085d6",
  //     cancelButtonColor: "#d33",
  //     confirmButtonText: "Yes, delete it!",
  //   }).then(async (result) => {
  //     if (result.isConfirmed) {
  //       // Proceed with the delete operation
  //       try {
  //         const token = localStorage.getItem("token");
  //         const res = await axios.delete(
  //           `${process.env.REACT_APP_BASE_URL}/api/deleteBook/${id}`,
  //           {
  //             headers: { Authorization: token },
  //           }
  //         );
  //         console.log(res.data, "delete"); // Log the response or handle it as required.
  //         // Optionally, you can refresh the subcategory data after successful deletion.
  //         // getMySubCategoryData();
  //         // Show a success message using SweetAlert
  //         Swal.fire("Deleted!", "Your book  has been deleted.", "success");
  //         getMyBookData();
  //       } catch (error) {
  //         console.error(error.response); // Handle error responses
  //         // Show an error message using SweetAlert
  //         Swal.fire("Error", "Failed to delete the Book.", "error");
  //       }
  //     }
  //   });
  // };
  const handleChange = (event, newValue) => {
    console.log("🚀 ~ handleChange ~ newValue:", newValue);
    if (newValue === "1") {
      getMyBookData();
    } else {
      getMyBookorderData();
    }
    setValue(newValue);
  };

  const handleChange1 = (event, newValue) => {
    console.log("🚀 ~ handleChange ~ newValue:", newValue);
    if (newValue === "5") {
      getMypaddingData();
    } else if (newValue === "6") {
      getMycompleteData();
    } else {
      getMyprocessingData();
    }
    setValue(newValue);
  };
  // const handleChange1 = (event, newValue) => {
  //   if (newValue === "5") {
  //     getMypaddingData();
  //   } else if (newValue === "6") {
  //     getMycompleteData();
  //   } else  (newValue === "7") {
  //     getMyprocessingData();
  //   } else {
  //     getMyCustomQueryData();
  //   }
  //   setValue(newValue);
  // };

  const handleEdit = (data) => {
    setEdiOfferData(data); // Set the data of the selected row
    setEditOpen(true); // Open the modal
  };
  const handleEdit1 = (data) => {
    setEdiOfferData(data); // Set the data of the selected row
    setEditOfferOpen(true); // Open the modal
  };
  // const handleEditOffer = (data) => {
  //   setOpenOffer(data); // Set the data of the selected row
  //   setEditOfferOpen(true); // Open the modal
  // };

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

  const SigninSchema = Yup.object().shape({
    bookName: Yup.string().required("bookName is Required"),
    description: Yup.string().required("description is Required"),
    bookType: Yup.string().required("bookType is Required"),
    volume: Yup.string().required("volumeis Required"),
    price: Yup.string().required("price is Required"),
    comboPrice: Yup.string().required("comboPrice is Required"),
  });

  const EditSchema = Yup.object().shape({
    data: Yup.object().shape({
      bookName: Yup.string().required("Book Name is Required"),
      description: Yup.string().required("Description is Required"),
      bookType: Yup.string().required("Book Type is Required"),
      volume: Yup.number().required("Volume is Required"),
      price: Yup.number().required("Price is Required"),
      comboPrice: Yup.number().required("Combo Price is Required"),
    }),
  });

  return (
    <Card border="light" className="bg-white shadow-sm mb-4">
      <Card.Body>
        <h5 className="mb-4">Book</h5>
        <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center py-4">
          <div className="">
            <button className="btn btn-primary " onClick={onOpenModal}>
              Add Book
              <FontAwesomeIcon icon={faPlus} className="mx-2" />
            </button>
            {/* <button className="btn btn-primary" style={{ marginLeft: 5 }} onClick={onOpenOfferModal}>
              Add Book
              <FontAwesomeIcon icon={faPlus} className="mx-2" />
            </button> */}
          </div>
          <DownloadExcelButton jsonData={jsonData} fileName="Couponcode" />
        </div>

        <Modal open={open} onClose={onCloseModal} center>
          <h2 className="md-12">Add Book</h2>
          <Formik
            initialValues={myData}
            validationSchema={SigninSchema}
            onSubmit={(values) => {
              // addCoupon(values);
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
                <Row>
                  <Row>
                    <Col md={6} className="mb-3">
                      <Form.Group id="lastName">
                        <Form.Label>BookName</Form.Label>
                        <Form.Control
                          type="text"
                          placeholder="Enter BookName"
                          name="bookName"
                          value={values.bookName}
                          onChange={handleChange}
                        />
                      </Form.Group>
                      <div className="mb-3 text-danger">
                        {errors.discountPrize &&
                          touched.discountPrize &&
                          errors.discountPrize}
                      </div>
                    </Col>

                    <Col md={6} className="mb-3">
                      <Form.Group id="lastName">
                        <Form.Label>BookType</Form.Label>
                        <Form.Control
                          type="text"
                          placeholder="Enter BookType"
                          name="bookType"
                          value={values.bookType}
                          onChange={handleChange}
                        />
                      </Form.Group>
                      <div className="mb-3 text-danger">
                        {errors.discountPrize &&
                          touched.discountPrize &&
                          errors.discountPrize}
                      </div>
                    </Col>
                  </Row>
                  <Row>
                  {/* subscription_id: (
            <input
              type="checkbox"
              checked={item.subscription_id}
              onChange={(event) => handleToggleActive(event, item)}
            />
          ),
          subscription_id: item.subscription_id ? "True" : "False", */}

                    <Col md={6} className="mb-3">
                      <Form.Group id="lastName">
                        <Form.Label>Volume</Form.Label>
                        <Form.Control
                          type="text"
                          placeholder="Enter Volume"
                          name="volume"
                          value={values.volume}
                          onChange={handleChange}
                        />
                      </Form.Group>
                      <div className="mb-3 text-danger">
                        {errors.code && touched.code && errors.code}
                      </div>
                    </Col>

                    <Col md={6} className="mb-3">
                      <Form.Group id="lastName">
                        <Form.Label>ComboPrice</Form.Label>
                        <Form.Control
                          type="number"
                          placeholder="Enter ComboPrice"
                          name="comboPrice"
                          value={values.comboPrice}
                          onChange={handleChange}
                        />
                      </Form.Group>
                      <div className="mb-3 text-danger">
                        {errors.discountPrize &&
                          touched.discountPrize &&
                          errors.discountPrize}
                      </div>
                    </Col>
                    <Col md={6} className="mb-3">
                      <Form.Group id="lastName">
                        <Form.Label>Price</Form.Label>
                        <Form.Control
                          type="text"
                          placeholder="Enter Price"
                          name="price"
                          value={values.price}
                          onChange={handleChange}
                        />
                      </Form.Group>
                      <div className="mb-3 text-danger">
                        {errors.discountPrize &&
                          touched.discountPrize &&
                          errors.discountPrize}
                      </div>
                    </Col>
                    {/* <Col md={6} className="mb-3">
                      <Form.Group id="lastName">
                        <Form.Label>NotesOverview</Form.Label>
                        <Form.Control
                          type="text"
                          placeholder="Enter NotesOverview"
                          name="notesOverview"
                          value={values.notesOverview}
                          onChange={handleChange}
                        />
                      </Form.Group>
                      <div className="mb-3 text-danger">
                        {errors.discountPrize &&
                          touched.discountPrize &&
                          errors.discountPrize}
                      </div>
                    </Col> */}
                    <Col md={6} className="mb-3">
                      <Form.Group id="lastName">
                        <Form.Label>BookImg</Form.Label>
                        <Form.Control
                          type="file"
                          placeholder="Enter BookImg"
                          name="bookImg"
                          value={values.bookImg}
                          onChange={handleChange}
                        />
                      </Form.Group>
                      <div className="mb-3 text-danger">
                        {errors.discountPrize &&
                          touched.discountPrize &&
                          errors.discountPrize}
                      </div>
                    </Col>
                    <FieldArray name="notesOverview">
                      {({ push, remove }) => (
                        <>
                          {values?.notesOverview?.map((item, index) => (
                            <div key={index}>
                              <Row>
                                <Col md={4} className="mb-3">
                                  <Form.Group>
                                    <Form.Label>Chapter Name </Form.Label>
                                    <Form.Control
                                      type="text"
                                      placeholder="Enter Chapter Name"
                                      name={`notesOverview[${index}].chapterName`}
                                      value={item.chapterName}
                                      onChange={handleChange}
                                      // disabled={isDisabled}
                                    />
                                  </Form.Group>
                                </Col>
                                <Col md={4} className="mb-3">
                                  <Form.Group>
                                    <Form.Label>Chapter {index + 1}</Form.Label>
                                    <Form.Control
                                      type="number"
                                      placeholder="Enter Chapter Number"
                                      name={`notesOverview[${index}].chapter`}
                                      value={item.chapter}
                                      onChange={handleChange}
                                      // disabled={isDisabled}
                                    />
                                  </Form.Group>
                                </Col>
                                <Col md={3} className="mb-3">
                                  <Form.Group>
                                    <Form.Label>
                                      Page Number {index + 1}
                                    </Form.Label>
                                    <Form.Control
                                      type="text"
                                      placeholder="Enter Page Number"
                                      name={`notesOverview[${index}].pageNumber`}
                                      value={item.pageNumber}
                                      onChange={handleChange}
                                      // disabled={isDisabled}
                                    />
                                  </Form.Group>
                                </Col>
                                <Col md={1} className="mb-3 align-self-end">
                                  <Button
                                    variant="danger"
                                    size="sm"
                                    onClick={() => remove(index)}
                                    // disabled={isDisabled}
                                  >
                                    Remove
                                  </Button>
                                </Col>
                              </Row>
                            </div>
                          ))}

                          <Row>
                            <Col md={12} className="mb-3">
                              <Button
                                variant="primary"
                                onClick={() =>
                                  push({
                                    chapterName: "",
                                    chapter: "",
                                    pageNumber: "",
                                  })
                                }
                                // disabled={isDisabled}
                              >
                                Add Chapter
                              </Button>
                            </Col>
                          </Row>
                        </>
                      )}
                    </FieldArray>
                    <Col md={12} className="mb-3">
                      <Form.Group id="lastName">
                        <Form.Label>Description</Form.Label>
                        <textarea
                          class="form-control"
                          id="description"
                          rows="6"
                          placeholder="Enter Description"
                          name="description"
                          value={values.description}
                          onChange={handleChange}
                        ></textarea>
                      </Form.Group>
                      <div className="mb-3 text-danger">
                        {errors.description &&
                          touched.description &&
                          errors.description}
                      </div>
                    </Col>
                  </Row>
                </Row>

                <div className="mt-3">
                  <Button
                    variant="primary"
                    type="submit"
                    onClick={handleSubmit}
                  >
                    Save
                  </Button>
                </div>
              </Form>
            )}
          </Formik>
        </Modal>

        <Modal open={Editopen} onClose={onEditCloseModal} center>
          <h2>Edit Book</h2>
          <Formik
            initialValues={{
              bookName: editData.bookName,
              description: editData.description,
              bookType: editData.bookType,
              volume: editData.volume,
              price: editData.price,
              comboPrice: editData.comboPrice,
            }}
            validationSchema={EditSchema}
            onSubmit={(values) => {
              updateBook(editData._id, values); // Pass the ID and updated data to updateSubcategory
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
                <Row>
                  <Row>
                    {/* <Col md={12} className="mb-3">
                      <Form.Group id="gender">
                        <Form.Label>Select Subscription Plan</Form.Label>
                        <Select
                          name="subscription_id"
                          value={values.subscription_id.map((id) => ({
                            value: id,
                            label:
                              SubscriptionData.find((item) => item.sid === id)
                                ?.plan_name || "",
                          }))}
                          options={SubscriptionData.map((item) => ({
                            value: item.sid,
                            label: item.plan_name,
                          }))}
                          isMulti
                          onChange={(selectedOptions) => {
                            setFieldValue(
                              "subscription_id",
                              selectedOptions.map((option) => option.value)
                            );
                          }}
                        />
                      </Form.Group>
                    </Col> */}
                  </Row>
                  <Row>
                    <Col md={6} className="mb-3">
                      <Form.Group id="firstName">
                        <Form.Label>bookName </Form.Label>
                        <Form.Control
                          type="text"
                          placeholder="Enter bookName"
                          name="data.bookName"
                          value={values.data.bookName}
                          onChange={handleChange}
                        />
                      </Form.Group>
                      <div className="mb-3 text-danger">
                        {errors.code && touched.code && errors.code}
                      </div>
                    </Col>
                    <Col md={6} className="mb-3">
                      <Form.Group id="firstName">
                        <Form.Label>bookType </Form.Label>
                        <Form.Control
                          type="text"
                          placeholder="Enter bookType"
                          name="bookType"
                          value={values.bookType}
                          onChange={handleChange}
                        />
                      </Form.Group>
                      <div className="mb-3 text-danger">
                        {errors.code && touched.code && errors.code}
                      </div>
                    </Col>
                    <Col md={6} className="mb-3">
                      <Form.Group id="firstName">
                        <Form.Label>volume </Form.Label>
                        <Form.Control
                          type="text"
                          placeholder="Enter volume"
                          name="volume"
                          value={values.volume}
                          onChange={handleChange}
                        />
                      </Form.Group>
                      <div className="mb-3 text-danger">
                        {errors.code && touched.code && errors.code}
                      </div>
                    </Col>
                    <Col md={6} className="mb-3">
                      <Form.Group id="firstName">
                        <Form.Label>price </Form.Label>
                        <Form.Control
                          type="text"
                          placeholder="Enter price"
                          name="price"
                          value={values.price}
                          onChange={handleChange}
                        />
                      </Form.Group>
                      <div className="mb-3 text-danger">
                        {errors.code && touched.code && errors.code}
                      </div>
                    </Col>{" "}
                    <Col md={6} className="mb-3">
                      <Form.Group id="firstName">
                        <Form.Label>comboPrice </Form.Label>
                        <Form.Control
                          type="text"
                          placeholder="Enter comboPrice"
                          name="comboPrice"
                          value={values.comboPrice}
                          onChange={handleChange}
                        />
                      </Form.Group>
                      <div className="mb-3 text-danger">
                        {errors.code && touched.code && errors.code}
                      </div>
                    </Col>
                    <Col md={6} className="mb-3">
                      <Form.Group id="firstName">
                        <Form.Label>description </Form.Label>
                        <Form.Control
                          type="text"
                          placeholder="Enter description"
                          name="description"
                          value={values.description}
                          onChange={handleChange}
                        />
                      </Form.Group>
                      <div className="mb-3 text-danger">
                        {errors.discountPrize &&
                          touched.discountPrize &&
                          errors.discountPrize}
                      </div>
                    </Col>
                  </Row>
                </Row>

                <div className="mt-3">
                  <Button
                    variant="primary"
                    type="submit"
                    onClick={handleSubmit}
                  >
                    Update
                  </Button>
                </div>
              </Form>
            )}
          </Formik>
        </Modal>

        <Modal open={EditOfferopen} onClose={onEditCloseOfferModal} center>
          <h2>Edit BookOrder</h2>
          <Formik
            initialValues={editOfferData}
            validationSchema={EditSchema}
            onSubmit={(values) => {
              updateOrderBook(editOfferData._id, values); // Pass the ID and updated data to updateSubcategory
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
                <Row>
                  {/* <Row>
                    <Col md={12} className="mb-3">
                      <Form.Group id="gender">
                        <Form.Label>Select Subscription Plan</Form.Label>
                        <Select
                          name="subscription_id"
                          value={values.subscription_id.map((id) => ({
                            value: id,
                            label:
                              SubscriptionData.find((item) => item.sid === id)
                                ?.plan_name || "",
                          }))}
                          options={SubscriptionData.map((item) => ({
                            value: item.sid,
                            label: item.plan_name,
                          }))}
                          isMulti
                          onChange={(selectedOptions) => {
                            setFieldValue(
                              "subscription_id",
                              selectedOptions.map((option) => option.value)
                            );
                          }}
                        />
                      </Form.Group>
                    </Col>
                  </Row> */}
                  <Row>
                    {/* <Col md={12} className="mb-3">
                      <Form.Group id="firstName">
                        <Form.Label>Title </Form.Label>
                        <Form.Control
                          type="text"
                          placeholder="Enter Offer Title"
                          name="title"
                          value={values.title}
                          onChange={handleChange}
                        />
                      </Form.Group>
                      <div className="mb-3 text-danger">
                        {errors.title && touched.title && errors.title}
                      </div>
                    </Col> */}
                  </Row>

                  <Row>
                    <Col md={6} className="mb-3">
                      <Form.Group id="firstName">
                        <Form.Label>Price </Form.Label>
                        <Form.Control
                          type="text"
                          placeholder="Enter Price"
                          name="Price"
                          value={values.Price}
                          onChange={handleChange}
                        />
                      </Form.Group>
                      <div className="mb-3 text-danger">
                        {errors.code && touched.code && errors.code}
                      </div>
                    </Col>
                    <Col md={6} className="mb-3">
                      <Form.Group id="firstName">
                        <Form.Label>status </Form.Label>
                        <Form.Control
                          type="text"
                          placeholder="Enter status"
                          name="status"
                          value={values.status}
                          onChange={handleChange}
                        />
                      </Form.Group>
                      <div className="mb-3 text-danger">
                        {errors.code && touched.code && errors.code}
                      </div>
                    </Col>
                  </Row>

                  <Row></Row>

                  <div className="mt-3">
                    <Button
                      variant="primary"
                      type="submit"
                      // onClick={handleSubmit}
                    >
                      Update
                    </Button>
                  </div>
                </Row>
              </Form>
            )}
          </Formik>
        </Modal>

        {/* <MDBDataTable striped bordered small data={datatable} /> */}

        <TabContext value={value}>
          <TabList style={tabListStyles} onChange={handleChange}>
            {/* <Tab
              style={
                value === "3" ? { ...tabStyles, ...activeTabStyles } : tabStyles
              }
              label="Book"
              value="3"
            /> */}
            <Tab
              style={
                value === "1" ? { ...tabStyles, ...activeTabStyles } : tabStyles
              }
              label="Book"
              value="1"
            />
            <Tab
              style={
                value === "2" ? { ...tabStyles, ...activeTabStyles } : tabStyles
              }
              label="Book order"
              value="2"
            />
          </TabList>

          {/* <TabPanel value="3">
          <div>
            {isLoadingData ? (
              <div className="loader-container">
                <Image
                  className="loader-element animate__animated animate__jackInTheBox"
                  src={ReactLogo}
                  height={40}
                />
              </div>
            ) : (
              <MaterialReactTable
                autoResetPageIndex={false}
                columns={columns3}
                data={jsonData}
                enableRowOrdering
                enableSorting={false}
                muiTableBodyRowDragHandleProps={({ table }) => ({
                  onDragEnd: () => {
                    const { draggingRow, hoveredRow } = table.getState();
                    if (hoveredRow && draggingRow) {
                      jsonData.splice(
                        hoveredRow.index,
                        0,
                        jsonData.splice(draggingRow.index, 1)[0]
                      );
                      setJsonData([...jsonData]);
                      console.log("new jsonData", jsonData);
                      let position_data = {
                        Coupon_id: [],
                        position: [],
                      };
                      jsonData.forEach((element, index) => {
                        position_data.Coupon_id.push(element._id);
                        position_data.position.push(index + 1);
                      });
                    }
                  },
                })}
              />
            )}
          </div>
        </TabPanel> */}
        {/* <TabList style={tabListStyles} onChange={handleChange1}>
              <Tab
                style={
                  value === "5"
                    ? { ...tabStyles, ...activeTabStyles }
                    : tabStyles
                }
                label="Pending"
                value="5"
              />
              <Tab
                style={
                  value === "6"
                    ? { ...tabStyles, ...activeTabStyles }
                    : tabStyles
                }
                label="Complete"
                value="6"
              />
              <Tab
                style={
                  value === "7"
                    ? { ...tabStyles, ...activeTabStyles }
                    : tabStyles
                }
                label="Processing"
                value="7"
              />
            </TabList> */}
          <TabPanel value="2">
     
          <>
      <Button href="padding#/padding/"style={{ margin: '5px' }}>Pending</Button> 
      <Button href="padding#/Complete"style={{ margin: '5px' }}>Complete</Button> 
      <Button href="padding#/Processing">Processing</Button> 
      
    </>
            {/* <DropdownButton id="dropdown-basic-button" title="Book order">
      <Dropdown.Item href="padding#/padding">Book Pending</Dropdown.Item>
      <Dropdown.Item href="#/action-2">Book Complete</Dropdown.Item>
      <Dropdown.Item href="#/action-3">Book Processing</Dropdown.Item>
    </DropdownButton> */}
            <div>
              {isLoadingData ? (
                <div className="loader-container">
                  <Image
                    className="loader-element animate__animated animate__jackInTheBox"
                    src={ReactLogo}
                    height={40}
                  />
                </div>
              ) : (
                <></>
              )}
            </div>
            {/* <MaterialReactTable
              autoResetPageIndex={false}
              columns={columns2}
              data={jsonData}
              enableRowOrdering
              enableSorting={false}
              muiTableBodyRowDragHandleProps={({ table }) => ({
                onDragEnd: () => {
                  const { draggingRow, hoveredRow } = table.getState();
                  if (hoveredRow && draggingRow) {
                    jsonData.splice(
                      hoveredRow.index,
                      0,
                      jsonData.splice(draggingRow.index, 1)[0]
                    );
                    setJsonData([...jsonData]);
                    console.log("new jsonData", jsonData);
                    let position_data = {
                      Offer_id: [],
                      position: [],
                    };
                    jsonData.forEach((element, index) => {
                      position_data.Offer_id.push(element._id);
                      position_data.position.push(index + 1);
                    });
                  }
                },
              })}
            /> */}
            <MaterialReactTable
              autoResetPageIndex={false}
              columns={columns5}
              data={jsonData}
              enableRowOrdering
              enableSorting={false}
              muiTableBodyRowDragHandleProps={({ table }) => ({
                onDragEnd: () => {
                  const { draggingRow, hoveredRow } = table.getState();
                  if (hoveredRow && draggingRow) {
                    jsonData.splice(
                      hoveredRow.index,
                      0,
                      jsonData.splice(draggingRow.index, 1)[0]
                    );
                    setJsonData([...jsonData]);
                    console.log("new jsonData", jsonData);
                    let position_data = {
                      Offer_id: [],
                      position: [],
                    };
                    jsonData.forEach((element, index) => {
                      position_data.Offer_id.push(element._id);
                      position_data.position.push(index + 1);
                    });
                  }
                },
              })}
            />
          </TabPanel>
          <TabPanel value="1">
            <div>
              {isLoadingData ? (
                <div className="loader-container">
                  <Image
                    className="loader-element animate__animated animate__jackInTheBox"
                    src={ReactLogo}
                    height={40}
                  />
                </div>
              ) : (
                <></>
              )}
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
                    jsonData.splice(
                      hoveredRow.index,
                      0,
                      jsonData.splice(draggingRow.index, 1)[0]
                    );
                    setJsonData([...jsonData]);
                    console.log("new jsonData", jsonData);
                    let position_data = {
                      Offer_id: [],
                      position: [],
                    };
                    jsonData.forEach((element, index) => {
                      position_data.Offer_id.push(element._id);
                      position_data.position.push(index + 1);
                    });
                  }
                },
              })}
            />
            {/* 
<MaterialReactTable
              autoResetPageIndex={false}
              columns={columns5}
              data={jsonData}
              enableRowOrdering
              enableSorting={false}
              muiTableBodyRowDragHandleProps={({ table }) => ({
                onDragEnd: () => {
                  const { draggingRow, hoveredRow } = table.getState();
                  if (hoveredRow && draggingRow) {
                    jsonData.splice(
                      hoveredRow.index,
                      0,
                      jsonData.splice(draggingRow.index, 1)[0]
                    );
                    setJsonData([...jsonData]);
                    console.log("new jsonData", jsonData);
                    let position_data = {
                      Offer_id: [],
                      position: [],
                    };
                    jsonData.forEach((element, index) => {
                      position_data.Offer_id.push(element._id);
                      position_data.position.push(index + 1);
                    });
                  }
                },
              })}
            /> */}
          </TabPanel>
        </TabContext>
      </Card.Body>
    </Card>
  );
};
