<template>
	<cover-view class="contnet">
		<cover-image @click="preloadImage" class="image" :src="imageSrc"></cover-image>
		<cover-view style="display: flex;justify-content: space-around;align-items: baseline;margin: 2vh;">
			<cover-view class="titleCountry">{{countryName}}</cover-view>
			<cover-view>
				<cover-image style="height: 3vh;width: 3vh;" @click="startToSpeech" :src="imageIcon"></cover-image>
			</cover-view>
		</cover-view>
		<cover-view class="drawer_title" v-if="title!=''">
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
			imageIcon:"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAAAXNSR0IArs4c6QAAA65JREFUaEPtmVvITVEQx3/fC8oLL+7XkAgpJEXILZJcogh54ksSQlJCESKSkEspCiGekFtELoVESPHgmkSUpPCiv2Zpfdu+nrOPs78683bWnrXW/79mZs2sOXU0cqlr5PipEai2BWsWSGGB9kAn4HYK3cwqlbRAL2AHMA54CXTNjC7FhEoRmApsBzp7GEYC11JgyqRSCQKrgY0hKJII9AaeZkIPuV6jHYBNwGwPxDKzhIbiCNwDBgAHgPlZSORlgWl26j1tcwXscqAJcNXG4gicAKab3kNgNPApDZFyCQig3EVgnewGVgHfgBEpCWjuYWCOt85Q4GYSiXIIjAHWAMNsk3eA/F9AnGQhoDk6iK3e/GbAjzgSYQRaA5uBLgnsBc7JGQP/LDAnKwFNHwtcsHWOAbOyElgHrE0ynfddp67gDZNSCGidemCvLbgE2BmFJ8wCPgEloq8Rk59Ydn0bQzaKwDzgELALWBwxX9+lJ+kLPA7TSyJQToxovygCCvSFBugF0CMEnFz4DiCX3mDx9o9atQgIyGlgSgIJZfOlwHOgD/AzyKCaBITFd9eTwIwAwIHAXRubCxwpGgHhUZwpUCVhIE8BSpRngYlFJNDdXETYLlr16uOUC8mVdFl0LCIBYToHjDdwTQO+rhJDpYZE9ZYS5l+pdgw4IHIhuZJEj583HkYVeSr2JKqRrhSRwGRA2VwyyAOs3y2Bz/ZtEaAruHAW8Ano5rnvYWwBfLHfyh0uQ/8ZKqILKYG98gj0Bx7Y7+HA9SJawH8PNAe+eyB967QD3heNgILWnfh+YIEP0HKEAvx14I1dGBfyTz/o/wJZ6ETmlxJhlWlhS4lull0nmbtEVaRlF3OtgI8Bn8zyM6qcPgrMtIXOAxNCFlWJfaPccloVYlyvRhlSd3aDm8EDE0VgC7DSAlaBGyaXLPPqW8kPmrSnvQLYFqJc6pNyn9cfinuyhiaytsAeQBkwSfyHvWp1EfmQwgJx644CLpuCygu1KSOl3Cej+jhqg+jZJ3lkJFQWS7JaQOu5toyqTlWfsVIuAS3ez0ioHeLEuVQWAjoI1yBTw0BPyETJg4DbxAegMfnx8ZSdOdcb1TzlhvWJyE0hTwJaUi6galH1jESu5CwT1xu9BQxJuJVCOeVNQJsoCNVlDv6hUfj2un9C8t+DwGBvMIlAWq9poFcJC7gNlMVlCVcutAlcsSUBDk6qJAG3l960v+yKzQW0v8j/IJA76BqBih5pxsVrLpTxwHJX/w0FQeYxnkJifQAAAABJRU5ErkJggg=="
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