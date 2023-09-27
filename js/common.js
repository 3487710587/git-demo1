//配置基地址
axios.defaults.baseURL = 'https://hmajax.itheima.net'

//封装提示信息
function showToast(msg) {
    const toastDom = document.querySelector('.my-toast')
    const toast = new bootstrap.Toast(toastDom)
    document.querySelector('.toast-body').innerHTML = msg
    toast.show()
}

//token验证
function checkToken() {
    const token = localStorage.getItem('token')
    if (token === null) {
        showToast('用户未登录，请先登录!')
        setTimeout(() => {
            location.href = './login.html'
        }, 1000)
    }
}

//渲染用户名
function renderUsername(selector) {
    const username = localStorage.getItem('username')
    document.querySelector(selector).innerHTML = username
}

//退出
function logout() {
    const logoutBtn = document.querySelector('#logout')
    logoutBtn.addEventListener('click', function () {
        localStorage.removeItem('token')
        localStorage.removeItem('username')
        showToast('退出成功!')
        setTimeout(() => {
            location.href = './login.html'
        }, 1000)
    })
}

//请求拦截器
axios.interceptors.request.use(function (config) {
    const token = localStorage.getItem('token')
    if (token) {
        config.headers['Authorization'] = token
    }
    return config
}, function (err) {
    return Promise.reject(err)
})
//响应拦截器
axios.interceptors.response.use(function (response) {
    return response
}, function (err) {
    showToast(err.response.data.message)
    if (err.response.status === 401) {
        localStorage.removeItem('token')
        localStorage.removeItem('username')
        setTimeout(() => {
            location.href = './login.html'
        }, 2000)
    }
    return Promise.reject(err)
})