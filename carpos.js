////////////////////////////////////////////////////////
//<!-- 	Author:  Giovambattista Vieri 
//	Copyright: 2015 Giovambattista Vieri All rights reserved.
//	License: Apache Public license https://www.apache.org/licenses/LICENSE-2.0.html, GPL v2, 	
//	So you can choose the license (listed above) that you likes more. 
//
//	If you want another license let me know at https://github.com/gvieri/CarPos
//
//-->	
		$(document).ready(function() {
			var mappa; 
			var popup; 
			var initLat;
			var initLng; 
			var initZoom;		
			var maxZoom=18;	
			var osmId= 'examples.map-i875mjb7';
			var lastCenterPosition;
			var marker=null; 
			var markerPos;
			var markerMsg;
			var circle=null; 
			var myControl;
			var splahDialog; 

			L.Control.myControl = L.Control.extend({
				options: {
					position: 'bottomleft',
					centerOnMarkerText: 'CM',
					centerOnMarkerTitle: 'center on marker',
					addMarkerOnGPSText: 'AG',
					addMarkerOnGPSTitle: 'add marker on gps position',
					resetText: 'RST',
					resetTitle: 'reset, delete marker',
					centerOnGPSText: 'CG',
					centerOnGPSTitle: 'center on gps position',
					helpText: 'H',
					helpTitle: 'Help'
				},
				onAdd: function (map) {
					this._map= map; 
					var controlName = 'gin-control-zoom',
					container = L.DomUtil.create('div', controlName + ' leaflet-bar'),
					options = this.options;

					this._centerOnGPSButton = this._createButton(options.centerOnGPSText, options.centerOnGPSTitle,
						controlName + '-home', container, this._centerOnGPS);
					this._addMarkerOnGPSButton = this._createButton(options.addMarkerOnGPSText, options.addMarkerOnGPSTitle, controlName + '-home', container, this._addMarkerOnGPS);
					this._resetButton = this._createButton(options.resetText, options.resetTitle, controlName + '-home', container, this._resetAll);
					this._centerOnMarkerButton = this._createButton(options.centerOnMarkerText, options.centerOnMarkerTitle, controlName + '-home', container, this._centerOnMarker);
					this._helpButton = this._createButton(options.helpText, options.helpTitle, controlName + '-home', container, this._help);
					
					

					this._updateDisabled();
					map.on('zoomend zoomlevelschange', this._updateDisabled, this);

					return container;
				    },

				onRemove: function (map) {
					map.off('zoomend zoomlevelschange', this._updateDisabled, this);
				    },

				_centerOnGPS: function (e) { 
					this._map.locate({setView: true, maxZoom: 16, enableHighAccuracy: true});
					
				    },

				_centerOnMarker: function (e) { 

				    },


				_addMarkerOnGPS: function (e) { 

					
				    },
				_resetAll: function (e) { 

				    },
				_help: function (e) { 

				    },

				_createButton: function (html, title, className, container, fn) {
					var link = L.DomUtil.create('a', className, container);
					link.innerHTML = html;
					link.href = '#';
					link.title = title;

					L.DomEvent.on(link, 'mousedown dblclick', L.DomEvent.stopPropagation)
					    .on(link, 'click', L.DomEvent.stop)
					    .on(link, 'click', fn, this)
					    .on(link, 'click', this._refocusOnMap, this);

					return link;
				    },



			    	_updateDisabled: function () {
					var map = this._map,
			    		className = 'leaflet-disabled';

			   	}	
			});

			function saveMap() { 
				localStorage.setItem("initLat", initLat);
				localStorage.setItem("initLng", initLng);
				localStorage.setItem("initZoom", mappa.getZoom() );
				localStorage.setItem("markerPos",JSON.stringify(markerPos));
				localStorage.setItem("markerMsg",JSON.stringify(markerMsg));
				
		
			} 

			function restoreMap() {
				initLat= localStorage.getItem("initLat");
				initLng= localStorage.getItem("initLng");
				initZoom=localStorage.getItem("initZoom");
				try { 
					markerMsg=JSON.parse(localStorage.getItem("markerMsg"));
					markerPos=JSON.parse(localStorage.getItem("markerPos"));
				} catch (e) { 



					markerPos="deleted"; 
					markerMsg=""; 
				} 
				if((initLat==null) && (initLng==null)) { 
					initLat=41.954;
					initLng=12.547;
					initZoom=13;
				}

			}

			function initMap() { 
				restoreMap();
				mappa= L.map('mappetta', {}).setView([initLat,initLng],initZoom);
				L.tileLayer('http://otile1.mqcdn.com/tiles/1.0.0/osm/{z}/{x}/{y}.png', {
					attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, ' +
						'<a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
						'',
					maxZoom: maxZoom,
				}).addTo(mappa);

				if(markerPos!="deleted")  {
					marker=L.marker( markerPos).on('click',onClickMarker);
					setTimeout(function() {
					marker.addTo(mappa); 
					 },20)
				}
			}


			function onLocationFound(e) {
				var radius = Math.floor(e.accuracy / 2);
				if (circle!=null) {
					mappa.removeLayer(circle);
				} 
				circle=L.circle(e.latlng, radius).addTo(mappa);
				poppup
                                        .setLatLng(e.latlng)
					.setContent("You are here <p>in about" + radius + " meters from this point")
					.openOn(mappa);
				lastCenterPosition= e.latlng;
				
				setTimeout(function(){ popupDown(); }, 6000);

				
			}
			function popupDown() { 
				mappa.removeLayer(poppup); 
				
			}

			function onLocationError(e) {
				alert(e.message);
			}

			function addMarkerOnGPS(e)  {
				var d,n ;
				d=new Date(); 
				n=d.toString();
				if(marker!=null) { 
					mappa.removeLayer(marker);
				}
				markerMsg=n;
				markerPos=lastCenterPosition;
				marker=L.marker( lastCenterPosition).on('click',onClickMarker);
				marker.addTo(mappa); 
				saveMap();


			}	

			function onClickMarker(e) {
				mappa.removeLayer(e.target);
				delete(e.target.mymarker);
				delete marker; 
				margerMsg="deleted";
				markerPos="deleted";
				saveMap();
				
			}

			function resetAll(e) { 
				if(marker!=null) { 
					mappa.removeLayer(marker);
				}
				if(circle!=null) { 
					mappa.removeLayer(circle);
				}
				delete marker; 
				margerMsg="deleted";
				markerPos="deleted";
				saveMap();
			}


			function centerOnMarker (e){ 
				var z= mappa.getZoom() ;
				if ((markerPos!= "deleted") && (marker !=null)) { 
					mappa.setView(markerPos,z) ;
				}
			}

			function help (e) {
var dia= bootbox.dialog({
title: "CarRtrv - &copy 2015 Giovambattista Vieri",
message: "<ul><h2>List of available commands</h2><li>CG center map on GPS and, draw a circle related with the position on the map</li><li>AG add marker to map. The marker il added to the position present on the map</li><li>RST reset delete both position and marker</li><li>CM center map on marker </li><li>H help</li> </ul><BR>Start pressing CG and then wait until the actual position is shown on the map.<BR> The position will be shown by a circle wich diameter is related to the precision of the calculated position. <BR>After that you can add a marker to the current position. This marker will be (hopefully) stored in your browser. In this way, you will find the marker shown on the map hte next times that you will visit the page.<br>RST is usefull if you need to delete the marker. ",
buttons: {
main: {
label: "Close",
size: 'large',
className: "btn-primary",
callback: function() {
}
}
}
}); 
return(dia);
			}
			initMap(); 
			mappa.on('locationfound', onLocationFound);
			mappa.on('locationerror', onLocationError);

			poppup = L.popup(); 
		
			mappa.locate({setView: true, maxZoom: 16, enableHighAccuracy: true});
			myControl= new L.Control.myControl(); 
			myControl._addMarkerOnGPS= function (e) { addMarkerOnGPS(e) ; } ;
			myControl._centerOnMarker= function (e) { centerOnMarker(e) ; } ;
			myControl._resetAll= function (e) { resetAll(e) ; } ;
			myControl._help= function (e) { help(e) ; } ;
			myControl.addTo(mappa);
			splashDialog=help();
			setTimeout(function(){ splashDialog.modal('hide') }, 6000);

		});
	
