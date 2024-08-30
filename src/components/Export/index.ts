import jsPDF from "jspdf";
import moment from "moment-timezone";
import "jspdf-autotable";

export const handleExportPdf = (data, title, columns) => {
    const doc = new jsPDF();
    doc.setFontSize(18)
    doc.text(`${title.toUpperCase()}`, 14, 22);

    doc.setFontSize(12);

    const tableColumn = columns.map((col) => col.title);
    const tableRows = title === 'dizimo' ? data.map((item: any) => [
        item.community,
        moment(item.created_at).format("DD/MM/YYYY"),
        item.mode_pay.toUpperCase(),
        item.tither.fullName,
        'R$ ' + item.value
    ]) : data.map((item: any) => [
        item.community,
        moment(item.date).format("DD/MM/YYYY"),
        'R$ ' + item.value,
    ]);;

    const totalSalary = data.reduce(
        (total, item) => total + item.value,
        0
    );

    doc.autoTable({
        head: [tableColumn],
        body: tableRows,
        foot: title === 'dizimo' ? [["Total", "", "", "", "R$ " + totalSalary]] : [["Total", "", "R$ " + totalSalary]],
        startY: 30,
        headStyles: {
            fillColor: [180, 125, 117],
            textColor: [255, 255, 255],
            fontSize: 12,
        },
        footStyles: {
            fillColor: [255, 255, 255],
            textColor: [0, 0, 0],
            fontStyle: 'bold',
        },
    });

    doc.save(`${title.toLowerCase()}.pdf`);
};