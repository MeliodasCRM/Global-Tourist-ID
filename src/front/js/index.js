//import react into the bundle
import React, { Suspense } from 'react';
import ReactDOM from "react-dom";
import './i18n';

//include your index.scss file into the bundle
import "../styles/index.css";

//import your own components

import Layout from "./layout";

//render your react application
ReactDOM.render(<React.StrictMode> <Suspense fallback={<div>Loading...</div>}> <Layout />  </Suspense> </React.StrictMode> 
, document.querySelector("#app"));
