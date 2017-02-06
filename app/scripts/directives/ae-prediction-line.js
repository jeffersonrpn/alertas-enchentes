(function() {
  'use strict';

  angular.module('alertasEnchentesApp')
    .directive('aePrediction', aePrediction);

    aePrediction.$inject = [];

    /*jshint latedef: nofunc */
    function aePrediction() {
      return {
        template: '<svg></svg>',
        restrict: 'E',
        scope: {
          river: '='
        },
        link: function postLink(scope, element) {
          var d3noConflict = d3;

          var
            margin = {
              top: 50,
              right: 0,
              bottom: 30,
              left: 0
            },
            width = 600 - margin.left - margin.right,
            height = 160 - margin.top - margin.bottom,
            viewBoxWidth = width + margin.left + margin.right,
            viewBoxHeight = height + margin.top + margin.bottom,
            baseValue = 0,
            tooltipWidth = 50,
            tooltipHeight = 30;

            var x = d3noConflict.time.scale()
                .rangeRound([0, width]);
            var y = d3noConflict.scale.linear()
                .range([height, 0]);
            var valuearea = d3noConflict.svg.area()
                .x(function(d) { return x(d.timestamp); })
                .y1(function(d) { return y(d.measured); });
            var valueline = d3noConflict.svg.line()
              .x(function(d) { return x(d.timestamp); })
              .y(function(d) { return y(d.measured); });
            var xAxis = d3noConflict.svg.axis()
                .scale(x)
                .orient("bottom");
            var yAxis = d3noConflict.svg.axis()
                .scale(y)
                .orient("left");

          var svg = d3noConflict.select("svg")
            .attr({
              'class': 'timeline-chart',
              'version': '1.1',
              'viewBox': '0 0 '+viewBoxWidth+' '+viewBoxHeight,
              'width': '100%'})
            .append("g")
              .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

          // Draw lines
          var lines = svg.append("g").attr("class", "lines");
          var area = svg.append("g").attr("class", "area");

          var alertLine = lines.append("line")
            .attr({
              "x1": margin.right*2,
              "x2": width-margin.left*2,
              "fill": "none",
              "stroke-width": "2px",
              "opacity": 0.5,
              "stroke-dasharray": "10,5",
              "stroke": color("ALERTA")
            });
          var alertText = lines.append("text")
            .attr({
              "x": margin.right*2,
              "fill": color("ALERTA"),
              "opacity": 0.5,
              "font-size": "10",
              "font-family": "sans"
            })
            .text("Nível de alerta");
          var floodLine = lines.append("line")
            .attr({
              "fill": "none",
              "x1": margin.right*2,
              "x2": width-margin.left*2,
              "stroke-width": "2px",
              "opacity": 0.5,
              "stroke-dasharray": "10,5",
              "stroke": color("INUNDACAO")
            });
          var floodText = lines.append("text")
            .attr({
              "x": margin.right*2,
              "fill": color("INUNDACAO"),
              "opacity": 0.5,
              "font-size": "10",
              "font-family": "sans"
            })
            .text("Nível de enchente");

          scope.$watch(function(scope) { return scope.river; }, function(newValue) {
            if (typeof newValue !== 'undefined' && newValue.data) {
              draw(newValue);
            }
          });

          function draw(river) {
            if (river.data.length < 1)  return;

            var data = river.data;
            var hasPrediction = 0;
            data.forEach(function(d) {
              if (d.predicted) {
                d.predicted = +d.predicted;
                hasPrediction++;
              }
            });

            if (!hasPrediction) {
              lines.attr('display', 'none');
              return;
            } else {
              lines.attr('display', 'block');
            }

            var domainMin = d3noConflict.min(data, function(d) { return d.measured; });
            var domainMax = d3noConflict.max(data, function(d) { return d.measured; });
            if (domainMax < river.info.floodThreshold) {
                var domainMax = river.info.floodThreshold;
            }
            console.log(domainMin, domainMax);
            x.domain(d3.extent(data, function(d) { return d.timestamp; }));
            y.domain([domainMin, domainMax]);
            valuearea.y0(y(0));

            alertLine.attr({
              // "y1": y(river.info.warningThreshold),
              // "y2": y(river.info.warningThreshold)
              "y1": y(0),
              "y2": y(0)
            });
            alertText.attr({
              "y": y(river.info.warningThreshold) + 12,
            });
            floodLine.attr({
              "y1": y(river.info.floodThreshold),
              "y2": y(river.info.floodThreshold),
            });
            floodText.attr({
              "y": y(river.info.floodThreshold) - 4,
            });

            area.append("path")
              .datum(data)
              .attr("class", "area")
              .attr("d", valuearea);
            area.append("path")
              .datum(data)
              .attr("class", "line")
              .attr("d", valueline);

            area.append("g")
              .attr("transform", "translate(0," + height + ")")
              .attr("class", "x axis")
              .call(xAxis);
          }

          function color(measuredStatus) {
            switch (measuredStatus) {
              case "NORMAL":
                return "#1878f0";
                break;
              case "ALERTA":
                return "#faea59";
                break;
              case "INUNDACAO":
                return "#eb533e";
                break;
              default:
                return "#1878f0";
            }
          }


        }
      };
    }
})();