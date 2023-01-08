import React from "react";
import "./aboutSection.css";
import { Button, Typography, Avatar } from "@material-ui/core";
import YouTubeIcon from "@material-ui/icons/YouTube";
import InstagramIcon from "@material-ui/icons/Instagram";
const About = () => {
  const visitInstagram = () => {
    window.location = "https://instagram.com/official_gadariya01";
  };
  return (
    <div className="aboutSection">
      <div></div>
      <div className="aboutSectionGradient"></div>
      <div className="aboutSectionContainer">
        <Typography component="h1">About Us</Typography>

        <div>
          <div>
            <Avatar
              style={{ width: "10vmax", height: "10vmax", margin: "2vmax 0" }}
              src="https://res.cloudinary.com/djyp8oxvt/image/upload/v1672937591/avatars/hfcomvgyzwbufrwfpabi.png"
              alt="Creator"
            />
            <Typography>Rohit Baghel</Typography>
            <Button onClick={visitInstagram} color="primary">
              Visit Instagram
            </Button>
            <span>
              This is an Ecommerce website with all the functionality such as
              customers to browse, select, and purchase products online Some
              additional functionality are the ability for customers to  leave reviews for products, and filter or sort
              products by various criteria such as price, category, or brand. In
              the admin panel,  have tools for managing
              orders, processing returns or exchanges, and generating reports on
              sales and customer activity. Having a responsive design that is
              optimized for both desktop and mobile devices.
            </span>
          </div>
          <div className="aboutSectionContainer2">
            <Typography component="h2">Our Brands</Typography>
            <a href="https://www.youtube.com" target="blank">
              <YouTubeIcon className="youtubeSvgIcon" />
            </a>

            <a href="https://instagram.com/official_gadariya01" target="blank">
              <InstagramIcon className="instagramSvgIcon" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
