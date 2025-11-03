export const getVietnameseDate = (type = "today", showTime = false) => {
    const date = new Date();
  
    // ⚙️ Điều chỉnh ngày theo type
    if (type === "yesterday") date.setDate(date.getDate() - 1);
    if (type === "tomorrow") date.setDate(date.getDate() + 1);
  
    const options = {
      weekday: "long",
      day: "numeric",
      month: "numeric",
      year: "numeric",
    };
  
    if (showTime) {
      options.hour = "2-digit";
      options.minute = "2-digit";
    }
  
    return date.toLocaleDateString("vi-VN", options);
  };