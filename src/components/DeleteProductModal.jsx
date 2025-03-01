import { useEffect, useRef } from "react";
import { Modal } from "bootstrap";
import axios from "axios";
import { useDispatch } from "react-redux";
import { createAsyncMessage } from "../redux/messageReducer";
import { createAsyncLoading } from "../redux/loadingReducer";

const { VITE_BASE_URL: BASE_URL, VITE_API_PATH: API_PATH } = import.meta.env;

function DeleteProductModal({
  tempProduct,
  getProducts,
  isOpen,
  setIsOpen,
}) {
  const dispatch = useDispatch(); 
  const delProductModalRef = useRef(null);
  useEffect(() => {
    new Modal(delProductModalRef.current, {
      backdrop: false,
    });
  }, []);

  useEffect(() => {
    if (isOpen) {
      const modalInstance = Modal.getInstance(delProductModalRef.current);
      modalInstance.show();
    }
  }, [isOpen]);

  const handleCloseDelProductModal = () => {
    const modalInstance = Modal.getInstance(delProductModalRef.current);
    modalInstance.hide();
    setIsOpen(false);
  };

  // 刪除產品 API
  const deleteProduct = async () => {
    try {
      await axios.delete(
        `${BASE_URL}/v2/api/${API_PATH}/admin/product/${tempProduct.id}`
      );
      dispatch(
        createAsyncMessage({
          title: "刪除成功",
          text: `產品 "${tempProduct.title}" 已成功刪除!`,
          status: "success",
        })
      );
    } catch (error) {
      dispatch(
        createAsyncMessage({
          title: "刪除失敗",
          text: error?.response?.data?.message || "刪除產品失敗，請稍後再試",
          status: "failed",
        })
      );
    }
  };

  // 確認刪除產品
  const handelDeleteProduct = async () => {
    try {
      await deleteProduct();
      getProducts();
      handleCloseDelProductModal();
    } catch (error) {
      dispatch(
        createAsyncMessage({
          title: "刪除失敗",
          text: error?.response?.data?.message || "刪除產品失敗，請稍後再試",
          status: "failed",
        })
      );
    }
  };

  return (
    <>
      <div
        ref={delProductModalRef}
        className="modal fade"
        id="delProductModal"
        tabIndex="-1"
        style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h1 className="modal-title fs-5">刪除產品</h1>
              <button
                onClick={handleCloseDelProductModal}
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">
              您是否要刪除
              <span className="text-danger fw-bold">{tempProduct.title}</span>
            </div>
            <div className="modal-footer">
              <button
                onClick={handleCloseDelProductModal}
                type="button"
                className="btn btn-secondary"
              >
                取消
              </button>
              <button
                onClick={handelDeleteProduct}
                type="button"
                className="btn btn-danger"
              >
                刪除
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default DeleteProductModal;
