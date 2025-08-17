import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomePage from '../pages/HomePage'
import JobList from '../components/JobList'
import RecordMeterForm from '../components/RecordMeterForm'
import JobHistoryList from "../components/JobHistoryList";

const AppRoutes = () => {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<HomePage />} >
                    <Route index element={<JobList />} />
                    <Route path="jobs" element={<JobList />} />
                    <Route path="errors" element={<RecordMeterForm />} />
                    <Route path='job-history' element={<JobHistoryList />} />
                </Route>
            </Routes>
        </BrowserRouter>
    )
}

export default AppRoutes