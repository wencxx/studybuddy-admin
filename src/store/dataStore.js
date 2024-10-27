import { defineStore } from 'pinia'
import { db } from '../config/firebaseConfig'
import { collection, getDocs } from 'firebase/firestore'

const useDataStore = defineStore('dataStore', {
    state: () => ({
        studentLists: [],
        postLists: [],
    }),
    actions: {
        async getStudents() {
            this.studentLists = []
            const studentRef = collection(db, 'users')

            try {
                const snapshots = await getDocs(studentRef)
        
                snapshots.docs.forEach(doc => {
                    this.studentLists.push({
                        id: doc.id,
                        ...doc.data()
                    })
                });
                console.log('Fetched students successfully')
            } catch (error) {
                console.log(error)
            }
        },
        async getPosts() {
            this.postLists = []
            const postsRef = collection(db, 'posts')

            try {
                const snapshots = await getDocs(postsRef)
        
                snapshots.docs.forEach(doc => {
                    this.postLists.push({
                        id: doc.id,
                        ...doc.data()
                    })
                });
                console.log('Fetched posts successfully')
            } catch (error) {
                console.log(error)
            }
        }
    }
})

export default useDataStore