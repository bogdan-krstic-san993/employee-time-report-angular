# Employee Time Report

Angular application displaying employee working hours in a sorted table and a pie chart.

## Features

- Loads API data automatically on startup.
- Groups entries by employee and sorts total hours in descending order.
- Excludes deleted entries, blank names, invalid dates, and intervals ending before they start.
- Highlights employees with fewer than 100 hours.
- Displays chart percentages and supports PNG download.

## Requirements

Node.js and npm. Developed with Node.js 26.13.0 and npm 11.20.0.
The assignment API URL and key are included in `src/environments/environment.ts` for evaluation.
A global Angular CLI installation is not required.

## Run locally

1. Clone this repository and open a terminal in the project folder.
2. Install dependencies:

   ```bash
   npm install
   ```

3. Start the application:

   ```bash
   npm start
   ```

4. Open http://localhost:4200. Data loads automatically. Keep the terminal running; use Ctrl+C to stop the server.

No additional configuration is needed while the supplied assignment API key remains valid. To use another key or API URL, update `src/environments/environment.ts`.

## Production build

Build the application:

```bash
npm run build
```

Output: `dist/employee-time-report/`.

## Tests

```bash
npm test -- --watch=false
```

## Project structure

- `src/app/models/` - API entries and employee totals.
- `src/app/services/time-entry.ts` - API access, validation, grouping, and hour calculation.
- `src/app/app.ts` - data loading, chart creation, and PNG download.
- `src/app/app.html` - table and chart canvas.
- `src/app/app.css` - report styling.
- `src/environments/environment.ts` - assignment API configuration.
- `src/environments/environment.example.ts` - configuration template.

Built with Angular, TypeScript, RxJS, and Chart.js.
