document.addEventListener('DOMContentLoaded', () => {
    const imageUpload = document.getElementById('imageUpload');
    const imagePreviewContainer = document.getElementById('imagePreviewContainer');
    const imagePreview = document.getElementById('imagePreview');
    const captureDateTimeInput = document.getElementById('captureDateTime');
    const mapDiv = document.getElementById('map');
    const selectedCoordinatesSpan = document.getElementById('selectedCoordinates');
    const addExifButton = document.getElementById('addExifButton');
    const messageDiv = document.getElementById('message');

    let currentFile = null;
    let currentFileBase64 = null;
    let map = null;
    let marker = null;
    let selectedLat = null;
    let selectedLon = null;

    /**
     * Initializes the Leaflet map.
     * Sets a default view and adds OpenStreetMap tiles.
     * Integrates Esri Leaflet Geocoder for location search.
     * Handles map clicks to set the selected location.
     */
    function initializeMap() {
        if (map) {
            map.remove(); // Remove existing map if re-initializing
        }
        map = L.map(mapDiv).setView([20.5937, 78.9629], 5); // Default to India center

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(map);

        const searchControl = L.esri.Geocoding.geosearch({
            position: 'topright',
            placeholder: 'Search for a location...'
        }).addTo(map);

        searchControl.on('results', function (data) {
            if (data.results.length > 0) {
                const latlng = data.results[0].latlng;
                setMapLocation(latlng.lat, latlng.lng);
            }
        });

        map.on('click', function (e) {
            setMapLocation(e.latlng.lat, e.latlng.lng);
        });
    }

    /**
     * Sets the selected location on the map and updates the marker.
     * @param {number} lat - Latitude.
     * @param {number} lon - Longitude.
     */
    function setMapLocation(lat, lon) {
        selectedLat = lat;
        selectedLon = lon;
        if (marker) {
            map.removeLayer(marker);
        }
        marker = L.marker([selectedLat, selectedLon]).addTo(map)
            .bindPopup(`Selected: ${selectedLat.toFixed(4)}, ${selectedLon.toFixed(4)}`)
            .openPopup();
        map.setView([selectedLat, selectedLon], 15);
        selectedCoordinatesSpan.textContent = `${selectedLat.toFixed(6)}, ${selectedLon.toFixed(6)}`;
        checkFormValidity();
    }

    /**
     * Converts a base64 Data URL to a Blob object.
     * @param {string} dataurl - The base64 Data URL.
     * @param {string} mimetype - The MIME type of the data (e.g., 'image/jpeg').
     * @returns {Blob} The Blob object.
     */
    function dataURLtoBlob(dataurl, mimetype) {
        const arr = dataurl.split(',');
        const mime = arr[0].match(/:(.*?);/)[1] || mimetype;
        const bstr = atob(arr[1]);
        let n = bstr.length;
        const u8arr = new Uint8Array(n);
        while (n--) {
            u8arr[n] = bstr.charCodeAt(n);
        }
        return new Blob([u8arr], { type: mime });
    }

    /**
     * Converts decimal degrees to EXIF DMS (Degrees, Minutes, Seconds) format.
     * @param {number} deg - Decimal degrees.
     * @param {string} type - 'lat' for latitude, 'lon' for longitude.
     * @returns {object} An object containing d, m, s (rational numbers) and ref (cardinal direction).
     */
    function decimalToExifDMS(deg, type) {
        deg = Math.abs(deg);
        const d = Math.floor(deg);
        const minfloat = (deg - d) * 60;
        const m = Math.floor(minfloat);
        const secfloat = (minfloat - m) * 60;
        const s = Math.round(secfloat * 1000000); // Higher precision for seconds

        const ref = type === 'lat' ? (deg >= 0 ? 'N' : 'S') : (deg >= 0 ? 'E' : 'W');

        return {
            d: [d, 1],
            m: [m, 1],
            s: [s, 1000000],
            ref: ref
        };
    }

    /**
     * Converts EXIF DMS (Degrees, Minutes, Seconds) to decimal degrees.
     * @param {Array<Array<number>>} dms - Array of rational numbers [d, m, s].
     * @param {string} ref - Cardinal direction (N, S, E, W).
     * @returns {number} Decimal degrees.
     */
    function exifDMSToDecimal(dms, ref) {
        if (!dms || dms.length < 3) return null;
        const [d, m, s] = dms.map(val => val[0] / val[1]);
        let decimal = d + (m / 60) + (s / 3600);
        if (ref === 'S' || ref === 'W') {
            decimal *= -1;
        }
        return decimal;
    }

    // Handle image upload
    imageUpload.addEventListener('change', (event) => {
        const file = event.target.files[0];
        if (file && file.type === 'image/jpeg') {
            currentFile = file;
            const reader = new FileReader();
            reader.onload = (e) => {
                currentFileBase64 = e.target.result;
                imagePreview.src = currentFileBase64;
                imagePreviewContainer.style.display = 'block';
                messageDiv.textContent = '';

                try {
                    const exifObj = piexif.load(currentFileBase64);
                    console.log("Existing EXIF Data:", exifObj);

                    // Read existing GPS data
                    if (exifObj.GPS) {
                        const latDMS = exifObj.GPS[piexif.GPSIFD.GPSLatitude];
                        const lonDMS = exifObj.GPS[piexif.GPSIFD.GPSLongitude];
                        const latRef = exifObj.GPS[piexif.GPSIFD.GPSLatitudeRef];
                        const lonRef = exifObj.GPS[piexif.GPSIFD.GPSLongitudeRef];

                        if (latDMS && lonDMS && latRef && lonRef) {
                            const existingLat = exifDMSToDecimal(latDMS, latRef);
                            const existingLon = exifDMSToDecimal(lonDMS, lonRef);
                            setMapLocation(existingLat, existingLon);
                            messageDiv.textContent = 'Existing GPS data found and pre-filled on map.';
                        }
                    }

                    // Read existing date/time data
                    if (exifObj.Exif && exifObj.Exif[piexif.ExifIFD.DateTimeOriginal]) {
                        const dtOriginal = exifObj.Exif[piexif.ExifIFD.DateTimeOriginal];
                        // Convert "YYYY:MM:DD HH:MM:SS" to "YYYY-MM-DDTHH:MM" for datetime-local
                        const formattedDt = dtOriginal.replace(/:(\d{2}):(\d{2})$/, 'T$1:$2').replace(/:/, '-').replace(/:/, '-');
                        captureDateTimeInput.value = formattedDt;
                        messageDiv.textContent += (messageDiv.textContent ? ' And ' : '') + 'Existing date/time found and pre-filled.';
                    } else {
                        // If no existing date, set to current local time
                        const now = new Date();
                        const year = now.getFullYear();
                        const month = (now.getMonth() + 1).toString().padStart(2, '0');
                        const day = now.getDate().toString().padStart(2, '0');
                        const hours = now.getHours().toString().padStart(2, '0');
                        const minutes = now.getMinutes().toString().padStart(2, '0');
                        captureDateTimeInput.value = `${year}-${month}-${day}T${hours}:${minutes}`;
                    }

                } catch (e) {
                    console.warn("No existing EXIF or error parsing EXIF:", e);
                    messageDiv.textContent = 'No existing EXIF data found or unable to parse.';
                    // Set to current local time if no EXIF or error
                    const now = new Date();
                    const year = now.getFullYear();
                    const month = (now.getMonth() + 1).toString().padStart(2, '0');
                    const day = now.getDate().toString().padStart(2, '0');
                    const hours = now.getHours().toString().padStart(2, '0');
                    const minutes = now.getMinutes().toString().padStart(2, '0');
                    captureDateTimeInput.value = `${year}-${month}-${day}T${hours}:${minutes}`;
                }
            };
            reader.readAsDataURL(file);
        } else {
            currentFile = null;
            currentFileBase64 = null;
            imagePreview.src = '#';
            imagePreviewContainer.style.display = 'none';
            messageDiv.textContent = 'Please upload a valid JPEG image.';
            // Clear or set current date if invalid file
            captureDateTimeInput.value = '';
        }
        checkFormValidity();
    });

    // Check if both image and location are selected
    function checkFormValidity() {
        if (currentFile && selectedLat !== null && selectedLon !== null && captureDateTimeInput.value) {
            addExifButton.disabled = false;
        } else {
            addExifButton.disabled = true;
        }
    }

    // Add EXIF and Download
    addExifButton.addEventListener('click', async () => {
        if (!currentFile || !currentFileBase64 || selectedLat === null || selectedLon === null || !captureDateTimeInput.value) {
            messageDiv.textContent = 'Please upload an image, select a location, and set a date/time first.';
            return;
        }

        messageDiv.textContent = 'Processing image...';
        addExifButton.disabled = true;

        try {
            let exifObj;
            try {
                exifObj = piexif.load(currentFileBase64);
            } catch (e) {
                console.warn("No existing EXIF data, creating new:", e);
                exifObj = {
                    "0th": {}, "Exif": {}, "GPS": {}, "Interop": {},
                    "1st": {}, "thumbnail": null
                };
            }

            // --- Set Date and Time EXIF ---
            const captureDate = new Date(captureDateTimeInput.value);
            // Format for EXIF: "YYYY:MM:DD HH:MM:SS"
            const exifDateTime = captureDate.getFullYear() + ":" +
                                 (captureDate.getMonth() + 1).toString().padStart(2, '0') + ":" +
                                 captureDate.getDate().toString().padStart(2, '0') + " " +
                                 captureDate.getHours().toString().padStart(2, '0') + ":" +
                                 captureDate.getMinutes().toString().padStart(2, '0') + ":" +
                                 captureDate.getSeconds().toString().padStart(2, '0');

            exifObj["0th"][piexif.ImageIFD.DateTime] = exifDateTime; // Date/Time of image creation
            exifObj.Exif[piexif.ExifIFD.DateTimeOriginal] = exifDateTime; // Date/Time when original image was taken
            exifObj.Exif[piexif.ExifIFD.DateTimeDigitized] = exifDateTime; // Date/Time when image was stored as digital data

            // --- Set Pixel 8 Camera EXIF Profile (Representative Values) ---
            exifObj["0th"][piexif.ImageIFD.Make] = "Google";
            exifObj["0th"][piexif.ImageIFD.Model] = "Pixel 8";
            exifObj["0th"][piexif.ImageIFD.Orientation] = 1; // Top-left orientation (normal)
            exifObj["0th"][piexif.ImageIFD.ResolutionUnit] = 2; // Inches
            exifObj["0th"][piexif.ImageIFD.XResolution] = [72, 1]; // 72 dpi
            exifObj["0th"][piexif.ImageIFD.YResolution] = [72, 1]; // 72 dpi
            exifObj["0th"][piexif.ImageIFD.Software] = "Google Camera"; // Or "Google Photos" if post-processed

            // Exif IFD Tags (Common for smartphones, realistic but may vary)
            exifObj.Exif[piexif.ExifIFD.ColorSpace] = 1; // sRGB
            exifObj.Exif[piexif.ExifIFD.ExifVersion] = "0232"; // Exif Version 2.32
            exifObj.Exif[piexif.ExifIFD.FlashpixVersion] = "0100"; // Flashpix Version 1.0
            exifObj.Exif[piexif.ExifIFD.ComponentsConfiguration] = "\x01\x02\x03\x00"; // YCbCr
            exifObj.Exif[piexif.ExifIFD.ExposureProgram] = 2; // Normal program
            exifObj.Exif[piexif.ExifIFD.MeteringMode] = 5; // Pattern (Multi-segment)
            exifObj.Exif[piexif.ExifIFD.LightSource] = 0; // Unknown
            exifObj.Exif[piexif.ExifIFD.FNumber] = [18, 10]; // f/1.8 (common for Pixel main lens)
            exifObj.Exif[piexif.ExifIFD.ApertureValue] = [169, 100]; // Equivalent to f/1.8
            exifObj.Exif[piexif.ExifIFD.FocalLength] = [690, 100]; // Approx 6.9mm for Pixel 8 main lens
            exifObj.Exif[piexif.ExifIFD.FocalLengthIn35mmFilm] = 25; // Approx 25mm equivalent
            exifObj.Exif[piexif.ExifIFD.ISOSpeedRatings] = [80]; // Example ISO, varies
            exifObj.Exif[piexif.ExifIFD.ExposureBiasValue] = [0, 100]; // 0 EV
            exifObj.Exif[piexif.ExifIFD.WhiteBalance] = 0; // Auto white balance
            exifObj.Exif[piexif.ExifIFD.Saturation] = 0; // Normal
            exifObj.Exif[piexif.ExifIFD.Sharpness] = 0; // Normal
            exifObj.Exif[piexif.ExifIFD.SceneCaptureType] = 0; // Standard
            exifObj.Exif[piexif.ExifIFD.DigitalZoomRatio] = [0, 1]; // No digital zoom
            exifObj.Exif[piexif.ExifIFD.Gamma] = [22, 10]; // Typical gamma 2.2

            // Note: Pixel dimensions (PixelXDimension, PixelYDimension) are read from the JPEG itself by piexif.insert()
            // and don't need to be explicitly set here.

            // --- Set GPS EXIF ---
            const latDMS = decimalToExifDMS(selectedLat, 'lat');
            const lonDMS = decimalToExifDMS(selectedLon, 'lon');

            exifObj.GPS[piexif.GPSIFD.GPSVersionID] = [2, 0, 0, 0];
            exifObj.GPS[piexif.GPSIFD.GPSLatitudeRef] = latDMS.ref;
            exifObj.GPS[piexif.GPSIFD.GPSLatitude] = [latDMS.d, latDMS.m, latDMS.s];
            exifObj.GPS[piexif.GPSIFD.GPSLongitudeRef] = lonDMS.ref;
            exifObj.GPS[piexif.GPSIFD.GPSLongitude] = [lonDMS.d, lonDMS.m, lonDMS.s];
            exifObj.GPS[piexif.GPSIFD.GPSAltitudeRef] = 0; // Above sea level
            exifObj.GPS[piexif.GPSIFD.GPSAltitude] = [0, 1]; // Assuming 0 altitude for simplicity (or actual if available)
            
            // GPS Date and Time Stamp
            const gpsDate = captureDate.getUTCFullYear() + ":" +
                            (captureDate.getUTCMonth() + 1).toString().padStart(2, '0') + ":" +
                            captureDate.getUTCDate().toString().padStart(2, '0');
            const gpsTime = [
                [captureDate.getUTCHours(), 1],
                [captureDate.getUTCMinutes(), 1],
                [captureDate.getUTCSeconds(), 1]
            ];
            exifObj.GPS[piexif.GPSIFD.GPSDateStamp] = gpsDate;
            exifObj.GPS[piexif.GPSIFD.GPSTimeStamp] = gpsTime;


            // Dump the EXIF object to bytes
            const exifbytes = piexif.dump(exifObj);

            // Insert the EXIF bytes into the original image's base64 string
            const newJpegBase64 = piexif.insert(exifbytes, currentFileBase64);

            // Convert the new base64 JPEG to a Blob
            const blob = dataURLtoBlob(newJpegBase64, 'image/jpeg');

            // Use FileSaver.js to prompt download
            saveAs(blob, `pixel8_geotagged_${currentFile.name}`);

            messageDiv.textContent = 'EXIF data added successfully! Your image is downloading.';

        } catch (error) {
            messageDiv.textContent = `Error adding EXIF data: ${error.message}`;
            console.error('EXIF processing error:', error);
        } finally {
            addExifButton.disabled = false;
        }
    });

    // Event listener for date input change to re-check form validity
    captureDateTimeInput.addEventListener('change', checkFormValidity);

    // Initial map load and form validity check
    initializeMap();
    checkFormValidity();
    // Set default date to current date and time
    const now = new Date();
    const year = now.getFullYear();
    const month = (now.getMonth() + 1).toString().padStart(2, '0');
    const day = now.getDate().toString().padStart(2, '0');
    const hours = now.getHours().toString().padStart(2, '0');
    const minutes = now.getMinutes().toString().padStart(2, '0');
    captureDateTimeInput.value = `${year}-${month}-${day}T${hours}:${minutes}`;
});