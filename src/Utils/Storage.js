import { set, get, del } from 'idb-keyval'

export const saveProfilePhoto = blob => set('profilePhoto', blob)
export const loadProfilePhoto = () => get('profilePhoto')
export const clearProfilePhoto = () => del('profilePhoto')

