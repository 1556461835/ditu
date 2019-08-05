window.map = initMap(); //初始化地图对象
window.lastInfoBox = null; //定义最近打开的地图信息窗体
window.pointArray = []; //行政区划点位集合
window.labelData = []; //存数点位数据
addMarker(); //添加聚合点

function initMap() {
	var map = new BMap.Map("allMap", {
		enableMapClick: false,
		minZoom: 9,
		maxZoom: 20
	});
	var point = new BMap.Point(113.658221, 34.780377); //郑州市中心点
	map.centerAndZoom(point, 9);
	// map.enableScrollWheelZoom(true);
	//监听地图级别缩放事件，当级别为9时默认加载集合点，扩大级别时显示详细点位数据
	map.addEventListener("zoomend", function() {
		var zoomLevel = map.getZoom(); //获取地图缩放级别
		if (zoomLevel == 9) {
			addMarker();
			labelData = [];
			pointArray = [];
		} else {
			//当存储的数据有数时直接加载视野数据，否则请求接口数据
			if (labelData.length > 0) {
				addViewLabel(labelData);
			} else {
				getAllLabel();
			}
		}
	});
	return map;
}

//根据行政区划绘制聚合点位
function addMarker() {
	map.clearOverlays();
	//模拟数据
	var clustereData = [{
			"name": "郑州市",
			"code": "410100000",
			"longitude": "113.451854",
			"latitude": "34.556306"
		},
		{
			"name": "开封市",
			"code": "410200000",
			"longitude": "114.356733",
			"latitude": "34.506238"
		},
		{
			"name": "洛阳市",
			"code": "410300000",
			"longitude": "112.134468",
			"latitude": "34.263041"
		},
		{
			"name": "平顶山市",
			"code": "410400000",
			"longitude": "112.892161",
			"latitude": "33.773999"
		},
		{
			"name": "安阳市",
			"code": "410500000",
			"longitude": "114.098163",
			"latitude": "36.106852"
		},
		{
			"name": "鹤壁市",
			"code": "410600000",
			"longitude": "114.208643",
			"latitude": "35.653125"
		},
		{
			"name": "新乡市",
			"code": "410700000",
			"longitude": "113.933677",
			"latitude": "35.31059"
		},
		{
			"name": "焦作市",
			"code": "410800000",
			"longitude": "113.050848",
			"latitude": "35.124706"
		},
		{
			"name": "濮阳市",
			"code": "410900000",
			"longitude": "115.169299",
			"latitude": "35.769421"
		},
		{
			"name": "许昌市",
			"code": "411000000",
			"longitude": "113.856834",
			"latitude": "34.043383"
		}
	];

	$.each(clustereData, function(index, data) {
		var point = new BMap.Point(data.longitude, data.latitude);
		//自定义label样式
		var tpl = '<div class="bubble bubble-1" data-longitude="' + data.longitude + '"' +
			' data-latitude="' + data.latitude + '" data-id="' + data.code + '">' +
			'<p class="name" title="' + data.name + '">' + data.name + '</p>' +
			'</div>';
		var myLabel = new BMap.Label(tpl, {
			position: point, //label 在此处添加点位位置信息
			offset: new BMap.Size(-46, -46)
		});
		myLabel.setStyle({
			width: "92px", //宽
			height: "92px", //高度
			border: "0", //边
			background: "rgba(84,144,244,.9)", //背景颜色
			borderRadius: "50%",
			cursor: "pointer"
		});
		myLabel.setTitle(data.name);
		map.addOverlay(myLabel); //添加点位
		myLabel.addEventListener("click", function() {
			map.zoomIn();
			var regionName = myLabel.getTitle();
			getBoundary(regionName);
			getAllLabel();
		});
	})

}

//根据行政区划绘制边界
function getBoundary(regionName) {
	var bdary = new BMap.Boundary();
	bdary.get(regionName, function(rs) {
		var count = rs.boundaries.length; //行政区域的点有多少个
		if (count === 0) {
			alert('未能获取当前输入行政区域');
			return;
		}
		for (var i = 0; i < count; i++) {
			if (!window.ply) {
				window.ply = new BMap.Polygon(rs.boundaries[i], {
					strokeWeight: 2,
					strokeColor: "rgb(66, 133, 244)",
					fillColor: "rgba(53, 126, 244,0.1)"
				}); //建立多边形覆盖物
				map.addOverlay(ply); //添加覆盖物
			} else {
				window.ply.setPath(rs.boundaries[i]);
				map.addOverlay(ply); //添加覆盖物
			}
			ply.enableMassClear();
			pointArray = pointArray.concat(ply.getPath());
		}
		map.setViewport(pointArray); //调整视野
	});

}

