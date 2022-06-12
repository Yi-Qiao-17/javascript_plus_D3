window.onload = function(){
    //document.write("Hello JavaScript");
}

/*$(function(){
    $("input").on("click",function(){
        //alert("Hi");//按鈕按了跳出視窗
        //$("h1").text("Hello");//按鈕按了可以改變那個問號
    });
});
*/

let final_all=0;
let choose_food_name=0;
let click_food=Boolean(false);
let click_cal=Boolean(false);
let pieText =document.querySelector('#pie_title');

$(function(){
    $(food_input).on("click",function(){
        click_food=true;
        var numberOfListItem = $("li").length;
        var randomChildNumber = Math.floor(Math.random()*numberOfListItem);
        $(food_name).text($("li").eq(randomChildNumber).text());
        choose_food_name=$("li").eq(randomChildNumber).text();
        x=document.getElementById("photo").src=(randomChildNumber+1)+".jpg";
        if(click_food){
            food_pie(final_all, choose_food_name);
            pieText.innerHTML="這餐所占的一天熱量圓餅圖";
        }
    });
});


function food_pie(final_all,choose_food_name){
    var data = [
        {
            "str_lab": "你的一天熱量", // 項目命名
            "num": 100 // 比重數
        },
        {
            "str_lab": "這餐熱量",
            "num": 100
        }
    ];
    data[0].str_lab="一天扣掉這餐的剩餘熱量";
    data[1].str_lab=choose_food_name;
    if(choose_food_name == "拉麵 436大卡"){
        data[1].num=436;
        data[0].num=final_all-436;
    }else if(choose_food_name == "滷肉飯 648大卡"){
        data[1].num=648;
        data[0].num=final_all-648;
    }else if(choose_food_name == "水餃（10顆） 500大卡"){
        data[1].num=500;
        data[0].num=final_all-500;
    }else{
        data[1].num=300;
    }


    var width = 250, // 畫布寬度
        height = 250, // 畫布高度
        radius = 100; // 畫布半徑
    var divNode = d3.select("body").node(); // 設定畫布
    var outerRadius = 100, // 外圈半徑
        innerRadius = 0; // 內圈半徑
    var color = d3.scale.ordinal()
        .range(["#4BEFCF","#2c9af7"]); // 設定顏色
    
    var arc = d3.svg.arc() // 建立弧
        .outerRadius(outerRadius) // 建立外圈半徑
        .innerRadius(innerRadius);// 建立內圈半徑
    
    var pie = d3.layout.pie()
        .sort(null)
        .value(function(d) { return d.num; }); // 建立排序
    
    d3.select("#chart").append("div") // 建立 id 和 class
        .attr("id","mainPie") 
        .attr("class","pieBox"); 
    
    var svg = d3.select("#mainPie").append("svg") // 建立畫布
        .attr("width", width)
        .attr("height", height)
      .append("g")
        .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");
    
    var defs = svg.append("defs");
    var filter = defs.append("filter") // 建立滑鼠事件
                    .attr("id", "drop-shadow")
                    .attr("height","130%");
    
    filter.append("feGaussianBlur")// 建立監聽事件
            .attr("in","SourceAlpha")
            .attr("stdDeviation", 3)
            .attr("result", "blur");
    
    filter.append("feOffset")// 建立陰影事件
        .attr("in", "blur")
        .attr("dx", 3)
        .attr("dy", 3)
        .attr("result", "offsetBlur");
        var feMerge = filter.append("feMerge");
    
    feMerge.append("feMergeNode") // 建立滑鼠監聽事件
        .attr("in", "offsetBlur")
    feMerge.append("feMergeNode")
        .attr("in", "SourceGraphic");
    
    var g = svg.selectAll(".arc") // 建立內部資料
          .data(pie(data))
        .enter().append("g")
          .attr("class", "arc");
    
      g.append("path") // 建立內部資料與滑鼠事件浮動文字
          .attr("d", arc)
          .style("fill", function(d) { return color(d.data.str_lab); })
          .attr("stroke","#fff")
          .attr("stroke-width","1px")
          .on("mousemove", function(d) {
              d3.select(this)
                  .attr("stroke","#fff")
                  .attr("stroke-width","2px")
                  .style("filter", "url(#drop-shadow)");
                      d3.select(this)
                            .transition()
                            .duration(500)
                            .ease('elastic')
                            .attr('transform',function(d){
                                var dist = 1;
                                d.midAngle = ((d.endAngle - d.startAngle)/2) + d.startAngle;
                                var x = Math.sin(d.midAngle) * dist;
                                var y = Math.cos(d.midAngle) * dist;
                                return 'translate(' + x + ',' + y + ')';
                            });
                var mousePos = d3.mouse(divNode);
                d3.select("#mainTooltip")
                  .style("left", mousePos[0] - 40 + "px")
                  .style("top", mousePos[1] - 70 + "px")
                  .select("#value")
                  .attr("text-anchor", "middle")
                  .html(d.data.str_lab + "<br />" + d.data.num);
    
                        d3.select("#mainTooltip").classed("hidden", false);
            })
          .on("mouseout", function(d){
              d3.select(this)
                  .attr("stroke","none")
                  .style("filter","none");
                        d3.select(this)
                            .transition()
                            .duration(500)
                            .ease('bounce')
                            .attr('transform','translate(0,0)');
    
                        d3.select("#mainTooltip").classed("hidden", true);
          });
    
}

