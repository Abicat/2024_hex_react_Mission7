import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import ProductModal from "../../components/ProductModal";
import DeleteProductModal from "../../components/DeleteProductModal";
import Pagination from "../../components/Pagination";
import { checkLogin } from "../../redux/authReducer";
import { createAsyncMessage } from "../../redux/messageReducer";
import { createAsyncLoading } from "../../redux/loadingReducer";
import * as bootstrap from "bootstrap";
import axios from "axios";
import "../../assets/style.css";

const { VITE_BASE_URL: BASE_URL, VITE_API_PATH: API_PATH } = import.meta.env;

// 產品資料初始狀態
const initialModalState = {
  imageUrl: "",
  title: "",
  category: "",
  unit: "",
  origin_price: "",
  price: "",
  description: "",
  content: "",
  is_enabled: 0,
  imagesUrl: [""],
  score: "",
};

export default function AdminProducts() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [products, setProducts] = useState([]);

  useEffect(() => {
    dispatch(checkLogin())
      .unwrap()
      .then(() => getProducts())
      .catch(() => {
        dispatch(createAsyncMessage({
          title: "登入失敗",
          text: "請重新登入",
          status: "failed",
        }));
        navigate("/admin");
      });
  }, [dispatch, navigate]);

  const getProducts = async (page = 1) => {
    try {
      const res = await axios.get(
        `${BASE_URL}/v2/api/${API_PATH}/admin/products?page=${page}`
      );
      setProducts(res.data.products);
      setPageInfo(res.data.pagination);
    } catch (error) {
      dispatch(
        createAsyncMessage({
          title: "產品載入失敗",
          text:
            error?.response?.data?.message || "無法取得產品列表，請稍後再試",
          status: "failed",
        })
      );
    }
  };

  useEffect(() => {
    getProducts();
  }, []);

  const [tempProduct, setTempProduct] = useState(initialModalState);
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [isDeleteProductModalOpen, setIsDeleteProductModalOpen] =
    useState(false);

  const [modalMode, setModalMode] = useState(null);

  const handleOpenProductModal = (mode, product) => {
    setModalMode(mode);
    switch (mode) {
      case "create":
        setTempProduct(initialModalState);
        break;

      case "edit":
        setTempProduct(product);
        break;

      default:
        break;
    }
    setIsProductModalOpen(true);
  };

  const handleOpenDelProductModal = (product) => {
    setTempProduct(product);
    setIsDeleteProductModalOpen(true);
  };

  // 控制分頁元件
  const [pageInfo, setPageInfo] = useState({});
  const handlePageChange = (page) => {
    getProducts(page);
  };

  return (
    <>
      <div className="container py-5">
        <div className="row">
          <div className="col">
            <div className="d-flex justify-content-between">
              <h2>產品列表</h2>
              <button
                onClick={() => {
                  handleOpenProductModal("create");
                }}
                type="button"
                className="btn btn-primary"
              >
                建立新的產品
              </button>
            </div>
            <table className="table">
              <thead>
                <tr>
                  <th scope="col">產品名稱</th>
                  <th scope="col">原價</th>
                  <th scope="col">售價</th>
                  <th scope="col">是否啟用</th>
                  <th scope="col"></th>
                </tr>
              </thead>
              <tbody>
                {products.map((product) => (
                  <tr key={product.id}>
                    <th scope="row">{product.title}</th>
                    <td>{product.origin_price}</td>
                    <td>{product.price}</td>
                    <td>
                      {product.is_enabled ? (
                        <span className="text-success">啟用</span>
                      ) : (
                        <span>未啟用</span>
                      )}
                    </td>
                    <td>
                      <div className="btn-group">
                        <button
                          onClick={() => {
                            handleOpenProductModal("edit", product);
                          }}
                          type="button"
                          className="btn btn-outline-primary btn-sm"
                        >
                          編輯
                        </button>
                        <button
                          onClick={() => handleOpenDelProductModal(product)}
                          type="button"
                          className="btn btn-outline-danger btn-sm"
                        >
                          刪除
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* 分頁 */}
      <Pagination pageInfo={pageInfo} handlePageChange={handlePageChange} />

      {/* 新增與編輯 modal */}
      <ProductModal
        modalMode={modalMode}
        tempProduct={tempProduct}
        isOpen={isProductModalOpen}
        setIsOpen={setIsProductModalOpen}
        getProducts={getProducts}
      />

      {/* 刪除 modal */}
      <DeleteProductModal
        tempProduct={tempProduct}
        getProducts={getProducts}
        isOpen={isDeleteProductModalOpen}
        setIsOpen={setIsDeleteProductModalOpen}
      />
    </>
  );
}
