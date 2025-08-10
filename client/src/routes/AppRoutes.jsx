import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomePage from "../pages/Homepage";

const AppRoutes = () => {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" >
                    <Route index element={<HomePage />} />
                </Route>
            </Routes>
        </BrowserRouter>
    )
}

export default AppRoutes