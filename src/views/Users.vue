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
import { collection, getDocs } from 'firebase/firestore'
import { computed, onMounted, ref } from 'vue'
import moment from 'moment'
import { useDataStore } from '../store'

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

const addModal = ref(false)
</script>