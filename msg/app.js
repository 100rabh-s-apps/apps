document.addEventListener('DOMContentLoaded', () => {
    // Get references to elements
    const countryCodeInput = document.getElementById('countryCodeInput'); 
    const countryCodeDropdownMenu = document.getElementById('countryCodeDropdownMenu');
    const selectedCountryCodeValueInput = document.getElementById('selectedCountryCodeValue'); 
    const localPhoneInput = document.getElementById('localPhoneNumber');

    // Action buttons
    const whatsappBtn = document.getElementById('whatsappBtn');
    const telegramBtn = document.getElementById('telegramBtn');
    const signalBtn = document.getElementById('signalBtn');

    const dropdownInstance = new bootstrap.Dropdown(countryCodeDropdownMenu); 
    function validateCountryCode(code) {
        if (!code) return null;
        const pattern = /^\+\d{1,4}$/;
        if (pattern.test(code)) {
            return code; 
        }
        return null;
    }


    function showDropdown() {
        dropdownInstance = bootstrap.Dropdown.getOrCreateInstance(countryCodeDropdownMenu);
        dropdownInstance.show();
        dropdownInstance.style.visibility = 'visible'; // Force visibility
        dropdownInstance.style.opacity = '1'; // Force opacity
    }

    countryCodeInput.addEventListener('focus', () => {
        showDropdown();
    });
    countryCodeInput.addEventListener('click', () => {
        showDropdown();
    });

    countryCodeDropdownMenu.addEventListener('click', (event) => {
        if (event.target.matches('.dropdown-item') && event.target.dataset.code) {
            event.preventDefault();
            const selectedCode = event.target.dataset.code;

            countryCodeInput.value = selectedCode;
            countryCodeInput.classList.remove('is-invalid');

            selectedCountryCodeValueInput.value = selectedCode;

            bootstrap.Dropdown.getInstance(countryCodeDropdownMenu).hide();
            console.log(`Selected Country Code from dropdown: ${selectedCode}`);

            localPhoneInput.focus();
        }
    });

    countryCodeInput.addEventListener('input', () => {
        const typedValue = countryCodeInput.value;
        const validatedCode = validateCountryCode(typedValue);

        if (validatedCode) {
            selectedCountryCodeValueInput.value = validatedCode;
            countryCodeInput.classList.remove('is-invalid');
            console.log(`Validated typed code: ${validatedCode}`);
        } else {
            countryCodeInput.classList.add('is-invalid');
            console.log(`Invalid typed code attempt: ${typedValue}`);
        }
        if (typedValue.trim() === '') {
            countryCodeInput.classList.add('is-invalid');
        }
    });

    document.addEventListener('click', (event) => {
        if (!countryCodeInput.contains(event.target) && !countryCodeDropdownMenu.contains(event.target)) {
            bootstrap.Dropdown.getInstance(countryCodeDropdownMenu).hide();
        }
    });


    function getCombinedPhoneNumber() {
        const countryCode = selectedCountryCodeValueInput.value;
        const localNumberRaw = localPhoneInput.value;

        if (!validateCountryCode(countryCode)) {
            alert('Invalid or missing country code. Please select or type a valid code (e.g., +91).');
            countryCodeInput.classList.add('is-invalid');
            countryCodeInput.focus();
            return null;
        }
        if (!localNumberRaw || localNumberRaw.trim().length === 0) {
            alert('Please enter the phone number.');
            localPhoneInput.focus();
            return null;
        }

        const cleanedLocalNumber = localNumberRaw.trim().replace(/[\s-()]/g, '');

        if (!/^\d+$/.test(cleanedLocalNumber)) {
            alert('Phone number should only contain digits (after the country code).');
            localPhoneInput.focus();
            return null;
        }

        const fullNumber = countryCode + cleanedLocalNumber;

        console.log("Combined Number:", fullNumber);
        return fullNumber;
    }


    whatsappBtn.addEventListener('click', () => {
        const fullNumber = getCombinedPhoneNumber();
        if (fullNumber) {
            const whatsappNumber = fullNumber.substring(1);
            const url = `https://wa.me/${whatsappNumber}`;
            window.open(url, '_blank');
        }
    });

    telegramBtn.addEventListener('click', () => {
        const fullNumber = getCombinedPhoneNumber();
        if (fullNumber) {
            const url = `https://t.me/${fullNumber}`;
            window.open(url, '_blank');
        }
    });

    signalBtn.addEventListener('click', () => {
        const fullNumber = getCombinedPhoneNumber();
        if (fullNumber) {
            const url = `sgnl://chat/${fullNumber}`;
            window.open(url);
        }
    });

    countryCodeInput.value = selectedCountryCodeValueInput.value;

}
);