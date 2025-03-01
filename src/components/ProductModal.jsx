import { useEffect, useState, useRef } from "react";
import { Modal } from "bootstrap";
import axios from "axios";
import PropTypes from "prop-types";
import { useDispatch } from "react-redux";
import { createAsyncMessage } from "../redux/messageReducer";
import { createAsyncLoading } from "../redux/loadingReducer";

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

function ProductModal({
  modalMode,
  tempProduct,
  isOpen,
  setIsOpen,
  getProducts,
}) {

  const dispatch = useDispatch();
  const [modalData, setModalData] = useState(initialModalState);
  const [newImageUrl, setNewImageUrl] = useState(null);
  const productModalRef = useRef(null);
  let modalInstance = null;

  useEffect(() => {
    new Modal(productModalRef.current, {
      backdrop: false,
    });
  }, []);

  useEffect(() => {
    if (isOpen) {
      modalInstance = Modal.getInstance(productModalRef.current);
      modalInstance.show();
      
      setModalData(tempProduct); // **每次開啟 modal，確保表單內容來自 tempProduct**
      setNewImageUrl(null); // 清除暫存圖片

      // 清空上傳圖片的輸入框
      const fileInput = document.getElementById("fileInput");
      if (fileInput) {
        fileInput.value = "";
      }
    }
  }, [isOpen, tempProduct]);

  const handleCloseProductModal = () => {
    const modalInstance = Modal.getInstance(productModalRef.current);
    modalInstance.hide();
    setIsOpen(false);
  };

  const handleModalInputChange = (e) => {
    const { name, value, checked, type } = e.target;
    setModalData({
      ...modalData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleImageChange = (e, index) => {
    const { value } = e.target;
    const newImages = [...modalData.imagesUrl];
    newImages[index] = value;
    setModalData({ ...modalData, imagesUrl: newImages });
  };

  // 新增商品附圖資料
  const handleAddImage = () => {
    const newImages = [...modalData.imagesUrl, ""];
    setModalData({
      ...modalData,
      imagesUrl: newImages,
    });
  };

  // 刪除商品附圖資料
  const handleRemoveImage = () => {
    const newImages = [...modalData.imagesUrl];
    newImages.pop();
    setModalData({
      ...modalData,
      imagesUrl: newImages,
    });
  };

  // **API 請求 (新增/更新)**
  const saveProduct = async () => {
    const apiUrl =
      modalMode === "create"
        ? `${BASE_URL}/v2/api/${API_PATH}/admin/product`
        : `${BASE_URL}/v2/api/${API_PATH}/admin/product/${modalData.id}`;

    const apiMethod = modalMode === "create" ? axios.post : axios.put;

    try {
      await apiMethod(apiUrl, {
        data: {
          ...modalData,
          origin_price: Number(modalData.origin_price),
          price: Number(modalData.price),
          is_enabled: modalData.is_enabled ? 1 : 0,
          score: Number(modalData.score),
        },
      });

      dispatch(
        createAsyncMessage({
          title: modalMode === "create" ? "新增成功" : "更新成功",
          text: modalMode === "create" ? "產品已成功新增!" : "產品已成功更新!",
          status: "success",
        })
      );

      getProducts(); // 重新載入產品列表
      handleCloseProductModal(); // 成功後關閉 Modal
    } catch (error) {
      dispatch(
        createAsyncMessage({
          title: modalMode === "create" ? "新增失敗" : "更新失敗",
          text: error?.response?.data?.message || "請稍後再試",
          status: "failed",
        })
      );
    }
  };

  // **確認更新產品**
  const handleUpdateProduct = () => {
    dispatch(
      createAsyncLoading({
        loadingText: modalMode === "create" ? "新增產品中..." : "更新產品中...",
        asyncFunction: saveProduct,
      })
    );
  };

  // 上傳圖片功能
  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    const formData = new FormData();
    formData.append("file-to-upload", file);

    try {
      const res = await axios.post(
        `${BASE_URL}/v2/api/${API_PATH}/admin/upload`,
        formData
      );

      const uploadedImageUrl = res.data.imageUrl;
      setModalData({
        ...modalData,
        imageUrl: uploadedImageUrl,
      });
    } catch (error) {
      dispatch(
        createAsyncMessage({
          title: "圖片上傳失敗",
          text: error?.response?.data?.message || "請稍後再試",
          status: "failed",
        })
      );
    }
  };

  return (
    <>
      <div
        ref={productModalRef}
        id="productModal"
        className="modal"
        style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
      >
        <div className="modal-dialog modal-dialog-centered modal-xl">
          <div className="modal-content border-0 shadow">
            <div className="modal-header border-bottom">
              <h5 className="modal-title fs-4">
                {modalMode === "create" ? "新增產品" : "編輯產品"}
              </h5>
              <button
                type="button"
                className="btn-close"
                aria-label="Close"
                onClick={handleCloseProductModal}
              ></button>
            </div>

            <div className="modal-body p-4">
              <div className="row g-4">
                <div className="col-md-4">
                  <div className="mb-5">
                    <label htmlFor="fileInput" className="form-label">
                      圖片上傳
                    </label>
                    <input
                      type="file"
                      accept=".jpg,.jpeg,.png"
                      className="form-control"
                      id="fileInput"
                      onChange={handleFileChange}
                    />
                  </div>
                  <div className="mb-4">
                    <label htmlFor="primary-image" className="form-label">
                      主圖
                    </label>
                    <div className="input-group">
                      <input
                        value={modalData.imageUrl}
                        onChange={handleModalInputChange}
                        name="imageUrl"
                        type="url"
                        id="primary-image"
                        className="form-control"
                        placeholder="請輸入圖片連結"
                      />
                    </div>
                    <img
                      src={modalData.imageUrl}
                      alt={modalData.title}
                      className="img-fluid"
                    />
                  </div>

                  {/* 副圖 */}
                  <div className="border border-2 border-dashed rounded-3 p-3">
                    {modalData.imagesUrl?.map((image, index) => (
                      <div key={index} className="mb-2">
                        <label
                          htmlFor={`imagesUrl-${index + 1}`}
                          className="form-label"
                        >
                          副圖 {index + 1}
                        </label>
                        <input
                          value={image}
                          onChange={(e) => handleImageChange(e, index)}
                          id={`imagesUrl-${index + 1}`}
                          type="url"
                          placeholder={`圖片網址 ${index + 1}`}
                          className="form-control mb-2"
                        />
                        {image && (
                          <img
                            src={image}
                            alt={`副圖 ${index + 1}`}
                            className="img-fluid mb-2"
                          />
                        )}
                      </div>
                    ))}

                    <div className="btn-group w-100">
                      {modalData.imagesUrl.length < 5 &&
                        modalData.imagesUrl[modalData.imagesUrl.length - 1] !==
                          "" && (
                          <button
                            className="btn btn-outline-primary btn-sm w-100"
                            onClick={handleAddImage}
                          >
                            新增圖片
                          </button>
                        )}
                      {modalData.imagesUrl.length > 1 && (
                        <button
                          className="btn btn-outline-danger btn-sm w-100"
                          onClick={handleRemoveImage}
                        >
                          取消圖片
                        </button>
                      )}
                    </div>
                  </div>
                </div>

                <div className="col-md-8">
                  <div className="mb-3">
                    <label htmlFor="title" className="form-label">
                      標題
                    </label>
                    <input
                      value={modalData.title}
                      onChange={handleModalInputChange}
                      name="title"
                      id="title"
                      type="text"
                      className="form-control"
                      placeholder="請輸入標題"
                    />
                  </div>

                  <div className="mb-3">
                    <label htmlFor="category" className="form-label">
                      分類
                    </label>
                    <input
                      value={modalData.category}
                      onChange={handleModalInputChange}
                      name="category"
                      id="category"
                      type="text"
                      className="form-control"
                      placeholder="請輸入分類"
                    />
                  </div>

                  <div className="mb-3">
                    <label htmlFor="unit" className="form-label">
                      單位
                    </label>
                    <input
                      value={modalData.unit}
                      onChange={handleModalInputChange}
                      name="unit"
                      id="unit"
                      type="text"
                      className="form-control"
                      placeholder="請輸入單位"
                    />
                  </div>

                  <div className="row g-3 mb-3">
                    <div className="col-6">
                      <label htmlFor="origin_price" className="form-label">
                        原價
                      </label>
                      <input
                        value={modalData.origin_price}
                        min="0" /* 防止使用者選擇到負值 */
                        onChange={handleModalInputChange}
                        name="origin_price"
                        id="origin_price"
                        type="number"
                        className="form-control"
                        placeholder="請輸入原價"
                      />
                    </div>
                    <div className="col-6">
                      <label htmlFor="price" className="form-label">
                        售價
                      </label>
                      <input
                        value={modalData.price}
                        min="0"
                        onChange={handleModalInputChange}
                        name="price"
                        id="price"
                        type="number"
                        className="form-control"
                        placeholder="請輸入售價"
                      />
                    </div>
                  </div>

                  <div className="mb-3">
                    <label htmlFor="description" className="form-label">
                      產品描述
                    </label>
                    <textarea
                      value={modalData.description}
                      onChange={handleModalInputChange}
                      name="description"
                      id="description"
                      className="form-control"
                      rows={4}
                      placeholder="請輸入產品描述"
                    ></textarea>
                  </div>

                  <div className="mb-3">
                    <label htmlFor="content" className="form-label">
                      說明內容
                    </label>
                    <textarea
                      value={modalData.content}
                      onChange={handleModalInputChange}
                      name="content"
                      id="content"
                      className="form-control"
                      rows={4}
                      placeholder="請輸入說明內容"
                    ></textarea>
                  </div>

                  <div className="form-check">
                    <input
                      checked={modalData.is_enabled}
                      onChange={handleModalInputChange}
                      name="is_enabled"
                      type="checkbox"
                      className="form-check-input"
                      id="isEnabled"
                    />
                    <label className="form-check-label" htmlFor="isEnabled">
                      是否啟用
                    </label>
                  </div>
                </div>
              </div>
            </div>

            <div className="modal-footer border-top bg-light">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={handleCloseProductModal}
              >
                取消
              </button>
              <button
                type="button"
                className="btn btn-primary"
                onClick={handleUpdateProduct}
              >
                確認
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

ProductModal.propTypes = {
  modalMode: PropTypes.oneOfType([PropTypes.string, PropTypes.oneOf([null])]),
  tempProduct: PropTypes.object.isRequired,
  isOpen: PropTypes.bool.isRequired,
  setIsOpen: PropTypes.func.isRequired,
  getProducts: PropTypes.func,
};

export default ProductModal;
