//import react into the bundle
import React from "react";
import ReactDOM from "react-dom";

// import i18n (needs to be bundled ;))
// import '../../i18n';

//include your index.scss file into the bundle
import "../styles/index.css";

//import your own components
import Layout from "./layout";

//render your react application
ReactDOM.render(<Layout />, document.querySelector("#app"));
