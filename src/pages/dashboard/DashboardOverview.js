import React, { useEffect, useState } from "react";
import {
  faCashRegister,
  faChartLine,
} from "@fortawesome/free-solid-svg-icons";
import {
  Col,
  Row,
  Card,
  Form,
  Button,
  InputGroup,
} from "@themesberg/react-bootstrap";


import {
  CounterWidget,
  CircleChartWidget,
  RankingWidget,
} from "../../components/Widgets";
import axios from "axios";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import {
  faDesktop,
  faMobileAlt,
  faTabletAlt,
} from "@fortawesome/free-solid-svg-icons";
import { DateRangePicker } from "react-date-range";
import "react-date-range/dist/styles.css"; // Import the styles
import "react-date-range/dist/theme/default.css"; // Import the styles
import moment from "moment";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import DateTimeRangeContainer from "react-advanced-datetimerange-picker/dist/DateTimeRangeContainer";
import { date } from "yup";
import { NordicWalkingSharp } from "@mui/icons-material";
// Register the necessary components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);


// const Dashboard = () => {
//   const [data, setData] = useState([]);
//   const [chartData, setChartData] = useState([]);
//   const token = localStorage.getItem("token");
//   const options = {
//     responsive: true,
//     plugins: {
//       legend: {
//         position: "top",
//       },
//       title: {
//         display: true,
//         text: "Users",
//       },
//     },
//   };

//   const tabListStyles = {
//     display: "flex",
//     justifyContent: "center",
//     background: "#f5f5f5",
//     padding: "10px",
//     borderRadius: "5px",
//   };

//   const tabStyles = {
//     fontSize: "18px",
//     fontWeight: "bold",
//     textTransform: "uppercase",
//     padding: "10px 20px",
//     margin: "0 5px",
//     borderRadius: "5px",
//     cursor: "pointer",
//     color: "#333",
//     background: "#fff",
//     boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
//     transition: "background 0.3s ease-in-out",
//   };

//   const activeTabStyles = {
//     background: "#007bff", // Change this to the desired background color for the active tab
//     color: "#fff", // Change this to the desired text color for the active tab
//   };

//   // Define chart data
//   // Extract keys and values from the API data
//   const labels = chartData?.map((item) => item.month);
//   const values = chartData?.map((item) => item.totalOrders);
//   const [sliderValue, setSliderValue] = useState(365); // Initial value

//   const handleSliderChange = (event) => {
//     setSliderValue(event.target.value); // Update the state with the new value
//   };

//   const [selection, setSelection] = useState([
//     {
//       startDate: new Date(),
//       endDate: new Date(),
//       key: "selection",
//     },
//   ]);

//   const getFormattedDate = (date) => {
//     return moment(date).format("YYYY-MM-DD");
//   };

//   const [formattedDates, setFormattedDates] = useState({
//     startDate: getFormattedDate(selection[0].startDate), // Set today's date in 'YYYY-MM-DD' format
//     endDate: getFormattedDate(selection[0].endDate),
//   });

//   const formatDates = () => {
//     const formattedStartDate = getFormattedDate(selection[0].startDate);
//     const formattedEndDate = getFormattedDate(selection[0].endDate);

//     setFormattedDates({
//       startDate: formattedStartDate,
//       endDate: formattedEndDate,
//     });
//   };

//   useEffect(() => {
//     formatDates();
//   }, [selection]);

//   const handleSelect = (ranges) => {
//     setSelection([ranges.selection]);
//   };

//   const getData = async () => {
//     try {
//       const res = await axios.get(
//         `${process.env.REACT_APP_BASE_URL}/api/getOverview?startDate=${formattedDates.startDate}&endDate=${formattedDates.endDate}`,
//         {
//           headers: { Authorization: `${token}` },
//         }
//       );

//       setData(res.data);
//     } catch (error) {
//     }
//   };

//   const getChartData = async () => {
//     try {
//       const res = await axios.get(
//         `${process.env.REACT_APP_BASE_URL}/api/getChartOverview`,

//         {
//           headers: { Authorization: `${token}` },
//         }
//       );

