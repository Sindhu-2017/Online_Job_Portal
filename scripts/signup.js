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


//gender validation
$("input[name='gender']").on("change",function(){
    $("#genderError").addClass("d-none");
});

//role validation

$("#role").on("change",function(){
  
    if($(this).val() === "Recruiter"){
        $("#companyName").addClass("d-block").removeClass("d-none");
    }
    else if($(this).val() === "Applicant"){
        $().addClass("d-block");
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
   
    if($(this).val() === ""){
        $(this).addClass("is-invalid").removeClass("is-valid");
    }
    


    if(!isValid){
        return;
    }
});

