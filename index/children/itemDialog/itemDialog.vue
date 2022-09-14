<template>
	<cover-view class="contnet">
		<cover-image @click="preloadImage" class="image" :src="imageSrc"></cover-image>
		<cover-view style="display: flex;justify-content: space-around;">
			<cover-view>
				<cover-image style="height: 5vh;margin-top: 1vh;" @click="startToSpeech" :src="imageIcon"></cover-image>
			</cover-view>
			<cover-view class="titleCountry">{{countryName}}</cover-view>
		</cover-view>
		<cover-view class="drawer_title">
			{{title}}
		</cover-view>
		<!-- 循环展示所有的item -->
		<cover-view class="item" v-for="(value,key) in textContent" :key="key">
			<cover-view class="text">
				{{value}}
			</cover-view>
		</cover-view>
	</cover-view>
</template>


<script>
	//===================================
	var plugin = requirePlugin("WechatSI")
	let manager = plugin.getRecordRecognitionManager()
	// ====================================
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
			imageIcon:"data:image/png;base64,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"
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

	},
	methods: {
		//停止播放
		stopSpeech(){
			console.log("stop")
			this.innerAudioContext.pause();
		},
		preloadImage(){
			uni.showLoading({
				'title':"加载中"
			})
			let that = this;
			uni.previewImage({
				current: that.imageSrc,
				urls: [that.imageSrc],
				indicator:'default',
				loop:false,
				success:function(res){
					uni.hideLoading()
				}
			})
		},
		
		startToSpeech(){
			uni.showLoading({
				title:'加载中'
			})
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
		padding:15px;
		font: 20px "microsoft yahei";  
		text-align: center;  
		height: 5vh;
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