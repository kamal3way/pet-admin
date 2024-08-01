import React, { useEffect, useState } from 'react';
import SimpleBar from "simplebar-react";
import { useLocation } from "react-router-dom";
import { CSSTransition } from "react-transition-group";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBook,
  faChevronDown,
  faChartPie,
  faCog,
  faFileAlt,
  faHandHoldingUsd,
  faSignOutAlt,
  faCreditCard,
  faShoppingCart,
  faTable,
  faTimes,
  faCalendarAlt,
  faMapPin,
  faInbox,
  faRocket,
  faFolder,
  faBookmark,
  faLayerGroup,
  faTags,
  faMoneyBillWave,
  faClipboardCheck,
  faPaw,
  faUpload,
  faBell,
  faFileImage,
  faCogs,
  faQuestionCircle,
  faUser,
  faUsers,
  faUserAstronaut,
  faMoneyBill,
  faIdCard,
  faPlus,
} from "@fortawesome/free-solid-svg-icons";
import {
  Nav,
  Badge,
  Image,
  Button,
  Dropdown,
  Accordion,
  Navbar,
} from "@themesberg/react-bootstrap";
import { Link } from "react-router-dom";
import axios from "axios";
import { Routes } from "../routes";
import ReactHero from "../assets/img/PetPamper.svg";
import ThemesbergLogo from "../assets/img/themesberg.svg";
// import ReactHero from "../assets/img/logo.png";
import ProfilePicture from "../assets/img/team/profile-picture-3.jpg";
import { library } from "@fortawesome/fontawesome-svg-core";

