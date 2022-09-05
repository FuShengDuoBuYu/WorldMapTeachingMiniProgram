<template>
	<cover-view class="contnet">
		<cover-view class="drawer_title">{{title}}</cover-view> 
		<cover-view class="titleCountry">{{countryName}}</cover-view>
		<cover-image class="image" :src="imageSrc"></cover-image>
		<!-- 循环展示所有的item -->
		<cover-view class="item" v-for="(value,key) in textContent" :key="key">
			<button size="mini" type="primary" class="btn" @click="startToSpeech(item.text)">
				{{key}}
			</button>
			<cover-view class="text">
				{{value}}
			</cover-view>
		</cover-view>
	</cover-view>
</template>


<script>
	//===================================
	// var plugin = requirePlugin("WechatSI")
	// let manager = plugin.getRecordRecognitionManager()
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
			innerAudioContext: uni.createInnerAudioContext()
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
		// 	startToSpeech(textToSpeech){
		// 		console.log(this.innerAudioContext.paused)
		// 		if(this.innerAudioContext.paused==false){
		// 			this.innerAudioContext.pause()
		// 			uni.showToast({
		// 				title:"停止播放",
		// 				duration:1500
		// 			})

		// 			return
		// 		}
		// 		var that = this
		// 		plugin.textToSpeech({
		// 			lang: "zh_CN",
		// 			    tts: true,
		// 			    content: textToSpeech,
		// 			    success: function(res) {
		// 					that.innerAudioContext.autoplay = true;
		// 					that.innerAudioContext.src = res.filename;
		// 					that.innerAudioContext.onPlay(() => {
		// 					  uni.showToast({
		// 					  	title:"播放音频",
		// 						duration:1500
		// 					  })
		// 					});   
		// 			    },
		// 			    fail: function(res) {
		// 			        uni.showToast({
		// 			        	title:"播放失败",
		// 						icon:"error",
		// 						duration:1500
		// 			        })
		// 			    }
		// 		})
		// 	}
		//
	}
}
</script>

<style>
	.content{
		display: flex;
		/* 内容都居中显示*/
		justify-content: center;
		overflow: scroll;
	}
	.image{
		width:100%;
		margin-top:5%;
		margin-bottom:5%;
	}
	.item{
		/* 单行展示 */
		display: flex;
		/* 内容两侧 */
		justify-content: space-between;
		margin: 5%;
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
		font-size: 20rpx;
		/* 自动换行 */
		white-space: normal;
		/* 居中显示 */
		text-align: center;
	}
	.titleCountry{
		font-size: 30rpx;
		/* 红色 */
		color: red;
		/* 居中 */
		text-align: center;
	}
	.drawer_title{  
		padding:15px;  
		font: 20px "microsoft yahei";  
		text-align: center;  
		height: 5vh;
	}  
</style>