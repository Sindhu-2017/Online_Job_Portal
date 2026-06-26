//theme
const themeBtn=document.getElementById("themeBtn");

//load Saved theme
if(localStorage.getItem("theme")==="dark"){
    document.body.classList.add("dark-theme");
    themeBtn.innerHTML='<i class="bi bi-sun-fill"></i>';
}

//toggle theme
themeBtn.addEventListener("click",function(){
    document.body.classList.toggle("dark-theme");

    if(document.body.classList.contains("dark-theme")){
        localStorage.setItem("theme","dark");
        themeBtn.innerHTML='<i class="bi bi-sun-fill"></i>';
    }
    else{
        localStorage.setItem("theme","light");
        themeBtn.innerHTML='<i class="bi bi-moon-stars-fill"></i>';
    }
});


$("#login").on("click",async function(){
    let email=$("#email").val().trim();
    let password=$("#password").val().trim();

    let isValid=true;

    if(email === ""){
        $("#email").addClass("is-invalid").removeClass("is-valid");
        isValid=false;
    }
    else{
        $("#email").addClass("is-valid").removeClass("is-invalid");
    }
    if(password === ""){
        $("#password").addClass("is-invalid").removeClass("is-valid");
        isValid=false;
    }
    else{
        $("#password").addClass("is-valid").removeClass("is-invalid");
    }

    if(!isValid){
        await Swal.fire({
            icon:"warning",
            title:"Missing Fields",
            text:"Fill all the fiels"
        });
        return;
    }

    try{
        const response=await $.ajax({
            url:API.users,
            method:"GET"
        });

        let validUser=response.find(user => 
            email === user.Email && password === user.Password
        );

        if(validUser){

            const result= await Swal.fire({
                title:"login",
                text:"Are you sure you want to login?",
                icon:"question",
                showCancelButton:true,
                cancelButtonColor:"#d33",
                confirmButtonColor:"#3085d6",
                confirmButtonText:"Yes,login"
            });

            if(result.isConfirmed){
                localStorage.setItem("loggedInUser",JSON.stringify(validUser));
                await Swal.fire({
                    toast:true,
                    icon:"success",
                    title:"redirecting",
                    position:"top-end",
                    showCancelButton:false,
                    timer:2000,
                    timerProgressBar:true
                });

                $("#email").val("");
                $("#password").val("");

                setTimeout(()=>{
                    if(validUser.Role === "Applicant" ){
                        window.location.href="pages/applicant_dashboard.html";
                    }
                    else if(validUser.Role === "Recruiter"){
                        window.location.href="pages/recruiter_dashboard.html";
                    }
                },2000);
            }           
            
        }
        if(!validUser){
            await Swal.fire({
                icon:"error",
                title:"Login Failed",
                text:"Invalid username or password"
            });
            return;
        }

    }
    catch(error){
        await Swal.fire({
            icon:"error",
            title:"Server Error",
            text:"Cannot able to connect server"
        });
    }

});