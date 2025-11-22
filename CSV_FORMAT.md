# 📊 CSV File Format Guide

## Required Column Names (Exact Match Required)

Your CSV file named "finall.csv" must contain these exact column names in the first row:

| Column Name   | Data Type | Description                    | Example Value    |
|---------------|-----------|--------------------------------|------------------|
| `timestamp`   | String    | ISO timestamp string           | 2025-11-21T05:37:45.062Z |
| `ActivePowerL3` | Number  | Active power measurement (W)   | 61.848423        |
| `CurrentL3`   | Number    | Current measurement (A)        | 0.501674175      |
| `VoltageL3`   | Number    | Voltage measurement (V)        | 213.5330505      |
| `IRRADIATION` | Number    | Solar irradiation (W/m²)       | 0                |
| `temp`        | Number    | Temperature (°C)               | 24               |

## Sample CSV Structure

```
timestamp,ActivePowerL3,CurrentL3,VoltageL3,IRRADIATION,temp
2025-11-21T05:37:45.062Z,61.848423,0.501674175,213.5330505,0,24
2025-11-21T05:37:50.063Z,61.75533295,0.500325263,213.655899,0,24.06
2025-11-21T05:37:55.072Z,61.93828964,0.499524713,213.7580414,0,24.12
2025-11-21T05:38:00.078Z,61.94989395,0.500716925,213.674881,0,24.06
```

## Important Notes

1. **File Name**: Must be named exactly "finall.csv" (case-sensitive)
2. **Column Names**: Must match exactly (case-sensitive)
3. **First Row**: Should contain column headers
4. **Data Types**: Numbers should be numeric, not text
5. **File Format**: CSV format with comma separators
6. **File Location**: Place the CSV file in the project root directory

## Data Validation

The backend will:
- Look specifically for "finall.csv" in the project directory
- Parse numeric values and handle missing data (defaults to 0)
- Convert timestamps to ISO format if needed
- Log the number of data points loaded
- Show a sample data point in the console

## Troubleshooting

### "finall.csv file not found"
- Ensure your CSV file is named exactly "finall.csv" in the project root directory (same folder as server.js)
- Check file name spelling and case sensitivity

### "Error loading CSV file"
- Verify column names match exactly
- Check that numeric columns contain numbers, not text
- Ensure the file uses comma separators
- Make sure there are no extra spaces or special characters

### Data appears as zeros
- Check that your CSV columns contain numeric data
- Verify column names are spelled correctly
- Look at the server console for parsing errors
