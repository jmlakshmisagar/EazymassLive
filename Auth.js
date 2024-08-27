import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import {
  getDatabase,
  ref,
  get,
  push,
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js";
import "https://cdn.jsdelivr.net/npm/chart.js/dist/Chart.min.js";

const firebaseConfig = {
  apiKey: "AIzaSyBOzm7Cn9HRbRwYZbIaU3lFZKICT8juw2o",
  authDomain: "authentication-app-eazymass.firebaseapp.com",
  databaseURL:
    "https://authentication-app-eazymass-default-rtdb.firebaseio.com",
  projectId: "authentication-app-eazymass",
  storageBucket: "authentication-app-eazymass.appspot.com",
  messagingSenderId: "35732165848",
  appId: "1:35732165848:web:ff2dd1f37b26b0d98af3ad",
};

const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

const urlParams = new URLSearchParams(window.location.search);
const uid = urlParams.get("uid");

document.addEventListener("DOMContentLoaded", async function () {
  try {
    const userRef = ref(database, `users/${uid}`);
    const userSnapshot = await get(userRef);

    if (userSnapshot.exists()) {
      const userData = userSnapshot.val();
      const username = userData.username;

      const profilePicUrl = userData.profile_pic;
      if (profilePicUrl) {
        document.getElementById("user-pic").src = profilePicUrl;
        document.getElementById("user-pic").style.display = "block";
      } else {
        document.getElementById("user-pic").style.display = "none";
      }

      const submissionRef = ref(database, `users/${uid}/submissions`);
      const submissionSnapshot = await get(submissionRef);

      if (submissionSnapshot.exists()) {
        const allSubmissions = submissionSnapshot.val();
        const submissionsArray = Object.keys(allSubmissions).map((key) => ({
          id: key,
          ...allSubmissions[key],
        }));
        submissionsArray.sort(
          (a, b) => new Date(a.weigh_date) - new Date(b.weigh_date)
        );

        const chartData = {
          labels: submissionsArray.map((submission) => submission.weigh_date),
          datasets: [
            {
              label: "Weight",
              data: submissionsArray.map((submission) =>
                parseFloat(submission.weight)
              ),
              borderColor: "rgb(255, 217, 0)",
              borderWidth: 2,
              fill: false,
            },
          ],
        };

        const chartCanvas = document.getElementById("weightChart");
        new Chart(chartCanvas, {
          type: "line",
          data: chartData,
          options: {
            scales: {
              x: {
                type: "linear",
                position: "bottom",
              },
              y: {
                type: "linear",
                position: "left",
              },
            },
          },
        });

        if (submissionsArray.length > 0) {
          const latestSubmission = submissionsArray[0];
          const latestWeight = latestSubmission.weight;

          const weights = submissionsArray.map((submission) =>
            parseFloat(submission.weight)
          );
          const totalWeight = weights.reduce((acc, weight) => acc + weight, 0);
          const averageWeight = totalWeight / weights.length;
          document.getElementById(
            "avgweight"
          ).textContent = averageWeight.toFixed(1);

          const lastSubmission = submissionsArray[submissionsArray.length - 1];
          const lastWeight = lastSubmission.weight;
          document.getElementById("range").textContent = lastWeight;
          const difference = parseFloat(lastWeight) - parseFloat(latestWeight);

          let formattedDifference =
            (difference >= 0 ? "+" : "") + difference.toFixed(1);

          if (Math.abs(difference) >= 1000) {
            formattedDifference += " kg";
          }

          document.getElementById(
            "fluctuation"
          ).textContent = formattedDifference;

          const trend = difference < 0 ? "Decrease" : "Increase";
          document.getElementById("trend").textContent = trend;

          document.getElementById(
            "username-tag"
          ).textContent = username.toUpperCase();

          const earliestDate = new Date(submissionsArray[0].weigh_date);
          document.getElementById(
            "joineddate"
          ).textContent = earliestDate.toISOString().split("T")[0];

          const submissionCount = submissionsArray.length;
          document.getElementById("streaks").textContent = submissionCount;
        } else {
          console.log("No submissions found.");
        }
      } else {
        document.getElementById("firstEntryModal").style.display = "block";
      }
    } else {
      console.log("User data not found.");
    }
  } catch (error) {
    showModal("Error fetching data: " + error.message);
  }
});

function showModal(message) {
  const modalMessage = document.getElementById("errorModalMessage");
  modalMessage.textContent = message;

  jQuery("#errorModal").modal("show");
}

document
  .getElementById("firstEntryForm")
  .addEventListener("submit", async function (event) {
    event.preventDefault();

    const dateInput = document.getElementById("first-date-input").value;
    const weightInput = document.getElementById("first-weight-input").value;

    if (dateInput && weightInput) {
      try {
        const newSubmissionRef = ref(database, `users/${uid}/submissions`);
        await push(newSubmissionRef, {
          weigh_date: dateInput,
          weight: weightInput,
        });

        showModal("First submission saved successfully.");
        document.getElementById("firstEntryModal").style.display = "none";
        document.querySelector("form").reset();

        location.reload();
      } catch (error) {
        showModal("Error saving data: " + error.message);
      }
    } else {
      showModal("Please fill in all fields.");
    }
  });

document
  .getElementById("secondform")
  .addEventListener("submit", async function (event) {
    event.preventDefault();

    const dateInput = document.getElementById("date-input").value;
    const weightInput = document.getElementById("weight-input").value;

    if (dateInput && weightInput) {
      try {
        const submissionsRef = ref(database, `users/${uid}/submissions`);
        const snapshot = await get(submissionsRef);
        let dateExists = false;

        if (snapshot.exists()) {
          const submissions = snapshot.val();
          for (const key in submissions) {
            if (submissions[key].weigh_date === dateInput) {
              dateExists = true;
              break;
            }
          }
        }

        if (dateExists) {
          showModal("Date already exists.");
        } else {
          const newSubmissionRef = ref(database, `users/${uid}/submissions`);
          await push(newSubmissionRef, {
            weigh_date: dateInput,
            weight: weightInput,
          });
          showModal("Submission saved successfully.");
          document.getElementById("secondform").reset();
          setTimeout(() => {
            location.reload();
          }, 2000);
        }
      } catch (error) {
        showModal("Error saving data: " + error.message);
      }
    } else {
      showModal("Please fill in all fields.");
    }
  });

const firstEntryCloseButton = document.querySelector(
  "#firstEntryModal .close-button"
);
firstEntryCloseButton.addEventListener("click", () => {
  document.getElementById("firstEntryModal").style.display = "none";
});

const logoutButton = document.getElementById("logout");
logoutButton.addEventListener("click", () => {
  window.location.href = "index.html";
});





