import React, { useState, useEffect } from "react";
import { Route, Switch, Redirect } from "react-router-dom";
import { Routes } from "../routes";

// pages
import Presentation from "./Presentation";
import Upgrade from "./Upgrade";
import DashboardOverview from "./dashboard/DashboardOverview";
import Transactions from "./Transactions";
import Settings from "./Settings";
import dynamicpopup from "./dynamicpopup";
import BootstrapTables from "./tables/BootstrapTables";
import Signin from "./examples/Signin";
import Signup from "./examples/Signup";
import ForgotPassword from "./examples/ForgotPassword";
import ResetPassword from "./examples/ResetPassword";
import Lock from "./examples/Lock";
import NotFoundPage from "./examples/NotFound";
import ServerError from "./examples/ServerError";

// documentation pages
import DocsOverview from "./documentation/DocsOverview";
import DocsDownload from "./documentation/DocsDownload";
import DocsQuickStart from "./documentation/DocsQuickStart";
import DocsLicense from "./documentation/DocsLicense";
import DocsFolderStructure from "./documentation/DocsFolderStructure";
import DocsBuild from "./documentation/DocsBuild";
import DocsChangelog from "./documentation/DocsChangelog";

// components
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Preloader from "../components/Preloader";

import Accordion from "./components/Accordion";
import Alerts from "./components/Alerts";
import Badges from "./components/Badges";
import Breadcrumbs from "./components/Breadcrumbs";
import Buttons from "./components/Buttons";
import Forms from "./components/Forms";
import Modals from "./components/Modals";
import Navs from "./components/Navs";
import Navbars from "./components/Navbars";
import Pagination from "./components/Pagination";
import Popovers from "./components/Popovers";
import Progress from "./components/Progress";
import Tables from "./components/Tables";
import Tabs from "./components/Tabs";
import Tooltips from "./components/Tooltips";
import Toasts from "./components/Toasts";
import { Groomingdetail } from "./Groomingdetail";
import { Vetservices } from "./vetservices";
import { Petvendor } from "./Petvendor";
import { Aquarium } from "./Aquarium";
import { Event } from "./Event";
import { Petmarketdetailss } from "./Petmarketdetailss";
import { Petmedicines } from "./Petmedicines";
import { Trainingvenderdetail } from "./Trainingvenderdetail";
import { Aquariumdetails } from "./Aquariumdetails";
import { Consultant } from "./Consultant";

import { Topics } from "./topics";
import { Content } from "./content";
import { Vetservicedetails } from "./vetservicedetails";
import { Photographyvenderdetails } from "./Photographyvenderdetails";
import {SubscriptionData} from "./subscriptiondata";
import { Exam } from "./exam";
import { Vetservicedetail } from "./Vetservicedetail";
import { Processing } from "./processing";
import { Complete } from "./complete";
import Quations from "./quations";
import { CommanForm } from "./commanForm";

import { Vendor } from "./Vendor";
import { User } from "./User";
import { UserDetails } from "./userDetails";
import { QuestionDetails } from "./questionDetails";
import { MockQuestionDetails } from "./mockQuestionDetails";
import { Positions } from "./positions";
import { Notification } from "./notification";
import { Banner } from "./banner";
import { Groomingdetails } from "./Groomingdetails";
import { Petmedicinesdetails } from "./Petmedicinesdetails";
import { Payment } from "./Payment";
import { Categorys} from "./Categorys.js";
import { Kyc } from "./Kyc";
import { SubscriptionPlan } from "./SubscriptionPlan";

import { Kycdetails } from "./Kycdetails";


import { Consultantdetails } from "./Consultantdetails";
import { Setting } from "./Setting";
import { Medicine } from "./medicine";
import { Petmarket } from "./petmarket";
import { Insurancedetails } from "./Insurancedetails";
import { PetInsurance } from "./PetInsurance";
import { Grooming } from "./grooming ";
import { Petfriendly } from "./petfriendly";
import { PetHostel } from "./PetHostel";
import { Aquariumdetailss } from "./Aquariumdetailss.js";
import { Eventdetails } from "./Eventdetails";
import { Adoptioncenter } from "./Adoptioncenter";
import { Photographydetail } from "./Photographydetail";
import { Trainingdetail } from "./Trainingdetail";
import { Trainingcenter } from "./Trainingcenter";
import { Photography } from "./Photography";
import { Pethosteldetails } from "./Pethosteldetails.js";
import { MockExamCategory } from "./mockExamCategory";
import { MockExam } from "./mockExam";
import { Petmarketdetails } from "./Petmarketdetails";
import { Petservices } from "./petservices";
import { Book }  from "./book";


