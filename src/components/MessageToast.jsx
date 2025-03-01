import { useSelector, useDispatch } from "react-redux";
import { useEffect } from "react";
import { removeMessage } from "../redux/messageReducer";

function MessageToast() {
  const messages = useSelector((state) => state.message.messages);
  const dispatch = useDispatch();

  useEffect(() => {
    const timers = new Map();

    messages.forEach((message) => {
      if (!timers.has(message.id)) {
        const timer = setTimeout(() => {
          dispatch(removeMessage(message.id));
          timers.delete(message.id);
        }, 2000);
        timers.set(message.id, timer);
      }
    });

    return () => timers.forEach((timer) => clearTimeout(timer));
  }, [messages, dispatch]);

  return (
    <div
      className="toast-container position-fixed"
      style={{ top: "64px", right: "15px" }}
    >
      {messages.map((message) => (
        <div
          key={message.id}
          className="toast show"
          role="alert"
          aria-live="assertive"
          aria-atomic="true"
        >
          <div className={`toast-header ${message.status === "success" ? "bg-success" : "bg-danger"} text-white`}>
            <strong className="me-auto">{message.title}</strong>
            <button
              type="button"
              className="btn-close"
              data-bs-dismiss="toast"
              aria-label="Close"
              onClick={() => dispatch(removeMessage(message.id))}
            />
          </div>
          <div className="toast-body">{message.text}</div>
        </div>
      ))}
    </div>
  );
}

export default MessageToast;
