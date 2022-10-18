<template>
	<view>
		<image class="bg" :src="bgImage"></image>
		<view style="display: flex;justify-content: space-between;margin: 3%;">
			<text style="font-size: xx-large;color: beige;font-weight: bold;">世界之最</text>
			<button style="align-self: center;" size="mini" type="primary" @click="switchTo('/index/index')">切换世界地图</button>
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
			<image class="sound" v-if="placeName!='暂未选择'" @click="startToSpeechOrPause" :src="currentSound"></image>
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
				//刷新地图
				if(newVal == ""){
					this.recoverToInit();
				}
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
				soundTimer:{},
				bgImage:images.bgImage,
				innerAudioContext: uni.createInnerAudioContext(),
				//三个喇叭图标
				// currentSound:"data:image/png;base64,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",
				// pauseSound: "data:image/png;base64,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",
				// volumnSmallSound:"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAAAXNSR0IArs4c6QAABKFJREFUaEPtmE9sFHUUx79vdmemKBovFYOdadNqd3YbuVgUgwdIVGJEIlRMbDQkJRXDCWOiJh7AiyZ60AuaGqNZxJVARA3qgYhwQI3G+o/A7tbSdmaLejIaiXZ/s51nZnZXdrez7c6yLUzSOe1O3u/9vp95v/f7vd8jhPyhkOvHMsCVjuByBJYjcJlfYEmX0GQX2gqO0s2gbocQJ+JjsSmRuRyGJQHIaHI/SRgEY5BBq2oEH3SIDiXM/KfNgCwqwFinss1hDAIYWECcAEn3G+bMF0EhWg4w3rPyxoJtDxJ4kIG1VYIYKUmilGRLP0dlKvzLhV0E7C3Z5CSJt/RO2T8GgWgZQEaPrieigTnLhGExIQUHqfi0OFMrLq3LwwR603tPeMcwxVDLANK6so+ABIC7AHQEcQzQabCTkmU71TOBv+Ybm9GVwwC2EzAes8StQebxjUC2SzHYwUcAYkGcebalZdIbICmzmrybifa7wyVIPb3WzESj884BONuOlZEVyt8VDo4zOAvQH/M5jYC+Uygy2mX+81ujk5ft0h3RDSRJJz1+x9kYny6catTHHICMrr4B8JPFj4kX4pbY16izZu1aBnBGU3tk4vFiQtEzhpl/pVlRQcb5AaQ19WmCs5mAI7Gc/Xo9f1URyHYqW5lx1Pv6sxSLX8iPBRHSrK0fQEaTT4JoQymv3jZyYqef/yqA0q6zF8ynjJy9sVlBQcf5AZzTlIckwoeXfPEJw7LvqfV91QK4QivBissajxmmeK8S4qoGKAvN6AqXf886vK5v2v6m/D8UAGc75DsiEnmiCTgQs8SOUAG4YrO6OsLgJwD8alji5tABZHRlOwC35ADg3G1YhS9LEbmUElfTLuS3k5VzofKADUUOeDtSV1sXOc6kd0aBd8Ut26tgwwNQUS9JoAd7rfwnoQLIaPJ+EO12RV+Mihv6SyV6KCLg1WhwvgZRO0AjhpX3is3QRCCtKUeJsNXbf4geSJj5z0ID8P/O6CYs4/lYTrwYmlKiUjyAg4YlHg9NMVcj/ohhiUf8zoaqJM50yjvB9BaAC4YlAl7i/dw39s6vnM7q8nEG3Qugrvg5SZzV5LVM9K13WBAG4qbwLjeL/dS7Up7T1T0JK//afPNXReCnVbhWVRX3FrZ6KaPQsjuxd2QXe0Fet4yA8wTa02y3odHItRTAnTSrKR8wYVujAkp2UwTKgXCY2/JJI4vK1sy8rjKaugXEHxf3eb49YdrfNzp33dbimK5uZvCrDNzSqLMKuwkCkrMRKZmYnDEXGp/VlZcYeA5A/mK7uK5/FPZCY3wPstpBbpNLuia6hhxaw0Q3LeRUAh5moK/C7k+Ak7OEZJ9p/+A3fnz1Cq0QnXVb67cx8FXcEusXmqfuQRZkYD3btKZuIuKnAGyqsXmXICVj1syJ8vtSiTwC4L5izvGOmGUfCKKjZd3pOdHrkO+MkDQM4qp+DoE/ZyKLGBIDjwJQPfGEQzFTuP8DPYsGUFbxi64kCsxDRDQM4Po66p41LPFyIOUl40UHKIs6392mi4IzRMA6r13P+J2BUQDH4jnxfjPii8su5M8ywJUOYOgj8B8CZ5JPxZEC9gAAAABJRU5ErkJggg==",
				// volumnBigSound:"data:image/png;base64,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"
				currentSound:"http://106.15.35.61:81/projects/world_map/images/sounds/currentSound.png",
				// currentSound:"data:image/png;base64,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",
				// pauseSound: "data:image/png;base64,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",
				pauseSound : "http://106.15.35.61:81/projects/world_map/images/sounds/currentSound.png",
				// volumnSmallSound:"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAAAXNSR0IArs4c6QAABKFJREFUaEPtmE9sFHUUx79vdmemKBovFYOdadNqd3YbuVgUgwdIVGJEIlRMbDQkJRXDCWOiJh7AiyZ60AuaGqNZxJVARA3qgYhwQI3G+o/A7tbSdmaLejIaiXZ/s51nZnZXdrez7c6yLUzSOe1O3u/9vp95v/f7vd8jhPyhkOvHMsCVjuByBJYjcJlfYEmX0GQX2gqO0s2gbocQJ+JjsSmRuRyGJQHIaHI/SRgEY5BBq2oEH3SIDiXM/KfNgCwqwFinss1hDAIYWECcAEn3G+bMF0EhWg4w3rPyxoJtDxJ4kIG1VYIYKUmilGRLP0dlKvzLhV0E7C3Z5CSJt/RO2T8GgWgZQEaPrieigTnLhGExIQUHqfi0OFMrLq3LwwR603tPeMcwxVDLANK6so+ABIC7AHQEcQzQabCTkmU71TOBv+Ybm9GVwwC2EzAes8StQebxjUC2SzHYwUcAYkGcebalZdIbICmzmrybifa7wyVIPb3WzESj884BONuOlZEVyt8VDo4zOAvQH/M5jYC+Uygy2mX+81ujk5ft0h3RDSRJJz1+x9kYny6catTHHICMrr4B8JPFj4kX4pbY16izZu1aBnBGU3tk4vFiQtEzhpl/pVlRQcb5AaQ19WmCs5mAI7Gc/Xo9f1URyHYqW5lx1Pv6sxSLX8iPBRHSrK0fQEaTT4JoQymv3jZyYqef/yqA0q6zF8ynjJy9sVlBQcf5AZzTlIckwoeXfPEJw7LvqfV91QK4QivBissajxmmeK8S4qoGKAvN6AqXf886vK5v2v6m/D8UAGc75DsiEnmiCTgQs8SOUAG4YrO6OsLgJwD8alji5tABZHRlOwC35ADg3G1YhS9LEbmUElfTLuS3k5VzofKADUUOeDtSV1sXOc6kd0aBd8Ut26tgwwNQUS9JoAd7rfwnoQLIaPJ+EO12RV+Mihv6SyV6KCLg1WhwvgZRO0AjhpX3is3QRCCtKUeJsNXbf4geSJj5z0ID8P/O6CYs4/lYTrwYmlKiUjyAg4YlHg9NMVcj/ohhiUf8zoaqJM50yjvB9BaAC4YlAl7i/dw39s6vnM7q8nEG3Qugrvg5SZzV5LVM9K13WBAG4qbwLjeL/dS7Up7T1T0JK//afPNXReCnVbhWVRX3FrZ6KaPQsjuxd2QXe0Fet4yA8wTa02y3odHItRTAnTSrKR8wYVujAkp2UwTKgXCY2/JJI4vK1sy8rjKaugXEHxf3eb49YdrfNzp33dbimK5uZvCrDNzSqLMKuwkCkrMRKZmYnDEXGp/VlZcYeA5A/mK7uK5/FPZCY3wPstpBbpNLuia6hhxaw0Q3LeRUAh5moK/C7k+Ak7OEZJ9p/+A3fnz1Cq0QnXVb67cx8FXcEusXmqfuQRZkYD3btKZuIuKnAGyqsXmXICVj1syJ8vtSiTwC4L5izvGOmGUfCKKjZd3pOdHrkO+MkDQM4qp+DoE/ZyKLGBIDjwJQPfGEQzFTuP8DPYsGUFbxi64kCsxDRDQM4Po66p41LPFyIOUl40UHKIs6392mi4IzRMA6r13P+J2BUQDH4jnxfjPii8su5M8ywJUOYOgj8B8CZ5JPxZEC9gAAAABJRU5ErkJggg==",
				// volumnBigSound:"data:image/png;base64,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",
				volumnSmallSound:"http://106.15.35.61:81/projects/world_map/images/sounds/volumnSmallSound.png",
				volumnBigSound:"http://106.15.35.61:81/projects/world_map/images/sounds/volumnBigSound.png"
			}
		},
		onLoad() {
			//开始播放
			this.innerAudioContext.onPlay(() => {
				this.currentSound = this.volumnBigSound;
				this.soundTimer = setInterval(() => {
					this.currentSound = this.currentSound==this.volumnSmallSound?this.volumnBigSound:this.volumnSmallSound;
				}, 500);
			})
			//结束播放
			this.innerAudioContext.onEnded(() => {
				clearInterval(this.soundTimer);
				this.currentSound = this.pauseSound;
			})
		},
		onUnload(){
			this.innerAudioContext.pause()
			// this.$refs.echarts.recoverMapChart("")
			this.options.title.text = "暂未选择";
			clearInterval(this.timer);
			this.options.series[0].data = [];
			this.options.geo.regions = [];
			this.chart.setOption(this.options);
			this.$refs.echarts.setChart(this.chart);
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
								areaColor: 'yellow',
								borderColor:color,
								borderWidth:1
							}
						},
						{
							name: "亚马孙河",
							itemStyle: {
								areaColor: 'yellow',
								borderColor:'yellow',
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
								areaColor: 'yellow',
								borderColor:color,
								borderWidth:1
							}
						},
						{
							name: "阿塔卡马沙漠",
							itemStyle: {
								areaColor: 'yellow',
								borderColor:'yellow',
								borderWidth:1
							}
						}
					]
				}
				else{
					return [{
							name: placeName,
							itemStyle: {
								areaColor: 'yellow',
								borderColor:color,
								borderWidth:1
							}
						}];
				}
			},
			//开始播放
			startToSpeechOrPause(){
				this.innerAudioContext.pause()
				if(this.innerAudioContext.paused==false){
					this.innerAudioContext.stop()
					uni.showToast({
						title:'取消播放',
						icon:'none',
						duration:1500
					})
					clearInterval(this.soundTimer);
					this.currentSound = this.pauseSound;
					setTimeout(()=>{uni.hideLoading()},1500)
					return
				}
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
				clearInterval(this.soundTimer);
				this.currentSound = this.pauseSound;
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
				let color = 'red';
				clearInterval(this.timer);
				//不是一个点
				if(ifPlacePoint(this.placeName).length==0){
					this.timer = setInterval(() => {
						//修改options中的geo的region内容
						let regions = this.getRegions(this.placeName,color)
						color = color === 'red' ? 'yellow' : 'red';
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
				clearInterval(this.soundTimer);
				this.currentSound = this.pauseSound;
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
			},
			
			//清空显示
			recoverToInit(){
				//停语音
				this.innerAudioContext.stop();
				this.options.title.text = "暂未选择";
				clearInterval(this.timer);
				//设置下方信息不显示
				this.placeName = "暂未选择"
				this.recordImage='',
				this.recordDescription='',
				this.recordTitle=''
				//绘制地图
				this.options.series[0].data = [];
				this.options.geo.regions = [];
				this.chart.setOption(this.options);
				this.$refs.echarts.setChart(this.chart);
				
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
	
	.sound{
		/* 靠左边 */
		float: left;
		height: 50rpx;
		width: 50rpx;
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