<template>
	<view class="container">
		<uni-card style="width: 120rpx;height: 60rpx;" v-for="(location, index) in countries" :key="index" @click="chooseCountry(location)">
			<image style="width: 120rpx;height: 60rpx;" mode="aspectFit" src="../static/nationFlags/china.jpg" />
			<text style="margin-bottom: 20rpx;">{{location}}</text>
			
		</uni-card>
	</view>
</template>

<script>
import uniCard from '../../uni_modules/uni-card/components/uni-card/uni-card.vue'
import {getWorldCountryNameList} from '@/index/children/worldMapChart/data/worldCountryName.js'
	export default {
  components: { uniCard },
		data() {
			return {
				countries:getWorldCountryNameList()
			}
		},
		onLoad() {
			
		},
		methods: {
			chooseCountry(location){
				console.log("上机"+location);
				uni.$emit("chooseLocation",{
					country:location
				});
				uni.navigateBack({
					delta:1
				})
			}
		}
	}
</script>

<style>
	.container{
		
	}
	
	.item {
	  text-align: center;
	  width: 120rpx;
	  height: 70rpx;
	  
	}


</style>
