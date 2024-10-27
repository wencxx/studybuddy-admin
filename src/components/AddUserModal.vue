<template>
    <div class="absolute top-0 left-0 w-screen h-screen bg-black/25 flex items-center justify-center">
        <form @submit.prevent="addUser" class="w-fit h-fit bg-white rounded-xl shadow border gap-4 p-4 grid grid-cols-2">
            <h1 class="text-center col-span-2 font-medium">Add User</h1>
            <div class="flex flex-col gap-y-1">
                <label>Student Number</label>
                <input type="text" class="border rounded h-7 pl-2" v-model="userData.studentNumber">
            </div>
            <div class="flex flex-col gap-y-1">
                <label>Student Name</label>
                <input type="text" class="border rounded h-7 pl-2" v-model="userData.displayName">
            </div>
            <div class="flex flex-col gap-y-1">
                <label>Password</label>
                <input type="text" class="border rounded h-7 pl-2" v-model="userData.password">
            </div>
            <div class="flex flex-col gap-y-1">
                <label>Course</label>
                <select class="border rounded h-7 pl-2" v-model="userData.course">
                    <option value="" disabled>Select course</option>
                    <optgroup label="College of Computer Studies" class="text-sm">
                        <option>BSIT</option>
                        <option>BSIS</option>
                    </optgroup>
                    <optgroup label="College of Engineering" class="text-sm">
                        <option>BScPE</option>
                    </optgroup>
                </select>
            </div>
            <div class="flex flex-col gap-y-1">
                <label>Year & Section</label>
                <select v-model="userData.yearSection" class="border rounded h-7 pl-2">
                    <option value="" disabled>Select Year and Section</option>
                    <option>1-A</option>
                    <option>1-B</option>
                    <option>1-C</option>
                    <option>1-D</option>
                    <option>2-A</option>
                    <option>2-B</option>
                    <option>2-C</option>
                    <option>2-D</option>
                    <option>3-A</option>
                    <option>3-B</option>
                    <option>3-C</option>
                    <option>3-D</option>
                    <option>4-A</option>
                    <option>4-B</option>
                    <option>4-C</option>
                    <option>4-D</option>
                </select>
            </div>
            <div class="flex flex-col gap-y-1">
                <label>Gender</label>
                <select v-model="userData.gender" class="border rounded h-7 pl-2">
                    <option value="" disabled>Select Gender</option>
                    <option>Male</option>
                    <option>Female</option>
                </select>
            </div>
            <div class="flex flex-col gap-y-1">
                <label>Email</label>
                <input type="text" class="border rounded h-7 pl-2" v-model="userData.email">
            </div>
            <div class="flex flex-col gap-y-1">
                <label>Birthdate</label>
                <input type="date" class="border rounded h-7 pl-2" v-model="userData.birthdate">
            </div>
            <div class="col-span-2 flex justify-end gap-x-3 mt-5">
                <button class="border border-red-500 w-1/5 rounded text-red-500" type="button" @click="closeModal">Cancel</button>
                <button v-if="!adding" class="bg-green-500 w-1/5 rounded text-white">Add</button>
                <button v-else class="bg-green-500 w-1/5 rounded text-white animate-pulse" disabled>Adding</button>
            </div>
        </form>
    </div>
</template>

<script setup>
import { signInWithPopup, createUserWithEmailAndPassword, updateProfile } from 'firebase/auth'
import { auth, provider, storage, db     } from '../config/firebaseConfig'
import { ref, defineEmits } from 'vue'
import { getDownloadURL, ref as storageRef, uploadBytes } from 'firebase/storage'
import { query, collection, where, addDoc, getDocs, Timestamp } from 'firebase/firestore'

const emit = defineEmits(['closeModal', 'addedData'])

// close addUser modal
const closeModal = () => {
    emit('closeModal')
}

// const toggleFileInput = () => {
//     const fileInput = document.getElementById('fileInput')

//     fileInput.click()
// }

// const imageName = ref('Choose file')
// const image = ref(null)

// const handleFileChange = (e) => {
//     const imageinput = e.target.files[0] 
//     image.value = imageinput

//     imageName.value = imageinput.name
// }

const userData = ref({
    displayName: '',
    studentNumber: '',
    course: '',
    yearSection: '',
    gender: '',
    email: '',
    birthdate: '',
    password: '',
})

// const displayName = ref('')
// const studentNumber = ref('')
// const course = ref('')
// const yearSection = ref('')
// const gender = ref('')
// const email = ref('')
// const birthdate = ref('')
// const password = ref('')

const adding = ref(false)

//sign up using email and password
const addUser = async () => {
    // const imageRef = storageRef(storage, `images/${image.value.name}`)

    try {
        adding.value = true
        const newUser = await createUserWithEmailAndPassword(auth,`${userData.value.studentNumber}@gmail.com`, userData.value.password)
        const user = newUser.user

        // const snapshot = await uploadBytes(imageRef, image.value)

        // const downloadURL = await getDownloadURL(imageRef);

         await updateProfile(user, {
            displayName: userData.value.displayName,
            // photoURL: downloadURL
        })

        addUserDetails(user.uid)

        const data = {
            userId: user.uid,
            ...userData.value
        }
        closeModal()
        emit('addedData', data)
    } catch (error) {
        console.error("Error signing up:", error.message);
    }finally{
        adding.value = false
    }
}

// adding userDetails
const addUserDetails = async (uid) => {
    try {
        const userQuery = query(
            collection(db, 'users'),
            where('userId', '==', uid)
        );

        const querySnapshot = await getDocs(userQuery);

      if (!querySnapshot.empty) {
          return;
      }

      await addDoc(collection(db, 'users'), {
        userId: uid,
        ...userData.value,
        // photoURL: photoURL,
        collabs: [],
        incomingCollabRequest: [],
        outgoingCollabRequest: [],
        addedAt: Timestamp.now()
      });
    } catch (error) {
      console.error('Error adding user: ', error);
    }
}
</script>