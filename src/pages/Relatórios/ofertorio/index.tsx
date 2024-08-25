import { Button, DatePicker, Modal, Form, Table, Typography } from "antd";
import React, { useState, useRef } from "react";
import locale from "antd/es/date-picker/locale/pt_BR";
import api from "../../../services/api";
import moment from "moment-timezone";
import { getProfileLocalStorage } from "../../../context/AuthProvider/util";
import { RangePickerProps } from "antd/es/date-picker";
import dayjs from "dayjs";
import jsPDF from "jspdf";
import "jspdf-autotable";
import { LuRefreshCcw } from "react-icons/lu";
import type { TableColumnsType } from 'antd';
import { FaFileExport } from "react-icons/fa";
import _ from "lodash";

const relOfertorio: React.FC = () => {
    const [form] = Form.useForm();
    const [modal, setModal] = useState(true)
    const [data, setData] = useState<TableColumnsType>()
    const [filterCommunity, setFilterCommunity] = useState<IFilter[]>([]);
    const { Text } = Typography;

    const userInfo: any = getProfileLocalStorage();

    const tableRef = useRef();

    const onClose = () => {
        setModal(false)
    }

    const onConfirm = (data) => {
        data.date[0]
            ? getData(moment(data.date[0].$d).format('YYYY-MM-DD'), moment(data.date[1].$d).format('YYYY-MM-DD'))
            : getData(moment(data.date.$d).format('YYYY-MM-DD'))

        onClose();
    }

    const getData = async (initialDate?, finalDate?) => {
        const fullResult = await api.get(`offertory${initialDate ? '?' + 'initialDate=' + initialDate : ''}${finalDate ? '&' + 'finalDate=' + finalDate : ''}`)
        const result = fullResult.data.map((ofertory) => {
            if (ofertory.community === userInfo.community || userInfo.profile === 'administrador') {
                return ofertory
            }
        })
        setData(result)
        const listCommunityGrouped = _.groupBy(result, "community");
        const listCommunity: IFilter[] = Object.keys(listCommunityGrouped).map(name => ({
            text: name,
            value: name,
        }));
        setFilterCommunity(listCommunity)
    }

    const handleExportPdf = () => {
        const doc = new jsPDF();
        doc.setFontSize(18)
        doc.text("OFERTÓRIO", 14, 22);

        doc.setFontSize(12);

        const tableColumn = columns.map((col) => col.title);
        const tableRows = data.map((item: any) => [
          item.community,
          moment(item.date).format("DD/MM/YYYY"),
          'R$ ' + item.value,
        ]);

        const totalSalary = data.reduce(
            (total, item) => total + item.value,
            0
          );
    
        doc.autoTable({
          head: [tableColumn],
          body: tableRows,
          foot: [["Total", "","R$ " + totalSalary]],
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
    
        doc.save("ofertorio.pdf");
      };

    const disabledDate: RangePickerProps['disabledDate'] = (current) => {
        return current && current > dayjs().endOf('day')
    };

    interface DataType {
        key: React.Key;
        name: string;
        age: number;
        address: string;
    }

    interface IFilter {
        text?: string;
        value?: string;
    }

    const columns: TableColumnsType<DataType> = [
        {
            title: 'Comunidade',
            dataIndex: 'community',
            width: 300,
            filters: filterCommunity,
            filterSearch: userInfo.profile === 'administrador' ? true : false,
            onFilter: (value: string, record: any) =>
                record.community?.startsWith(value),
        },
        {
            title: 'Data',
            dataIndex: 'date',
            width: 50,
            render: (value: string, record: any) => {
                return moment(record.date).format("DD/MM/YYYY");
            },
        },
        {
            title: 'Valor',
            dataIndex: 'value',
            render: (value: string, record: any) => {
                return 'R$ ' + record.value;
            },
        },
    ];

    const summary = <>
        <Table.Summary.Row>
            <Table.Summary.Cell index={0}><Text style={{ fontSize: 20, fontWeight: "bold" }}>TOTAL</Text></Table.Summary.Cell>
            <Table.Summary.Cell index={1} colSpan={2} >
                <Text style={{ fontSize: 20, fontWeight: "bold" }}>R$ {data?.reduce(function (acc, atual: any) {
                    return acc + atual.value
                }, 0)}</Text>
            </Table.Summary.Cell>
        </Table.Summary.Row>
    </>

    return (
        <>
            <h2>RELATÓRIO DE OFERTÓRIO</h2>
            <Modal
                title="FILTROS"
                centered
                open={modal}
                onClose={onClose}
                onCancel={onClose}
                footer={null}
            >
                <Form
                    style={{ maxWidth: 600 }}
                    form={form}
                    onFinish={onConfirm}
                >
                    {
                        userInfo.profile === 'administrador' ?
                            <><Form.Item
                                label="Datas"
                                name="date"
                                rules={[
                                    { required: true, message: "Favor inserir as datas de referencia" },
                                ]}
                            >
                                <DatePicker.RangePicker disabledDate={disabledDate} locale={locale} format="DD/MM/YYYY" />
                            </Form.Item> </> :
                            <Form.Item
                                label="Data de Referência"
                                name="date"
                                rules={[
                                    { required: true, message: "Favor inserir a data de referencia" },
                                ]}
                            >
                                <DatePicker disabledDate={disabledDate} locale={locale} format="DD/MM/YYYY" placeholder="" />
                            </Form.Item>

                    }

                    <Form.Item>
                        <Button htmlType="submit" children='Buscar' />
                    </Form.Item>
                </Form>
            </Modal>

            <div
                style={{ display: "flex", justifyContent: "end", paddingBottom: 30 }}
            >
                <Button
                    title="Refresh"
                    type="primary"
                    onClick={() => setModal(true)}
                    style={{backgroundColor: "#036654"}}
                >
                    <LuRefreshCcw />
                </Button>
                <Button
                    title="Exportar"
                    type="primary"
                    onClick={handleExportPdf}
                >
                    <FaFileExport /> Exportar
                </Button>
            </div>
            <div ref={tableRef}>
                <Table rowKey={"id"} columns={columns} dataSource={data} scroll={{ x: "100%" }} summary={() => summary} />
            </div>
        </>

    )
}
export default relOfertorio