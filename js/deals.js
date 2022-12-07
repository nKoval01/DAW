const container = document.getElementById('container');
var currentDealId = null;
const newClients = document.getElementById('NewClient');
const newProjects = document.getElementById('NewProject');

getPost();
getClients(newClients);
getProjects(newProjects);

async function getProjects(elem)
{
    let res = await fetch(`https://localhost:7232/api/projects/list`)
    res = await res.json();
    res.forEach(project => {
        const projElem = document.createElement('option');
        projElem.setAttribute('value',`${project.id}`);
        projElem.innerHTML = project.name;
        elem.appendChild(projElem);
    })
}

async function getClients(elem)
{
    let res = await fetch(`https://localhost:7232/api/clients/list`)
    res = await res.json();
    res.forEach(client => {
        const projElem = document.createElement('option');
        projElem.setAttribute('value',`${client.id}`);
        projElem.innerHTML = client.companyName;
        elem.appendChild(projElem);
    })
}

async function getPost() {
    
    let res = await fetch(`https://localhost:7232/api/deals`)
    res = await res.json();
    addDataToDOM(res);
}

function FormatDate(date)
{
    var year = date.toLocaleString("default", { year: "numeric" });
    var month = date.toLocaleString("default", { month: "2-digit" });
    var day = date.toLocaleString("default", { day: "2-digit" });

    var formattedDate = year + "-" + month + "-" + day;
    return formattedDate;
}

function addDataToDOM(data) {
    container.innerHTML = "";
    data.forEach(deal => {
        console.log(deal)
        const postElement = document.createElement('div');
        postElement.setAttribute('class','blog-post');
        postElement.setAttribute('id',`${deal.id}`);
        postElement.innerHTML = `
        <h2 class="single">${deal.name}</h2>
        <input type="button" value="Save" id="saveDeal" class="save-btn"/>
            <div>
                  <div class="form-group">
                    <label>Client</label>
                    <input type="text" id="Client" className="form-control" value="${deal.client}" />
                  </div>
                  <div class="form-group">
                      <label>Project</label>
                      <input type="text" id="Project" className="form-control" value="${deal.project}" />
                  </div>
            </div>
            <div>
                  <div class="form-group">
                    <label>Price per hour</label>
                    <input type="text" id="pricePerHour" className="form-control" value="${deal.pricePerHour}" />
                  </div>
                  <div class="form-group">
                      <label>Likelihood</label>
                      <input type="text" id="likelihood" className="form-control" value="${deal.likelihood}" />
                </div>
            </div>
            <div>
                  <div class="form-group">
                    <label>Start date</label>
                    <input type="date" id="prospectedStartDate" class="date" className="form-control" value="${FormatDate(new Date(deal.prospectedStartDate))}" />
                  </div>
                  <div class="form-group">
                      <label>Prospected hours</label>
                      <input type="text" id="prospectedHours" className="form-control" value="${deal.prospectedHours}" />
                  </div>
            </div>
        `;
        container.appendChild(postElement);
    });
    // SetClients();
    // SetSaves();
}