package com.myproject;

import static com.mongodb.client.model.Filters.eq;

import org.bson.Document;

import com.mongodb.client.MongoClient;
import com.mongodb.client.MongoClients;
import com.mongodb.client.MongoCollection;
import com.mongodb.client.MongoDatabase;
import com.mongodb.client.model.Aggregates;


public class QuickStart {
    public static void main( String[] args ) {

        // Replace the placeholder with your MongoDB deployment's connection string
        String uri = "";

        try (MongoClient mongoClient = MongoClients.create(uri)) {
            MongoDatabase database = mongoClient.getDatabase("ms_test");

            MongoCollection<Document> collection = database.getCollection("party");

            collection.aggregate(
                Arrays.asList(
                    Aggregates.match(eq("partyID", "BC-854765140862566414"))
                )
            ).forEach(doc -> System.out.println(doc.toJson()));
        }
    }
}
