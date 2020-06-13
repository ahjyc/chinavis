
//页面需引入jquery库
$(document).ready(function(){
    $("#totalconfirmed").ready(function(){
      $.get("https://api.tianapi.com/txapi/ncovabroad/index?key=bf14c571788513bcd8d1923cbbdcd5fd",
      function(data,status){
         // console.log(data);
          var totalconfirmed;
          for(var i=0,l=data.newslist.length;i<l;i++)
                {
                    if(data.newslist[i].provinceName==="中国")
                    {

                       totalconfirmed=data.newslist[i].confirmedCount;
                       

                    }

                }
          $('#totalconfirmed').append(totalconfirmed); //返回内容绑定到ID为result的标签
         
         
      });
    });
  });




  //全球数据
  $(document).ready(function(){
    $("#totalconfirmeds_world").ready(function(){
      $.get("https://api.tianapi.com/txapi/ncovabroad/index?key=bf14c571788513bcd8d1923cbbdcd5fd",
      function(data,status){
         // console.log(data);
          var confirmedCount=0;
          for(var i=0,l=data.newslist.length;i<l;i++)
                {
                    

                  confirmedCount=data.newslist[i].confirmedCount+confirmedCount;
                       
                    
                    

                }
              //  console.log(confirmedCount);
          $('#totalconfirmeds_world').append(confirmedCount); //返回内容绑定到ID为result的标签
         
         
      });
    });
  });