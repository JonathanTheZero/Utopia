
const r = await getAllUsers();
for (const m of r) {
    updateValueForUser(m._id, "totaldigs", 0, "$set");
    updateValueForUser(m._id, "minereset", 0, "$set");
    updateValueForUser(m._id, "lastMine", 0, "$set");
    updateValueForUser(m._id, "minereturn", 0, "$set");
    updateValueForUser(m._id, "oil", 0, "$set");
    updateValueForUser(m._id, "steel", 0, "$set");
    updateValueForUser(m._id, "steelmine", 0, "$set");
    updateValueForUser(m._id, "lastDig", 0, "$set");
    updateValueForUser(m._id, "oilrig", 0, "$set");
}