import { Meteor } from 'meteor/meteor';
import { Session } from 'meteor/session'
import { Cars } from '../../imports/api/cars.js';

var colors = [
  'rgba(120, 1, 22, 1)',
  'rgba(247, 181, 56, 1)',
  'rgba(219, 124, 38, 1)',
  'rgba(216, 87, 42, 1)',
  'rgba(195, 47, 39, 1)',
  'rgba(75, 192, 192, 1)',
  'rgba(255,99,132,1)',
  'rgba(255, 206, 86, 1)',
  'rgba(54, 162, 235, 1)',
  'rgba(153, 102, 255, 1)',
  'rgba(255, 159, 64, 1)',
]

function getRandomColor() {
    return Math.floor(Math.random() * 12);
}

function generateChartData(data, opts) {
  if(_.isEmpty(data)){
    return {
      labels: [],
      datasets: []
    }
  }
  var labels = _.uniq(_.pluck(data, 'label'));
  var cars = _.uniq(_.pluck(data, 'carId'));
  var datasets = []
  var fillColor = null
  _.each(cars, function(car){
    if(opts.dontFill) {
      fillColor = 'transparent'
      strokeColor = colors[getRandomColor()]
    }
    else {
      fillColor = colors[getRandomColor()]
      strokeColor = 'transparent'
    }
    datasets.push({
      label: Cars.findOne(car).name,
      fillColor: fillColor,
      strokeColor: strokeColor,
      data: []
    })

    _.each(labels, function(label){
      datum = _.findWhere(data, {carId: car, label: label})
      if(!datum){
        datum = null
      } else {
        datum = datum[opts.field]
      }
      datasets[datasets.length - 1].data.push(datum)
    })
  })

  if(labels.length == 1){
    labels = ['', labels[0], '']
    _.each(datasets, function(dataset){
      dataset.data = [null, dataset.data[0], null]
    })
  }
  return dataChart = {
      labels: labels,
      datasets: datasets
  };
}

Template.statsMainView.onCreated(function () {
   this.subscribe('cars');
})

Template.statsMainView.onRendered(function () {
  //Set current month
  var curDate = new Date();
  this.$("#monthSelect option[value="+ curDate.getMonth() + "]")
  .attr('selected', true);
  this.$("#yearSelect option[value="+ curDate.getFullYear() + "]")
  .attr('selected', true);
  this.$('select').material_select();

  var carId = null
  var monthId = null
  var yearId = null
  var SetSelectedValue = function() {
    if (this.$('#carSelect').val() === 'all') {
      carId = null
    }
    else {
      carId = this.$('#carSelect').val()
    }

    if (this.$('#yearSelect').val() === 'all') {
      yearId = null
    }
    else {
      yearId = parseInt(this.$('#yearSelect').val(), 10)
    }

    if (this.$('#monthSelect').val() === 'all') {
      monthId = null
    }
    else {
      monthId = parseInt(this.$('#monthSelect').val(), 10) + 1;
    }
  }
  SetSelectedValue();
  Meteor.call('stats.getCommonData', carId, monthId, yearId
  , function(err, data){
    Session.set('commonData', data);
  });
  $('select').change(function(event) {
    SetSelectedValue();
    Meteor.call('stats.getCommonData', carId, monthId, yearId
    , function(err, data){
      Session.set('commonData', data);
    });
  });
});

Template.statsMainView.helpers({
  getMonths() {
    return ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet'
    , 'Août', 'Septembre', 'Octobre', 'Novembre', 'Decembre']
  },
  getYears() {
    years = [];
    for (var i = 2000; i < 2100; i++) {
       years.push(i);
    }
    return years;
  },
  cars() {
    return Cars.find({});
  }
});

Template.kmStats.onRendered(function () {
  this.canvas = this.$("#kmChart")[0];
  this.context = this.canvas.getContext('2d');
  this.canvas.width = this.$(".card-panel").width();
  this.canvas.height = this.$(".card-panel").height();
  this.chart = null;
  this.autorun(() => {
    if(this.chart) {
      this.chart.destroy();
    }
    data = Session.get('commonData');
    this.chart = new Chart(this.context).Bar(
      generateChartData(data, {field: 'distance'}), {
        tooltipTemplate: "<%if (datasetLabel){%><%=datasetLabel%>: <%}%><%= value %>km",
        multiTooltipTemplate: "<%if (datasetLabel){%><%=datasetLabel%>: <%}%><%= value %>km"
      });
  });
});

