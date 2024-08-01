// import React, { useState, useEffect} from 'react';
// // import { Form, Button } from 'react-bootstrap';
// import { MDBDataTable } from "mdbreact";
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import { faEdit, faTrash, faPlus } from "@fortawesome/free-solid-svg-icons";
// import { Formik, Field, ErrorMessage } from "formik";
// import { Modal } from "react-responsive-modal";
// import * as Yup from "yup";
// import { useHistory } from "react-router-dom";
// import axios from "axios";
// import Swal from "sweetalert2";
// import { faEye } from "@fortawesome/free-solid-svg-icons";


// import {
//     Col,
//     Row,
//     Card,
//     Form,
//     Button,
//     InputGroup,
//   } from "@themesberg/react-bootstrap";




// //   const [myData, setMyData] = useState({
// //     title: "",
// //     description: "",
// //    
// //   });


//   const SigninSchema = Yup.object().shape({
//     title: Yup.string().required("Topic name is Required"),
//     description: Yup.string().required("Topic name is Required"),

//   });

//   const EditSchema = Yup.object().shape({
//     title: Yup.string().required("status name is Required"),
//     description: Yup.string().required("amount name is Required"),

//   });

  


// const Dynamicpopup = () => {
//     const [open, setOpen] = useState(false);
//     const onOpenModal = () => setOpen(true);
//     const onCloseModal = () => setOpen(false);
//     const [jsonData, setJsonData] = useState([]);
//     const [isError, setIsError] = useState("");
//     const history = useHistory();


//     const [Editopen, setEditOpen] = useState(false);
//     const onEditOpenModal = () => setEditOpen(true);
//     const onEditCloseModal = () => setEditOpen(false);
//     const [editData, setEditData] = useState({});
    
//     // const [jsonData, setJsonData] = useState([]);
//     const navigateDetails = (userId) => {
//       history.push(`/topics?id=${userId}`);
//     };
    
//   const handleEdit = (data) => {
//     // const fromtime = data.fromtime ? new Date(data.fromtime) : "";
//     // const totime = data.totime ? new Date(data.totime) : "";
//     // setEditData({ ...data, fromtime, totime, examType: ((fromtime && totime) ? "Time Period" : "Always Live") }); // Set the data of the selected row
//     // setEditOpen(true); // Open the modal
//   };
  
//   useEffect(() => {
//     // getMyCategoryData();
//     getMyPopOpData();
//     // getMyTopicsData();
//     // getMyExamData();
//     // getMySubscriptionData();
//   }, []);

//     const [datatable, setDatatable] = useState({

        
//         columns: [
//           {
//             label: "No",
//             field: "id",
//             width: 270,
//           },
//           {
//             label: "title",
//             field: "title",
//             width: 150,
//             attributes: {
//               "aria-controls": "DataTable",
//               "aria-label": "Name",
//             },
//           },
//           {
//             label: "description",
//             field: "description",  
//             width: 100,
//           },
     
//           // {
//           //   label: "prizeAmount",
//           //   field: "prizeAmount",
//           //   width: 100,
//           // },
//           // {
//           //   label: "match_id",
//           //   field: "match_id",
//           //   width: 100,
//           // },
          
        
//           {
//             label: "Action",
//             field: "actions",
//             width: 100,
//           },
//         ],
//       });



//       // const getMyPopOpData = async () => {
//       //     console.log("12345");
//       //   const token = localStorage.getItem("token");
//       //   try {
//       //     const res = await axios.get(
//       //       `${process.env.REACT_APP_BASE_URL}/api/getAllPopOp`,
//       //       {
//       //         headers: { Authorization: token },
//       //       }
//       //     );
//       //     const data = res.data?.map((item, index) => {
//       //       return {
//       //         id: index + 1,
//       //         title: item.title,
//       //         description: item.description,
    
          
              
//       //         actions: (
//       //           <div>
//       //             <FontAwesomeIcon icon={faEdit} onClick={() => handleEdit(item)} />
    
//       //             {/* <FontAwesomeIcon
//       //               className="mx-3"
//       //               icon={faTrash}
//       //               onClick={() => handleDelete(item._id)}
//       //             /> */}
    
//       //             {/* <FontAwesomeIcon
//       //               icon={faEye}
//       //               onClick={() => navigateDetails(item._id)}
//       //             /> */}
//       //           </div>
//       //         ),
//       //       };
//       //     });
//       //     setJsonData(res.data);
//       //     setDatatable((prevState) => ({
//       //       ...prevState,
//       //       rows: data,
//       //     }));
//       //   } catch (error) {
//       //     setIsError(error.response);
//       //   }
//       // };
      
