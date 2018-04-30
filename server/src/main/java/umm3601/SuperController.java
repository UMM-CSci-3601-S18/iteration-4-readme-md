package umm3601;

import com.google.gson.Gson;
import com.mongodb.MongoClient;
import com.mongodb.MongoException;
import com.mongodb.client.FindIterable;
import com.mongodb.client.MongoCollection;
import com.mongodb.client.MongoDatabase;
import com.mongodb.util.JSON;
import org.bson.Document;
import org.bson.types.ObjectId;
import java.util.Iterator;
import java.util.Map;

import static com.mongodb.client.model.Filters.eq;

public abstract class SuperController {
    protected Gson gson;
    protected MongoDatabase database;
    protected MongoCollection<Document> collection;

    public SuperController(){
        gson = null;
        database = null;
        collection = null;
    }


    public String getItem(String id) {

        FindIterable<Document>  jsonObjects
            = collection
            .find(eq("_id", new ObjectId(id)));

        Iterator<Document> iterator = jsonObjects.iterator();
        if (iterator.hasNext()) {
            Document item = iterator.next();
            return item.toJson();
        } else {
            // We didn't find the desired item
            return null;
        }
    }

    public String getItems(Map<String, String[]> queryParams) {
        Document filterDoc = new Document();

        if (queryParams.containsKey("email")) {
            String targetEmail = (queryParams.get("email")[0]);
            filterDoc = filterDoc.append("email", targetEmail);
        }

        if (queryParams.containsKey("userId")) {
            String targetUserId = (queryParams.get("userId")[0]);
            filterDoc = filterDoc.append("userId", targetUserId);
        }
        else {
            System.out.println("It had no userID");
            String[] arr = {};
            return JSON.serialize(arr);
        }

        if (queryParams.containsKey("subject")) {
            String targetContent = (queryParams.get("subject")[0]);
            Document contentRegQuery = new Document();
            contentRegQuery.append("$regex", targetContent);
            contentRegQuery.append("$options", "i");
            filterDoc = filterDoc.append("subject", contentRegQuery);        }

        if (queryParams.containsKey("body")) {
            String targetContent = (queryParams.get("body")[0]);
            Document contentRegQuery = new Document();
            contentRegQuery.append("$regex", targetContent);
            contentRegQuery.append("$options", "i");
            filterDoc = filterDoc.append("body", contentRegQuery);
        }

        FindIterable<Document> matchingItems = collection.find(filterDoc);

        return JSON.serialize(matchingItems);
    }
}
