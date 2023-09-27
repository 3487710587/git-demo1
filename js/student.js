//token验证
checkToken()

//渲染用户名
renderUsername('.username')

//绑定退出事件
logout()

//渲染数据
render()
async function render() {
    const studentsList = await axios({ url: '/students' })
    const data = studentsList.data.data
    const list = document.querySelector('.list')
    const studentData = data.map(item => {
        return `<tr>
                      <td>${item.name}</td>
                      <td>${item.age}</td>
                      <td>${(item.gender == 0) ? '男' : '女'}</td>
                      <td>第${item.group}组</td>
                      <td>${item.hope_salary}</td>
                      <td>${item.salary}</td>
                      <td>${item.province} ${item.city} ${item.area}</td>
                      <td>
                        <a href="javascript:;" class="text-success mr-3"><i class="bi bi-pen" data-id="${item.id}"></i></a>
                        <a href="javascript:;" class="text-danger"><i class="bi bi-trash" data-id="${item.id}"></i></a>
                      </td>
                    </tr >`
    }).join('')
    list.innerHTML = studentData
    document.querySelector('.total').innerHTML = data.length
}

//添加学生
const modalDom = document.querySelector('#modal')
const openModal = document.querySelector('#openModal')
const modal = new bootstrap.Modal(modalDom)
const form = document.querySelector('#form')
openModal.addEventListener('click', function () {
    modal.show()
})

//给确认按钮绑定点击事件  添加学生
const addBtn = document.querySelector('#submit')
addBtn.addEventListener('click', async function () {
    const formData = serialize(form, { hash: true, empty: true })
    const flag = Object.values(formData).every(item => item !== '')
    formData.age = +formData.age
    formData.gender = +formData.gender
    formData.hope_salary = +formData.hope_salary
    formData.salary = +formData.salary
    formData.group = +formData.group
    if (flag && (formData.group < 8)) {
        if (modalDom.dataset.id !== 'add') {
            await axios.put(`/students/${modalDom.dataset.id}`, formData)
            form.reset()
            modal.hide()
            render()
            showToast('编辑成功')
        } else {
            const rea = await axios.post('/students', formData)
            render()
            modal.hide()
            showToast('添加成功')
        }
    }
})

//获取省份
const provinceDom = document.querySelector('[name="province"]')
async function get() {
    const province = await axios({ url: '/api/province' })
    const provinceData = province.data.list.map(item => {
        return `<option value="${item}">${item}</option>`
    }).join('')
    provinceDom.innerHTML += provinceData
}
get()
//获取城市
let pname
const cityDom = document.querySelector('[name="city"]')
provinceDom.addEventListener('change', async function () {
    pname = provinceDom.value
    const city = await axios({ url: '/api/city', params: { pname } })
    const cityData = city.data.list.map(item => {
        return `<option value="${item}">${item}</option>`
    }).join('')
    cityDom.innerHTML += cityData
})
//获取地区
const areaDom = document.querySelector('[name="area"]')
cityDom.addEventListener('change', async function () {
    const cname = cityDom.value
    const area = await axios({ url: '/api/area', params: { pname, cname } })
    const areaData = area.data.list.map(item => {
        return `<option value="${item}">${item}</option>`
    }).join('')
    areaDom.innerHTML += areaData
})

//删除和编辑学生信息
const list = document.querySelector('.list')
list.addEventListener('click', async function (e) {
    const id = e.target.dataset.id
    //删除学生信息
    if (e.target.classList.contains('bi-trash')) {
        await axios.delete(`/students/${id}`)
        render()
        showToast('删除成功')
    }
    //编辑学生信息
    if (e.target.classList.contains('bi-pen')) {
        //回显 
        const res = await axios({ url: `/students/${id}` })
        const item = document.querySelectorAll('form [name]')
        item.forEach(tag => {
            if (tag.name === 'gender') {
                if (+tag.value === res.data.data.gender) tag.checked = true
            } else {
                tag.value = res.data.data[tag.name]
            }
        })
        //回显省份信息
        const { data: { list: city } } = await axios.get('/api/city', { params: { pname: res.data.data.province } })
        const chtml = city.map((item) => `<option value="${item}">${item}</option>`).join('')
        cityDom.innerHTML += chtml
        cityDom.value = res.data.data.city
        const { data: { list: area } } = await axios.get('/api/area', { params: { pname: res.data.data.province, cname: res.data.data.city } })
        const ahtml = area.map((item) => `<option value="${item}">${item}</option>`).join('')
        areaDom.innerHTML = `<option value="">--区--</option>${ahtml}`
        areaDom.value = res.data.data.area
         
        modalDom.querySelector('.modal-title').innerHTML = '修改学员'
        modalDom.dataset.id = res.data.data.id
        modal.show()
    }
})