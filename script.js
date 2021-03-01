import * as Preguntas from './questions.js';

//Si acabo pronto añadir un factor dificultad manejado por el user
let dificultad = 5;

//Instancio el array de arrays de gráficos que será usado más adelante
let newDataChart =  [['', 0],
['', 0],
['', 0],
['', 0],
['', 0]
];

/*Pinto las opciones generadas aleatoriamente de drag y drop y ya de paso aprovecho el bucle para asignar cual va en cada y controlar que no se repitan, asi como
pintarlas aleatoriamente para que la primera opcion no sea la primera respuesta, sucesivamente*/

for (let i = 1; i <= dificultad; i++) {
  let country = obtenerDatosPaises(''); //Guardo la country 
  let city = obtenerDatosPaises('Ciudad', country); //Guardo la city
  let comprobacion = true; //Para el bucle, comprobar que no se repitan
  while (comprobacion==true){
    comprobacion = estaRepetido(document.getElementsByClassName('drops')[0].getElementsByTagName('div'), country.name)==true
    comprobacion == true ? (country = obtenerDatosPaises(''),city = obtenerDatosPaises('Ciudad', country)): null;  
  }

  //Meter las llamadas al dom en variables!!
  document.getElementsByClassName('drops')[0].appendChild(pintarPantalla('div', country.name, 'draggable', country.code))
  document.getElementsByClassName('drags')[0].appendChild(pintarPantalla('div', city.name, 'droppable', country.code + 'city' + city.cityCode)) //El formato sera codigopais-city-codigo ciudad
  actualizarPais(document.getElementsByClassName('drops')[0].getElementsByTagName('div'),null); //Encargado de axtualizar los gráficos de acierto del país, así como de instanciarlo en primer lugar
  if (i >= 3) { //Desordeno con insert before en la función de la siguiente línea ambas filas
    desordenarUnPoco(document.getElementsByClassName('drops')[0].getElementsByTagName('div'), document.getElementsByClassName('drops')[0]);
    desordenarUnPoco(document.getElementsByClassName('drags')[0].getElementsByTagName('div'), document.getElementsByClassName('drags')[0]);
  }
  $(function () { //Configuración de la zona de arrastre y suelte de jquery
    $(`[data-city=${country.code + 'city' + city.cityCode}]`).draggable({
      revert: 'invalid'
    }); //De parametro le paso las options, revert hace que vuelva si se deposita fuera o en el no correcto(puede aceptar mas con , propiedad:valor)    
    $(`[data-country=${country.code}]`).droppable({
      accept: `[data-city=${country.code + 'city' + city.cityCode}]`, //El drop de pais cargado en ese momento solo acepta el drag de la ciudad anterior ligado por el data code
      hoverClass: 'active',
      drop: function (e, ui) {
        /*
        console.log(ui)
        console.log(e)
        console.log(this)*/
        //$(this).html(ui.draggable.remove().html()); Fuera para poder usar la comparacion de graficos, esto reemplaza el nodo del drop con el del drag
        $(this).droppable('destroy');
        $(this)
        .addClass("ui-state-highlight")
        //data.cache[1][1].Ve=parseInt(data.cache[1][1].Ve)+1;        
        mymap.flyTo([city.location[0], city.location[1]], 12)     
       actualizarPais(document.getElementsByClassName('drops')[0].getElementsByTagName('div'),'Modificar',country.name); //Actualizo el mapa una vez se ha acertado

      }
    });
  });
}

function obtenerRandom(opcion) { //Para la seleccion aleatoria
  let random;
  opcion == 'Ciudad' ? random = Math.floor(Math.random() * 3) : random = Math.floor(Math.random() * 6);
  return random;
}

function obtenerDatosPaises(peticion, Country) { //Para obtener países y ciudades más ágilmente si se repiten
  let respuesta = '';
  peticion == 'Ciudad' ? respuesta = Country.cities[obtenerRandom('Ciudad')] : respuesta = Preguntas.gameData.countries[obtenerRandom('')];
  return respuesta
}

