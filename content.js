/**
 * This function adds a new tab to the organization nav bar
 * that allows users to view and manage groups of repositories.
 * 
 * @returns {void}
 */
function addGroupsTab() {

    // Find the navigation list in the organization view
    const navList = document.querySelector('.UnderlineNav-body');

    if (!navList) return;

    // Create the new Groups tab container
    const newNavElement = document.createElement('li');
    newNavElement.setAttribute('data-view-component', 'true');
    newNavElement.className = 'd-inline-flex';

    // Create the groups tab link
    const groupsTabToBeAdded = document.createElement('a');
    groupsTabToBeAdded.id = 'groups-tab';
    groupsTabToBeAdded.href = '#groups';
    groupsTabToBeAdded.setAttribute('data-tab-item', 'groups-tab');
    groupsTabToBeAdded.setAttribute('data-selected-links', 'groups');
    groupsTabToBeAdded.setAttribute('data-view-component', 'true');
    groupsTabToBeAdded.className = 'UnderlineNav-item no-wrap js-responsive-underlinenav-item js-selected-navigation-item';

    groupsTabToBeAdded.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="octicon UnderlineNav-octicon" data-view-component="true" viewBox="0 0 16 16">
            <path d="M.54 3.87.5 3a2 2 0 0 1 2-2h3.672a2 2 0 0 1 1.414.586l.828.828A2 2 0 0 0 9.828 3h3.982a2 2 0 0 1 1.992 2.181l-.637 7A2 2 0 0 1 13.174 14H2.826a2 2 0 0 1-1.991-1.819l-.637-7a2 2 0 0 1 .342-1.31zM2.19 4a1 1 0 0 0-.996 1.09l.637 7a1 1 0 0 0 .995.91h10.348a1 1 0 0 0 .995-.91l.637-7A1 1 0 0 0 13.81 4zm4.69-1.707A1 1 0 0 0 6.172 2H2.5a1 1 0 0 0-1 .981l.006.139q.323-.119.684-.12h5.396z"/>
        </svg>
        <span data-view-component="true">Groups</span>
        <span title="Group count" data-view-component="true" class="Counter" id="groups-counter">0</span>
    `;

    // Add click handler
    groupsTabToBeAdded.addEventListener('click', (e) => {
        e.preventDefault();
        toggleGroupsSideBar();
    });

    // Add the tab to the list item and the list item to navigation
    newNavElement.appendChild(groupsTabToBeAdded);
    navList.appendChild(newNavElement);

    chrome.storage.sync.get(['githubRepoGroups'], (result) => {
        const groups = result.githubRepoGroups || [];
        const counter = document.getElementById('groups-counter');
        if (counter) {
            counter.textContent = groups.length;
            console.log(`Updated groups counter: ${groups.length} groups`);
        }
    });
}


/**
 * This function displays the groups view in the sidebar
 * and allows users to manage groups of repositories.
 */
function toggleGroupsSideBar() {
    // Check if sidebar already exists (offset to right)
    let sidebar = document.getElementById('groups-sidebar');
    let sidebarOverlay = document.getElementById('groups-sidebar-overlay');

    const createSidebarElementAndOverlay = () => {
        // Create the sidebar container if it doesn't exist
        sidebar = document.createElement('div');
        sidebar.id = 'groups-sidebar';
        sidebar.className = 'groups-sidebar';
        sidebar.innerHTML = `
                <div class="groups-sidebar-header">
                <h3 class="f5 text-bold">Repository Groups</h3>
                <button class="close-button" aria-label="Close">
                    <svg class="octicon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" width="16" height="16">
                    <path fill="currentColor" d="M3.72 3.72a.75.75 0 011.06 0L8 6.94l3.22-3.22a.75.75 0 111.06 1.06L9.06 8l3.22 3.22a.75.75 0 11-1.06 1.06L8 9.06l-3.22 3.22a.75.75 0 01-1.06-1.06L6.94 8 3.72 4.78a.75.75 0 010-1.06z"></path>
                    </svg>
                </button>
                </div>
                <div class="groups-sidebar-content">
                <div class="groups-actions">
                    <button class="btn btn-sm btn-primary" id="create-group">
                    <svg class="octicon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" width="16" height="16">
                        <path fill="currentColor" d="M7.75 2a.75.75 0 01.75.75V7h4.25a.75.75 0 110 1.5H8.5v4.25a.75.75 0 11-1.5 0V8.5H2.75a.75.75 0 010-1.5H7V2.75A.75.75 0 017.75 2z"></path>
                    </svg>
                    New Group
                    </button>
                </div>
                <div class="groups-list">
                    <!-- Groups will be dynamically added here -->
                </div>
                </div>
        `;

        // Create the sidebar overlay
        sidebarOverlay = document.createElement('div');
        sidebarOverlay.id = 'groups-sidebar-overlay';
        sidebarOverlay.className = 'groups-sidebar-overlay';

        // Add the sidebar and overlay to the page
        document.body.appendChild(sidebarOverlay);
        document.body.appendChild(sidebar);

        // Add event listeners
        sidebar
            .querySelector('.close-button')
            .addEventListener('click', () => {
                sidebar.classList.remove('is-open');
                sidebarOverlay.classList.remove('is-open');
            });

        document.getElementById('create-group').addEventListener('click', createNewGroup);
        sidebarOverlay.addEventListener('click', () => {
            sidebar.classList.remove('is-open');
            sidebarOverlay.classList.remove('is-open');
        });
    }

    if (!sidebar && !sidebarOverlay) {
        // create the sidebar with its overlay
        createSidebarElementAndOverlay();
    }

    // Show the sidebar and overlay
    sidebarOverlay.classList.add('is-open');
    sidebar.classList.add('is-open');

    // Update the groups list
    updateGroupsUI()
}


/**
 * This function creates a new group of repositories.
 * It prompts the user to enter a group name and saves
 * the group to localStorage.
 * 
 * @returns {void}
 */
function createNewGroup() {
    // Implementation for creating a new group
    const groupName = prompt('Enter group name:');
    if (!groupName) return;

    // Save a new group to localStorage and update the counter
    const saveGroupToStorage = (groupName) => {

        chrome.storage.sync.get(['githubRepoGroups'], (result) => {
            const existingGroups = result.githubRepoGroups || [];

            const newGroup = {
                id: 'MAAK-CORP-' + Date.now(),
                name: groupName,
                repositories: [],
                createdAt: new Date().toISOString()
            };

            existingGroups.push(newGroup);

            chrome.storage.sync.set({ 'githubRepoGroups': existingGroups }, () => {
                document.getElementById('groups-counter').textContent = existingGroups.length;
                updateGroupsUI();
            });
        });
    }

    saveGroupToStorage(groupName);
}


// Update the groups UI to display all saved groups
function updateGroupsUI() {
    const groupsList = document.querySelector('.groups-list');
    if (!groupsList) return;

    chrome.storage.sync.get(['githubRepoGroups'], (result) => {
        const groups = result.githubRepoGroups || [];

        groupsList.innerHTML = '';

        if (groups.length === 0) {
            // Display a message if no groups exist
            groupsList.innerHTML = '<div class="no-groups-message p-3 text-center color-fg-muted">No groups created yet</div>';
            return;
        }

        groups.forEach(group => {
            const groupElement = document.createElement('div');
            groupElement.className = 'group-item p-2 border-bottom d-flex flex-justify-between';
            groupElement.innerHTML = `
        <div class="group-name f5">${group.name}</div>
        <div class="group-actions">
            <span class="repo-count Counter">${group.repositories.length}</span>
        </div>
    `;

            groupElement.addEventListener('click', () => {
                alert('Display repositories in group');
                // @AymKh
                // Implement this to display repositories in the group
            });

            groupsList.appendChild(groupElement);
        });
    });
}


// ******** Initialize the extension ********
addGroupsTab();

// Set up a MutationObserver to handle dynamic page updates
const observer = new MutationObserver((mutations) => {
    for (const mutation of mutations) {
        if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
            if (!document.querySelector('.UnderlineNav-item[href="#groups"]')) {
                addGroupsTab();
            }
        }
    }
});

// Start observing the document with the configured parameters
observer.observe(document.body, {
    childList: true,
    subtree: true
});