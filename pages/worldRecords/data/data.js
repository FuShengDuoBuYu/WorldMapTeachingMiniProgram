const worldRecords = {
	"亚马孙河":{
		image:"http://106.15.35.61:81/projects/world_map/images/world_record/Amazon_River.png",
		description:"世界流量最大，流域面积最广"
	},
	"亚马孙平原":{
		image:"http://106.15.35.61:81/projects/world_map/images/world_record/Amazon_Plain.jpg",
		description:"面积最大"
	},
	"喜马拉雅山脉":{
		image:"http://106.15.35.61:81/projects/world_map/images/world_record/Himalayas.jpg",
		description:"最高山脉"
	},
	"伏尔加河":{
		image:"http://106.15.35.61:81/projects/world_map/images/world_record/Volga_River.jpg",
		description:"世界最长内流河"
	},
	"马里亚纳海沟":{
		image:"http://106.15.35.61:81/projects/world_map/images/world_record/Mariana_Trench.jpg",
		description:"世界最深的海沟"
	},
	"尼罗河":{
		image:"http://106.15.35.61:81/projects/world_map/images/world_record/the_Nile.jpg",
		description:"世界第一长河"
	},
	"青藏高原":{
		image:"http://106.15.35.61:81/projects/world_map/images/world_record/Qinghai_Tibet_Plateau.jpg",
		description:"世界最高的高原"
	},
	"乞拉朋齐":{
		image:"http://106.15.35.61:81/projects/world_map/images/world_record/Kilapinqi.jpg",
		description:"世界“雨极”"
	},
	"怀厄莱阿莱":{
		image:"http://106.15.35.61:81/projects/world_map/images/world_record/Wyele_Alai.jpg",
		description:"世界“湿极”"
	},
	"奥伊米亚康":{
		image:"http://106.15.35.61:81/projects/world_map/images/world_record/Oymyakon.jpg",
		description:"北半球“寒极” -71.0摄氏度"
	},
	"阿塔卡马沙漠":{
		image:"http://106.15.35.61:81/projects/world_map/images/world_record/Atacama_Desert.jpg",
		description:"世界“旱极”"
	},
	"死谷国家公园":{
		image:"http://106.15.35.61:81/projects/world_map/images/world_record/Death_Valley_National_Park.jpg",
		description:"世界“热极”56.7摄氏度"
	},
	"刚果盆地":{
		image: "http://106.15.35.61:81/projects/world_map/images/world_record/Congo_Basin.jpg",
		description: "世界最大的盆地"
	},
	"几内亚湾":{
		image:"http://106.15.35.61:81/projects/world_map/images/world_record/Gulf_of_Guinea.jpg",
		description:"世界最大的内陆湾"
	},
	"波斯湾":{
		image:"http://106.15.35.61:81/projects/world_map/images/world_record/Persia_%20Gulf.jpg",
		description:"世界最大的湾"
	},
	"安第斯山脉":{
		image: "http://106.15.35.61:81/projects/world_map/images/world_record/Andes.jpg",
		description:"世界最长山脉"
	}
}

//导出获取所有地名的方法
export function getWorldRecords() {
	console.log(Object.keys(worldRecords))
	return Object.keys(worldRecords);
}

//根据名字查找某个地方
export function getWorldRecord(name) {
	return worldRecords[name];
}