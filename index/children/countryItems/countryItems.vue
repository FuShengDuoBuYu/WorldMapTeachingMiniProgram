<template>
	<view class="content">
		<view style="width: 100%;display: flex;">
			<button class="btn" type="primary">气候</button>
			<button class="btn" type="primary">人口分布</button>
		</view>
		<view style="width: 100%;display: flex;">
			<button class="btn" type="primary">经纬度</button>
			<button class="btn" type="primary">语言</button>
		</view>
		<view style="width: 100%;display: flex;">
			<button class="btn" type="primary">典型动物</button>
			<button class="btn" type="primary">地形分布</button>
		</view>
		<view style="width: 100%;display: flex;">
			<button class="btn" type="primary">时区</button>
			<button class="btn" type="primary">降水分布</button>
		</view>
		<view style="width: 100%;display: flex;">
			<button class="btn" type="primary">环境污染</button>
		</view>
	</view>
	
</template>

<script>
	export default {
		name:'countryItems'
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