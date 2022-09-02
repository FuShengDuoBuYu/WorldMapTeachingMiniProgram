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
		<country-items @showDialog='showTheDialog'></country-items>
		
		
		<!-- 遮罩透明层 -->
		<!--mask-->  
		<view class="drawer_screen" @click="showTheDialog" v-if="showDialog">
			
		</view>  
		<!--content-->
		<!--使用animation属性指定需要执行的动画-->  
		<view class="drawer_box" v-if="showDialog">  
		  
		  <!--drawer content-->  
		  <view class="drawer_title">{{title}}</view>  
		  <view class="drawer_content">  
			<!-- 填充内容 -->
			<item-dialog></item-dialog>
		  </view>  
		</view>
	</view>
	
	
</template>

<script>
	import worldMapChartVue from './children/worldMapChart/worldMapChart.vue';
	import countryItems from './children/countryItems/countryItems.vue'
	import itemDialog from './children/itemDialog/itemDialog.vue'
	import { getWorldCountryNameList } from './children/worldMapChart/data/worldCountryName.js';
	export default {
		components:{
            worldMapChartVue,
			countryItems,
			itemDialog
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
				searchItem:'',
				//候选城市
				candidates: getWorldCountryNameList(),
				//用户选择的地点
				userChooseLoacation:'暂未选择',
				//用户点击的item
				title:'',
				showDialog:false,
				animationData:{}
			}
		},
		onLoad() {
			uni.$on('chooseLocation',(data)=>{
				this.userChooseLoacation = data.country; 
				this.searchItem = data.country;
			});
			uni.$on('showDialog',(data)=>{
				console.log(data.item)
				this.title = data.item; 
			}) 
		},
		//监听
		methods: {
			//跳转页面
			goto(url) {
				uni.navigateTo({
					url:url
				})
			},
			//弹窗遮罩
			showTheDialog(item) {
				this.title = item
				this.showDialog = !this.showDialog
			},  			
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

	/*mask*/  
	.drawer_screen {  
	width: 100%;  
	height: 100%;  
	position: fixed;  
	top: 0;  
	left: 0;  
	z-index: 1000;  
	background: #000;  
	opacity: 0.5;  
	overflow: hidden;  
	}  
	
	/*content*/  
	.drawer_box {  
		width: 90vw;  
		overflow: hidden;  
		position: absolute; 
		
		height: 70vh;
		left: 0;  
		z-index: 1001;  
		background: #FAFAFA;  
		margin-left: 5vw;
		margin-top: 30vh;
		border-radius: 20px;  
	}  
	
	.drawer_title{  
		padding:15px;  
		font: 20px "microsoft yahei";  
		text-align: center;  
		height: 5vh;
	}  
	
	.drawer_content {  
		height: 65vh;  
		overflow-y: scroll; /*超出父盒子高度可滚动*/  
	}  
</style>
