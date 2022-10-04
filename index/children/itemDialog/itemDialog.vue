<template>
	<cover-view class="contnet">
		<cover-image @click="preloadImage(imageSrc)" class="image" :src="imageSrc"></cover-image>
		<cover-view style="display: flex;justify-content: space-around;align-items: baseline;margin: 2vh;">
			<cover-view class="titleCountry">{{countryName}}</cover-view>
			<cover-view>
				<cover-image style="height: 3vh;width: 3vh;" @click="startToSpeechOrPause" :src="currentSound"></cover-image>
			</cover-view>
		</cover-view>
		<cover-view class="drawer_title" v-if="title!=''">
			{{title}}
		</cover-view>
		<!-- 循环展示所有的item -->
		<cover-view class="item" v-for="(value,key) in textContent" :key="key">
			<cover-view class="text" v-if="key.indexOf('animal')==-1">
				{{value}}
			</cover-view>
			<cover-image @click="preloadImage(value)" class="image" :src="value" v-if="key.indexOf('animal')!=-1">
			</cover-image>
		</cover-view>
	</cover-view>
</template>


<script>
var plugin = requirePlugin("WechatSI")
let manager = plugin.getRecordRecognitionManager()
import { ChinaInfo } from './data/China.js'
import { AustraliaInfo } from './data/Australia.js'
import { BrazilInfo } from './data/Brazil.js'
import { UKInfo } from './data/UK.js'
import { USAInfo } from './data/USA.js'
import {GermanyInfo} from './data/Germany.js'
export default {
	name: 'itemDialog',
	data() {
		return {
			innerAudioContext: uni.createInnerAudioContext(),
			//三个喇叭图标
			currentSound:"data:image/png;base64,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",
			pauseSound: "data:image/png;base64,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",
			volumnSmallSound:"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAAAXNSR0IArs4c6QAABKFJREFUaEPtmE9sFHUUx79vdmemKBovFYOdadNqd3YbuVgUgwdIVGJEIlRMbDQkJRXDCWOiJh7AiyZ60AuaGqNZxJVARA3qgYhwQI3G+o/A7tbSdmaLejIaiXZ/s51nZnZXdrez7c6yLUzSOe1O3u/9vp95v/f7vd8jhPyhkOvHMsCVjuByBJYjcJlfYEmX0GQX2gqO0s2gbocQJ+JjsSmRuRyGJQHIaHI/SRgEY5BBq2oEH3SIDiXM/KfNgCwqwFinss1hDAIYWECcAEn3G+bMF0EhWg4w3rPyxoJtDxJ4kIG1VYIYKUmilGRLP0dlKvzLhV0E7C3Z5CSJt/RO2T8GgWgZQEaPrieigTnLhGExIQUHqfi0OFMrLq3LwwR603tPeMcwxVDLANK6so+ABIC7AHQEcQzQabCTkmU71TOBv+Ybm9GVwwC2EzAes8StQebxjUC2SzHYwUcAYkGcebalZdIbICmzmrybifa7wyVIPb3WzESj884BONuOlZEVyt8VDo4zOAvQH/M5jYC+Uygy2mX+81ujk5ft0h3RDSRJJz1+x9kYny6catTHHICMrr4B8JPFj4kX4pbY16izZu1aBnBGU3tk4vFiQtEzhpl/pVlRQcb5AaQ19WmCs5mAI7Gc/Xo9f1URyHYqW5lx1Pv6sxSLX8iPBRHSrK0fQEaTT4JoQymv3jZyYqef/yqA0q6zF8ynjJy9sVlBQcf5AZzTlIckwoeXfPEJw7LvqfV91QK4QivBissajxmmeK8S4qoGKAvN6AqXf886vK5v2v6m/D8UAGc75DsiEnmiCTgQs8SOUAG4YrO6OsLgJwD8alji5tABZHRlOwC35ADg3G1YhS9LEbmUElfTLuS3k5VzofKADUUOeDtSV1sXOc6kd0aBd8Ut26tgwwNQUS9JoAd7rfwnoQLIaPJ+EO12RV+Mihv6SyV6KCLg1WhwvgZRO0AjhpX3is3QRCCtKUeJsNXbf4geSJj5z0ID8P/O6CYs4/lYTrwYmlKiUjyAg4YlHg9NMVcj/ohhiUf8zoaqJM50yjvB9BaAC4YlAl7i/dw39s6vnM7q8nEG3Qugrvg5SZzV5LVM9K13WBAG4qbwLjeL/dS7Up7T1T0JK//afPNXReCnVbhWVRX3FrZ6KaPQsjuxd2QXe0Fet4yA8wTa02y3odHItRTAnTSrKR8wYVujAkp2UwTKgXCY2/JJI4vK1sy8rjKaugXEHxf3eb49YdrfNzp33dbimK5uZvCrDNzSqLMKuwkCkrMRKZmYnDEXGp/VlZcYeA5A/mK7uK5/FPZCY3wPstpBbpNLuia6hhxaw0Q3LeRUAh5moK/C7k+Ak7OEZJ9p/+A3fnz1Cq0QnXVb67cx8FXcEusXmqfuQRZkYD3btKZuIuKnAGyqsXmXICVj1syJ8vtSiTwC4L5izvGOmGUfCKKjZd3pOdHrkO+MkDQM4qp+DoE/ZyKLGBIDjwJQPfGEQzFTuP8DPYsGUFbxi64kCsxDRDQM4Po66p41LPFyIOUl40UHKIs6392mi4IzRMA6r13P+J2BUQDH4jnxfjPii8su5M8ywJUOYOgj8B8CZ5JPxZEC9gAAAABJRU5ErkJggg==",
			volumnBigSound:"data:image/png;base64,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",
			soundTimer:{}
		}
	},
	//父组件的参数
	props: {
		//国家名称
		countryName: {
			type: String,
			default: ''
		},
		title: {
			type: String,
			default: ''
		},
	},
	computed: {
		//图片路径
		imageSrc() {
			switch (this.countryName) {
				case '中国(China)':
					if (this.title != '') {
						return ChinaInfo[this.title].image
					} else {
						return ChinaInfo['概览'].image
					}
					break;
				case '美国(United States)':
					if (this.title != '') {
						return USAInfo[this.title].image
					} else {
						return USAInfo['概览'].image
					}
					break;
				case '英国(United Kingdom)':
					if (this.title != '') {
						return UKInfo[this.title].image
					} else {
						return UKInfo['概览'].image
					}
					break;
				case '德国(Germany)':
					if (this.title != '') {
						return GermanyInfo[this.title].image
					} else {
						return GermanyInfo['概览'].image
					}
					break;
				case '巴西(Brazil)':
					if (this.title != '') {
						return BrazilInfo[this.title].image
					} else {
						return BrazilInfo['概览'].image
					}
					break;
				case '澳大利亚(Australia)':
					if (this.title != '') {
						return AustraliaInfo[this.title].image
					} else {
						return AustraliaInfo['概览'].image
					}
					break;
			}
			
		},

		//文字内容
		textContent() {
			switch (this.countryName) {
				case '中国(China)':
					if (this.title != '') {
						return ChinaInfo[this.title].description
					} else {
						return ChinaInfo['概览'].description
					}
					break;
				case '美国(United States)':
					if (this.title != '') {
						return USAInfo[this.title].description
					} else {
						return USAInfo['概览'].description
					}
					break;
				case '英国(United Kingdom)':
					if (this.title != '') {
						return UKInfo[this.title].description
					} else {
						return UKInfo['概览'].description
					}
					break;
				case '德国(Germany)':
					if (this.title != '') {
						return GermanyInfo[this.title].description
					} else {
						return GermanyInfo['概览'].description
					}
					break;
				case '巴西(Brazil)':
					if (this.title != '') {
						return BrazilInfo[this.title].description
					} else {
						return BrazilInfo['概览'].description
					}
					break;
				case '澳大利亚(Australia)':
					if (this.title != '') {
						return AustraliaInfo[this.title].description
					} else {
						return AustraliaInfo['概览'].description
					}
					break;
			}
		}
	},
	onReady() {
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
	methods: {
		preloadImage(imageSrc){
			clearInterval(this.soundTimer);
			this.currentSound = this.pauseSound;
			uni.showLoading({
				'title':"加载中"
			})
			uni.previewImage({
				current: imageSrc,
				urls: [imageSrc],
				indicator:'default',
				loop:false,
				success:function(res){
					uni.hideLoading()
				}
			})
		},
		
		startToSpeechOrPause(){
			uni.showLoading({
				title:'加载中'
			})
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
			//分段播报textContent的内容
			//获取textContent的所有key
			let textContentKey = Object.keys(this.textContent);
			let currentKey = textContentKey[0];
			//播报第一段
			this.speechText(this.textContent[currentKey]);
			//监听播报结束
			this.innerAudioContext.onEnded(() => {
				//检查是否是最后一段
				if (currentKey == textContentKey[textContentKey.length - 1]) {
					uni.hideLoading()
					return;
				}
				else {
					//播报下一段
					currentKey = textContentKey[textContentKey.indexOf(currentKey) + 1];
					this.speechText(this.textContent[currentKey]);
				}
			})
		},

		speechText(text) {
			var that = this
			plugin.textToSpeech({
				lang: "zh_CN",
					tts: true,
					content: text,
					success: function(res) {
						that.innerAudioContext.autoplay = true;
						that.innerAudioContext.src = res.filename;
						uni.hideLoading();
						that.innerAudioContext.onPlay(() => {
						});   
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
		}
	}
}
</script>

<style>
	.content{
		display: flex;
		/* 内容都居中显示*/
		justify-content: center;
	}
	.image{
		margin-top:5%;
		width: 100%;
	}
	.item{
		
	}
	.btn{
		/* 自动换行 */
		white-space: normal;
		width: 30vw;
		padding: 10rpx;
		margin: 20rpx;
		border-radius: 10rpx;
		color: white;
		/* 更加立体一些 */
		box-shadow: 0 0 10rpx rgba(0,0,0,0.5);
	}
	.text{
		font-size: 25rpx;
		/* 自动换行 */
		white-space: normal;
		text-align: left;
		/* 换行时缩进 */
		text-indent: 2em;
		margin-left: 5%;
		margin-right: 5%;
		margin-bottom: 5%;
	}
	.titleCountry{
		font: 20px "microsoft yahei";  
		/* 红色 */
		color: red;
	}
	.drawer_title{  
		padding:15px;  
		font: 20px "microsoft yahei";  
		text-align: center;  
		height: 5vh;
	}  
</style>