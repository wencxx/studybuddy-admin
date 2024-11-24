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
                        <p class="text-xs">+{{ calculateAddedStudentsList() || 0 }}% last month</p>
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
                        <p class="text-xs">+{{ calculateAddedPostsList() || 0 }}% last month</p>
                    </div>
                </div>
            </div>
            <div class="rounded-xl bg-white border h-28 clear-start flex items-center p-5 gap-x-5">
                <div class="bg-red-400 h-full aspect-square flex items-center justify-center rounded-lg">
                    <Icon icon="mdi:person" class="text-white text-4xl" />
                </div>
                <div class="h-full w-full flex flex-col justify-between">
                    <div class="flex w-full items-center justify-between">
                        <h1 class="text-sm font-medium">Total Reports</h1>
                        <p class="text-xs text-gray-500">{{ formattedDateNow() }}</p>
                    </div>
                    <h1 class="text-2xl">{{ reportsLists.length }}</h1>
                    <div class="flex items-center text-orange-500">
                        <Icon icon="iconamoon:trend-up" class="text-xs" />
                        <p class="text-xs">+{{ calculateAddedReportsList() || 0 }}% last month</p>
                    </div>
                </div>
            </div>
            <div class="bg-gray-100/45 p-2 rounded space-y-5 col-span-3">
                <div class="flex items-center gap-x-3">
                    <Icon icon="mdi:user" class="text-3xl text-gray-500" />
                    <h1 class="text-lg font-medium">Top Collaborators</h1>
                </div>
                <table class="border w-full">
                    <thead>
                        <tr class="font-medium">
                            <td class="w-[14.2%] border text-center py-1">Ranking</td>
                            <td class="w-[14.2%] border text-center py-1">Student Number</td>
                            <td class="w-[14.2%] border text-center py-1">Name</td>
                            <td class="w-[14.2%] border text-center py-1">Number of Collabs</td>
                        </tr>
                    </thead>
                    <tbody v-if="studentsList?.length">
                        <tr v-for="(student, index) in sortedStudentsLists" :key="index">
                            <td class="border text-center py-1">{{ index + 1 }}</td>
                            <td class="border text-center py-1">{{ student.studentNumber }}</td>
                            <td class="border text-center py-1">{{ student.displayName }}</td>
                            <td class="border text-center py-1">{{ student.collabs.length }}</td>
                        </tr>
                    </tbody>
                    <tbody v-if="!studentsList.length">
                        <tr>
                            <td class="border text-center py-1" colspan="7">No students to show</td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <div class="bg-gray-100 w-full h-[40dvh] col-span-3 rounded-xl">
                <Bar
                    id="my-chart-id"
                    :options="chartOptions"
                    :data="chartData"
                    class="!h-full !w-full"
                />
            </div>
        </div>
    </div>
</template>

<script setup>
import moment from 'moment'
import { computed, onMounted, ref } from 'vue'
import { useDataStore } from '../store'
import { Bar } from 'vue-chartjs'
import { db } from '../config/firebaseConfig'
import { collection, getDocs } from 'firebase/firestore'
import { Chart as ChartJS, Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale } from 'chart.js'

ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale)

const dataStore = useDataStore()

const studentsList = computed(() => dataStore.studentLists)
const postLists = computed(() => dataStore.postLists)
const reportsLists = computed(() => dataStore.reportsLists)

const sortedStudentsLists = computed(() => {
  return [...studentsList.value].sort((a, b) => b.collabs.length - a.collabs.length).splice(0, 5)
});




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

const calculateAddedPostsList = () => {
    const todaysDate = new Date();
    const currentMonth = todaysDate.getMonth();
    const currentYear = todaysDate.getFullYear();

    const totalposts = postLists.value.length;

    const postsAddedThisMonth = postLists.value.filter(post => {
        const postedAt = post.postedAt.toDate(); 
        return postedAt.getMonth() === currentMonth && postedAt.getFullYear() === currentYear;
    }).length;

    const newPostsPercentage = (postsAddedThisMonth / totalposts) * 100;

    return newPostsPercentage;
}

const calculateAddedReportsList = () => {
    const todaysDate = new Date();
    const currentMonth = todaysDate.getMonth();
    const currentYear = todaysDate.getFullYear();

    const totalReports = reportsLists.value.length;

    const reportsAddedThisMonth = reportsLists.value.filter(post => {
        const reportedAt = post.reportedAt.toDate(); 
        return reportedAt.getMonth() === currentMonth && reportedAt.getFullYear() === currentYear;
    }).length;

    const newReportsPercentage = (reportsAddedThisMonth / totalReports) * 100;

    return newReportsPercentage;
}

const formattedDateNow = () => {
    const today = new Date()
    return moment(today).format('LL')
}

// Chart data setup
const chartData = ref({
    labels: ['Question 1', 'Question 2', 'Question 3', 'Question 4', 'Question 5'],
    datasets: [
        {
            label: 'Average Ratings',
            data: [],
            backgroundColor: 'rgba(54, 162, 235, 0.6)',
        }
    ]
});

const chartOptions = {
    responsive: true,
    plugins: {
        legend: {
            position: 'top',
        },
        tooltip: {
            callbacks: {
                label: (context) => `Average: ${context.raw.toFixed(2)}`
            }
        }
    },
    devicePixelRatio: 4
};

// Fetch data from Firestore
const fetchRatingsData = async () => {
    const ratingsCollection = collection(db, 'ratings');
    const ratingsSnapshot = await getDocs(ratingsCollection);

    const ratingsData = {
        q1: [],
        q2: [],
        q3: [],
        q4: [],
        q5: []
    };

    ratingsSnapshot.forEach(doc => {
        const data = doc.data();
        ratingsData.q1.push(data.q1 || 0);
        ratingsData.q2.push(data.q2 || 0);
        ratingsData.q3.push(data.q3 || 0);
        ratingsData.q4.push(data.q4 || 0);
        ratingsData.q5.push(data.q5 || 0);
    });

    const calculateAverage = (arr) => arr.length ? arr.reduce((a, b) => a + b, 0) / arr.length : 0;

    // Update the data in a way that ensures reactivity
    chartData.value = {
        ...chartData.value,
        datasets: [
            {
                ...chartData.value.datasets[0],
                data: [
                    calculateAverage(ratingsData.q1),
                    calculateAverage(ratingsData.q2),
                    calculateAverage(ratingsData.q3),
                    calculateAverage(ratingsData.q4),
                    calculateAverage(ratingsData.q5)
                ]
            }
        ]
    };
};

const formatBirthdate = (date) => {
    return moment(date).format('ll')
}

onMounted(async () => {
    dataStore.getStudents()
    dataStore.getPosts()
    dataStore.getReports()
    await fetchRatingsData()
})
</script>