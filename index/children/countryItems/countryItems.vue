<template>
	<view class="content">
		<view style="width: 100%;display: flex;">
			<button class="btn" type="primary" @click="showDialog('气候')">气候</button>
			<button class="btn" type="primary" @click="showDialog('人口分布')">人口分布</button>
		</view>
		<view style="width: 100%;display: flex;">
			<button class="btn" type="primary" @click="showDialog('经纬度')">经纬度</button>
			<button class="btn" type="primary" @click="showDialog('语言')">语言</button>
		</view>
		<view style="width: 100%;display: flex;">
			<button class="btn" type="primary" @click="showDialog('典型动物')">典型动物</button>
			<button class="btn" type="primary" @click="showDialog('地形分布')">地形分布</button>
		</view>
		<view style="width: 100%;display: flex;">
			<button class="btn" type="primary" @click="showDialog('时区')">时区</button>
			<button class="btn" type="primary" @click="showDialog('降水分布')">降水分布</button>
		</view>
		<view style="width: 100%;display: flex;">
			<button class="btn" type="primary" @click="showDialog('环境污染')">环境污染</button>
		</view>
	</view>
	
</template>

<script>
	export default {
		name:'countryItems',
		methods:{
			showDialog(item){
				console.log(item)
				this.$emit('showDialog',item)
			}
		}
	}
</script>

<style>
	.btn{
		width: 300rpx;
		padding: 10rpx;
		margin: 20rpx;
	}
	.content {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
	}
</style>