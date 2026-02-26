const adminEmail = document.querySelector('#login_page_admin_email')
const adminPwd = document.querySelector('#login_page_admin_pwd')
const loginBtn = document.querySelector('.admin-loginBtn')

if(loginBtn){
    loginBtn.addEventListener('click', async (e)=>{
        console.log("CLICK WORKS")
        e.preventDefault()

        if(!adminEmail.value.trim() || !adminPwd.value.trim()){
            Swal.fire({
                icon: 'warning',
                title: 'Please complete the information',
                timer: 1500,
                showConfirmButton: false
            })
            return
        }

        const payload = {
            adminEmail: adminEmail.value.trim(),
            adminPassword: adminPwd.value
        }

        try{
            const res = await fetch("/checkLoginAdminData",{
                method:"POST",
                headers:{ 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            })

            const data = await res.json()

            if(!data.checkAdmin){
                Swal.fire({
                    icon: data.icon,
                    title: data.title,
                    text: data.text,
                    timer: 2000,
                    showConfirmButton: false
                })
            }else{
                window.location.replace(data.page)
            }

        }catch(err){
            Swal.fire({
                icon: 'error',
                title: 'Server error'
            })
        }
    })
}