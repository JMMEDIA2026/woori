const fs = require('fs');
let code = fs.readFileSync('src/components/DashboardHome.tsx', 'utf-8');

const overviewStart = code.indexOf('{/* Overview Stats */}');
const overviewEnd = code.indexOf('</section>', overviewStart) + 10;

const coreValuesStart = code.indexOf('{/* Core Values Section */}');
const coreValuesEnd = code.indexOf('</section>', coreValuesStart) + 10;

const coreValuesCode = code.slice(coreValuesStart, coreValuesEnd);

// Remove Core Values from the bottom
code = code.slice(0, coreValuesStart) + code.slice(coreValuesEnd);

// Replace Overview Stats with Core Values
code = code.slice(0, overviewStart) + coreValuesCode + code.slice(overviewEnd);

fs.writeFileSync('src/components/DashboardHome.tsx', code);
