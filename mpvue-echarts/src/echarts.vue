<template>
	<canvas force-use-old-canvas="true" v-if="canvasId" class="ec-canvas" :id="canvasId" :canvasId="canvasId" @touchstart="touchStart" @touchmove="touchMove" @touchend="touchEnd" @error="error"></canvas>
</template>

<script>
import WxCanvas from './wx-canvas';
export default {
	// watch:{
	// 	tapX(newVal){
	// 		this.touchChart();
	// 	},
	// 	tapY(newVal){
	// 		this.touchChart();
	// 	}
	// },
	props: {
		canvasId: {
			type: String,
			default: 'ec-canvas'
		},
		lazyLoad: {
			type: Boolean,
			default: false
		},
		disableTouch: {
			type: Boolean,
			default: false
		},
		throttleTouch: {
			type: Boolean,
			default: false
		}
		// tapX:{
		// 	type:Number,
		// 	default:0
		// },
		// tapY:{
		// 	type:Number,
		// 	default:0
		// }
	},
	// #ifdef H5
	mounted() {
		if (!this.lazyLoad) this.init();
	},
	// #endif
	// #ifndef H5
	onReady() {
		if (!this.lazyLoad) this.init();
	},
	// onLoad(){
	// 	console.log(111)
	// 	uni.$on("touchChart",(e)=>{
	// 		console.log(e);
	// 		this.touchEnd(e)
	// 	})
	// },
	// #endif
	methods: {
		setChart(chart){
			this.chart = chart
		},
		init() {
			const { canvasId } = this;
			this.ctx = wx.createCanvasContext(canvasId, this);
			this.canvas = new WxCanvas(this.ctx, canvasId);
			const query = wx.createSelectorQuery().in(this);
			query
				.select(`#${canvasId}`)
				.boundingClientRect(res => {
					if (!res) {
						setTimeout(() => this.init(), 50);
						return;
					}
					this.$emit('onInit', {
						canvas: this.canvas,
						width: res.width,
						height: res.height
					});
				})
				.exec();
		},
		canvasToTempFilePath(opt) {
			const { canvasId } = this;
			this.ctx.draw(true, () => {
				wx.canvasToTempFilePath({
					canvasId,
					...opt
				});
			});
		},
		touchStart(e) {
			const { disableTouch, chart } = this;
			if (disableTouch || !chart || !e.mp.touches.length) return;
			const touch = e.mp.touches[0];
			chart._zr.handler.dispatch('mousedown', {
				zrX: touch.x,
				zrY: touch.y
			});
			chart._zr.handler.dispatch('mousemove', {
				zrX: touch.x,
				zrY: touch.y
			});
		},
		touchMove(e) {
			const { disableTouch, throttleTouch, chart, lastMoveTime } = this;
			if (disableTouch || !chart || !e.mp.touches.length) return;
			if (throttleTouch) {
				const currMoveTime = Date.now();
				if (currMoveTime - lastMoveTime < 240) return;
				this.lastMoveTime = currMoveTime;
			}
			const touch = e.mp.touches[0];
			chart._zr.handler.dispatch('mousemove', {
				zrX: touch.x,
				zrY: touch.y
			});
		},
		touchEnd(e) {
			console.log(e)
			const { disableTouch, chart } = this;
			if (disableTouch || !chart) return;
			const touch = e.mp.changedTouches ? e.mp.changedTouches[0] : {};
			chart._zr.handler.dispatch('mouseup', {
				zrX: touch.x,
				zrY: touch.y
			});
			chart._zr.handler.dispatch('click', {
				zrX: touch.x,
				zrY: touch.y
			});
		},
		// touchChart(){
		// 	console.log(12345)
		// 	chart._zr.handler.dispatch('mouseup', {
		// 		zrX: this.tapX,
		// 		zrY: this.tapY
		// 	});
		// 	chart._zr.handler.dispatch('click', {
		// 		zrX: this.tapX,
		// 		zrY: this.tapY
		// 	});
		// }
	}
};
</script>

<style scoped>
.ec-canvas {
	width: 200vw;
	height: 80vh;
	flex: 1;
}
</style>