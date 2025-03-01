import { NavLink, Outlet, useNavigate } from "react-router-dom";
import axios from "axios";
import { useDispatch } from "react-redux";
import { logoutAdmin } from "../redux/authReducer";
import { createAsyncMessage } from "../redux/messageReducer";

export default function AdminLayout() {
  const navigate = useNavigate(); // 用於導航
  const dispatch = useDispatch();

const handleLogout = async () => {
  try {
    const response = await dispatch(logoutAdmin()).unwrap();
    console.log("登出成功");

    // 確保清除 token 並重設 axios headers
    document.cookie = "authToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/";
    delete axios.defaults.headers.common["Authorization"];

    dispatch(createAsyncMessage({
      title: "成功",
      text: "登出成功",
      status: "success",
    }));
    navigate("/adminLogin");
  } catch (error) {
    console.error("登出失敗", error);
    dispatch(createAsyncMessage({
      title: "錯誤",
      text: error?.response?.data?.message || "登出失敗，請稍後再試！",
      status: "error",
    }));
  }
}; 

  return (
    <>
      <div className="container-fluid d-flex">
        <nav className="navbar navbar-expand-lg bg-body-tertiary">
          <div className="container-fluid flex-column justify-content-start">
            <NavLink to="/admin/orders" className="nav-link fs-2">
              LOGO
            </NavLink>

            <div
              className="collapse navbar-collapse"
              id="navbarSupportedContent"
            >
              <ul className="navbar-nav me-auto mb-2 mb-lg-0 flex-column justify-content-start">
                <li className="nav-item">
                  <NavLink to="/admin/products" className="nav-link">
                    商品管理
                  </NavLink>
                </li>
                <li className="nav-item">
                  <NavLink to="/admin/orders" className="nav-link">
                    訂單管理
                  </NavLink>
                </li>
                <li className="nav-item">
                  <NavLink to="/" className="nav-link">
                    返回前台
                  </NavLink>
                </li>
                <li className="nav-item ">
                  <button
                    type="button"
                    className="btn btn-dark"
                    onClick={handleLogout}
                  >
                    登出系統
                  </button>
                </li>
              </ul>
            </div>
          </div>
        </nav>
        <div>
          <Outlet />
        </div>
      </div>
    </>
  );
}
