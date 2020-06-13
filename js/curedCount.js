
//页面需引入jquery库
$(document).ready(function(){
    $("#curedCount").ready(function(){
      $.get("https://api.tianapi.com/txapi/ncovabroad/index?key=bf14c571788513bcd8d1923cbbdcd5fd",
      function(data,status){
        //  console.log(data);
          var curedCount;
          for(var i=0,l=data.newslist.length;i<l;i++)
                {
                    if(data.newslist[i].provinceName==="中国")
                    {

                        curedCount=data.newslist[i].curedCount;
                       

                    }

                }
          $('#curedCount').append(curedCount); //返回内容绑定到ID为result的标签
         
         
      });
    });
  });



//全球数据
$(document).ready(function(){
    $("#curedCount_world").ready(function(){
      $.get("https://api.tianapi.com/txapi/ncovabroad/index?key=bf14c571788513bcd8d1923cbbdcd5fd",
      function(data,status){
         // console.log(data);
          var curedCount=0;
          for(var i=0,l=data.newslist.length;i<l;i++)
                {
                    

                    curedCount=data.newslist[i].curedCount+curedCount;
                       
                    
                    

                }
               // console.log(curedCount);
          $('#curedCount_world').append(curedCount); //返回内容绑定到ID为result的标签
         
         
      });
    });
  });
