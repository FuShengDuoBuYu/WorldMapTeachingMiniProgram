<template>
	<view class="content">
		<!-- 顶部搜索框和按钮 -->
		<view style="display: flex;width:100%;justify-content: center;">
			<uni-combox style="margin-left: 10%;" :candidates="candidates" placeholder="请输入要查找的内容" v-model="searchItem"></uni-combox>
			<button style="margin-left: 10%;" size="mini" type="primary" hover-class="button-hover" @click="goto('/pages/chooseCountry/chooseCountry')">国家</button>
		</view>
		<view style="width: 100%;">
			<worldMapChartVue :chooseLocation="userChooseLoacation"></worldMapChartVue>
		</view>
		<text>您当前选择的是</text>
		<text style="font-size: x-large;color: red;">{{userChooseLoacation}}</text>
		<country-items></country-items>
	</view>
</template>

<script>
	import worldMapChartVue from './children/worldMapChart/worldMapChart.vue';
	import countryItems from './children/countryItems/countryItems.vue'
	import { getWorldCountryNameList } from './children/worldMapChart/data/worldCountryName.js';
	export default {
		components:{
            worldMapChartVue,
			countryItems
        },
		//监听searchItem的变化
		watch: {
			searchItem(newVal, oldVal) {
				let items = getWorldCountryNameList();
				if(items.includes(newVal)) {
					this.userChooseLoacation = newVal;
				}
			}
		},
		data() {
			return {
				//用户要搜索的项
				searchItem:'中国',
				//候选城市
				candidates: getWorldCountryNameList(),
				//用户选择的地点
				userChooseLoacation:'中国'
			}
		},
		onLoad() {
			uni.$on('chooseLocation',(data)=>{
					console.log(data);
				this.userChooseLoacation = data.country; 
				this.searchItem = data.country;
			}) 
		},
		//监听
		methods: {
			//跳转页面
			goto(url) {
				uni.navigateTo({
					url:url
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

	.logo {
		height: 200rpx;
		width: 200rpx;
		margin-top: 200rpx;
		margin-left: auto;
		margin-right: auto;
		margin-bottom: 50rpx;
	}
</style>