const RouteWithLoader = ({ component: Component, ...rest }) => {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setLoaded(true), 1000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <Route
      {...rest}
      render={(props) => (
        <>
          {" "}
          <Preloader show={loaded ? false : true} /> <Component {...props} />{" "}
        </>
      )}
    />
  );
};

const RouteWithSidebar = ({ component: Component, ...rest }) => {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setLoaded(true), 1000);
    return () => clearTimeout(timer);
  }, []);

  const localStorageIsSettingsVisible = () => {
    return localStorage.getItem("settingsVisible") === "false" ? false : true;
  };

  const [showSettings, setShowSettings] = useState(
    localStorageIsSettingsVisible
  );

  const toggleSettings = () => {
    setShowSettings(!showSettings);
    localStorage.setItem("settingsVisible", !showSettings);
  };

  return (
    <Route
      {...rest}
      render={(props) => (
        <>
          <Preloader show={loaded ? false : true} />
          <Sidebar />

          <main className="content">
            <Navbar />
            <Component {...props} />
            <Footer
              toggleSettings={toggleSettings}
              showSettings={showSettings}
            />
          </main>
        </>
      )}
    />
  );
};
// return (
//   <Route
//     {...rest}
//     render={props => (
//       <>
//         {token ? (
//           <Redirect to={shouldRedirect} />
//         ) : (
//           <>
//             <Preloader show={loaded ? false : true} />
//             <Sidebar />

//             <main className="content">
//               <Navbar />
//               <Component {...props} />
//               <Footer toggleSettings={toggleSettings} showSettings={showSettings} />
//             </main>
//           </>
//         )}
//       </>
//     )}
//   />
// );
// };

