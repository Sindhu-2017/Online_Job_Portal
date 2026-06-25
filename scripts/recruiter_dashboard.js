
const loggedInUser=JSON.parse(localStorage.getItem("loggedInUser"));
// console.log(loggedInUser.Fullname);
//offcanvas data 
document.getElementById("fullname").innerText=loggedInUser.Fullname;
document.getElementById("dob").innerText=loggedInUser.DateOfBirth;
document.getElementById("role").innerText=loggedInUser.Role;
document.getElementById("compNam").innerText=loggedInUser.CompanyName;
document.getElementById("compLoc").innerText=loggedInUser.CompanyLocation;

//logout
document.getElementById("logout").addEventListener("click",async function(e){
    e.preventDefault();
    
    const result=await Swal.fire({
        icon:"question",
        title:"Logout",
        text:"Are you sure to logout?"
    });
    if(result.isConfirmed){
        localStorage.removeItem("loggedInUser");
        await Swal.fire({
            toast:true,
            icon:"success",
            text:"logout sucessfully ,redirecting...",
            showCancelButton:false,
            timer:2000,
            timerProgressBar:true
        });
        setTimeout(()=>{
            window.location.href="../index.html";
        },2000);
    }
});

//logout modal
document.getElementById("logoutModal").addEventListener("click",async function(e){
    e.preventDefault();
    
    const result=await Swal.fire({
        icon:"question",
        title:"Logout",
        text:"Are you sure to logout?"
    });
    if(result.isConfirmed){
        localStorage.removeItem("loggedInUser");
        await Swal.fire({
            toast:true,
            icon:"success",
            text:"logout sucessfully ,redirecting...",
            showCancelButton:false,
            timer:2000,
            timerProgressBar:true
        });
        setTimeout(()=>{
            window.location.href="../index.html";
        },2000);
    }
});

//posting job 
document.getElementById("postJobBtn").addEventListener("click",async function(){

    const CompanyName=document.getElementById("compName").value;
    const CompanyLocation=document.getElementById("compLocation").value;
    const JobTitle=document.getElementById("jobTitle").value;
    const Description=document.getElementById("description").value;
    const Salary=document.getElementById("salary").value;
    const JobType=document.getElementById("jobType").value;
    const Status=document.getElementById("status").value;

    const recruiterId=loggedInUser.id;
    const today=new Date();

    if(!CompanyName || !CompanyLocation || !JobTitle || !Description || !Salary || !JobType || !Status){
        await Swal.fire({
            icon:"warning",
            title:"Missing fields",
            text:"All fields must be filled"
        }) ;
        return ; 
    }


    let Jobs={
        CompanyName:CompanyName,
        CompanyLocation:CompanyLocation,
        JobTitle:JobTitle,
        Description:Description,
        Salary:Salary,
        JobType:JobType,
        RecruiterID:recruiterId,
        PostedDate:today,
        Status:Status
    }
    try{
        const result=await Swal.fire({
            icon:"question",
            title:"Post",
            text:"Are you sure ? You want to post this job?",
            showCancelButton:true,
            confirmButtonColor:"#3085d6",
            cancelButtonColor:"#d33",
            confirmButtonText:"Yes,Post it"
        });
        if(result.isConfirmed){
            await fetch(API.jobs,{
                method:"POST",
                headers:{"Content-Type":"application/json"},
                body:JSON.stringify(Jobs)
            });

            await Swal.fire({
                icon:"success",
                title:"Posted",
                text:"Job posted successfullly",
            });
        }

    }
    catch(error){
        await Swal.fire({
            icon:"error",
            title:"Error",
            text:"Cannot able to post!",
        });
    }
    
});


// displaying jobs
async function loadJobs(){
    let response=await fetch(API.jobs);
    let jobs=await response.json();
    
    let filteredJobs = jobs.filter(job=>job.RecruiterID === loggedInUser.id);

    document.getElementById("postCount").innerText=filteredJobs.length;
    let tablebody="";

    filteredJobs.forEach(job=>{
        tablebody+=`
        <tr>
            <td>${job.JobTitle}</td>
            <td>${job.Description}</td>
            <td>${job.Salary}</td>
            <td>${job.JobType}</td>
            <td>${job.PostedDate}</td>
            <td>${job.Status}</td>
            <td class="text-center">
                <button class="btn btn-danger">Edit</button>
                <button class="btn btn-danger">Delete</button>
            </td>


        </tr>
        `;
        document.getElementById("jobTBody").innerHTML=tablebody;
    })

}

