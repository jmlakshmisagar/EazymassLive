import { database, ref, get, push } from "./firebaseChartSetup.js";

const urlParams = new URLSearchParams(window.location.search);
const uid = urlParams.get("uid");
const accesstoken = urlParams.get("accesstoken");

document.addEventListener("DOMContentLoaded", async function () {
  try {
    const userRef = ref(database, `users/${uid}`);
    const userSnapshot = await get(userRef);

    const retrivetoken = localStorage.getItem("accesstoken");

    if (userSnapshot.exists() && retrivetoken == accesstoken) {
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

        const generateChartData = (filteredSubmissions, chartType) => {
          const dates = filteredSubmissions.map((submission) => {
            const date = new Date(submission.weigh_date);
            const day = String(date.getDate()).padStart(2, "0");
            const month = String(date.getMonth() + 1).padStart(2, "0");
            return `${day}-${month}`;
          });
          
          const weights = filteredSubmissions.map((submission) => 
            parseFloat(submission.weight)
          );

          switch(chartType) {
            case 'line':
              return {
                labels: dates,
                datasets: [{
                  label: 'Weight Progression',
                  data: weights,
                  borderColor: 'rgb(255, 217, 0)',
                  borderWidth: 2,
                  fill: false
                }]
              };
            
            case 'bar':
              return {
                labels: dates,
                datasets: [{
                  label: 'Weight Distribution',
                  data: weights,
                  backgroundColor: 'rgba(255, 217, 0, 0.6)',
                  borderColor: 'rgb(255, 217, 0)',
                  borderWidth: 1
                }]
              };
            
            case 'radar':
              return {
                labels: dates,
                datasets: [{
                  label: 'Weight Pattern',
                  data: weights,
                  backgroundColor: 'rgba(255, 217, 0, 0.2)',
                  borderColor: 'rgb(255, 217, 0)',
                  borderWidth: 2,
                  pointBackgroundColor: 'rgb(255, 217, 0)'
                }]
              };
            
            case 'scatter':
              return {
                datasets: [{
                  label: 'Weight Scatter',
                  data: dates.map((date, index) => ({
                    x: index,
                    y: weights[index]
                  })),
                  backgroundColor: 'rgb(255, 217, 0)'
                }]
              };
            
            case 'polarArea':
              return {
                labels: dates,
                datasets: [{
                  data: weights,
                  backgroundColor: weights.map((_, index) => 
                    `hsla(51, 100%, 50%, ${0.3 + (index / weights.length) * 0.7})`
                  )
                }]
              };
            
            case 'doughnut':
              return {
                labels: dates,
                datasets: [{
                  data: weights,
                  backgroundColor: weights.map((_, index) => 
                    `hsla(51, 100%, ${20 + (index / weights.length) * 50}%, 0.8)`
                  )
                }]
              };
          }
        };

        const renderChart = (data, type) => {
          const chartCanvas = document.getElementById("weightChart");
          
          try {
            // Destroy existing chart if it exists
            if (window.weightChart instanceof Chart) {
              window.weightChart.destroy();
            }

            const chartOptions = {
              responsive: true,
              maintainAspectRatio: false,
              plugins: {
                legend: {
                  display: true,
                  position: 'top',
                  labels: {
                    color: '#ffffff'
                  }
                }
              },
              scales: type === 'line' || type === 'bar' || type === 'scatter' ? {
                x: {
                  grid: {
                    color: 'rgba(255, 255, 255, 0.1)'
                  },
                  ticks: {
                    color: '#ffffff'
                  }
                },
                y: {
                  grid: {
                    color: 'rgba(255, 255, 255, 0.1)'
                  },
                  ticks: {
                    color: '#ffffff'
                  }
                }
              } : undefined
            };

            window.weightChart = new Chart(chartCanvas, {
              type: type,
              data: data,
              options: chartOptions
            });
          } catch (error) {
            console.error('Error rendering chart:', error);
            showModal('Error rendering chart: ' + error.message);
          }
        };

        // Replace the initial chart render code
        if (document.getElementById("weightChart")) {
          const initialChartType = document.getElementById("chart-type").value || 'line';
          renderChart(generateChartData(submissionsArray, initialChartType), initialChartType);
        }

        // Replace or add after the initial chart render
        document.getElementById("chart-type").addEventListener("change", function() {
          const selectedType = this.value;
          const chartData = generateChartData(submissionsArray, selectedType);
          renderChart(chartData, selectedType);
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
        } else {
          console.log("No submissions found.");
        }
      } else {
        document.getElementById("firstEntryModal").style.display = "block";
      }
    } else {
      showModal("Access denied");
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
    let weightInput = document.getElementById("first-weight-input").value;

    if (dateInput && weightInput) {
      try {
        const submissionsRef = ref(database, `users/${uid}/submissions`);
        const snapshot = await get(submissionsRef);

        if (!snapshot.exists()) {
          const newSubmissionRef = ref(database, `users/${uid}/submissions`);
          await push(newSubmissionRef, {
            weigh_date: dateInput,
            weight: weightInput,
          });

          showModal("Submission saved successfully.");
          document.getElementById("firstEntryModal").style.display = "none";
          document.querySelector("form").reset();

          location.reload();
        } else {
          showModal(
            "You already have a submission. No further submissions are allowed."
          );
        }
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
