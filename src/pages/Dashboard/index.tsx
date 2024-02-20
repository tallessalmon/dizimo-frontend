import React, { useEffect, useState } from "react";
import { Column } from '@ant-design/plots';
import api from "../../services/api";

const Dashboards: React.FC = () => {
    const [data, setData] = useState();

    const getTithes = () => {
        api.get('tithe').then((tithe:any) => {
            const formattedData = tithe.data.reduce((acc, item) => {
                const existingItem = acc.find(accItem => accItem.community === item.community);

                if (existingItem) {
                    existingItem.value += item.value;
                } else {
                    acc.push({ ...item });
                }

                return acc;
            }, []);

            setData(formattedData);
        });
    }

    useEffect(() => {
        getTithes();
    }, []);
    
    const config = {
        data,
        xField: 'community',
        yField: 'value',
        columnWidthRatio: 0.8,
        label: {
            position: 'middle',
            style: {
                fill: '#FFFFFF',
                opacity: 0.6,
            },
        },
        xAxis: {
            label: {
                autoHide: true,
                autoRotate: false,
            },
        },
        meta: {
            community: {
              alias: '类别',
            },
            value: {
              alias: '销售额',
            },
          },
    };
     
    return (
        <>
            <h2>Dashboards</h2>
            <Column {...config} />
        </>
    );
}

export default Dashboards;
