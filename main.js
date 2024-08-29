// main.js
import { database } from './firebase-config.js';
import { generateChartData, renderChart } from './chart-utils.js';
import { handleFirstEntryForm, handleSecondForm } from './form-utils.js';

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

        renderChart(generateChartData(submissionsArray));

        document
          .getElementById("custom-date")
          .addEventListener("change", function () {
            const selectedValue = parseInt(this.value, 10);
            if (isNaN(selectedValue)) return;

            const filteredSubmissions = submissionsArray.slice(-selectedValue);
            renderChart(generateChartData(filteredSubmissions));
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

          const trend =
            difference < 0
              ? "Decrease"
              : difference > 0
              ? "Increase"
              : "Constant";
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

          const selectElement = document.getElementById("custom-date");
          selectElement.innerHTML = "";

          if (submissionCount < 7) {
            for (let i = 1; i <= submissionCount; i++) {
              const option = document.createElement("option");
              option.value = i;
              option.textContent = `${i} day${i > 1 ? "s" : ""}`;
              selectElement.appendChild(option);
            }
          } else {
            for (let i = 7; i <= submissionCount; i += 7) {
              const option = document.createElement("option");
              option.value = i;
              option.textContent = `${i} days`;
              selectElement.appendChild(option);
            }
          }
        } else {
          const chartCanvas = document.getElementById("weightChart");
          chartCanvas.style.display = "none";
          document.getElementById("empty-message").style.display = "block";
        }
      }

      document
        .getElementById("firstEntryForm")
        .addEventListener("submit", (e) => {
          e.preventDefault();
          handleFirstEntryForm(uid);
        });

      document
        .getElementById("secondForm")
        .addEventListener("submit", (e) => {
          e.preventDefault();
          handleSecondForm(uid);
        });
    }
  } catch (error) {
    console.error("Error initializing app: ", error);
  }
});
