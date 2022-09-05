//引入世界国家名字
import {worldCountryNameMap} from './worldCountryName.js';

export const chartOptions = {
    geo: {
        map: 'world',
        roam: true,
        zoom: 1.3,//视角缩放比例
        scaleLimit: {
            min: 0.1,
            max: 2
        },
		emphasis:{
			focus:'self'
		},
        itemStyle: {
            normal: {
                borderColor: 'rgba(0, 0, 0, 0.2)' //省份边框颜色
            },
    //         emphasis: {
    //             areaColor: 'red', //鼠标选择区域颜色
    //             shadowOffsetX: 0,
    //             shadowOffsetY: 0,
    //             shadowBlur: 20,
    //             borderWidth: 20,
				// borderColor: 'blue',
    //             shadowColor: 'blue', //选择后的边框阴影颜色,
    //             focus: 'self'
    //         },
        },
        regions: []
    },
    //配置属性
	series:[
		{
			name: 'city',
			type: 'scatter',
			coordinateSystem: 'geo',
			
			symbol:'pin',
			symbolSize:10,
			data:[]
		}
	]
};