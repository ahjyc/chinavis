var dateChange = [];
var totalCountChange = [];
var totalCure = [];
var totaldeath = [];
var currentConfirmed = [];
var newaddCount = [1];
var newDeath = [0];

var hubeitotalChange = [];
var hubeinewaddCount = [1];
var hubeinewDeath = [];

var no_hubeitotalChange = [];
var no_hubeinewaddCount = [];
var no_hubeinewDeath = [];

var provinceData = null;


//省份数据
$(document).ready(function () {

    $.get("https://api.tianapi.com/txapi/ncovcity/index?key=bf14c571788513bcd8d1923cbbdcd5fd",
        function (data, status) {
            provinceData = data.newslist;
            console.log(provinceData);
        });
});


console.log(data.data);
for (var i = 0; i < data.data.length; i++) {
    if (data.data[i].provinceCode == "" && data.data[i].country == "中国") {
        var mydate = data.data[i].date;
        var mytotalCount = data.data[i].confirmed;
        var myCurrentConfirmed = data.data[i].confirmed - data.data[i].cured - data.data[i].dead;
        dateChange.push(mydate);
        totalCountChange.push(mytotalCount);
        totalCure.push(data.data[i].cured);
        totaldeath.push(data.data[i].dead);
        currentConfirmed.push(myCurrentConfirmed);
    }
}

for (var i = 1; i < totalCountChange.length; i++) {
    myAdd = totalCountChange[i] - totalCountChange[i - 1];
    myDeathAdd = totaldeath[i] - totaldeath[i - 1];
    newDeath.push(myDeathAdd);
    newaddCount.push(myAdd);
}


console.log(dateChange);
console.log(totalCountChange);
console.log(newaddCount);
console.log(newDeath);




for (var i = 0; i < data.data.length; i++) {

    if (i >= 21714 && i <= 21729) {
        hubeitotalChange.push(67466);
    }
    else {
        if (data.data[i].province == "湖北省" && data.data[i].city == "") {


            hubeitotalChange.push(data.data[i].confirmed);


        }
    }



}
console.log(hubeitotalChange);

for (var i = 1; i < hubeitotalChange.length; i++) {
    if (hubeitotalChange[i] - hubeitotalChange[i - 1] >= 0) {
        hubeinewaddCount.push(hubeitotalChange[i] - hubeitotalChange[i - 1]);
    }
    else {
        hubeinewaddCount.push(0);
    }

}
console.log(hubeinewaddCount);
for (var i = 0; i < hubeitotalChange.length; i++) {
    if ((totalCountChange[i] - hubeitotalChange[i]) >= 0) {
        no_hubeitotalChange.push(totalCountChange[i] - hubeitotalChange[i]);
        // no_hubeinewaddCount.push(newaddCount[i]-hubeinewaddCount[i]);
    }

    else {
        hubeitotalChange[i] = totalCountChange[i];
        no_hubeitotalChange.push(totalCountChange[i] - hubeitotalChange[i]);
    }
}
for (var i = 0; i < hubeitotalChange.length; i++) {
    if ((newaddCount[i] - hubeinewaddCount[i]) > 0) {
        no_hubeinewaddCount.push(newaddCount[i] - hubeinewaddCount[i]);
    }
    else {
        no_hubeinewaddCount.push(0);
    }
}
console.log(no_hubeinewaddCount);
console.log(no_hubeitotalChange);



console.log(data_provinceline.data_provinceline);


// var outInConfirmed=[];//境外输入数据json预处理
// for(var i=0;i<data.data.length;i++)
// {

//     if(data.data[i].city=="境外输入")
//     {


//             var tempData={"date":data.data[i].date,"confirmed":data.data[i].confirmed};
//             var tempdata2=data.data[i];
//             outInConfirmed.push(tempdata2);


//     }
// }
// console.log(outInConfirmed);
// for(var i=1;i<outInConfirmed.length;i++){
//     if(outInConfirmed[i].date==outInConfirmed[i-1].date)

//     {
//         outInConfirmed[i].confirmed=outInConfirmed[i].confirmed+outInConfirmed[i-1].confirmed;
//         delete outInConfirmed[i-1];
//     }
// }

// console.log(outInConfirmed);




//词云模块

(function () {

    $.get("https://api.tianapi.com/txapi/weibohot/index?key=bf14c571788513bcd8d1923cbbdcd5fd",
        function (data, status) {
            //console.log(data);
            var wordclouddata = [];
            for (var i = 0; i < data.newslist.length; i++) {
                var myJson = { "name": data.newslist[i].hotword, "value": data.newslist[i].hotwordnum };
                wordclouddata.push(myJson);

            }
            //console.log(wordclouddata);
            var myChart = echarts.init(document.querySelector(".wordcloud .chart"));
            var option = {
                tooltip: {
                    show: true,
                    trigger: 'item'
                },
                series: [
                    {
                        type: 'wordCloud',
                        gridSize: 2,
                        sizeRange: [12, 50],
                        rotationRange: [-90, 90],
                        shape: 'pentagon',

                        textStyle: {
                            normal: {
                                color: function () {
                                    return 'rgb(' + [
                                        Math.round(Math.random() * 255),
                                        Math.round(Math.random() * 255),
                                        Math.round(Math.random() * 255)
                                    ].join(',') + ')';
                                }
                            },
                            emphasis: {
                                shadowBlur: 10,
                                shadowColor: '#333'
                            }
                        },
                        data: wordclouddata
                    }
                ]

            }
            myChart.setOption(option);
            //让图表跟随屏幕在自动的去适应
            window.addEventListener('resize', function () {
                myChart.resize();
            });

        });

})();


