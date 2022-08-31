<template>
	<view class="content">
		<!-- 顶部搜索框和按钮 -->
		<view style="display: flex;">
			<uni-combox :candidates="candidates" placeholder="请输入要查找的内容" v-model="searchItem"></uni-combox>
			<button type="primary" hover-class="button-hover" @click="goto('/pages/chooseCountry/chooseCountry')">国家/国旗</button>
		</view>
		<view style="width: 100%;">
			<worldMapChartVue></worldMapChartVue>
		</view>
	</view>
</template>

<script>
	import worldMapChartVue from './children/worldMapChart/worldMapChart.vue';
	export default {
		components:{
            worldMapChartVue
        },
		data() {
			return {
				//用户要搜索的项
				searchItem:'',
				//候选城市
				candidates: ['北京', '上海', '广州', '深圳', '杭州', '成都', '武汉', '南京', '西安', '长沙', '苏州', '天津', '重庆', '郑州', '青岛', '大连', '沈阳', '长春', '哈尔滨', '福州', '厦门', '济南', '石家庄', '太原', '合肥', '南昌', '无锡', '佛山', '东莞', '宁波', '常州', '昆明', '南宁', '贵阳', '海口', '惠州', '珠海', '中山', '烟台', '嘉兴', '南通', '徐州', '温州', '乌鲁木齐', '兰州', '贵阳', '呼和浩特', '保定', '廊坊', '唐山', '邯郸', '秦皇岛', '承德', '沧州', '衡水', '邢台', '张家口', '汕头', '汕尾', '揭阳', '阳江', '茂名', '湛江', '肇庆', '江门', '韶关', '梅州', '河源', '清远', '潮州', '云浮', '台州', '丽水', '金华', '衢州', '舟山', '三亚', '威海', '潍坊', '临沂', '枣庄', '东营', '济宁', '泰安', '莱芜', '滨州', '菏泽', '日照', '咸阳', '宝鸡', '铜川', '渭南', '延安']
				
			}
		},
		onLoad() {

		},
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

	.text-area {
		display: flex;
		justify-content: center;
	}

	.title {
		font-size: 36rpx;
		color: #8f8f94;
	}
</style>
