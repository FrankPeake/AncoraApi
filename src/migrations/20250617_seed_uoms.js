import db from '../config/db.js';

// Define a list of common cooking units of measurement
const uomsData = [
    { name: "grams" },
    { name: "kilograms" },
    { name: "milliliters" },
    { name: "liters" },
    { name: "teaspoon" },
    { name: "tablespoon" },
    { name: "cup" },
    { name: "fluid ounce" },
    { name: "pint" },
    { name: "quart" },
    { name: "gallon" },
    { name: "ounce" },
    { name: "pound" },
    { name: "dash" },
    { name: "pinch" },
    { name: "clove" }, // For garlic, etc.
    { name: "stalk" }, // For celery, green onions
    { name: "leaf" },
    { name: "sprig" },
    { name: "slice" },
    { name: "piece" },
    { name: "can" },
    { name: "package" },
    { name: "unit" }, // For generic items like "1 unit of chicken"
    { name: "dozen" },
    { name: "half" },
    { name: "quarter" },
    { name: "whole" },
    { name: "to taste" }, // For seasonings
    { name: "bunch" },
    { name: "head" }, // For lettuce, cabbage
    { name: "wedge" },
    { name: "bottle" },
    { name: "jar" },
    { name: "box" },
    { name: "bag" },
    { name: "sheet" }, // For pasta, nori
    { name: "medium" }, // For size descriptors like "1 medium onion"
    { name: "small" },
    { name: "large" }
];

export async function up() {
    try {
        console.log('Starting migration: Seeding UoMs table...');
        let insertedCount = 0;
        let skippedCount = 0;

        for (const uom of uomsData) {
            const { name } = uom;
            // Insert into the UoMs table.
            // ON CONFLICT (name) DO NOTHING prevents insertion if the unit already exists.
            const query = `
                INSERT INTO UoMs (name)
                VALUES ($1)
                ON CONFLICT (name) DO NOTHING;
            `;
            const result = await db.query(query, [name]);

            if (result.rowCount > 0) {
                insertedCount++;
            } else {
                skippedCount++; // Name already exists
            }
        }
        console.log(`Successfully inserted ${insertedCount} units of measure. Skipped ${skippedCount} existing units.`);
    } catch (error) {
        console.error('Error seeding UoMs table:', error);
        throw error;
    }
}

export async function down() {
    try {
        console.log('Starting rollback migration: Removing seeded UoMs...');
        let deletedCount = 0;
        for (const uom of uomsData) {
            const { name } = uom;
            // Delete the unit from the UoMs table based on its name.
            const query = `
                DELETE FROM UoMs
                WHERE name = $1;
            `;
            const result = await db.query(query, [name]);
            if (result.rowCount > 0) {
                deletedCount++;
            }
        }
        console.log(`Successfully deleted ${deletedCount} units of measure.`);
    } catch (error) {
        console.error('Error reverting UoMs seed:', error);
        throw error;
    }
}

// If you run this file directly for testing, uncomment the following line:
up();
