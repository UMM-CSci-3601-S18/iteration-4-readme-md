package umm3601.user;

import com.google.gson.Gson;
import com.mongodb.*;
import com.mongodb.client.FindIterable;
import com.mongodb.client.MongoCollection;
import com.mongodb.client.MongoDatabase;
import com.mongodb.util.JSON;
import org.bson.Document;
import org.bson.types.ObjectId;

import umm3601.SuperController;

import java.util.Iterator;
import java.util.Map;

import java.util.Date;

import static com.mongodb.client.model.Filters.eq;

public class UserController {

    private final Gson gson;
    private MongoDatabase database;
    // userCollection is the collection that the users data is in.
    private final MongoCollection<Document> userCollection;

    // Construct controller for user.
    public UserController(MongoDatabase database) {
        gson = new Gson();
        this.database = database;
        userCollection = database.getCollection("users");
    }

    public String addNewUser(String SubjectID, String FirstName, String LastName) {

        Document filterDoc = new Document();

        // make sure the user has not already been created

        filterDoc = filterDoc.append("SubjectID", SubjectID);

        FindIterable<Document> matchingUsers = userCollection.find(filterDoc);

        // create a new user object if none found
        if(JSON.serialize(matchingUsers).equals("[ ]")){
            ObjectId id = new ObjectId();

            Document newUser = new Document();
            newUser.append("_id", id);
            newUser.append("SubjectID", SubjectID);
            newUser.append("FirstName", FirstName);
            newUser.append("LastName", LastName);

            try {
                userCollection.insertOne(newUser);
                System.err.println("Successfully added new user [_id=" + id + ", SubjectID=" + SubjectID + " FirstName=" + FirstName + " LastName=" + LastName + ']');
                // return JSON.serialize(newUser);
                return JSON.serialize(id);
            } catch(MongoException me) {
                me.printStackTrace();
                return null;
            }
        } else {
            // assumes there will only be 1 user returned
            return JSON.serialize(matchingUsers.first().get("_id"));
        }

    }
}
