const themeBtn=document.getElementById("themeBtn");

//load Saved theme
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

//pagination
const rowPerPage=6;
let currentPage=1;

function paginate(data){
    const start =(currentPage-1)*rowPerPage;
    const end =start+rowPerPage;
    
    return data.slice(start,end);
}

function renderPagination(totalRecords,callback,id){
    const totalPages =Math.ceil (totalRecords/rowPerPage);

    let html ="";

    for(let i=1;i<=totalPages;i++){
        html+=`
        <li class="page-item ${currentPage === i ? "active" : ""}">
            <a class="page-link" href="#" onclick="${callback}(${i})">${i}</a>
        </li>
        `;
    }
    document.getElementById(id).innerHTML=html;
}
function changePage(page,loadFunction){
    currentPage=page;
    loadFunction();
}

const loggedInUser=JSON.parse(localStorage.getItem("loggedInUser"));
if(loggedInUser.Status === "inactive"){
    document.getElementById("jobCards").innerHTML=`
    <div class="col-12">
        <div class="alert alert-warning text-center">
            <i class="bi bi-person-x-fill me-2"></i>
            Your account is inactive.Activate your account to view and apply for jobs.
        </div>
    </div>
    `;
}
//welcome section
document.getElementById("welcomeName").innerText=loggedInUser.Fullname;

//offcanvas data 
document.getElementById("fullname").innerText=loggedInUser.Fullname;
document.getElementById("dob").innerText=loggedInUser.DateOfBirth;
document.getElementById("email").innerText=loggedInUser.Email;
document.getElementById("qual").innerText=loggedInUser.Qualification;
document.getElementById("role").innerText=loggedInUser.Role;
document.getElementById("exp").innerText=loggedInUser.Experience;

//logout
async function logoutUser(){
    const result=await Swal.fire({
        icon:"question",
        title:"Logout",
        text:"Are you sure to logout?",
        showCancelButton:true,
        confirmButtonColor:"#3085d6",
        cancelButtonColor:"#d33",
        confirmButtonText:"Yes"        
    });
    if(result.isConfirmed){
        localStorage.removeItem("loggedInUser");
        await Swal.fire({
            toast:true,
            icon:"success",
            position:"top-end",
            text:"Logout sucessfully ,Redirecting...",
            showConfirmButton:false,
            timer:2000,
            timerProgressBar:true
        });
        window.location.href="../index.html";
        
    }
}


// displaying jobs
async function loadJobs(){
    let response=await fetch(API.jobs);
    let jobs=await response.json();

    let res=await fetch(API.applications);
    let app=await res.json();

    let resUsers=await fetch(API.users);
    let users=await resUsers.json();

    let filteredJobs=jobs.filter(job=>job.Skills.some(skill=>loggedInUser.Skills.includes(skill)) 
    && job.Status === "Active" &&
    job.IsDeleted !== true);


    const search=document.getElementById("searchBox").value.toLowerCase() ;

    filteredJobs=filteredJobs.filter(job=> job.JobTitle.toLowerCase().includes(search) ||job.Salary.includes(search) ||
                 job.CompanyName.toLowerCase().includes(search) || job.CompanyLocation.toLowerCase().includes(search));

    //date filter
    const fromdate=document.getElementById("fromdate").value;
    const todate=document.getElementById("todate").value;

    filteredJobs=filteredJobs.filter(job=>{
        const pdate=job.PostedDate;
        if(fromdate && pdate < fromdate ){
            return false;
        }
        if(todate && pdate > todate ){
            return false;
        }
        return true;

    });

    if(filteredJobs.length === 0){
        document.getElementById("noJobs").classList.remove("d-none");
    }
    else{
        document.getElementById("noJobs").classList.add("d-none");
    }
   
    filteredJobs.sort((a,b)=>new Date(b.PostedDate) - new Date(a.PostedDate) );
    let cards = "";

    const paginatedJobs=paginate(filteredJobs);


    paginatedJobs.forEach(job => {

        let appl=app.find(app=>app.JobID === job.id &&  app.ApplicantID === loggedInUser.id)
        
        let rec=users.find(user=>user.id === job.RecruiterID);

        cards += `
        <div class="col-md-6 col-12 my-4 d-flex justify-content-center">

            <div class="card shadow h-100 w-75">
                <div class="card-header">
                    <h4 class="card-title text-center"><i class="bi bi-award-fill me-2"></i>${job.JobTitle}</h4>
                </div>
                <div class="card-body">

                    <p><strong><i class="bi bi-building-fill info-icon"></i>Company:</strong> ${job.CompanyName}</p>
                    <p><strong><i class="bi bi-geo-alt-fill info-icon"></i>Location:</strong> ${job.CompanyLocation}</p>
                    <p><strong><i class="bi bi-cash-stack info-icon"></i>Salary:</strong> ₹${job.Salary}</p>
                    <p><strong><i class="bi bi-briefcase info-icon"></i>Job Type:</strong> ${job.JobType}</p>
                    <p><strong><i class="bi bi-tools info-icon"></i>Skills:</strong> ${job.Skills.join(", ")}</p>
                    <p><strong><i class="bi bi-hourglass-split info-icon"></i>Experience:</strong> ${job.Experience}</p>
                    <p><strong><i class="bi bi-calendar-event-fill info-icon"></i>Posted:</strong> ${job.PostedDate.split("-").reverse().join("-")}</p>
                    <p><strong><i class="bi bi-person-badge-fill info-icon"></i>Recruiter Contact :</strong>${rec.Fullname} , ${rec.Email}</p>
                    <p>${job.EndDate < new Date().toISOString().split("T")[0] ? `<p class="alert alert-danger"><i class="bi bi-calendar-x text-danger me-2"></i>Application Closed<p>`:
                        `<p><strong><i class="bi bi-calendar-date info-icon"></i>Application will be closed on :</strong>${job.EndDate.split("-").reverse().join("-")}</p>`}</p>
                    
                    ${loggedInUser.Status === "active"?
                    `<button class="btn btn-primary w-100" id="applyBtn"
                        onclick="applyJob('${job.id}')" ${appl && (appl.ApplicationStatus === "Applied" || appl.ApplicationStatus ===  "Selected" || 
                             appl.ApplicationStatus === "Rejected" ||  appl.ApplicationStatus === "ShortListed"|| appl.ApplicationStatus === "Called For Interview") || job.EndDate < new Date().toISOString().split("T")[0]?"disabled":""} >
                        ${appl ? appl.ApplicationStatus:"Apply"}
                    </button>`
                    :`<button class="btn btn-secondary w-100" disabled>
                            Account Inactive
                    </button>
                    `}

                </div>

            </div>

        </div>
        `;
    });

    document.getElementById("jobCards").innerHTML = cards;

    //pagination
    renderPagination(filteredJobs.length,"pageJobs","jobPagination");

}

