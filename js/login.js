//登录业务
const loginBtn = document.querySelector('#btn-login')
loginBtn.addEventListener('click', async function () {
    const form = document.querySelector('.login-form')
    const data = serialize(form, { hash: true, empty: true })
    if (data.username.trim() === '' || data.password.trim() === '') {
        return showToast('用户名和密码不能为空')
    }
    if (data.username.length < 8 || data.username.length > 30) {
        return showToast('用户名的长度为8-30位')
    }
    if (data.password.length < 6 || data.password.length > 30) {
        return showToast('密码的长度为6-30位')
    } 
        const res = await axios.post('/login', data)
        showToast(res.data.message)

        localStorage.setItem('token', res.data.data.token)
        localStorage.setItem('username', res.data.data.username)
        setTimeout(() => {
            location.href = './index.html'
        }, 1000) 
})

//回车自动登录
const passwordBtn = document.querySelector('#input-password')
passwordBtn.addEventListener('keyup', function (e) {
    if (e.key === "Enter") {
        loginBtn.click()
    }
})