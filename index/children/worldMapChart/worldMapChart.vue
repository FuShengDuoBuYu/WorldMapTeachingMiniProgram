<template>
	<view class="container">
		<view class="wrap">
			<mpvue-echarts id="main" ref="mapChart" :echarts="echarts" @onInit="renderMap" @click="clearLocation" />
		</view>
	</view>
</template>

<script>
	import * as echarts from 'echarts/echarts.min.js'; /*echarts.min.js为在线定制*/
	import * as worldJson from '../../../echarts/map/json/world.json'; /*echart.min.js为在线定制*/
	import mpvueEcharts from 'mpvue-echarts';
	import {getCountryNameByEnglish} from './data/worldCountryName.js'
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
			default:"中国(China)",
		},
		//监听chooseLocation的变化
		watch: {
			chooseLocation(newVal, oldVal) {
				//修改options中的geo的region内容
				let regions = [{
					name: newVal.match(/\(([^)]*)\)/)[1],
					itemStyle: {
						areaColor: 'red',
						color: 'red'
					}
				}];
				// console.log(newVal.substr(newVal.indexOf('(')+1,newVal.length-1))
				
				this.options.geo.regions = regions;
				console.log(this.options)
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
		onLoad() {
			console.log("收到");
			
		},
		onReady() {
			// this.options.geo.regions = regions;
			// this.chart.setOption(this.options);
			// this.$refs.mapChart.setChart(this.chart);
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
				//表格绑定点击事件
				this.chart.on('click',function(e){
					console.log(getCountryNameByEnglish(e.name));
					uni.$emit("chooseLocation", {
						country:getCountryNameByEnglish(e.name)
					});
				})
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