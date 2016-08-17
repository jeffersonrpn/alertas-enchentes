"use strict";angular.module("alertasEnchentesApp",["ngAnimate","ngRoute","ngSanitize","ngTouch"]).config(["$routeProvider",function(a){a.when("/",{templateUrl:"views/main.html",controller:"MainCtrl",controllerAs:"main"}).when("/about",{templateUrl:"views/about.html",controller:"AboutCtrl",controllerAs:"about"}).otherwise({redirectTo:"/"})}]),angular.module("alertasEnchentesApp").controller("MainCtrl",function(){var a=function(){var a=new Date,b=a.getHours();a.getMinutes();return" "+b+":00"};this.now=a()}),angular.module("alertasEnchentesApp").controller("AboutCtrl",function(){this.awesomeThings=["HTML5 Boilerplate","AngularJS","Karma"]}),angular.module("alertasEnchentesApp").run(["$templateCache",function(a){a.put("views/about.html","<p>This is the about view.</p>"),a.put("views/main.html",'<section class="container-fluid headline"> <div class="container"> <h1 class="main-title text-right">Alerta de enchentes</h1> <h2 class="main-title-logo text-right"><img src="images/ia-white.2cc19e45.png" alt="Infoamazônia" width="150" height="32"></h2> <div class="row"> <div class="col-md-8"> <div class="map-info"> <div style="padding: 20px 20px 80px 40px; font:16px arial,helvetica,sans-serif"> <div style="font-size:22px; font-weight: bold">Rio Acre</div> <div>Quarta-feira, {{main.now}}</div> <img src="images/flood.a8fc565d.svg" alt="Flood" style="float: left; height: 90px; width: 64px"> <div style="padding-left:10px;float:left"> <div> <div style="float:left;margin-top:10px;font-size:60px"> <span>23h</span> </div> <div style="float:left;font-size:16px;margin-top:25px; margin-left: 12px"> <div style="font-size:22px">Alerta de enchente</div> <div>Ação evasiva é recomendada</div> </div> </div> </div> </div> <div> <div id="chart"></div> </div> </div> </div> </div> <!-- CHART  --> <style>.tick,\n      .domain {\n        color: #fff;\n        fill: #fff;\n        stroke: #fff;\n      }\n\n      .bar {\n        fill: #1878f0;\n        opacity: 0.4;\n        transition: opacity 0.5s;\n      }\n\n      .bar-top {\n        fill: #1878f0;\n      }\n\n      .bar-alert {\n        fill: #faea59;\n      }\n\n      .bar-flood {\n        fill: #eb533e;\n      }\n\n      .bar-value {\n        fill: #fff;\n        font-size: 1em;\n      }\n\n      .bar:hover {\n        opacity: 1;\n      }\n\n      .axis {\n        font: 10px sans-serif;\n      }\n\n      .axis path,\n      .axis line {\n        fill: none;\n        stroke: #000;\n        shape-rendering: crispEdges;\n      }\n\n      .x.axis path {\n        display: none;\n      }\n\n      .line {\n        fill: none;\n        stroke-width: 2px;\n        opacity: 0.4;\n        stroke-dasharray: 10;\n      }\n\n      .line-flood {\n        stroke: red;\n      }\n\n      .line-alert {\n        stroke: yellow;\n      }</style> <script>var margin = {\n            top: 20,\n            right: 20,\n            bottom: 100,\n            left: 40\n          },\n          width = 960 - margin.left - margin.right,\n          height = 250 - margin.top - margin.bottom,\n          viewBoxWidth = width + margin.left + margin.right,\n          viewBoxHeight = height + margin.top + margin.bottom,\n          baseValue = 100;\n\n      var x = d3.scale.ordinal()\n          .rangeRoundBands([0, width], 0);\n\n      var y = d3.scale.linear()\n          .range([height, 0]);\n\n      var xAxis = d3.svg.axis()\n          .scale(x)\n          .orient("bottom");\n\n      var yAxis = d3.svg.axis()\n          .scale(y)\n          .orient("left");\n\n      var svg = d3.select("#chart").append("svg")\n          .attr("width", "100%")\n          .attr("viewBox", "0 0 "+viewBoxWidth+" "+viewBoxHeight)\n        .append("g")\n          .attr("transform", "translate(" + margin.left + "," + margin.top + ")");\n\n      d3.tsv("data.tsv", type, function(error, data) {\n        if (error) throw error;\n\n        x.domain(data.map(function(d) { return d.hour; }));\n        y.domain([d3.min(data, function(d) { return d.quota; }), d3.max(data, function(d) { return d.quota; })]);\n\n        // svg.append("g")\n        //     .attr("class", "x axis")\n        //     .attr("transform", "translate(0," + height + ")")\n        //     .call(xAxis);\n\n        // svg.append("g")\n        //     .attr("class", "y axis")\n        //     .call(yAxis);\n\n        var line = svg.append("line")\n          .attr("class", "line line-alert")\n          .attr("x1", 0)\n          .attr("y1", y(1350))\n          .attr("x2", width)\n          .attr("y2", y(1350));\n\n        var line = svg.append("line")\n          .attr("class", "line line-flood")\n          .attr("x1", 0)\n          .attr("y1", y(1400))\n          .attr("x2", width)\n          .attr("y2", y(1400));\n\n        var bar = svg.selectAll(".bar")\n            .data(data);\n          // Render bars\n          bar.enter().append("rect")\n            .attr("class", function(d) { return "bar "+color(d.quota); })\n            .attr("x", function(d) { return x(d.hour); })\n            .attr("width", x.rangeBand())\n            .attr("y", function(d) { return y(d.quota); })\n            .attr("height", function(d) { return height - y(d.quota) + baseValue; });\n          // Render top bars\n          bar.enter().append("rect")\n            .attr("class", function(d) { return "bar-top "+color(d.quota); })\n            .attr("x", function(d) { return x(d.hour); })\n            .attr("width", x.rangeBand())\n            .attr("y", function(d) { return y(d.quota); })\n            .attr("height", 2);\n          // Render values\n          // bar.enter().append("text")\n          //   .attr("class", "bar-value")\n          //   .attr("x", function(d) { return x(d.hour)+x.rangeBand()/2; })\n          //   .attr("y", function(d) { return y(d.quota)-5; })\n          //   .attr("text-anchor", "middle")\n          //   .text(function(d) { return d.quota; });\n          bar.enter().append("text")\n            .attr("class", "bar-value")\n            .attr("x", function(d) { return x(d.hour)+x.rangeBand()/2; })\n            .attr("y", height + baseValue - 5)\n            .attr("text-anchor", "middle")\n            .text(function(d) { return d.hour; });\n\n      });\n\n      function type(d) {\n        d.quota = +d.quota;\n        return d;\n      }\n\n      function color(d) {\n        if (d < 1350) {\n          return "bar-normal";\n        } else if (d >= 1350 && d < 1400) {\n          return "bar-alert";\n        } else {\n          return "bar-flood";\n        }\n      }</script> <!-- /CHART --> </div></section> <section class="container-fluid section section-primary"> <div class="container"> <div class="form-card"> <h4 class="text-center">Quero receber alertas via Telegram<small>&copy;</small> ou Whatsapp<small>&copy;</small></h4> <br> <form> <div class="row"> <div class="col-sm-5 col-md-5"> <div class="form-group"> <input type="text" class="form-control" id="nome" placeholder="Nome"> </div> </div> <div class="col-sm-4 col-md-5"> <div class="form-group"> <input type="text" class="form-control" id="telefone" placeholder="Telefone"> </div> </div> <div class="col-sm-3 col-md-2"> <button type="submit" class="btn btn-block btn-success">Cadastrar-se</button> </div> </div> </form> </div> </div> </section> <section class="container-fluid section section-default"> <div class="container about text-center"> Sistema de alertas e notícias de enchentes <p> Nulla facilisi. Praesent sagittis tincidunt tortor, eget tristique leo finibus sed. Mauris in lacus volutpat, pellentesque libero at, lacinia velit. Proin mollis at est ac vehicula. </p> </div> </section>')}]);