<template>
	<view class="container">
		<view class="card" v-for="(location, index) in countries" :key="index" @click="chooseCountry(location)">
			<image class="img" mode="aspectFit" :src="getLocationName(location)" />
			<text class="text">{{location}}</text>
		</view>
	</view>
</template>

<script>
import {getWorldCountryNameList} from '@/index/children/worldMapChart/data/worldCountryName.js'
	export default {
  components: {},
		data() {
			return {
				countries:getWorldCountryNameList()
			}
		},
		onLoad() {
			
		},
		methods: {
			chooseCountry(location){
				uni.$emit("chooseLocation",{
					country:location
				});
				uni.navigateBack({
					delta:1
				})
			},
			//获取(字符前的字符串
			getLocationName(location){
				// locationName = "/pages/static/nationFlags/"+location.match(/\(([^)]*)\)/)[1]+".gif"
				// return  locationName.repa
				return "/pages/static/nationFlags/"+location.match(/\(([^)]*)\)/)[1]+".gif"
			}
		}
	}
</script>

<style>
	.container{
		/* 网格排布 */
		display: grid;
		/* 网格列数 */
		grid-template-columns: repeat(3, 1fr);
		/* 网格行数 */
		grid-template-rows: repeat(3, 1fr);

	}

	.card {
		width: 90%;
		height: 300rpx;
		margin: 5%;
		/* 让文字和图片上下居中显示 */
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		/* 背景深灰色 */
		background-color: #f5f5f5;
		border-radius: 20rpx;
	}

	.img{
		width:100%;
		height: 250rpx;

	}

	.text{
		/* 自动分行 */
		overflow: hidden;
		text-overflow: ellipsis;
		display: -webkit-box;
		-webkit-line-clamp: 2;
		-webkit-box-orient: vertical;
		/* 居中 */
		text-align: center;
		/* 加粗加大 */
		font-weight: bold;
	}

</style>
