import LoginForm from "../components/LoginForm"
import { useSelector, useDispatch } from "react-redux"
import { Outlet, useNavigate } from "react-router-dom"
import './homepage.scss'
import { AiOutlineMenu } from "react-icons/ai";
import { Logout } from "../redux/slices/userSlice";

const HomePage = () => {
    const user = useSelector(state => state.user)
    const userInfo = user.userInfo
    const isAuthenticated = user.isAuthenticated
    const navigate = useNavigate()
    const dispatch = useDispatch();

    const handleLogout = () => {
        localStorage.removeItem('access_token')
        dispatch(Logout())
        navigate('/')
    }
    return (
        <div className="container">
            <div style={{ backgroundColor: '#03a1fc', height: '200px' }} className="d-flex justify-content-center align-items-center">
                <h2 className="text-center text-white">HỆ THỐNG QUẢN LÝ ĐỒNG HỒ NƯỚC</h2>
            </div>
            <div>
                {!isAuthenticated ? (
                    <LoginForm />
                ) :
                    (
                        <div className="content pt-3">
                            <div className="sidebar col-md-3">
                                <div className="user-info">
                                    <h5 >Thông tin người dùng</h5>
                                    <p>Họ tên: {userInfo.full_name}</p>
                                    <p>Vai trò: {userInfo.role}</p>
                                    <button className="btn btn-danger mt-2" onClick={handleLogout}>Đăng xuất</button>
                                </div>
                                <div className="features-list mt-3  ">
                                    <div className="">
                                        <AiOutlineMenu />
                                        <span className="text-bold">Menu chức năng</span>
                                    </div>
                                    <div onClick={() => navigate("/jobs")}>Danh sách công việc</div>
                                    <div onClick={() => navigate("/errors")}>Ghi nhận đồng hồ lỗi</div>
                                    <div onClick={() => navigate("/notifications")}>Thông báo</div>
                                    <div onClick={() => navigate("/stats")}>Thống kê</div>
                                </div>
                            </div>
                            <div className="component-container">
                                <Outlet />
                            </div>
                        </div>
                    )
                }

            </div>
        </div>
    )
}

export default HomePage