<template>
	<view>
		<image class="bg"></image>
		<view style="display: flex;justify-content: space-around;margin: 3%;">
			<text style="font-size: xx-large;color: beige;font-weight: bold;">世界之最</text>
			<button size="mini" type="default" @click="switchTo('/index/index')">切换地图</button>
		</view>
		<!-- 顶部搜索框和按钮 -->
		<view style="display: flex;width:100%;justify-content:center;margin:auto">
			<uni-icons style="width: 10%;margin-left: 3%;" type="search" size="30"></uni-icons>
			<uni-combox @ifShowSelector="ifShowCanvas" style="width: 60%;" :candidates="candidates" placeholder="请输入要查找的内容" v-model="searchItem"></uni-combox>
		</view>
		<view style="width: 100%;height: 700rpx;">
			<mpvue-echarts ref="echarts" id="main" :echarts="echarts" @onInit="renderMap" @click="clearLocation" />
		</view>
		<view style="display: flex;justify-content:space-around;">
			<text>您当前选择的是</text>
			<text style="font-size: x-large;color: red;">{{placeName}}</text>
		</view>
		<scroll-view>
			<image class="image" :src="recordImage" @click="previewImage"></image>
			<text class="text">{{recordDescription}}</text>
		</scroll-view>
	</view>
</template>

<script>
	import * as echarts from 'echarts/echarts.min.js'; /*echarts.min.js为在线定制*/
	import mpvueEcharts from 'mpvue-echarts';
	import * as worldJson from 'echarts/map/json/world.json'; /*echart.min.js为在线定制*/
	import * as worldRecordsJson from "./data/worldRecords.json";
	import { getWorldRecords, getWorldRecord } from "./data/data.js";
	import {chartOptions} from "./data/chartOption.js"
	export default {
		components:{
			mpvueEcharts
		},
		watch: {
			searchItem: function (newVal, oldVal) {
				//确实有这个地点
				if(this.candidates.indexOf(newVal) != -1){
					this.placeName = newVal;
				}
			},
			placeName: function (newVal, oldVal) {
				this.recordImage = getWorldRecord(newVal).image;
				this.recordDescription = getWorldRecord(newVal).description;
				this.refreshMap();
			}
		},
		data() {
			return {
				//用户要搜索的项
				searchItem:'',
				//候选城市
				candidates: getWorldRecords(),
				//用户的选择的名字
				placeName:"暂未选择",
				//是否展示canvas
				ifShowCanvasChart:true,
				recordImage:'',
				recordDescription:'',
				options: chartOptions,
				timer: {}
			}
		},
		onLoad() {
			
		},
		//监听
		methods: {
			//重绘地图
			refreshMap() {
				let color = 'yellow';
				clearInterval(this.timer);
				this.timer = setInterval(() => {
					//修改options中的geo的region内容
					let regions = [{
						name: this.placeName,
						itemStyle: {
							areaColor: 'red',
							borderColor:color,
							borderWidth:1
						}
					}];
					color = color === 'yellow' ? 'white' : 'yellow';
					this.options.series[0].data = [];
					this.options.geo.regions = regions;
					this.chart.setOption(this.options);
					this.$refs.echarts.setChart(this.chart);
				}, 1000);
			},
			//预览图片
			previewImage() {
				uni.previewImage({
					urls: [this.recordImage],
					current: this.recordImage
				});	
			},
			//进入页面
			switchTo(url){
				uni.redirectTo({
					url:url
				})
			}, 
			//canvas显示与否
			ifShowCanvas(ifShowSelect){
				this.ifShowCanvasChart = !ifShowSelect
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
				echarts.registerMap('world', worldRecordsJson);
				canvas.setChart(this.chart)
				//初始化echarts实例
				this.chart.setOption(this.options);
				this.$refs.echarts.setChart(this.chart);
				//表格绑定点击事件
				this.chart.on('click',function(e){
					console.log(e.name)
					this.placeName = e.name;
				})
			}
		}
	}
</script>

<style>
	.content {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
	}
	
	.bg{
		background-color: black;
		position: fixed;
		width: 100%;
		height: 100%;
		top: 0;
		left: 0;
		z-index: -1;
		opacity: 0.8;
	}

	.image{
		width: 90%;
		margin : 5%;
		/* 圆角 */
		border-radius: 10px;
	}
	.text{
		width: 90%;
		margin : 5%;
		/* 加粗 */
		font-weight: bold;
	}
</style>