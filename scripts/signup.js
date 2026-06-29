//theme
const themeBtn=document.getElementById("themeBtn");

//load saved theme
if(localStorage.getItem("theme") === "dark"){
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


$(document).ready(function(){
    //fullname validation
    $("#fullname").on("input",function(){
        let namePattern=/^[A-Za-z ]+$/;
        if(!namePattern.test($(this).val().trim())){
            $(this).addClass("is-invalid").removeClass("is-valid");
        }
        else{
            $(this).removeClass("is-invalid").addClass("is-valid");
        }
    });

    //email validation
    $("#email").on("input",function(){
        let emailPattern=/^[a-z0-9]+@[a-z0-9]+\.[a-z]{2,}$/;
        if(!emailPattern.test($(this).val().trim())){
            $(this).addClass("is-invalid").removeClass("is-valid");
        }
        else{
            $(this).removeClass("is-invalid").addClass("is-valid");
        }
    });



    //mobile number validatin
    $("#phone").on("input",function(){
        let mobilePattern=/^\d{10}$/;
        if(!mobilePattern.test($(this).val().trim())){
            $(this).addClass("is-invalid").removeClass("is-valid");
        }
        else{
            $(this).removeClass("is-invalid").addClass("is-valid");
        }
    });

    //min value of dob- above 18 yrs old only

    let today=new Date();
    let maxDate=new Date(today.getFullYear()-18 , today.getMonth() , today .getDate());
    $("#dob").attr("max",maxDate.toISOString().split("T")[0]);


    $("#dob").on("change",function(){
        let dob=new Date($("#dob").val());

        if(dob > maxDate){
            $("#dob").addClass("is-invalid").removeClass("is-valid");
        }
        else{
            $("#dob").removeClass("is-invalid").addClass("is-valid");
        }
    })
    //gender validation

    $("input[name='gender']").on("change",function(){
        $("#genderError").addClass("d-none");
    });

    //role validation

    $("#role").on("change",function(){

        $("#roleError").addClass("d-none").removeClass("d-block");
    
        if($(this).val() === "Recruiter"){
            $("#companyName").addClass("d-block").removeClass("d-none");
            $("#companyLocation").addClass("d-block").removeClass("d-none")

            $("#applicantQual").removeClass("d-block").addClass("d-none");
            $("#applicantExp").removeClass("d-block").addClass("d-none");
            $("#skillContainer").removeClass("d-block").addClass("d-none");

        }
        else if($(this).val() === "Applicant"){
            $("#applicantQual").addClass("d-block").removeClass("d-none");
            $("#applicantExp").addClass("d-block").removeClass("d-none");
            $("#skillContainer").addClass("d-block").removeClass("d-none");


            $("#companyName").removeClass("d-block").addClass("d-none");
            $("#companyLocation").removeClass("d-block").addClass("d-none")
        }
    });


    //company name validation
    $("#compName").on("input",function(){
        if($("#compName").val().length < 6){
            $("#compName").addClass("is-invalid").removeClass("is-valid");
        }
        else{
            $("#compName").removeClass("is-invalid").addClass("is-valid");
        }
    });

    //company location validation
    $("#compLocation").on("input",function(){
        if($("#compLocation").val().length < 6){
            $("#compLocation").addClass("is-invalid").removeClass("is-valid");
        }
        else{
            $("#compLocation").removeClass("is-invalid").addClass("is-valid");
        }
    });

    //qualification vallidation
    $("#qualification").on("input",function(){
        if($("#qualification").val().length < 3){
            $("#qualification").addClass("is-invalid").removeClass("is-valid");
        }
        else{
            $("#qualification").removeClass("is-invalid").addClass("is-valid");
        }
    });

    //experience validation
    $("#experience").on("input",function(){
        if($("#experience").val()=== ""){
            $("#experience").addClass("is-invalid").removeClass("is-valid");
        }
        else{
            $("#experience").removeClass("is-invalid").addClass("is-valid");
        }
    });


    //skills validation
    $("input[name='skills']").on("change",function(){
        $("#skillError").addClass("d-none");
    });

    //password validation
    $("#password").on("input",function(){

        let passPattern=/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])[A-Za-z0-9!@#$%^&*]{6,}$/;
        if(!passPattern.test($(this).val().trim())){
            $(this).addClass("is-invalid").removeClass("is-valid");
        }
        else{
            $(this).removeClass("is-invalid").addClass("is-valid");
        }
    });

    $("#confirm").on("input",function(){
        if($("#confirm").val() === "" || $("#confirm").val() !== $("#password").val()){
            $("#confirm").addClass("is-invalid").removeClass("is-valid");
        }
        else{
            $("#confirm").removeClass("is-invalid").addClass("is-valid");
        }
    });



    //form submit

    $("#signupForm").on("submit",async function(e){
        e.preventDefault();

        let isValid=true;
        let namePattern=/^[A-Za-z ]+$/;
        if(!namePattern.test($("#fullname").val().trim())){
            $("#fullname").addClass("is-invalid").removeClass("is-valid");
            isValid=false;
        }

        let emailPattern=/^[a-z0-9]+@[a-z0-9]+\.[a-z]{2,}$/;
        if(!emailPattern.test($("#email").val().trim())){
            $("#email").addClass("is-invalid").removeClass("is-valid");
            isValid=false;
        }
        let mobilePattern=/^\d{10}$/;
        if(!mobilePattern.test($("#phone").val().trim())){
            $("#phone").addClass("is-invalid").removeClass("is-valid");
            isValid=false;
        }
    
        if(!$("input[name='gender']:checked").length){
            $("#genderError").removeClass("d-none");
            isValid=false;
        }

        if($("#role").val() === ""){
            $("#roleError").removeClass("d-none").addClass("d-block");
            isValid=false;
        }

        if($("#role").val() === "Recruiter"){
            if($("#compName").val() === ""){
                $("#compName").addClass("is-invalid").removeClass("is-valid");
                isValid=false;
            }
            
            if($("#compLocation").val() === ""){
                $("#compLocation").addClass("is-invalid").removeClass("is-valid");
                isValid=false;

            }

        }
        else if($("#role").val() === "Applicant"){
            if($("#qualification").val() === ""){
                $("#qualification").addClass("is-invalid").removeClass("is-valid");
                isValid=false;

            }

            if($("#experience").val() === ""){
                $("#experience").addClass("is-invalid").removeClass("is-valid");
                isValid=false;
            }
            if($("input[name='skills']:checked").length < 1){
                $("#skillError").removeClass("d-none");
                isValid=false;
            }

        }

        

        
        let passPattern=/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])[A-Za-z0-9!@#$%^&*]{6,}$/;
        if(!passPattern.test($("#password").val().trim())){
            $("#password").addClass("is-invalid").removeClass("is-valid");
            isValid=false;

        }

        if($("#confirm").val() === "" || $("#confirm").val() !== $("#password").val()){
            $("#confirm").addClass("is-invalid").removeClass("is-valid");
            isValid=false;
        }

        let dob=new Date($("#dob").val());
        if($("#dob").val() === "" || dob > maxDate){
            $("#dob").addClass("is-invalid").removeClass("is-valid");
            isValid=false;
        }

        if(!isValid){
            return;
        }

        const res=await fetch(API.users);
        const allUsers=await res.json();

        const result=allUsers.some(user=>
            user.Email.toLowerCase() === $("#email").val().toLowerCase() && user.Role === $("#role").val()
        );

        if(result){
            $("#email").addClass("is-invalid").removeClass("is-valid");
            
            await Swal.fire({
                icon:"error",
                title:"Email exists",
                text:"Email already regsitered !"
            });
            return;
        }

        let formattedDate = $("#dob").val().split("-").reverse().join("-");
        let users={
            Fullname:$("#fullname").val().trim().split(" ").map(word=> word.charAt(0).toUpperCase()+word.slice(1).toLowerCase()).join(" "),
            Email:$("#email").val().trim(),
            Phone:$("#phone").val().trim(),
            DateOfBirth:formattedDate,
            Gender:$("input[name='gender']:checked").val(),
            Role:$("#role").val(),
            CompanyName:$("#compName").val(),
            CompanyLocation:$("#compLocation").val().trim().split(" ").map(word=> word.charAt(0).toUpperCase()+word.slice(1).toLowerCase()).join(" "),
            Qualification:$("#qualification").val(),
            Experience:$("#experience").val().trim(),
            Skills:$("input[name='skills']:checked").map(function(){
                return $(this).val()
            }).get(),
            Password:$("#password").val(),
            Status:"active"
        }

        try{

            const result= await Swal.fire({
                    title:"Signup",
                    text:"Are you sure you want to register?",
                    icon:"question",
                    showCancelButton:true,
                    cancelButtonColor:"#d33",
                    confirmButtonColor:"#3085d6",
                    confirmButtonText:"Yes,Register"
            });
            if(result.isConfirmed){
                await $.ajax({
                    url:API.users,
                    method:"POST",
                    contentType:"application/json",
                    data:JSON.stringify(users)
                });

                await Swal.fire({
                    toast:true,
                    position:"top-end",
                    icon:"success",
                    text:"Registration Successfully Completed!",
                    showConfirmButton:false,
                    timer:2000,
                    timerProgressBar:true
                });

                $("#signupForm")[0].reset();
                localStorage.removeItem("signupDraft");
                window.location.href="../index.html";   
            }
            
        }
        catch(error){
            await Swal.fire({
                icon:"error",
                title:"Error Occured",
                text:"Cannot able to add User"
            });
        }
    });
});
//saving in local storage
function saveFormData(){
    let signupDraft={
        Fullname:$("#fullname").val().trim().split(" ").map(word=> word.charAt(0).toUpperCase()+word.slice(1).toLowerCase()).join(" "),
        Email:$("#email").val().trim(),
        Phone:$("#phone").val().trim(),
        DateOfBirth:$("#dob").val(),
        Gender:$("input[name='gender']:checked").val(),
        Password:$("#password").val()
    }
    localStorage.setItem("signupDraft",JSON.stringify(signupDraft));
}

$("#signupForm input , #signupForm select").on("input change",saveFormData);

function loadFormData(){
    const draft=JSON.parse(localStorage.getItem("signupDraft"));
    $("#fullname").val(draft.Fullname || ""),
    $("#email").val(draft.Email || ""),
    $("#phone").val(draft.Phone || ""),
    $("#dob").val(draft.DateOfBirth || ""),
    $(`input[name='gender'][value='${draft.Gender}']`).prop("checked",true),
    $("#password").val(draft.Password || "")
}

//initial load
loadFormData();