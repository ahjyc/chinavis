
//页面需引入jquery库
$(document).ready(function(){
    $("#exsistfirmed").ready(function(){
      $.get("https://api.tianapi.com/txapi/ncovabroad/index?key=bf14c571788513bcd8d1923cbbdcd5fd",
      function(data,status){
         // console.log(data);
          var currentConfirmedCount;
          for(var i=0,l=data.newslist.length;i<l;i++)
                {
                    if(data.newslist[i].provinceName==="中国")
                    {

                        currentConfirmedCount=data.newslist[i].currentConfirmedCount;
                       

                    }

                }
          $('#exsistconfirmed').append(currentConfirmedCount); //返回内容绑定到ID为result的标签
         
         
      });
    });
  });



//全球数据
  $(document).ready(function(){
    $("#exsistfirmed_world").ready(function(){
      $.get("https://api.tianapi.com/txapi/ncovabroad/index?key=bf14c571788513bcd8d1923cbbdcd5fd",
      function(data,status){
         // console.log(data);
          var currentConfirmedCount=0;
          for(var i=0,l=data.newslist.length;i<l;i++)
                {
                    

                   currentConfirmedCount=data.newslist[i].currentConfirmedCount+currentConfirmedCount;
                       
                    
                    

                }
               // console.log(currentConfirmedCount);
          $('#exsistconfirmed_world').append(currentConfirmedCount); //返回内容绑定到ID为result的标签
         
         
      });
    });
  });