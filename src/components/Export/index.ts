import jsPDF from "jspdf";
import moment from "moment-timezone";
import "jspdf-autotable";
import { styleText } from "util";

export const handleExportPdf = (data, title, columns) => {
    const doc = new jsPDF();
    doc.setFontSize(18)
    doc.text(`${title.toUpperCase()}`, 14, 22);

    const tableColumn = columns.map((col) => col.title.toUpperCase());
    const tableRows = title === 'dizimo' ? data.map((item: any) => [
        item.community,
        moment(item.created_at).format("DD/MM/YYYY"),
        item.mode_pay.toUpperCase(),
        item.tither.fullName,
        item.value.toLocaleString('pt-br',{style: 'currency', currency: 'BRL'})
    ]) : data.map((item: any) => [
        item.community,
        moment(item.date).format("DD/MM/YYYY"),
        item.value.toLocaleString('pt-br',{style: 'currency', currency: 'BRL'}),
    ]);

    const totalSalary = data.reduce(
        (total, item) => total + item.value,
        0
    );

    doc.autoTable({
        head: [tableColumn],
        body: tableRows,
        foot: title === 'dizimo' ? [["TOTAL", "", "", "", totalSalary.toLocaleString('pt-br',{style: 'currency', currency: 'BRL'})]] : [["Total", "", totalSalary.toLocaleString('pt-br',{style: 'currency', currency: 'BRL'})]],
        startY: 30,
        headStyles: {
            fillColor: [180, 125, 117],
            textColor: [255, 255, 255],
            fontSize: 10,
        },
        bodyStyles: {
            fontSize: 7
        },
        footStyles: {
            fillColor: [255, 255, 255],
            textColor: [0, 0, 0],
            fontStyle: 'bold',
        },
    });

    doc.save(`${title.toLowerCase()}.pdf`);
};