//       const getMyPopOpData = async () => {
//         const token = localStorage.getItem("token");
//         try {
//             const res = await axios.get("https://kxq09c6p-3003.inc1.devtunnels.ms/api/getAllPopOp")
//                 // {
//                 //     headers: { Authorization: token },
//                 // }
            
// // console.log("ertghjk");
//             const data = res.data?.map((item, index) => {
//                 return {
//                     id: index + 1,
//                     title: item.title,
//                     description: item.description,
              
//                     actions: (
//                         <div>
//                             <FontAwesomeIcon icon={faEdit} onClick={() => handleEdit(item)} />

//                             {/* <FontAwesomeIcon
//                                 className="mx-3"
//                                 icon={faTrash}
//                                 onClick={() => handleDelete(item._id)}
//                             /> */}

//                             <FontAwesomeIcon
//                                 icon={faEye}
//                                 onClick={() => navigateDetails(item._id)}
//                             />
//                         </div>
//                     ),
//                 };
//             });
//             // setJsonData(res.data);
//             setDatatable((prevState) => ({
//                 ...prevState,
//                 rows: data,
//             }));
//         } catch (error) {
//             setIsError(error.response);
//         }
//     };



//     const updatepopup = async (id, updatedData) => {
//       try {
//         const token = localStorage.getItem("token");
//         const res = await axios.put(
//           `${process.env.REACT_APP_BASE_URL}/api/updateSubcategory/${id}`,
//           updatedData,
//           {
//             headers: { Authorization: token },
//           }
//         );
//         console.log(res.data); // Log the response or handle it as required.
//         // Optionally, you can refetch the subcategory data after successful update.
//         // getMySubCategoryData();
//         onEditCloseModal(); // Close the modal after successful update.
//         Swal.fire({
//           position: "center",
//           icon: "success",
//           title: " Subcategory Updated Successfully",
//           showConfirmButton: false,
//           timer: 1500,
//         });
//         getMyPopOpData();
//       } catch (error) {
//         console.error(error.response); // Handle error responses
//       }
//     };



    
//   const getMyPostData = async (values) => {
//     const token = localStorage.getItem("token");
//     // console.log("dfgh")
//     try {
//       const res = await axios.post(
//         `${process.env.REACT_APP_BASE_URL}/api/CreatePopOp`,
//         values,
//         {
//           headers: { Authorization: `${token}` },
//         }
//       );
//       setFormData(res.data);
//       Swal.fire({
//         position: "center",
//         icon: "success",
//         title: "Your work has been saved",
//         showConfirmButton: false,
//         timer: 1500,
//       });
//       getMyPopOpData();
//       onCloseModal();
//       setFormData({
//         title: "",
//         description: "",
//       });
//     } catch (error) {
//       setIsError(error.response.data.err.message);
//     }
//   };

//     const [formData, setFormData] = useState({
//       title: "",
//       description: "",
   
//     });

//     const handleChange = (e) => {
//         setFormData({
//             ...formData,
//             [e.target.name]: e.target.value,
//         });
//     };

//     const handleSubmit = (e) => {
//         e.preventDefault();
//         // Handle form submission here
//         console.log(formData);
//     };

//     return (
//         <Card border="light" className="bg-white shadow-sm mb-4">
//          <Card.Body>
//          <h5 className="mb-4">Dynamic Popup</h5>
//          <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center py-4">
//           <button className="btn btn-primary" onClick={onOpenModal}>
//             Add Dynamic Popup
//             <FontAwesomeIcon icon={faPlus} className="mx-2" />
//           </button>
          
//         </div>

//         <Modal open={open} onClose={onCloseModal} center>
//           <h2>Add Dynamic Popup</h2>
//           <Formik
//             initialValues={formData}
//             validationSchema={SigninSchema}
//             onSubmit={(values) => {
//               getMyPostData(values);
//             }}
//           >
//             {({
//               values,
//               errors,
//               touched,
//               handleChange,
//               handleBlur,
//               handleSubmit,
//               isSubmitting,
        
//             }) => (
//               <Form>
//                 <Row>
                

