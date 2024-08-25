import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getDatabase, ref, get, push } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js";
import 'https://cdn.jsdelivr.net/npm/chart.js/dist/Chart.min.js';

const firebaseConfig = {
    apiKey: "AIzaSyBOzm7Cn9HRbRwYZbIaU3lFZKICT8juw2o",
    authDomain: "authentication-app-eazymass.firebaseapp.com",
    databaseURL: "https://authentication-app-eazymass-default-rtdb.firebaseio.com",
    projectId: "authentication-app-eazymass",
    storageBucket: "authentication-app-eazymass.appspot.com",
    messagingSenderId: "35732165848",
    appId: "1:35732165848:web:ff2dd1f37b26b0d98af3ad"
};

const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

const urlParams = new URLSearchParams(window.location.search);
const uid = urlParams.get('uid');

console.log('UID:', uid);

document.addEventListener('DOMContentLoaded', async function() {
    try {
        const userRef = ref(database, `users/${uid}`);
        const userSnapshot = await get(userRef);

        if (userSnapshot.exists()) {
            const userData = userSnapshot.val();
            console.log('User Data:', userData);

            const username = userData.username;
            console.log('Username:', username);

            // Display profile picture if available
            const profilePicUrl = userData.profile_pic;
            if (profilePicUrl) {
                document.getElementById('user-pic').src = profilePicUrl;
                document.getElementById('user-pic').style.display = 'block'; 
            } else {
                document.getElementById('user-pic').style.display = 'none'; 
            }

            const submissionRef = ref(database, `users/${uid}/submissions`);
            const submissionSnapshot = await get(submissionRef);

            if (submissionSnapshot.exists()) {
                const allSubmissions = submissionSnapshot.val();
                console.log('All Submissions:', allSubmissions);

                const chartData = {
                    labels: Object.keys(allSubmissions).map(submissionId => allSubmissions[submissionId].weigh_date),
                    datasets: [{
                        label: 'Weight',
                        data: Object.values(allSubmissions).map(submission => parseFloat(submission.weight)),
                        borderColor: 'rgb(255, 217, 0)',
                        borderWidth: 2,
                        fill: false,
                    }],
                };

                const chartCanvas = document.getElementById('weightChart');
                new Chart(chartCanvas, {
                    type: 'line',
                    data: chartData,
                    options: {
                        scales: {
                            x: {
                                type: 'linear',
                                position: 'bottom',
                            },
                            y: {
                                type: 'linear',
                                position: 'left',
                            },
                        },
                    },
                });

                const submissionIds = Object.keys(allSubmissions);
                if (submissionIds.length > 0) {
                    const latestSubmissionId = submissionIds[0];
                    const latestWeight = allSubmissions[latestSubmissionId].weight;

                    const weights = Object.values(allSubmissions).map(submission => parseFloat(submission.weight));
                    const totalWeight = weights.reduce((acc, weight) => acc + weight, 0);
                    const averageWeight = totalWeight / weights.length;
                    document.getElementById('avgweight').textContent = averageWeight.toFixed(1);

                    const lastSubmissionId = submissionIds[submissionIds.length - 1];
                    const lastWeight = allSubmissions[lastSubmissionId].weight;
                    document.getElementById('range').textContent = lastWeight;

                    const difference = parseFloat(lastWeight) - parseFloat(latestWeight);
                    document.getElementById('fluctuation').textContent = (difference >= 0 ? '+' : '') + difference.toFixed(1);

                    const trend = (difference < 0) ? 'Decrease' : 'Increase';
                    document.getElementById('trend').textContent = trend;

                    document.getElementById('username-tag').textContent = username.toUpperCase();

                    const dates = Object.values(allSubmissions).map(submission => new Date(submission.weigh_date));
                    if (dates.length > 0) {
                        const earliestDate = new Date(Math.min(...dates));
                        document.getElementById('joineddate').textContent = earliestDate.toISOString().split('T')[0];
                    } else {
                        document.getElementById('joineddate').textContent = 'No submissions found.';
                    }

                    const submissionCount = Object.keys(allSubmissions).length;
                    document.getElementById('streaks').textContent = submissionCount;
                    
                } else {
                    console.log('No submissions found.');
                }

            } else {
                console.log('Submissions data not found.');
            }
        } else {
            console.log('User data not found.');
        }
    } catch (error) {
        showModal('Error fetching data: ' + error.message);
    }
});

// Handle form submission
document.querySelector('form').addEventListener('submit', async function(event) {
    event.preventDefault(); 

    const dateInput = document.getElementById('date-input').value;
    const weightInput = document.getElementById('weight-input').value;

    if (dateInput && weightInput) {
        try {
            const newSubmissionRef = ref(database, `users/${uid}/submissions`);
            await push(newSubmissionRef, {
                weigh_date: dateInput,
                weight: weightInput
            });
            alert('Submission saved successfully.');
            document.querySelector('form').reset(); 
        } catch (error) {
            showModal('Error saving data: ' + error.message);
        }
    } else {
        showModal('Please fill in all fields.');
    }
});

function showModal(message) {
    const modal = document.getElementById('customModal');
    const modalMessage = document.getElementById('modal-message');
    modalMessage.textContent = message;
    modal.style.display = 'block';

    const closeButton = document.querySelector('.close-button');
    closeButton.addEventListener('click', () => {
        modal.style.display = 'none';
    });

    window.addEventListener('click', (event) => {
        if (event.target === modal) {
            modal.style.display = 'none';
        }
    });
}

const logoutButton = document.getElementById('logout');
logoutButton.addEventListener('click', () => {
    window.location.href = 'iindex.html';
});
