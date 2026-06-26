const themeBtn = document.getElementById("themeBtn");

// Load saved theme
if(localStorage.getItem("theme") === "dark"){
    document.body.classList.add("dark-theme");
    themeBtn.innerHTML = '<i class="bi bi-sun-fill"></i>';
}

// Toggle theme
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

//get user details from localstorage based on login
const loggedInUser=JSON.parse(localStorage.getItem("loggedInUser"));
let editId=null;

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
            position:"top-end",
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

//deactivate button
const activateBtn=document.getElementById("deactivate");

if(loggedInUser.Status === "active"){
    activateBtn.innerHTML=`<i class="bi bi-person-x-fill me-2"></i>Deactivate`;
}
else{
    activateBtn.innerHTML=`<i class="bi bi-person-check-fill me-2"></i>Activate`;
}

//loading company name and location
document.getElementById("postBtn").addEventListener("click",function(){
    document.getElementById("compName").value=loggedInUser.CompanyName;
    document.getElementById("compLocation").value=loggedInUser.CompanyLocation;
});

//posting job 
document.getElementById("postJobBtn").addEventListener("click",async function(){
    
    
    const CompanyName=document.getElementById("compName").value;
    const CompanyLocation=document.getElementById("compLocation").value;
    const JobTitle=document.getElementById("jobTitle").value;
    const Description=document.getElementById("description").value;
    const skills=[...document.querySelectorAll(".skill:checked")].map(skill=>skill.value);
    const Salary=document.getElementById("salary").value;
    const JobType=document.getElementById("jobType").value;
    const Status=document.getElementById("status").value;

    const recruiterId=loggedInUser.id;
    const today=new Date().toISOString().split("T")[0];

    

    if(!CompanyName || !CompanyLocation || !JobTitle || !Description || skills.length === 0 || !Salary || !JobType || !Status){
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
        Skills:skills,
        Salary:Salary,
        JobType:JobType,
        RecruiterID:recruiterId,
        PostedDate:today,
        Status:Status,
        IsDeleted:false
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

            if(editId ===  null){
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
            else{
                await fetch(`${API.jobs}/${editId}`,{
                    method:"PATCH",
                    headers:{"Content-Type":"application/json"},
                    body:JSON.stringify(Jobs)
                });

                await Swal.fire({
                    icon:"success",
                    title:"Updated",
                    text:"Job updated successfullly",
                });

                editId = null;
                document.getElementById("modalTitle").innerText ="Post Job";
                document.getElementById("postJobBtn").innerText ="Post";
            }
            bootstrap.Modal.getOrCreateInstance(document.getElementById("postJob")).hide();

            loadJobs();
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
    
    let filteredJobs = jobs.filter(job=>job.RecruiterID === loggedInUser.id && job.IsDeleted !== true);

    document.getElementById("postCount").innerText=filteredJobs.length;

    const search=document.getElementById("searchBox").value.toLowerCase();
    filteredJobs=filteredJobs.filter(job=> job.JobTitle.toLowerCase().includes(search) ||
                   job.JobType.toLowerCase().includes(search));

    filteredJobs.sort((a,b)=>new Date(b.PostedDate)-new Date(a.PostedDate));

    let tablebody="";

    filteredJobs.forEach(job=>{
        tablebody+=`
        <tr>
            <td>${job.JobTitle}</td>
            <td>${job.Skills.join(",")}</td>
            <td>${job.Salary}</td>
            <td>${job.JobType}</td>
            <td>${job.PostedDate}</td>
            <td>${job.Status}</td>
            <td class="text-center">
                <button class="btn btn-danger" onclick="editJob('${job.id}')">Edit</button>
                <button class="btn btn-danger" onclick="deleteJob('${job.id}')">Delete</button>
            </td>


        </tr>
        `;
    });
    document.getElementById("jobTBody").innerHTML=tablebody;
}


//edit job
async function editJob(id) {
     editId=id;
     
     let response=await fetch(`${API.jobs}/${id}`);
     let jobs=await response.json();

     document.getElementById("compName").value=jobs.CompanyName;
     document.getElementById("compLocation").value=jobs.CompanyLocation;
     document.getElementById("jobTitle").value=jobs.JobTitle;
     document.getElementById("description").value=jobs.Description;
     document.getElementById("description").value=jobs.Description;
    document.querySelectorAll(".skill").forEach(skill=>{
        skill.checked=jobs.Skills.includes(skill.value);
    })
     document.getElementById("salary").value=jobs.Salary;
     document.getElementById("jobType").value=jobs.JobType;
     document.getElementById("status").value=jobs.Status;

     document.getElementById("modalTitle").innerText ="Update Job Details";
     document.getElementById("postJobBtn").innerText ="Update";

    const modal=bootstrap.Modal.getOrCreateInstance(document.getElementById("postJob"));
    modal.show();

}

//delete job
async function deleteJob(id) {
    const result=await Swal.fire({
        icon:"question",
        title:"Delete",
        text:"Are you sure,You want to delete?",
        showCancelButton:true,
        confirmButtonColor:"#3085d6",
        cancelButtonColor:"#d33",
        confirmButtonText:"Yes,Delete it"
        }) ;
    if(result.isConfirmed){
        await fetch(`${API.jobs}/${id}`,{
            method:"PATCH",
            headers:{"Content-Type":"application/json"},
            body:JSON.stringify({IsDeleted:true})
        });

        await Swal.fire({
            icon:"success",
            title:"Deleted",
            text:"Deleted Successfully!"
        });
        loadJobs();

    }    
}


//displaying applications
async function loadApplication(status){

    document.getElementById("appContainer").classList.remove("d-none");
    document.getElementById("appContainer").classList.add("d-block");
    document.getElementById("jobContainer").classList.add("d-none");
    
    let response=await fetch(API.applications);
    let applications=await response.json();

    let res=await fetch(API.users);
    let users=await res.json();

    let resp=await fetch(API.jobs);
    let jobs=await resp.json();

    //jobs based on recruiter
    let recruiterJobs=jobs.filter(job=>job.RecruiterID === loggedInUser.id);

    //job and application based on recruiter
    let recruiterApplications=applications.filter(
        app=>recruiterJobs.some(job=>job.id === app.JobID));

    document.getElementById("appCount").innerText=recruiterApplications.length;
    const viewModal=document.getElementById("viewApplicant");

    let filteredappl="";
    if(status){
        filteredappl=recruiterApplications.filter(appl=>appl.ApplicationStatus.toLowerCase() === status.toLowerCase());
    }
    else{
        filteredappl=recruiterApplications;
    }
      
    filteredappl.sort((a,b)=>new Date(b.AppliedDate)-new Date(a.AppliedDate))

    let tablebody="";

    filteredappl.forEach(appl=>{

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
    });
    document.getElementById("appTBody").innerHTML=tablebody;

}


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

    

    document.getElementById("updateBtn").addEventListener("click",async function(){

        const status=document.getElementById("ApplicationStatus").value;
        let res=await fetch(API.applications);
        let app=await res.json();

        let application=app.find(app=>app.ApplicantID === id)

        try{
            const result=await Swal.fire({
                icon:"question",
                title:"Update",
                text:"Are you sure,You want to update?",
                showCancelButton:true,
                confirmButtonColor:"#3085d6",
                cancelButtonColor:"#d33",
                confirmButtonText:"Yes,Update it"
            }) 

            if(result.isConfirmed){

                await fetch(`${API.applications}/${application.id}`,{
                    method:"PATCH",
                    headers:{"Content-Type":"application/json"},
                    body:JSON.stringify({ApplicationStatus:status})
                });
                await Swal.fire({
                    icon:"success",
                    title:"Status Updated",
                    text:"Application Status Updated Successfully!"
                });
            }
        }
        catch(error){
           await Swal.fire({
                    icon:"error",
                    title:"error",
                    text:"Unable to update the status"
            }); 
        }              
    });
}



//setting status to inavtive
document.getElementById("deactivate").addEventListener("click",async function(e){

    e.preventDefault();

    const newStatus=loggedInUser.Status === "active"?"inactive":"active";
    const actDeact=newStatus ==="active" ?"Activate" :"Deactivate";
    try{    
        const result=await Swal.fire({
            icon:"question",
            text:`Are you sure to ${actDeact} your account?`,
            title:`${actDeact} Account`,
            showCancelButton:true,
            confirmButtonText:"Yes",
            cancelButtonText:"No"
        });
        if(result.isConfirmed){

            await fetch(`${API.users}/${loggedInUser.id}`,{
                method:"PATCH",
                headers:{"Content-Type":"application/json"},
                body:JSON.stringify({Status:newStatus})
            })

            loggedInUser.Status=newStatus;
            localStorage.setItem("loggedInUser",JSON.stringify(loggedInUser));

            await Swal.fire({
                icon:"success",
                title:`${actDeact}d`,
                text:`Account ${actDeact}d Succesfully`
            });

            window.location.reload();
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

//initial load
loadJobs();
loadApplication();


//for app card and app sidebar

document.getElementById("appCard").addEventListener("click",function(){
    document.getElementById("appContainer").classList.remove("d-none");
    document.getElementById("appContainer").classList.add("d-block");
    document.getElementById("deletedContainer").classList.add("d-none");


    document.getElementById("jobContainer").classList.add("d-none");

    clearSidebars();
})

document.getElementById("appSidebar").addEventListener("click",function(){
    document.getElementById("appContainer").classList.remove("d-none");
    document.getElementById("appSidebar").classList.add("active-side");
    searchContainer.classList.add("d-none");

    document.getElementById("jobContainer").classList.add("d-none");
    document.getElementById("jobSidebar").classList.remove("active-side");

    clearActiveCards();
})

// job sidebar and card

document.getElementById("postedCard").addEventListener("click",function(){
    document.getElementById("jobContainer").classList.remove("d-none");
    document.getElementById("jobContainer").classList.add("d-block");
    document.getElementById("deletedContainer").classList.add("d-none");

    
    document.getElementById("appContainer").classList.add("d-none");
    clearSidebars();
});

document.getElementById("deletedCard").addEventListener("click",function(){
    document.getElementById("deletedContainer").classList.remove("d-none");
    document.getElementById("deletedContainer").classList.add("d-block");
    
    document.getElementById("appContainer").classList.add("d-none");
    document.getElementById("jobContainer").classList.add("d-none");

    clearSidebars();
    loadDeletedJob();
});

document.getElementById("jobSidebar").addEventListener("click",function(){
    document.getElementById("jobContainer").classList.remove("d-none");
    document.getElementById("jobSidebar").classList.add("active-side");
    searchContainer.classList.remove("d-none");


    document.getElementById("appContainer").classList.add("d-none");
    document.getElementById("appSidebar").classList.remove("active-side");

    clearActiveCards();
});


//active card
const postedCard = document.getElementById("postedCard");
const appCard = document.getElementById("appCard");
const deletedCard = document.getElementById("deletedCard");

const searchContainer=document.getElementById("searchContainer");

postedCard.addEventListener("click", function () {
    postedCard.classList.add("active-card");
    appCard.classList.remove("active-card");
    deletedCard.classList.remove("active-card");
    searchContainer.classList.remove("d-none");
});

appCard.addEventListener("click", function () {
    appCard.classList.add("active-card");
    postedCard.classList.remove("active-card");
    deletedCard.classList.remove("active-card");
    searchContainer.classList.add("d-none");
});

deletedCard.addEventListener("click", function () {
    deletedCard.classList.add("active-card");
    appCard.classList.remove("active-card");
    postedCard.classList.remove("active-card");
    searchContainer.classList.add("d-none");

});

function clearActiveCards(){
    appCard.classList.remove("active-card");
    postedCard.classList.remove("active-card");
    deletedCard.classList.remove("active-card");

}
function clearSidebars(){
    document.getElementById("appSidebar").classList.remove("active-side");
    document.getElementById("jobSidebar").classList.remove("active-side");
}

//search
document.getElementById("searchBox").addEventListener("input",loadJobs);

async function loadDeletedJob(){

     let response=await fetch(API.jobs);
    let jobs=await response.json();

    let deleteJobs=jobs.filter(job=>job.RecruiterID === loggedInUser.id && job.IsDeleted ===true );

    let tablebody="";

    deleteJobs.forEach(job=>{
        tablebody+=`
        <tr>
            <td>${job.JobTitle}</td>
            <td>${job.Skills.join(",")}</td>
            <td>${job.Salary}</td>
            <td>${job.JobType}</td>
            <td>${job.PostedDate}</td>
            <td>${job.Status}</td>
            <td class="text-center">
                <button class="btn btn-danger" onclick="restoreJob('${job.id}')">Restore</button>
            </td>


        </tr>
        `;
    });
    document.getElementById("deletedTBody").innerHTML=tablebody;

}
async function restoreJob(id) {

    const result=await Swal.fire({
        icon:"question",
        title:"Restore",
        text:"Are you sure to restore this task?",
        showCancelButton:true,
        confirmButtonColor:"#3085d6",
        cancelButtonColor:"#d33",
        confirmButtonText:"Yes,Restore it"
    });
    if(result.isConfirmed){
        try{
            await fetch(`${API.jobs}/${id}`,{
                method:"PATCH",
                headers:{"Content-Type":"application/json"},
                body:JSON.stringify({IsDeleted:false})
            });
            await Swal.fire({
                icon:"success",
                title:"Restored",
                text:"Job restored successfully"
            })

        }   
        catch(error){
            await Swal.fire({
                icon:"error",
                title:"Error",
                text:"Error occured"
            });
        } 
    }
    loadDeletedJob();
}