export default () => (
  <Switch>
    <RouteWithLoader
      exact
      path={Routes.Presentation.path}
      component={Presentation}
    />
    <RouteWithLoader exact path={Routes.Signin.path} component={Signin} />

    <RouteWithSidebar exact path={Routes.Book.path} component={Book} />

    <RouteWithLoader exact path={Routes.Signup.path} component={Signup} />
    <RouteWithLoader
      exact
      path={Routes.ForgotPassword.path}
      component={ForgotPassword}
    />
    <RouteWithLoader
      exact
      path={Routes.ResetPassword.path}
      component={ResetPassword}
    />
    <RouteWithLoader exact path={Routes.Lock.path} component={Lock} />
    <RouteWithLoader
      exact
      path={Routes.NotFound.path}
      component={NotFoundPage}
    />
    <RouteWithLoader
      exact
      path={Routes.ServerError.path}
      component={ServerError}
    />

    {/* pages */}
    <RouteWithSidebar
      exact
      path={Routes.DashboardOverview.path}
      component={DashboardOverview}
    />
    <RouteWithSidebar exact path={Routes.Upgrade.path} component={Upgrade} />
    <RouteWithSidebar
      exact
      path={Routes.Transactions.path}
      component={Transactions}
    />

{/* <RouteWithSidebar exact path={Routes.dynamicpopup.path} component={dynamicpopup} /> */}
    {/* <RouteWithSidebar exact path={Routes.Category.path} component={Settings} /> */}
    <RouteWithSidebar
      exact
      path={Routes.Groomingdetail.path}
      component={Groomingdetail}
    />
    
     <RouteWithSidebar
      exact
      path={Routes.Vetservices.path}
      component={Vetservices}
    />
      <RouteWithSidebar
      exact
      path={Routes.Petvendor.path}
      component={Petvendor}
    />
       <RouteWithSidebar
      exact
      path={Routes.Aquarium.path}
      component={Aquarium}
    />
        <RouteWithSidebar
      exact
      path={Routes.Eventdetails.path}
      component={Eventdetails}
    />
          <RouteWithSidebar
      exact
      path={Routes.Event.path}
      component={Event}
    />
      <RouteWithSidebar
      exact
      path={Routes.Petmedicines.path}
      component={Petmedicines}
    />
          <RouteWithSidebar
      exact
      path={Routes.Consultant.path}
      component={Consultant}
    />
      <RouteWithSidebar
      exact
      path={Routes.Trainingvenderdetail.path}
      component={Trainingvenderdetail}
    />
      <RouteWithSidebar
      exact
      path={Routes.Aquariumdetails.path}
      component={Aquariumdetails}
    />
    <RouteWithSidebar exact path={Routes.Topics.path} component={Topics} />
    <RouteWithSidebar exact path={Routes.Content.path} component={Content} />
    <RouteWithSidebar
      exact
      path={Routes.Vetservicedetails.path}
      component={Vetservicedetails}
    />
    <RouteWithSidebar
      exact
      path={Routes.Photographyvenderdetails.path}
      component={Photographyvenderdetails}
    />
       <RouteWithSidebar
      exact
      path={Routes.SubscriptionData.path}
      component={SubscriptionData}
    />
    <RouteWithSidebar exact path={Routes.Exam.path} component={Exam} />
    <RouteWithSidebar exact path={Routes.Vetservicedetail.path} component={Vetservicedetail} />
    <RouteWithSidebar exact path={Routes.Complete.path} component={Complete} />
    <RouteWithSidebar exact path={Routes.Processing.path} component={Processing} />
    <RouteWithSidebar
      exact
      path={Routes.Notification.path}
      component={Notification}
    />
    <RouteWithSidebar exact path={Routes.Banner.path} component={Banner} />
    <RouteWithSidebar exact path={Routes.Quations.path} component={Quations} />
    <RouteWithSidebar exact path={Routes.Vendor.path} component={Vendor} />
    <RouteWithSidebar exact path={Routes.User.path} component={User} />
    
    <RouteWithSidebar
      exact
      path={Routes.CommanForm.path}
      component={CommanForm}
    />
    {/* <RouteWithSidebar exact path={Routes.Users.path} component={User} /> */}
    <RouteWithSidebar
      exact
      path={Routes.UserDetails.path}
      component={UserDetails}
    />
    <RouteWithSidebar exact path={Routes.Medicine.path} component={Medicine} />
    <RouteWithSidebar exact path={Routes.MockExamCategory.path} component={MockExamCategory} />
    <RouteWithSidebar exact path={Routes.MockExam.path} component={MockExam} />
    <RouteWithSidebar exact path={Routes.Petmarketdetailss.path} component={Petmarketdetailss} />
    <RouteWithSidebar exact path={Routes.Petservices.path} component={Petservices} />
    <RouteWithSidebar
      exact
      path={Routes.Positions.path}
      component={Positions}
    />
    <RouteWithSidebar
      exact
      path={Routes.QuestionDetails.path}
      component={QuestionDetails}
    />
    <RouteWithSidebar
      exact
      path={Routes.MockQuestionDetails.path}
      component={MockQuestionDetails}
    />
    <RouteWithSidebar
      exact
      path={Routes.Petmarket.path}
      component={Petmarket}
    />

<RouteWithSidebar
      exact
      path={Routes.Petmedicinesdetails.path}
      component={Petmedicinesdetails}
    />

<RouteWithSidebar
      exact
      path={Routes.Payment.path}
      component={Payment}
    />


<RouteWithSidebar
      exact
      path={Routes.Categorys.path}
      component={Categorys}
    />
    <RouteWithSidebar
      exact
      path={Routes.Kycdetails.path}
      component={Kycdetails}
    />
    <RouteWithSidebar
      exact
      path={Routes.Kyc.path}
      component={Kyc}
    />
      <RouteWithSidebar
      exact
      path={Routes.SubscriptionPlan.path}
      component={SubscriptionPlan}
    />
    <RouteWithSidebar
      exact
      path={Routes.Consultantdetails.path}
      component={Consultantdetails}
    />
 <RouteWithSidebar
      exact
      path={Routes.Insurancedetails.path}
      component={Insurancedetails}
    />
<RouteWithSidebar
      exact
      path={Routes.PetInsurance.path}
      component={PetInsurance}
    />
    <RouteWithSidebar
      exact
      path={Routes.Petmarketdetails.path}
      component={Petmarketdetails}
    />
      <RouteWithSidebar
      exact
      path={Routes.Aquariumdetailss.path}
      component={Aquariumdetailss}
    />
    <RouteWithSidebar
      exact
      path={Routes.Grooming.path}
      component={Grooming}
    />
    <RouteWithSidebar exact path={Routes.Petfriendly.path} component={Petfriendly} />
    <RouteWithSidebar exact path={Routes.PetHostel.path} component={PetHostel} />

    <RouteWithSidebar
      exact
      path={Routes.BootstrapTables.path}
      component={BootstrapTables}
    />

    <RouteWithSidebar
      exact
      path={Routes.Adoptioncenter.path}
      component={Adoptioncenter}
    />
      <RouteWithSidebar
      exact
      path={Routes.Trainingdetail.path}
      component={Trainingdetail}
    />
        <RouteWithSidebar
      exact
      path={Routes.Photographydetail.path}
      component={Photographydetail}
    />
        <RouteWithSidebar
      exact
      path={Routes.Trainingcenter.path}
      component={Trainingcenter}
    />
     <RouteWithSidebar
      exact
      path={Routes.Photography.path}
      component={Photography}
    />
    <RouteWithSidebar
      exact
      path={Routes.Pethosteldetails.path}
      component={Pethosteldetails}
    />
    {/* components */}
    <RouteWithSidebar
      exact
      path={Routes.Accordions.path}
      component={Accordion}
    />
    <RouteWithSidebar exact path={Routes.Alerts.path} component={Alerts} />
    <RouteWithSidebar exact path={Routes.Badges.path} component={Badges} />
    <RouteWithSidebar
      exact
      path={Routes.Breadcrumbs.path}
      component={Breadcrumbs}
    />
    <RouteWithSidebar exact path={Routes.Buttons.path} component={Buttons} />
    <RouteWithSidebar exact path={Routes.Forms.path} component={Forms} />
    <RouteWithSidebar exact path={Routes.Modals.path} component={Modals} />
    <RouteWithSidebar exact path={Routes.Navs.path} component={Navs} />
    <RouteWithSidebar exact path={Routes.Navbars.path} component={Navbars} />
    <RouteWithSidebar
      exact
      path={Routes.Pagination.path}
      component={Pagination}
    />
    <RouteWithSidebar exact path={Routes.Popovers.path} component={Popovers} />
    <RouteWithSidebar exact path={Routes.Progress.path} component={Progress} />
    <RouteWithSidebar exact path={Routes.Tables.path} component={Tables} />
    <RouteWithSidebar exact path={Routes.Tabs.path} component={Tabs} />
    <RouteWithSidebar exact path={Routes.Tooltips.path} component={Tooltips} />
    <RouteWithSidebar exact path={Routes.Toasts.path} component={Toasts} />

    {/* documentation */}
    <RouteWithSidebar
      exact
      path={Routes.DocsOverview.path}
      component={DocsOverview}
    />
    <RouteWithSidebar
      exact
      path={Routes.DocsDownload.path}
      component={DocsDownload}
    />
    <RouteWithSidebar
      exact
      path={Routes.DocsQuickStart.path}
      component={DocsQuickStart}
    />
    <RouteWithSidebar
      exact
      path={Routes.DocsLicense.path}
      component={DocsLicense}
    />
    <RouteWithSidebar
      exact
      path={Routes.DocsFolderStructure.path}
      component={DocsFolderStructure}
    />
    <RouteWithSidebar
      exact
      path={Routes.DocsBuild.path}
      component={DocsBuild}
    />
    <RouteWithSidebar
      exact
      path={Routes.DocsChangelog.path}
      component={DocsChangelog}
    />
    <RouteWithSidebar
      exact
      path={Routes.Groomingdetails.path}
      component={Groomingdetails}
    />
    <RouteWithSidebar exact path={Routes.Setting.path} component={Setting} />

    <Redirect to={Routes.NotFound.path} />
  </Switch>
);
