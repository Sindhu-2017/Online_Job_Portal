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
        localStorage.setItem("theme",light);
        themeBtn.innerHTML='<i class="bi bi-moon-stars-fill"></i>';
    }
});

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

    let users={
        Fullname:$("#fullname").val().trim().split(" ").map(word=> word.charAt(0).toUpperCase()+word.slice(1).toLowerCase()).join(" "),
        Email:$("#email").val().trim(),
        Phone:$("#phone").val().trim(),
        DateOfBirth:$("#dob").val(),
        Gender:$("input[name='gender']:checked").val(),
        Role:$("#role").val(),
        CompanyName:$("#compName").val().trim(),
        CompanyLocation:$("#compLocation").val().trim(),
        Qualification:$("#qualification").val().trim(),
        Experience:$("#experience").val().trim(),
        Skills:$("input[name='skills']:checked").map(function(){
            return $(this).val()
        }).get(),
        Password:$("#password").val(),
        Status:"active"
    }

    try{
        await $.ajax({
            url:API.users,
            method:"POST",
            contentType:"application/json",
            data:JSON.stringify(users)
        });

        await Swal.fire({
            icon:"success",
            title:"User Added",
            text:"User Added Successfully!"
        });

        $("#signupForm")[0].reset();

        setTimeout(()=>{
            window.location.href="../index.html";
        },2000);      


    }
    catch(error){
        await Swal.fire({
            icon:"error",
            title:"Error Occured",
            text:"Cannot able to add User"
        });
    }
});