export default (props = {}) => {
  const serviceRouteMap = {
    "Pet market place": Routes.Petmarket.path,
    "Vet Services": Routes.Vetservices.path,
    "Grooming & spa": Routes.Grooming.path,
    "Pet friendly spot": Routes.Petfriendly.path,
    "Pet Hostel": Routes.PetHostel.path,
    "Adoption center": Routes.Adoptioncenter.path,
    "Pet Photography": Routes.Photography.path,
    "Pet Training": Routes.Trainingcenter.path,
    "Aquarium and cage cleaning": Routes.Aquarium.path,
    "Online Consult": Routes.Consultant.path,
    "Pet Medicines": Routes.Petmedicines.path,
    "Pet Insurance": Routes.PetInsurance.path,
    "Pet events & party's": Routes.Event.path,
  };
  const location = useLocation();
  const { pathname } = location;
  const [show, setShow] = useState(false);
  const showClass = show ? "show" : "";
  const [navItems, setNavItems] = useState([]);

  const onCollapse = () => setShow(!show);
  const getVetServices = async () => {
    const token1 = localStorage.getItem("token1");
    const accessToken = localStorage.getItem("accessToken");
    try {
      let res = await axios.get(
        `https://pets.dev.savaapi.com/api/schema/dev1/mongodb/pets/pet_services`,
        {
          headers: {
            "x-am-authorization": token1,
            "x-am-user-authorization": accessToken,
          },
        }
      );
      const data = res.data?.data?.map((item) => ({
        title: item.serviceName,
        icon: faUser, // Use appropriate icons as per your requirement
        link: serviceRouteMap[item.serviceName] || `/${item._id}`, // Assuming you have a route structure to handle dynamic links
      }));
      console.log(data, "data");
      setNavItems(data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getVetServices();
  }, []);
  const CollapsableNavItem = (props) => {
    const { eventKey, title, icon, children = null } = props;
    const defaultKey = pathname.indexOf(eventKey) !== -1 ? eventKey : "";


    return (
      <Accordion as={Nav.Item} defaultActiveKey={defaultKey}>
        <Accordion.Item eventKey={eventKey}>
          <Accordion.Button
            as={Nav.Link}
            className="d-flex justify-content-between align-items-center"
          >
            <span>
              <span className="sidebar-icon">
                <FontAwesomeIcon icon={icon} />{" "}
              </span>
              <span className="sidebar-text">{title}</span>
            </span>
          </Accordion.Button>
          <Accordion.Body className="multi-level">
            <Nav className="flex-column">{children}</Nav>
          </Accordion.Body>
        </Accordion.Item>
      </Accordion>
    );
  };

  const NavItem = (props) => {
    const {
      title,
      link,
      external,
      target,
      icon,
      image,
      badgeText,
      badgeBg = "secondary",
      badgeColor = "primary",
    } = props;
    const classNames = badgeText
      ? "d-flex justify-content-start align-items-center justify-content-between"
      : "";
    const navItemClassName = link === pathname ? "active" : "";
    const linkProps = external ? { href: link } : { as: Link, to: link };

    return (
      <Nav.Item className={navItemClassName} onClick={() => setShow(false)}>
        <Nav.Link {...linkProps} target={target} className={classNames}>
          <span>
            {icon ? (
              <span className="sidebar-icon">
                <FontAwesomeIcon icon={icon} />{" "}
              </span>
            ) : null}
            {image ? (
              <Image src={image} className="sidebar-icon svg-icon" />
            ) : null}

            <span className="sidebar-text">{title}</span>
          </span>
          {badgeText ? (
            <Badge
              pill
              bg={badgeBg}
              text={badgeColor}
              className="badge-md notification-count ms-2"
            >
              {badgeText}
            </Badge>
          ) : null}
        </Nav.Link>
      </Nav.Item>
    );
  };

  return (
    <>
      <Navbar
        expand={false}
        collapseOnSelect
        variant="dark"
        className="navbar-theme-primary px-4 d-md-none"
      >
        <Navbar.Brand
          className="me-lg-5"
          as={Link}
          to={Routes.DashboardOverview.path}
        >
          <Image src={ReactHero} className="navbar-brand-light" />
        </Navbar.Brand>
        <Navbar.Toggle
          as={Button}
          aria-controls="main-navbar"
          onClick={onCollapse}
        >
          <span className="navbar-toggler-icon" />
        </Navbar.Toggle>
      </Navbar>
      <CSSTransition timeout={300} in={show} classNames="sidebar-transition">
        <SimpleBar
          className={`collapse ${showClass} sidebar d-md-block bg-primary text-white`}
        >
          <div className="sidebar-inner px-4 pt-3">
            <div className="user-card d-flex d-md-none align-items-center justify-content-between justify-content-md-center pb-4">
              <div className="d-flex align-items-center">
                <div className="user-avatar lg-avatar me-4">
                  {/* <Image
                    src={ProfilePicture}
                    className="card-img-top rounded-circle border-white"
                  /> */}
                </div>
                <div className="d-block">

                  {/* <Button
                    as={Link}
                    variant="secondary"
                    size="xs"
                    to={Routes.Signin.path}
                    className="text-dark"
                  >
                    <FontAwesomeIcon icon={faSignOutAlt} className="me-2" />{" "}
                    Sign Out
                  </Button> */}
                </div>
              </div>
              <Nav.Link
                className="collapse-close d-md-none"
                onClick={onCollapse}
              >
                <FontAwesomeIcon icon={faTimes} />
              </Nav.Link>
            </div>
            <Nav className="flex-column pt-3 pt-md-0">
              <NavItem image={ReactHero} />

              {/* <NavItem
                title="Overview"
                link={Routes.DashboardOverview.path}
                icon={faChartPie}
              /> */}
              {/* <NavItem
                external
                title="Messages"
                link="https://demo.themesberg.com/volt-pro-react/#/messages"
                target="_blank"
                badgeText="Pro"
                icon={faInbox}
              />
              <NavItem
                title="Transactions"
                icon={faHandHoldingUsd}
                link={Routes.Transactions.path}
              /> */}
              {/* <NavItem
                title="dynamicpopup"
                icon={faCogs}
                link={Routes.dynamicpopup.path}
              /> */}
              <NavItem
                title="Users"
                icon={faUser}
                link={Routes.User.path}
              />
              <NavItem
                title="Vendor"
                icon={faUserAstronaut}
                link={Routes.Vendor.path}
              />
              <NavItem
                title="Payment"
                icon={faMoneyBill}
                link={Routes.Payment.path}
              />
              <NavItem
                title="Categories"
                icon={faShoppingCart}
                link={Routes.Categorys.path}
              />
              <NavItem
                title="KYC"
                icon={faIdCard}
                link={Routes.Kyc.path}
              />
          {/*<NavItem
  title="SubscriptionPlan"
  icon={faCreditCard}
  link={Routes.SubscriptionPlan.path}
/>
               <NavItem
                title="Bulk Upload"
                icon={faUpload}
                link={Routes.CommanForm.path}
              /> */}
              {/* <NavItem
                title="Category"
                icon={faLayerGroup}
                link={Routes.Category.path}
              /> */}
              {/* <NavItem
                title="Subcategory"
                icon={faTags}
                link={Routes.Subcategory.path}
              /> */}
              {/* <NavItem
                title="Coupon Code"
                icon={faTags}
                link={Routes.CouponCode.path}
              /> */}
              {/* <NavItem
                title="Topics"
                icon={faBookmark}
                link={Routes.Topics.path}
              /> */}
              {/* <NavItem
                title="Content"
                icon={faFolder}
                link={Routes.Content.path}
              /> */}
              {/* <NavItem
                title="Subscription"
                icon={faMoneyBillWave}
                link={Routes.Vetservicedetails.path}
              /> */}
              {/* <NavItem
                title="Exam"
                icon={faClipboardCheck}
                link={Routes.Exam.path}
              /> */}
              {/* <NavItem
                title="padding"
                icon={faClipboardCheck}
                link={Routes.Padding.path}
              /> */}
              {/* <NavItem
                title="Question"
                icon={faQuestion}
                link={Routes.Quations.path}
              /> */}
              {/* <NavItem
                title="Mock Exam Category"
                icon={faLayerGroup}
                link={Routes.MockExamCategory.path}
              /> */}
              {/* <NavItem
                title="Mock Exam"
                icon={faClipboardCheck}
                link={Routes.MockExam.path}
              /> */}
              {/* <NavItem
                title="Book"
                icon={faLayerGroup}
                link={Routes.Book.path}
              /> */}

              <NavItem
                title=" Add New Services"
                icon={faPlus}
                link={Routes.Petservices.path}
              />
              {/* <NavItem
                title="Notification"
                icon={faBell}
                link={Routes.Notification.path}
              /> */}
              {/* <NavItem
                title="Banners"
                icon={faFileImage}
                link={Routes.Banner.path}
              /> */}
              {/* <NavItem
                title="Preparing For"
                icon={faUpload}
                link={Routes.PreparingFor.path}
              /> */}

              {/* <NavItem
                title="Setting"
                icon={faCogs}
                link={Routes.Setting.path}
              /> */}

              {/* <NavItem
                title="Setting"
                icon={faCogs}
                link={Routes.Petvendor.path}
              /> */}
              {/* <NavItem
                  title="Adoption Details"
                  icon={faUser}
                  link={Routes.Adoptiondetails.path}
                /> */}
              {/* <CollapsableNavItem
                className="cdcd"
                eventKey="tables/"
                title="Pet Services"
                title={
                  <div className="title-with-icon">
                    <FontAwesomeIcon icon={faPaw} className="title-icon" />
                    <span style={{ marginLeft: "20px" }}>Pet Services</span>
                    <FontAwesomeIcon icon={faChevronDown} style={{ marginLeft: "20px" }} className="dropdown-icon" />
                  </div>
                }
              >
                <NavItem
                  title="Pet Market Services"
                  icon={faUser}
                  link={Routes.Petmarket.path}
                />
                <NavItem
                  title="Vet services"
                  icon={faUser}
                  link={Routes.Vetservices.path}
                />
                <NavItem
                  title="Grooming & spa"
                  icon={faUsers}
                  link={Routes.Grooming.path}
                />
                <NavItem
                  title="Pet friendly spot"
                  icon={faUsers}
                  link={Routes.Petfriendly.path}
                />
                <NavItem
                  title="Pet Hostel"
                  icon={faUser}
                  link={Routes.PetHostel.path}
                />
               
                <NavItem
                  title="Adoption center"
                  icon={faUser}
                  link={Routes.Adoptioncenter.path}
                />
                <NavItem
                  title="Photo graphy"
                  icon={faUser}
                  link={Routes.Photography.path}
                />
                <NavItem
                  title="Training center"
                  icon={faUser}
                  link={Routes.Trainingcenter.path}
                />
                <NavItem
                  title="Aquarium"
                  icon={faUser}
                  link={Routes.Aquarium.path}
                />
                <NavItem
                  title="Consultant"
                  icon={faUser}
                  link={Routes.Consultant.path}
                />
                <NavItem
                  title="Petmedicines"
                  icon={faUser}
                  link={Routes.Petmedicines.path}
                />

                <NavItem
                  title="PetInsurance"
                  icon={faUser}
                  link={Routes.PetInsurance.path}
                />
              </CollapsableNavItem> */}

              <CollapsableNavItem
                className="cdcd"
                eventKey="tables/"
                title="Pet Services"
                title={
                  <div className="title-with-icon">
                    <FontAwesomeIcon icon={faPaw} className="title-icon" />
                    <span style={{ marginLeft: "20px" }}>Pet Services</span>
                    <FontAwesomeIcon icon={faChevronDown} style={{ marginLeft: "20px" }} className="dropdown-icon" />
                  </div>
                }
              >
                {navItems.map((item, index) => (
                  <NavItem
                    key={index}
                    title={item.title}
                    icon={item.icon}
                    link={item.link}
                  />
                ))}
              </CollapsableNavItem>

              <NavItem
                title="Logout"
                icon={faSignOutAlt}
                link={Routes.Signin.path}
              />

              {/* <CollapsableNavItem
                eventKey="examples/"
                title="Page Examples"
                icon={faFileAlt}
              >
                <NavItem title="Sign In" link={Routes.Signin.path} />
                <NavItem title="Sign Up" link={Routes.Signup.path} />
                <NavItem
                  title="Forgot password"
                  link={Routes.ForgotPassword.path}
                />
                <NavItem
                  title="Reset password"
                  link={Routes.ResetPassword.path}
                />
                <NavItem title="Lock" link={Routes.Lock.path} />
                <NavItem title="404 Not Found" link={Routes.NotFound.path} />
                <NavItem
                  title="500 Server Error"
                  link={Routes.ServerError.path}
                />
              </CollapsableNavItem>

              <NavItem
                external
                title="Plugins"
                link="https://demo.themesberg.com/volt-pro-react/#/plugins/datatable"
                target="_blank"
                badgeText="Pro"
                icon={faChartPie}
              />

              <Dropdown.Divider className="my-3 border-indigo" />

              <CollapsableNavItem
                eventKey="documentation/"
                title="Getting Started"
                icon={faBook}
              >
                <NavItem title="Overview" link={Routes.DocsOverview.path} />
                <NavItem title="Download" link={Routes.DocsDownload.path} />
                <NavItem
                  title="Quick Start"
                  link={Routes.DocsQuickStart.path}
                />
                <NavItem title="License" link={Routes.DocsLicense.path} />
                <NavItem
                  title="Folder Structure"
                  link={Routes.DocsFolderStructure.path}
                />
                <NavItem title="Build Tools" link={Routes.DocsBuild.path} />
                <NavItem title="Changelog" link={Routes.DocsChangelog.path} />
              </CollapsableNavItem>
              <CollapsableNavItem
                eventKey="components/"
                title="Components"
                icon={faBoxOpen}
              >
                <NavItem title="Accordion" link={Routes.Accordions.path} />
                <NavItem title="Alerts" link={Routes.Alerts.path} />
                <NavItem title="Badges" link={Routes.Badges.path} />
                <NavItem
                  external
                  title="Widgets"
                  link="https://demo.themesberg.com/volt-pro-react/#/components/widgets"
                  target="_blank"
                  badgeText="Pro"
                />
                <NavItem title="Breadcrumbs" link={Routes.Breadcrumbs.path} />
                <NavItem title="Buttons" link={Routes.Buttons.path} />
                <NavItem title="Forms" link={Routes.Forms.path} />
                <NavItem title="Modals" link={Routes.Modals.path} />
                <NavItem title="Navbars" link={Routes.Navbars.path} />
                <NavItem title="Navs" link={Routes.Navs.path} />
                <NavItem title="Pagination" link={Routes.Pagination.path} />
                <NavItem title="Popovers" link={Routes.Popovers.path} />
                <NavItem title="Progress" link={Routes.Progress.path} />
                <NavItem title="Tables" link={Routes.Tables.path} />
                <NavItem title="Tabs" link={Routes.Tabs.path} />
                <NavItem title="Toasts" link={Routes.Toasts.path} />
                <NavItem title="Tooltips" link={Routes.Tooltips.path} />
              </CollapsableNavItem>
              <NavItem
                external
                title="Themesberg"
                link="https://themesberg.com"
                target="_blank"
                image={ThemesbergLogo}
              />
              <Button as={Link} to={Routes.Upgrade.path} variant="secondary" className="upgrade-to-pro"><FontAwesomeIcon icon={faRocket} className="me-1" /> Upgrade to Pro</Button> */}
            </Nav>
          </div>
        </SimpleBar>
      </CSSTransition>
    </>
  );
};
