<template>
    <div class="flex flex-col gap-y-20">
        <div class="bg-gray-100/45 p-2 rounded space-y-5">
            <div class="flex items-center gap-x-3">
                <Icon icon="ic:round-report" class="text-3xl text-gray-500" />
                <h1 class="text-lg font-medium">Reported Posts Lists</h1>
            </div>
            <table class="border w-full">
                <thead>
                    <tr class="font-medium">
                        <td class="w-[14.2%] border text-center py-1">Posted By</td>
                        <td class="w-[14.2%] border text-center py-1">Post Description</td>
                        <td class="w-[14.2%] border text-center py-1">Attachments</td>
                        <td class="w-[14.2%] border text-center py-1">Date posted</td>
                        <td class="w-[14.2%] border text-center py-1">Actions</td>
                    </tr>
                </thead>
                <tbody v-if="!loading && reportedPost?.length > 0">
                    <tr v-for="(post, index) in reportedPost" :key="index">
                        <td class="border text-center py-1">
                            {{ post.name }}
                        </td>
                        <td class="border text-center py-1">
                            <p class="line-clamp-2">{{ post.postDetails }}</p>
                        </td>
                        <td class="border text-center py-1">
                            {{ post.postImages?.length }} attach
                        </td>
                        <td class="border text-center py-1">
                            {{ formattedDate(post?.postedAt) }}
                        </td>
                        <td class="border text-center py-1">
                            <div class="flex justify-center gap-x-2 text-lg">
                                <Icon icon="mdi:trash" class="text-green-500 cursor-pointer" @click="deletePost(post.id, index)" />
                            </div>
                        </td>
                    </tr>
                </tbody>
                <tbody v-if="!loading && !reportedPost?.length">
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

const reportsLists = computed(() => dataStore.reportsLists)

// references
const postsRef = collection(db, 'posts')
const reportedPost = ref([])


const getPosts = async () => {
    try {
        for(const report of reportsLists.value){

            const postsRef = doc(db, 'posts', report.postId)

            const snapshot = await getDoc(postsRef)

            reportedPost.value.push({
                id: snapshot.id,
                ...snapshot.data()
            })
        }
    } catch (error) {
        console.log(error)
    }
}

const formattedDate = (Timestamp) => {
    const date = new Date(Timestamp?.seconds * 1000)
    return moment(date).format('ll')
}

const loading = ref(false)

const deletePost = async (id, index) => {
    try {
        const postsRef = doc(db, 'posts', id)
        await deleteDoc(postsRef)

        const reportsRef = collection(db, 'reports');
        const q = query(reportsRef, where('postId', '==', id));

        const querySnapshot = await getDocs(q);

        querySnapshot.forEach(async (document) => {
            await deleteDoc(doc(db, 'reports', document.id));
        });

        reportedPost.value.splice(index, 1)
    } catch (error) {
        console.log(error)
    }
}

onMounted(async() => {
    loading.value = true
    await dataStore.getReports()
    getPosts()
    loading.value = false
})

const addModal = ref(false)
</script>