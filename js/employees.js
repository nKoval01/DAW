const container = document.getElementById('available');
const container2 = document.getElementById('unavailable');
var currentEmployeeId = null;

getPost('available',container);
getPost('unavailable',container2);
getProjects();

async function getProjects()
{
    let res = await fetch(`https://localhost:7232/api/projects/list`)
    res = await res.json();
    res.forEach(project => {
        const projElem = document.createElement('option');
        projElem.setAttribute('value',`${project.id}`);
        projElem.innerHTML = project.name;
        document.getElementById("Project").appendChild(projElem);
    })
}

async function getPost(type,cont) {
    
    let res = await fetch(`https://localhost:7232/api/employees/${type}`)
    res = await res.json();
    addDataToDOM(res,cont);
}

function addDataToDOM(data,cont) {
    cont.innerHTML = "";
    data.forEach(employee => {
        const postElement = document.createElement('div');
        postElement.setAttribute('class','blog-post');
        postElement.setAttribute('id',`${employee.id}`)
        postElement.innerHTML = `
            <h2 class="title">${employee.firstName} ${employee.lastName}</h2>
            <p class="text">${employee.jobRole}</p>
            `;
        if (cont==container2)
        {
            postElement.innerHTML+=`<p class="text">${employee.projectName}</p>`
        }
        cont.appendChild(postElement);
    });
    if (cont==container2)
        setEmployees();
}

function FormatDate(date)
{
    var year = date.toLocaleString("default", { year: "numeric" });
    var month = date.toLocaleString("default", { month: "2-digit" });
    var day = date.toLocaleString("default", { day: "2-digit" });

    var formattedDate = year + "-" + month + "-" + day;
    return formattedDate;
}

function setEmployees()
{
    const employees = document.getElementsByClassName('blog-post');
    for (let x = 0; x < employees.length; x++) {
        employees[x].addEventListener("click", async () => {
            // alert(employees[x].id);
            currentEmployeeId = employees[x].id;
            let res = await fetch(`https://localhost:7232/api/employees/${employees[x].id}`)
            res = await res.json();
            document.getElementById("LastName").value = res.lastName;
            document.getElementById("FirstName").value = res.firstName;
            if (res.projectId != null)
                document.getElementById("Project").value = res.projectId;
            else 
                document.getElementById("Project").value = "null";
            document.getElementById("Price").value = res.salaryPerHour;
            if (res.endDate != null)
                document.getElementById("EndDate").value = FormatDate(new Date(res.endDate));
            else 
                document.getElementById("EndDate").value = "";
            document.getElementById("JobRole").value = res.jobRole;
            document.getElementById("Hours").value = res.workHours;
            document.getElementById("StartDate").value = FormatDate(new Date(res.startDate));
        });
    }
}

function FormReset()
{
    document.getElementById("LastName").value = "";
    document.getElementById("FirstName").value = "";
    document.getElementById("Project").value = "null";
    document.getElementById("Price").value = "";
    document.getElementById("EndDate").value = "";
    document.getElementById("JobRole").value = "";
    document.getElementById("Hours").value = "";
    document.getElementById("StartDate").value = "";
    currentEmployeeId = null;
}

document.getElementById("deleteEmployee").addEventListener("click",async ()=>
{
    if (currentEmployeeId != null)
    {
        var employee = document.getElementById(currentEmployeeId);
        employee.parentNode.removeChild(employee)
        FormReset();
        await fetch(`https://localhost:7232/api/employees/${currentEmployeeId}`, { method: 'DELETE' });
    }
})

document.getElementById("saveChanges").addEventListener("click", async ()=>
{
    if (currentEmployeeId != null)
    {
        var projectId;
        if (document.getElementById("Project").value == "null")
            projectId = null;
        else
            projectId = document.getElementById("Project").value;
        var endDate;
        if (document.getElementById("EndDate").value == "")
            endDate = null;
        else
            endDate = document.getElementById("EndDate").value;

        await fetch (`https://localhost:7232/api/employees/${currentEmployeeId}`, {
            method: "PUT",
            headers: {
                "Content-Type" : "application/json"
                },
            body: JSON.stringify(
                {
                "lastName": document.getElementById("LastName").value,
                "firstName":document.getElementById("FirstName").value,
                "projectId":projectId,
                "salaryPerHour":document.getElementById("Price").value,
                "endDate":endDate,
                "jobRole":document.getElementById("JobRole").value,
                "workHours":document.getElementById("Hours").value,
                "startDate":document.getElementById("StartDate").value
                }
            )
            })

        getPost('available',container);
        getPost('unavailable',container2);
    }
})