import React, { useRef, useEffect, useState, useContext } from "react";
import { Link, useNavigate, useLocation} from "react-router-dom";
// import StartPlace from "./components/start_place";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import MenuBar2 from "./MenuBar2";
import "./HomePage2.css";
import MyButton from "./mainbutton";
import MyFunctionButton_home from "./functionbutton";
import MapBackground from "./mapbackground";
import Box from "@mui/material/Box";
import { useGreetingData } from './GreetingDataContext';
import MailOutlineOutlinedIcon from '@mui/icons-material/MailOutlineOutlined';

const theme = createTheme({
  palette: {
    primary: {
      main: "#004d40",
    },
    secondary: {
      main: "#004d40",
    },
  },
});


function LandingPage() {
  const images_home = [
    '/static/images/newyork17.jpg',
    '/static/images/newyork18.jpg',
    '/static/images/newyork6.jpg',
    '/static/images/newyork18.jpg',
    '/static/images/newyork17.jpg',
    '/static/images/newyork3.jpg',
    '/static/images/newyork15.jpg',
  ];
  const toggleamble = () => {
    navigate("/realmappage");
  };
  
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
  
    useEffect(() => {
      const timer = setInterval(() => {
        setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images_home.length);
      }, 10000); // 切换间隔为8秒
  
      return () => clearInterval(timer);
    }, []);


  const { temp1, temp2 } = useGreetingData();
  const greeting = temp1 +' ' +temp2+'!';

  
  const greeting2 = temp1 +' ' +temp2;


  const [isButtonHovered, setIsButtonHovered] = useState(false);

  return (
    <div className="landing-page-container">
      <div className="menubar-area">
        <MenuBar2 />
      </div>
      <div
        className={`homepage-pics-container ${
          isButtonHovered ? "hovered" : ""
        }`}
      >
        <div className="left-color-block">
          <div className="hometext-title">
            {!temp1 && !temp2 && (
              <>
                <span style={{ fontSize: "46px", fontWeight: "bolder" }}>
                  amble{" "}
                </span>

                <span style={{ fontSize: "30px", fontWeight: "normal" }}>
                  the peaceful way
                </span>
              </>
            )}
            {temp1 && temp2 && (
              <span style={{ fontSize: "36px", fontWeight: "bolder" }}>
                Welcome back,<br></br>
                {greeting2}!
              </span>
            )}
          </div>
          <div className="hometext-body">
            <span style={{ fontSize: "16px" }}>
              The purpose of our application is to generate walking routes for
              users to guide them though the quiet corners of Manhattan.
              <br></br>
              <br></br>
              The route generating algorthm takes forecast conditions into our
              machine learning model to determine busyiness based on taxizone,
              citibike and subway data and pair this infomation with crimes
              statistics for areas of Manhattan to ensure users can enjoy a
              quiet, peaceful and safe journey!
            </span>
          </div>
          <div className="home-button-container">
            <div
              className="my-button-wrapper"
              onMouseEnter={() => setIsButtonHovered(true)}
              onMouseLeave={() => setIsButtonHovered(false)}
            >
              <MyButton />
            </div>
          </div>
        </div>
        <div className="guidebutton">
          <a href="#mapwrapper_landingpage">
            <MyFunctionButton_home />
          </a>
        </div>
      </div>
      <div className="mapwrapper_landingpage" id="mapwrapper_landingpage">
        <div className="leftbox">
          <MapBackground zoom={12.0} />
        </div>

        <div className="rightbox">
          <div className="rightbox-in-1">
            <span className="hometext-address">
              <span style={{ fontSize: "42px", fontWeight: "bolder" }}>
                Hey,{" "}
              </span>
              {temp1 && temp2 && (
                <span style={{ fontSize: "38px", fontWeight: "bolder" }}>
                  {greeting}
                </span>
              )}
              <br></br>
              <br></br>
              <span style={{ fontSize: "17px" }}>
                Please discover the green world around you!{" "}
              </span>

              <span style={{ fontSize: "17px" }}>
                You can find pedestrian walkways, gardens, green spaces, parks,
                commercial areas, and a vast array of interest points.
              </span>
            </span>
          </div>
          <div className="rightbox-in-2">
            <img
              src={images_home[currentImageIndex]}
              alt="pics"
              className="pic-in-rightbox"
            />
          </div>
        </div>
      </div>

      <div className="endbar">
        <span
          className="endbartitle"
          style={{ fontSize: "36px", color: "#e3fcf7", fontWeight: "bolder" }}
        >
          Want to learn more about amble? Hit us up!
        </span>
        <div className="endbarcontent">
          <div className="endbarone">
            <span
              style={{
                fontSize: "22px",
                color: "#e3fcf7",
                fontWeight: "bolder",
              }}
            >
              Data Team:
            </span>
            <div className="person-info-one">
              <div className="profile-image-one">
                <img src="/static/images/newyork1.jpg" alt="Gary Carroll" />
              </div>
              <div className="G">
                <span style={{ fontSize: "18px", color: "#e3fcf7" }}>
                  Gary Carroll
                </span>
                <div className="email" style={{ display: "inline-flex", alignItems: "center" }}>
                <MailOutlineOutlinedIcon className="gary" style={{ verticalAlign: "middle", fontSize: "24px",color:"white" }}/>
                <a
                  href="mailto:gary.carroll@ucdconnect.ie"
                  style={{
                    fontSize: "18px",
                    color: "#e3fcf7",
                    textDecoration: "none",
                  }}
                >
                 
                  gary.carroll@ucdconnect.ie
                </a>
                </div>
              </div>
            </div>

            <div className="person-info-two">
              <div className="profile-image-two">
                <img src="/static/images/newyork1.jpg" alt="Nicole Neumark" />
              </div>
              <div className="N">
                <span style={{ fontSize: "18px", color: "#e3fcf7" }}>
                  Nicole Neumark
                </span>
                <div className="email" style={{ display: "inline-flex", alignItems: "center" }}>
                <MailOutlineOutlinedIcon className="gary" style={{ verticalAlign: "middle", fontSize: "24px",color:"white" }}/>
                
                <a
                  href="mailto:nicole.neumark@ucdconnect.ie"
                  style={{
                    fontSize: "18px",
                    color: "#e3fcf7",
                    textDecoration: "none",
                  }}
                >
                  
                  nicole.neumark@ucdconnect.ie
                </a>

                </div>
              </div>
            </div>
          </div>
          <div className="endbartwo">
            <span
              style={{
                fontSize: "22px",
                color: "#e3fcf7",
                fontWeight: "bolder",
              }}
            >
              Front-End Team:
            </span>
            <div className="person-info-three">
              <div className="profile-image-three">
                <img src="/static/images/newyork1.jpg" alt="Finbar Allan" />
              </div>
              <div className="F">
                <span style={{ fontSize: "18px", color: "#e3fcf7" }}>
                  Finbar Allan
                </span>
                <div className="email" style={{ display: "inline-flex", alignItems: "center" }}>
                <MailOutlineOutlinedIcon className="gary" style={{ verticalAlign: "middle", fontSize: "24px",color:"white" }}/>
                <a
                  href="mailto:finbar.allan@ucdconnect.ie"
                  style={{
                    fontSize: "18px",
                    color: "#e3fcf7",
                    textDecoration: "none",
                  }}
                >
                
                  finbar.allan@ucdconnect.ie
                </a>
</div>
              </div>
            </div>
            <div className="person-info-four">
              <div className="profile-image-four">
                <img src="/static/images/newyork1.jpg" alt="Ye Xing" />
              </div>
              <div className="Y">
                <span style={{ fontSize: "18px", color: "#e3fcf7" }}>
                  Ye Xing
                </span>
                <div className="email" style={{ display: "inline-flex", alignItems: "center" }}>
                <MailOutlineOutlinedIcon className="gary" style={{ verticalAlign: "middle", fontSize: "24px",color:"white" }}/>
                <a
                  href="mailto: ye.xing@ucdconnect.ie"
                  style={{
                    fontSize: "18px",
                    color: "#e3fcf7",
                    textDecoration: "none",
                  }}
                >
                  
                  ye.xing@ucdconnect.ie
                </a>

              </div>
              </div>
            </div>
          </div>
          <div className="endbarthree">
            <span
              style={{
                fontSize: "22px",
                color: "#e3fcf7",
                fontWeight: "bolder",
              }}
            >
              Back-End Team:
            </span>
            <div className="person-info-five">
              <div className="profile-image-five">
                <img src="/static/images/newyork1.jpg" alt="Cormac Lynch" />
              </div>
              <div className="C">
                <span style={{ fontSize: "18px", color: "#e3fcf7" }}>
                  Cormac Lynch
                </span>
                <div className="email" style={{ display: "inline-flex", alignItems: "center" }}>
                <MailOutlineOutlinedIcon className="gary" style={{ verticalAlign: "middle", fontSize: "24px",color:"white" }}/>
                <a
                  href="mailto:  cormac.lynch1@ucdconnect.ie"
                  style={{
                    fontSize: "18px",
                    color: "#e3fcf7",
                    textDecoration: "none",
                  }}
                >
                
                  cormac.lynch1@ucdconnect.ie
                </a>
</div>
              </div>
            </div>
            <div className="person-info-six">
              <div className="profile-image-six">
                <img src="/static/images/newyork1.jpg" alt=" David Mallon" />
              </div>
              <div className="D">
                <span style={{ fontSize: "18px", color: "#e3fcf7" }}>
                  David Mallon
                </span>
                <div className="email" style={{ display: "inline-flex", alignItems: "center" }}>
                <MailOutlineOutlinedIcon className="gary" style={{ verticalAlign: "middle", fontSize: "24px",color:"white" }}/>
                <a
                  href="mailto:david.mallon@ucdconnect.ie"
                  style={{
                    fontSize: "18px",
                    color: "#e3fcf7",
                    textDecoration: "none",
                  }}
                >
               
                  david.mallon@ucdconnect.ie
                </a>

        </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
export default LandingPage;