//sidebar options
document.getElementById("jobSidebar").addEventListener("click",function(){
    document.getElementById("jobContainer").classList.remove("d-none");
    document.getElementById("jobSidebar").classList.add("active-side");
    document.getElementById("appContainer").classList.add("d-none");
    document.getElementById("appSidebar").classList.remove("active-side");
    document.getElementById("searchContainer").classList.remove("d-none");
    clearCards();
    loadJobs();

});
document.getElementById("appSidebar").addEventListener("click",function(){
    document.getElementById("appContainer").classList.remove("d-none");
    document.getElementById("appSidebar").classList.add("active-side");

    document.getElementById("jobContainer").classList.add("d-none");
    document.getElementById("jobSidebar").classList.remove("active-side");
    document.getElementById("searchContainer").classList.add("d-none");

    clearCards();
    loadAppliedJobs();

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
            text:"Are you sure to apply this job",
            showCancelButton:true,
            confirmButtonText:"Yes",
            cancelButtonText:"No"
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

        loadJobs();
        loadCount();
    }
    catch(error){
        await Swal.fire({
            icon:"error",
            title:"Error",
            text:"Error occured"
        });
    }
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

//deactivate button
const activateBtn=document.getElementById("deactivate");

if(loggedInUser.Status === "active"){
    activateBtn.innerHTML=`<i class="bi bi-person-x-fill me-2"></i>Deactivate`;
}
else{
    activateBtn.innerHTML=`<i class="bi bi-person-check-fill me-2"></i>Activate`;
}

//loadAppliedJobs - it runs when appSidebar clicked
async function loadAppliedJobs(filter) {
    const jobsRes=await fetch(API.jobs);
    let jobs=await jobsRes.json();

    const appRes=await fetch(API.applications);
    const applications=await appRes.json();

    let myApplications=applications.filter(app=>app.ApplicantID === loggedInUser.id);

    if(!filter){
        myApplications=myApplications;
    }
    if(filter === "selected"){
        myApplications=myApplications.filter(app=>app.ApplicationStatus === "Selected");   
    }
    if(filter === "rejected"){
        myApplications=myApplications.filter(app=>app.ApplicationStatus === "Rejected");   
    }
    if(filter === "shortlisted"){
        myApplications=myApplications.filter(app=>app.ApplicationStatus === "ShortListed");   
    }
   
    myApplications.sort((a,b)=>new Date(b.AppliedDate) - new Date(a.AppliedDate) );

    let cards="";

    const paginatedApp=paginate(myApplications);


    paginatedApp.forEach(app=>{
        let job=jobs.find(job=>job.id === app.JobID);

        if(!job){
            return;
        }
        
        cards+=`
        <div class="col-md-6 col-12 my-4 d-flex justify-content-center">
            <div class="card shadow h-100 w-75">
                <div class="card-header">
                    <h4 class="card-title text-center"><i class="bi bi-award-fill me-2"></i>${job.JobTitle}</h4>
                </div>
                <div class="card-body">
                    <p><strong><i class="bi bi-building-fill info-icon"></i>Company:</strong>${job.CompanyName}</p>
                    <p><strong><i class="bi bi-geo-alt-fill info-icon"></i>Location:</strong>${job.CompanyLocation}</p>
                    <p><strong><i class="bi bi-cash-stack info-icon"></i>Salary:</strong>${job.Salary}</p>
                    <p><strong><i class="bi bi-briefcase info-icon"></i>Job Type:</strong>${job.JobType}</p>
                    <p><strong><i class="bi bi-tools info-icon"></i>Skills:</strong>${job.Skills.join(",")}</p>
                    <p><strong><i class="bi bi-hourglass-split info-icon"></i>Experience:</strong>${job.Experience}</p>
                    <p><strong><i class="bi bi-calendar-event-fill info-icon"></i>Applied Date:</strong>${app.AppliedDate.split("-").reverse().join("-")}</p>

                </div>
                <div class="card-footer text-center">
                    <span class="badge bg-warning">
                        ${app.ApplicationStatus}
                    </span>
                </div>
            </div>
        </div>
        `;
    });
    document.getElementById("appliedJobsContainer").innerHTML=cards;
    //pagination
    renderPagination(myApplications.length,"appJobs","appPagination");
}


//Cards filters

document.getElementById("appCard").addEventListener("click",function(){
    loadAppliedJobs();
    document.getElementById("appContainer").classList.remove("d-none");
    document.getElementById("jobContainer").classList.add("d-none");

});

document.getElementById("selectedCard").addEventListener("click",function(){
    loadAppliedJobs("selected");
    document.getElementById("appContainer").classList.remove("d-none");
    document.getElementById("jobContainer").classList.add("d-none");
});

document.getElementById("shortCard").addEventListener("click",function(){
    loadAppliedJobs("shortlisted");
    document.getElementById("appContainer").classList.remove("d-none");
    document.getElementById("jobContainer").classList.add("d-none");
});

document.getElementById("rejectCard").addEventListener("click",function(){
    loadAppliedJobs("rejected");
    document.getElementById("appContainer").classList.remove("d-none");
    document.getElementById("jobContainer").classList.add("d-none");
});

async function loadCount() {
    const appRes=await fetch(API.applications);
    const applications=await appRes.json();

    let myApplications=applications.filter(app=>app.ApplicantID === loggedInUser.id);

    let appCount=myApplications.length;
    let selectCount=myApplications.filter(app=>app.ApplicationStatus === "Selected").length;
    let shortCount=myApplications.filter(app=>app.ApplicationStatus === "ShortListed").length;
    let rejectCount=myApplications.filter(app=>app.ApplicationStatus === "Rejected").length;

    document.getElementById("appCount").textContent=appCount;
    document.getElementById("selectCount").innerText=selectCount;
    document.getElementById("shortCount").textContent=shortCount;
    document.getElementById("rejectCount").innerText=rejectCount;

}

//initial load
loadCount();
//activate card
const appCard=document.getElementById("appCard");
const selectedCard=document.getElementById("selectedCard");
const shortCard=document.getElementById("shortCard");
const rejectCard=document.getElementById("rejectCard");

appCard.addEventListener("click",function(){
    appCard.classList.add("active-card");
    selectedCard.classList.remove("active-card");
    shortCard.classList.remove("active-card");
    rejectCard.classList.remove("active-card");

    document.getElementById("searchContainer").classList.add("d-none");

    clearSidebars();
});

selectedCard.addEventListener("click",function(){
    selectedCard.classList.add("active-card");
    appCard.classList.remove("active-card");
    shortCard.classList.remove("active-card");
    rejectCard.classList.remove("active-card");
    document.getElementById("searchContainer").classList.add("d-none");


    clearSidebars();
});

shortCard.addEventListener("click",function(){
    shortCard.classList.add("active-card");
    selectedCard.classList.remove("active-card");
    appCard.classList.remove("active-card");
    rejectCard.classList.remove("active-card");
    document.getElementById("searchContainer").classList.add("d-none");


    clearSidebars();
});

rejectCard.addEventListener("click",function(){
    rejectCard.classList.add("active-card");
    selectedCard.classList.remove("active-card");
    shortCard.classList.remove("active-card");
    appCard.classList.remove("active-card");
    document.getElementById("searchContainer").classList.add("d-none");

    clearSidebars();
});

function clearSidebars(){
    document.getElementById("appSidebar").classList.remove("active-side");
    document.getElementById("jobSidebar").classList.remove("active-side");
}
function clearCards(){
    selectedCard.classList.remove("active-card");
    shortCard.classList.remove("active-card");
    rejectCard.classList.remove("active-card");
    appCard.classList.remove("active-card");
}

//pagination
function pageJobs(page){
    changePage(page,loadJobs);
}
function appJobs(page){
    changePage(page,loadAppliedJobs);
}


//search
document.getElementById("searchBox").addEventListener("input",()=>{
    currentPage = 1;
    loadJobs();
});

document.getElementById("fromdate").addEventListener("change", () => {
    loadJobs();
    currentPage = 1;
});

document.getElementById("todate").addEventListener("change", () => {
    currentPage = 1;
    loadJobs();
});