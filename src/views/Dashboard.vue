<template>
    <div>
        <div class="grid grid-cols-3 gap-10">
            <div class="rounded-xl bg-white border h-28 clear-start flex items-center p-5 gap-x-5">
                <div class="bg-green-400 h-full aspect-square flex items-center justify-center rounded-lg">
                    <Icon icon="mdi:person" class="text-white text-4xl" />
                </div>
                <div class="h-full w-full flex flex-col justify-between">
                    <div class="flex w-full items-center justify-between">
                        <h1 class="text-sm font-medium">Total students</h1>
                        <p class="text-xs text-gray-500">{{ formattedDateNow() }}</p>
                    </div>
                    <h1 class="text-2xl">{{ studentsList.length }}</h1>
                    <div class="flex items-center text-orange-500">
                        <Icon icon="iconamoon:trend-up" class="text-xs" />
                        <p class="text-xs">+{{ calculateAddedStudentsList() }}% last month</p>
                    </div>
                </div>
            </div>
            <div class="rounded-xl bg-white border h-28 clear-start flex items-center p-5 gap-x-5">
                <div class="bg-blue-400 h-full aspect-square flex items-center justify-center rounded-lg">
                    <Icon icon="mdi:person" class="text-white text-4xl" />
                </div>
                <div class="h-full w-full flex flex-col justify-between">
                    <div class="flex w-full items-center justify-between">
                        <h1 class="text-sm font-medium">Total Post</h1>
                        <p class="text-xs text-gray-500">{{ formattedDateNow() }}</p>
                    </div>
                    <h1 class="text-2xl">{{ postLists.length }}</h1>
                    <div class="flex items-center text-orange-500">
                        <Icon icon="iconamoon:trend-up" class="text-xs" />
                        <p class="text-xs">+{{ calculateAddedStudentsList() }}% last month</p>
                    </div>
                </div>
            </div>
            <div class="rounded-xl bg-white border h-28 clear-start flex items-center p-5 gap-x-5">
                <div class="bg-red-400 h-full aspect-square flex items-center justify-center rounded-lg">
                    <Icon icon="mdi:person" class="text-white text-4xl" />
                </div>
                <div class="h-full w-full flex flex-col justify-between">
                    <div class="flex w-full items-center justify-between">
                        <h1 class="text-sm font-medium">Total students</h1>
                        <p class="text-xs text-gray-500">{{ formattedDateNow() }}</p>
                    </div>
                    <h1 class="text-2xl">{{ studentsList.length }}</h1>
                    <div class="flex items-center text-orange-500">
                        <Icon icon="iconamoon:trend-up" class="text-xs" />
                        <p class="text-xs">+{{ calculateAddedStudentsList() }}% last month</p>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import moment from 'moment'
import { computed, onMounted } from 'vue'
import { useDataStore } from '../store'

const dataStore = useDataStore()

const studentsList = computed(() => dataStore.studentLists)
const postLists = computed(() => dataStore.postLists)

const calculateAddedStudentsList = () => {
    const todaysDate = new Date();
    const currentMonth = todaysDate.getMonth();
    const currentYear = todaysDate.getFullYear();

    const totalStudents = studentsList.value.length;

    const studentsAddedThisMonth = studentsList.value.filter(student => {
        const addedAt = student.addedAt.toDate(); 
        return addedAt.getMonth() === currentMonth && addedAt.getFullYear() === currentYear;
    }).length;

    const newStudentPercentage = (studentsAddedThisMonth / totalStudents) * 100;

    return newStudentPercentage;
}



const formattedDateNow = () => {
    const today = new Date()
    return moment(today).format('LL')
}

onMounted(() => {
    dataStore.getStudents()
})
</script>