function estaRepetido(Collection, Actual) { //Encargada de controlar si el país está repetido
  let result = [].slice.call(Collection);
  let response = null;
  for(let z =0;z<=result.length;z++){
    if(result[z]!=undefined){   
        if (result[z].innerText == Actual){
          //console.log("Repetido",Actual)
          response = true;
          break;
        }else{
          response = false;
    }
  }
     
  }
  return response;
}


function desordenarUnPoco(Collection, Padre) {
  let result = [].slice.call(Collection); //Paso a array
  let random = Math.floor(Math.random() * result.length);
  let random2 = Math.floor(Math.random() * result.length);
  Padre.insertBefore(result[random], result[random2])
}

function pintarPantalla(elemento, mensaje, claseEstilo, dataInfo) {
  let tag = document.createElement(elemento);
  let texto = document.createTextNode(mensaje);
  tag.appendChild(texto);
  tag.classList.add(claseEstilo);
  dataInfo.indexOf("city") == -1 ? tag.setAttribute('data-country', dataInfo) : tag.setAttribute('data-city', dataInfo) //En un principio con los ids y el identificador extra podria valer
  return tag;
}



let accessToken = 'sk.eyJ1IjoiZ2ZyeHh4eHh4IiwiYSI6ImNra2JsaDA4bDBmZnUydm94ZnlsaTlmY2QifQ.EX3Dx-ZCF1YzxZXZFeKzAg';

var mymap = L.map('mapid').setView([21.505, -0.09], 13);
L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
  attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
  maxZoom: 18,
  id: 'mapbox/streets-v11',
  tileSize: 512,
  zoomOffset: -1,
  accessToken: 'pk.eyJ1IjoiZ2ZyeHh4eHh4IiwiYSI6ImNra2JrZDRicDAzYjEybnFzdHlxb3RsOXYifQ.QlaVZ531l3fCaAgYUGnZgw'
}).addTo(mymap);

var data;
var chart;

//  Visualization API y algo que llaman piechart package.
google.charts.load('current', { 'packages': ['corechart'] });

// Set a callback to run when the Google Visualization API is loaded.
google.charts.setOnLoadCallback(drawChart);

// Callback that creates and populates a data table,
// instantiates the pie chart, passes in the data and
// draws it.
function drawChart() {
  
  // crear data table.
  data = new google.visualization.DataTable();
  
  data.addColumn('string', 'Topping');
  data.addColumn('number', 'Slices');
  data.addRows(newDataChart);
  
  
  // Set chart options
  var options = {
    'title': 'Ocurrencias de paises',
    'width': 400,
    'height': 300
  };
  
  
  // Instantiate and draw our chart, passing in some options.
  chart = new google.visualization.PieChart(document.getElementById('chart_div'));
  //google.visualization.events.addListener(chart, 'select', selectHandler);
  chart.draw(data, options);
  //console.log(data.cache[0][0].Ve)
  //console.log(data.cache[0][0])
  
}


/*function selectHandler() {
  var selectedItem = chart.getSelection()[0];
  var value = data.getValue(selectedItem.row, 0);
  alert('The user selected ' + value);
}*/

function actualizarPais(paises,modificar,pais)
{
  if(modificar==null){

  }else{
   // newDataChart.forEach(ele=>{ele[0]==pais?console.log(pais):null})
   console.log("ya no esta null")
   console.log(paises[0])
   let backup =  [...newDataChart];
   console.log("enew",newDataChart)
   console.log("back",backup)
   newDataChart =[
    [paises[0].innerText, backup[0][1]],
    [paises[1].innerText, backup[1][1]],
    [paises[2].innerText, backup[2][1]],
    [paises[3].innerText, backup[3][1]],
    [paises[4].innerText, backup[4][1]]
  ]
  //let x = newDataChart.filter(e=>{(e[0][0]==pais)==true});

  for(let v=0;v<=paises.length-1;v++){
    if(newDataChart[v][0]==pais){
      newDataChart[v][1]=newDataChart[v][1]+1
      console.log("pais"+newDataChart[v][1])
    }
    else{
      newDataChart[v][1] = newDataChart[v][1]
    }
  }
  console.log(newDataChart)
  drawChart();

  }

}

