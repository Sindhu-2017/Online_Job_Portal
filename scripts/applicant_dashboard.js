
const loggedInUser=JSON.parse(localStorage.getItem("loggedInUser"));
// console.log(loggedInUser.Fullname);
//offcanvas data 
document.getElementById("fullname").innerText=loggedInUser.Fullname;
document.getElementById("dob").innerText=loggedInUser.DateOfBirth;
document.getElementById("email").innerText=loggedInUser.Email;
document.getElementById("qual").innerText=loggedInUser.Qualification;
document.getElementById("exp").innerText=loggedInUser.Experience;

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



// displaying jobs
async function loadJobs(){
    let response=await fetch(API.jobs);
    let jobs=await response.json();
    

    // document.getElementById("postCount").innerText=jobs.length;
    let tablebody="";

    jobs.forEach(job=>{
        tablebody+=`
        <tr>
            <td>${job.JobTitle}</td>
            <td>${job.CompanyName}</td>
            <td>${job.CompanyLocation}</td>
            <td>${job.Salary}</td>          
            <td>${job.PostedDate}</td>
            <td>${job.Status}</td>
            <td class="text-center">
                <button class="btn btn-danger" onclick="applyJob('${job.id}')">Apply</button>
            </td>


        </tr>
        `;
    })
    document.getElementById("jobTBody").innerHTML=tablebody;
}


document.getElementById("jobSidebar").addEventListener("click",function(){
    document.getElementById("jobContainer").classList.remove("d-none");
    document.getElementById("jobContainer").classList.add("d-block");

    document.getElementById("appContainer").classList.add("d-none");

});


//apply job
async function applyJob(id){

    console.log("Apply button clicked", id);
    let AppliedDate=new Date().toISOString().split("T")[0];

    let applications={
        JobID:id,
        ApplicantID:loggedInUser.id,
        AppliedDate:AppliedDate,
        ApplicationStatus:"Applied"
    }

    
    try{
        const result=await Swal.fire({
            icon:"question",
            title:"Apply",
            text:"Are you sure to apply this job"
        }) ;

        if(result.isConfirmed){
            await fetch(API.applications,{
                method:"POST",
                headers:{"Content-Type":"application/json"},
                body:JSON.stringify(applications)
            })

            await Swal.fire({
                icon:"success",
                text:"Job Applied Successfully!",
                title:"Application"
            });
        }
    }
    catch(error){
        await Swal.fire({
            icon:"error",
            title:"Error",
            text:"Error occured"
        });
    }
}



loadJobs();













//applied jobs
// async function appliedJobs(){
//     let res=await fetch(API.applications);
//     let applications=await res.json();

//     let filteredApplications=applications.filter(app=>app.ApplicantID === loggedInUser.id)
    
//     let response=await fetch(API.jobs);
//     let jobs=await response.json();

//     let appliedJobs=filteredApplications.map(appId=>app.JobID);

//     let filteredJobs=jobs.filter(jobs=>appliedJobs.includes(JobID));

//     document.getElementById("appCount").innerText=filteredApplications.length;
//     let tablebody="";

//     filteredJobs.forEach(job=>{
//         tablebody+=`
//         <tr>
//             <td>${job.JobTitle}</td>
//             <td>${job.CompanyName}</td>
//             <td>${job.CompanyLocation}</td>
//             <td>${job.Salary}</td>          
//             <td>${job.PostedDate}</td>
//             <td>${job.Status}</td>
//             <td class="text-center">
//                 <button class="btn btn-danger">View</button>
//                 <button class="btn btn-danger">Apply</button>
//             </td>


//         </tr>
//         `;
//         document.getElementById("jobContainer").innerHTML=tablebody;
//     })

// }

// document.getElementById("appCard").addEventListener("click",function(){
//     document.getElementById("jobContainer").classList.remove("d-none");
//     document.getElementById("jobContainer").classList.add("d-block");

//     document.getElementById("appContainer").classList.add("d-none");

// });