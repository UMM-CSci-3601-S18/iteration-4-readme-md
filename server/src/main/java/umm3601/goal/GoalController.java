package umm3601.goal;

import com.google.gson.Gson;
import com.mongodb.MongoException;
import com.mongodb.client.FindIterable;
import com.mongodb.client.MongoCollection;
import com.mongodb.client.MongoDatabase;
import com.mongodb.util.JSON;
import org.bson.Document;
import org.bson.types.ObjectId;
import umm3601.SuperController;

import java.util.Iterator;
import java.util.Map;

import static com.mongodb.client.model.Filters.eq;

public class GoalController extends SuperController{

    /**
     * Construct a controller for goals.
     *
     * @param database the database containing goals data
     */
    public GoalController(MongoDatabase database) {
        gson = new Gson();
        this.database = database;
        collection = database.getCollection("goals");
    }

    // these are no longer used because this inherits methods from the supercontroller
//    public String getGoal(String id) {
//
//        FindIterable<Document> jsonGoals
//            = goalsCollection
//            .find(eq("_id", new ObjectId(id)));
//
//        Iterator<Document> iterator = jsonGoals.iterator();
//        if (iterator.hasNext()) {
//            Document goal = iterator.next();
//            return goal.toJson();
//        } else {
//            // We didn't find the desired Goal
//            return null;
//        }
//    }
//
//
//    public String getGoals(Map<String, String[]> queryParams) {
//        Document filterDoc = new Document();
//
//        if (queryParams.containsKey("owner")) {
//            String targetOwner = (queryParams.get("owner")[0]);
//            filterDoc = filterDoc.append("owner", targetOwner);
//        }
//
//        FindIterable<Document> matchingGoals = goalsCollection.find(filterDoc);
//
//
//
//
//        return JSON.serialize(matchingGoals);
//    }


    public String addNewGoal(String purpose, String category, String name , Boolean status, String userId) {

        Document newGoal = new Document();
        newGoal.append("purpose", purpose);
        newGoal.append("category", category);
        newGoal.append("name", name);
        newGoal.append("status", status);
        newGoal.append("userId", userId);




        try {
            collection.insertOne(newGoal);

            ObjectId id = newGoal.getObjectId("_id");
            System.err.println("Successfully added new goal [_id=" + id + ", purpose=" + purpose + ", category=" + category + ", name=" + name +
                ", userId=" + userId + ']');

            return JSON.serialize(id);
        } catch(MongoException me) {
            me.printStackTrace();
            return null;
        }
    }
    public String editGoal(String id, String purpose, String category, String name, Boolean status){
        System.out.println("Right here again");
        Document newGoal = new Document();
        newGoal.append("purpose", purpose);
        newGoal.append("category", category);
        newGoal.append("name", name);
        newGoal.append("status", true);
        Document setQuery = new Document();
        setQuery.append("$set", newGoal);

        Document searchQuery = new Document().append("_id", new ObjectId(id));

        System.out.println(id);
        try {
            collection.updateOne(searchQuery, setQuery);
            ObjectId id1 = searchQuery.getObjectId("_id");
            System.err.println("Successfully updated goal [_id=" + id1 + ", purpose=" + purpose +
                ", category=" + category + ", name=" + name + ", status=" + status + ']');
            return JSON.serialize(id1);
        } catch(MongoException me) {
            me.printStackTrace();
            return null;
        }
    }

    public void deleteGoal(String id){
        Document searchQuery = new Document().append("_id", new ObjectId(id));

        try {
            collection.deleteOne(searchQuery);
            ObjectId id1 = searchQuery.getObjectId("_id");
            System.out.println("Succesfully deleted goal " + id1);

        } catch(MongoException me) {
            me.printStackTrace();
            System.out.println("error");
        }
    }

}



