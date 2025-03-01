import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { createAsyncLoading } from "../../redux/loadingReducer";
import { createAsyncMessage } from "../../redux/messageReducer";
import Loading from "../../components/Loading";
import Swal from "sweetalert2";
import ReactLoading from "react-loading";

const { VITE_BASE_URL: BASE_URL, VITE_API_PATH: API_PATH } = import.meta.env;

export default function ProductsPage() {
  const dispatch = useDispatch();
  const { isLoading, variant } = useSelector((state) => state.loading); // 取得 Redux Loading 狀態
  const [products, setProducts] = useState([]);

  useEffect(() => {
    dispatch(
      createAsyncLoading({
        loadingText: "載入產品中...",
        asyncFunction: async () => {
          try {
            const res = await axios.get(`${BASE_URL}/v2/api/${API_PATH}/products`);
            setProducts(res.data.products);
          } catch (error) {
            dispatch(
              createAsyncMessage({
                title: "取得產品失敗",
                text: error?.response?.data?.message || "請稍後再試",
                status: "failed",
              })
            );
          }
        },
      })
    );
  }, [dispatch]);

  const addCart = (product_id, qty) => {
    dispatch(
      createAsyncLoading({
        loadingText: "加入購物車中...",
        variant: "small",
        asyncFunction: async () => {
          try {
            await axios.post(`${BASE_URL}/v2/api/${API_PATH}/cart`, {
              data: { product_id, qty: Number(qty) },
            });

            dispatch(
              createAsyncMessage({
                title: "成功!",
                text: "商品已成功加入購物車!",
                status: "success",
              })
            );
          } catch (error) {
            dispatch(
              createAsyncMessage({
                title: "加入購物車失敗",
                text: error?.response?.data?.message || "請稍後再試",
                status: "failed",
              })
            );
          }
        },
      }) );
  };

  return (
    <>
      {/* 全螢幕 Loading 組件 */}
      <Loading />

      <div className="container">
        <div className="mt-4">
          <table className="table align-middle">
            <thead>
              <tr>
                <th>圖片</th>
                <th>商品名稱</th>
                <th>價格</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product.id}>
                  <td style={{ width: "200px" }}>
                    <img
                      className="img-fluid"
                      src={product.imageUrl}
                      alt={product.title}
                    />
                  </td>
                  <td>{product.title}</td>
                  <td>
                    <del className="h6">原價 {product.origin_price} 元</del>
                    <div className="h5">特價 {product.price}元</div>
                  </td>
                  <td>
                    <div className="btn-group btn-group-sm">
                      <Link
                        to={`/products/${product.id}`}
                        className="btn btn-outline-secondary"
                      >
                        查看更多
                      </Link>
                      <button
                        type="button"
                        className="btn btn-outline-danger d-flex align-items-center gap-2"
                        disabled={variant === "small" && isLoading}
                        onClick={() => addCart(product.id, 1)}
                      >
                        加到購物車
                        {variant === "small" && isLoading && (
                          <ReactLoading
                            type={"spin"}
                            color={"#000"}
                            height={"1.5rem"}
                            width={"1.5rem"}
                          />
                        )}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