/*function food_pie(all,choose_food){
    var svg = d3.select("body").append("svg")
            .attr("width", 600)
            .attr("height", 600)
            .append("g")
    //因為原點座標0,0在左上角，所以必須位移到指定的位置上，
            //否則會因為在畫圓時，圓心座標在0,0而導致部份圖形被裁切。
            //位移就是在原本的座標上加上移動的數值。
            .attr("transform", "translate(150,150)");

    //定義顏色
    var color = d3.scale.ordinal()
                .range(["#abc5c5","#6a456c"]);

    //資料
    var dd = [10,100] ; 

    dd[0]=all;
    if(choose_food == "拉麵 436大卡"){
        dd[1]=436;
    }else if(choose_food == "滷肉飯 648大卡"){
        dd[1]=648;
    }else if(choose_food == "水餃（10顆） 500大卡"){
        dd[1]=500;
    }else{
        dd[1]=300;
    }

    //繪製圖餅圖，必備的三個：
    //d3.svg.arc()
    //d3.layout.pie()
    //.append("path") 

    //利用arc來產生圓形的accessor函數，
    //函數包含有內、外圓的角度起迄，
    //內、外圓的半徑
    var arc1 = d3.svg.arc()
        //設定內、外圓形的半徑大小
                .outerRadius(100)
                .innerRadius(0);  

    //建立一個layout pie物件，無排序
    var pie = d3.layout.pie()
         .sort(null) ;        

    var g1 = svg.selectAll("g")
        .data(pie(dd))
     .enter()
     .append("g")
     //實際畫圓的方式是以SVG圖形路徑（Path）來繪製
     .append("path")
            //路徑的部份要設定在d屬性中，所以套入arc1函數，
     //d3.js會依據資料配合arc1函數產出Path所需的路徑
        .attr("d", arc1)
        .style("fill", function(d) {
        return color(d.data);
    });       
}
*/


let bmiText =document.querySelector('#bmiText');

bmiText.style.display="none";
//事件點擊按鈕 
let btn =document.querySelector('.calcualteBMI');
let reset =document.querySelector('.reset');
//事件點擊鍵盤
const inputk =document.querySelectorAll('input');

//計算 BMI

function bmi(weight,height,year,gender){
 let w = parseInt(weight);
 let h = parseInt(height);//因為公分要轉公尺所以除以100
 let y = parseInt(year);
 let bmi = 0;
 if(gender == 'male' ){
    bmi = 66+(13.7 * weight)+(5* height)-(6.8*year).toFixed(2);
    
    //bmi=111;
 }else if (gender == 'female'){
    bmi = 655+(9.6 * weight)+(1.8* height)-(4.7*year).toFixed(2);
    //bmi=222;
 }
 bmi=bmi*1.3;
 return bmi;
 
}

// 取出輸入值寫入畫面
function calculateBMI(e){
   console.log(e);

  let bodyWeight =document.querySelector('.bodyWeight').value;
  let gender =document.querySelector('input[name = "gender"]:checked').value;
  let bodyHeight =document.querySelector('.bodyHeight').value;
  let bodyYear =document.querySelector('.bodyYear').value;
  //let debug =document.querySelector('#debug');
  let resultText =document.querySelector('#resultText');
  let bmiText =document.querySelector('#bmiText');


    //debug.innerHTML=gender;
    
  //  印出值來
  if((bodyWeight !="" ) && (bodyHeight != "")&& (bodyYear != "")&& (gender != null)){
    click_cal=true;
     bmiText.style.display="block";
     resultText.innerHTML = bmi(bodyWeight,bodyHeight,bodyYear,gender);
     final_all=bmi(bodyWeight,bodyHeight,bodyYear,gender);
     //food_pie(final_all, "拉麵 436大卡");
     if(click_food){
        food_pie(final_all, choose_food_name);
        pieText.innerHTML="這餐所占的一天熱量圓餅圖";
     }
     
     //bmiText.innerHTML =  checkBMI(bmi(bodyWeight,bodyHeight,bodyYear,gender));
    
  }else{
      bmiText.style.display="none";
      //bmiText.style.display=gender;
      alert("請輸入完整資料！");
      return;
  };

}




//清空值
function undo(e){
 document.querySelector('.bodyWeight').value ='';
 document.querySelector('.bodyHeight').value ='';
 bmiText.style.display="none";
 resultText.innerHTML = 0;
 return
}

//事件監聽
btn.addEventListener('click', calculateBMI);
// console.log(inputk) 
// inputk.forEach(v=>{

//   v.addEventListener('keydown', calculateBMI)

// });
reset.addEventListener('click',undo);


