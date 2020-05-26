const us = await getAllUsers();
for (const u of us) {
    updateValueForUser(u._id, "taxDMs", true);
    updateValueForUser(u._id, "income", 0, "$set");
    addClientState(u._id, {
        name: "test",
        resources: {
            food: 0,
            oil: 0,
            steel: 0,
            population: 0,
            money: 0
        },
        loyalty: 1,
        upgrades: {
            mines: 0,
            rigs: 0,
            farms: 0
        },
        focus: null
    });
    deleteClientState(u._id, "test");
    updateValueForUser(u._id, "hospitals", 0, "$set");
}

const as = await getAllAlliances();
for (const a of as) {
    updateValueForAlliance(a.name, "clientStates", 0, "$set");
}