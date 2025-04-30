import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import LandingPage from './pages/LandingPage/LandingPage';
import RosterPage from './pages/Roster/RosterPage';
import PlayerDetailPage from './pages/PlayerDetail/PlayerDetailPage';
import AdminDashboard from './pages/AdminDashboard/AdminDashboard';
import NewPlayerPage from './pages/NewPlayer/NewPlayerPage';
import AddHighlightPage from './pages/AddHighlight/AddHighlightPage';
import RegisterPage from './pages/Register/RegisterPage';
import LoginPage from './pages/Login/LoginPage';
import EditHighlightsPage from './pages/EditHighlights/EditHighlights';
import { AuthProvider } from './context/AuthContext';
const App = () => {
    return (_jsx(_Fragment, { children: _jsxs(AuthProvider, { children: [_jsx(Header, {}), _jsx("main", { children: _jsxs(Routes, { children: [_jsx(Route, { path: "/", element: _jsx(LandingPage, {}) }), _jsx(Route, { path: "/register", element: _jsx(RegisterPage, {}) }), _jsx(Route, { path: "/login", element: _jsx(LoginPage, {}) }), _jsx(Route, { path: "/roster", element: _jsx(RosterPage, {}) }), _jsx(Route, { path: "/players/:id", element: _jsx(PlayerDetailPage, {}) }), _jsx(Route, { path: "/admin-dashboard", element: _jsx(AdminDashboard, {}) }), _jsx(Route, { path: "/admin/new-player", element: _jsx(NewPlayerPage, {}) }), _jsx(Route, { path: "/admin/add-highlight/:playerId", element: _jsx(AddHighlightPage, {}) }), _jsx(Route, { path: "/admin/edit-highlights", element: _jsx(EditHighlightsPage, {}) })] }) }), _jsx(Footer, {})] }) }));
};
export default App;
