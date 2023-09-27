//token验证
checkToken()

//渲染用户名
renderUsername('.username')

//绑定退出事件
logout()

//渲染数据
getData()
async function getData() {
    const res = await axios({ url: '/dashboard' })
    const { overview, year, salaryData, groupData, provinceData } = res.data.data
    //渲染成功返回的数据
    Object.keys(overview).forEach(key => {
        document.querySelector(`.${key}`).innerHTML = overview[key]
    })

    //2022年下载走势
    renderYear(year)
    //班级薪资分布
    renderSalaryData(salaryData)
    //班级每组薪资
    renderGroupData(groupData, '1')
    //男女薪资分布
    renderGender(salaryData)
    //点击事件要获取的数据
    getdata(groupData)
    //籍贯分布
    renderProvinceData(provinceData)
}

//2022年下载走势
function renderYear(year) {
    const line = document.querySelector('#line')
    const myChart = echarts.init(line)
    const option = {
        title: {
            text: '2022年薪资走势',
            left: 10,
            top: 10,
            textStyle: {
                fontWeight: 500
            }
        },
        tooltip: {
            trigger: 'axis'
        },
        xAxis: {
            type: 'category',
            data: year.map(v => v.month),
            axisLine: {
                lineStyle: {
                    type: 'dashed'
                }
            }
        },
        yAxis: {
            type: 'value',
            splitLine: {
                lineStyle: {
                    type: 'dashed'
                }
            }
        },
        series: [
            {
                data: year.map(v => v.salary),
                type: 'line',
                smooth: true,
                symbolSize: 10,
                lineStyle: {
                    width: 8,
                    color: '#4fa9ff'
                },
                areaStyle: {
                    color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                        {
                            offset: 0,
                            color: '#499FEE'
                        },

                        {
                            offset: 0.8,
                            color: 'rgba(255,255,255,0.2)',
                        },
                        {
                            offset: 1,
                            color: 'rgba(255,255,255,0)'
                        }
                    ])
                }
            }
        ]
    }
    myChart.setOption(option)
    window.addEventListener('resize', function (myChart) {
        myChart.resize()
    })
}
//班级薪资分布
function renderSalaryData(salaryData) {
    const salary = document.querySelector('#salary')
    const myChart = echarts.init(salary)
    const option = {
        title: {
            text: '班级薪资分布',
            top: 15,
            left: 15,
            textStyle: {
                fontWeight: 500
            }
        },
        tooltip: {
            trigger: 'item'
        },
        legend: {
            bottom: '5%',
            left: 'center'
        },
        series: [
            {
                name: '班级薪资分布',
                bottom: 40,
                type: 'pie',
                radius: ['50%', '65%'],
                avoidLabelOverlap: false,
                itemStyle: {
                    borderRadius: 10,
                    borderColor: '#fff',
                    borderWidth: 2
                },
                label: {
                    show: false,
                    position: 'center'
                },
                labelLine: {
                    show: false
                },
                data: salaryData.map(item => {
                    return { value: item.g_count + item.b_count, name: item.label }
                })
            }
        ],
        color: ['#fda224', '#5097ff', '#3abcfa', '#34d39a']
    }
    myChart.setOption(option)
    window.addEventListener('resize', function (myChart) {
        myChart.resize()
    })
}
//班级每组薪资
function renderGroupData(groupData, id) {

    const lines = document.querySelector('#lines')
    const myChart = echarts.init(lines)
    const option = {
        tooltip: {
            trigger: 'item'
        },
        xAxis: {
            type: 'category',
            data: groupData[`${id}`].map(item => item.name),
            axisLine: {
                lineStyle: {
                    type: 'dashed'
                }
            }
        },
        yAxis: {
            type: 'value',
            splitLine: {
                lineStyle: {
                    type: 'dashed'
                }
            }
        },
        grid: {
            left: 70,
            top: 30,
            right: 30,
            bottom: 50,
        },
        series: [
            {
                name: '期望薪资',
                data: groupData[`${id}`].map(item => item.hope_salary),
                type: 'bar'
            },
            {
                name: '就业薪资',
                data: groupData[`${id}`].map(item => item.salary),
                type: 'bar'
            }
        ],
        color: [{
            type: 'linear',
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [{
                offset: 0, color: '#34D39A' // 0% 处的颜色
            }, {
                offset: 1, color: 'rgba(52,211,154,0.2)' // 100% 处的颜色
            }],
            global: false // 缺省为 false
        }, {
            type: 'linear',
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [{
                offset: 0, color: '#499FEE' // 0% 处的颜色
            }, {
                offset: 1, color: 'rgba(73,159,238,0.2)' // 100% 处的颜色
            }],
            global: false // 缺省为 false
        }]
    };
    myChart.setOption(option)
    window.addEventListener('resize', function (myChart) {
        myChart.resize()
    })
}
//点击事件
function getdata(groupData) {
    const btns = document.querySelectorAll('.btn-xs')
    btns.forEach((item, index) => {
        item.addEventListener('click', async function () {
            const blueBtn = document.querySelector('.btn-blue')
            blueBtn && blueBtn.classList.remove('btn-blue')
            this.classList.add('btn-blue')
            renderGroupData(groupData, index + 1)
        })
    })
}
//男女薪资分布
function renderGender(genderData) {
    const gender = document.querySelector('#gender')
    const myChart = echarts.init(gender)
    const option = {
        title: [{
            text: '男女薪资分布',
            top: '15',
            left: '15',
            textStyle: {
                fontSize: 18
            }
        }, {
            text: '男生',
            left: 'center',
            top: '45%',
            textStyle: {
                fontSize: 12
            }
        }, {
            text: '女生',
            left: 'center',
            top: '85%',
            textStyle: {
                fontSize: 12
            }
        }],
        tooltip: {
            trigger: 'item'
        },
        series: [
            {
                type: 'pie',
                radius: ['20%', '30%'],
                center: ['50%', '30%'],
                data: genderData.map(item => ({ value: item.b_count, name: item.label }))
            }, {
                type: 'pie',
                radius: ['20%', '30%'],
                center: ['50%', '70%'],
                data: genderData.map(item => ({ value: item.g_count, name: item.label }))
            }
        ],
        color: ['#FDA224', '#5097FF', '#3ABCFA', '#34D39A']
    }
    myChart.setOption(option)
    window.addEventListener('resize', function (myChart) {
        myChart.resize()
    })
}
//  籍贯分布
function renderProvinceData(provinceData) {
    const dataList = [
        { name: '南海诸岛', value: 0 },
        { name: '北京', value: 0 },
        { name: '天津', value: 0 },
        { name: '上海', value: 0 },
        { name: '重庆', value: 0 },
        { name: '河北', value: 0 },
        { name: '河南', value: 0 },
        { name: '云南', value: 0 },
        { name: '辽宁', value: 0 },
        { name: '黑龙江', value: 0 },
        { name: '湖南', value: 0 },
        { name: '安徽', value: 0 },
        { name: '山东', value: 0 },
        { name: '新疆', value: 0 },
        { name: '江苏', value: 0 },
        { name: '浙江', value: 0 },
        { name: '江西', value: 0 },
        { name: '湖北', value: 0 },
        { name: '广西', value: 0 },
        { name: '甘肃', value: 0 },
        { name: '山西', value: 0 },
        { name: '内蒙古', value: 0 },
        { name: '陕西', value: 0 },
        { name: '吉林', value: 0 },
        { name: '福建', value: 0 },
        { name: '贵州', value: 0 },
        { name: '广东', value: 0 },
        { name: '青海', value: 0 },
        { name: '西藏', value: 0 },
        { name: '四川', value: 0 },
        { name: '宁夏', value: 0 },
        { name: '海南', value: 0 },
        { name: '台湾', value: 0 },
        { name: '香港', value: 0 },
        { name: '澳门', value: 0 },
    ]
    dataList.forEach(it => {
        const obj = provinceData.find(item => item.name.replace(/省|回族自治区|吾尔自治区|壮族自治区|特别行政区|自治区/g, '') === it.name)
        if (obj) it.value = obj.value
    })

    const map = document.querySelector('#map')
    const myChart = echarts.init(map)
    var option = {
        title: {
            text: '籍贯分布',
            left: '10',
            top: '10',
            textStyle: {
                fontSize: 18
            }
        },
        tooltip: {
            trigger: 'item',
            formatter: '{b}: {c} 位学员'
        },
        visualMap: {
            min: 0,
            max: 6,
            text: ['High', 'Low'],
            realtime: false,
            calculable: true,
            inRange: {
                color: ['#fff', '#0075f0']
            }
        },
        series: [
            {
                name: '学员人数',
                type: 'map',
                mapType: 'china',
                selectedMode: 'single',
                roam: false,
                itemStyle: {
                    normal: {
                        borderColor: '#ccc',
                        borderWidth: 1,
                        areaColor: '#fff',
                    },
                    emphasis: {
                        areaColor: '#34d39a',
                        borderWidth: 0
                    }
                },
                label: {
                    normal: {
                        show: true,
                    },
                    emphasis: {
                        show: true,
                    }
                },
                data: dataList
            }
        ]
    }

    myChart.setOption(option)
    window.addEventListener('resize', function (myChart) {
        myChart.resize()
    })
}


