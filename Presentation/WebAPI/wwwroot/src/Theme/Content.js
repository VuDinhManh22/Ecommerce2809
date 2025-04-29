// Get elements for sidebar, main content, menu container, user greeting, and brand text
const sidebar = document.getElementById('sidebar');
const mainContent = document.getElementById('main-content');
const toggleButton = document.getElementById('toggleSidebar');
const menuContainer = document.querySelector('.menu');
const userInfo = document.querySelector('.user-info');
const brandText = document.querySelector('.brand-text');

// Toggle sidebar and adjust main content
toggleButton.addEventListener('click', () => {
    sidebar.classList.toggle('closed');
    mainContent.classList.toggle('closed');
    userInfo.classList.toggle('d-none'); 
    menuContainer.classList.toggle('d-none'); 
    brandText.classList.toggle('d-none'); 
});

// Menu data structure
const storedMenu = localStorage.getItem('mainNavigations');
let menuData = [];
if (storedMenu) {
    menuData = JSON.parse(storedMenu);
} else {
    console.log('Menu data not found in localStorage.');
}

const selectedMenu = localStorage.getItem('selected-menu');

// Generate menu items
menuData?.forEach(parent => {
    const parentItem = document.createElement('div');
    parentItem.className = 'menu-item';
    parentItem.innerHTML = `
        <span>${parent.caption}</span>
        <span class="caret">&#9656;</span> <!-- Caret for submenu -->
    `;
    menuContainer.appendChild(parentItem);

    // Create submenu for parent item
    const submenu = document.createElement('div');
    submenu.className = 'submenu';

    let isChildSelected = false; // Track if a child item is selected

    parent?.children?.forEach(child => {
        const childItem = document.createElement('a');
        childItem.href = child?.url;
        childItem.className = 'menu-item';
        childItem.innerText = child?.caption;

        // Jika child tidak diizinkan (isAuthorized = false), tambahkan icon gembok
        if (!child?.isAuthorized) {
            const lockIcon = document.createElement('span');
            lockIcon.className = 'lock-icon'; // Berikan class untuk styling icon
            lockIcon.innerHTML = '🔒'; // Anda bisa menggunakan ikon gembok lain (misal dari FontAwesome)
            childItem.appendChild(lockIcon); // Tambahkan icon ke elemen childItem
        }

        // Check if the current URL matches the menu item URL or matches selected-menu from localStorage
        if (selectedMenu === child?.name || window.location.pathname === child?.url) {
            childItem.classList.add('menu-selected');
            submenu.classList.add('open'); // Automatically open the parent submenu
            const caret = parentItem.querySelector('.caret');
            caret.classList.add('rotate'); // Rotate caret when submenu is open
            isChildSelected = true; // Mark this parent as containing a selected child
        }

        // Add event listener to save selected menu to localStorage when clicked
        childItem.addEventListener('click', () => {
            localStorage.setItem('selected-menu', child?.name); // Save clicked menu name
        });

        submenu.appendChild(childItem);
    });

    // Append submenu to parent item
    menuContainer.appendChild(submenu);

    // Toggle submenu display on click, regardless of child selection
    parentItem.addEventListener('click', () => {
        submenu.classList.toggle('open');
        const caret = parentItem.querySelector('.caret');
        caret.classList.toggle('rotate'); // Rotate caret when toggled
    });
});

const firstName = localStorage.getItem('firstName')?.replace(/"/g, '');
const lastName = localStorage.getItem('lastName')?.replace(/"/g, '');

if (firstName && lastName) {
    document.getElementById('username').textContent = `${firstName} ${lastName}`;
} else {
    document.getElementById('username').textContent = 'UserName'; 
}

//Get currently active config
fetch('/api/Config/GetActiveConfig', {
    method: 'GET',
    headers: {
        'Content-Type': 'application/json',
    }
})
.then(response => {
    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json();
})
.then(data => {
    document.getElementById('activeConfig').textContent = data?.content?.data?.name;
    document.getElementById('activeCurrency').textContent = data?.content?.data?.currencyName;
})
.catch(error => {
    console.error('Error during API call:', error);
});
