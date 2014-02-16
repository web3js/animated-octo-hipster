// namespace for marker control
myApp = {
	map : '',
	renderMap : function() {
		// initial config
		console.log(this);
		var config = {
			baselayer: new L.StamenTileLayer('terrain'),
			initLatLng: new L.LatLng(40.3025, -121.2347),
			initZoom: 5,
			minZoom: 4,
			maxZoom: 16,
			zoomControl: true,
			attributionControl: false
		};
		// initialize map
		this.map = L.map('map', {minZoom: config.minZoom, maxZoom: config.maxZoom, zoomControl: true, attributionControl: false});
		// add the Stamen base layer to the map 
		this.map.addLayer(config.baselayer);
		// set init map center and zoom
		this.map.setView(config.initLatLng, config.initZoom);
	},

	fetchData : function() {
		//Load the POI data
		var poiStyle = {
			title: 'point of interest',
		}, 
		features, 
		len, 
		i,
		lat,
		lon,
		poi,
		markers;

		$.getJSON('data/pct-poi-subset.geojson', function(data){
			console.log('geojson data for POI\'s loaded');
			console.log('POI data.features: ', data.features	);

			features = data.features;
			len = features.length;
			console.log('Fetch data says: features: ', features, ' len is: ', len);
			
			for (i=0; i<len; i++){
				lat = features[i].geometry.coordinates[1];
				lon = features[i].geometry.coordinates[0];
				poi = new L.MakiMarkers.icon({
					icon: "star",
					color: "#b0b",
					size: "s"
				});
				
				markers = new L.Marker([lat,lon],{
					icon: poi
				}).bindPopup("<b>Point of Interest</b>");	
				myApp.map.addLayer(markers);
			}
		});
		$.getJSON("data/pct.geojson", function(data) {
			
			console.log("geojson for pct trail loaded");
			// styles to pass to 
			var myStyle = {
				"color": "#9400ff",
				"weight": 4,
				"opacity": 0.7,
				"smoothFactor": 2
			};
			// array to store lat lon values for animatedMarker
			var temp = [];
			// loop through geojson data and push the lat lon values to line array
			for (d in data) {
				console.log('fetchdata getting pct.geojson says: ', data);
				var i = 0,
					len = data.features.length;
				for (i; i < len; i ++){
					//console.log(data.features[i])
					var j = 0,
						coordinates = data.features[i].geometry.coordinates,
						cLen = coordinates.length;
					for (j; j<cLen; j++){
						//console.log(coordinates[j]);
						var reverseCoordinates = [];

						//reverse the order of lat lon as leaflet reads lon then lat
						reverseCoordinates.push(coordinates[j][1]);
						reverseCoordinates.push(coordinates[j][0]);
						temp.push(reverseCoordinates);
					}
				}
			}
			
			// add pct lat lon points for the marker to animate
			//debugger;
			var line = L.polyline(temp);
			animatedMarker = L.animatedMarker(line.getLatLngs(), {
					autoStart: false,
					distance: 2000,
					interval: 1000
				});
			myApp.map.addLayer(animatedMarker);


			//When GeoJSON is loaded
			var geojsonLayer = L.geoJson(data, {
					style: myStyle
				}).addTo(myApp.map); //Add layer to map	

			// grab the animated marker lat lon values (note: they are constantly changing)
			console.log(animatedMarker['_latlng'].lat);
			console.log(animatedMarker['_latlng'].lng);
			console.log(animatedMarker);

			// start browser panning interactivity:
			myApp.onScroll();

			// .on = action is turned on .off = action is turned off
			animatedMarker.on('move', myApp.onMove);
			
		});


	},


	coordinates : { //arbitrary right now for testing
		start: [-116.46694979146261, 32.589707],
		one : [-116.46705135909554, 32.59186023381822],
		two : [-116.46672634267014, 32.59659328551297],
		three : [-116.4696108634455, 32.59894965459705]
	},

	markerRun: false,

	start : function(){
		if (!this.markerRun){
			animatedMarker.start();
		}
	},
	stop : function(){
		if (this.markerRun){
			animatedMarker.stop();
		}		
	},

	pan : function() {
		var fps = 100;
		setInterval(function(){
			map.panTo({lon: animatedMarker['_latlng'].lng, lat: animatedMarker['_latlng'].lat})
		},fps)
	},

	zoomIn : function(factor){
		map.zoomIn(factor);
	},

	zoomOut : function(factor){
		map.zoomOut(factor);
	},

	onScroll : function() {
		console.log('this.coordinates.one[0]: ' + myApp.coordinates.one[0]);
	
		$('#wp1').waypoint(function(direction) {

			switch(direction){
				case 'down' :					
					//animatedMarker.setLatLng({lat: markerCntrl.coordinates.start[1], lon: markerCntrl.coordinates.start[0]})				
					myApp.map.zoomIn(6);
					myApp.start();
			  		var fps = 100,
						panTo = setInterval(function(){
							myApp.map.panTo({lon: animatedMarker['_latlng'].lng, lat: animatedMarker['_latlng'].lat})
						},fps);
					myApp.markerRun = true;
					break;
				case 'up' :
					myApp.map.zoomOut(6)
					myApp.stop();
					myApp.markerRun = false;
					//animatedMarker.setLatLng({lat: markerCntrl.coordinates.start[1], lon: markerCntrl.coordinates.start[0]})
					break;
			}

		}, {offset: 100});

	},

	onMove : function(e){
		var lat1 = myApp.coordinates.one[1],
			lng1 = myApp.coordinates.one[0];
		myApp.checkMapBounds(e, lat1, lng1);
	},
	checkMapBounds : function(e, lat1, lng1) {
		if (e.latlng.lng === lng1 && e.latlng.lat === lat1){
			alert("whoa!"); //works
			console.log("lat lon check worked!");
			//animatedMarker.setLatLng({lat: lat1, lon: lng1}); // works but then animateMarker.start() won't work
			
			myapp.stop(); // doesn't work, not sure why. Possibly due to a conflict with JQuery Waypoints?
			
			// thought this was working but apparently not
			e.latlng.lat = lat1;
			e.latlng.lng = lng1;

			myApp.markerRun = false;
		}	
	},
	init : function() {
		console.log('here we go');
		//draw map
		myApp.renderMap();
		myApp.fetchData();
		//async load geo data
		//attach scroll events
		//start tracking the marker for lat/long pos
	}
}

window.onload = myApp.init;
