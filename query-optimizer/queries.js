// Setup
db.party.aggregate([{$sample: {size: 8000}}, {$project: {_id: 0, partyID: 1}}, {$out: "partyIDs"}])

var partyIDs = db.partyIDs.aggregate([{$group: {_id: null, partyID: {$push: "$partyID"}}}, {$project: {_id: 0}}]).toArray()[0]['partyID']



// Query

const start = new Date();
db.party.aggregate([{ $match: { partyID: { $in: partyIDs } } }]).itcount()
const end = new Date();
const elapsed = end - start;
console.log(`Elapsed time: ${elapsed} milliseconds`);



// Create Index

db.party.createIndex({"partyID": 1})



// Execution Stats

db.party.aggregate([{ $match: { partyID: { $in: partyIDs } } }]).explain("executionStats")

db.party.aggregate([{ $match: { partyID: { $in: partyIDs } } }]).explain("executionStats")['queryPlanner']

db.party.aggregate([{ $match: { partyID: { $in: partyIDs } } }]).explain("executionStats")['executionStats']



// Project Relevant Values Only

const start = new Date();
db.party.aggregate([{ $match: { partyID: { $in: partyIDs } } }, {$project: {partyID: 1}}]).itcount()
const end = new Date();
const elapsed = end - start;
console.log(`Elapsed time: ${elapsed} milliseconds`);



// Projection Covered

const start = new Date();
db.party.aggregate([{ $match: { partyID: { $in: partyIDs } } }, {$project: {_id: 0, partyID: 1}}]).itcount()
const end = new Date();
const elapsed = end - start;
console.log(`Elapsed time: ${elapsed} milliseconds`);


db.party.aggregate([{ $match: { partyID: { $in: partyIDs } } }, {$project: {_id: 0, partyID: 1}}]).explain("executionStats")["executionStats"]



// On-Demand Materialized View

updateMaterializedView = function() {
    db.party.aggregate( [
        { $match: { partyID: { $in: partyIDs } } },
        { $project: {_id: 0, partyID: 1}},
        { $merge: { into: "partyView", whenMatched: "replace" } }
    ] );
};

const start = new Date();
db.partyView.find();
const end = new Date();
const elapsed = end - start;
console.log(`Elapsed time: ${elapsed} milliseconds`);
