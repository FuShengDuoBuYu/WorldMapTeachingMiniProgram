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
	import {getCountryNameByEnglish,ifNameIsCountry,findCityByName} from './data/worldCountryName.js'
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
				this.refreshMapOptions(newVal)
				console.log("换位置了")
				
			}
		},
		data() {
			return {
				chart: {},
				echarts,
				options:chartOptions,
				//定时器
				timer:{}
			};
		},
		onLoad() {
			
		},
		onReady() {

		},
		methods: {
			//重设地图options
			refreshMapOptions(locationName){
				let color = 'yellow'
				clearInterval(this.timer)
				if(ifNameIsCountry(locationName.match(/\(([^)]*)\)/)[1])==true){
					//定时执行
					this.timer = setInterval(()=>{
						console.log(locationName)
						//修改options中的geo的region内容
						let regions = [{
							name: locationName.match(/\(([^)]*)\)/)[1],
							itemStyle: {
								areaColor: 'red',
								borderColor:color,
								borderWidth:1
							}
						}];
						color = (color =='yellow'?'white':'yellow');
						this.options.series[0].data = [];
						this.options.geo.regions = regions;
						//配置图表
						this.chart.setOption(this.options);
						this.$refs.mapChart.setChart(this.chart);
					},1000)
					
				}
				else {
					this.timer = setInterval(()=>{
						let cityInfo = findCityByName(locationName.match(/\(([^)]*)\)/)[1]);
						//设置region
						let regions = [{
							name: cityInfo[1],
							itemStyle: {
								areaColor: 'red',
								borderColor:color,
								borderWidth:1
							}
						}];
						//设置city亮灯
						let seriesData = [
							{
								name:cityInfo[0][0],
								value:[cityInfo[0][1],cityInfo[0][2],cityInfo[0][3]]
							}
						]
						color = (color =='yellow'?'white':'yellow')
						this.options.geo.regions = regions;
						this.options.series[0].data = seriesData;
						//配置图表
						this.chart.setOption(this.options);
						this.$refs.mapChart.setChart(this.chart);
					},1000)
				}
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