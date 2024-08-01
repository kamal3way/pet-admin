import React, { useState, useEffect } from "react";
import { MDBDataTable } from "mdbreact";
import axios from "axios"; // Import axios
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"; // Import FontAwesomeIcon
import { faEye } from "@fortawesome/free-solid-svg-icons"; // Import the specific icon

export const Complete = () => {
  const [datatable, setDatatable] = useState({
    columns: [
      { label: "name", field: "name" },
      { label: "phone", field: "phone" },
      { label: "price", field: "price" },
      { label: "bookName", field: "bookName" },
      { label: "status", field: "status" },
      { label: "actions", field: "actions" },
    ],
  });

  const [isLoadingData, setIsLoadingData] = useState(false); // Define state for loading data
  const [myData, setMyData] = useState([]); // Define state for myData
  const [jsonData, setJsonData] = useState([]); // Define state for jsonData
  const [selectedDate, setSelectedDate] = useState(null); // Define state for selectedDate
  const [selectedMatch, setSelectedMatch] = useState([]); // Define state for selectedMatch
  const [isError, setIsError] = useState(null); // Define state for error handling

  const getAllCompleteData = async () => {
    setIsLoadingData(true);
    const token = localStorage.getItem("token");
    try {
      const res = await axios.get(
        `${process.env.REACT_APP_BASE_URL}/api/getAllBookOrderByStatus?status=Complete`,
        {
          headers: { Authorization: token },
        }
      );
      console.log(res.data,"complete********************");
      setMyData(res.data);
      const data = res.data?.map((item, index) => {
        return {
          name: item.name,
          phone: item.phone,
          bookName: item.bookName,
          status: item.status,
          price: item.price,
          actions: (
            <div>
              <FontAwesomeIcon
                icon={faEye}
                className="mx-3"
                // onClick={() => navigateDetails(item._id)}
              />
            </div>
          ),
        };
      });
      setJsonData(data);
      setIsLoadingData(false);
      setSelectedDate(null);
      setSelectedMatch([]);
      if (data.length > 0) {
        setDatatable((prevState) => ({
          ...prevState,
          rows: data,
        }));
      }
    } catch (error) {
      setIsError(error.response);
    }
  };

  useEffect(() => {
    getAllCompleteData();
  }, []);

  return <MDBDataTable striped bordered small data={datatable} />;
};

export default Complete;
