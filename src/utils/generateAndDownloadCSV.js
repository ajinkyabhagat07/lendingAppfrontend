export const generateAndDownloadCSV = async (file, fileIndex , fieldsToDisplayForCSV) => {
    return new Promise((resolve) => {
      const csvHeaders = fieldsToDisplayForCSV.join(",");
      const csvRows = file.map((user) =>fieldsToDisplayForCSV
          .map((field) => (user[field] !== undefined ? `"${user[field]}"` : ""))
          .join(",")
      );
      const csvContent = [csvHeaders, ...csvRows].join("\n");
  
      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.setAttribute("download", `users_part_${fileIndex}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
  
      resolve(); 
    });
  };