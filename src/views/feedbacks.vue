<template>
    <div class="flex flex-col gap-y-20">
        <div class="bg-gray-100/45 p-2 rounded space-y-5">
            <div class="flex items-center gap-x-3">
                <Icon icon="mdi:feedback" class="text-3xl text-gray-500" />
                <h1 class="text-lg font-medium">Feedbacks</h1>
            </div>
            <table class="border w-full">
                <thead>
                    <tr class="font-medium">
                        <td class="w-[14.2%] border text-center py-1">Feedback</td>
                        <td class="w-[14.2%] border text-center py-1">Actions</td>
                    </tr>
                </thead>
                <tbody v-if="!loading && feedbackLists?.length > 0">
                    <tr v-for="(feedback, index) in feedbackLists" :key="index">
                        <td class="border text-center py-1">
                            {{ feedback.feedback }}
                        </td>
                        <td class="border text-center py-1">
                            <div class="flex justify-center gap-x-2 text-lg">
                                <Icon icon="mdi:pencil" class="text-green-500 cursor-pointer" />
                                <Icon icon="mdi:trash" class="text-red-500 cursor-pointer" />
                            </div>
                        </td>
                    </tr>
                </tbody>
                <tbody v-if="!loading && !feedbackLists?.length">
                    <tr>
                        <td class="border text-center py-1" colspan="7">No reports to show</td>
                    </tr>
                </tbody>
                <tbody v-if="loading">
                    <tr>
                        <td colspan="7" class="text-center py-1">Loading...</td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
</template>

<script setup>
import AddUser from "../components/AddUserModal.vue";
import { db } from '../config/firebaseConfig'
import { collection, doc, getDoc, getDocs, query, where, deleteDoc } from 'firebase/firestore'
import { computed, onMounted, ref } from 'vue'
import moment from 'moment'
import { useDataStore } from '../store'

const dataStore = useDataStore()

const feedbackLists = computed(() => dataStore.feedbackLists)

const loading = ref(false)

onMounted(async() => {
    loading.value = true
    await dataStore.getFeedbacks()
    loading.value = false
})

const addModal = ref(false)
</script>