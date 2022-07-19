const axios = require('axios'); 
const prompt = require('prompt-sync')()
const url = 'http://localhost:3000/comments'
const url2 = 'http://localhost:3000/profile'
const check_number = function(){
    let phone_check = Number(prompt('Enter your Id 👉 '));
    if(Number.isSafeInteger(phone_check)){
        return phone_check
    }else{
       console.log('Id shoud be in integer form 👌');
       return check_number()
    }
}
const password = function(){
    let array = ['@','#','!','$','%','^','&','*','?','~']
    const passwd = prompt('Enter your password 👉 ')
    for(let arr of array){
        if(passwd.length == "8" && passwd.includes(arr)){
            return passwd
        }
    }
    console.log("Your password shoud be 8 charecter and add some special charecter 👌");
    return password()
}
const check_email = function(){
    const email = prompt('Enter your email 👉 ');
    if(email.includes('@gmail.com')){
        return email
    }else{
        console.log('Please enter valid email...... 👌');
        return check_email()
    }
}
const Signup = async(id,username,password,email)=>{
    try {
        let data = {
            "id": id,
            'username':username,
            "password":password,
            'email':email
        }
        await axios.post(url,data)
        console.log('Your account created successfully..... 👍');
    } catch (error) {
        console.log('This id allready exist 🙁');
    }
}
const read = async(id)=>{
    try {
        const info = await axios.get(url+'/'+id)
        console.log(info.data);
    } catch (error) {
        console.log('Id does not exist\nplease try again 😔' );
    }
}
const update = async(userid)=>{
    const check_id = await axios.get(url)
    let li2 = []
    for(val of check_id.data){
        li2.push(val.id)
        if(userid == val.id){
            console.log("1.userName\n2.password\n3.email");
            const update_user = prompt("Enter your choice 👉 ")
            if(update_user == 1){
                const username_update = prompt('Enter your new userName 👉 ')
                await axios.patch(url+'/'+userid,{'username':username_update})
                console.log("username has been updated successfully....... 👍");
            }else if(update_user == 2){
                const username_update2 = password()
                await axios.patch(url+'/'+userid,{'password':username_update2})
                console.log("password has been updated successfully....... 👍");
            }else if(update_user == 3){
                const username_update3 = check_email()
                await axios.patch(url+'/'+userid,{'email':username_update3})
                console.log("email has been updated successfully....... 👍");
            }
        }
    }
    if(!li2.includes(userid)){
        console.log('Id does not exist 😔');
    }
}
const delete1 = async(userid3)=>{
    try {
        await axios.delete(url+'/'+userid3)
        console.log('Your accoun has been deleted successfully....... 👍');
    } catch (error) {
        console.log('Id does not exist 😔');
    }
}
const Login = async()=>{ 
    try {
        const username1 = []
        const password1 = []
        let info = await axios.get(url2)
        const data = await axios.get(url)
        for(let info of data.data){
            username1.push(info.username)
            password1.push(info.password)
        }
        for(let login of info.data){
            username1.push(login[0])
            password1.push(login[1])
        }
        let loop = "true";
            while(loop == "true"){
                let username = prompt('Enter your userName 👉 ')
                if(username1.includes(username)){
                    let passwd = prompt('Enter your paassword 👉 ')
                    if(password1.includes(passwd)){
                        loop = "false"
                        const username2 = []
                        const password2 = []
                        let info2 = await axios.get(url2)
                        for(let login of info2.data){
                            username2.push(login[0])
                            password2.push(login[1])
                        }
                        if(username2.includes(username)&&(password2.includes(passwd))){
                            console.log(data.data);
                        }else if(username1.includes(username)&&(password1.includes(passwd))){
                            console.log('\npress 1 for read\npress 2 for update\npress 3 for delete\n')
                            const choice = parseInt(prompt('Enter your choice 👉'))
                            if(choice == 1){
                                const id = check_number()
                                await read(id)
                            }else if(choice == 2){
                                const userId = check_number()
                                await update(userId)
                            }else if(choice == 3){
                                const userId3 = check_number()
                                await delete1(userId3)
                            }
                        }
                    }else{
                        console.log("password incorrect.......🙁");
                    }
                }else{
                    console.log("username incorrect........🙁");
                }
            }
    } catch (error) {
        console.log(error.messege);
    }
}
const Admin = async()=>{
    try {
        const admin_data = []
        const admin_username = prompt("Enter your username 👉")
        const passwd = password()
        admin_data.push(admin_username)
        admin_data.push(passwd)
        await axios.post(url2,admin_data)
        console.log('You are now admin')
    } catch (error) {
        console.log('This username and password allready exist 🙁');
    }
}
const fast_runner = async(url)=>{
    while(true){
        console.log('\npress 1 for signup\npress 2 for login\npress 3 for admin\npress 4 for exit\n');
        const user = prompt("Enter your choice 👉")
        if(user == 1){
            const userId = check_number()
            let data = await axios.get(url)
            let li = []
            for(id1 of data.data){
                li.push(id1.id);
            }
            if(!li.includes(userId)){
                const userName = prompt('Enter your userName 👉 ')
                const passwd = password()
                const email = check_email()
                await Signup(userId,userName,passwd,email)
            }else{
                console.log('This id allready exist 🙁' );
            }
        }else if(user == 2){
            await Login()
        }else if(user == 3){
            await Admin()
        }else if(user == 4){
            console.log('🖕🖕');
            break
        }
    }
}
fast_runner(url)