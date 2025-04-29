function navigate(section) {
    const content = document.getElementById('content');
  
    if (section === 'customersCreate') {
      content.innerHTML = `
        <h1>Create New Client</h1>
      <form class="form-grid" id="clientForm" enctype="multipart/form-data">
        <label>Name <input type="text" name="name" required /></label>
        <label>Client ID <input type="text" name="clientId" required /></label>
        <label>Business Name <input type="text" name="businessName" required /></label>
        <label>Phone Number <input type="tel" name="phone" required /></label>
        <label>Email <input type="email" name="email" required /></label>
        <label>Business Address <input type="text" name="address" required /></label>
        <label>Role <input type="text" name="role" required /></label>
        <label>Date of Birth <input type="date" name="dob" required /></label>
        <label>Country <input type="text" name="country" required /></label>
        <label>State <input type="text" name="state" required /></label>
        <label>City <input type="text" name="city" required /></label>
        <label>Currency <input type="text" name="currency" required /></label>

        <!-- Image Upload with Preview -->
        <label>Avatar 
          <input type="file" name="avatar" id="avatar" accept="image/*" />
        </label>
        <div id="imagePreviewContainer" style="display:none;">
          <img id="imagePreview" src="#" alt="Avatar Preview" style="width:150px; height:150px; object-fit:cover; border-radius:8px;" />
          
          
        </div>

        <button type="submit">Create Client</button>
      </form>


      `;

      document.getElementById('avatar')?.addEventListener('change', function (event) {
        const file = event.target.files[0];
        
        if (!file) {
          return;
        }
      
        // Validate file size (2MB max)
        if (file.size > 2 * 1024 * 1024) {
          alert('File size exceeds 2MB');
          event.target.value = '';
          return;
        }
      
        // Validate file type
        const validTypes = ['image/png', 'image/jpeg', 'image/jpg'];
        if (!validTypes.includes(file.type)) {
          alert('Invalid file type. Allowed: png, jpg, jpeg');
          event.target.value = '';
          return;
        }
      
        // Display image preview
        const reader = new FileReader();
        reader.onload = function (e) {
          const imagePreview = document.getElementById('imagePreview');
          const container = document.getElementById('imagePreviewContainer');
          imagePreview.src = e.target.result;
          container.style.display = 'block';
        };
        reader.readAsDataURL(file);
      });
      
      document.getElementById('clientForm')?.addEventListener('submit', async function (event) {
        event.preventDefault();
      
        const formData = new FormData(this);
      
        try {
          const response = await fetch('http://localhost:3000/api/clients', {
            method: 'POST',
            body: formData,
          });
      
          const data = await response.json();
          if (!response.ok) {
            throw new Error(data.error || 'Error creating client');
          }
      
          alert(data.message);
        } catch (error) {
          console.error('Error submitting form:', error);
          alert(error.message);
        }
      });
      
      
      
      
    } else if (section === 'customersView') {
      content.innerHTML = `<h1>Customer List - Coming Soon</h1>`;
    } else if (section === 'clients') {
      content.innerHTML = `<h1>Clients Section - Manage Clients Here</h1>`;
    } else {
      content.innerHTML = `<h1>Welcome to the ${section.charAt(0).toUpperCase() + section.slice(1)}</h1>`;
    }
  }
  
  function toggleDropdown() {
    const dropdown = document.getElementById('customerDropdown');
    dropdown.classList.toggle('show');
  }

  async function loadClients() {
    try {
      const response = await fetch('http://localhost:3000/api/clients');
      const clients = await response.json();
  
      const content = document.getElementById('content');
      content.innerHTML = `
        <h1>Clients</h1>
        <table>
          <thead>
            <tr>
              <th>Avatar</th>
              <th>Client ID</th>
              <th>Name</th>
              <th>Business</th>
              <th>Phone</th>
              <th>Email</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            ${clients.map(client => `
              <tr>
                <td>
                  ${client.avatar ? `<img src="${client.avatar}" alt="avatar" width="40" height="40" style="border-radius: 50%;">` : 'N/A'}
                </td>
                <td>${client.clientId}</td>
                <td>${client.name}</td>
                <td>${client.businessName}</td>
                <td>${client.phone}</td>
                <td>${client.email}</td>
                <td><span class="${client.status === 'Active' ? 'status-active' : 'status-inactive'}">${client.status}</span></td>
                <td>
                  <button onclick="viewClient('${client._id}')">View</button>
                  <button onclick="deleteClient('${client._id}')">Delete</button>
                </td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      `;
    } catch (error) {
      console.error('Error loading clients:', error);
    }
  }
  
  function navigate(page) {
    if (page === 'clients') {
      loadClients();
    }
  }
  
  function toggleDropdown(id) {
    var dropdown = document.getElementById(id);
    dropdown.classList.toggle("show");
  }
  
  // Close dropdown when clicking outside
  window.onclick = function(event) {
    if (!event.target.matches('.dropdown')) {
      let dropdowns = document.querySelectorAll('.dropdown-menu');
      dropdowns.forEach(menu => menu.classList.remove('show'));
    }
  };
  
  