//疫情人数变化曲线
(function () {
    var myChart = echarts.init(document.querySelector(".linecountry .chart"));
    var option = {

        tooltip: {
            trigger: 'axis'
        },
        legend: {
            top: "0%",
            textStyle: {
                color: "rgba(255,255,255,.5)",
                fontSize: 12
            },
            data: ['累计确诊数', '治愈总人数', '死亡总人数', '现存确诊']
        },
        grid: {
            left: '10',
            top: "30",
            right: '10',
            bottom: '10',
            containLabel: true
        },

        xAxis: {
            type: 'category',
            boundaryGap: false,
            data: dateChange,
            axisLabel: {
                color: "#4c9bfd",//文本颜色,
                fontSize: 8
            }
        },
        yAxis: {
            type: 'value',
            axisLabel: {
                color: "#4c9bfd"//文本颜色
            },
            axisLine: {
                show: false//去除轴线
            },
            splitLine: {
                lineStyle: "#012f4a" //分割线颜色
            }
        },
        series: [
            {
                name: '累计确诊数',
                type: 'line',
                smooth: true,
                data: totalCountChange
            },

            {
                name: '治愈总人数',
                type: 'line',
                smooth: true,
                color: 'MediumSpringGreen',
                data: totalCure
            },
            {
                name: '死亡总人数',
                type: 'line',
                smooth: true,
                data: totaldeath
            },
            {
                name: '现存确诊',
                type: 'line',
                smooth: true,
                color: 'MediumOrchid',
                data: currentConfirmed
            }

        ]
    };

    myChart.setOption(option);
    //让图表跟随屏幕在自动的去适应
    window.addEventListener('resize', function () {
        myChart.resize();
    });

    $(".linecountry h2").on("click", "a", function () {
        //console.log($(this).index());
        //点击a之后根据a的索引号找到对应的yearData的相关对象
        //console.log(yearData[$(this).index()]);
        console.log($(this).text());
        function showGraph(graphname) {

            //显示
            if (graphname == "全国疫情人数变化曲线") {
                //console.log(totalCountChange);
                myChart.clear();

                var option = {

                    tooltip: {
                        trigger: 'axis'
                    },
                    legend: {
                        top: "0%",
                        textStyle: {
                            color: "rgba(255,255,255,.5)",
                            fontSize: 12
                        },
                        data: ['累计确诊数', '治愈总人数', '死亡总人数', '现存确诊']
                    },
                    grid: {
                        left: '10',
                        top: "30",
                        right: '10',
                        bottom: '10',
                        containLabel: true
                    },

                    xAxis: {
                        type: 'category',
                        boundaryGap: false,
                        data: dateChange,
                        axisLabel: {
                            color: "#4c9bfd",//文本颜色,
                            fontSize: 8
                        }
                    },
                    yAxis: {
                        type: 'value',
                        axisLabel: {
                            color: "#4c9bfd"//文本颜色
                        },
                        axisLine: {
                            show: false//去除轴线
                        },
                        splitLine: {
                            lineStyle: "#012f4a" //分割线颜色
                        }
                    },
                    series: [
                        {
                            name: '累计确诊数',
                            type: 'line',
                            smooth: true,
                            data: totalCountChange
                        },

                        {
                            name: '治愈总人数',
                            type: 'line',
                            smooth: true,
                            color: 'MediumSpringGreen',
                            data: totalCure
                        },
                        {
                            name: '死亡总人数',
                            type: 'line',
                            smooth: true,
                            data: totaldeath
                        },
                        {
                            name: '现存确诊',
                            type: 'line',
                            smooth: true,
                            color: 'MediumOrchid',
                            data: currentConfirmed
                        }

                    ]
                };

                myChart.setOption(option);
                //让图表跟随屏幕在自动的去适应
                window.addEventListener('resize', function () {
                    myChart.resize();
                });
            }
            else {
                myChart.clear();//清理画布，重绘堆叠条形图
                console.log(provinceCovidData.provinceCovidData);
                var option = {
                    tooltip: {
                        trigger: 'axis',
                        axisPointer: {            // 坐标轴指示器，坐标轴触发有效
                            type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
                        },
                        textStyle: {
                            fontSize: 10
                        }
                    },
                    legend: {
                        data: ['湖北', '广东', '浙江', '湖南', '河南', '安徽', '重庆', '山东', '江西', '四川', '江苏', '北京', '福建', '上海', '广西', '河北', '陕西', '云南', '海南', '黑龙江', '辽宁', '山西', '天津', '甘肃', '内蒙', '新疆', '宁夏', '吉林', '贵州', '青海', '西藏', '澳门', '香港', '台湾'],
                        textStyle: {
                            color: 'white'
                        },
                        orient: 'horizontal',
                        itemWidth: 2
                    },
                    dataZoom: [
                        {
                            show: true,
                            start: 0,
                            end: 100,
                            height: 10,
                            bottom: 0
                        },
                        {
                            type: 'inside',
                            start: 0,
                            end: 100
                        },
                        {
                            show: true,
                            yAxisIndex: 0,
                            filterMode: 'empty',
                            top: 0,
                            width: 10,
                            height: '70%',
                            showDataShadow: false,
                            left: '99%'
                        }
                    ],
                    grid: {

                        left: '0%',
                        right: '0',
                        bottom: '0%',
                        containLabel: true
                    },

                    yAxis: {
                        type: 'value',
                        splitLine: {
                            show: false
                        },
                        axisLabel: {
                            color: 'white'
                        }
                    },
                    xAxis: {
                        type: 'category',
                        axisLabel: {
                            color: 'white'
                        },
                        splitLine: {
                            show: false
                        },
                        data: ['2020-01-22', '2020-01-23', '2020-01-24', '2020-01-25', '2020-01-26', '2020-01-27', '2020-01-28', '2020-01-29', '2020-01-30', '2020-01-31', '2020-02-01', '2020-02-02', '2020-02-03', '2020-02-04', '2020-02-05', '2020-02-06', '2020-02-07', '2020-02-08', '2020-02-09', '2020-02-10', '2020-02-11', '2020-02-12', '2020-02-13', '2020-02-14', '2020-02-15', '2020-02-16', '2020-02-17', '2020-02-18', '2020-02-19', '2020-02-20', '2020-02-21', '2020-02-22', '2020-02-23', '2020-02-24', '2020-02-25', '2020-02-26', '2020-02-27', '2020-02-28', '2020-02-29', '2020-03-01', '2020-03-02', '2020-03-03', '2020-03-04', '2020-03-05', '2020-03-06', '2020-03-07', '2020-03-08', '2020-03-09', '2020-03-10', '2020-03-11', '2020-03-12', '2020-03-13', '2020-03-14', '2020-03-15', '2020-03-16', '2020-03-17', '2020-03-18', '2020-03-19', '2020-03-20', '2020-03-21', '2020-03-22', '2020-03-23', '2020-03-24', '2020-03-25', '2020-03-26', '2020-03-27', '2020-03-28', '2020-03-29', '2020-03-30', '2020-03-31', '2020-04-01', '2020-04-02', '2020-04-03', '2020-04-04', '2020-04-05', '2020-04-06', '2020-04-07', '2020-04-08', '2020-04-09', '2020-04-10', '2020-04-11', '2020-04-12', '2020-04-13', '2020-04-14', '2020-04-15', '2020-04-16', '2020-04-17', '2020-04-18', '2020-04-19', '2020-04-20', '2020-04-21', '2020-04-22', '2020-04-23', '2020-04-24', '2020-04-25', '2020-04-26', '2020-04-27', '2020-04-28', '2020-04-29', '2020-04-30', '2020-05-01', '2020-05-02', '2020-05-03', '2020-05-04', '2020-05-05', '2020-05-06', '2020-05-07', '2020-05-08', '2020-05-09', '2020-05-10', '2020-05-11', '2020-05-12', '2020-05-13'],
                    },
                    series: [
                        {
                            name: '湖北',
                            type: 'bar',
                            stack: '总量',

                            data: provinceCovidData.provinceCovidData[0].newAddConfirmed,
                        },
                        {
                            name: '广东',
                            type: 'bar',
                            stack: '总量',

                            data: provinceCovidData.provinceCovidData[1].newAddConfirmed,
                        },
                        {
                            name: '浙江',
                            type: 'bar',
                            stack: '总量',

                            data: provinceCovidData.provinceCovidData[2].newAddConfirmed,
                        },
                        {
                            name: '湖南',
                            type: 'bar',
                            stack: '总量',

                            data: provinceCovidData.provinceCovidData[3].newAddConfirmed,
                        },
                        {
                            name: '河南',
                            type: 'bar',
                            stack: '总量',

                            data: provinceCovidData.provinceCovidData[4].newAddConfirmed,
                        },
                        {
                            name: '安徽',
                            type: 'bar',
                            stack: '总量',

                            data: provinceCovidData.provinceCovidData[5].newAddConfirmed,
                        },
                        {
                            name: '重庆',
                            type: 'bar',
                            stack: '总量',

                            data: provinceCovidData.provinceCovidData[6].newAddConfirmed,
                        },
                        {
                            name: '山东',
                            type: 'bar',
                            stack: '总量',

                            data: provinceCovidData.provinceCovidData[7].newAddConfirmed,
                        },
                        {
                            name: '江西',
                            type: 'bar',
                            stack: '总量',

                            data: provinceCovidData.provinceCovidData[8].newAddConfirmed,
                        },
                        {
                            name: '四川',
                            type: 'bar',
                            stack: '总量',

                            data: provinceCovidData.provinceCovidData[9].newAddConfirmed,
                        },
                        {
                            name: '江苏',
                            type: 'bar',
                            stack: '总量',

                            data: provinceCovidData.provinceCovidData[10].newAddConfirmed,
                        },
                        {
                            name: '北京',
                            type: 'bar',
                            stack: '总量',

                            data: provinceCovidData.provinceCovidData[11].newAddConfirmed,
                        },
                        {
                            name: '福建',
                            type: 'bar',
                            stack: '总量',

                            data: provinceCovidData.provinceCovidData[12].newAddConfirmed,
                        },
                        {
                            name: '上海',
                            type: 'bar',
                            stack: '总量',

                            data: provinceCovidData.provinceCovidData[13].newAddConfirmed,
                        },
                        {
                            name: '广西',
                            type: 'bar',
                            stack: '总量',

                            data: provinceCovidData.provinceCovidData[14].newAddConfirmed,
                        },
                        {
                            name: '河北',
                            type: 'bar',
                            stack: '总量',

                            data: provinceCovidData.provinceCovidData[15].newAddConfirmed,
                        },
                        {
                            name: '陕西',
                            type: 'bar',
                            stack: '总量',

                            data: provinceCovidData.provinceCovidData[16].newAddConfirmed,
                        },
                        {
                            name: '云南',
                            type: 'bar',
                            stack: '总量',

                            data: provinceCovidData.provinceCovidData[17].newAddConfirmed,
                        },
                        {
                            name: '海南',
                            type: 'bar',
                            stack: '总量',

                            data: provinceCovidData.provinceCovidData[18].newAddConfirmed,
                        },
                        {
                            name: '黑龙江',
                            type: 'bar',
                            stack: '总量',

                            data: provinceCovidData.provinceCovidData[19].newAddConfirmed,
                        },
                        {
                            name: '辽宁',
                            type: 'bar',
                            stack: '总量',

                            data: provinceCovidData.provinceCovidData[20].newAddConfirmed,
                        },
                        {
                            name: '山西',
                            type: 'bar',
                            stack: '总量',

                            data: provinceCovidData.provinceCovidData[21].newAddConfirmed,
                        },
                        {
                            name: '天津',
                            type: 'bar',
                            stack: '总量',

                            data: provinceCovidData.provinceCovidData[22].newAddConfirmed,
                        },
                        {
                            name: '甘肃',
                            type: 'bar',
                            stack: '总量',

                            data: provinceCovidData.provinceCovidData[23].newAddConfirmed,
                        },
                        {
                            name: '内蒙古',
                            type: 'bar',
                            stack: '总量',

                            data: provinceCovidData.provinceCovidData[24].newAddConfirmed,
                        },
                        {
                            name: '新疆',
                            type: 'bar',
                            stack: '总量',

                            data: provinceCovidData.provinceCovidData[25].newAddConfirmed,
                        },
                        {
                            name: '宁夏',
                            type: 'bar',
                            stack: '总量',

                            data: provinceCovidData.provinceCovidData[26].newAddConfirmed,
                        },
                        {
                            name: '吉林',
                            type: 'bar',
                            stack: '总量',

                            data: provinceCovidData.provinceCovidData[27].newAddConfirmed,
                        },
                        {
                            name: '贵州',
                            type: 'bar',
                            stack: '总量',

                            data: provinceCovidData.provinceCovidData[28].newAddConfirmed,
                        },
                        {
                            name: '青海',
                            type: 'bar',
                            stack: '总量',

                            data: provinceCovidData.provinceCovidData[29].newAddConfirmed,
                        },
                        {
                            name: '西藏',
                            type: 'bar',
                            stack: '总量',

                            data: provinceCovidData.provinceCovidData[30].newAddConfirmed,
                        },
                        {
                            name: '澳门',
                            type: 'bar',
                            stack: '总量',

                            data: provinceCovidData.provinceCovidData[31].newAddConfirmed,
                        },
                        {
                            name: '香港',
                            type: 'bar',
                            stack: '总量',

                            data: provinceCovidData.provinceCovidData[32].newAddConfirmed,
                        },
                        {
                            name: '台湾',
                            type: 'bar',
                            stack: '总量',

                            data: provinceCovidData.provinceCovidData[33].newAddConfirmed,
                        }
                    ]
                };

                myChart.setOption(option);

            }
        };
        showGraph($(this).text());//根据点击状况重新渲染图表

    })




})();
//地图
class MapComponent {
    constructor(container) {
        this.container = container || null;
        this.province = ['湖北', '广东', '浙江', '湖南', '河南', '安徽', '重庆', '山东', '江西', '四川', '江苏', '北京', '福建', '上海', '广西', '河北', '陕西', '云南', '海南', '黑龙江', '辽宁', '山西', '天津', '甘肃', '内蒙古', '新疆', '宁夏', '吉林', '贵州', '青海', '西藏', '澳门', '香港', '台湾'];
        this.data = [
            [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [6, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [6, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [7, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [8, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [9, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [14, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [18, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [21, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [29, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [30, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [33, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [35, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [37, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [37, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [37, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [37, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [40, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [43, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [44, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [41, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [41, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [41, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [41, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [41, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [41, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [41, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [41, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [41, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [41, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [41, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [41, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [41, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [45, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [62, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [121, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [198, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [270, 14, 0, 0, 0, 0, 0, 0, 0, 0, 0, 5, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [375, 26, 5, 1, 1, 0, 5, 1, 2, 2, 0, 10, 0, 6, 0, 0, 0, 1, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [444, 32, 10, 4, 5, 1, 9, 6, 3, 5, 1, 14, 1, 16, 2, 1, 4, 0, 5, 1, 2, 1, 4, 0, 0, 0, 1, 1, 3, 0, 0, 1, 1, 1],
            [549, 53, 43, 24, 9, 15, 27, 9, 7, 15, 9, 22, 4, 20, 13, 2, 5, 2, 8, 4, 4, 1, 5, 2, 1, 2, 2, 3, 3, 0, 0, 2, 2, 1],
            [729, 78, 62, 43, 32, 39, 57, 21, 18, 28, 18, 36, 10, 33, 23, 8, 15, 5, 17, 9, 12, 6, 8, 4, 2, 3, 3, 4, 4, 0, 0, 2, 5, 3],
            [1052, 98, 104, 69, 83, 60, 75, 39, 36, 44, 31, 41, 18, 40, 33, 13, 22, 11, 22, 15, 16, 9, 10, 7, 7, 4, 4, 4, 5, 1, 0, 2, 5, 3],
            [1423, 146, 128, 100, 128, 70, 110, 63, 48, 69, 47, 68, 35, 53, 46, 18, 35, 19, 31, 21, 22, 13, 14, 14, 11, 5, 7, 6, 7, 4, 0, 5, 8, 4],
            [2714, 188, 173, 143, 168, 106, 132, 63, 72, 90, 70, 80, 59, 66, 51, 33, 46, 44, 40, 30, 27, 20, 23, 19, 13, 10, 11, 8, 9, 6, 0, 7, 8, 5],
            [3554, 241, 296, 221, 206, 152, 147, 121, 109, 108, 99, 91, 80, 80, 58, 48, 56, 51, 43, 37, 34, 27, 24, 24, 16, 13, 12, 9, 9, 6, 0, 7, 8, 8],
            [4586, 311, 428, 277, 206, 200, 165, 145, 162, 142, 129, 114, 101, 101, 78, 65, 63, 70, 46, 43, 41, 35, 27, 26, 18, 14, 17, 14, 12, 6, 1, 7, 10, 8],
            [5806, 393, 537, 332, 352, 237, 206, 178, 240, 177, 168, 132, 120, 128, 87, 82, 87, 80, 49, 59, 45, 39, 31, 29, 20, 17, 21, 14, 15, 8, 1, 7, 12, 9],
            [7153, 520, 599, 389, 422, 297, 238, 202, 286, 207, 202, 156, 144, 153, 100, 96, 101, 91, 57, 80, 60, 47, 32, 35, 23, 18, 26, 17, 29, 9, 1, 7, 13, 10],
            [9074, 604, 661, 463, 493, 340, 262, 225, 333, 231, 236, 183, 159, 177, 111, 104, 116, 99, 63, 95, 64, 56, 41, 40, 27, 21, 28, 23, 38, 9, 1, 7, 14, 10],
            [11177, 683, 724, 521, 566, 408, 300, 246, 391, 254, 271, 212, 179, 193, 127, 113, 128, 109, 70, 118, 70, 66, 48, 51, 34, 24, 31, 31, 46, 13, 1, 8, 15, 10],
            [13522, 797, 829, 593, 675, 480, 337, 270, 476, 282, 308, 228, 194, 208, 139, 126, 142, 117, 79, 155, 74, 74, 60, 55, 35, 29, 34, 42, 56, 15, 1, 8, 15, 10],
            [16678, 870, 895, 661, 764, 530, 366, 298, 548, 301, 341, 253, 205, 233, 150, 135, 165, 122, 89, 190, 81, 81, 67, 57, 42, 32, 34, 54, 64, 17, 1, 10, 18, 11],
            [19665, 944, 954, 711, 851, 591, 389, 343, 600, 321, 373, 274, 215, 254, 168, 157, 173, 128, 100, 227, 89, 90, 69, 62, 46, 36, 40, 59, 69, 18, 1, 10, 21, 11],
            [22112, 1018, 1006, 772, 914, 665, 411, 379, 661, 344, 408, 297, 224, 269, 172, 171, 184, 135, 111, 277, 95, 96, 79, 67, 50, 39, 43, 65, 77, 18, 1, 10, 24, 16],
            [24953, 1075, 1048, 803, 980, 733, 426, 407, 698, 363, 439, 315, 239, 281, 183, 195, 184, 138, 122, 281, 99, 104, 81, 71, 52, 42, 44, 69, 89, 18, 1, 10, 26, 16],
            [27013, 1120, 1063, 838, 1033, 779, 446, 435, 739, 386, 468, 326, 250, 292, 195, 206, 195, 140, 128, 307, 106, 115, 88, 79, 54, 45, 45, 78, 96, 18, 1, 10, 26, 17],
            [29631, 1151, 1092, 879, 1073, 830, 468, 459, 772, 405, 492, 337, 261, 295, 210, 218, 208, 141, 136, 331, 108, 119, 91, 83, 58, 49, 49, 80, 109, 18, 1, 10, 36, 18],
            [31728, 1177, 1117, 912, 1105, 860, 486, 486, 804, 417, 515, 342, 267, 302, 215, 239, 213, 149, 142, 360, 108, 122, 95, 86, 58, 55, 53, 81, 118, 18, 1, 10, 42, 18],
            [33366, 1219, 1131, 946, 1135, 888, 505, 497, 844, 436, 543, 352, 272, 306, 222, 251, 219, 154, 145, 378, 116, 124, 106, 86, 60, 59, 58, 83, 131, 18, 1, 10, 49, 18],
            [47163, 1241, 1145, 968, 1169, 910, 518, 506, 872, 451, 570, 366, 279, 313, 222, 265, 225, 155, 157, 395, 116, 126, 112, 87, 61, 63, 64, 84, 135, 18, 1, 10, 50, 18],
            [51986, 1261, 1155, 988, 1184, 934, 529, 519, 900, 463, 593, 372, 281, 318, 226, 283, 229, 162, 157, 418, 116, 126, 119, 90, 65, 65, 67, 86, 140, 18, 1, 10, 53, 18],
            [54406, 1294, 1162, 1001, 1212, 950, 537, 530, 913, 470, 604, 375, 285, 326, 235, 291, 230, 168, 162, 425, 119, 127, 120, 90, 68, 70, 70, 88, 143, 18, 1, 10, 56, 18],
            [56249, 1316, 1167, 1004, 1231, 962, 544, 537, 925, 481, 617, 380, 287, 328, 237, 300, 232, 169, 162, 445, 120, 128, 122, 90, 70, 71, 70, 89, 144, 18, 1, 10, 56, 18],
            [58182, 1322, 1171, 1006, 1246, 973, 551, 541, 930, 495, 626, 381, 290, 331, 238, 301, 236, 171, 162, 457, 121, 129, 124, 90, 72, 75, 70, 89, 146, 18, 1, 10, 57, 20],
            [59989, 1328, 1172, 1007, 1257, 982, 553, 543, 933, 508, 629, 387, 292, 333, 242, 302, 240, 172, 163, 464, 121, 130, 125, 91, 73, 76, 70, 89, 146, 18, 1, 10, 60, 22],
            [61682, 1331, 1173, 1008, 1261, 986, 555, 544, 933, 514, 631, 393, 293, 333, 244, 306, 240, 172, 163, 470, 121, 131, 128, 91, 75, 76, 71, 90, 146, 18, 1, 10, 62, 22],
            [62457, 1332, 1175, 1010, 1265, 987, 560, 546, 934, 520, 631, 395, 293, 333, 245, 307, 242, 172, 168, 476, 121, 131, 130, 91, 75, 76, 71, 91, 146, 18, 1, 10, 65, 24],
            [63088, 1333, 1203, 1011, 1267, 988, 567, 748, 934, 525, 631, 396, 293, 334, 246, 308, 245, 174, 168, 479, 121, 132, 131, 91, 75, 76, 71, 91, 146, 18, 1, 10, 68, 24],
            [63454, 1339, 1205, 1013, 1270, 989, 572, 750, 934, 526, 631, 399, 293, 334, 249, 309, 245, 174, 168, 479, 121, 132, 133, 91, 75, 76, 71, 91, 146, 18, 1, 10, 68, 26],
            [63889, 1342, 1205, 1016, 1271, 989, 573, 754, 934, 526, 631, 399, 293, 335, 249, 311, 245, 174, 168, 480, 121, 132, 135, 91, 75, 76, 71, 91, 146, 18, 1, 10, 69, 26],
            [64287, 1345, 1205, 1016, 1271, 989, 575, 755, 934, 527, 631, 399, 293, 335, 251, 311, 245, 174, 168, 480, 121, 132, 135, 91, 75, 76, 71, 93, 146, 18, 1, 10, 74, 28],
            [64786, 1347, 1205, 1016, 1271, 989, 576, 755, 934, 529, 631, 400, 294, 335, 252, 311, 245, 174, 168, 480, 121, 133, 135, 91, 75, 76, 71, 93, 146, 18, 1, 10, 81, 30],
            [65187, 1347, 1205, 1016, 1271, 989, 576, 756, 934, 531, 631, 400, 294, 336, 252, 312, 245, 174, 168, 480, 121, 133, 135, 91, 75, 76, 71, 93, 146, 18, 1, 10, 85, 31],
            [65596, 1347, 1205, 1017, 1272, 989, 576, 756, 934, 534, 631, 410, 296, 337, 252, 317, 245, 174, 168, 480, 121, 133, 135, 91, 75, 76, 72, 93, 146, 18, 1, 10, 91, 32],
            [65914, 1348, 1205, 1017, 1272, 990, 576, 756, 935, 538, 631, 410, 296, 337, 252, 318, 245, 174, 168, 480, 121, 133, 136, 91, 75, 76, 72, 93, 146, 18, 1, 10, 93, 32],
            [66337, 1349, 1205, 1018, 1272, 990, 576, 756, 935, 538, 631, 411, 296, 337, 252, 318, 245, 174, 168, 480, 121, 133, 136, 91, 75, 76, 73, 93, 146, 18, 1, 10, 94, 34],
            [66907, 1349, 1205, 1018, 1272, 990, 576, 756, 935, 538, 631, 413, 296, 337, 252, 318, 245, 174, 168, 480, 122, 133, 136, 91, 75, 76, 73, 93, 146, 18, 1, 10, 95, 39],
            [67103, 1350, 1206, 1018, 1272, 990, 576, 758, 935, 538, 631, 414, 296, 337, 252, 318, 245, 174, 168, 480, 122, 133, 136, 91, 75, 76, 74, 93, 146, 18, 1, 10, 98, 40],
            [67217, 1350, 1213, 1018, 1272, 990, 576, 758, 935, 538, 631, 414, 296, 338, 252, 318, 245, 174, 168, 480, 125, 133, 136, 91, 75, 76, 74, 93, 146, 18, 1, 10, 100, 41],
            [67332, 1350, 1213, 1018, 1272, 990, 576, 758, 935, 538, 631, 417, 296, 338, 252, 318, 245, 174, 168, 480, 125, 133, 136, 91, 75, 76, 75, 93, 146, 18, 1, 10, 100, 42],
            [67466, 1350, 1215, 1018, 1272, 990, 576, 758, 935, 539, 631, 418, 296, 338, 252, 318, 245, 174, 168, 481, 125, 133, 136, 91, 75, 76, 75, 93, 146, 18, 1, 10, 104, 42],
            [67466, 1350, 1215, 1018, 1272, 990, 576, 758, 935, 539, 631, 418, 296, 339, 252, 318, 245, 174, 168, 481, 125, 133, 136, 91, 75, 76, 75, 93, 146, 18, 1, 10, 104, 42],
            [67466, 1350, 1215, 1018, 1272, 990, 576, 758, 935, 539, 631, 418, 296, 339, 252, 318, 245, 174, 168, 481, 125, 133, 136, 91, 75, 76, 75, 93, 146, 18, 1, 10, 104, 42],
            [67466, 1350, 1215, 1018, 1272, 990, 576, 758, 935, 539, 631, 418, 296, 339, 252, 318, 245, 174, 168, 481, 125, 133, 136, 91, 75, 76, 75, 93, 146, 18, 1, 10, 104, 42],
            [67466, 1350, 1215, 1018, 1272, 990, 576, 758, 935, 539, 631, 418, 296, 339, 252, 318, 245, 174, 168, 481, 125, 133, 136, 91, 75, 76, 75, 93, 146, 18, 1, 10, 104, 42],
            [67466, 1350, 1215, 1018, 1272, 990, 576, 758, 935, 539, 631, 418, 296, 339, 252, 318, 245, 174, 168, 481, 125, 133, 136, 91, 75, 76, 75, 93, 146, 18, 1, 10, 104, 42],
            [67466, 1350, 1215, 1018, 1272, 990, 576, 758, 935, 539, 631, 418, 296, 339, 252, 318, 245, 174, 168, 481, 125, 133, 136, 91, 75, 76, 75, 93, 146, 18, 1, 10, 104, 42],
            [67466, 1350, 1215, 1018, 1272, 990, 576, 758, 935, 539, 631, 418, 296, 339, 252, 318, 245, 174, 168, 481, 125, 133, 136, 91, 75, 76, 75, 93, 146, 18, 1, 10, 104, 42],
            [67466, 1350, 1215, 1018, 1272, 990, 576, 758, 935, 539, 631, 418, 296, 339, 252, 318, 245, 174, 168, 481, 125, 133, 136, 91, 75, 76, 75, 93, 146, 18, 1, 10, 104, 42],
            [67466, 1350, 1215, 1018, 1272, 990, 576, 758, 935, 539, 631, 418, 296, 339, 252, 318, 245, 174, 168, 481, 125, 133, 136, 91, 75, 76, 75, 93, 146, 18, 1, 10, 104, 42],
            [67466, 1350, 1215, 1018, 1272, 990, 576, 758, 935, 539, 631, 418, 296, 339, 252, 318, 245, 174, 168, 481, 125, 133, 136, 91, 75, 76, 75, 93, 146, 18, 1, 10, 104, 42],
            [67466, 1350, 1215, 1018, 1272, 990, 576, 758, 935, 539, 631, 418, 296, 339, 252, 318, 245, 174, 168, 481, 125, 133, 136, 91, 75, 76, 75, 93, 146, 18, 1, 10, 104, 42],
            [67466, 1350, 1215, 1018, 1272, 990, 576, 758, 935, 539, 631, 418, 296, 339, 252, 318, 245, 174, 168, 481, 125, 133, 136, 91, 75, 76, 75, 93, 146, 18, 1, 10, 104, 42],
            [67466, 1350, 1215, 1018, 1272, 990, 576, 758, 935, 539, 631, 418, 296, 339, 252, 318, 245, 174, 168, 481, 125, 133, 136, 91, 75, 76, 75, 93, 146, 18, 1, 10, 104, 42],
            [67466, 1350, 1215, 1018, 1272, 990, 576, 758, 935, 539, 631, 418, 296, 339, 252, 318, 245, 174, 168, 481, 125, 133, 136, 91, 75, 76, 75, 93, 146, 18, 1, 10, 104, 42],
            [67466, 1350, 1215, 1018, 1272, 990, 576, 758, 935, 539, 631, 418, 296, 339, 252, 318, 245, 174, 168, 481, 125, 133, 136, 91, 75, 76, 75, 93, 146, 18, 1, 10, 104, 42],
            [67466, 1350, 1215, 1018, 1272, 990, 576, 758, 935, 539, 631, 418, 296, 339, 252, 318, 245, 174, 168, 481, 125, 133, 136, 91, 75, 76, 75, 93, 146, 18, 1, 10, 104, 42],
            [67466, 1350, 1215, 1018, 1272, 990, 576, 758, 935, 539, 631, 418, 296, 339, 252, 318, 245, 174, 168, 481, 125, 133, 136, 91, 75, 76, 75, 93, 146, 18, 1, 10, 104, 42],
            [67800, 1413, 1238, 1018, 1274, 990, 577, 767, 936, 543, 633, 522, 313, 404, 254, 319, 248, 176, 168, 484, 127, 133, 137, 136, 75, 76, 75, 93, 146, 18, 1, 21, 317, 169],
            [67801, 1428, 1240, 1018, 1274, 990, 578, 768, 936, 545, 636, 554, 318, 414, 254, 319, 249, 176, 168, 484, 127, 134, 141, 136, 75, 76, 75, 93, 146, 18, 1, 25, 356, 195],
            [67801, 1433, 1241, 1018, 1274, 990, 578, 769, 936, 547, 638, 559, 322, 433, 254, 319, 250, 176, 168, 484, 127, 134, 145, 136, 77, 76, 75, 94, 146, 18, 1, 26, 386, 216],
            [67801, 1444, 1243, 1018, 1275, 990, 578, 769, 936, 547, 640, 565, 328, 451, 254, 319, 253, 178, 168, 484, 127, 135, 147, 136, 89, 76, 75, 95, 146, 18, 1, 30, 410, 235],
            [67801, 1456, 1247, 1018, 1275, 990, 578, 771, 936, 548, 641, 569, 331, 468, 254, 319, 253, 180, 168, 484, 128, 135, 152, 136, 92, 76, 75, 95, 146, 18, 1, 33, 453, 252],
            [67801, 1467, 1251, 1018, 1275, 990, 578, 772, 936, 548, 641, 572, 337, 485, 254, 319, 253, 180, 168, 484, 131, 135, 156, 136, 94, 76, 75, 97, 146, 18, 1, 34, 518, 267],
            [67801, 1475, 1254, 1018, 1276, 990, 579, 772, 937, 550, 644, 576, 338, 492, 254, 319, 253, 180, 168, 484, 134, 136, 163, 136, 95, 76, 75, 98, 147, 18, 1, 37, 582, 283],
            [67801, 1484, 1255, 1018, 1276, 990, 579, 773, 937, 550, 645, 577, 340, 498, 254, 321, 253, 180, 168, 484, 136, 136, 166, 138, 97, 76, 75, 98, 147, 18, 1, 38, 641, 298],
            [67801, 1490, 1257, 1018, 1276, 990, 579, 774, 937, 550, 646, 580, 343, 509, 254, 321, 253, 181, 168, 484, 139, 136, 174, 138, 107, 76, 75, 98, 147, 18, 1, 39, 682, 306],
            [67802, 1501, 1257, 1018, 1276, 990, 579, 774, 937, 552, 646, 580, 345, 516, 254, 323, 255, 182, 168, 484, 140, 137, 174, 138, 111, 76, 75, 98, 147, 18, 1, 41, 714, 322],
            [67802, 1507, 1258, 1019, 1276, 990, 579, 775, 937, 554, 647, 582, 345, 522, 254, 325, 255, 183, 168, 488, 140, 137, 176, 138, 117, 76, 75, 98, 147, 18, 1, 41, 765, 329],
            [67802, 1514, 1260, 1019, 1276, 990, 579, 778, 937, 555, 651, 583, 349, 526, 254, 326, 255, 184, 168, 489, 141, 137, 177, 138, 117, 76, 75, 98, 147, 18, 1, 41, 802, 339],
            [67803, 1516, 1262, 1019, 1276, 990, 579, 778, 937, 557, 651, 585, 350, 529, 254, 326, 256, 184, 168, 491, 141, 137, 180, 138, 117, 76, 75, 98, 147, 18, 1, 43, 845, 348],
            [67803, 1524, 1263, 1019, 1276, 990, 579, 779, 937, 558, 651, 586, 350, 531, 254, 327, 256, 184, 168, 504, 142, 138, 180, 138, 117, 76, 75, 98, 147, 18, 1, 44, 862, 355],
            [67803, 1532, 1264, 1019, 1276, 990, 579, 780, 937, 559, 651, 587, 350, 536, 254, 327, 256, 184, 168, 524, 142, 138, 180, 139, 118, 76, 75, 98, 147, 18, 1, 44, 890, 363],
            [67803, 1533, 1265, 1019, 1276, 990, 579, 781, 937, 560, 651, 587, 351, 538, 254, 327, 256, 184, 168, 544, 144, 138, 180, 139, 121, 76, 75, 98, 147, 18, 1, 44, 914, 373],
            [67803, 1536, 1266, 1019, 1276, 990, 579, 783, 937, 560, 651, 588, 351, 543, 254, 327, 256, 184, 168, 569, 144, 163, 180, 139, 124, 76, 75, 98, 147, 18, 1, 44, 935, 376],
            [67803, 1539, 1267, 1019, 1276, 991, 579, 783, 937, 560, 651, 588, 351, 552, 254, 327, 256, 184, 168, 609, 144, 166, 181, 139, 126, 76, 75, 98, 147, 18, 1, 45, 960, 379],
            [67803, 1544, 1267, 1019, 1276, 991, 579, 783, 937, 560, 651, 588, 351, 555, 254, 327, 256, 184, 168, 638, 144, 168, 182, 139, 128, 76, 75, 98, 147, 18, 1, 45, 973, 380],
            [67803, 1548, 1267, 1019, 1276, 991, 579, 784, 937, 560, 652, 589, 351, 555, 254, 327, 256, 184, 168, 661, 145, 172, 183, 139, 155, 76, 75, 98, 147, 18, 1, 45, 989, 382],
            [67803, 1552, 1267, 1019, 1276, 991, 579, 784, 937, 560, 653, 589, 352, 607, 254, 327, 256, 184, 168, 684, 145, 172, 183, 139, 155, 76, 75, 99, 147, 18, 1, 45, 1000, 385],
            [67803, 1555, 1267, 1019, 1276, 991, 579, 784, 937, 560, 653, 589, 352, 618, 254, 327, 256, 184, 168, 740, 145, 173, 184, 139, 190, 76, 75, 100, 147, 18, 1, 45, 1004, 388],
            [67803, 1564, 1267, 1019, 1276, 991, 579, 784, 937, 560, 653, 589, 353, 618, 254, 327, 256, 184, 168, 819, 145, 173, 184, 139, 190, 76, 75, 100, 147, 18, 1, 45, 1009, 393],
            [67803, 1566, 1268, 1019, 1276, 991, 579, 784, 937, 560, 653, 590, 353, 622, 254, 327, 256, 184, 168, 841, 145, 186, 185, 139, 190, 76, 75, 102, 147, 18, 1, 45, 1012, 393],
            [67803, 1571, 1268, 1019, 1276, 991, 579, 784, 937, 560, 653, 593, 353, 628, 254, 328, 256, 184, 168, 861, 145, 194, 185, 139, 193, 76, 75, 102, 147, 18, 1, 45, 1016, 395],
            [68128, 1577, 1268, 1019, 1276, 991, 579, 787, 937, 560, 653, 593, 354, 628, 254, 328, 256, 184, 168, 872, 146, 197, 186, 139, 193, 76, 75, 102, 147, 18, 1, 45, 1017, 395],
            [68128, 1579, 1268, 1019, 1276, 991, 579, 787, 937, 561, 653, 593, 355, 628, 254, 328, 256, 184, 168, 892, 146, 197, 189, 139, 193, 76, 75, 102, 147, 18, 1, 45, 1021, 395],
            [68128, 1580, 1268, 1019, 1276, 991, 579, 787, 937, 561, 653, 593, 355, 635, 254, 328, 256, 184, 168, 898, 146, 197, 189, 139, 193, 76, 75, 104, 147, 18, 1, 45, 1023, 398],
            [68128, 1581, 1268, 1019, 1276, 991, 579, 787, 937, 561, 653, 593, 355, 638, 254, 328, 256, 184, 168, 905, 146, 197, 189, 139, 194, 76, 75, 104, 147, 18, 1, 45, 1025, 420],
            [68128, 1582, 1268, 1019, 1276, 991, 579, 787, 937, 561, 653, 593, 355, 638, 254, 328, 256, 184, 168, 913, 146, 197, 189, 139, 194, 76, 75, 106, 147, 18, 1, 45, 1025, 422],
            [68128, 1582, 1268, 1019, 1276, 991, 579, 787, 937, 561, 653, 593, 355, 639, 254, 328, 277, 184, 168, 921, 146, 197, 189, 139, 194, 76, 75, 106, 147, 18, 1, 45, 1029, 425],
            [68128, 1584, 1268, 1019, 1276, 991, 579, 787, 937, 561, 653, 593, 355, 640, 254, 328, 279, 184, 168, 925, 146, 197, 189, 139, 194, 76, 75, 107, 147, 18, 1, 45, 1033, 426],
            [68128, 1585, 1268, 1019, 1276, 991, 579, 787, 937, 561, 653, 593, 355, 641, 254, 328, 279, 184, 168, 928, 146, 197, 189, 139, 194, 76, 75, 108, 147, 18, 1, 45, 1035, 427],
            [68128, 1585, 1268, 1019, 1276, 991, 579, 787, 937, 561, 653, 593, 355, 641, 254, 328, 286, 185, 168, 930, 146, 197, 190, 139, 197, 76, 75, 109, 147, 18, 1, 45, 1035, 428],
            [68128, 1586, 1268, 1019, 1276, 991, 579, 787, 937, 561, 653, 593, 355, 642, 254, 328, 286, 185, 168, 935, 146, 197, 190, 139, 198, 76, 75, 109, 147, 18, 1, 45, 1037, 429],
            [68128, 1587, 1268, 1019, 1276, 991, 579, 787, 937, 561, 653, 593, 355, 642, 254, 328, 286, 185, 168, 936, 146, 197, 190, 139, 198, 76, 75, 110, 147, 18, 1, 45, 1037, 429],
            [68128, 1587, 1268, 1019, 1276, 991, 579, 787, 937, 561, 653, 593, 355, 644, 254, 328, 286, 185, 168, 939, 146, 197, 190, 139, 199, 76, 75, 110, 147, 18, 1, 45, 1037, 429],
            [68128, 1588, 1268, 1019, 1276, 991, 579, 787, 937, 561, 653, 593, 355, 645, 254, 328, 306, 185, 168, 939, 146, 197, 190, 139, 199, 76, 75, 110, 147, 18, 1, 45, 1037, 429],
            [68128, 1588, 1268, 1019, 1276, 991, 579, 787, 937, 561, 653, 593, 355, 647, 254, 328, 306, 185, 168, 939, 146, 197, 190, 139, 200, 76, 75, 111, 147, 18, 1, 45, 1037, 429],
            [68128, 1588, 1268, 1019, 1276, 991, 579, 787, 937, 561, 653, 593, 356, 652, 254, 328, 306, 185, 168, 944, 146, 197, 190, 139, 201, 76, 75, 111, 147, 18, 1, 45, 1037, 429],
            [68128, 1588, 1268, 1019, 1276, 991, 579, 787, 937, 561, 653, 593, 356, 652, 254, 328, 306, 185, 168, 944, 146, 197, 190, 139, 201, 76, 75, 112, 147, 18, 1, 45, 1039, 429],
            [68128, 1588, 1268, 1019, 1276, 991, 579, 787, 937, 561, 653, 593, 356, 653, 254, 328, 306, 185, 168, 944, 146, 198, 190, 139, 201, 76, 75, 112, 147, 18, 1, 45, 1039, 432],
            [68128, 1588, 1268, 1019, 1276, 991, 579, 788, 937, 561, 653, 593, 356, 655, 254, 328, 306, 185, 168, 944, 146, 198, 190, 139, 201, 76, 75, 112, 147, 18, 1, 45, 1039, 436],
            [68128, 1588, 1268, 1019, 1276, 991, 579, 788, 937, 561, 653, 593, 356, 656, 254, 328, 306, 185, 168, 944, 146, 198, 190, 139, 201, 76, 75, 112, 147, 18, 1, 45, 1040, 438],
            [68128, 1588, 1268, 1019, 1276, 991, 579, 788, 937, 561, 653, 593, 356, 656, 254, 328, 308, 185, 168, 944, 146, 198, 190, 139, 201, 76, 75, 112, 147, 18, 1, 45, 1040, 438],
            [68128, 1589, 1268, 1019, 1276, 991, 579, 788, 937, 561, 653, 593, 356, 657, 254, 328, 308, 185, 168, 944, 146, 198, 190, 139, 201, 76, 75, 112, 147, 18, 1, 45, 1040, 439],
            [68128, 1589, 1268, 1019, 1276, 991, 579, 788, 937, 561, 653, 593, 356, 657, 254, 328, 308, 185, 168, 944, 146, 198, 190, 139, 201, 76, 75, 113, 147, 18, 1, 45, 1044, 440],
            [68128, 1589, 1268, 1019, 1276, 991, 579, 788, 937, 561, 653, 593, 356, 657, 254, 328, 308, 185, 168, 944, 146, 198, 191, 139, 201, 76, 75, 113, 147, 18, 1, 45, 1044, 440],
            [68129, 1589, 1268, 1019, 1276, 991, 579, 788, 937, 561, 653, 593, 356, 659, 254, 328, 308, 185, 168, 944, 146, 198, 191, 139, 201, 76, 75, 124, 147, 18, 1, 45, 1044, 440],
            [68134, 1589, 1268, 1019, 1276, 991, 579, 788, 937, 561, 653, 593, 356, 659, 254, 328, 308, 185, 168, 945, 147, 198, 191, 139, 208, 76, 75, 127, 147, 18, 1, 45, 1047, 440],
            [68134, 1589, 1268, 1019, 1276, 991, 579, 788, 937, 561, 653, 593, 356, 659, 254, 328, 308, 185, 168, 945, 147, 198, 191, 139, 209, 76, 75, 127, 147, 18, 1, 45, 1047, 440],
            [68134, 1589, 1268, 1019, 1276, 991, 579, 788, 937, 561, 653, 593, 356, 660, 254, 328, 308, 185, 168, 945, 147, 198, 191, 139, 209, 76, 75, 133, 147, 18, 1, 45, 1047, 440],
            [68134, 1589, 1268, 1019, 1276, 991, 579, 788, 937, 561, 653, 593, 356, 660, 254, 328, 308, 185, 168, 945, 147, 198, 191, 139, 209, 76, 75, 133, 147, 18, 1, 45, 1050, 440]
        ];
        this.option = null;
        this.myChart = null;

    }
    init() {
        this.myChart = echarts.init(this.container);
        this.option = {
            baseOption: {
                
                timeline: {
                    
                    axisType: 'category',
                    autoPlay: true,
                    playInterval: 1000,
                    symbolSize: 0,
                    left: '5%',
                    right: '5%',
                    bottom: '0%',
                    width: '90%',
                    lineStyle: {
                        color: "white"
                    },
                    label: {
                        color: "white"
                    },
                    controlStyle: {
                        position: 'center'
                    },
                    data: dateChange,
                    tooltip: {
                        show: true,
                        formatter: dateChange
                    },
                },
                tooltip: {
                    show: true,
                    formatter: function (params) {
                        // console.log(params);
                        return params.name + '：' + params.data['value']
                    },
                },
                visualMap: {
                    type: 'piecewise',
                    pieces: [{
                        min: 1002,
                        color: 'rgba(0,0,128,0.8)'
                    },
                    {
                        min: 501,
                        max: 1001,
                        color: 'rgba(25,25,112,0.8)'
                    },
                    {
                        min: 251,
                        max: 500,
                        color: 'rgba(70,130,180,0.8)'
                    },
                    {
                        min: 101,
                        max: 250,
                        color: 'rgba(173,216,230,0.8)'
                    },
                    {
                        min: 11,
                        max: 100,
                        color: 'rgba(176,224,230,0.8)'
                    },
                    {
                        min: 1,
                        max: 10,
                        color: 'rgba(175,238,238,0.8)'
                    },
                    {
                        value: 0,
                        color: 'rgba(255,255,255,0.1)'
                    }
                    ],
                    orient: 'vertical',
                    itemWidth: 25,
                    itemHeight: 15,
                    showLabel: true,
                    seriesIndex: [0],

                    textStyle: {
                        color: '#7B93A7'
                    },
                    bottom: '10%',
                    left: "5%",
                },
                grid: {
                    right: '5%',
                    top: '20%',
                    bottom: '10%',
                    width: '20%'
                },
                xAxis: {
                    show: false
                },
                yAxis: {
                    show: false
                },
                geo: {
                    map: 'china',
                    right: '5%',
                    left: '5%',
                    label: {
                        emphasis: {
                            show: false,
                        }
                    },
                    itemStyle: {
                        normal: {
                            //地图省份的颜色
                            areaColor: 'rgba(20,41,87,0.5)',
                            borderColor: '#0692a4'

                        },
                        emphasis: {
                            areaColor: 'rgba(11,28,45,0.2)'
                        }
                    }
                },
                series: [{
                    name: 'mapSer',
                    type: 'map',
                    map: 'china',
                    roam: false,
                    geoIndex: 0,
                    label: {
                        show: false,
                    },
                },
                ],
            },
            animationDurationUpdate: 3000,
            animationEasingUpdate: 'quinticInOut',
            options: []
        };


        // for(var i=0;i<dateChange.length;i++){
        //    this.option.options.push({
        //         title:{
        //             text:dateChange[i]
        //         }
        //     })
        // }


        for (let n = 0; n < 165; n++) {
            var res = [];
            for (let j = 0; j < this.data[n].length; j++) {
                res.push({
                    name: this.province[j],
                    value: this.data[n][j],
                    date: dateChange[n],
                                   
                });
            }
            res.sort(function (a, b) {
                return b.value - a.value;
            }).slice(0, 6);
            res.sort(function (a, b) {
                return a.value - b.value;
            });
            var res1 = [];
            var res2 = [];
            for (t = 0; t < 10; t++) {
                res1[t] = res[res.length - 1 - t].name;
                res2[t] = res[res.length - 1 - t].value;
            }
            this.option.options.push({
                title:{text:dateChange[n],
                       textStyle:{
                           color:"white"
                       },
                       bottom:"10%",
                       left:"20%"
                },
                series: [{
                    type: 'map',
                    data: res
                }]
            });
        }


        
        
        this.myChart.setOption(this.option);
        console.log(this.myChart);
        
        
       




    }
}
let mapNode = new MapComponent(document.querySelector(".map .chart"));
mapNode.init();
function showCity(city) {
    for (let en = 0; en < 34; en++) {
        if (provinceData[en].provinceShortName === city) {
            console.log(provinceData[en])
            var cities = provinceData[en].cities;
            break;
        }
    }
    let cityData = [];
    for (let i = 0; i < cities.length; i++) {
        cityData.push({
            name: cities[i].cityName,
            value: cities[i].confirmedCount,
        })
    }
    var pie = echarts.init(document.querySelector('.province .chart'));
    pie.clear();
    pie.setOption(option1 = {
        // backgroundColor: '#BBFFFF',
        title: {
            text: city,
            textStyle: {
                color: "white"
            },
            right: '10%',
        },
        geo: {
            show: true,
            map: city,
            left: '28%',
            itemStyle: {
                normal: {
                    areaColor: '#fff',
                    borderColor: '#389BB7',
                },
                emphasis: {
                    areaColor: '#389BB7',
                    borderWidth: 0
                }
            },
            label: {
                emphasis: {
                    textStyle: {
                        color: '#fff',
                    }
                }
            }
        },
        series: [
            {
                type: 'map',
                map: city,
                left: '28%',
                itemStyle: {
                    normal: {
                        areaColor: '#fff',
                        borderColor: '#389BB7',
                    },
                    emphasis: {
                        areaColor: '#389BB7',
                        borderWidth: 0
                    }
                },
                label: {
                    emphasis: {
                        textStyle: {
                            color: '#fff',
                        }
                    }
                },
                data: cityData,
            }
        ],
        tooltip: {
            trigger: 'item',
            triggerOn: 'mousemove',
            show: true,
            formatter: function (value) {
                return value.name + ': ' + value.value;
            }
        },
        visualMap: {
            type: 'piecewise',
            pieces: [{
                min: 1002,
                color: 'rgba(0,0,128,0.8)'
            },
            {
                min: 501,
                max: 1001,
                color: 'rgba(25,25,112,0.8)'
            },
            {
                min: 251,
                max: 500,
                color: 'rgba(70,130,180,0.8)'
            },
            {
                min: 101,
                max: 250,
                color: 'rgba(173,216,230,0.8)'
            },
            {
                min: 11,
                max: 100,
                color: 'rgba(176,224,230,0.8)'
            },
            {
                min: 1,
                max: 10,
                color: 'rgba(175,238,238,0.8)'
            },
            {
                value: 0,
                color: 'rgba(255,255,255,0.1)'
            }
            ],
            orient: 'vertical',
            itemWidth: 25,
            itemHeight: 15,
            showLabel: true,
            seriesIndex: [0],

            textStyle: {
                color: '#7B93A7'
            },
            bottom: '10%',
            left: "0%",
        },
    });
}


mapNode.myChart.on('click', function (params) {
    // 控制台打印数据的名称
    console.log(params);
    showCity(params.name);
    $(".province h2").on("click", "a", function () {
        //console.log($(this).text());
        switch ($(this).text()) {
            case "省份疫情人数分布":
                showCity(params.name);
                break;
            case "死亡率":
                showDetail(params.name);
                break;
            case "感染人数占比":
                showConfirmedRate(params.name);

        };


    });


    showProvinceLine(params.name);
    showAbroad_Local(params.name);
});

//省份详情1
function showDetail(province) {
    var detail = echarts.init(document.querySelector(".province .chart"));
    detail.clear();

    $(document).ready(function () {

        
                //console.log(data);
                var x_data = [];
                var deathrate = [];
                var curedrate = [];
                for (var i = 0; i < provinceData.length; i++) {
                    if (provinceData[i].provinceShortName == province) {
                        for (var j = 0; j < provinceData[i].cities.length; j++) {
                            if (provinceData[i].cities[j].cityName == "境外输入人员" || provinceData[i].cities[j].cityName == "境外输入") {
                                continue
                            }
                            else {
                                x_data.push(provinceData[i].cities[j].cityName);
                                deathrate.push(provinceData[i].cities[j].deadCount / provinceData[i].cities[j].confirmedCount);
                                curedrate.push(provinceData[i].cities[j].curedCount / provinceData[i].cities[j].confirmedCount);
                            }
                        }
                    }
                }
                console.log(x_data);


                var option = {
                    title: {
                        text: province,
                        textStyle: {
                            color: 'white'
                        }
                    },
                    tooltip: {
                        trigger: 'axis'
                    },
                    legend: {

                        textStyle: {
                            color: 'white'
                        }
                    },
                    grid: {
                        left: '3%',
                        right: '4%',
                        bottom: '3%',
                        containLabel: true
                    },

                    xAxis: {
                        type: 'category',
                        axisLabel: {
                            color: 'white',
                            rotate: 60,
                            interval: 0
                        },
                        boundaryGap: false,
                        data: x_data,
                    },
                    yAxis: {
                        type: 'value',
                        axisLabel: {
                            color: 'white'
                        },
                        splitLine: {
                            show: false
                        }
                    },
                    series: [
                        {
                            name: '累计死亡率',
                            type: 'line',
                            stack: '总量',
                            data: deathrate
                        },

                    ]
                };

                detail.setOption(option);

            

    });

    //让图表跟随屏幕在自动的去适应
    window.addEventListener('resize', function () {
        detail.resize();
    });


}


//省份详情2感染人数占比

function showConfirmedRate(province){

    console.log(citypopulation);
    console.log(provinceData);

    var detail2 = echarts.init(document.querySelector(".province .chart"));
    detail2.clear();

    $(document).ready(function () {

        
                //console.log(data);
                var x_data = [];
                var confirmedrate = [];
               
                for (var i = 0; i < provinceData.length; i++) {
                    if (provinceData[i].provinceShortName == province) {
                        for (var j = 0; j < provinceData[i].cities.length; j++) {
                            if (provinceData[i].cities[j].cityName == "境外输入人员" || provinceData[i].cities[j].cityName == "境外输入") {
                                continue
                            }
                            else {
                                x_data.push(provinceData[i].cities[j].cityName);
                                for(var k=0;k<citypopulation.length;k++){
                                    if(citypopulation[k].city==provinceData[i].cities[j].cityName)
                                    {
                                        confirmedrate.push(provinceData[i].cities[j].confirmedCount/ citypopulation[k].value*100);
                                    }
                                    
                                }
                               
                                
                            }
                        }
                    }
                }
                console.log(x_data);


                var option = {
                    title: {
                        text: province,
                        textStyle: {
                            color: 'white'
                        }
                    },
                    tooltip: {
                        trigger: 'axis'
                    },
                    legend: {

                        textStyle: {
                            color: 'white'
                        }
                    },
                    grid: {
                        left: '3%',
                        right: '4%',
                        bottom: '3%',
                        containLabel: true
                    },

                    xAxis: {
                        type: 'category',
                        axisLabel: {
                            color: 'white',
                            rotate: 60,
                            interval: 0
                        },
                        boundaryGap: false,
                        data: x_data,
                    },
                    yAxis: {
                        type: 'value',
                        axisLabel: {
                            color: 'white'
                        },
                        splitLine: {
                            show: false
                        }
                    },
                    series: [
                        {
                            name: '每百万人感染数量',
                            type: 'line',
                            stack: '总量',
                            data: confirmedrate
                        },

                    ]
                };

                detail2.setOption(option);

            

    });

    //让图表跟随屏幕在自动的去适应
    window.addEventListener('resize', function () {
        detail2.resize();
    });


}


//省份疫情变化曲线
function showProvinceLine(province) {
    var provinceConfirmed = [];
    var provinceCured = [];
    var provinceDeath = [];
    for (var i = 0; i < data_provinceline.data_provinceline.length; i++) {
        if (province == data_provinceline.data_provinceline[i].provincename) {
            provinceConfirmed = data_provinceline.data_provinceline[i].confirmed;
            provinceCured = data_provinceline.data_provinceline[i].cured;
            provinceDeath = data_provinceline.data_provinceline[i].death;
        }
    }
    var lineChart = echarts.init(document.querySelector(".lineprovince .chart"));
    var option = {
        title: {
            text: province,
            textStyle: {
                color: "white",
                fontSize: 15
            }
        },

        tooltip: {
            trigger: 'axis'
        },
        legend: {
            top: "0%",


            itemGap: 0,
            textStyle: {
                color: "rgba(255,255,255,.5)",
                fontSize: 12
            },
            data: ['累计确诊数', '治愈总人数', '死亡总人数']
        },
        grid: {
            left: '10',
            top: "30",
            right: '10',
            bottom: '10',
            containLabel: true
        },

        xAxis: {
            type: 'category',
            boundaryGap: false,
            data: ['2020-01-22', '2020-01-23', '2020-01-24', '2020-01-25', '2020-01-26', '2020-01-27', '2020-01-28', '2020-01-29', '2020-01-30', '2020-01-31', '2020-02-01', '2020-02-02', '2020-02-03', '2020-02-04', '2020-02-05', '2020-02-06', '2020-02-07', '2020-02-08', '2020-02-09', '2020-02-10', '2020-02-11', '2020-02-12', '2020-02-13', '2020-02-14', '2020-02-15', '2020-02-16', '2020-02-17', '2020-02-18', '2020-02-19', '2020-02-20', '2020-02-21', '2020-02-22', '2020-02-23', '2020-02-24', '2020-02-25', '2020-02-26', '2020-02-27', '2020-02-28', '2020-02-29', '2020-03-01', '2020-03-02', '2020-03-03', '2020-03-04', '2020-03-05', '2020-03-06', '2020-03-07', '2020-03-08', '2020-03-09', '2020-03-10', '2020-03-11', '2020-03-12', '2020-03-13', '2020-03-14', '2020-03-15', '2020-03-16', '2020-03-17', '2020-03-18', '2020-03-19', '2020-03-20', '2020-03-21', '2020-03-22', '2020-03-23', '2020-03-24', '2020-03-25', '2020-03-26', '2020-03-27', '2020-03-28', '2020-03-29', '2020-03-30', '2020-03-31', '2020-04-01', '2020-04-02', '2020-04-03', '2020-04-04', '2020-04-05', '2020-04-06', '2020-04-07', '2020-04-08', '2020-04-09', '2020-04-10', '2020-04-11', '2020-04-12', '2020-04-13', '2020-04-14', '2020-04-15', '2020-04-16', '2020-04-17', '2020-04-18', '2020-04-19', '2020-04-20', '2020-04-21', '2020-04-22', '2020-04-23', '2020-04-24', '2020-04-25', '2020-04-26', '2020-04-27', '2020-04-28', '2020-04-29', '2020-04-30', '2020-05-01', '2020-05-02', '2020-05-03', '2020-05-04', '2020-05-05', '2020-05-06', '2020-05-07', '2020-05-08', '2020-05-09', '2020-05-10', '2020-05-11', '2020-05-12', '2020-05-13'],
            axisLabel: {
                color: "#4c9bfd",//文本颜色,
                fontSize: 8
            }
        },
        yAxis: {
            type: 'value',
            axisLabel: {
                color: "#4c9bfd"//文本颜色
            },
            axisLine: {
                show: false//去除轴线
            },
            splitLine: {
                lineStyle: "#012f4a" //分割线颜色
            }
        },
        series: [
            {
                name: '累计确诊数',
                type: 'line',
                smooth: true,
                data: provinceConfirmed
            },

            {
                name: '治愈总人数',
                type: 'line',
                smooth: true,
                color: 'MediumSpringGreen',
                data: provinceCured
            },
            {
                name: '死亡总人数',
                type: 'line',
                smooth: true,
                data: provinceDeath
            }

        ]
    };
    lineChart.setOption(option);
    //让图表跟随屏幕在自动的去适应
    window.addEventListener('resize', function () {
        lineChart.resize();
    });


}


//境外输入/本土增长分布
function showAbroad_Local(province) {
    console.log(province);
    var chart_abroad_local = echarts.init(document.querySelector(".line_addout .chart"));
    var localNewAdd = [];
    var importabroad = [];
    for (var i = 0; i < provinceCovidData.provinceCovidData.length; i++) {
        if (province == provinceCovidData.provinceCovidData[i].provincename) {
            localNewAdd = provinceCovidData.provinceCovidData[i].delocalNewAddath;
            importabroad = provinceCovidData.provinceCovidData[i].Importabroad;

            break;
        }
    }
    // console.log(localNewAdd);
    // console.log(importabroad);
    option = {
        tooltip: {
            trigger: 'axis',
            axisPointer: {            // 坐标轴指示器，坐标轴触发有效
                type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
            }
        },
        title: {
            text: province,
            textStyle: {
                color: "white"
            }
        },
        legend: {
            data: ['本土增长', '境外输入'],
            textStyle: {
                color: 'white'
            }
        },
        dataZoom: [
            {
                show: true,
                start: 0,
                end: 100,
                height: 10,
                bottom: 0
            },
            {
                type: 'inside',
                start: 0,
                end: 100
            },
            {
                show: true,
                yAxisIndex: 0,
                filterMode: 'empty',
                top: 0,
                width: 5,
                height: '70%',
                showDataShadow: false,
                left: '99%'
            }
        ],
        grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true
        },
        yAxis: {
            type: 'value',
            splitLine: {
                show: false
            },
            axisLabel: {
                color: 'white'
            }
        },
        xAxis: {
            type: 'category',
            splitLine: {
                show: false
            },
            axisLabel: {
                color: 'white'
            },
            data: ['2020-01-22', '2020-01-23', '2020-01-24', '2020-01-25', '2020-01-26', '2020-01-27', '2020-01-28', '2020-01-29', '2020-01-30', '2020-01-31', '2020-02-01', '2020-02-02', '2020-02-03', '2020-02-04', '2020-02-05', '2020-02-06', '2020-02-07', '2020-02-08', '2020-02-09', '2020-02-10', '2020-02-11', '2020-02-12', '2020-02-13', '2020-02-14', '2020-02-15', '2020-02-16', '2020-02-17', '2020-02-18', '2020-02-19', '2020-02-20', '2020-02-21', '2020-02-22', '2020-02-23', '2020-02-24', '2020-02-25', '2020-02-26', '2020-02-27', '2020-02-28', '2020-02-29', '2020-03-01', '2020-03-02', '2020-03-03', '2020-03-04', '2020-03-05', '2020-03-06', '2020-03-07', '2020-03-08', '2020-03-09', '2020-03-10', '2020-03-11', '2020-03-12', '2020-03-13', '2020-03-14', '2020-03-15', '2020-03-16', '2020-03-17', '2020-03-18', '2020-03-19', '2020-03-20', '2020-03-21', '2020-03-22', '2020-03-23', '2020-03-24', '2020-03-25', '2020-03-26', '2020-03-27', '2020-03-28', '2020-03-29', '2020-03-30', '2020-03-31', '2020-04-01', '2020-04-02', '2020-04-03', '2020-04-04', '2020-04-05', '2020-04-06', '2020-04-07', '2020-04-08', '2020-04-09', '2020-04-10', '2020-04-11', '2020-04-12', '2020-04-13', '2020-04-14', '2020-04-15', '2020-04-16', '2020-04-17', '2020-04-18', '2020-04-19', '2020-04-20', '2020-04-21', '2020-04-22', '2020-04-23', '2020-04-24', '2020-04-25', '2020-04-26', '2020-04-27', '2020-04-28', '2020-04-29', '2020-04-30', '2020-05-01', '2020-05-02', '2020-05-03', '2020-05-04', '2020-05-05', '2020-05-06', '2020-05-07', '2020-05-08', '2020-05-09', '2020-05-10', '2020-05-11', '2020-05-12', '2020-05-13'],
        },
        series: [
            {
                name: '本土增长',
                type: 'bar',
                stack: '总量',
                // label: {
                //     show: true,
                //     position: 'insideRight'
                // },
                data: localNewAdd
            },
            {
                name: '境外输入',
                type: 'bar',
                stack: '总量',
                // label: {
                //     show: true,
                //     position: 'insideRight'
                // },
                data: importabroad,
                color: 'lightblue'
            }
        ]
    };
    chart_abroad_local.setOption(option);
    //让图表随窗口大小自适应调整
    window.addEventListener('resize', function () {
        myChart.resize();
    });


}
//分布
$(document).ready(function () {

    $.get("https://api.tianapi.com/txapi/ncovcity/index?key=bf14c571788513bcd8d1923cbbdcd5fd",
        function (data, status) {
            showCity("湖北");
            showProvinceLine("湖北");
            showAbroad_Local("湖北");
            console.log(data);
            var predata = data.newslist;

            var colId = "confirmedCount"
            var desc = function (x, y)  //降序
            {
                return (x[colId] < y[colId]) ? 1 : -1
            }
            var asc = function (x, y)  //升序
            {
                return (x[colId] > y[colId]) ? 1 : -1
            }
            predata.sort(asc);
            console.log(predata);//数据排序处理



            var no_hubei_province_confirmed = [];
            var no_hubei_totalconfirmed = 0;
            var hubei_totalconfirmed;
            for (var i = 0; i < predata.length; i++) {
                if (predata[i].provinceShortName != "湖北") {
                    no_hubei_province_confirmed.push({ "name": predata[i].provinceShortName, "value": predata[i].confirmedCount });
                    no_hubei_totalconfirmed = no_hubei_totalconfirmed + predata[i].confirmedCount;
                }
                else {
                    hubei_totalconfirmed = predata[i].confirmedCount;
                }
            }
            console.log("其他:" + no_hubei_totalconfirmed);
            console.log(no_hubei_province_confirmed);

            //各省份确诊占比 
            var myChart = echarts.init(document.querySelector(".pie .chart"));
            option = {

                tooltip: {
                    trigger: 'item',
                    formatter: '{a} <br/>{b}: {c} ({d}%)'
                },


                series: [

                    {
                        name: '省份',
                        type: 'pie',
                        selectedMode: 'single',
                        radius: [0, '40%'],

                        label: {
                            position: 'inner'
                        },
                        labelLine: {
                            show: false
                        },
                        data: [
                            { value: no_hubei_totalconfirmed, name: '其他省份' },
                            { value: hubei_totalconfirmed, name: '湖北' },

                        ],
                        color: ['#1c6d90', '#09895a',],
                    },
                    {
                        name: '除湖北外占比',
                        type: 'pie',
                        bottom: 0,
                        startAngle: 90,
                        radius: ['55%', '75%'],
                        labelLine: {
                            length: 20,
                            length2: 30
                        },

                        data: no_hubei_province_confirmed,
                        color: [
                            '#8B0000', '#CD0000', '#EE0000', '#FF0000',
                            '#CD3700', '#EE4000', '#FF4500', '#EE5C42', '#FF6347',
                            '#EE9A00', '	#FFA500',
                            '#EEB422', '	#EEEE00', '#FFFF00',
                            '#32CD32', '#00FF00', '#7CFC00',
                            '#00FF7F', '#7FFFD4', '#00FFFF', '#40E0D0', '#00CED1',
                            '#AFEEEE', '#87CEFA', '#87CEEB', '	#00BFFF', '#1E90FF', '#4169E1', '#8470FF', '#7B68EE', '#6A5ACD', '#483D8B',
                            '#9B30FF', '	#912CEE', '#7D26CD', '#551A8B'

                        ],
                    }
                ]
            };

            myChart.setOption(option);
            //让图表随窗口大小自适应调整
            window.addEventListener('resize', function () {
                myChart.resize();
            });

        });
});




//境外输入
(function(){
    console.log("nihao");
    $(".map h2").on("click", "a", function () {
        if($(this).text()=="全国境外输入分布"){
            console.log("nihao")
        }
    })
})();











//城镇化率与确诊人数关系




//城镇化
function ShowCityRareRelationship(){
    // $.get("https://api.tianapi.com/txapi/ncovcity/index?key=bf14c571788513bcd8d1923cbbdcd5fd",
    // function (data, status) {
    //     console.log(data);
    //     var provinceData=data.newslist;
    //     console.log(provinceData);
        var totaldata=[];
        var average_x=0;
        for(var i=0;i<provinceData.length;i++){
            for(var j=0;j<cityrate.length;j++){
                if(provinceData[i].provinceShortName==cityrate[j].name&&provinceData[i].provinceShortName!="湖北"){
                    var value=[provinceData[i].confirmedCount,cityrate[j].value];
                    average_x=average_x+provinceData[i].confirmedCount;
                    totaldata.push({name:provinceData[i].provinceShortName,value:value});
                }
            }
        }
        average_x=average_x/31;
        console.log(provinceData);
        console.log(totaldata);//数据预处理
    
    
        var myChart=echarts.init(document.querySelector(".main2"));
        myChart.clear();
        var  option = {
            title:{
                text:"各省城镇化率与确诊人数关系散点图（未包含湖北）",
                textStyle:{
                    color:'white'
                },
                left:'30%',
                top:'5%'
                
            },
            
            grid:{
                top:"20%",
                bottom:"15%",
                left:0,
                right:"5%",
                containLabel:true,
                show:false

            },
            tooltip:{
                show:false,
                trigger:'item'
            },
            axisPointer: {
                show: true,
                snap: true,
                lineStyle: {
                    type: 'dashed'
                },
                label: {
                    show: true,
                    margin: 6,
                    backgroundColor: '#556',
                    textStyle: {
                        color: '#fff'
                    }
                },
            },
            xAxis: {
                name:"累计确诊人数",
                nameLocation:'center',
                nameTextStyle:{
                    color:"white",
                    padding:[5,10,,]
                },
                axisLabel:{
                    color:"white",
                    fontSize:8
                },
              splitLine:{
                  show:false
              },
              axisLine:{
                  lineStyle:{
                      color:'white'
                  }
              }
              
            },
            yAxis: {
                name:"城镇化率（%）",
                nameTextStyle:{
                    color:"white",
                    fontSize:12,
                    padding:[10,10,0,50]
                },
                nameLocation:"end",
                axisLabel:{
                    color:"white",
                    fontSize:8
                },
                splitLine:{
                    show:false
                },
                axisLine:{
                    lineStyle:{
                        color:'white'
                    }
                }
               
               
              
            },
            dataZoom: [
                {
                    type: 'slider',
                    show: true,
                    xAxisIndex: [0],
                    start: 0,
                    end: 100
                },
                {
                    type: 'slider',
                    show: true,
                    yAxisIndex: [0],
                    left: '93%',
                    start: 0,
                    end: 100
                },
                {
                    type: 'inside',
                    xAxisIndex: [0],
                    start: 0,
                    end: 100
                },
                {
                    type: 'inside',
                    yAxisIndex: [0],
                    start: 0,
                    end: 100
                }
            ],
            series: [{
                symbolSize: 5,
                data: totaldata,
                markLine: {
                    lineStyle: {
                        type: 'solid'
                    },
                    data: [
                        {type: 'average', name: '平均值'},
                        { xAxis:  average_x   }
                    ]
                },
                label: {
                    show: true,
                    position: 'right',
                    formatter: '{b}',
                    color:"lightblue"
                },
                type: 'scatter'
            }]
        };
    
        myChart.setOption(option);
    
          //让图表随窗口大小自适应调整
        window.addEventListener('resize', function () {
            myChart.resize();
        });

    // })
};

(function(){
    console.log(cityrate);
    
    $.get("https://api.tianapi.com/txapi/ncovcity/index?key=bf14c571788513bcd8d1923cbbdcd5fd",
    function (data, status) {
        console.log(data);
        var provinceData=data.newslist;
        console.log(provinceData);
        var totaldata=[];
        for(var i=0;i<provinceData.length;i++){
            for(var j=0;j<cityrate.length;j++){
                if(provinceData[i].provinceShortName==cityrate[j].name&&provinceData[i].provinceShortName!='湖北'){
                    var value=[provinceData[i].confirmedCount,cityrate[j].value];
                    totaldata.push({name:provinceData[i].provinceShortName,value:value});
                }
            }
        }
        console.log(provinceData);
        console.log(totaldata);//数据预处理
    
    
        var myChart=echarts.init(document.querySelector(".bar2 .chart"));
        myChart.clear();
        var  option = {
           
            grid:{
                top:"20%",
                bottom:"15%",
                left:0,
                right:"5%",
                containLabel:true,
                show:false

            },
            tooltip:{
                show:false,
                trigger:'item'
            },
            axisPointer: {
                show: true,
                snap: true,
                lineStyle: {
                    type: 'dashed'
                },
                label: {
                    show: true,
                    margin: 6,
                    backgroundColor: '#556',
                    textStyle: {
                        color: '#fff'
                    }
                },
            },
            xAxis: {
                name:"累计确诊人数",
                nameLocation:'center',
                nameTextStyle:{
                    color:"white",
                    padding:[5,10,,]
                },
                axisLabel:{
                    color:"white",
                    fontSize:8
                },
              splitLine:{
                  show:false
              },
              axisLine:{
                  lineStyle:{
                      color:'white'
                  }
              }
              
            },
            yAxis: {
                name:"城镇化率（%）",
                nameTextStyle:{
                    color:"white",
                    fontSize:12,
                    padding:[10,10,0,50]
                },
                nameLocation:"end",
                axisLabel:{
                    color:"white",
                    fontSize:8
                },
                splitLine:{
                    show:false
                },
                axisLine:{
                    lineStyle:{
                        color:'white'
                    }
                }
               
               
              
            },
            dataZoom: [
               
                {
                    type: 'inside',
                    xAxisIndex: [0],
                    start: 0,
                    end: 100
                },
                {
                    type: 'inside',
                    yAxisIndex: [0],
                    start: 0,
                    end: 100
                }
            ],
            series: [{
                symbolSize: 5,
                data: totaldata,
                label: {
                    show: true,
                    position: 'right',
                    formatter: '{b}',
                    color:'lightblue'
                },
                type: 'scatter'
            }]
        };
    
        myChart.setOption(option);
    
          //让图表随窗口大小自适应调整
        window.addEventListener('resize', function () {
            myChart.resize();
        });

    })
    
   
    
  
    //ShowCityRareRelationship();
    

})();

//城镇化与确诊感染关系
(function(){
    
    $.get("https://api.tianapi.com/txapi/ncovcity/index?key=bf14c571788513bcd8d1923cbbdcd5fd",
    function (data, status) {
        console.log(data);
        var provinceData=data.newslist;
        console.log(provinceData);
        var totaldata=[];
        var average_x=0;
        for(var i=0;i<provinceData.length;i++){
            for(var j=0;j<cityrate.length;j++){
                if(provinceData[i].provinceShortName==cityrate[j].name&&provinceData[i].provinceShortName!="湖北"){
                    var value=[provinceData[i].confirmedCount,cityrate[j].value];
                    average_x=average_x+provinceData[i].confirmedCount;
                    totaldata.push({name:provinceData[i].provinceShortName,value:value});
                }
            }
        }
        average_x=average_x/31;
        console.log(provinceData);
        console.log(totaldata);//数据预处理
    
    
        var myChart=echarts.init(document.querySelector(".main2"));
        myChart.clear();
        var  option = {
            title:{
                text:"各省城镇化率与确诊人数关系散点图（未包含湖北）",
                textStyle:{
                    color:'white'
                },
                left:'30%',
                top:'5%'
                
            },
            
            grid:{
                top:"20%",
                bottom:"15%",
                left:0,
                right:"5%",
                containLabel:true,
                show:false

            },
            tooltip:{
                show:false,
                trigger:'item'
            },
            axisPointer: {
                show: true,
                snap: true,
                lineStyle: {
                    type: 'dashed'
                },
                label: {
                    show: true,
                    margin: 6,
                    backgroundColor: '#556',
                    textStyle: {
                        color: '#fff'
                    }
                },
            },
            xAxis: {
                name:"累计确诊人数",
                nameLocation:'center',
                nameTextStyle:{
                    color:"white",
                    padding:[5,10,,]
                },
                axisLabel:{
                    color:"white",
                    fontSize:8
                },
              splitLine:{
                  show:false
              },
              axisLine:{
                  lineStyle:{
                      color:'white'
                  }
              }
              
            },
            yAxis: {
                name:"城镇化率（%）",
                nameTextStyle:{
                    color:"white",
                    fontSize:12,
                    padding:[10,10,0,50]
                },
                nameLocation:"end",
                axisLabel:{
                    color:"white",
                    fontSize:8
                },
                splitLine:{
                    show:false
                },
                axisLine:{
                    lineStyle:{
                        color:'white'
                    }
                }
               
               
              
            },
            dataZoom: [
                {
                    type: 'slider',
                    show: true,
                    xAxisIndex: [0],
                    start: 0,
                    end: 100
                },
                {
                    type: 'slider',
                    show: true,
                    yAxisIndex: [0],
                    left: '93%',
                    start: 0,
                    end: 100
                },
                {
                    type: 'inside',
                    xAxisIndex: [0],
                    start: 0,
                    end: 100
                },
                {
                    type: 'inside',
                    yAxisIndex: [0],
                    start: 0,
                    end: 100
                }
            ],
            series: [{
                symbolSize: 5,
                data: totaldata,
                markLine: {
                    lineStyle: {
                        type: 'solid'
                    },
                    data: [
                        {type: 'average', name: '平均值'},
                        { xAxis:  average_x   }
                    ]
                },
                label: {
                    show: true,
                    position: 'right',
                    formatter: '{b}',
                    color:"lightblue"
                },
                type: 'scatter'
            }]
        };
    
        myChart.setOption(option);
    
          //让图表随窗口大小自适应调整
        window.addEventListener('resize', function () {
            myChart.resize();
        });

    })


})();

//受教育程度关系
function showRL_education(){
    var totaldata=[];
    var average_x=0;
    for(var i=0;i<provinceData.length;i++){
        for(var j=0;j<education.length;j++){
            if(provinceData[i].provinceShortName==education[j].name&&provinceData[i].provinceShortName!="湖北"){
                var value=[provinceData[i].confirmedCount,education[j].value];
                average_x=average_x+provinceData[i].confirmedCount;
                totaldata.push({name:provinceData[i].provinceShortName,value:value});
            }
        }
    }
    average_x=average_x/31;
    console.log(provinceData);
    console.log(totaldata);//数据预处理


    var myChart=echarts.init(document.querySelector(".main2"));
    myChart.clear();
    var  option = {
        title:{
            text:"各省高等教育比例与确诊人数关系散点图（未包含湖北）",
            textStyle:{
                color:'white'
            },
            left:'30%',
            top:'5%'
            
        },
        
        grid:{
            top:"20%",
            bottom:"15%",
            left:0,
            right:"5%",
            containLabel:true,
            show:false

        },
        tooltip:{
            show:false,
            trigger:'item'
        },
        axisPointer: {
            show: true,
            snap: true,
            lineStyle: {
                type: 'dashed'
            },
            label: {
                show: true,
                margin: 6,
                backgroundColor: '#556',
                textStyle: {
                    color: '#fff'
                }
            },
        },
        xAxis: {
            name:"累计确诊人数",
            nameLocation:'center',
            nameTextStyle:{
                color:"white",
                padding:[5,10,,]
            },
            axisLabel:{
                color:"white",
                fontSize:8
            },
          splitLine:{
              show:false
          },
          axisLine:{
              lineStyle:{
                  color:'white'
              }
          }
          
        },
        yAxis: {
            name:"高等教育比例",
            nameTextStyle:{
                color:"white",
                fontSize:12,
                padding:[10,10,0,110]
            },
            nameLocation:"end",
            axisLabel:{
                color:"white",
                fontSize:8
            },
            splitLine:{
                show:false
            },
            axisLine:{
                lineStyle:{
                    color:'white'
                }
            }
           
           
          
        },
        dataZoom: [
            {
                type: 'slider',
                show: true,
                xAxisIndex: [0],
                start: 0,
                end: 100
            },
            {
                type: 'slider',
                show: true,
                yAxisIndex: [0],
                left: '93%',
                start: 0,
                end: 100
            },
            {
                type: 'inside',
                xAxisIndex: [0],
                start: 0,
                end: 100
            },
            {
                type: 'inside',
                yAxisIndex: [0],
                start: 0,
                end: 100
            }
        ],
        series: [{
            symbolSize: 5,
            data: totaldata,
           
            markLine: {
                lineStyle: {
                    type: 'solid'
                },
                data: [
                    {type: 'average', name: '平均值'},
                    { xAxis:  average_x   }
                ]
            },
            label: {
                show: true,
                position: 'right',
                formatter: '{b}',
                color:"lightblue"
            },
            type: 'scatter'
        }]
    };

    myChart.setOption(option);

      //让图表随窗口大小自适应调整
    window.addEventListener('resize', function () {
        myChart.resize();
    });
}


//gdp与确诊人数
function showRL_GDP(){
    console.log(provinceData);
    var totaldata=[];
    var average_x=0;
    for(var i=0;i<provinceData.length;i++){
        for(var j=0;j<gdp.length;j++){
            if(provinceData[i].provinceShortName==gdp[j].name&&provinceData[i].provinceShortName!="湖北"){
                var value=[provinceData[i].confirmedCount,gdp[j].value];
                average_x=average_x+provinceData[i].confirmedCount;
                totaldata.push({name:provinceData[i].provinceShortName,value:value});
            }
        }
    }
    average_x=average_x/31;
    console.log(provinceData);
    console.log(totaldata);//数据预处理


    var myChart=echarts.init(document.querySelector(".main2"));
    myChart.clear();
    var  option = {
        title:{
            text:"各省GDP与确诊人数关系散点图（未包含湖北）",
            textStyle:{
                color:'white'
            },
            left:'30%',
            top:'5%'
            
        },
        
        grid:{
            top:"20%",
            bottom:"15%",
            left:0,
            right:"5%",
            containLabel:true,
            show:false

        },
        tooltip:{
            show:false,
            trigger:'item'
        },
        axisPointer: {
            show: true,
            snap: true,
            lineStyle: {
                type: 'dashed'
            },
            label: {
                show: true,
                margin: 6,
                backgroundColor: '#556',
                textStyle: {
                    color: '#fff'
                }
            },
        },
        xAxis: {
            name:"累计确诊人数",
            nameLocation:'center',
            nameTextStyle:{
                color:"white",
                padding:[5,10,,]
            },
            axisLabel:{
                color:"white",
                fontSize:8
            },
          splitLine:{
              show:false
          },
          axisLine:{
              lineStyle:{
                  color:'white'
              }
          }
          
        },
        yAxis: {
            name:"GDP(亿元 数据来源-国家统计局)",
            nameTextStyle:{
                color:"white",
                fontSize:12,
                padding:[10,10,0,110]
            },
            nameLocation:"end",
            axisLabel:{
                color:"white",
                fontSize:8
            },
            splitLine:{
                show:false
            },
            axisLine:{
                lineStyle:{
                    color:'white'
                }
            }
           
           
          
        },
        dataZoom: [
            {
                type: 'slider',
                show: true,
                xAxisIndex: [0],
                start: 0,
                end: 100
            },
            {
                type: 'slider',
                show: true,
                yAxisIndex: [0],
                left: '93%',
                start: 0,
                end: 100
            },
            {
                type: 'inside',
                xAxisIndex: [0],
                start: 0,
                end: 100
            },
            {
                type: 'inside',
                yAxisIndex: [0],
                start: 0,
                end: 100
            }
        ],
        series: [{
            symbolSize: 5,
            data: totaldata,
            markLine: {
                lineStyle: {
                    type: 'solid'
                },
                data: [
                    {type: 'average', name: '平均值'},
                    { xAxis:  average_x   }
                ]
            },
            label: {
                show: true,
                position: 'right',
                formatter: '{b}',
                color:"lightblue"
            },
            type: 'scatter'
        }]
    };

    myChart.setOption(option);

      //让图表随窗口大小自适应调整
    window.addEventListener('resize', function () {
        myChart.resize();
    });
    
}


//卫生水平
function showMedical(){
    var xdata=[];
    var data=[];
    for(var i=0;i<doctor.length;i++){
        xdata.push(doctor[i].name);
        data.push(doctor[i].value)
    }
    var myChart=echarts.init(document.querySelector(".main2"));
    myChart.clear();
    var option = {
        color: ['#3398DB'],
        tooltip: {
            trigger: 'axis',
            axisPointer: {            // 坐标轴指示器，坐标轴触发有效
                type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
            }
        },
        grid: {
            left: '0%',
            right: '4%',
            bottom: '5%',
            containLabel: true
        },
        xAxis: [
            {
                
                type: 'category',
                data: xdata,
                axisTick: {
                    alignWithLabel: true
                },
                axisLabel:{
                    color:'white',
                    interval:0
                }
            }
        ],
        yAxis: [
            {
                name:"每万人拥有卫生技术人员（人）",
                nameTextStyle:{
                    color:'white',
                    padding:[10,10,0,130]
                },
                type: 'value',
                axisLabel:{
                    color:'white'
                }
            }
        ],
        series: [
            {
                name: '每万人拥有卫生技术人员',
                type: 'bar',
                barWidth: '60%',
                barCategoryGap :'1%',
                data: data
            }
        ]
    };
    myChart.setOption(option); 
     //让图表随窗口大小自适应调整
     window.addEventListener('resize', function () {
        myChart.resize();
    });   
}


//教育程度关系
(function(){
    $("#education").click(function(){
        showRL_education()
      });

    $("#citypopulationrate").click(function(){
        ShowCityRareRelationship();
      });
    $("#gdp").click(function(){
        showRL_GDP();
      });
    $("#doctor").click(function(){
        showMedical();
      });



})();



//境外输入详情页面板

(function(){
    $.get("https://api.tianapi.com/txapi/ncovcity/index?key=bf14c571788513bcd8d1923cbbdcd5fd",
    function(data,status){
       // console.log(data);
        var PD=data.newslist;
        var PDOUT=[];
        console.log(PD);
        for(var i=0;i<PD.length;i++){
            for(var j=0;j<PD[i].cities.length;j++){
                if(PD[i].cities[j].cityName=="境外输入"||PD[i].cities[j].cityName=="境外输入人员"){
                    PDOUT.push({name:PD[i].provinceShortName,value:PD[i].cities[j].confirmedCount});
                }
            }
        }
        PDOUT.push({name:"四川",value:16});
        PDOUT.push({name:"广东",value:212});
        console.log(PDOUT);




        

            var colId = "value"
            var desc = function (x, y)  //降序
            {
                return (x[colId] < y[colId]) ? 1 : -1
            }
            var asc = function (x, y)  //升序
            {
                return (x[colId] > y[colId]) ? 1 : -1
            }
            PDOUT.sort(desc);
            console.log(PDOUT);//数据排序处理

            var data=[];
            var x_data=[];
            for(var k=0;k<10;k++){
                data.push(PDOUT[k].value);
                x_data.push(PDOUT[k].name);
            }



            var myChart=echarts.init(document.querySelector(".line_province .chart"));
            myChart.clear();
            var option = {
                color: ['#3398DB'],
                tooltip: {
                    trigger: 'axis',
                    axisPointer: {            // 坐标轴指示器，坐标轴触发有效
                        type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
                    }
                },
                grid: {
                    left: '0%',
                    right: '4%',
                    bottom: '5%',
                    top:'20%',
                    containLabel: true
                },
                xAxis: [
                    {
                        
                        type: 'category',
                        data: x_data,
                        axisTick: {
                            alignWithLabel: true
                        },
                        axisLabel:{
                            color:'white',
                            interval:0,
                            rotate:30
                        },
                        axisLine:{
                            lineStyle:{color:'white'}
                            
                        },
                        splitLine:{
                            show:false
                        }
                    }
                ],
                yAxis: [
                    {
                        name:"境外输入累计确诊",
                        nameTextStyle:{
                            color:'white',
                            padding:[10,10,0,130]
                        },
                        type: 'value',
                        axisLabel:{
                            color:'white'
                        },
                        axisLine:{
                            lineStyle:{color:'white'}
                            
                        },
                        splitLine:{
                            show:false
                        }
                        
                    }
                ],
                series: [
                    {
                        name: '境外输入累计确诊',
                        type: 'bar',
                        barWidth: '60%',
                        barCategoryGap :'1%',
                        data: data
                    }
                ]
            };
            myChart.setOption(option); 
             //让图表随窗口大小自适应调整
             window.addEventListener('resize', function () {
                myChart.resize();
            });   



		
    });
})();



function showoutdetail1(){

}



