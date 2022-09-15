<template>
	<view>
		<image class="bg" :src="bgImage"></image>
		<view style="display: flex;justify-content: space-between;margin: 3%;">
			<text style="font-size: xx-large;color: beige;font-weight: bold;">世界之最</text>
			<button style="align-self: center;" size="mini" type="primary" @click="switchTo('/index/index')">切换地图</button>
		</view>
		<!-- 顶部搜索框和按钮 -->
		<view style="display: flex;width:100%;justify-content:center;margin:auto">
			<uni-icons style="width: 10%;margin-left: 3%;" type="search" size="30"></uni-icons>
			<uni-combox @ifShowSelector="ifShowCanvas" style="width: 60%;" :candidates="candidates" placeholder="请输入要查找的内容" v-model="searchItem"></uni-combox>
		</view>
		<view style="width: 100%;height: 700rpx;">
			<uni-icons v-if="ifShowCanvasChart" style="margin-left: 90vw;" type="images" size=30 @click="showMapImage"></uni-icons>
			<mpvue-echarts v-if="ifShowCanvasChart" ref="echarts" id="main" :echarts="echarts" @onInit="renderMap" @click="clearLocation" />
		</view>
		<view style="display: flex;justify-content:space-around;">
			<text>您当前选择的是</text>
			<text style="font-size: x-large;color: red;">{{placeName}}</text>
		</view>
		<view class="image_box">
			<image class="image" mode="widthFix" :src="recordImage" @click="previewImage"></image>
		</view>
		<view style="display:flex;justify-content:space-around">
			<text class="title">{{recordTitle}}</text>
			<uni-icons v-if="placeName!='暂未选择'" type="sound" size="30" @click="startToSpeech"></uni-icons>
		</view>
		<view style="display:flex;justify-content:center">
			<text class="text">{{recordDescription}}</text>
		</view>
	</view>
</template>

<script>
	var plugin = requirePlugin("WechatSI")
	let manager = plugin.getRecordRecognitionManager()
	import * as echarts from 'echarts/echarts.min.js'; /*echarts.min.js为在线定制*/
	import mpvueEcharts from 'mpvue-echarts';
	import * as worldRecordsJson from "./data/worldRecords.json";
	import { getWorldRecords, getWorldRecord,images,ifPlacePoint } from "./data/data.js";
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
				//停止语音
				this.innerAudioContext.pause();
				this.recordImage = getWorldRecord(newVal).image;
				this.recordDescription = getWorldRecord(newVal).description;
				this.recordTitle = getWorldRecord(newVal).title;
				this.refreshMap();
				uni.showLoading({
					title:'请稍后',
				})
				setTimeout(function () {
					uni.hideLoading();
				}, 1500);
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
				recordTitle:'',
				options: chartOptions,
				timer: {},
				bgImage:images.bgImage,
				innerAudioContext: uni.createInnerAudioContext(),
			}
		},
		onLoad() {
			
		},
		onUnload(){
			console.log("stop111")
			this.innerAudioContext.pause()
		},
		//监听
		methods: {
			//获取region嵌套关系
			getRegions(placeName,color){
				if(placeName=="亚马孙平原"){
					return [
						{
							name: placeName,
							itemStyle: {
								areaColor: 'red',
								borderColor:color,
								borderWidth:1
							}
						},
						{
							name: "亚马孙河",
							itemStyle: {
								areaColor: 'red',
								borderColor:'red',
								borderWidth:1
							}
						}
					]
				}
				else if(placeName=="安第斯山脉"){
					return [
						{
							name: placeName,
							itemStyle: {
								areaColor: 'red',
								borderColor:color,
								borderWidth:1
							}
						},
						{
							name: "阿塔卡马沙漠",
							itemStyle: {
								areaColor: 'red',
								borderColor:'red',
								borderWidth:1
							}
						}
					]
				}
				else{
					return [{
							name: placeName,
							itemStyle: {
								areaColor: 'red',
								borderColor:color,
								borderWidth:1
							}
						}];
				}
			},
			//开始播放
			startToSpeech(){
				this.innerAudioContext.pause()
				uni.showLoading({
					title: '加载中'
				});
				var that = this
				plugin.textToSpeech({
					lang: "zh_CN",
					tts: true,
					content: that.recordDescription,
					success: function(res) {
						that.innerAudioContext.autoplay = true;
						that.innerAudioContext.src = res.filename;
						uni.hideLoading(); 
					},
					fail: function(res) {
						console.log(res)
						uni.hideLoading()
						uni.showToast({
							title:"播放失败",
							icon:"error",
							duration:1500
						})
					}
				})
			},
			//地图图片
			showMapImage(){
				clearInterval(this.timer)
				uni.showLoading({
					title: '加载中'
				});
				setTimeout(()=>{
					this.$refs.echarts.canvasToTempFilePath();
				},1000)
			},
			//重绘地图
			refreshMap() {
				this.options.title.text = this.placeName;
				let color = 'yellow';
				clearInterval(this.timer);
				//不是一个点
				if(ifPlacePoint(this.placeName).length==0){
					this.timer = setInterval(() => {
						//修改options中的geo的region内容
						let regions = this.getRegions(this.placeName,color)
						color = color === 'yellow' ? 'red' : 'yellow';
						this.options.series[0].data = [];
						this.options.geo.regions = regions;
						this.chart.setOption(this.options);
						this.$refs.echarts.setChart(this.chart);
					}, 1000);
				}
				else{
					let pointInfo = ifPlacePoint(this.placeName);
					
					//修改options中的geo的region内容
					let regions = [];
					let seriesData = [{
						name:pointInfo[0],
						value:[pointInfo[0],pointInfo[1],pointInfo[2]]
					}]
					this.options.series[0].data = (this.options.series[0].data.length == 0?seriesData:[])
					this.options.geo.regions = regions;
					this.chart.setOption(this.options);
					this.$refs.echarts.setChart(this.chart);
					
				}
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
				uni.reLaunch({
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
		position: fixed;
		width: 100%;
		height: 100%;
		top: 0;
		left: 0;
		z-index: -1;
		opacity: 0.5;
	}

	.image_box {
		width: 90%;
		height: auto;
		margin: 5%;
		border-radius: 10rpx;
	}
	
	.image{
		width: 100%;
		height: 100%;
		display: block;
		border-radius: 10rpx;
	}
	.text{
		width: 90%;
		margin : 5%;
		/* 加粗 */
		font-weight: bold;
		/* 每段缩进 */
		text-indent: 2em;
	}
	.title{
		color:red;
		font-size:larger;
		font-weight:bold;
		/* 居中 */
		text-align: center;
	}
</style>