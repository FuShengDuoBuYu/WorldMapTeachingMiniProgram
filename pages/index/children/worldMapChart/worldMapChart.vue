<template>
	<view class="container">
		<view class="wrap">
			<mpvue-echarts id="main" ref="mapChart" :echarts="echarts" @onInit="renderMap" @click="clearLocation" />
		</view>
	</view>
</template>

<script>
	import * as echarts from 'echarts/echarts.min.js'; /*echarts.min.js为在线定制*/
	import * as worldJson from '../../../../echarts/map/json/world.json'; /*echart.min.js为在线定制*/
	import mpvueEcharts from 'mpvue-echarts';
	
	//引入图表的option
	import {chartOptions} from './data/chartOptions.js';
	export default {
		name:'worldMapChart',
		components:{
			mpvueEcharts,
		},
		//接收父组件的值
		props:{
			chooseLocation:String,
			default:"中国",
		},
		//监听chooseLocation的变化
		watch: {
			chooseLocation(newVal, oldVal) {
				//修改options中的geo的region内容
				let regions = [{
					name: newVal,
					itemStyle: {
						areaColor: 'red',
						color: 'red'
					}
				}];
				this.options.geo.regions = regions;
				this.chart.setOption(this.options);
				this.$refs.mapChart.setChart(this.chart);
			}
		},
		data() {
			return {
				chart: {},
				echarts,
				options:chartOptions,
			};
		},
		onReady() {
			let regions = [];
			this.options.geo.regions = regions;
			this.chart.setOption(this.options);
			this.$refs.mapChart.setChart(this.chart);
		},
		methods: {
			//用户点击时要清除下region数据
			clearLocation(){

			},

			//绘制地图
			renderMap(e) {
				let {
					canvas,
					width,
					height
				} = e;
				width = width - 20;
				echarts.setCanvasCreator(() => canvas);
				this.chart = echarts.init(canvas, null, {
					width: width,
					height: height
				})
				echarts.registerMap('world', worldJson);
				canvas.setChart(this.chart)
				//初始化echarts实例
				this.chart.setOption(this.options);
				this.$refs.mapChart.setChart(this.chart);
			}
		}
	}
</script>

<style scoped lang="scss">
	.wrap {
		width: 100%;
		height: 600rpx;
		border: 1rpx solid #ddd;
	}
</style>