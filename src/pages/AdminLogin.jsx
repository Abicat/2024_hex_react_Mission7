import { useEffect, useState} from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useForm } from "react-hook-form";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { loginAdmin, checkLogin } from "../redux/authReducer";
import { createAsyncMessage } from "../redux/messageReducer";
import { createAsyncLoading } from "../redux/loadingReducer";

export default function AdminLogin() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    dispatch(checkLogin())
      .unwrap()
      .then(() => navigate("/admin"))
      .catch(() => console.log("未登入，請重新登入"));
  }, [dispatch, navigate]);

  const onSubmit = async (data) => {
    dispatch(
      createAsyncLoading({
        loadingText: "登入中...",
        asyncFunction: async () => {
          try {
            const response = await dispatch(loginAdmin(data)).unwrap();
            dispatch(
              createAsyncMessage({
                title: "登入成功",
                text: "歡迎回來！",
                status: "success",
              })
            );
            navigate("/admin/products");
          } catch (error) {
            dispatch(
              createAsyncMessage({
                title: "登入失敗",
                text:
                  error?.response?.data?.message ||
                  "登入失敗，請重新輸入帳號密碼",
                status: "failed",
              })
            );
          }
        },
      })
    );
  };

  return (
    <div className="d-flex flex-column justify-content-center align-items-center vh-100">
      <div style={{ width: "100%", maxWidth: "300px" }}>
        <h1 className="mb-5">管理員登入</h1>
        <form onSubmit={handleSubmit(onSubmit)} className="d-flex flex-column gap-3">
          <div className="form-floating mb-3">
            <input
              id="username"
              name="username"
              type="email"
              className={`form-control ${errors.username ? "is-invalid" : ""}`}
              placeholder="name@example.com"
              {...register("username", {
                required: "Email is required",
                pattern: {
                  value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                  message: "Invalid email format",
                },
              })}
            />
            <label htmlFor="username">Email address</label>
            {errors.username && <div className="invalid-feedback">{errors.username.message}</div>}
          </div>
          <div className="form-floating">
            <input
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              className={`form-control ${errors.password ? "is-invalid" : ""}`}
              placeholder="Password"
              {...register("password", {
                required: "Password is required",
                minLength: {
                  value: 6,
                  message: "Password must be at least 6 characters",
                },
              })}
            />
            <label htmlFor="password">Password</label>
            {errors.password && <div className="invalid-feedback">{errors.password.message}</div>}
            <span
              className="position-absolute top-50 end-0 translate-middle-y me-3 cursor-pointer"
              onClick={() => setShowPassword(!showPassword)}
              style={{ cursor: "pointer" }}
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </span>
          </div>
          <button className="btn btn-primary">登入</button>
        </form>
        <button
          type="button"
          className="btn btn-outline-primary mt-2"
          onClick={() => navigate("/")}
        >
          返回商品首頁
        </button>
        <p className="mt-3 mb-3 text-muted text-center">&copy; 2024~∞ - 六角學院</p>
      </div>
    </div>
  );
}
