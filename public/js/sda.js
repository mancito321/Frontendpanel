var app = angular.module("app-sda",['ngResource', 'chart.js']);

app.factory("cliente", function($resource){
  var url = "http://solarpes.herokuapp.com/client/:id"
  return $resource(url, {}, {
    lista: {
      method : 'GET',
      params: {},
      isArray : true
    },
    getOne : {
      method : 'GET',
      params : {id:'@id'},
      isArray : false
    },
    getPanel : {
      url : 'http://solarpes.herokuapp.com/client/:id/:panel/reads',
      method : 'GET',
      params : {
        id : '@id',
        panel : '@panel'
      },
      isArray : false
    }
  })
})

app.controller('controlle-sda', function($scope, $q, cliente){
  var clientes = cliente.lista()
  $scope.panel_list_show = false;

  clientes.$promise.then(function(result){
    $scope.clients = result
  })

  var selected_client = null;

  $scope.selectClient = function (client) {
    $scope.read_list_show = false;
    var client = cliente.getOne({id: client.userid})
    client.$promise.then(function(result) {
      $scope.selected_client = result
      selected_client = result;
      $scope.panel_list_show = true;
      $scope.panels = result.panels
    })
  }

  $scope.selectPanel = function(panel) {
    var panel = cliente.getPanel({
      id : selected_client.userid,
      panel : panel.panelid
    })

    panel.$promise.then(function(result){
      $scope.read_list_show = true;
      $scope.reads = result.reads

      var network = []
      var panel = []
      var used = []

      result.reads.forEach(function(read){
        network.push({
          y : read.current['network'],
          x : read['time']
        })
        panel.push({
          y : read.current['panel'],
          x : read['time']
        })
        used.push({
          y : read.current['used'],
          x : read['time']
        })
      })
      values = [network, panel, used]
      series = ['network', 'panel', 'used']
      color = [
        {
               backgroundColor: 'rgba(0,0,0,0)',
               borderColor: "rgba(0,0,0,1)",
               pointBorderColor: "rgba(255,0,0,1)",
               pointBackgroundColor: "rgba(255,0,0,1)",
               pointRadius: 2,
           },
           {
             fill : "+1",
             backgroundColor: 'rgba(193,0,0,0.0.1)',
             borderColor: 'rgba(193,0,0,1)',
             pointBorderColor: 'rgba(193,0,0,1)',
             pointBackgroundColor: 'rgba(193,0,0,1)',
             pointRadius: 0
           },
           {
             fill : "+2",
             backgroundColor: 'rgba(244, 226, 66,0.1)',
             borderColor: 'rgba(244, 226, 66,1)',
             pointBorderColor: 'rgba(244, 226, 66,1)',
             pointBackgroundColor: 'rgba(244, 226, 66,1)',
             pointRadius: 0
           },
           {
             fill : "+3",
             backgroundColor: 'rgba(0, 193, 100,0.1)',
             borderColor: 'rgba(0, 193, 100,1)',
             pointBorderColor: 'rgba(0, 193, 100,1)',
             pointBackgroundColor: 'rgba(0, 193, 100, 1)',
             pointRadius: 0
           }]
      options = {
        responsive:true,
        maintainAspectRatio: false,
        title: {
          display: true,
          text: 'Corriente del Sistema',
          position : "top"
        },
        scales: {
          yAxes: [
            {
              scaleLabel: {
                display: true,
                labelString: 'Corriente(A)'
              },
              type: 'linear',
              position: 'left',
            }
          ],
          xAxes:
          [
            {
              scaleLabel: {
                display: true,
                labelString: 'tiempo'
              },
              type: 'time',
              position: 'bottom',
              // ticks: {
              //   max: max,
              //   min: min,
              // }
            }
          ]
        }
      }

      $scope.gr_data = values
      $scope.gr_color = color
      $scope.gr_series = series
      $scope.gr_options = options

    })
  }

})
