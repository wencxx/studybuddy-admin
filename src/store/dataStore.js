import { defineStore } from 'pinia'
import { db } from '../config/firebaseConfig'
import { collection, getDocs } from 'firebase/firestore'

const useDataStore = defineStore('dataStore', {
    state: () => ({
        studentLists: [],
        postLists: [],
        reportsLists: [],
        feedbackLists: [],
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
        },
        async getReports() {
            this.reportsLists = []
            const reportsRef = collection(db, 'reports')

            try {
                const snapshots = await getDocs(reportsRef)
        
                snapshots.docs.forEach(doc => {
                    this.reportsLists.push({
                        id: doc.id,
                        ...doc.data()
                    })
                });
                console.log('Fetched reports successfully')
            } catch (error) {
                console.log(error)
            }
        },
        async getFeedbacks() {
            this.feedbackLists = []
            const feedbacksRef = collection(db, 'feedback')

            try {
                const snapshots = await getDocs(feedbacksRef)
        
                snapshots.docs.forEach(doc => {
                    this.feedbackLists.push({
                        id: doc.id,
                        ...doc.data()
                    })
                });
                console.log('Fetched feedback successfully')
            } catch (error) {
                console.log(error)
            }
        }
    }
})

export default useDataStore