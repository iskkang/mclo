const axios = require('axios');

async function fetchAndExtractData(url) {
    try {
        const response = await axios.get(url, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
            }
        });

        if (response.status === 200) {
            const data = response.data;

            if ('features' in data) {
                const extractedData = [];
                for (const feature of data.features) {
                    if (typeof feature === 'object') {
                        const geometry = feature.geometry?.coordinates || null;
                        const properties = feature.properties || {};
                        const alertlevel = properties.alertlevel || null;
                        const country = properties.country || null;
                        const datemodified = properties.datemodified || null;
                        const description = properties.description || null;
                        const htmldescription = properties.htmldescription || null;
                        const iconoverall = properties.iconoverall || null;
                        const url_report = properties.url?.report || null;

                        extractedData.push({
                            coord: geometry,
                            level: alertlevel,
                            country: country,
                            Date: datemodified,
                            name: description,
                            title: htmldescription,
                            icon: iconoverall,
                            report: url_report,
                        });
                    }
                }
                return extractedData;
            } else {
                console.log("No 'features' key found in the response data.");
                return [];
            }
        } else {
            console.log(`Failed to retrieve data: ${response.status}`);
            return [];
        }
    } catch (error) {
        console.error('Error:', error);
        return [];
    }
}

module.exports = fetchAndExtractData;
