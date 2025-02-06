import React from "react";
import '../../styles/userView/userInfo.css';
import imagen from '../../img/WebBanner01_GTID.jpg';

const ContactBanner = () => {
  return (
    <div className="contact-banner">
      <img src={imagen} alt="Banner Publicitario" />
    </div>
  );
};

export default ContactBanner;