import { IPostAndWFH } from 'models/report';
import * as XLSX from 'xlsx';

interface IProps {
  exportData: IPostAndWFH[];
  type: string;
}

export const handleExportExcelFile = ({ exportData, type }: IProps) => {
  if (exportData.length > 0) {
    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');
    XLSX.writeFile(workbook, `ExportData${type}.csv`);
  }
};
