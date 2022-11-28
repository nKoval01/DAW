const container = document.getElementById('container');

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
                    <input type="text" id="LastName" className="form-control" value="${client.companyRepresentative}" />
                  </div>
                  <div class="form-group">
                      <label>Vendor representative</label>
                      <input type="text" id="LastName" className="form-control" value="${client.vendorRepresentative}" />
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
            console.log(deal);
            var li = document.createElement("li");
            li.appendChild(document.createTextNode(deal));
            dealsList.appendChild(li);
        });
    });
    // if (cont==container2)
    //     setEmployees();
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