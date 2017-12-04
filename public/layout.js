function loadPage(url){
    //"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjoicmVkIiwiaWF0IjoxNTExMDk5NzIzfQ.V0TLBYlTB6D8x0EHLsshCjTTKP_ilNPnrM6ba_N0dfI"
    let jwt = token();
    $.ajax({
    method: "GET",
    data:{insides:true},
    url: url,
    headers: {
    Authorization: "Bearer "+ jwt ,
    Insides: true
    },
    error: (e)=>{
        console.log( "Load page error", e);
        $("#loadPage").html(e.responseText);
        toast("Error with loading this page", "error")
    },
    success: (msg)=>{
        console.log( "Load page Done");
        $("#loadPage").html(msg);
    }});
}

function logout(){
    if(localStorage.getItem("token")){
        localStorage.removeItem('token')
        toast("Logged Out", "info")
    }else{
        toast("Already Logged Out", "info")
    }
    
}
function login(name, pass){
    //send credentials and return token
    //and create token in localstorage
    $.ajax({
    method: "POST",
    url: "/login",
    data:{name:name, pass:pass},
    error: (e)=>{
        console.log( "Load page error", e);
        toast("Error with logging in", "error")
    },
    success: (msg)=>{
        console.log( "Load page Done", msg);
        toast("Successful Login", "ok")
        token(msg.token);
    }});
}

function token(token = "-get"){
    if(token === "-get"){
        return localStorage.getItem("token")
    }else{
        localStorage.setItem("token", token)
    }
}

function toast(msg, type="info", time = 4){
    //types: info ok error
    let Toaster = $(".toastBox").append(`<div class='toast ${type}'>${msg}</div>`)
    let newToast = $(".toastBox div:last-child");
    setTimeout(function(){
        newToast.fadeOut(250, function(){
            $(this).remove()
        })
    }, time * 1000);
}
// $(function() {
// //console.log("started Script");
// });