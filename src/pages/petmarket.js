import React, { useState, useEffect, useMemo } from "react";

import {
  Col,
  Row,
  Card,
  Form,
  Button,
  InputGroup,
} from "@themesberg/react-bootstrap";
import "react-time-picker/dist/TimePicker.css";
import { Formik, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import axios from "axios";
import Swal from "sweetalert2";
import "react-responsive-modal/styles.css";
// import { Modal } from "react-responsive-mohttp://localhost:3000/dal";
import Modal from "react-responsive-modal";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faTrash, faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import DownloadExcelButton from "./downloadExel";
import { useLocation } from "react-router-dom";
import { faEye, faPlus } from "@fortawesome/free-solid-svg-icons";
import { useHistory } from "react-router-dom";
import { MaterialReactTable } from "material-react-table";
import Tab from "@mui/material/Tab";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import TabPanel from "@mui/lab/TabPanel";
import { ArcElement } from "chart.js";


export const Petmarket = () => {
  const [open, setOpen] = useState(false);
  const onOpenModal = () => setOpen(true);
  const onCloseModal1 = () => setOpen1(false);
  const [open1, setOpen1] = useState(false);

  // const onCloseModal = () => setOpen1(false);
  // const onOpenModal = () => setOpen1(true);
  // const [open1, setOpen1] = useState(true)
  const onCloseModal = () => setOpen(false);
  const [updatedBookData, setUpdatedBookData] = useState(null);
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
    vendorId: {
      uName: '',
      uMobile: ''
    },
    uEmail: '',
    uType: '',
    productName: '',
    productImg: '',
    productPrice: '',
    discountPrice: '',
    productQuantity: '',
    productDetails: {
      manufacturer: '',
      address: ''
    }
  });
  const initialValues = {
    vendorId: {
      uName: '',
      uMobile: ''
    },
    uEmail: '',
    uType: '',
    productName: '',
    productImg: '',
    productPrice: '',
    discountPrice: '',
    productQuantity: '',
    productDetails: {
      manufacturer: '',
      address: ''
    }
  };

  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const id = queryParams.get("id");
  const [isError, setIsError] = useState("");
  const [isLoadingData, setIsLoadingData] = useState(true);
  const [editData, setEditData] = useState({});
  const [editOfferData, setEdiOfferData] = useState({});
  const history = useHistory();
  useEffect(() => {
    getProduct();
    getOrderdetail();
    getProduct();
    }, []);
  const navigateDetails = (orderLocation, orderDetails) => {
    console.log("234567", orderDetails);
    history.push({
      pathname: `/Petmarketdetailss`,
      state: { orderLocation, orderDetails }
    });
  };


  const navigateDetails1 = (items) => {
    console.log("itemsitemsitemsitemsitemsitems", items);
    history.push({
      pathname: "/Petmarketdetails",
      state: {items}
    });
  };
  const handleEdit = (data) => {
    setEditData(data);
    setEditOpen(true);
  };
  // order deatils //
  const columns1 = useMemo(
    () => [
      { accessorKey: "uName", header: "Name" },
      { accessorKey: "uMobile", header: "MOBILE" },
      { accessorKey: "productName", header: "Product Name" },
      { accessorKey: "productImg", header: "Product Image" },
      { accessorKey: "orderPrice", header: "orderPrice" },
      { accessorKey: "orderQuantity", header: "orderQuantity" },
      { accessorKey: "deliveryCharge", header: "deliveryCharge" },
      { accessorKey: "orderTotal", header: "orderTotal" },
      { accessorKey: "orderDateTime", header: "orderDateTime" },
      { accessorKey: "paymentMethod", header: "paymentMethod" },
      { accessorKey: "paymentType", header: "paymentType" },
      { accessorKey: "orderStatus", header: "orderStatus" },
      { accessorKey: "orderCancelReason", header: "orderCancelReason" },
      { accessorKey: "remarks", header: "remarks" },
      { accessorKey: "actions", header: "ACTIONS" },
    ],
    []
  );
  // product //
  const columns = useMemo(
    () => [
      { header: "Name", accessorKey: "pName" },
      { header: "Mobile", accessorKey: "pMobile" },
      { header: "Actions", accessorKey: "actions" },
    
    
    ],
    []
  );
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
    const initialValues = {
      vendorId: {
        uName: "",
        uMobile: ""
      },
      productName: "",
      productImg: "",
      productPrice: "",
      discountPrice: "",
      productQuantity: "",
      productDetails: {
        manufacturer: "",
        address: ""
      }
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
  useEffect(() => {
    getProduct();
  }, []);

  useEffect(() => {
    if (value === "1") {
      getOrderdetail();
    } else if (value === "2") {
      getProduct();
    }
  }, [value]);
  const getProduct = async () => {
    const token1 = localStorage.getItem("token1");
    const accessToken = localStorage.getItem("accessToken");
    // const navigate = useNavigate(); // if using react-router-dom for navigation
  
    try {
      const requestBody = {
        latLong: "20.8009246,70.6960306",
        radius: "3000000000",
        serviceId: "6661af24bba1c398c8b9a854",
        find: { 
          serviceType: {
            $elemMatch: {
              serviceId: "6661af24bba1c398c8b9a854"
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
        // const businessName = item.serviceType[0]?.businessName || '';
  
        return {
          pName: personalDetails.pName,
          pMobile: personalDetails.pMobile,
          // businessName: businessName,
          actions: (
            <div>
              <FontAwesomeIcon
                icon={faEye}
                onClick={() => navigateDetails1(item)}
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

  const getOrderdetail = async () => {
    const token1 = localStorage.getItem("token1");
    const accessToken = localStorage.getItem("accessToken");
    try {
      let res = await axios.get(
        `https://pets.dev.savaapi.com/api/schema/dev1/mongodb/pets/pet_market_orders?deep=userId,orderDetails.productId`,
        {
          headers: {
            "x-am-authorization": token1,
            "x-am-user-authorization": accessToken
          },
        }
      );

      console.log(res.data, "qwertyuiop");
      const data = res.data?.data?.map((item, index) => {
        const orderDetails = item.orderDetails[0]; // assuming only one order detail
        const productName = orderDetails.productId.productName;
        const productImg = orderDetails.productId.productImg[0].photo; // assuming only one product image

        return {
          uName: item.userId.uName,
          uMobile: item.userId.uMobile,
          orderPrice: item.orderPrice,
          orderQuantity: item.orderQuantity,
          deliveryCharge: item.deliveryCharge,
          orderTotal: item.orderTotal, productImg: (
            <img src={productImg} alt={productName} width="50" height="50" />
          ),
          orderDateTime: item.orderDateTime,
          paymentMethod: item.paymentDetails.paymentMethod,
          paymentType: item.paymentDetails.paymentType,
          orderStatus: item.orderStatus,
          orderCancelReason: item.orderCancelReason,
          remarks: item.remarks,
          productName,
          productImg: (
            <img src={productImg} alt={productName} width="50" height="50" />
          ),

          actions: (
            <div>
              <FontAwesomeIcon
                icon={faEye}
                className="mx-3"
                onClick={() => navigateDetails(item.orderLocation, item.orderDetails)}
              />
              <FontAwesomeIcon
                icon={faTrash}
                className="mx-3"
                onClick={() => handleDelete(item._id)}
              />
            </div>
          ),
        };
      });
      const reversedData = data.reverse();
      setJsonData(data);
    } catch (error) {
      console.error(error);
    }
  };
  const handleDelete = async (id) => {
    try {
      const token1 = localStorage.getItem("token1");
      const accessToken = localStorage.getItem("accessToken");
      const res = await axios.delete(
        `https://pets.dev.savaapi.com/api/schema/dev1/mongodb/pets/order_details/${id}`,
        {
          headers: {
            "x-am-authorization": token1,
            "x-am-user-authorization": accessToken
          }
        }
      );
      console.log(res.data);
      Swal.fire("Deleted!", "Orderdetail has been deleted.", "success");
      getProduct();
    } catch (error) {
      console.error(error.response);
      Swal.fire("Error", "Failed to delete Orderdetail.", "error");
    }
  };

  const handleDelete1 = async (id) => {
    try {
      const token1 = localStorage.getItem("token1");
      const accessToken = localStorage.getItem("accessToken");
      const res = await axios.delete(
        `https://pets.dev.savaapi.com/api/schema/dev1/mongodb/pets/products/${id}`,
        {
          headers: {
            "x-am-authorization": token1,
            "x-am-user-authorization": accessToken
          }
        }
      );
      console.log(res.data);
      Swal.fire("Deleted!", "Product has been deleted.", "success");
      getOrderdetail()
    } catch (error) {
      console.error(error.response);
      Swal.fire("Error", "Failed to delete Product.", "error");
    }
  };

  const EditSchema = Yup.object().shape({
    vendorId: Yup.object().shape({
      uName: Yup.string().required("Name is required"),
      uMobile: Yup.string().required("Mobile is required"),
    }),
    productName: Yup.string().required("Product Name is required"),
    productImg: Yup.string().required("Product Img is required"),
    productPrice: Yup.number().required("Product Price is required"),
    discountPrice: Yup.number().required("Discount Price is required"),
    productQuantity: Yup.number().required("Product Quantity is required"),
    productDetails: Yup.object().shape({
      manufacturer: Yup.string().required("Manufacturer is required"),
      address: Yup.string().required("Address is required"),
    }),
  });

  const SigninSchema = Yup.object().shape({
    vendorId: Yup.object().shape({
      uName: Yup.string().required('Name is required'),
      uMobile: Yup.string().required('Mobile is required'),
    }),
    uEmail: Yup.string().email('Invalid email').required('Email is required'),
    uType: Yup.string().required('User type is required'),
    productName: Yup.string().required('Product Name is required'),
    productImg: Yup.string().required('Product Img is required'),
    productPrice: Yup.number().required('Product Price is required'),
    discountPrice: Yup.number().required('Discount Price is required'),
    productQuantity: Yup.number().required('Product Quantity is required'),
    productDetails: Yup.object().shape({
      manufacturer: Yup.string().required('Manufacturer is required'),
      address: Yup.string().required('Address is required'),
    }),
  });

  const updateProduct = async (productId, updatedData) => {
    const token1 = localStorage.getItem("token1");
    const accessToken = localStorage.getItem("accessToken");

    try {
      console.log("Updating product with ID:", productId);
      console.log("Updated data being sent:", updatedData);

      const res = await axios.put(
        `https://pets.dev.savaapi.com/api/schema/dev1/mongodb/pets/products/update-by-id/${productId}/`,
        updatedData,
        {
          headers: {
            "x-am-authorization": token1,
            "x-am-user-authorization": accessToken,
          },
        }
      );

      console.log("Response from API:", res.data);
      getProduct();
      onEditCloseModal();
      Swal.fire({
        position: "center",
        icon: "success",
        title: "Pet product Updated Successfully",
        showConfirmButton: false,
        timer: 1500,
      });
    } catch (error) {
      if (error.response) {
        console.error("Error response data:", error.response.data);
        console.error("Error response status:", error.response.status);
        console.error("Error response headers:", error.response.headers);
      } else if (error.request) {
        console.error("Error request:", error.request);
      } else {
        console.error("Error message:", error.message);
      }
      console.error("Error config:", error.config);
    }
  };


 
  const createServices = async (values) => {
    try {
      const res = await axios.post(
        'https://pets.dev.savaapi.com/api/schema/dev1/mongodb/pets/products/save-single-or-multiple',
        values
      );

      setOpen(true);

      Swal.fire({
        position: "center",
        icon: "success",
        title: "Product has been added successfully",
        showConfirmButton: false,
        timer: 1500,
      });


    } catch (error) {
      console.error("Error adding product:", error);
      Swal.fire({
        position: "center",
        icon: "error",
        title: "Failed to add product",
        text: error.message,
        showConfirmButton: true,
      });
    }
  };

  const handleSubmit = (values) => {
    console.log("Updating product with values:", values);
    // updateProduct(editData._id, values);
  };

  const handleChange = (event, newValue) => {
    console.log("🚀  handleChange  newValue:", newValue);
    if (newValue === "1") {
      getOrderdetail();
    } else {
      // getMyBookorderData();
    }
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


  return (

    <Card border="light" className="bg-white shadow-sm mb-4">
      <Card.Body>
        <h4
          style={{ marginBottom: "-60px" }}>
          Pet market Place</h4>

        <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center py-4">
          <div className="">
            {/* 
          <button className="btn btn-primary" style={{ marginLeft: 5 }} onClick={onOpenModal}>
        Add Book
        <FontAwesomeIcon icon={faPlus} className="mx-2" />
      </button> */}
          </div>
          <DownloadExcelButton jsonData={jsonData} fileName="Pet market" />
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


          <TabPanel value="2">

            <div class="d-flex justify-content-between align-items-center mb-4">
              <h4 class="mb-0">Pet Product</h4>
              {/* <Button class="btn btn-primary" onClick={() => setOpen(true)}>
                Add Product
                <FontAwesomeIcon icon={faPlus} className="mx-4" />
              </Button> */}
            </div>

            <Modal open={open} onClose={() => setOpen(false)} center>
              <h2>Add Product</h2>
              <Formik
                initialValues={initialValues}
                validationSchema={SigninSchema}
                onSubmit={createServices}
              >
                {({ values, errors, touched, handleChange, handleBlur, handleSubmit, isSubmitting }) => (
                  <Form onSubmit={handleSubmit}>
                    <Row>
                      <Col md={12} className="mt-4">
                        <Form.Group controlId="vendorId.uName">
                          <Form.Label>Name</Form.Label>
                          <Form.Control
                            type="text"
                            name="vendorId.uName"
                            placeholder="Enter Vendor Name"
                            value={values.vendorId.uName}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            isInvalid={touched.vendorId?.uName && !!errors.vendorId?.uName}
                          />
                          <Form.Control.Feedback type="invalid">
                            {errors.vendorId?.uName}
                          </Form.Control.Feedback>
                        </Form.Group>
                      </Col>

                      <Col md={12} className="mt-4">
                        <Form.Group controlId="vendorId.uMobile">
                          <Form.Label>Mobile</Form.Label>
                          <Form.Control
                            type="text"
                            name="vendorId.uMobile"
                            placeholder="Enter Vendor Mobile"
                            value={values.vendorId.uMobile}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            isInvalid={touched.vendorId?.uMobile && !!errors.vendorId?.uMobile}
                          />
                          <Form.Control.Feedback type="invalid">
                            {errors.vendorId?.uMobile}
                          </Form.Control.Feedback>
                        </Form.Group>
                      </Col>

                      <Col md={12} className="mt-4">
                        <Form.Group controlId="productName">
                          <Form.Label>Product Name</Form.Label>
                          <Form.Control
                            type="text"
                            name="productName"
                            placeholder="Enter Product Name"
                            value={values.productName}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            isInvalid={touched.productName && !!errors.productName}
                          />
                          <Form.Control.Feedback type="invalid">
                            {errors.productName}
                          </Form.Control.Feedback>
                        </Form.Group>
                      </Col>

                      <Col md={12} className="mt-4">
                        <Form.Group controlId="productImg">
                          <Form.Label>Product Img</Form.Label>
                          <Form.Control
                            type="text"
                            name="productImg"
                            placeholder="Enter Product Img"
                            value={values.productImg}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            isInvalid={touched.productImg && !!errors.productImg}
                          />
                          <Form.Control.Feedback type="invalid">
                            {errors.productImg}
                          </Form.Control.Feedback>
                        </Form.Group>
                      </Col>

                      <Col md={12} className="mt-4">
                        <Form.Group controlId="productPrice">
                          <Form.Label>Product Price</Form.Label>
                          <Form.Control
                            type="text"
                            name="productPrice"
                            placeholder="Enter Product Price"
                            value={values.productPrice}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            isInvalid={touched.productPrice && !!errors.productPrice}
                          />
                          <Form.Control.Feedback type="invalid">
                            {errors.productPrice}
                          </Form.Control.Feedback>
                        </Form.Group>
                      </Col>

                      <Col md={12} className="mt-4">
                        <Form.Group controlId="discountPrice">
                          <Form.Label>Discount Price</Form.Label>
                          <Form.Control
                            type="text"
                            name="discountPrice"
                            placeholder="Enter Discount Price"
                            value={values.discountPrice}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            isInvalid={touched.discountPrice && !!errors.discountPrice}
                          />
                          <Form.Control.Feedback type="invalid">
                            {errors.discountPrice}
                          </Form.Control.Feedback>
                        </Form.Group>
                      </Col>

                      <Col md={12} className="mt-4">
                        <Form.Group controlId="productQuantity">
                          <Form.Label>Product Quantity</Form.Label>
                          <Form.Control
                            type="text"
                            name="productQuantity"
                            placeholder="Enter Product Quantity"
                            value={values.productQuantity}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            isInvalid={touched.productQuantity && !!errors.productQuantity}
                          />
                          <Form.Control.Feedback type="invalid">
                            {errors.productQuantity}
                          </Form.Control.Feedback>
                        </Form.Group>
                      </Col>

                      <Col md={12} className="mt-4">
                        <Form.Group controlId="productDetails.manufacturer">
                          <Form.Label>Manufacturer</Form.Label>
                          <Form.Control
                            type="text"
                            name="productDetails.manufacturer"
                            placeholder="Enter Manufacturer"
                            value={values.productDetails.manufacturer}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            isInvalid={touched.productDetails?.manufacturer && !!errors.productDetails?.manufacturer}
                          />
                          <Form.Control.Feedback type="invalid">
                            {errors.productDetails?.manufacturer}
                          </Form.Control.Feedback>
                        </Form.Group>
                      </Col>

                      <Col md={12} className="mt-4">
                        <Form.Group controlId="productDetails.address">
                          <Form.Label>Address</Form.Label>
                          <Form.Control
                            type="text"
                            name="productDetails.address"
                            placeholder="Enter Address"
                            value={values.productDetails.address}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            isInvalid={touched.productDetails?.address && !!errors.productDetails?.address}
                          />
                          <Form.Control.Feedback type="invalid">
                            {errors.productDetails?.address}
                          </Form.Control.Feedback>
                        </Form.Group>
                      </Col>

                      <Col md={12} className="mt-3">
                        <Button
                          variant="primary"
                          type="submit"
                          disabled={isSubmitting}
                        >
                          Save
                        </Button>
                      </Col>
                    </Row>
                  </Form>
                )}
              </Formik>
            </Modal>

            <Modal open={Editopen} onClose={onEditCloseModal} center>
              <h2>Edit Vendor</h2>
              <Formik
                initialValues={editData}
                validationSchema={EditSchema}
                onSubmit={(values) => {
                  const updatedData = {
                    vendorId: values.vendorId._id,
                    serviceCategory: values.serviceCategory,
                    productFor: values.productFor,
                    productName: values.productName,
                    productImg: values.productImg,
                    productPrice: values.productPrice,
                    discountPercentage: values.discountPercentage,
                    discountPrice: values.discountPrice,
                    productQuantity: values.productQuantity,
                    productRating: values.productRating,
                    productDetails: {
                      manufacturer: values.productDetails.manufacturer,
                      address: values.productDetails.address,
                      includedComponents: values.productDetails.includedComponents,
                      genericName: values.productDetails.genericName,
                      countryOfOrigin: values.productDetails.countryOfOrigin,
                    },
                    productCategory: values.productCategory,
                    userId: values.userId,
                  };

                  updateProduct(editData._id, updatedData);
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
                }) => (
                  <Form onSubmit={handleSubmit}>
                    <Row>
                      <Col md={12} className="mb-3">
                        <Form.Group id="vendorId.uName">
                          <Form.Label>Name</Form.Label>
                          <Form.Control
                            type="text"
                            placeholder="Enter your Name"
                            name="vendorId.uName"
                            value={values.vendorId.uName}
                            onChange={handleChange}
                          />
                          <div className="mb-3 text-danger">
                            {errors.vendorId?.uName && touched.vendorId?.uName && errors.vendorId.uName}
                          </div>
                        </Form.Group>
                      </Col>
                      <Col md={12} className="mb-3">
                        <Form.Group id="vendorId.uMobile">
                          <Form.Label>Mobile</Form.Label>
                          <Form.Control
                            type="number"
                            placeholder="Enter phone Mobile"
                            name="vendorId.uMobile"
                            value={values.vendorId.uMobile}
                            onChange={handleChange}
                          />
                          <div className="mb-3 text-danger">
                            {errors.vendorId?.uMobile && touched.vendorId?.uMobile && errors.vendorId.uMobile}
                          </div>
                        </Form.Group>
                      </Col>
                    </Row>
                    <Row>
                      <Col md={12} className="mb-3">
                        <Form.Group id="productName">
                          <Form.Label>Product Name</Form.Label>
                          <Form.Control
                            type="text"
                            placeholder="Enter Product Name"
                            name="productName"
                            value={values.productName}
                            onChange={handleChange}
                          />
                          <div className="mb-3 text-danger">
                            {errors.productName && touched.productName && errors.productName}
                          </div>
                        </Form.Group>
                      </Col>
                      <Col md={12} className="mb-3">
                        <Form.Group id="productImg">
                          <Form.Label>Product Img</Form.Label>
                          <Form.Control
                            type="text"
                            placeholder="Enter Product Img"
                            name="productImg"
                            value={values.productImg}
                            onChange={handleChange}
                          />
                          <div className="mb-3 text-danger">
                            {errors.productImg && touched.productImg && errors.productImg}
                          </div>
                        </Form.Group>
                      </Col>
                      <Col md={12} className="mb-3">
                        <Form.Group id="productPrice">
                          <Form.Label>Product Price</Form.Label>
                          <Form.Control
                            type="number"
                            placeholder="Enter Product Price"
                            name="productPrice"
                            value={values.productPrice}
                            onChange={handleChange}
                          />
                          <div className="mb-3 text-danger">
                            {errors.productPrice && touched.productPrice && errors.productPrice}
                          </div>
                        </Form.Group>
                      </Col>
                      <Col md={12} className="mb-3">
                        <Form.Group id="discountPrice">
                          <Form.Label>Discount Price</Form.Label>
                          <Form.Control
                            type="number"
                            placeholder="Enter Discount Price"
                            name="discountPrice"
                            value={values.discountPrice}
                            onChange={handleChange}
                          />
                          <div className="mb-3 text-danger">
                            {errors.discountPrice && touched.discountPrice && errors.discountPrice}
                          </div>
                        </Form.Group>
                      </Col>
                      <Col md={12} className="mb-3">
                        <Form.Group id="productQuantity">
                          <Form.Label>Product Quantity</Form.Label>
                          <Form.Control
                            type="number"
                            placeholder="Enter Product Quantity"
                            name="productQuantity"
                            value={values.productQuantity}
                            onChange={handleChange}
                          />
                          <div className="mb-3 text-danger">
                            {errors.productQuantity && touched.productQuantity && errors.productQuantity}
                          </div>
                        </Form.Group>
                      </Col>
                      <Col md={12} className="mb-3">
                        <Form.Group id="manufacturer">
                          <Form.Label>Manufacturer</Form.Label>
                          <Form.Control
                            type="text"
                            placeholder="Enter Manufacturer"
                            name="productDetails.manufacturer"
                            value={values.productDetails.manufacturer}
                            onChange={handleChange}
                          />
                          <div className="mb-3 text-danger">
                            {errors.productDetails?.manufacturer && touched.productDetails?.manufacturer && errors.productDetails.manufacturer}
                          </div>
                        </Form.Group>
                      </Col>
                      <Col md={12} className="mb-3">
                        <Form.Group id="address">
                          <Form.Label>Address</Form.Label>
                          <Form.Control
                            type="text"
                            placeholder="Enter Address"
                            name="productDetails.address"
                            value={values.productDetails.address}
                            onChange={handleChange}
                          />
                          <div className="mb-3 text-danger">
                            {errors.productDetails?.address && touched.productDetails?.address && errors.productDetails.address}
                          </div>
                        </Form.Group>
                      </Col>
                    </Row>
                    <div className="mt-3">
                      <Button variant="primary" type="submit" disabled={isSubmitting}>
                        Update
                      </Button>
                    </div>
                  </Form>
                )}
              </Formik>
            </Modal>

            <MaterialReactTable
              autoResetPageIndex={false}
              columns={columns}
              data={jsonData}
              enableRowOrdering
              initialState={columns}
              enableSorting={true}
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
          </TabPanel>
          <TabPanel value="1">

            <div>
              {/* <MDBDataTable striped bordered small data={datatable} /> */}
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

          </TabPanel>
        </TabContext>
      </Card.Body>
    </Card> 
  );
};
export default Petmarket;