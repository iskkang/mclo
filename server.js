const express = require('express');
const app = express();
const path = require('path');

// Serve static files (HTML, CSS, JS) from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on https://port-0-mclo-lysc4ja0acad2542.sel4.cloudtype.app:${PORT}`);
});