//       // console.log(res.data, "chart data");
//       setChartData(res.data);
//     } catch (error) {
//     }
//   };

//   const [active, setActive] = useState({});
//   const getActiveData = async () => {
//     try {
//       const res = await axios.get(
//         `${process.env.REACT_APP_BASE_URL}/api/socketdata`,

//         {
//           headers: { Authorization: `${token}` },
//         }
//       );

//       setActive(res.data);
//     } catch (error) {
//     }
//   };

//   useEffect(() => {
//     getChartData();
//     getActiveData();
//   }, []);

//   useEffect(() => {
//     getData();
//   }, [formattedDates]);

//   const [chart, setChart] = useState([]);

//   useEffect(() => {
//     if (data && data.preparingForCount) {
//       const trafficShares1 = [
//         {
//           id: 1,
//           label: "INI-SSET",
//           value: data.preparingForCount?.["INI-SSET"],
//           // value:50,
//           color: "secondary",
//           icon: faDesktop,
//           className: "green",
//         },
//         {
//           id: 2,
//           // label:data.preparingForCount["NEET SS + INI-SSET Surgical Group"],
//           label: "preparingForCount NEET SS + INI-SSET Surgical Group",
//           value: data?.preparingForCount["NEET SS + INI-SSET Surgical Group"],
//           color: "primary",
//           icon: faMobileAlt,
//           className: "blue",
//         },
//         {
//           id: 3,
//           label: "NEET SS Surgical Group",
//           value: data.preparingForCount["NEET SS Surgical Group"],
//           color: "tertiary",
//           icon: faTabletAlt,
//           className: "black",
//         },
//       ];

//       setChart(trafficShares1);
//     }
//   }, [data]);

//   const [preparing, setPreparing] = useState([]);

//   const getPreparingData = async () => {
//     try {
//       const res = await axios.get(
//         `${process.env.REACT_APP_BASE_URL}/api/preparing/getpreparing`,
//         {
//           headers: { Authorization: token },
//         }
//       );
//       setPreparing(res.data);
//       // console.log(res.data, "prepareing for");
//     } catch (error) {
//       console.log(error);
//     }
//   };

//   const [select, setSelect] = useState("NEET SS Surgical Group");
//   const handelSelect = (e) => {
//     setSelect(e.target.value);
//   };

//   const [plans, setPlans] = useState([]);

//   const getPlanData = async () => {
//     try {
//       const res = await axios.get(
//         `${process.env.REACT_APP_BASE_URL}/api/RevenueBySubscription`,
//         {
//           headers: { Authorization: token },
//         }
//       );
//       setPlans(res.data);
//       console.log(res.data, "plan data for");
//     } catch (error) {
//       console.log(error);
//     }
//   };

//   useEffect(() => {
//     getPreparingData();
//     getPlanData();
//   }, []);

//   return (
//     <>
//       <Row className="justify-content-md-center">
//         <Col xs={6} sm={6} xl={6} className="mb-4">
//           <CounterWidget
//             category="Students"
//             period={data?.userCount}
//             percentage={active?.connectedUsers}
//             // title={data?.userCount}
//             icon={faChartLine}
//             iconColor="shape-secondary"
//           />
//         </Col>

