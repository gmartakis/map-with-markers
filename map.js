 
var gmarkers = [];
    var gicons = [];
    var map = null;
    
    var Athens = new google.maps.LatLng(37.90465769755854, 23.772354125976562);
    
    var infowindow = new google.maps.InfoWindow({
        size: new google.maps.Size(750,550),
        maxWidth: 1500
    });
    
    gicons["red"] = new google.maps.MarkerImage("mapIcons/marker_red.png",
    // This marker is 20 pixels wide by 34 pixels tall.
    new google.maps.Size(20, 34),
    // The origin for this image is 0,0.
    new google.maps.Point(0,0),
    // The anchor for this image is at 9,34.
    new google.maps.Point(9, 34));
    // Marker sizes are expressed as a Size of X,Y
    // where the origin of the image (0,0) is located
    // in the top left of the image.
    // Origins, anchor positions and coordinates of the marker
    // increase in the X direction to the right and in
    // the Y direction down.
    
    var iconImage = new google.maps.MarkerImage('mapIcons/marker_red.png',
    // This marker is 20 pixels wide by 34 pixels tall.
    new google.maps.Size(20, 34),
    // The origin for this image is 0,0.
    new google.maps.Point(0,0),
    // The anchor for this image is at 9,34.
    new google.maps.Point(9, 34));
    
    var iconShadow = new google.maps.MarkerImage('http://www.google.com/mapfiles/shadow50.png',
    // The shadow image is larger in the horizontal dimension
    // while the position and offset are the same as for the main image.
    new google.maps.Size(37, 34),
    new google.maps.Point(0,0),
    new google.maps.Point(9, 34));
    // Shapes define the clickable region of the icon.
    // The type defines an HTML &lt;area&gt; element 'poly' which
    // traces out a polygon as a series of X,Y points. The final
    // coordinate closes the poly by connecting to the first
    // coordinate.
    
    var iconShape = {
        coord: [9,0,6,1,4,2,2,4,0,8,0,12,1,14,2,16,5,19,7,23,8,26,9,30,9,34,11,34,11,30,12,26,13,24,14,21,16,18,18,16,20,12,20,8,18,4,16,2,15,1,13,0],
        type: 'poly'
    };
    
    function getMarkerImage(iconColor) {
        if ((typeof(iconColor)=="undefined") || (iconColor==null)) {
            iconColor = "red";
        }
        
        if (!gicons[iconColor]) {
            gicons[iconColor] = new google.maps.MarkerImage("mapIcons/marker_"+ iconColor +".png",
            // This marker is 20 pixels wide by 34 pixels tall.
            new google.maps.Size(20, 34),
            // The origin for this image is 0,0.
            new google.maps.Point(0,0),
            // The anchor for this image is at 6,20.
            new google.maps.Point(9, 34));
        }
        
        return gicons[iconColor];
    }
    
    function category2color(category) {
        var color = "red";
        switch(category) {
            case "theatre": color = "blue";
            break;
            case "golf": color = "green";
            break;
            case "info": color = "yellow";
            break;
            default: color = "red";
            break;
        }
        return color;
    }
    
    gicons["theatre"] = getMarkerImage(category2color("theatre"));
    gicons["golf"] = getMarkerImage(category2color("golf"));
    gicons["info"] = getMarkerImage(category2color("info"));
    
    // A function to create the marker and set up the event window
    function createMarker(latlng,name,html,category,region, municipal) {
        var contentString = html;
        var marker = new google.maps.Marker({
            position: latlng,
            //icon: gicons[category],
            //shadow: iconShadow,
            map: map,
            title: name,
            zIndex: Math.round(latlng.lat()*-100000)<<5
        });
        
        // === Store the category and name info as a marker properties ===
        marker.mycategory = category;
        marker.myregion = region;
        marker.mymunicipal = municipal;                                  
        marker.myname = name;
        gmarkers.push(marker);
        
        google.maps.event.addListener(marker, 'click', function() {
            infowindow.setContent(contentString); 
            infowindow.open(map,marker);
        });
    }
    
    function handleSelected(opt) {
        var i = opt.selectedIndex - 1;
        var selectedCat = opt.value; 
        
        if (i > -1) {
            show(selectedCat);
        }
        else {
            infowindow.close();
        }
    }
    
    function handleRegion(opt) {
        var i = opt.selectedIndex - 1;
        var selectedCat = opt.value; 
        
        if (i > -1) {
            showRegion(selectedCat);
        	feedMunicipality(selectedCat);
        }
        else {
            infowindow.close();
        }
    }
    
    function feedMunicipality(test)
    {
    	var emptyArray = [];
    	var uniqueArray = [];
    	var theResult;
    	if (test){
    		for (var i=0; i < gmarkers.length; i++) {
    			if (gmarkers[i].myregion == test) {
    				emptyArray.push(gmarkers[i].mymunicipal);
    			}
    		}
    		uniqueArray = GetUnique(emptyArray);
    		theResult = renderOptionValues(uniqueArray);
    		setVisibilityMinicipalFieldTrue();
    		renderMunicipalLinks(theResult);
    		
    		//console.log(uniqueArray);

    	}else{
    		return null;
    	}
    	
    	
    }
    
    function handleMunicipal(opt) {
        var i = opt.selectedIndex - 1;
        var selectedCat = opt.value; 
        
        if (i > -1) {
            showMunicipal(selectedCat);
        }
        else {
            infowindow.close();
        }
    }
    
    // == shows all markers of a particular category, and ensures the checkbox is checked ==
    function show(category) {
    	hide();
    	if (category) {
    		for (var i=0; i<gmarkers.length; i++) {
    			if (gmarkers[i].mycategory == category) {
    				gmarkers[i].setVisible(true);
    				map.panTo(gmarkers[i].getPosition());
    			}
    		}
    	}else{
    		for (var i=0; i<gmarkers.length; i++) {
    			gmarkers[i].setVisible(true);    			
    		}
    	}
    }
    
    function showRegion(filter) {
    	hide();
    	if (filter){
    		for (var i=0; i<gmarkers.length; i++) {
    			if (gmarkers[i].myregion == filter) {
    				gmarkers[i].setVisible(true);
    				map.panTo(gmarkers[i].getPosition());
    			}
    		}
    	}else{
    		for (var i=0; i<gmarkers.length; i++) {
    			gmarkers[i].setVisible(true);    			
    		}
    	}    	
    }
    
    function showMunicipal(filterMun) {
    	hide();
    	if (filterMun){
    		for (var i=0; i<gmarkers.length; i++) {
    			if (gmarkers[i].mymunicipal == filterMun) {
    				gmarkers[i].setVisible(true);
    				map.panTo(gmarkers[i].getPosition());
    			}
    		}
    	}else{
    		for (var i=0; i<gmarkers.length; i++) {
    			gmarkers[i].setVisible(true);    			
    		}
    	}    	
    }
    
    
    function renderRegionLinks(katitis){
    	
    	var regionDiv = document.getElementById("map_region_links");
    	regionDiv.innerHTML = '<option selected="selected"> Επιλέξτε γεωγραφικό διαμέρισμα: </option>' +  katitis; 
    	
    }
    
    function renderMunicipalLinks(katitis){
    	
    	var regionDiv = document.getElementById("map_municipal_links");
    	
    	regionDiv.innerHTML =  '<option selected="selected"> Επιλέξτε περιοχή: </option>' + katitis; 
    	
    }
    
    function setVisibilityMinicipalFieldTrue()
    {
    	$('#map_municipal_links').show();
    }
    
    function setVisibilityMinicipalFieldFalse()
    {
    	$('#map_municipal_links').hide();
    }
    
    // == hides all markers of a particular category, and ensures the checkbox is cleared ==
    function hide(category) {
        if (category) {
            for (var i=0; i<gmarkers.length; i++) {
                if (gmarkers[i].mycategory == category) {
                    gmarkers[i].setVisible(false);
                }
            }
        } else {
            for (var i=0; i < gmarkers.length; i++) {
                gmarkers[i].setVisible(false);
            }
        }
        // == close the info window, in case its open on a marker that we just hid
        infowindow.close();
    }
    
    function myclick(i) {
        google.maps.event.trigger(gmarkers[i],"click");
    }
    
    function initialize() {
        
        var MapDiv = document.getElementById("map_canvas");
        
        var myOptions = {
            zoom: 6,
            center: Athens,
            disableDefaultUI: true,
            mapTypeId: google.maps.MapTypeId.ROADMAP
            };
        
        map = new google.maps.Map(MapDiv, myOptions);
        
        google.maps.event.addListener(map, 'click', function() {
            infowindow.close();
        });
        
        setVisibilityMinicipalFieldFalse();
        
        var addRegionArray = [];
        var addMunicipalArray = [];
      	var uniqueRegion;
      	var uniqueUnicipal;
      	
      	var prev; 
      	var count = 0;
      	var viewHelper;
      	var viewHelperMun; 
        
        // Loading the XML File
        downloadUrl("/xml/network.xml", function(doc) {
            var xml = doc.responseXML;
            var markers = xml.documentElement.getElementsByTagName("marker");
            
            for (var i = 0; i < markers.length; i++) 
            {
                // obtain the attribues of each marker
                var name = markers[i].getAttribute("name");
                var salesaddress = markers[i].getAttribute("sales-address");
                var serviceaddress = markers[i].getAttribute("service-address");
                
                var region = markers[i].getAttribute("region");
                var zip = markers[i].getAttribute("postcode");                
                var prefecture = markers[i].getAttribute("prefecture");
                var municipal = markers[i].getAttribute("municipal");
                
                var callingcode = markers[i].getAttribute("callingcode");
                
                var phone1 = markers[i].getAttribute("phone1");
                var phone2 = markers[i].getAttribute("phone2");
                var fax1 = markers[i].getAttribute("fax1");
                var fax2 = markers[i].getAttribute("fax2");                
                
                var email = markers[i].getAttribute("email");
                var website = markers[i].getAttribute("website");
                
                var sales = markers[i].getAttribute("sales");
                var service = markers[i].getAttribute("service");
                var parts = markers[i].getAttribute("parts");
                
                var type = (sales == true && service == true)?'vertical':((sales == true && service !== true)?'sales':'service');                
                var category = '';
                
                var point = new google.maps.LatLng(
                parseFloat(markers[i].getAttribute("lat")),
                parseFloat(markers[i].getAttribute("lon"))
                );
                
                var html = '<div class="infoBox">';
                html += '<div class="dealer-box"><div class="box-infos scroll-custom"><div class="box-desc"><p class="dealer-name">'+name+'</p>';
                if (type == 'vertical' || type == 'sales'){
                    html +='<p>'+salesaddress+'<br>';                    
                } else {
                    html +='<p>'+serviceaddress+'<br>';
                }
                html += zip + ', '+ municipal+'</p>';
                html += '<p>Τηλ: '+callingcode+'.'+phone1+', '+phone2+'<br>'+'Fax: '+callingcode+'.'+fax1+', '+fax2+'<br><br>';                
                html += '</p>';
                html += (sales == true)?'<p>Έκθεση: <img src="http://www.nissan.gr/skin/images/common/valid.png" border="0"></p>':'';
                html += (service == true)?'<p>Συνεργείο: <img src="http://www.nissan.gr/skin/images/common/valid.png" border="0"></p>':'';
                html += (parts == true)?'<p>Ανταλλακτικά: <img src="http://www.nissan.gr/skin/images/common/valid.png" border="0"></p>':'';
                if(email === null || email === '')
                {
                	
                }else
                {
                	html +='<p>Email: <a class="std-lk" href="mailto:'+email+'">'+email+'</a><br></p>';
                }
                if(website === null || website === '')
                {
                	
                }else
                {
                	html +='<ul><li><span class="lk-text"></span><a class="lk-1" href="//'+website+'" target="_blank">VISIT THE DEALER-WEBSITE</a></li></ul>';
                }
                //html += (null !== email)?'<p>Email: <a class="std-lk" href="mailto:'+email+'">'+email+'</a><br></p>':'';
                //html += (null !== website)?'<ul><li><span class="lk-text"></span><a class="lk-1" href="//'+website+'" target="_blank">VISIT THE DEALER-WEBSITE</a></li></ul>':'';
                html += '</div><!-- end .box-desc --></div><!-- end .box-infos -->';
                html += '</div><!-- end .dealer-box --></div><!-- end .infoBox -->';
                
                var prev;
                
                var marker = createMarker(point,name,html,category,region, municipal);
                
                addRegionArray.push(region);
                
              }
            
            uniqueRegion = GetUnique(addRegionArray);
            
            var stringRegionHelper = renderOptionValues(uniqueRegion);
            
            renderRegionLinks(stringRegionHelper);
            
           // == show or hide the categories initially ==
            hide();
            show();
           
           
           $('#sidebar > div > div > p > a').on('click', function(e)
		    {
		        initialize();
		    });
            
        });

    }
  
  function renderOptionValues(inputArray)
  {
  	if(inputArray.length > 0)
  	{
  		var viewHelper;
  		for(var i = 0; i < inputArray.length; i++)
			{
				viewHelper = viewHelper + '<option value="'+inputArray[i]+'">'+inputArray[i]+'</option>';
			}
		return	viewHelper;
	}else
	{
		return null;
	}		
  }  
    
  function GetUnique(inputArray)
	{
		var outputArray = [];
					
		for (var i = 0; i < inputArray.length; i++)
			{
				if ((jQuery.inArray(inputArray[i], outputArray)) == -1)
				{
					outputArray.push(inputArray[i]);
				}
			}
			
			outputArray.sort();
			return outputArray;
	}  
    
    
    function downloadUrl(url, callback) {
        var request = window.ActiveXObject ? new ActiveXObject('Microsoft.XMLHTTP') : new XMLHttpRequest;
        
        request.onreadystatechange = function() {
            if (request.readyState == 4) {
                request.onreadystatechange = doNothing;
                callback(request, request.status);
            }
        };
        
        request.open('GET', url, true);
        request.send(null);
    }
    
    function addCities(map) {
        var dropdown = document.getElementById('selection');
        map.controls[google.maps.ControlPosition.TOP_RIGHT].push(dropdown);     
    }
    
    function doNothing() {}
    
    google.maps.event.addDomListener(window, 'load', initialize);