document.getElementById("postedCard").addEventListener("click",function(){
    document.getElementById("jobContainer").classList.remove("d-none");
    document.getElementById("jobContainer").classList.add("d-block");

    document.getElementById("appContainer").classList.add("d-none");

});

document.getElementById("jobSidebar").addEventListener("click",function(){
    document.getElementById("jobContainer").classList.remove("d-none");
    document.getElementById("jobContainer").classList.add("d-block");

    document.getElementById("appContainer").classList.add("d-none");

});


//displaying applications
async function loadApplication(){
    let response=await fetch(API.applications);
    let applications=await response.json();

    let res=await fetch(API.users);
    let users=await res.json();

    let resp=await fetch(API.jobs);
    let jobs=await resp.json();

    let recruiterJobs=jobs.filter(job=>job.RecruiterID === loggedInUser.id);

    let recruiterApplications=applications.filter(
        app=>recruiterJobs.some(job=>job.id === app.JobID));

    document.getElementById("appCount").innerText=recruiterApplications.length;
    const viewModal=document.getElementById("viewApplicant");
    
    
    let tablebody="";

    recruiterApplications.forEach(appl=>{

        const job=recruiterJobs.find(job=>job.id === appl.JobID);
        const user=users.find(user=>user.id === appl.ApplicantID);

        tablebody+=`
        <tr>
            <td>${job.JobTitle}</td>
            <td>${user.Fullname}</td>
            <td>${appl.AppliedDate}</td>
            <td>${appl.ApplicationStatus}</td>
            <td class="text-center">
                <button class="btn btn-danger" onclick="viewApplicant('${appl.ApplicantID}')" 
                data-bs-toggle="modal" data-bs-target="#viewApplicant">View</button>
                
            </td>


        </tr>
        `;
        document.getElementById("appTBody").innerHTML=tablebody;
    })
}
// <button class="btn btn-danger">Edit</button>

document.getElementById("appCard").addEventListener("click",function(){
    document.getElementById("appContainer").classList.remove("d-none");
    document.getElementById("appContainer").classList.add("d-block");

    document.getElementById("jobContainer").classList.add("d-none");

})

document.getElementById("appSidebar").addEventListener("click",function(){
    document.getElementById("appContainer").classList.remove("d-none");
    document.getElementById("appContainer").classList.add("d-block");

    document.getElementById("jobContainer").classList.add("d-none");

})

//view applicant
async function viewApplicant(id){
    let res=await fetch(API.users);
    let users=await res.json(); 

    let filteredUser=users.find(user=>user.id === id);

    document.getElementById("appfullname").innerText=filteredUser.Fullname;
    document.getElementById("appemail").innerText=filteredUser.Email;
    document.getElementById("appphone").innerText=filteredUser.Phone;
    document.getElementById("appdob").innerText=filteredUser.DateOfBirth;
    document.getElementById("appgender").innerText=filteredUser.Gender;
    document.getElementById("appqualification").innerText=filteredUser.Qualification;
    document.getElementById("appexperience").innerText=filteredUser.Experience;
    document.getElementById("appskills").innerText=filteredUser.Skills.join(",");

    

    document.getElementById("updateBtn").addEventListener("click",function(){

        const status=document.getElementById("ApplicationStatus").value;
        let res=await fetch(API.applications);
        let app=await res.json();

        let application=app.find(app=>app.ApplicantID === id)

            await fetch(`${API.applications}/${application.id}`,{
                method:"PATCH",
                headers:{"Content-Type":"application/json"},
                body:JSON.stringify({ApplicationStatus:status})
            });
                  


    });


}


//setting status to inavtive
document.getElementById("deactivate").addEventListener("click",async function(e){

    e.preventDefault();
    try{    
        const result=await Swal.fire({
            icon:"question",
            text:"Are you sure to deactivate your account?",
            title:"Deactivating Account",
            showCancelButton:true,
            confirmButtonText:"Yes",
            cancelButtonText:"No"
        });
        if(result.isConfirmed){

            await fetch(`${API.users}/${loggedInUser.id}`,{
                method:"PATCH",
                headers:{"Content-Type":"application/json"},
                body:JSON.stringify({Status:"inactive"})
            })
            await Swal.fire({
                icon:"success",
                title:"Deactivating",
                text:"Account deacivated Succesfully"
            });
        }
    }
    catch(err){
        await Swal.fire({
            icon:"error",
            title:"error",
            text:"Error occurred"
        });

    }
});

loadJobs();
loadApplication();