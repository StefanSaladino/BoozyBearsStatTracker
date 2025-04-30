import { jsx as _jsx } from "react/jsx-runtime";
// import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import 'bootstrap/dist/css/bootstrap.min.css';
ReactDOM.createRoot(document.getElementById('root')).render(
// <React.StrictMode>
_jsx(BrowserRouter, { children: _jsx(App, {}) })
// </React.StrictMode>
);
