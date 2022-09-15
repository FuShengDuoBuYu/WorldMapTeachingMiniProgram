<template>
	<view>
		<image class="bg" :src="backgroundImage"></image>
		<view style="display: flex;justify-content: space-between;margin-left: 3%;">
			<text style="font-size: xx-large;color: beige;font-weight: bold;">世界地图册</text>
			<button size="mini" style="align-self: center;" type="primary" @click="switchTo('/pages/worldRecords/worldRecords')">切换地图</button>
		</view>
		<!-- 顶部搜索框和按钮 -->
		<view z-index="99" style="display: flex;width:100%;justify-content:center;margin:auto">
			<uni-icons style="width: 10%;margin-left: 3%;" type="search" size="30"></uni-icons>
			<uni-combox @ifShowSelector="ifShowCanvas" style="width: 60%;" :candidates="candidates" placeholder="请输入要查找的内容" v-model="searchItem"></uni-combox>
			<button size="mini" style="background-color: bisque;" hover-class="button-hover" @click="goto('/pages/chooseCountry/chooseCountry')">国家</button>
		</view>
		<view style="width: 100%;height: 700rpx;">
			<worldMapChartVue v-show="ifShowCanvasChart" :chooseLocation="userChooseLoacation"></worldMapChartVue>
		</view>
		<view style="display: flex;justify-content:space-around;">
			<text>您当前选择的是</text>
			<text style="font-size: x-large;color: red;">{{countryName}}</text>
		</view>
		<view class="content">
			<country-items :countryName="countryName" @showDialog='showTheDialog'></country-items>
		</view>
		
		
		<!-- 遮罩透明层 -->
		<!--mask-->  
		<cover-view class="drawer_screen" @click="showTheDialog" v-if="showDialog"></cover-view>  
		<!--content-->
		<cover-view class="drawer_box" v-if="showDialog">  
		  <!--drawer content-->  
		  <cover-view class="drawer_content">  
			<!-- 填充内容 -->
			<item-dialog ref="dialog" :title="title" :countryName = "countryName"></item-dialog>
		  </cover-view>  
		</cover-view>
	</view>
</template>

<script>
	import worldMapChartVue from './children/worldMapChart/worldMapChart.vue';
	import countryItems from './children/countryItems/countryItems.vue';
	import itemDialog from './children/itemDialog/itemDialog.vue';
	import {images} from './data.js'
	//引入bgImage
	import { getWorldCountryNameList,getCountryNameByEnglish,ifNameIsCountry,findCityByName } from './children/worldMapChart/data/worldCountryName.js';
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
			},
			userChooseLoacation(newVal,oldVal){
				if(ifNameIsCountry(newVal.match(/\(([^)]*)\)/)[1])==true){
					this.countryName = newVal
				}
				//根据英文名找到国家名字
				else{
					this.countryName = getCountryNameByEnglish(findCityByName(newVal.match(/\(([^)]*)\)/)[1])[1])
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
				userChooseLoacation:'',
				//用户点击的item
				title:'',
				showDialog:false,
				//用户的选择的国家地的名字
				countryName:"暂未选择",
				//是否展示canvas
				ifShowCanvasChart:true,
				backgroundImage:images.bgImage,
				//dialog要展示的内容
				dialogContent:''
			}
		},
		onLoad() {
			uni.$on('chooseLocation',(data)=>{
				if(this.ifMarkCountry(data.country)){
					uni.$emit('showDialog', {
						item:""
					}) 
				}
				this.userChooseLoacation = data.country; 
				this.searchItem = data.country;
				
			});
			uni.$on('showDialog',(data)=>{
				this.showDialog = true;
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
			//进入页面
			switchTo(url){
				uni.reLaunch({
					url:url
				})
			},
			//弹窗遮罩
			showTheDialog(item) {
				// console.log(this.bgImage)
				this.title = item
				this.showDialog = !this.showDialog
				if(this.showDialog==false){
					this.$refs.dialog.stopSpeech();
				}
				
			},  
			//canvas显示与否
			ifShowCanvas(ifShowSelect){
				this.ifShowCanvasChart = !ifShowSelect
			},
			//查看是否是重点国家
			ifMarkCountry(countryName) {
				let country = countryName.match(/\(([^)]*)\)/)[1]
				//查看用户点击的是否是6个重点国家
				if(
					(country=="China"||
					country=="United Kingdom"||
					country=="Germany"||
					country=="Australia"||
					country=="United States"||
					country=="Brazil"
				)&&countryName==this.userChooseLoacation){
					return true
				}
				else{
					return false
				}
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
		width: 90%;  
		overflow: hidden;  
		position: fixed;
		height: 70vh;
		bottom: 5vh;
		left: 0;  
		z-index: 1001;  
		background: #FAFAFA;  
		margin-left: 5vw;
		border-radius: 20px;  
	}  
	
	.drawer_content {  
		height: 65vh;  
		overflow-y: scroll; /*超出父盒子高度可滚动*/  
	}  
	
	.bg{
		
		position: fixed;
		width: 100%;
		height: 100%;
		top: 0;
		left: 0;
		z-index: -1;
		opacity: 0.5;
	}
</style>
