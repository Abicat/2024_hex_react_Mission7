import { useSelector } from "react-redux";
import ReactLoading from "react-loading";
import "../assets/Loading.css"; // 引入 CSS 樣式

const Loading = () => {
  const { isLoading, loadingText, variant, type } = useSelector((state) => state.loading);

  // **預設樣式**
  const defaultStyles = {
    fullscreen: {
      bgColor: "rgba(0, 0, 0, 0.5)", // 背景顏色
      color: "#fff", // 文字 & ReactLoading 顏色
      width: "8rem", // ReactLoading 寬度
      height: "8rem", // ReactLoading 高度
      fontSize: "84px", // `loading01` 字體大小
      fontWeight: "800", // `loading01` 字體加粗
    },
    small: {
      color: "#000", // 文字 & ReactLoading 顏色
      width: 40, // 小型 loading 大小
      height: 40,
    },
  };

  if (!isLoading) return null;

  return variant === "small" ? (
    /** 小型 Loading (按鈕、局部區塊用) **/
    <div className="loading d-flex align-items-center">
      <h3 className="me-2">
        <ReactLoading type="spin" color={defaultStyles.small.color} height={defaultStyles.small.height} width={defaultStyles.small.width} />
      </h3>
      <h3 className="text-dark">{loadingText}</h3>
    </div>
  ) : (
    /** 全屏 Loading (loading01 或 ReactLoading) **/
    <div
      className="d-flex flex-column justify-content-center align-items-center position-fixed"
      style={{
        inset: 0,
        backgroundColor: defaultStyles.fullscreen.bgColor,
        zIndex: 100,
      }}
    >
      {type === "loading01" ? (
        /** 文字動畫效果 **/
        <div
          className="loading loading01"
          style={{
            fontSize: defaultStyles.fullscreen.fontSize,
            fontWeight: defaultStyles.fullscreen.fontWeight,
            color: defaultStyles.fullscreen.color,
          }}
        >
          {loadingText.split("").map((char, index) => (
            <span key={index}>{char}</span>
          ))}
        </div>
      ) : (
        /** ReactLoading 全屏顯示 **/
        <>
          {loadingText && (
            <span
              className="mb-3"
              style={{
                color: defaultStyles.fullscreen.color,
                fontSize: "1.25rem",
                fontWeight: "bold",
              }}
            >
              {loadingText}
            </span>
          )}
          <ReactLoading
            type={type}
            color={defaultStyles.fullscreen.color}
            width={defaultStyles.fullscreen.width}
            height={defaultStyles.fullscreen.height}
          />
        </>
      )}
    </div>
  );
};

export default Loading;
