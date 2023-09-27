//注册业务
const registerBtn = document.querySelector('#btn-register')
registerBtn.addEventListener('click', async function () {
    const form = document.querySelector('.register-form')
    const data = serialize(form, { hash: true, empty: true })
    if (data.username.trim() === '' || data.password.trim() === '') {
        return showToast('账户或密码不能为空')
    }
    if (data.username.length < 8 || data.username.length > 30) {
        return showToast('用户名不可以少于8位')
    }
    if (data.password.length < 6 || data.password.length > 30) {
        return showToast('密码不可以少于6位')
    }
    const res = await axios.post('/register', data)
    showToast(res.data.message)
})