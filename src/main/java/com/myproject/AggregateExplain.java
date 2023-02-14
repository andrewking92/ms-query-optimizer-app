package com.myproject;

import static com.mongodb.client.model.Filters.eq;

import org.bson.Document;
import java.util.*;

import com.mongodb.client.MongoClient;
import com.mongodb.client.MongoClients;
import com.mongodb.client.MongoCollection;
import com.mongodb.client.MongoDatabase;
import com.mongodb.client.model.Aggregates;
import com.mongodb.ExplainVerbosity;


public class AggregateExplain {
    public static void main( String[] args ) {

        // Replace the placeholder with your MongoDB deployment's connection string
        String uri = "";

        try (MongoClient mongoClient = MongoClients.create(uri)) {
            MongoDatabase database = mongoClient.getDatabase("ms_test");

            MongoCollection<Document> collection = database.getCollection("party");

            Document explanation = collection.aggregate(
                Arrays.asList(
                        Aggregates.match(eq("partyID", "BC-854765140862566414"))
                )
            ).explain(ExplainVerbosity.EXECUTION_STATS);
            
            List<Document> stages = explanation.get("stages", List.class);
            List<String> keys = Arrays.asList("queryPlanner", "winningPlan");

            for (Document stage : stages) {
                Document cursorStage = stage.get("$cursor", Document.class);
                if (cursorStage != null) {
                    System.out.println(cursorStage.getEmbedded(keys, Document.class).toJson());
                }
            }
        }
    }
}
