import React from "react";
import * as XLSX from "xlsx";
import { Button } from "@themesberg/react-bootstrap";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDownload } from '@fortawesome/free-solid-svg-icons';

const DownloadExcelButton = ({ jsonData, fileName }) => {
  const downloadExcel = () => {
    const ws = XLSX.utils.json_to_sheet(jsonData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Sheet1");

    // Convert the workbook to an array buffer
    const buffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });

    // Create a blob from the buffer and download it
    const blob = new Blob([buffer], {
      type: "application/octet-stream",
    });

    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${fileName}.xlsx`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <Button
      onClick={downloadExcel}
      variant="primary"
      style={{ backgroundColor: "#2042d0" }}
    >
      Download Excel <FontAwesomeIcon icon={faDownload} className="mx-2"/>
    </Button>
  );
};

export default DownloadExcelButton;