//绘制详细楼盘点位信息
function getAllLabel() {
	map.clearOverlays();
	//模拟点位数据
	var labelListData = [{
			"name": "楼盘一",
			"code": "01",
			"longitude": "113.515919",
			"latitude": "34.799769",
			"num": "10000"
		},
		{
			"name": "楼盘二",
			"code": "02",
			"longitude": "113.509444",
			"latitude": "34.4475",
			"num": "999"
		},
		{
			"name": "楼盘三",
			"code": "03",
			"longitude": "113.68175",
			"latitude": "34.737633",
			"num": "888"
		},
		{
			"name": "楼盘四",
			"code": "04",
			"longitude": "113.280769",
			"latitude": "34.814961",
			"num": "777"
		},
		{
			"name": "楼盘五",
			"code": "05",
			"longitude": "113.611175",
			"latitude": "34.784972",
			"num": "666"
		},
		{
			"name": "楼盘六",
			"code": "06",
			"longitude": "113.609436",
			"latitude": "34.770558",
			"num": "555"
		},
		{
			"name": "楼盘七",
			"code": "07",
			"longitude": "113.687778",
			"latitude": "34.861111",
			"num": "444"
		},
		{
			"name": "楼盘八",
			"code": "08",
			"longitude": "113.333333",
			"latitude": "34.833333",
			"num": "333"
		},
		{
			"name": "楼盘九",
			"code": "09",
			"longitude": "114.0537",
			"latitude": "34.7273",
			"num": "222"
		},
		{
			"name": "楼盘十",
			"code": "10",
			"longitude": "113.419642",
			"latitude": "34.809192",
			"num": "111"
		},
		{
			"name": "楼盘十一",
			"code": "11",
			"longitude": "113.068653",
			"latitude": "34.382344",
			"num": "1111"
		},
		{
			"name": "楼盘十二",
			"code": "12",
			"longitude": "113.1491",
			"latitude": "34.389",
			"num": "2222"
		}
	];
	$.each(labelListData, function(index, data) {
		var point = new BMap.Point(data.longitude, data.latitude);
		var myLabel = new BMap.Label("", {
			position: point, //label 在此处添加点位位置信息
			offset: new BMap.Size(-12, -15)
		});
		myLabel.setStyle({
			width: "30px", //宽
			height: "30px", //高度
			border: "0", //边
			backgroundColor: "rgb(66, 133, 244)",
			borderRadius: "50%",
			cursor: "pointer"
		});
		myLabel.setTitle(data.name);
		labelData.push(myLabel);
		// map.addOverlay(myLabel);
		//信息窗口模板
		var tpl = "<div class='infoBox' data-longitude='" + data.longitude + "' data-latitude='" + data.latitude +
			"' data-id='" + data.code + "'>" +
			"<div class='infoArea'><p class='name'>" + data.name +
			"</p><p class='num'>均价<a href='https://www.baidu.com'><span class='red'> " + data.num +
			" </span></a>万元/m3</p></div>" +
			"<i class='arrow'><i class='arrow-i'></i></i></div>";
		var infoBox = new BMapLib.InfoBox(map, tpl, {
			boxStyle: {
				width: "300px",
				minHeight: "100px",
				marginBottom: "50px",
				backgroundColor: "white"
			},
			closeIconMargin: "15px 10px 4px 4px",
			closeIconUrl: "img/icon-close.png",
			enableAutoPan: false,
			align: INFOBOX_AT_TOP
		});
		//鼠标点击时打开新标签并关闭上一个标签内容
		myLabel.addEventListener("click", function() {
			if (window.lastInfoBox) {
				//判断上一个窗体是否存在，若存在则执行close
				window.lastInfoBox.close();
			}
			window.lastInfoBox = infoBox;
			infoBox.open(point);
		});
	});
	addViewLabel(labelData); //加载可视范围点
}

// 根据地图视野动态加载数据，当数据多时此方法用来提高地图加载性能
// 由于此篇模拟点位数据较少，视野加载不明显，当数据多时可直观感觉
function addViewLabel(labels) {
	map.clearOverlays();
	for (var i = 0; i < labels.length; i++) {
		var result = BMapLib.GeoUtils.isPointInRect(labels[i].point, map.getBounds());
		if (result == true) {
			map.addOverlay(labels[i])
		} else {
			map.removeOverlay(labels[i]);
		}
	}
}
