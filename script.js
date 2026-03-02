async function searchCountry(countryName) {
    const spinner = document.getElementById('loading-spinner');
    const countryInfo = document.getElementById('country-info');
    const borderSection = document.getElementById('bordering-countries');
    const errorMessage = document.getElementById('error-message');

    try {
        // Clear previous results
        countryInfo.innerHTML = "";
        borderSection.innerHTML = "";
        errorMessage.textContent = "";

        // Show loading spinner
        spinner.classList.remove('hidden');

        // Fetch country data
        const response = await fetch(`https://restcountries.com/v3.1/name/${countryName}`);
        if (!response.ok) {
            throw new Error("Country not found");
        }

        const data = await response.json();
        const country = data[0];

        // Update country info
        countryInfo.innerHTML = `
            <h2>${country.name.common}</h2>
            <p><strong>Capital:</strong> ${country.capital ? country.capital[0] : "N/A"}</p>
            <p><strong>Population:</strong> ${country.population.toLocaleString()}</p>
            <p><strong>Region:</strong> ${country.region}</p>
            <img src="${country.flags.svg}" alt="${country.name.common} flag" width="150">
        `;

        // Fetch bordering countries if they exist
        if (country.borders) {
            for (let borderCode of country.borders) {
                const borderResponse = await fetch(`https://restcountries.com/v3.1/alpha/${borderCode}`);
                const borderData = await borderResponse.json();
                const borderCountry = borderData[0];

                borderSection.innerHTML += `
                    <div>
                        <p>${borderCountry.name.common}</p>
                        <img src="${borderCountry.flags.svg}" alt="${borderCountry.name.common} flag" width="100">
                    </div>
                `;
            }
        }

    } catch (error) {
        errorMessage.textContent = "Unable to fetch country data. Please try again.";
    } finally {
        // Hide loading spinner
        spinner.classList.add('hidden');
    }
}

// Search button click
document.getElementById('search-btn').addEventListener('click', () => {
    const country = document.getElementById('country-input').value.trim();
    if (country) {
        searchCountry(country);
    }
});

// Press Enter in input field
document.getElementById('country-input').addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        const country = document.getElementById('country-input').value.trim();
        if (country) {
            searchCountry(country);
        }
    }
});