//         <Col xs={6} sm={6} xl={6} className="mb-4">
//           {chart && <CircleChartWidget title="Traffic Share" data={chart} />}
//         </Col>
//       </Row>
//       <Row>
//         <Col xs={6} sm={6} xl={6} className="mb-4">
//           <DateRangePicker ranges={selection} onChange={handleSelect} />
//         </Col>
//         <Col xs={6} sm={6} xl={6} className="mb-4">
//           <CounterWidget
//             category="Revenue"
//             title={`₹${data.totalAmountByday}`}
//             icon={faCashRegister}
//             iconColor="shape-tertiary"
//           />
//         </Col>
//       </Row>
//       <Row>
//         {/* <Col xs={12} sm={6} xl={6} className="mb-4">
//           {chart && <CircleChartWidget title="Traffic Share" data={chart} />}
//         </Col> */}
//         <Col xs={6} sm={12} xl={6} className="mb-4">
//           {/* <TabContext value={value}>
//             <TabList style={tabListStyles} onChange={handleChange}>
//               {preparing.map((item, index) => (
//                 <Tab
//                   style={
//                     value === index + 1
//                       ? { ...tabStyles, ...activeTabStyles }
//                       : tabStyles
//                   }
//                   I
//                   label={item.preparing_for}
//                   value={index + 1}
//                 />
//               ))}
//             </TabList>
//             {preparing.map((item, index) => (
//               <TabPanel value={index + 1} key={index}>
//                 <RankingWidget groupName={item.preparing_for} />
//               </TabPanel>
//             ))}
//           </TabContext> */}
//           <div>
//             <select className="select mb-3" onChange={handelSelect}>
//               {preparing.map((item, index) => (
//                 <option value={item.preparing_for} className="option">
//                   {item.preparing_for}
//                 </option>
//               ))}
//             </select>
//             <RankingWidget groupName={select} />
//           </div>
//         </Col>
//         <Col xs={6} sm={12} xl={6} className="mb-4" style={{ overflowY: "scroll" }}>
//           <div style={{ maxHeight: "17rem" }}>
//             <table className="table">
//               <thead>
//                 <tr>
//                   <th scope="col">Plan Name</th>
//                   <th scope="col">Users</th>
//                   <th scope="col">Revenue</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {plans.map((item, index) => (
//                   <tr>
//                     <td>{item.planName}</td>
//                     <td>{item.orderCount}</td>
//                     <td>{item.totalOrderAmount}</td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         </Col>
//       </Row>

//       <Row>
//         <Col xs={12} xl={12} className="mb-4">
//           <Row>
//             <Col xs={12} xl={8} className="mb-4">
//               <Row>
//                 {/* <Col xs={12} className="mb-4">
//                   <PageVisitsTable />
//                 </Col> */}

//                 <Col xs={12} lg={6} className="mb-4">
//                   {/* <TeamMembersWidget /> */}
//                   {/* <RankingWidget /> */}
//                 </Col>

//                 {/* <Col xs={12} lg={6} className="mb-4">
//                   <ProgressTrackWidget />
//                 </Col> */}
//               </Row>
//             </Col>

//             <Col xs={12} xl={4}>
//               <Row>
//                 {/* <RankingWidget /> */}
//                 {/* <Col xs={12} className="mb-4">
//                   <BarChartWidget
//                     title="Total orders"
//                     value={452}
//                     percentage={18.2}
//                     data={totalOrders}
//                   />
//                 </Col> */}

//                 {/* <Col xs={12} className="px-0 mb-4">
//                   <RankingWidget />
//                 </Col> */}

//                 {/* <Col xs={12} className="px-0">
//                   <AcquisitionWidget />
//                 </Col> */}
//               </Row>
//             </Col>
//           </Row>
//         </Col>
//       </Row>
//     </>
//   );
// };

