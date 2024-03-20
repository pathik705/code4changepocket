document.addEventListener('DOMContentLoaded', function () {
  const menuIcon = document.querySelector('.menu-icon');
  const navLinks = document.querySelector('.nav-links');

  menuIcon.addEventListener('click', function () {
    navLinks.style.display = navLinks.style.display === 'block' ? 'none' : 'block';
  });
});




  // Function to toggle the visibility of the stock information section
  const showStockInfoButton = document.getElementById('showStockInfoButton');
  const stockInfoDiv = document.getElementById('stockInfo');

  showStockInfoButton.addEventListener('click', () => {
    stockInfoDiv.style.display = 'block';
    showStockInfoButton.style.display = 'none'; // Hide the button after showing the stock info
  });

  const fetchStockData = () => {
    const symbol = document.getElementById('stockSymbol').value;

    // Replace 'YOUR_API_KEY' with your actual Alpha Vantage API key
    const apiKey = 'YOUR_API_KEY';
    const apiUrl = `https://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY&symbol=${symbol}&interval=1min&apikey=${apiKey}`;

    fetch(apiUrl)
      .then((response) => response.json())
      .then((data) => {
        if (data['Time Series (1min)']) {
          const latestData = Object.values(data['Time Series (1min)'])[0];
          const stockInfo = `
            Symbol: ${symbol}<br>
            Open: $${latestData['1. open']}<br>
            High: $${latestData['2. high']}<br>
            Low: $${latestData['3. low']}<br>
            Close: $${latestData['4. close']}<br>
            Volume: ${latestData['5. volume']}`;
          document.getElementById('stockData').innerHTML = stockInfo;
          // Show the stock buy links
            document.getElementById('stockBuyLinks').style.display = 'block';
        } else {
            document.getElementById('stockData').innerHTML = 'Stock data not available.';
          // Hide the stock buy links if data is not available
            document.getElementById('stockBuyLinks').style.display = 'none';
        }
        
      })
      .catch((error) => {
        document.getElementById('stockData').innerHTML = 'Error fetching stock data.';
        console.error(error);
        
      });
  };

  // Your existing JavaScript code here...

  const calculateButton = document.getElementById('calculateButton');
  const dailyLimitDiv = document.getElementById('dailyLimit');
  const notificationDiv = document.getElementById('notification');
  const remainingMoneyDiv = document.getElementById('remainingMoney');
  const daysLeftDiv = document.getElementById('dayCount');
  const expenseInputDiv = document.getElementById('expenseInput');
  const addExpenseButton = document.getElementById('addExpenseButton');
  const resetButton = document.getElementById('resetButton');

  const savingsInputDiv = document.getElementById('savingsInput');
  const setSavingButton = document.getElementById('setSavingButton');
  const savingsInfoDiv = document.getElementById('savingsInfo');
  const savingsNotificationDiv = document.getElementById('savingsNotification');
  const savingsTotalDiv = document.getElementById('savingsTotal');
  const addSavingButton = document.getElementById('addSavingButton');

  const licSchemesDiv = document.getElementById('licSchemes');
  const licSchemesList = document.getElementById('licSchemesList');

  const mutualFundSchemesDiv = document.getElementById('mutualFundSchemes');
  const mutualFundSchemesList = document.getElementById('mutualFundSchemesList');

  const savingsProgressBarDiv = document.querySelector('.progress-bar');
  const savingsProgressDiv = document.getElementById('savingsProgress');

  const expenseHistoryDiv = document.getElementById('expenseHistory');
  const expenseList = document.getElementById('expenseList');

  let monthlySalary = 0;
  let dailyLimit = 0;
  let daysLeft = 30;
  let remainingSalary = 0;

  let savingsGoal = 0;
  let totalSavings = 0;

  const populateSchemes = (schemesList, schemes) => {
    schemesList.innerHTML = '';
    schemes.forEach(scheme => {
      const listItem = document.createElement('li');
      const link = document.createElement('a');
      link.href = scheme.link;
      link.textContent = scheme.name;
      listItem.appendChild(link);
      schemesList.appendChild(listItem);
    });
  };

  const populateSavingsSchemes = (savingsAmount) => {
    licSchemesDiv.style.display = 'none';
    mutualFundSchemesDiv.style.display = 'none';

    const eligibleLICSchemes = licSchemes.filter(scheme => scheme.minSavings <= savingsAmount);
    const eligibleMutualFundSchemes = mutualFundSchemes.filter(scheme => scheme.minSavings <= savingsAmount);

    if (eligibleLICSchemes.length > 0) {
      licSchemesDiv.style.display = 'block';
      populateSchemes(licSchemesList, eligibleLICSchemes);
    }

    if (eligibleMutualFundSchemes.length > 0) {
      mutualFundSchemesDiv.style.display = 'block';
      populateSchemes(mutualFundSchemesList, eligibleMutualFundSchemes);
    }
  };

  calculateButton.addEventListener('click', () => {
    monthlySalary = parseFloat(document.getElementById('monthlySalary').value);

    if (isNaN(monthlySalary) || monthlySalary <= 0) {
      notificationDiv.innerText = 'Please enter a valid monthly salary amount.';
      return;
    }

    dailyLimit = monthlySalary / 30;
    remainingSalary = monthlySalary;
    daysLeft = 30;

    dailyLimitDiv.innerHTML = `Daily Limit: ₹${dailyLimit.toFixed(2)}`;
    daysLeftDiv.innerHTML = `Days Left: ${daysLeft}`;

    calculateButton.disabled = true;
    expenseInputDiv.style.display = 'block';
    savingsInputDiv.style.display = 'block';
    licSchemesDiv.style.display = 'block';
    mutualFundSchemesDiv.style.display = 'block';

    // Display investment schemes initially as well
    populateSavingsSchemes(savingsGoal);
  });

  addExpenseButton.addEventListener('click', () => {
    const dailyExpense = parseFloat(document.getElementById('dailyExpense').value);

    if (isNaN(dailyExpense) || dailyExpense < 0) {
      notificationDiv.innerText = 'Please enter a valid expense amount.';
      return;
    }

    if (dailyExpense > remainingSalary) {
      notificationDiv.innerText = 'Expense exceeds remaining salary!';
      return;
    }

    if (dailyExpense > dailyLimit) {
      const remainingDays = daysLeft - 1; // Exclude today
      const adjustedExpenditure = (remainingSalary - dailyExpense) / remainingDays;

      const notification = `You've exceeded your daily budget! Adjusting daily expenditure to ₹${adjustedExpenditure.toFixed(2)} for the rest of the month.`;
      notificationDiv.innerText = notification;

      dailyLimitDiv.innerHTML = `Daily Limit: ₹${adjustedExpenditure.toFixed(2)}`;
      dailyLimit = adjustedExpenditure;
    } else {
      notificationDiv.innerText = 'Daily expenditure is within budget.';
    }

    remainingSalary -= dailyExpense;
    daysLeft--;

    if (daysLeft === 0) {
      expenseInputDiv.style.display = 'none';
      addExpenseButton.disabled = true;
      notificationDiv.innerText = '30 days are over. Tracking completed.';
      resetButton.style.display = 'block';
    } else {
      dailyLimit = remainingSalary / daysLeft;
      dailyLimitDiv.innerHTML = `Daily Limit: ₹${dailyLimit.toFixed(2)}`;
      daysLeftDiv.innerHTML = `Days Left: ${daysLeft}`;
      remainingMoneyDiv.innerHTML = `Remaining money: ₹${remainingSalary.toFixed(2)}`;
    }

    // Update investment schemes based on the updated savings
    populateSavingsSchemes(totalSavings);

    // Add the expense to the history
    const expenseItem = document.createElement('li');
    expenseItem.textContent = `Expense: ₹${dailyExpense.toFixed(2)}`;
    expenseList.appendChild(expenseItem);
    expenseHistoryDiv.style.display = 'block';
  });

  setSavingButton.addEventListener('click', () => {
    savingsGoal = parseFloat(document.getElementById('savingsGoal').value);

    if (isNaN(savingsGoal) || savingsGoal < 0) {
      savingsNotificationDiv.innerText = 'Please enter a valid savings goal amount.';
      return;
    }

    savingsTotalDiv.innerHTML = `Total Savings Goal: ₹${savingsGoal.toFixed(2)}`;
    savingsInfoDiv.style.display = 'block';
    setSavingButton.disabled = true;

    // Populate investment schemes based on the entered savings goal
    populateSavingsSchemes(savingsGoal);
  });

  addSavingButton.addEventListener('click', () => {
    const savingAmount = parseFloat(prompt('Enter the amount to add to savings:'));

    if (isNaN(savingAmount) || savingAmount < 0) {
      savingsNotificationDiv.innerText = 'Please enter a valid amount.';
      return;
    }

    totalSavings += savingAmount;
    savingsTotalDiv.innerHTML = `Total Savings: ₹${totalSavings.toFixed(2)}`;
    savingsNotificationDiv.innerText = 'Amount added to savings.';

    // Update the progress bar
    const progressPercentage = (totalSavings / savingsGoal) * 100;
    savingsProgressDiv.style.width = `${progressPercentage}%`;

    // Update investment schemes based on the updated savings
    populateSavingsSchemes(totalSavings);
  });

  resetButton.addEventListener('click', () => {
    location.reload();
  });

  // Dummy scheme data (customize this as needed)
  const licSchemes = [
    { name: 'LIC Bima Jyoti', link: 'https://licindia.in/web/guest/lic-s-bima-jyoti-plan-no.-860-uin-no.-512n339v01-', minSavings: 5000 },
    { name: 'LIC Jeevan Umang', link: 'https://licindia.in/hi/lics-jeevan-umang-plan-no.-945-uin-no.-512n312v02', minSavings: 10000 },
    // Add more LIC SCHEMES TO INVEST
  ];

  const mutualFundSchemes = [
    { name: 'Quant Small Cap Fund Direct Plan-Growth', link: 'https://www.etmoney.com/mutual-funds/quant-small-cap-fund-direct-plan-growth/16925', minSavings: 5000 },
    { name: 'Axis Small Cap Fund Direct-Growth', link: 'https://www.etmoney.com/mutual-funds/axis-small-cap-fund-direct-growth/21859', minSavings: 10000 },
    // Add more mutual fund schemes
  ];

  // Initial population of schemes (before user interaction)
  populateSchemes(licSchemesList, licSchemes);
  populateSchemes(mutualFundSchemesList, mutualFundSchemes);

