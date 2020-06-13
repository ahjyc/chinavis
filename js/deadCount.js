
//页面需引入jquery库
$(document).ready(function(){
    $("#deadCount").ready(function(){
      $.get("https://api.tianapi.com/txapi/ncovabroad/index?key=bf14c571788513bcd8d1923cbbdcd5fd",
      function(data,status){
         // console.log(data);
          var deadCount;
          for(var i=0,l=data.newslist.length;i<l;i++)
                {
                    if(data.newslist[i].provinceName==="中国")
                    {

                        deadCount=data.newslist[i].deadCount;
                       

                    }

                }
          $('#deadCount').append(deadCount); //返回内容绑定到ID为result的标签
         
         
      });
    });
  });



  //全球数据
$(document).ready(function(){
    $("#deadCount_world").ready(function(){
      $.get("https://api.tianapi.com/txapi/ncovabroad/index?key=bf14c571788513bcd8d1923cbbdcd5fd",
      function(data,status){
         // console.log(data);
          var deadCount=0;
          for(var i=0,l=data.newslist.length;i<l;i++)
                {
                    

                    deadCount=data.newslist[i].deadCount+deadCount;
                       
                    
                    

                }
               // console.log(deadCount);
          $('#deadCount_world').append(deadCount); //返回内容绑定到ID为result的标签
         
         
      });
    });
  });