import Layout from "./Layout.jsx";

import Dashboard from "./Dashboard";

import Upload from "./Upload";

import Editor from "./Editor";

import Library from "./Library";

import Analytics from "./Analytics";

import Templates from "./Templates";

import BrandKit from "./BrandKit";

import AdminDashboard from "./AdminDashboard";

import CRMCustomers from "./CRMCustomers";

import CRMContacts from "./CRMContacts";

import CRMDeals from "./CRMDeals";

import FeatureFlags from "./FeatureFlags";

import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';

const PAGES = {
    
    Dashboard: Dashboard,
    
    Upload: Upload,
    
    Editor: Editor,
    
    Library: Library,
    
    Analytics: Analytics,
    
    Templates: Templates,
    
    BrandKit: BrandKit,
    
    AdminDashboard: AdminDashboard,
    
    CRMCustomers: CRMCustomers,
    
    CRMContacts: CRMContacts,
    
    CRMDeals: CRMDeals,
    
    FeatureFlags: FeatureFlags,
    
}

function _getCurrentPage(url) {
    if (url.endsWith('/')) {
        url = url.slice(0, -1);
    }
    let urlLastPart = url.split('/').pop();
    if (urlLastPart.includes('?')) {
        urlLastPart = urlLastPart.split('?')[0];
    }

    const pageName = Object.keys(PAGES).find(page => page.toLowerCase() === urlLastPart.toLowerCase());
    return pageName || Object.keys(PAGES)[0];
}

// Create a wrapper component that uses useLocation inside the Router context
function PagesContent() {
    const location = useLocation();
    const currentPage = _getCurrentPage(location.pathname);
    
    return (
        <Layout currentPageName={currentPage}>
            <Routes>            
                
                    <Route path="/" element={<Dashboard />} />
                
                
                <Route path="/Dashboard" element={<Dashboard />} />
                
                <Route path="/Upload" element={<Upload />} />
                
                <Route path="/Editor" element={<Editor />} />
                
                <Route path="/Library" element={<Library />} />
                
                <Route path="/Analytics" element={<Analytics />} />
                
                <Route path="/Templates" element={<Templates />} />
                
                <Route path="/BrandKit" element={<BrandKit />} />
                
                <Route path="/AdminDashboard" element={<AdminDashboard />} />
                
                <Route path="/CRMCustomers" element={<CRMCustomers />} />
                
                <Route path="/CRMContacts" element={<CRMContacts />} />
                
                <Route path="/CRMDeals" element={<CRMDeals />} />
                
                <Route path="/FeatureFlags" element={<FeatureFlags />} />
                
            </Routes>
        </Layout>
    );
}

export default function Pages() {
    return (
        <Router>
            <PagesContent />
        </Router>
    );
}