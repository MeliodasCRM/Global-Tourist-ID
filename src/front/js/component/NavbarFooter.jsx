import React from "react";
import { IoHome, IoPerson, IoQrCode, IoTime } from "react-icons/io5";
import '../../styles/userView/userInfo.css';

const NavbarFooter = () => {
  return (
    <div className="navbar-footer">
      <IoHome className="footer-icon" />
      <IoPerson className="footer-icon" />
      <IoQrCode className="footer-icon" />
      <IoTime className="footer-icon" />
    </div>
  );
};

export default NavbarFooter;