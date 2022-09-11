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
                borderColor: 'rgba(0, 0, 0, 0.2)' //边框颜色
            },
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
	],
	
	
};