Template.consoStats.onRendered(function () {
  this.canvas = this.$("#consoChart")[0];
  this.context = this.canvas.getContext('2d');
  this.canvas.width = this.$(".card-panel").width();
  this.canvas.height = this.$(".card-panel").height();
  this.chart = null;
  this.autorun(() => {
    if(this.chart) {
      this.chart.destroy();
    }
    data = Session.get('commonData');
    this.chart = new Chart(this.context).Line(
      generateChartData(data, {field: 'consumption', dontFill: true}), {
        tooltipTemplate: "<%if (datasetLabel){%><%=datasetLabel%>: <%}%><%= value %>L/100km",
        multiTooltipTemplate: "<%if (datasetLabel){%><%=datasetLabel%>: <%}%><%= value %>L/100km"
      });
  });
});
Template.coutStats.onRendered(function () {
  this.canvas = this.$("#coutChart")[0];
  this.context = this.canvas.getContext('2d');
  this.canvas.width = this.$(".card-panel").width();
  this.canvas.height = this.$(".card-panel").height();
  this.chart = null;
  this.autorun(() => {
    if(this.chart) {
      this.chart.destroy();
    }
    data = Session.get('commonData');
    this.chart = new Chart(this.context).Line(
      generateChartData(data, {field: 'expense', dontFill: true}), {
        tooltipTemplate: "<%if (datasetLabel){%><%=datasetLabel%>: <%}%><%= value %>€",
        multiTooltipTemplate: "<%if (datasetLabel){%><%=datasetLabel%>: <%}%><%= value %>€"
      });
  });
});

Template.kmCostStats.onRendered(function () {
  this.canvas = this.$("#kmCostChart")[0];
  this.context = this.canvas.getContext('2d');
  this.canvas.width = this.$(".card-panel").width();
  this.canvas.height = this.$(".card-panel").height();
  this.chart = null;
  this.autorun(() => {
    if(this.chart) {
      this.chart.destroy();
    }
    data = Session.get('commonData');
    this.chart = new Chart(this.context).Line(
      generateChartData(data, {field: 'costUnit', dontFill: true}), {
        tooltipTemplate: "<%if (datasetLabel){%><%=datasetLabel%>: <%}%><%= value %>€",
        multiTooltipTemplate: "<%if (datasetLabel){%><%=datasetLabel%>: <%}%><%= value %>€"
      });
  });
});

Template.literDistanceStats.onRendered(function () {
  this.canvas = this.$("#literDistanceChart")[0];
  this.context = this.canvas.getContext('2d');
  this.canvas.width = this.$(".card-panel").width();
  this.canvas.height = this.$(".card-panel").height();
  this.chart = null;
  this.autorun(() => {
    if(this.chart) {
      this.chart.destroy();
    }
    data = Session.get('commonData');
    this.chart = new Chart(this.context).Line(
      generateChartData(data, {field: 'distliter', dontFill: true}), {
        tooltipTemplate: "<%if (datasetLabel){%><%=datasetLabel%>: <%}%><%= value %>km",
        multiTooltipTemplate: "<%if (datasetLabel){%><%=datasetLabel%>: <%}%><%= value %>km"
      });
  });
});

Template.costDistanceStats.onRendered(function () {
  this.canvas = this.$("#costDistanceChart")[0];
  this.context = this.canvas.getContext('2d');
  this.canvas.width = this.$(".card-panel").width();
  this.canvas.height = this.$(".card-panel").height();
  this.chart = null;
  this.autorun(() => {
    if(this.chart) {
      this.chart.destroy();
    }
    data = Session.get('commonData');
    this.chart = new Chart(this.context).Line(
      generateChartData(data, {field: 'distcost', dontFill: true}), {
        tooltipTemplate: "<%if (datasetLabel){%><%=datasetLabel%>: <%}%><%= value %>km",
        multiTooltipTemplate: "<%if (datasetLabel){%><%=datasetLabel%>: <%}%><%= value %>km"
      });
  });
});
