var pieChart = function() {

    "use strict";

    function pieChart(params) {
            if (!(this instanceof pieChart)) {
                    return new pieChart(params);
            }
            this.initialize.apply(this, arguments);
    }
    pieChart.prototype = {
        initialize: function (arg) {
            if (!arg.data) { console.log('Error! Missing data parameter.\npieChart( {data: ???} )'); };
            if (Array.isArray(arg.data) && arg.dataType === 'nameValue') { console.log('Error! Data is Array. Please remove parameter "dataType: nameValue".'); };
            if (!Array.isArray(arg.data) && arg.dataType !== 'nameValue') { console.log('Error! Please set dataType as "nameValue".'); };
            this.container = arg.container || '.pie-chart-container';
            this.data = arg.data;
            this.dataType = arg.dataType;
            this.size = arg.size || 330;
            this.tooltipPar = (typeof arg.tooltip == 'boolean') ? arg.tooltip : true;
            this.randomColors = arg.randomColors;
            this.midCircleSize = arg.midCircle ? arg.midCircle / 2 : .4;
            if (arg.colors && arg.colors.length) this.colors.list = arg.colors;
        },
        drawPie: function() {
            var randomColors = this.randomColors,
                colors = this.colors,
                size = this.size,
                midCircleSize = this.midCircleSize,
                tooltipPar = this.tooltipPar,
                data = this.data,
                dataType = this.dataType;
            //container
            var container = document.querySelector(this.container);
            if (!container) {
                console.log('Error! Container for chart not found.')
            }
            //create list buttons
            var listButtonsEl = document.createElement('ul');
                listButtonsEl.setAttribute('class', 'pie-chart-list-buttons');
                container.appendChild(listButtonsEl);
            //create svg
            var svgWrap = document.createElementNS( "http://www.w3.org/2000/svg","svg" );
                svgWrap.setAttributeNS(null, 'style', "width: "+ this.size +"px; height: " + this.size + "px");
                svgWrap.setAttribute('class', 'pie-chart');
                container.appendChild(svgWrap);
            //create tooltip
            if (tooltipPar === true)
            {
                var tooltip = document.createElement('div');
                    tooltip.setAttribute('class', 'pie-chart-tooltip');
                    tooltip.setAttribute('id', 'pieChartTooltip');
                    tooltip.style.display = "none";
                    container.appendChild(tooltip);
            }
            //create buttons and select colors
            var total = 0,
                listButtons = document.querySelector('.pie-chart-list-buttons'),
                buttonsItems = document.getElementsByClassName('pie-chart-button');

            if (dataType === 'nameValue') {
                var converData = [];
                for (var key in data) {
                    converData.push({
                        label: key,
                        value: data[key]
                    })
                }
                data = converData;
            }

            data.forEach(function(item, index, array) {
                item.color = randomColors ? colors.random() : colors.list[index];
                var newEl = document.createElement('button');
                newEl.innerText = item.label;
                newEl.setAttribute('data-name', item.label);
                newEl.setAttribute('class', 'pie-chart-button active');
                newEl.style.background = item.color;
                listButtons.appendChild(newEl);
                total += item.value;
            });

            //click button handler
            listButtons.addEventListener('click', function(e){
                if (e.target != e.currentTarget) {
                    var el = e.target,
                        name = el.getAttribute('data-name');

                    toggleActiveClass(el); 
                    drawChart();
                }
                e.stopPropagation();
            });
            //toggle class active on button
            var toggleActiveClass = function(el) {
                el.classList.toggle('active');
            }
            //get object by name from Data
            var getObject = function(name) {
                return data.find(function(item) {
                    return item.label == name;
                })
            };
            //
            var drawChart = function() {
                total = 0; 
                var item = {},
                    data = [];
                for (var i = 0, l = buttonsItems.length; i < l; i++) {
                    item = buttonsItems[i];
                    if (item.classList.contains('active')) {
                        total += getObject([item.getAttribute('data-name')]).value;
                        data.push(getObject([item.getAttribute('data-name')]));
                    };
                }
                clearPie();
                createPie(data, total);
            };

            function calculateSectors(data, total ) {
                var sectors = [];

                var r = size/2, //radius
                    a = 0, // Angle of sector
                    aRad = 0, // Angle in Rad
                    z = 0, // Size z
                    x = 0, // Side x
                    y = 0, // Side y
                    X = 0, // SVG X coordinate
                    Y = 0, // SVG Y coordinate
                    R = 0,
                    arcSweep = 0; // Rotation
                data.map(function(item, key ) {
                    a = 360 * item.value / total;
                    aRad = a * Math.PI / 180;
                    z = r * Math.sqrt(2 - 2*Math.cos(aRad));
                    if( a <= 90 ) {
                        x = r*Math.sin(aRad);
                    }
                    else if( a <= 180 ) {
                        x = r*Math.sin(Math.PI - aRad);
                    }
                    else {
                        x = r*Math.sin(aRad);
                    }
                    
                    y = Math.sqrt( z*z - x*x );
                    if (a === 0 || a === 360)
                    {
                        y = 0;
                        x-=.01;
                    }
                    Y = y;
                    X = r + x;
                    if( a <= 180 ) {
                        arcSweep = 0;
                    }
                    else {
                        arcSweep = 1;
                    }
                    sectors.push({
                        value: item.value,
                        label: item.label,
                        color: item.color,
                        arcSweep: arcSweep,
                        L: r,
                        X: X,
                        Y: Y,
                        R: R
                    });
                    R = R + a;
                });
                return sectors
            }

            var createPie = function(data, total) {
                var sectors = calculateSectors(data, total);  

                //create sectors
                sectors.map( function(sector) {

                    var newSector = document.createElementNS( "http://www.w3.org/2000/svg","path" );
                    newSector.setAttributeNS(null, 'fill', sector.color);
                    newSector.setAttributeNS(null, 'd', 'M' + sector.L + ',' + sector.L + ' L' + sector.L + ',0 A' + sector.L + ',' + sector.L + ' 1 ' + sector.arcSweep + ',1 ' + sector.X + ', ' + sector.Y + ' z');
                    newSector.setAttributeNS(null, 'transform', 'rotate(' + sector.R + ', '+ sector.L+', '+ sector.L+')');
                    if (tooltipPar === true) {
                        //on sector mouse
                        newSector.onmouseover = function(e) {
                            document.getElementById('pieChartTooltip').style.display='block';
                        };
                        //off sector mouse
                        newSector.onmouseout = function(e) {
                            document.getElementById('pieChartTooltip').style.display='none';
                        };
                        //move mouse
                        newSector.onmousemove = function(e) {
                            document.getElementById('pieChartTooltip').style.top = e.pageY + 5 + 'px';
                            document.getElementById('pieChartTooltip').style.left = e.pageX + 5 + 'px';
                            document.getElementById('pieChartTooltip').innerHTML = sector.label + ": " + sector.value;
                        };
                    }
                    svgWrap.appendChild(newSector);
                })
                if (midCircleSize !== false || midCircleSize != 0) {
                    var midCircle = document.createElementNS( "http://www.w3.org/2000/svg","circle" );
                    midCircle.setAttributeNS(null, 'cx', size * 0.5 );
                    midCircle.setAttributeNS(null, 'cy', size * 0.5);
                    midCircle.setAttributeNS(null, 'r', size * midCircleSize );
                    midCircle.setAttributeNS(null, 'fill', '#F4F3F2' );
                    svgWrap.appendChild(midCircle);
                }
            };

            var clearPie = function() {
                var items = document.getElementsByTagName("path");
                while (items.length) {
                        items[0].parentNode.removeChild(items[0]);
                }
                
                    document.getElementsByTagName("svg")[0].removeChild(document.getElementsByTagName("circle")[0]);            
            }

            createPie(data, total);
        },
        colors: {
            list: [ "#dd3652",
                    "#4fa622",
                    "#e43e79",
                    "#569933",
                    "#ea461e",
                    "#2c9c70",
                    "#d2422e",
                    "#408641",
                    "#aa4067",
                    "#476c1b",
                    "#ac4057",
                    "#a78d15",
                    "#b4464c",
                    "#828830",
                    "#c95549",
                    "#aa7b28",
                    "#893420",
                    "#d6791b",
                    "#92692b",
                    "#bd5d2d"
                ],
            random: function() {
                return this.list[Math.floor(Math.random() * (this.list.length))];
            }
        }
    };
    return pieChart;
        
} ();