//                   <Col md={12} className="mb-3">
//                     <Form.Group id="firstName">
//                       <Form.Label>title</Form.Label>
//                       <Form.Control
//                         type="title"
//                         placeholder="Title"
//                         name="title"
//                         value={values.title}
//                         onChange={handleChange}
//                       />
//                     </Form.Group>
//                     <div className="mb-3 text-danger">
//                       {errors.topic_name &&
//                         touched.topic_name &&
//                         errors.topic_name}
//                     </div>
//                   </Col>
// {/*                   
//                   <Col md={12} className="mb-3">
//   <Form.Group id="firstName">
//     <Form.Label>Droup</Form.Label>
//     <Form.Control
//       as="select"
//       name="Droup"
//       value={values.Droup}
//       onChange={handleChange}
//     >
//       <option value="Group">Group</option>
//       <option value="All">All</option>
//       <option value="Subscription Plan">Subscription Plan</option>
//     </Form.Control>
//   </Form.Group>
//   <div className="mb-3 text-danger">
//     {errors.topic_name &&
//       touched.topic_name &&
//       errors.topic_name}
//   </div>
// </Col> */}


                  

         
//                          <Col md={12} className="mb-3 ">
//                         <Form.Group id="firstName">
//                           <Form.Label>description</Form.Label>
//                           {/* <Form.Control
//                           type="text"
//                           placeholder="Enter description"
//                           name="description"
//                           value={values.description}
//                           onChange={handleChange}
//                         /> */}
//                           <textarea
//                             class="form-control"
//                             id="description"
//                             rows="6"
//                             placeholder="Enter Description"
//                             name="description"
//                             value={values.description}
//                             onChange={handleChange}
//                           ></textarea>
//                           {/* <JoditEditor
//                                   ref={editor}
//                                   value={values.description}
//                                   onChange={handleChange}                                 
//                                   tabIndex={1} // tabIndex of textarea    
                                                            
//                                 /> */}
//                         </Form.Group>
//                         <div className="mb-3 text-danger">
//                           {errors.description &&
//                             touched.description &&
//                             errors.description}
//                         </div>
//                       </Col>
                        
         
//                 </Row>
                

//                 <div className="mt-3">
//                   <Button
//                     variant="primary"
//                     type="submit"
//                     onClick={handleSubmit}
//                   >
//                     Ok
//                   </Button>
//                 </div>
//               </Form>
//             )}
//           </Formik>
//         </Modal>

//         <Modal open={Editopen} onClose={onEditCloseModal} center>
//           <h2>Edit SubCategory</h2>
//           <Formik
//             initialValues={editData}
//             validationSchema={EditSchema}
//             onSubmit={(values) => {
//               updatepopup(editData._id, values); // Pass the ID and updated data to updateSubcategory
//             }}
//           >
//             {({
//               values,
//               errors,
//               touched,
//               handleChange,
//               handleBlur,
//               handleSubmit,
//               isSubmitting,
//               /* and other goodies */
//             }) => (
//               <Form>
//                 <Row>
//                   <Col md={12} className="mb-3">
//                     <Form.Group id="firstName">
//                       <Form.Label>Subcategory Name</Form.Label>
//                       <Form.Control
//                         type="text"
//                         placeholder="Enter your first name"
//                         name="subcategory_name"
//                         value={values.subcategory_name}
//                         onChange={handleChange}
//                       />
//                     </Form.Group>
//                     <div className="mb-3 text-danger">
//                       {errors.subcategory_name &&
//                         touched.subcategory_name &&
//                         errors.subcategory_name}
//                     </div>
//                   </Col>
// {/* 
//                   <Col md={12} className="mb-3">
//                     <Form.Group id="gender">
//                       <Form.Label>Select Category</Form.Label>
//                       <Form.Select
//                         name="category_id"
//                         value={values.category_id}
//                         onChange={handleChange}
//                       >
//                         <option>Select Category</option>
//                         {categoryData.map((item, index) => (
//                           <option value={item._id}>{item.category_name}</option>
//                         ))}
//                       </Form.Select>
//                     </Form.Group>
//                   </Col> */}
//                 </Row>

//                 <Row>
//                   <Col md={12} className="mb-3">
//                     <Form.Group id="lastName">
//                       <Form.Label>Description</Form.Label>
//                       {/* <Form.Control
//                         type="text"
//                         placeholder="Enter Description"
//                         name="description"
//                         value={values.description}
//                         onChange={handleChange}
//                       /> */}
//                         <textarea
//                       class="form-control"
//                       id="description"
//                       rows="6"
//                       placeholder="Enter Description"
//                       name="description"
//                       value={values.description}
//                       onChange={handleChange}
//                     ></textarea>
//                     </Form.Group>
//                     <div className="mb-3 text-danger">
//                       {errors.description &&
//                         touched.description &&
//                         errors.description}
//                     </div>
//                   </Col>
//                 </Row>

//                 <div className="mt-3">
//                   <Button
//                     variant="primary"
//                     type="submit"
//                     onClick={handleSubmit}
//                   >
//                     Update
//                   </Button>
//                 </div>
//               </Form>
//             )}
//           </Formik>
//         </Modal>
//          </Card.Body>

       
//         <MDBDataTable striped bordered small data={datatable} />
//         </Card>
    
//     );
// };

// export default Dynamicpopup;
