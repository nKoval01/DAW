const container = document.getElementById('container');
var currentClientId = null;

getPost();

async function getPost(type,cont) {
    
    let res = await fetch(`https://localhost:7232/api/clients`)
    res = await res.json();
    addDataToDOM(res);
}

function addDataToDOM(data) {
    container.innerHTML = "";
    data.forEach(client => {
        const postElement = document.createElement('div');
        postElement.setAttribute('class','blog-post');
        postElement.setAttribute('id',`${client.id}`);
        postElement.innerHTML = `
        <h2 class="single">${client.companyName}</h2>
        <input type="button" value="Save" id="saveClient" class="save-btn"/>
        <div>
              <h3>Contacts</h3>
                  <div class="form-group">
                    <label>Contact number</label>
                    <input type="text" id="Number" className="form-control" value="${client.contactNumber}" />
                  </div>
                  <div class="form-group">
                      <label>Physical address</label>
                      <input type="text" id="Address" className="form-control" value="${client.address}" />
                  </div>
            </div>
            <div>
                      <h3>Representatives</h3>
                  <div class="form-group">
                    <label>Company representative</label>
                    <input type="text" id="Company" className="form-control" value="${client.companyRepresentative}" />
                  </div>
                  <div class="form-group">
                      <label>Vendor representative</label>
                      <input type="text" id="Vendor" className="form-control" value="${client.vendorRepresentative}" />
                </div>
            </div>
            <div class="deals">
                <h3>Deals</h3>
                <ul id="deals">
                </ul>
            </div>
        `;
        container.appendChild(postElement);

        const dealsList = document.getElementById('deals');
        client.deals.forEach(deal => {
            // console.log(deal);
            var li = document.createElement("li");
            li.appendChild(document.createTextNode(deal));
            dealsList.appendChild(li);
        });
    });
    SetClients();
    SetSaves();
}

function SetClients()
{
    const clients = document.getElementsByClassName('blog-post');
    for (let x = 0; x < clients.length; x++) {
        clients[x].addEventListener("click",() => {
            // alert(clients[x].id)
            var id= clients[x].id;
            if (currentClientId != id)
            {
                currentClientId = id;
                for (let y = 0; y < clients.length; y++){
                    clients[y].setAttribute('class','blog-post');
                }
                clients[x].className = 'blog-post current-post';
            }
        })
    }
}

function ChangesAreValid(a,b,c,d)
{
    return (a!="" && b!="" && c!="" && d!="");
}

function SetSaves()
{
    const btns = document.getElementsByClassName('save-btn');
    for (let x= 0; x<btns.length; x++){
        btns[x].addEventListener('click', async () => {
            id = btns[x].parentNode.id;
                var address,vendor,number,company;
                var inputs = document.getElementById(id).querySelectorAll('input');
                inputs.forEach(input => {
                    switch(input.id){
                        case 'Address':
                            address = input.value;
                            break;
                        case 'Vendor':
                            vendor = input.value;
                            break;
                        case 'Number':
                            number = input.value;
                            break;
                        case 'Company':
                            company = input.value;
                            break;
                    }
                })
                if (ChangesAreValid(address,vendor,number,company))
                {
                    await fetch (`https://localhost:7232/api/clients/${id}`, {
                        method: "PUT",
                        headers: {
                            "Content-Type" : "application/json"
                            },
                        body: JSON.stringify(
                            {
                                "contactNumber": number,
                                "address": address,
                                "companyRepresentative": company,
                                "vendorRepresentative": vendor
                            }
                        )
                        })
                }
        })
    }
}

function FormIsValid()
{
    var a = document.getElementById('address').value;
    var b = document.getElementById('venRepres').value;
    var c = document.getElementById('number').value;
    var d = document.getElementById('comRepres').value;
    var e = document.getElementById('name').value;
    return (a!="" && b!="" && c!="" && d!="" && e!="");
}

function FormReset()
{
    document.getElementById('address').value = "";
    document.getElementById('venRepres').value = "";
    document.getElementById('number').value = "";
    document.getElementById('comRepres').value = "";
    document.getElementById('name').value = "";
}

document.getElementById('addClient').addEventListener('click', async () => {
     if(FormIsValid())
     {
        await fetch (`https://localhost:7232/api/clients`, {
            method: "POST",
            headers: {
                "Content-Type" : "application/json"
                },
            body: JSON.stringify(
                {
                "companyName": document.getElementById('name').value,
                "contactNumber": document.getElementById('number').value,
                "address": document.getElementById('address').value,
                "companyRepresentative": document.getElementById('comRepres').value,
                "vendorRepresentative": document.getElementById('venRepres').value
                }
            )
            })

        getPost();
        FormReset();
     }   
})

document.getElementById('deleteClient').addEventListener('click', async () => {
    if (currentClientId != null)
    {
        var client = document.getElementById(currentClientId);
        client.parentNode.removeChild(client)
        await fetch(`https://localhost:7232/api/clients/${currentClientId}`, { method: 'DELETE' });
    }
})