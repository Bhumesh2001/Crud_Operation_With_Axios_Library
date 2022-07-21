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
const update = async(userid)=>{
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
        for(let admin_data of info.data ){
            username1.push(admin_data['username']);
            password1.push(admin_data['password']);
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
                            username2.push(login['username'])
                            password2.push(login['password'])
                        }
                        if(username2.includes(username)&&(password2.includes(passwd))){
                            console.log(data.data);
                        }else if(username1.includes(username)&&(password1.includes(passwd))){
                            console.log('Login successful.......');
                            for(let check of data.data){
                                if(username == check['username'] && passwd == check['password']){
                                    var admin_id = check['id']
                                }
                            }
                            while (true) {
                                console.log('\npress 1 for read\npress 2 for update\npress 3 for delete\npress 4 for logout\n')
                                const choice = parseInt(prompt('Enter your choice 👉'))
                                if(choice == 1){
                                    const info = await axios.get(url+'/'+admin_id)
                                    console.log(info.data);
                                }else if(choice == 2){
                                    await update(admin_id)
                                }else if(choice == 3){
                                    const del = prompt('Are your sure to delete your account y or n :- ')
                                    if(del == "y"){
                                        await axios.delete(url+'/'+admin_id)
                                        console.log('Your accoun has been deleted successfully....... 👍');
                                    }
                                }else if(choice == 4){
                                    console.log('you has been logout.');
                                    break
                                }
                            }
                        }
                    }else{
                        console.log("password incorrect.......🙁");
                    }
                }else{
                    console.log("username incorrect........🙁");
                }
            }
    } catch (error){
        console.log(error.messege);
    }
}
const Admin = async()=>{
    try {
        const info_admin1 = []
        let info2 = await axios.get(url2)
        for(let login of info2.data){
            info_admin1.push(login['username'])
            info_admin1.push(login['password'])
        }
        const admin_username = prompt("Enter your username 👉")
        const passwd = password()
        if(!info_admin1.includes(admin_username) && (!info_admin1.includes(passwd))){
            const  admin_data = {'username':admin_username,'password':passwd}
            await axios.post(url2,admin_data)
            console.log('You are now admin')
        }else{
            console.log('This username and password allready exist 🙁');
        }
    } catch (error) {
        console.log(error.messege);
    }
}
const fast_runner = async(url)=>{
    while(true){
        console.log('\npress 1 for signup\npress 2 for login\npress 3 for admin\npress 4 for exit\n');
        const user = prompt("Enter your choice 👉")
        if(user == 1){
            const userId = check_number()
            const check_li = []
            let data = await axios.get(url)
            const check_data = await axios.get(url2)
            for(let check_user of check_data.data){
                check_li.push(check_user.username);
                check_li.push(check_user.password)
            }
            let li = []
            for(id1 of data.data){
                li.push(id1.id);
            }
            if(!li.includes(userId)){
                const userName = prompt('Enter your userName 👉 ')
                const passwd = password()
                const email = check_email()
                if(!check_li.includes(userName) && (!check_li.includes(passwd))){
                    await Signup(userId,userName,passwd,email)
                }else{
                    console.log('Admin can not make a user');
                }
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
