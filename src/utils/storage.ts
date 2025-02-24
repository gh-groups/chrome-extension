import { Group } from '../types';

// Storage key for GitHub repository groups
const STORAGE_KEY = 'githubRepoGroups';

/**
 * Get all groups from Chrome storage
 * @returns Promise with array of groups
 */
export const getGroups = (): Promise<Group[]> => {
    return new Promise((resolve) => {
        chrome.storage.sync.get([STORAGE_KEY], (result) => {
            resolve(result[STORAGE_KEY] || []);
        });
    });
};

/**
 * Save a new group to Chrome storage
 * @param groupName Name of the new group
 * @returns Promise with the updated array of groups
 */
export const saveGroup = async (groupName: string): Promise<Group[]> => {
    const groups = await getGroups();

    const newGroup: Group = {
        id: Date.now(),
        name: groupName,
        repositories: [],
        createdAt: new Date().toISOString()
    };

    groups.push(newGroup);

    return new Promise((resolve) => {
        chrome.storage.sync.set({ [STORAGE_KEY]: groups }, () => {
            resolve(groups);
        });
    });
};

/**
 * Update the counter element with the current group count
 */
export const updateCounter = async (): Promise<void> => {
    const groups = await getGroups();
    const counter = document.getElementById('groups-counter');
    if (counter) {
        counter.textContent = groups.length.toString();
    }
};