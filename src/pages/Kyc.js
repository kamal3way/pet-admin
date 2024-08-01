import React, { useState, useEffect, useMemo } from "react";
import { Stack, Pagination, TextField } from "@mui/material";
import {
  Col,
  Row,
  Card,
  Form,
  Button,
  DropdownButton,
  Dropdown,
} from "@themesberg/react-bootstrap";
import "react-time-picker/dist/TimePicker.css";
import { Formik } from "formik";
import axios from "axios";
import Swal from "sweetalert2";
import * as Yup from "yup";
import "react-responsive-modal/styles.css";
import { Modal } from "react-responsive-modal";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEllipsisV,
  faEye,
  faTrash,
  faEdit,
} from "@fortawesome/free-solid-svg-icons";
import DownloadExcelButton from "./downloadExel";
import { MaterialReactTable } from "material-react-table";
import TabPanel from "@mui/lab/TabPanel";
import Tab from "@mui/material/Tab";
import TabContext from "@mui/lab/TabContext";
import { useHistory } from "react-router-dom";
import TabList from "@mui/lab/TabList";
import { Image } from "@themesberg/react-bootstrap";
import ReactLogo from "../assets/img/technologies/loading-loader-svgrepo-com.svg";

export const Kyc = () => {
  const [jsonData, setJsonData] = useState([]);
  const [value, setValue] = useState("1");
  const onEditCloseModal = () => setEditOpen(false)
  const [Editopen, setEditOpen] = useState(false);
  const [editData, setEditData] = useState({});
  const [services, setServices] = useState([]);
  const [jsonData1, setJsonData1] = useState([]);
  const [selectedService, setSelectedService] = useState("");
  const history = useHistory();
  const navigateDetails = (serviceType) => {
    console.log("itemitem", serviceType);
    history.push({
      pathname: "/Kycdetails",
      state: { serviceType }
    });
  };
  const columns2 = useMemo(
    () => [
      { accessorKey: "uName", header: "Name" },
      { accessorKey: "uMobile", header: "Mobile" },
      //   { accessorKey: "businessName", header: "BUSINESS NAME" },
      { accessorKey: "actions", header: "Actions" },
    ],
    []
  );
  const getVendorDetails = async () => {
    const token1 = localStorage.getItem("token1");
    const accessToken = localStorage.getItem("accessToken");
    try {
      const requestBody = {
        find: {},
        deep: "userId,serviceType.serviceId",
        select: "userId,serviceType.serviceId,serviceType.kycStatus,serviceType.kycRejectReason",
      };

      const res = await axios.post(
        `https://pets.dev.savaapi.com/api/schema/dev1/mongodb/pets/clinic_services/query`,
        requestBody,
        {
          headers: {
            "x-am-authorization": token1,
            "x-am-user-authorization": accessToken,
          },
        }
      );

      const data = res.data?.data?.map((item) => ({
        uName: item.userId.uName,
        uMobile: item.userId.uMobile,

        actions: (
          <div>
            <FontAwesomeIcon
              icon={faEye}
              onClick={() => navigateDetails(item.serviceType)}
            />
          </div>
        ),
      }));

      setJsonData1(data.reverse());
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    // getGrooming();
    getVendorDetails();
    // getVendorDetails();
  }, []);
  return (
    <Card border="light" className="bg-white shadow-sm mb-4">
      <Card.Body>
        <MaterialReactTable
          autoResetPageIndex={false}
          columns={columns2}
          data={jsonData1}
          enableRowOrdering
          enableSorting={false}
          muiTableBodyRowDragHandleProps={({ table }) => ({
            onDragEnd: () => {
              const { draggingRow, hoveredRow } = table.getState();
              if (hoveredRow && draggingRow) {
                jsonData1.splice(
                  hoveredRow.index,
                  0,
                  jsonData1.splice(draggingRow.index, 1)[0]
                );
                setJsonData1([...jsonData1]);
                console.log("new jsonData", jsonData1);
                let position_data = {
                  Offer_id: [],
                  position: [],
                };
                jsonData1.forEach((element, index) => {
                  position_data.Offer_id.push(element._id);
                  position_data.position.push(index + 1);
                });
              }
            },
          })}
        />
      </Card.Body>
    </Card>
  );
};
