const axios = require('axios');
const prompt = require('prompt-sync')()
const url = 'http://localhost:3000/posts'
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
const create = async(id,username,password,email)=>{  
    try {
        let add = {
            'id': id,
            'userName':username,
            'password':password,
            'email':email
        }
        await axios.post(url,add)
        console.log('Your data created successfully.......',"👍")
    } catch (error) {
        console.log("This id allready exist 🙁");
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
                await axios.patch(url+'/'+userid,{'userName':username_update})
                console.log("userName has been updated successfully....... 👍");
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
async function run(){
    while(true){
        console.log('\n 🙏 👋 WELCOME TO CRUD OPERATION 👋 🙏 \n\npress 1 for create\npress 2 for read\npress 3 for update\npress 4 for delete\npress 5 for exit\n')
        let choice = parseInt(prompt('Enter your choice 👉 '))
        if(choice == 1){
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
                await create(userId,userName,passwd,email)
            }else{
                console.log('This id allready exist 🙁' );
            }
        }else if(choice == 2){
            const id = check_number()
            await read(id)
        }else if(choice == 3){
            const userId = check_number()
            await update(userId)
        }else if(choice == 4){
            const userId3 = check_number()
            await delete1(userId3)
        }else if(choice == 5){
            console.log("🖕 🖕");
            break
        }
    }
}
run()