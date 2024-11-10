<template>
    <div class="flex flex-col gap-y-20">
        <div class="w-full flex justify-end">
            <button class="bg-blue-500 text-white rounded py-1 px-5 hover:bg-blue-600" @click="addModal = true">Add User</button>
        </div>
        <div class="bg-gray-100/45 p-2 rounded space-y-5">
            <div class="flex items-center gap-x-3">
                <Icon icon="mdi:user" class="text-3xl text-gray-500" />
                <h1 class="text-lg font-medium">Students Lists</h1>
            </div>
            <table class="border w-full">
                <thead>
                    <tr class="font-medium">
                        <td class="w-[14.2%] border text-center py-1">Student Number</td>
                        <td class="w-[14.2%] border text-center py-1">Name</td>
                        <td class="w-[14.2%] border text-center py-1">Year & Section</td>
                        <td class="w-[14.2%] border text-center py-1">Course</td>
                        <td class="w-[14.2%] border text-center py-1">Gender</td>
                        <td class="w-[14.2%] border text-center py-1">Birthdate</td>
                        <td class="w-[14.2%] border text-center py-1">Actions</td>
                    </tr>
                </thead>
                <tbody v-if="!loading && studentLists.length">
                    <tr v-for="(student, index) in studentLists" :key="index">
                        <td class="border text-center py-1">{{ student.studentNumber }}</td>
                        <td class="border text-center py-1">{{ student.displayName }}</td>
                        <td class="border text-center py-1">{{ student.yearSection }}</td>
                        <td class="border text-center py-1">{{ student.course }}</td>
                        <td class="border text-center py-1">{{ student.gender }}</td>
                        <td class="border text-center py-1">{{ formatBirthdate(student.birthdate) }}</td>
                        <td class="border text-center py-1">
                            <div class="flex justify-center gap-x-2 text-lg">
                                <Icon icon="mdi:pencil" class="text-green-500" />
                                <Icon icon="mdi:trash" class="text-red-500" @click="deleteStudent(student.userId, index)" />
                            </div>
                        </td>
                    </tr>
                </tbody>
                <tbody v-if="!loading && !studentLists.length">
                    <tr>
                        <td class="border text-center py-1" colspan="7">No students to show</td>
                    </tr>
                </tbody>
                <tbody v-if="loading">
                    <tr>
                        <td colspan="7" class="text-center py-1">Loading...</td>
                    </tr>
                </tbody>
            </table>
        </div>

        <AddUser v-if="addModal" @click.self="addModal = false" @addedData="addedNewUser"  @closeModal="addModal = false"/>
    </div>
</template>

<script setup>
import AddUser from "../components/AddUserModal.vue";
import { db } from '../config/firebaseConfig'
import { collection, getDocs, query, where, arrayRemove, deleteDoc, updateDoc, or } from 'firebase/firestore'
import { computed, onMounted, ref } from 'vue'
import moment from 'moment'
import { useDataStore } from '../store'
import axios from 'axios'
import { useToast } from 'vue-toast-notification'
import 'vue-toast-notification/dist/theme-sugar.css'

const $toast = useToast()

// https://nopsscea-server.vercel.app/

const dataStore = useDataStore()

const studentLists = computed(() => dataStore.studentLists)

// students references
const studentRef = collection(db, 'users')


const formatBirthdate = (date) => {
    return moment(date).format('ll')
}
const loading = ref(false)

onMounted(async() => {
    loading.value = true
    await dataStore.getStudents()
    loading.value = false
})

const addedNewUser = (data) => {
    studentLists.value.unshift(data)
}

// delete user and related data
const commentsRef = collection(db, 'comments')
// userId
const marketplaceRef = collection(db, 'marketplace')
// userId
const messagesRef = collection(db, 'messages')
// sendBy, receiveBY
const answeredQuizRef = collection(db, 'answeredQuiz')
const notesRef = collection(db, 'notes')
// userId, sharedTo,
const notificationsRef = collection(db, 'notifications')
// to, from
const postsRef = collection(db, 'posts')
// userId
const quizzesRef = collection(db, 'quizzes')
// userId, sharedTo,
const usersRef = collection(db, 'users')
// userId

const deleteStudent = async (studentId, index) => {
    try {
        const res = await axios.delete(`https://studybuddy-server-navy.vercel.app/delete-user/${studentId}`);

        console.log(res.data)

        if (res.data === 'successfully deleted') {
            studentLists.value.splice(index, 1)
            $toast.success('Delete student successfully')
            $toast

            const commentsSnap = await getDocs(query(commentsRef, where('userId', '==', studentId)));
            commentsSnap.forEach(async (doc) => await deleteDoc(doc.ref));

            const marketplaceSnap = await getDocs(query(marketplaceRef, where('userId', '==', studentId)));
            marketplaceSnap.forEach(async (doc) => await deleteDoc(doc.ref));

            const messagesSnap = await getDocs(query(messagesRef, or(where('sendBy', '==', studentId), where('receiveBy', '==', studentId))));
            messagesSnap.forEach(async (doc) => await deleteDoc(doc.ref));
            
            const answeredQuizSnap = await getDocs(query(answeredQuizRef, where('userId', '==', studentId)));
            answeredQuizSnap.forEach(async (doc) => await deleteDoc(doc.ref));

            const notesSnap = await getDocs(query(notesRef, where('userId', '==', studentId)));
            notesSnap.forEach(async (doc) => await deleteDoc(doc.ref));

            const sharedNotesSnap = await getDocs(query(notesRef, where('sharedTo', 'array-contains', studentId)));
            sharedNotesSnap.forEach(async (doc) => await updateDoc(doc.ref, {
                sharedTo: arrayRemove(studentId)
            }));

            const notificationsSnapTo = await getDocs(query(notificationsRef, or(where('to', '==', studentId), where('from', '==', studentId) )));
            notificationsSnapTo.forEach(async (doc) => await deleteDoc(doc.ref));

            const postsSnap = await getDocs(query(postsRef, where('userId', '==', studentId)));
            postsSnap.forEach(async (doc) => await deleteDoc(doc.ref));

            const quizzesSnap = await getDocs(query(quizzesRef, where('userId', '==', studentId)));
            quizzesSnap.forEach(async (doc) => await deleteDoc(doc.ref));

            const usersSnap = await getDocs(query(usersRef, where('userId', '==', studentId)));
            usersSnap.forEach(async (doc) => await deleteDoc(doc.ref));

            const sharedQuizzesSnap = await getDocs(query(quizzesRef, where('sharedTo', 'array-contains', studentId)));
            sharedQuizzesSnap.forEach(async (doc) => await updateDoc(doc.ref, {
                sharedTo: arrayRemove(studentId)
            }));

            console.log('All related data deleted successfully.');
        }
    } catch (error) {
        console.error('Error deleting student and related data:', error);
        $toast.error('Failed to delete student')
    }
};

const addModal = ref(false)
</script>