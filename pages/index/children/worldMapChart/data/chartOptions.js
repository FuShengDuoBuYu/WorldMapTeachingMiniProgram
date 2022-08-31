//引入世界国家名字
import {worldCountryNameMap} from './worldCountryName.js';

export const chartOptions = {
    tooltip: {
        trigger: 'item',
        formatter: '{b}'
    },
    geo: {
        map: 'world',
        roam: true,
        zoom: 1.3,//视角缩放比例
        label: {
            normal: {
                show: false,
                fontSize: 8,
                color: 'rgba(0, 0, 0, 0.5)' //文字颜色
            }
        },
        scaleLimit: {
            min: 0.1,
            max: 2
        },

        nameMap:worldCountryNameMap,
        itemStyle: {
            normal: {
                borderColor: 'rgba(0, 0, 0, 0.2)' //省份边框颜色
            },
            emphasis: {
                areaColor: 'red', //鼠标选择区域颜色
                shadowOffsetX: 0,
                shadowOffsetY: 0,
                shadowBlur: 20,
                borderWidth: 0,
                shadowColor: 'rgba(0, 0, 0, 0.2)', //选择后的边框阴影颜色,
                focus: 'self'
            },
            //虚线偏移量
            borderDashOffset: 1,
            
        },
        z: 0,
        regions: [{
            name: '中国',
            itemStyle: {
                areaColor: 'red',
                color: 'red'
            }
        }]
    },
    //配置属性
    series: [
        {
            type: 'map',
            geoIndex: 0,
            animation: false,
        }
    ]
};