const NewDashboard = () => {
  const [data, setData] = useState([]);
  const [chartData, setChartData] = useState([]);
  const token = localStorage.getItem("token");
  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: "Users",
      },
    },
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

  // Define chart data
  // Extract keys and values from the API data
  const labels = chartData?.map((item) => item.month);
  const values = chartData?.map((item) => item.totalOrders);
  const [sliderValue, setSliderValue] = useState(365); // Initial value

  const handleSliderChange = (event) => {
    setSliderValue(event.target.value); // Update the state with the new value
  };

  //New DateRange Picker


  const [StartDate, setStartDate] = useState("");
  const [EndDate, setEndDate] = useState("");
  let now = new Date();
  const [selectedDate, setselectedDate] = useState(moment(now).format("YYYY-MM-DD"));
  let start = moment(
    new Date(now.getFullYear(), now.getMonth(), now.getDate(), now.getHours(), now.getMinutes(), now.getSeconds(), 0)
  );
  let end = moment(start).add(1, "days").subtract(1, "seconds");
  let ranges = {
    "Today": [moment(start), moment(end)],
    "Yesterday": [moment(start).subtract(1, "days"), moment(end).subtract(1, "days")],
    "Last 3 Days": [moment(start).subtract(3, "days"), moment(end)],
    'Last 7 Days': [moment(start).subtract(6, 'days'), moment(end)],
    'Last 30 Days': [moment(start).subtract(29, 'days'), moment(end)],
    'Last Month': [moment(start).subtract(1, 'month').startOf('month'), moment(end).subtract(1, 'month').endOf('month')]
  };
  let local = {
    format: "YYYY-MM-DD",
    sundayFirst: false,
    days: ["Mo", "Tu", "We", "Th", "Fr", "Sa", "So"],
    months: [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ],
    fromDate: "From Date",
    toDate: "To Date",
    selectingFrom: "Selecting From",
    selectingTo: "Selecting To",
    maxDate: "Max Date",
    close: "Close",
    apply: "Apply",
    cancel: "Cancel",
  };
  let maxDate = moment(start).add(24, "hour");
  function applyCallback(startDate, endDate) {
    start = startDate;
    end = endDate;
    setselectedDate(
      startDate.format("YYYY-MM-DD") + " to " + endDate.format("YYYY-MM-DD")
    );
    setSelection([{
      startDate: startDate,
      endDate: endDate,
      key: "selection",
    }]);
  }


  const [selection, setSelection] = useState([
    {
      startDate: new Date(),
      endDate: new Date(),
      key: "selection",
    },
  ]);

  const getFormattedDate = (date) => {
    return moment(date).format("YYYY-MM-DD");
  };

  const [formattedDates, setFormattedDates] = useState({
    startDate: getFormattedDate(selection[0].startDate), // Set today's date in 'YYYY-MM-DD' format
    endDate: getFormattedDate(selection[0].endDate),
  });


  const [active, setActive] = useState({});

  const [chart, setChart] = useState([]);
  const [preparing, setPreparing] = useState([]);
  const [plans, setPlans] = useState([]);
  const [recentActivities, setRecentActivity] = useState([]);


  const formatDates = () => {
    const formattedStartDate = getFormattedDate(selection[0].startDate);
    const formattedEndDate = getFormattedDate(selection[0].endDate);

    setFormattedDates({
      startDate: formattedStartDate,
      endDate: formattedEndDate,
    });
  };

  useEffect(() => {
    formatDates();

  }, [selection]);

  // const handleSelect = (ranges) => {
  //   setSelection([ranges.selection]);
  // };

  const getChartData = async () => {
    try {
      const res = await axios.get(
        `${process.env.REACT_APP_BASE_URL}/api/getChartOverview`,

        {
          headers: { Authorization: `${token}` },
        }
      );

      // console.log(res.data, "chart data");
      setChartData(res.data);
    } catch (error) {
    }
  };


  const getActiveData = async () => {
    try {
      const res = await axios.get(
        `${process.env.REACT_APP_BASE_URL}/api/socketdata`,

        {
          headers: { Authorization: `${token}` },
        }
      );

      setActive(res.data);
    } catch (error) {
    }
  };

  useEffect(() => {
    getChartData();
    getActiveData();
  }, []);

  useEffect(() => {
    getCommonData();
    getStudentByGroup();
    getGroupRevenue();
    getRecentActivity();
  }, [formattedDates]);


  const getCommonData = async () => {
    try {
      const res = await axios.get(
        `${process.env.REACT_APP_BASE_URL}/api/v2/getOverview?startDate=${formattedDates.startDate}&endDate=${formattedDates.endDate}`,
        {
          headers: { Authorization: `${token}` },
        }
      );
      console.log("getCommonData ------ ", res);
      setData(res.data);
      // setData(res.data);
    } catch (error) {
    }
  };
  const getStudentByGroup = async (groupName = "INI-SSET") => {
    try {
      const res = await axios.get(
        `${process.env.REACT_APP_BASE_URL}/api/v2/Subscription/getAllByPreparation/${groupName}?startDate=${formattedDates.startDate}&endDate=${formattedDates.endDate}`,
        {
          headers: { Authorization: `${token}` },
        }
      );
      console.log("getStudentByGroup ------ ", res);

      // setData(res.data);
    } catch (error) {
    }
  };
  const getGroupRevenue = async () => {
    try {
      const res = await axios.get(
        `${process.env.REACT_APP_BASE_URL}/api/v2/RevenueBySubscription?startDate=${formattedDates.startDate}&endDate=${formattedDates.endDate}`,
        {
          headers: { Authorization: `${token}` },
        }
      );
      console.log("getGroupRevenue ------ ", res);
      setPlans(res.data);
      // setData(res.data);
    } catch (error) {
    }
  };

  const getRecentActivity = async () => {
    try {
      const res = await axios.get(
        `${process.env.REACT_APP_BASE_URL}/api/v2/getRecentActivity?startDate=${formattedDates.startDate}&endDate=${formattedDates.endDate}`,
        {
          headers: { Authorization: `${token}` },
        }
      );
      console.log("getRecentActivity ------ ", res);
      setRecentActivity(res.data);
      // setData(res.data);
    } catch (error) {
    }
  };


  useEffect(() => {
    if (data && data.preparingForCount) {
      const trafficShares1 = [
        {
          id: 1,
          label: "INI-SSET",
          value: data.preparingForCount?.["INI-SSET"],
          // value:50,
          color: "secondary",
          icon: faDesktop,
          className: "green",
        },
        {
          id: 2,
          // label:data.preparingForCount["NEET SS + INI-SSET Surgical Group"],
          label: "NEET SS + INI-SSET Surgical Group",
          value: data?.preparingForCount["NEET SS + INI-SSET Surgical Group"],
          color: "primary",
          icon: faMobileAlt,
          className: "blue",
        },
        {
          id: 3,
          label: "NEET SS Surgical Group",
          value: data.preparingForCount["NEET SS Surgical Group"],
          color: "tertiary",
          icon: faTabletAlt,
          className: "black",
        },
      ];

      setChart(trafficShares1);
    }
  }, [data]);



  const getPreparingData = async () => {
    try {
      const res = await axios.get(
        `${process.env.REACT_APP_BASE_URL}/api/preparing/getpreparing`,
        {
          headers: { Authorization: token },
        }
      );
      setPreparing(res.data);
      // console.log(res.data, "prepareing for");
    } catch (error) {
      console.log(error);
    }
  };
  console.log("preparing ------------ ", preparing);
  const [select, setSelect] = useState("NEET SS Surgical Group");
  const handelSelect = (e) => {
    setSelect(e.target.value);
  };

  useEffect(() => {
    getPreparingData();
    // getPlanData();
  }, []);

  return <div className="p-4">
    {/* <div className="welcome">
      <div className="content rounded-3 p-3" style={{ marginLeft: 0 }}>
        <h1 className="fs-3">Welcome to Dashboard</h1>
      </div>
    </div> */}
    <section className="charts mt-4">
      <div className="row">
        <div className="col-lg-6" >
          <div className="chart-container rounded-2 p-3">
            <h2 className="fs-5 mb-3">Students</h2>
            <div className="d-flex" style={{ flexDirection: "column", alignItems: "center" }}>
              <h1 className="fs-5">Register Users : {data?.userCount}</h1>
              <h1 className="fs-5">Active Users : {active?.connectedUsers}</h1>
            </div>
          </div>
        </div>
        <div className="col-lg-6">
          <div className="chart-container rounded-2 p-3">
            <h2 className="fs-5">Traffic Share</h2>
            {/* <CircleChart series={series} /> */}
            {chart && <CircleChartWidget data={chart} />}
          </div>
        </div>
      </div>
    </section>

    <section className="charts mt-4">
      <div className="row">

        <div>
          <div className="date-container rounded-2 p-3">
            <DateTimeRangeContainer
              ranges={ranges}
              start={start}
              end={end}
              local={local}
              maxDate={maxDate}
              applyCallback={applyCallback}
            >
              <Form.Group id="datetime">
                <InputGroup>
                  <InputGroup.Text>📅</InputGroup.Text>
                  <Form.Control
                    type="text"
                    placeholder="SelectDate"
                    name="datetime"
                    value={selectedDate}
                  />
                </InputGroup>
              </Form.Group>
            </DateTimeRangeContainer>
            {/* <DateRangePicker ranges={selection} onChange={handleSelect}
              className="calendar"
            /> */}
          </div>
        </div>
      </div>
      <section className="charts mt-4">
        <div className="row">
          <div className="col-lg-4">
            <div className="date-container rounded-2 p-3">
              <div className="box d-flex rounded-2 align-items-center mb-1 mb-lg-0 ">
                <FontAwesomeIcon icon={faCashRegister} className="uil-envelope-shield fs-2 text-center" />
                <div className="ms-3">
                  <div className="d-flex align-items-center">
                    <h3 className="mb-0">₹{data.totalAmountByday}</h3>
                    {/* <span className="d-block ms-2">Emails</span> */}
                  </div>
                  <p className="fs-normal mb-0">Total Revenue</p>
                </div>
              </div>
            </div>
          </div>

          <div className="col-lg-4">
            <div className="date-container rounded-2 p-3">
              <div className="box d-flex rounded-2 align-items-center mb-1 mb-lg-0 ">
                <FontAwesomeIcon icon={faCashRegister} className="uil-envelope-shield fs-2 text-center" />
                <div className="ms-3">
                  <div className="d-flex align-items-center">
                    <h3 className="mb-0">{data.subscribePlan}</h3>
                    {/* <span className="d-block ms-2">Emails</span> */}
                  </div>
                  <p className="fs-normal mb-0">Subscribers</p>
                </div>
              </div>
            </div>
          </div>

          <div className="col-lg-4">
            <div className="date-container rounded-2 p-3">
              <div className="box d-flex rounded-2 align-items-center mb-1 mb-lg-0 ">
                <FontAwesomeIcon icon={faCashRegister} className="uil-envelope-shield fs-2 text-center" />
                <div className="ms-3">
                  <div className="d-flex align-items-center">
                    <h3 className="mb-0">{data.testAttempt}</h3>
                    {/* <span className="d-block ms-2">Emails</span> */}
                  </div>
                  <p className="fs-normal mb-0">Tests Attempted</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </section>
    <section className="charts mt-4">
      <div className="row">
        <div className="col-lg-6">
          <div className="chart-container rounded-2 p-3 parentDiv">
            <h2 className="fs-5 mb-3">Students By Group</h2>
            <div>
              <select className="select mb-3" onChange={handelSelect}>
                {preparing.map((item, index) => (
                  <option value={item.preparing_for} className="option">
                    {item.preparing_for}
                  </option>
                ))}
              </select>
              <RankingWidget groupName={select} startDate={formattedDates.startDate} endDate={formattedDates.endDate} />
            </div>
          </div>
        </div>
        <div className="col-lg-6">
          <div className="chart-container rounded-2 p-3 parentDiv">
            <h2 className="fs-5 mb-3">Revenue By Plans</h2>
            <div className="chart-container rounded-2 p-3 scrollDiv">
              <table className="table revenueTable">
                <thead className="revenueTHead">
                  <tr>
                    <th scope="col">Plan Name</th>
                    <th scope="col">Users</th>
                    <th scope="col">Revenue</th>
                  </tr>
                </thead>
                <tbody className="revenueTBody">
                  {plans.map((item, index) => (
                    <tr>
                      <td>{item.planName}</td>
                      <td>{item.orderCount}</td>
                      <td>{item.totalOrderAmount}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </section>
    <section className="charts mt-4">
      <div className="chart-container p-3">
        <h2 className="fs-5 mb-3">Recent Activity</h2>
        <div style={{
          overflowY: "scroll",
          height: 152
        }}>
          {
            recentActivities.map(i => <p>{i.message}</p>)
          }
        </div>
      </div>
    </section>
  </div>

}

export default NewDashboard;
